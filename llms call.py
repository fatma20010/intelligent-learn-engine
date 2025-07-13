import os
import json
import pyttsx3
import PyPDF2
from pathlib import Path
import requests
# --- Configuration ---
TOGETHER_API_KEY = "5a5d3ff7a2fbae72418501e22ced7935f285982c800882c7ba03e2e44e999025"
DOWNLOAD_DIR = str(Path.home() / "Downloads")
AVATAR_API_URL = "8a21ddf3b1a5c0c143b46a8cf5a7f22e8e947d0db18b3f92aa2ddf5b7f68e54a"

# --- Step 1: Read PDF and extract text ---
def read_pdf(file_path):
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        full_text = ''.join(page.extract_text() for page in reader.pages if page.extract_text())
    return full_text

# --- Step 2: Call Together.ai to get chapters, video scripts, and quizzes ---
def get_content_from_together_ai(text):
    prompt = (
        "You are an expert content creator. Given this full text, divide it into meaningful chapters, "
        "summarize each chapter in detail, write a complete video script for each, and prepare a quiz of 3 questions per chapter.\n\n"
        f"Text:\n{text}\n"
    )

    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "togethercomputer/llama-2-70b-chat",
        "prompt": prompt,
        "max_tokens": 4000,
        "temperature": 0.7
    }

    print("📡 Contacting Together.ai API...")

    
    response = requests.post("TOGETHER_API_KEY", headers=headers, json=body)
    data = response.json()

    # Simulated structured output
    data = {
        "chapters": [
            {
                "title": "Chapter 1: The Foundations of Space-Time",
                "summary": "This chapter introduces Einstein’s theory of relativity and the curvature of space-time, describing how gravity works not as a force but as a geometric distortion of space-time around mass.",
                "script": (
                    "Welcome to Chapter 1. In this chapter, we explore the foundational concept of space-time. "
                    "Albert Einstein revolutionized physics with the idea that space and time are interwoven into a single fabric, "
                    "which can be bent or curved by mass. We delve into how planets move not because they're pulled by gravity, "
                    "but because they follow curved paths in a warped space-time field..."
                ),
                "quiz": [
                    "What is space-time and how is it affected by mass?",
                    "How did Einstein's theory change our understanding of gravity?",
                    "Why do objects follow curved paths in space?"
                ]
            },
            {
                "title": "Chapter 2: Wormholes and Time Dilation",
                "summary": "This chapter dives into the concept of wormholes as shortcuts through space-time and explains how time dilation affects astronauts traveling at relativistic speeds.",
                "script": (
                    "In Chapter 2, we journey into the fascinating realm of wormholes and time dilation. "
                    "Imagine bending space so two distant points touch—this is the theory behind wormholes. "
                    "We also look at how astronauts on fast-moving spacecraft age slower than people on Earth, thanks to the effects of relativity. "
                    "Both concepts challenge our intuition but are supported by strong theoretical physics..."
                ),
                "quiz": [
                    "What is a wormhole and how might it work?",
                    "What is time dilation and why does it happen?",
                    "How does relativistic speed affect aging in space?"
                ]
            }
        ]
    }

    return data

# --- Step 3: Convert script text to audio for each chapter ---
def convert_to_audio(script_text, chapter_index):
    engine = pyttsx3.init()
    filename = f"chapter_{chapter_index+1}_audio.mp3"
    audio_path = os.path.join(DOWNLOAD_DIR, filename)
    engine.save_to_file(script_text, audio_path)
    engine.runAndWait()
    print(f"🔊 Saved audio to: {audio_path}")
    return audio_path

# --- Step 4: Integrate with avatar voice API (simulated setup) ---
def integrate_with_avatar(audio_path, chapter_title):
    payload = {
        "avatar_id": "realistic-avatar-01",
        "audio_url": audio_path,
        "subtitle": chapter_title
    }

   
    print(f"🎭 Avatar is speaking audio for: {chapter_title}")
    print(f"   [POST to {AVATAR_API_URL}]")
    response = requests.post(AVATAR_API_URL, json=payload)
    return response.json()
    return {"status": "success", "message": "Avatar is playing audio."}

# --- Main Orchestration Function ---
def process_pdf_to_video_lessons(pdf_path):
    print("📄 Extracting text from PDF...")
    text = read_pdf(pdf_path)

    print("🧠 Generating chapters, scripts, and quizzes...")
    content = get_content_from_together_ai(text)
    chapters = content.get("chapters", [])

    all_metadata = []

    for idx, chapter in enumerate(chapters):
        print(f"\n📚 Processing {chapter['title']}...")

        audio_path = convert_to_audio(chapter["script"], idx)
        avatar_response = integrate_with_avatar(audio_path, chapter["title"])

        metadata = {
            "chapter_title": chapter["title"],
            "summary": chapter["summary"],
            "quiz": chapter["quiz"],
            "audio_path": audio_path,
            "avatar_response": avatar_response
        }
        all_metadata.append(metadata)

    print("\n✅ All chapters processed and saved.")
    return all_metadata

# --- Run the whole flow ---
if __name__ == "__main__":
    file_path = "interstellar_notes.pdf"  # Replace with your PDF filename
    if os.path.exists(file_path):
        final_data = process_pdf_to_video_lessons(file_path)
        # Save metadata to JSON
        with open(os.path.join(DOWNLOAD_DIR, "chapters_metadata.json"), "w", encoding="utf-8") as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        