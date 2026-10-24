import os
import urllib.request
import json
import ssl

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("Please set GEMINI_API_KEY environment variable before running.")
    exit(1)
headers = {
    "Content-Type": "application/json",
    "X-goog-api-key": API_KEY
}
payload = {
    "contents": [{"parts": [{"text": "Hello, respond with OK"}]}]
}
data = json.dumps(payload).encode("utf-8")
ctx = ssl.create_default_context()

candidate_models = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash-lite",
    "gemma-4-26b-a4b-it"
]

for model in candidate_models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=8) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            text = res["candidates"][0]["content"]["parts"][0]["text"].strip()
            print(f"SUCCESS with {model}: {text}")
            break
    except Exception as e:
        print(f"Failed {model}: {e}")
