import asyncio
import platform
import fitz  # For PDF reading (PyMuPDF)
from transformers import BartForConditionalGeneration, BartTokenizer  # For summarization
from elevenlabs.client import ElevenLabs  # For text-to-speech
import requests  # For D-ID API calls
import base64  # To encode audio for D-ID API

FPS = 60

# IngestAgent: Reads PDF
def ingest_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        
        # Find the actual start of educational content
        text = find_content_start(text)
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def find_content_start(text):
    """Find the actual start of educational content, skipping front matter"""
    lines = text.split('\n')
    start_index = 0
    
    # Look for the first occurrence of actual content
    for i, line in enumerate(lines):
        line_lower = line.strip().lower()
        
        # Skip if line is too short or contains administrative content
        if len(line.strip()) < 10:
            continue
            
        # Skip administrative patterns
        admin_patterns = [
            'public disclosure authorized',
            '© 2024 the world bank',
            'www.worldbank.org',
            'rights and permissions',
            'disclaimer',
            'acknowledgments',
            'preface',
            'abstract',
            'executive summary',
            'table of contents',
            'coverphoto',
            'istock',
            'getty images',
            'figure',
            'table',
            'box',
            'appendix',
            'references',
            'bibliography'
        ]
        
        if any(pattern in line_lower for pattern in admin_patterns):
            continue
        
        # Look for content indicators
        content_indicators = [
            'introduction',
            'chapter',
            '1.',
            '2.',
            '3.',
            '4.',
            '5.',
            'gold',
            'investing',
            'reserve',
            'asset',
            'financial',
            'market'
        ]
        
        if any(indicator in line_lower for indicator in content_indicators):
            start_index = i
            break
    
    # Return text from the content start
    return '\n'.join(lines[start_index:])

# ChapterExtractorAgent: Extracts chapters with titles from PDF text
def extract_chapters(text):
    if not text:
        return []
    
    # Split text into lines and look for chapter patterns
    lines = text.split('\n')
    chapters = []
    current_chapter = None
    current_content = []
    
    # Common chapter patterns
    chapter_patterns = [
        r'^CHAPTER\s+\d+',
        r'^Chapter\s+\d+',
        r'^\d+\.\s+[A-Z]',
        r'^[A-Z][A-Z\s]+$',  # All caps titles
        r'^\d+\.\s*[A-Z][a-z]',  # Numbered titles
    ]
    
    import re
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if this line looks like a chapter title
        is_chapter_title = False
        for pattern in chapter_patterns:
            if re.match(pattern, line):
                is_chapter_title = True
                break
        
        # Additional check for common chapter indicators
        if any(keyword in line.upper() for keyword in ['CHAPTER', 'SECTION', 'PART', 'UNIT']):
            is_chapter_title = True
        
        if is_chapter_title and len(line) < 100:  # Chapter titles are usually short
            # Save previous chapter if exists
            if current_chapter:
                chapters.append({
                    'title': current_chapter,
                    'content': '\n'.join(current_content).strip()
                })
            
            # Start new chapter
            current_chapter = line
            current_content = []
        else:
            # Add to current chapter content
            if current_chapter:
                current_content.append(line)
            else:
                # If no chapter found yet, this might be the beginning
                if not current_chapter and len(line) > 20:
                    current_chapter = "Introduction"
                    current_content.append(line)
    
    # Add the last chapter
    if current_chapter:
        chapters.append({
            'title': current_chapter,
            'content': '\n'.join(current_content).strip()
        })
    
    # If no chapters found, create a single chapter
    if not chapters:
        chapters.append({
            'title': "Document Content",
            'content': text[:2000] + "..." if len(text) > 2000 else text
        })
    
    return chapters

# VideoChapterGenerator: Creates video-ready chapters with 2-3 minute scripts
def create_video_chapters(text, max_chapters=10):
    if not text:
        return []
    
    # First, try to extract natural chapters
    natural_chapters = extract_chapters(text)
    
    # If we have too many chapters, merge them
    if len(natural_chapters) > max_chapters:
        # Merge chapters to get to max_chapters
        merged_chapters = []
        words_per_chapter = len(text.split()) // max_chapters
        
        current_chapter = {
            'title': f"Chapter 1: Introduction",
            'content': '',
            'words': 0
        }
        chapter_count = 1
        
        for chapter in natural_chapters:
            chapter_words = len(chapter['content'].split())
            
            if current_chapter['words'] + chapter_words <= words_per_chapter * 1.5 and chapter_count < max_chapters:
                # Merge into current chapter
                if current_chapter['content']:
                    current_chapter['content'] += '\n\n' + chapter['content']
                else:
                    current_chapter['content'] = chapter['content']
                    current_chapter['title'] = f"Chapter {chapter_count}: {chapter['title']}"
                current_chapter['words'] += chapter_words
            else:
                # Start new chapter
                if current_chapter['content']:
                    merged_chapters.append(current_chapter)
                    chapter_count += 1
                
                current_chapter = {
                    'title': f"Chapter {chapter_count}: {chapter['title']}",
                    'content': chapter['content'],
                    'words': chapter_words
                }
        
        # Add the last chapter
        if current_chapter['content']:
            merged_chapters.append(current_chapter)
        
        natural_chapters = merged_chapters
    
    # If we have too few chapters, split the content
    elif len(natural_chapters) < max_chapters:
        # Split content into more chapters
        total_words = len(text.split())
        words_per_chapter = total_words // max_chapters
        
        split_chapters = []
        words = text.split()
        
        for i in range(max_chapters):
            start_idx = i * words_per_chapter
            end_idx = (i + 1) * words_per_chapter if i < max_chapters - 1 else len(words)
            
            chapter_words = words[start_idx:end_idx]
            chapter_text = ' '.join(chapter_words)
            
            # Generate a title based on content
            title = generate_chapter_title(chapter_text, i + 1)
            
            split_chapters.append({
                'title': title,
                'content': chapter_text,
                'words': len(chapter_words)
            })
        
        natural_chapters = split_chapters
    
    # Convert to video-ready format
    video_chapters = []
    for i, chapter in enumerate(natural_chapters, 1):
        # Clean the content first
        cleaned_content = clean_content(chapter['content'])
        
        # Create a 2-3 minute video script (approximately 300-450 words for speaking)
        script = create_video_script(cleaned_content, chapter['title'])
        
        video_chapters.append({
            'chapter_number': i,
            'title': chapter['title'],
            'content': cleaned_content,  # Use cleaned content
            'video_script': script,
            'estimated_duration': f"{2 + (i % 2)} minutes"  # Alternate between 2-3 minutes
        })
    
    return video_chapters

def generate_chapter_title(content, chapter_num):
    """Generate a meaningful title based on chapter content"""
    # Extract key phrases from content
    words = content.split()
    if len(words) < 10:
        return f"Chapter {chapter_num}: Content Overview"
    
    # Look for key terms in the first 100 words
    key_terms = []
    for word in words[:100]:
        if word.isupper() and len(word) > 3:
            key_terms.append(word)
    
    if key_terms:
        return f"Chapter {chapter_num}: {key_terms[0]}"
    else:
        # Use first meaningful phrase
        for i, word in enumerate(words):
            if word[0].isupper() and len(word) > 4:
                return f"Chapter {chapter_num}: {word}"
    
    return f"Chapter {chapter_num}: Learning Module"

def clean_content(content):
    """Remove header/footer and administrative content from PDF text"""
    import re
    lines = content.split('\n')
    cleaned_lines = []
    
    # Skip common header/footer patterns
    skip_patterns = [
        'Public Disclosure Authorized',
        '© 2024 The World Bank',
        'www.worldbank.org',
        'Washington DC 20433',
        '202-473-1000',
        'This work is a product',
        'staff of The World Bank',
        'ASSET MANAGERS',
        'Kamol Alimukhamedov',
        'HANDBOOK FOR',
        'GOLD INVESTING',
        'ii |',
        'i |',
        'iii |',
        'iv |',
        'v |',
        'vi |',
        'vii |',
        'viii |',
        'ix |',
        'x |',
        'Page',
        'page',
        'Table of Contents',
        'Contents',
        'Acknowledgments',
        'Preface',
        'Abstract',
        'Executive Summary',
        'Rights and Permissions',
        'Coverphoto',
        'iStock',
        'Getty Images',
        'findings, interpretations, and conclusions',
        'do not necessarily reflect the views',
        'Board of Executive Directors',
        'does not guarantee the accuracy',
        'does not assume responsibility',
        'Any queries on rights and licenses',
        'World Bank Publications',
        'fax: 202-522-2625',
        'pubrights@worldbank.org',
        'This note benefited from comments',
        'Keyvan Alekasir',
        'Guilherme Pereira Alves',
        'Inga Aristakesyan',
        'Eric Bouyé',
        'Marco Ruiz Gil',
        'Carmen Herrero Montes',
        'Jerome Teiletche',
        '1818 H Street NW',
        'The material in this work is subject to copyright',
        'encourages dissemination of its knowledge',
        'full attribution to this work is given',
        'Figure',
        'figure',
        'Table',
        'table',
        'Source:',
        'source:',
        'Note:',
        'note:',
        'Notes:',
        'notes:',
        'Box',
        'box',
        'Appendix',
        'appendix',
        'References',
        'references',
        'Bibliography',
        'bibliography',
        'Endnotes',
        'endnotes',
        'Footnotes',
        'footnotes'
    ]
    
    # Skip entire sections that contain administrative content
    skip_sections = [
        'disclaimer',
        'rights and permissions',
        'copyright',
        'acknowledgments',
        'preface',
        'abstract',
        'executive summary',
        'table of contents',
        'figures',
        'tables',
        'appendix',
        'references',
        'bibliography',
        'endnotes',
        'footnotes'
    ]
    
    current_section = ""
    skip_current_section = False
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if we're entering a section to skip
        line_lower = line.lower()
        for section in skip_sections:
            if section in line_lower:
                skip_current_section = True
                break
        
        # If we find a chapter or main content indicator, stop skipping
        if any(keyword in line_lower for keyword in ['chapter', 'introduction', '1.', '2.', '3.', '4.', '5.']):
            skip_current_section = False
            
        if skip_current_section:
            continue
            
        # Skip lines that match skip patterns
        should_skip = False
        for pattern in skip_patterns:
            if pattern.lower() in line_lower:
                should_skip = True
                break
        
        if should_skip:
            continue
            
        # Skip very short lines that are likely headers
        if len(line) < 5:
            continue
            
        # Skip lines that are just numbers or page numbers
        if line.isdigit() or line in ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']:
            continue
            
        # Skip lines that are mostly special characters or formatting
        if len(line.replace(' ', '').replace('.', '').replace(',', '').replace('-', '')) < 3:
            continue
            
        # Skip figure and table references
        if any(ref in line_lower for ref in ['figure', 'table', 'box']) and any(char.isdigit() for char in line):
            continue
            
        # Skip lines that are just figure/table numbers
        if re.match(r'^(Figure|Table|Box)\s+\d+', line, re.IGNORECASE):
            continue
            
        # Skip source lines
        if line_lower.startswith('source:') or line_lower.startswith('note:'):
            continue
            
        cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)

def create_video_script(content, title):
    """Create a 2-3 minute video script from chapter content"""
    # Clean the content first
    cleaned_content = clean_content(content)
    
    # Target: 300-450 words for 2-3 minutes of speaking
    words = cleaned_content.split()
    
    if len(words) <= 400:
        # Content is already short enough
        script = f"Welcome to {title}. "
        script += cleaned_content
        script += " Thank you for watching this chapter."
    else:
        # Summarize content to fit 2-3 minutes
        script = f"Welcome to {title}. "
        
        # Take first 200 words for introduction
        intro_words = words[:200]
        script += ' '.join(intro_words) + " "
        
        # Take key points from middle
        if len(words) > 400:
            middle_start = len(words) // 3
            middle_end = middle_start + 100
            middle_words = words[middle_start:middle_end]
            script += "Now let's look at some key points. " + ' '.join(middle_words) + " "
        
        # Take conclusion from end
        if len(words) > 300:
            end_words = words[-100:]
            script += "In conclusion, " + ' '.join(end_words)
        
        script += " Thank you for watching this chapter."
    
    return script

# ScriptAgent: Generates script from chapters
def generate_script(chapters):
    if not chapters:
        return "No chapters found to generate script from."
    
    script = "Course Overview:\n\n"
    for i, chapter in enumerate(chapters, 1):
        script += f"Chapter {i}: {chapter['title']}\n"
        # Add a brief description of the chapter content
        content_preview = chapter['content'][:200] + "..." if len(chapter['content']) > 200 else chapter['content']
        script += f"Content: {content_preview}\n\n"
    
    return script

# VoiceAgent: Generates speech audio
def generate_speech(script):
    client = ElevenLabs(api_key="sk_ebdc561ee49fd47cd1a98be1d49d76d10fde7542bef5f29f")
    audio = client.text_to_speech.convert(
        text=script,
        voice_id="repzAAjoKlgcT2oOAIWt",
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
    )
    return b"".join(audio)  # Collect all audio bytes into a single bytes object

# ElaiAvatarAgent: Generates talking avatar video using Elai.io
def generate_elai_avatar(script, chapter_title, chapter_number):
    """
    Generate video using Elai.io API
    You'll need to get your API key from https://app.elai.io/
    """
    api_key = "Wb7Zxjzpcve3zIRbdoSW7s9mPwJEkhGM"  # Your Elai.io API key
    url = "https://apis.elai.io/api/v1/videos"  # Create video endpoint
    
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Elai.io video creation payload
    data = {
        "name": f"Chapter {chapter_number}: {chapter_title}",
        "script": {
            "type": "text",
            "input": script
        },
        "config": {
            "format": "mp4",
            "resolution": "1080p",
            "quality": "high"
        },
        "presenter": {
            "presenter_id": "lisa"
        },
        "voice": {
            "provider": "microsoft",
            "voice_id": "en-US-JennyNeural"
        },
        "background": {
            "type": "color",
            "value": "#000000"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("API response:", result)  # Debug: print full API response
            video_id = result.get('id')
            print(f"✅ Elai video created for Chapter {chapter_number}: {chapter_title}")
            print(f"   Video ID: {video_id}")
            print(f"   Status: {result.get('status', 'N/A')}")
            
            # Automatically render and download the video
            if video_id:
                print(f"   🔄 Starting automatic render and download...")
                download_video_automatically(video_id, chapter_title, chapter_number, api_key)
            
            return result
        else:
            print(f"❌ Error generating Elai video for Chapter {chapter_number}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception generating Elai video for Chapter {chapter_number}: {e}")
        return None

def download_video_automatically(video_id, chapter_title, chapter_number, api_key):
    """Automatically render and download video to public folder"""
    import time
    import os
    
    # Create public folder if it doesn't exist
    public_folder = "public"
    if not os.path.exists(public_folder):
        os.makedirs(public_folder)
        print(f"   📁 Created {public_folder} folder")
    
    # Clean filename
    safe_title = "".join(c for c in chapter_title if c.isalnum() or c in (' ', '-', '_')).rstrip()
    filename = f"chapter_{chapter_number}_{safe_title}.mp4"
    filepath = os.path.join(public_folder, filename)
    
    print(f"   📥 Will save to: {filepath}")
    
    # Start rendering
    render_url = f"https://apis.elai.io/api/v1/videos/{video_id}/render"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        # Start the render process
        render_response = requests.post(render_url, headers=headers)
        if render_response.status_code == 200:
            print(f"   🔄 Render started for Chapter {chapter_number}")
            
            # Poll for completion
            max_attempts = 60  # 5 minutes with 5-second intervals
            attempts = 0
            
            while attempts < max_attempts:
                time.sleep(5)  # Wait 5 seconds between checks
                attempts += 1
                
                # Check video status
                status_url = f"https://apis.elai.io/api/v1/videos/{video_id}"
                status_response = requests.get(status_url, headers=headers)
                
                if status_response.status_code == 200:
                    video_data = status_response.json()
                    status = video_data.get('status', 'unknown')
                    
                    print(f"   ⏳ Status: {status} (attempt {attempts}/{max_attempts})")
                    
                    if status == 'ready':
                        # Download the video
                        download_url = video_data.get('download_url') or video_data.get('url')
                        if download_url:
                            print(f"   📥 Downloading video...")
                            video_response = requests.get(download_url)
                            
                            if video_response.status_code == 200:
                                with open(filepath, 'wb') as f:
                                    f.write(video_response.content)
                                print(f"   ✅ Video downloaded successfully: {filepath}")
                                return True
                            else:
                                print(f"   ❌ Failed to download video: {video_response.status_code}")
                                return False
                        else:
                            print(f"   ❌ No download URL found in video data")
                            return False
                    
                    elif status == 'failed':
                        print(f"   ❌ Video rendering failed")
                        return False
                    
                    elif status in ['rendering', 'processing']:
                        continue  # Keep waiting
                    
                    else:
                        print(f"   ⚠️ Unknown status: {status}")
                        continue
                else:
                    print(f"   ❌ Error checking status: {status_response.status_code}")
                    return False
            
            print(f"   ⏰ Timeout: Video took too long to render")
            return False
            
        else:
            print(f"   ❌ Failed to start render: {render_response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error in automatic download: {e}")
        return False

def check_elai_video_status(video_id, api_key):
    """Check the status of an Elai video generation"""
    url = f"https://apis.elai.io/api/v1/videos/{video_id}"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error checking video status: {response.text}")
            return None
    except Exception as e:
        print(f"Exception checking video status: {e}")
        return None

def configure_elai_settings():
    """Helper function to configure Elai.io settings"""
    print("\n🔧 Elai.io Configuration Guide:")
    print("1. Get your API key from: https://app.elai.io/")
    print("2. Replace 'YOUR_ELAI_API_KEY' in the generate_elai_avatar function")
    print("3. Available presenters: lisa, john, sarah, mike, emma, david")
    print("4. Available voices: en-US-JennyNeural, en-US-GuyNeural, en-GB-SoniaNeural")
    print("5. You can customize background, resolution, and other settings")
    print("\n📝 Current settings in the code:")
    print("   - Presenter: lisa")
    print("   - Voice: en-US-JennyNeural")
    print("   - Resolution: 1080p")
    print("   - Format: mp4")
    print("   - Background: Black (#000000)")

# CoordinatorAgent: Orchestrates the workflow
async def main():
    # Show Elai.io configuration guide
    configure_elai_settings()
    
    # Use relative path if PDF is in the same directory
    pdf_text = ingest_pdf("Gold.pdf")  # Adjust path if needed
    print(f"PDF text extracted: {pdf_text[:200]}...")  # Show first 200 chars to verify
    
    # Create video-ready chapters (max 10 chapters, 2-3 min each)
    video_chapters = create_video_chapters(pdf_text, max_chapters=10)
    print(f"\nCreated {len(video_chapters)} video chapters:")
    
    for chapter in video_chapters:
        print(f"\n{'='*60}")
        print(f"CHAPTER {chapter['chapter_number']}: {chapter['title']}")
        print(f"Duration: {chapter['estimated_duration']}")
        print(f"Content length: {len(chapter['content'])} characters")
        print(f"Script length: {len(chapter['video_script'].split())} words")
        print(f"{'='*60}")
        
        print(f"\n📖 CHAPTER CONTENT:")
        print(f"{'-'*40}")
        # Show first 500 characters of content
        content_preview = chapter['content'][:500] + "..." if len(chapter['content']) > 500 else chapter['content']
        print(content_preview)
        
        print(f"\n🎬 VIDEO SCRIPT:")
        print(f"{'-'*40}")
        print(chapter['video_script'])
        print(f"\n{'-'*60}")
    
    # Generate Elai.io videos for each chapter
    print(f"\n🎬 Generating Elai.io videos for {len(video_chapters)} chapters...")
    
    video_results = []
    downloaded_videos = []
    
    for i, chapter in enumerate(video_chapters, 1):
        print(f"\n🎬 Generating video for Chapter {i}: {chapter['title']}")
        print(f"   Script length: {len(chapter['video_script'].split())} words")
        
        try:
            # Generate video using Elai.io
            video_result = generate_elai_avatar(
                chapter['video_script'], 
                chapter['title'], 
                chapter['chapter_number']
            )
            
            if video_result:
                video_results.append({
                    'chapter_number': chapter['chapter_number'],
                    'title': chapter['title'],
                    'video_id': video_result.get('id'),
                    'status': video_result.get('status'),
                    'script': chapter['video_script']
                })
                print(f"   ✅ Video creation initiated for Chapter {i}")
            else:
                print(f"   ❌ Failed to create video for Chapter {i}")
                
        except Exception as e:
            print(f"   ❌ Error generating video for Chapter {i}: {e}")
    
    # Save chapters and video results to files
    import json
    with open('video_chapters.json', 'w', encoding='utf-8') as f:
        json.dump(video_chapters, f, indent=2, ensure_ascii=False)
    print(f"\n📁 Chapters saved to 'video_chapters.json' for easy review!")
    
    with open('elai_video_results.json', 'w', encoding='utf-8') as f:
        json.dump(video_results, f, indent=2, ensure_ascii=False)
    print(f"📁 Video results saved to 'elai_video_results.json'!")
    
    # Check for downloaded videos in public folder
    import os
    public_folder = "public"
    if os.path.exists(public_folder):
        downloaded_files = [f for f in os.listdir(public_folder) if f.endswith('.mp4')]
        if downloaded_files:
            print(f"\n🎬 DOWNLOADED VIDEOS in '{public_folder}' folder:")
            print("=" * 60)
            for file in sorted(downloaded_files):
                file_path = os.path.join(public_folder, file)
                file_size = os.path.getsize(file_path) / (1024 * 1024)  # Size in MB
                print(f"📹 {file} ({file_size:.1f} MB)")
            print("=" * 60)
        else:
            print(f"\n📁 '{public_folder}' folder exists but no videos downloaded yet.")
            print("   Videos may still be rendering...")
    else:
        print(f"\n📁 '{public_folder}' folder not found. Videos may still be processing...")
    
    print(f"\n🎬 Workflow finished! Created {len(video_results)} video generation requests.")
    print("📝 All videos will be automatically rendered and downloaded to the 'public' folder.")

if platform.system() == "Emscripten":
    asyncio.ensure_future(main())
else:
    if __name__ == "__main__":
        asyncio.run(main())