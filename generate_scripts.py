import json
import os

def generate_elai_scripts():
    """Generate video scripts for manual use with Elai.io"""
    
    # Load the chapters from the JSON file
    try:
        with open('video_chapters.json', 'r', encoding='utf-8') as f:
            chapters = json.load(f)
    except FileNotFoundError:
        print("❌ video_chapters.json not found. Please run agents.py first.")
        return
    
    # Create scripts directory
    os.makedirs('elai_scripts', exist_ok=True)
    
    print(f"🎬 Generating {len(chapters)} video scripts for Elai.io...")
    
    for chapter in chapters:
        chapter_num = chapter['chapter_number']
        title = chapter['title']
        script = chapter['video_script']
        
        # Create filename
        filename = f"elai_scripts/chapter_{chapter_num:02d}_{title.replace(':', '_').replace(' ', '_')[:30]}.txt"
        
        # Write script to file
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"Title: {title}\n")
            f.write(f"Duration: {chapter['estimated_duration']}\n")
            f.write(f"Word Count: {len(script.split())}\n")
            f.write("-" * 50 + "\n")
            f.write(script)
        
        print(f"✅ Created: {filename}")
    
    # Create a summary file
    summary_file = "elai_scripts/SUMMARY.md"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("# Elai.io Video Scripts Summary\n\n")
        f.write("## Instructions for Elai.io\n\n")
        f.write("1. Go to https://app.elai.io/\n")
        f.write("2. Sign in with your account\n")
        f.write("3. Click 'Create Video'\n")
        f.write("4. For each script file:\n")
        f.write("   - Copy the script text\n")
        f.write("   - Paste it into Elai.io's script editor\n")
        f.write("   - Choose presenter: lisa, john, sarah, mike, emma, david\n")
        f.write("   - Choose voice: en-US-JennyNeural, en-US-GuyNeural, en-GB-SoniaNeural\n")
        f.write("   - Set background and other settings\n")
        f.write("   - Generate the video\n\n")
        
        f.write("## Video Scripts\n\n")
        for chapter in chapters:
            chapter_num = chapter['chapter_number']
            title = chapter['title']
            duration = chapter['estimated_duration']
            word_count = len(chapter['video_script'].split())
            
            f.write(f"### Chapter {chapter_num}: {title}\n")
            f.write(f"- **Duration**: {duration}\n")
            f.write(f"- **Word Count**: {word_count}\n")
            f.write(f"- **Script File**: `chapter_{chapter_num:02d}_{title.replace(':', '_').replace(' ', '_')[:30]}.txt`\n\n")
    
    print(f"\n📁 All scripts saved to 'elai_scripts/' directory")
    print(f"📋 Summary created: {summary_file}")
    print(f"\n🎬 Next steps:")
    print(f"1. Open the 'elai_scripts/' folder")
    print(f"2. Copy each script text")
    print(f"3. Paste into Elai.io's web interface")
    print(f"4. Generate your videos!")

if __name__ == "__main__":
    generate_elai_scripts() 