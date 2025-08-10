import requests
import time
import os

API_KEY = "Wb7Zxjzpcve3zIRbdoSW7s9mPwJEkhGM"
BASE_URL = "https://apis.elai.io/api/v1/videos"
HEADERS = {
    "Accept": "application/json",
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

PUBLIC_FOLDER = "public"
if not os.path.exists(PUBLIC_FOLDER):
    os.makedirs(PUBLIC_FOLDER)
    print(f"Created '{PUBLIC_FOLDER}' folder.")

def clean_filename(name):
    return "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()

def render_and_download(video):
    vid = video.get('_id') or video.get('id')
    name = video.get('name', f'video_{vid}')
    print(f"\nProcessing: {name} (ID: {vid})")
    # Trigger render
    render_url = f"{BASE_URL}/{vid}/render"
    render_resp = requests.post(render_url, headers=HEADERS)
    if render_resp.status_code == 200:
        print("  🔄 Render started.")
    elif render_resp.status_code == 409:
        print("  🔄 Render already in progress or completed.")
    else:
        print(f"  ❌ Failed to start render: {render_resp.status_code} {render_resp.text}")
        return
    # Poll for ready status
    max_attempts = 60  # 5 minutes
    for attempt in range(1, max_attempts+1):
        time.sleep(5)
        status_resp = requests.get(f"{BASE_URL}/{vid}", headers=HEADERS)
        if status_resp.status_code != 200:
            print(f"  ❌ Error checking status: {status_resp.status_code}")
            continue
        status_data = status_resp.json()
        status = status_data.get('status')
        print(f"  ⏳ Status: {status} (attempt {attempt}/{max_attempts})")
        if status == 'ready':
            download_url = status_data.get('download_url') or status_data.get('url')
            if download_url:
                filename = clean_filename(name) + ".mp4"
                filepath = os.path.join(PUBLIC_FOLDER, filename)
                print(f"  📥 Downloading to {filepath} ...")
                video_resp = requests.get(download_url)
                if video_resp.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(video_resp.content)
                    print(f"  ✅ Downloaded: {filepath}")
                else:
                    print(f"  ❌ Failed to download video: {video_resp.status_code}")
            else:
                print("  ❌ No download URL found!")
            return
        elif status == 'failed':
            print("  ❌ Video rendering failed!")
            return
    print("  ⏰ Timeout: Video not ready after waiting.")

def main():
    print("Fetching all videos from Elai.io...")
    resp = requests.get(BASE_URL, headers=HEADERS)
    if resp.status_code != 200:
        print(f"Error fetching videos: {resp.status_code} {resp.text}")
        return
    videos = resp.json().get('videos', [])
    draft_videos = [v for v in videos if v.get('status') == 'draft']
    if not draft_videos:
        print("No draft videos found.")
        return
    print(f"Found {len(draft_videos)} draft videos. Starting render and download...")
    for video in draft_videos:
        render_and_download(video)
    print("\nAll done!")

if __name__ == "__main__":
    main() 