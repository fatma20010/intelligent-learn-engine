import requests

API_KEY = "Wb7Zxjzpcve3zIRbdoSW7s9mPwJEkhGM"
BASE_URL = "https://apis.elai.io/api/v1/videos"

headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def main():
    print("Fetching all videos from Elai.io...")
    resp = requests.get(BASE_URL, headers=headers)
    if resp.status_code != 200:
        print(f"Error fetching videos: {resp.status_code} {resp.text}")
        return
    data = resp.json()
    videos = data.get('videos', [])
    if not videos:
        print("No videos found.")
        return
    for i, video in enumerate(videos, 1):
        vid = video.get('_id') or video.get('id')
        name = video.get('name')
        status = video.get('status')
        print(f"\nVideo {i}:")
        print(f"  Name: {name}")
        print(f"  ID: {vid}")
        print(f"  Status: {status}")
        # Fetch details for download URL
        detail_url = f"{BASE_URL}/{vid}"
        detail_resp = requests.get(detail_url, headers=headers)
        if detail_resp.status_code == 200:
            detail = detail_resp.json()
            download_url = detail.get('download_url') or detail.get('url')
            print(f"  Download URL: {download_url if download_url else 'None'}")
        else:
            print(f"  Could not fetch details for video {vid}")

if __name__ == "__main__":
    main() 