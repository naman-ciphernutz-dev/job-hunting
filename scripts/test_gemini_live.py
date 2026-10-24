import os
import urllib.request
import json
import ssl

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("Please set GEMINI_API_KEY environment variable before running.")
    exit(1)
URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": "Classify this email snippet into category (scam, applied, interview, rejected, offer): 'You are selected for Infosys. Pay Rs 4,999 training fee via UPI'."
                }
            ]
        }
    ]
}

data = json.dumps(payload).encode("utf-8")
headers = {
    "Content-Type": "application/json",
    "X-goog-api-key": API_KEY
}

req = urllib.request.Request(URL, data=data, headers=headers, method="POST")

ctx = ssl.create_default_context()

try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        text = result["candidates"][0]["content"]["parts"][0]["text"]
        print("SUCCESS! Live Gemini API Response:")
        print(text.strip())
except Exception as e:
    print(f"Error calling Gemini: {e}")
