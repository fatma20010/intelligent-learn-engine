import requests

def test_elai_api():
    """Test Elai.io API connectivity"""
    api_key = "Wb7Zxjzpcve3zIRbdoSW7s9mPwJEkhGM"
    url = "https://apis.elai.io/api/v1/videos"
    
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Simple test payload
    data = {
        "name": "Test Video",
        "script": {
            "type": "text",
            "input": "Hello, this is a test video."
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
    
    print("Testing Elai.io API connection...")
    print(f"URL: {url}")
    print(f"API Key: {api_key[:10]}...")
    
    try:
        # Try GET first to check if endpoint exists
        print("Testing GET request...")
        get_response = requests.get(url, headers=headers, timeout=30)
        print(f"GET Status: {get_response.status_code}")
        print(f"GET Response: {get_response.text[:500]}")
        
        # Try POST with different content type
        print("Testing POST request...")
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ API connection successful!")
            return True
        else:
            print(f"❌ API error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

if __name__ == "__main__":
    test_elai_api() 