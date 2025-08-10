import requests
import json

def check_elai_videos():
    """Check your Elai.io videos and show where to find them"""
    
    api_key = "Wb7Zxjzpcve3zIRbdoSW7s9mPwJEkhGM"
    url = "https://apis.elai.io/api/v1/videos"
    
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            videos = response.json()
            print("🎬 Your Elai.io Videos:")
            print("=" * 50)
            
            if 'videos' in videos and videos['videos']:
                for i, video in enumerate(videos['videos'], 1):
                    print(f"\n📹 Video {i}:")
                    print(f"   Name: {video.get('name', 'N/A')}")
                    print(f"   ID: {video.get('_id', 'N/A')}")
                    print(f"   Status: {video.get('status', 'N/A')}")
                    print(f"   Created: {video.get('createdAt', 'N/A')}")
                    
                    # Check if video is ready
                    if video.get('status') == 'ready':
                        print(f"   ✅ Ready to download!")
                    elif video.get('status') == 'rendering':
                        print(f"   🔄 Currently rendering...")
                    elif video.get('status') == 'draft':
                        print(f"   📝 Draft - needs to be rendered")
                    else:
                        print(f"   ⏳ Status: {video.get('status')}")
            else:
                print("❌ No videos found in your account")
                
            print("\n" + "=" * 50)
            print("📍 WHERE TO FIND YOUR VIDEOS:")
            print("1. Go to: https://app.elai.io/")
            print("2. Sign in with your account")
            print("3. Click 'My Videos' or 'Projects'")
            print("4. Look for videos with names like 'Chapter 1: ASSET MANAGERS'")
            print("5. Click on each video to view/download")
            
            print("\n🎬 HOW TO RENDER DRAFT VIDEOS:")
            print("1. Go to https://app.elai.io/")
            print("2. Find videos with 'draft' status")
            print("3. Click on the video")
            print("4. Click 'Render' or 'Generate Video'")
            print("5. Wait for rendering to complete")
            print("6. Download the finished video")
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error checking videos: {e}")

if __name__ == "__main__":
    check_elai_videos() 