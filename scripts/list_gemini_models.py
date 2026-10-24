import os
import urllib.request
import json
import ssl

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("Please set GEMINI_API_KEY environment variable before running.")
    exit(1)
URL = "https://generativelanguage.googleapis.com/v1beta/models"

headers = {
    "X-goog-api-key": API_KEY
}

req = urllib.request.Request(URL, headers=headers)
ctx = ssl.create_default_context()

try:
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        models = [m["name"] for m in res.get("models", []) if "generateContent" in m.get("supportedGenerationMethods", [])]
        print(f"Available models for this API key ({len(models)}):")
        for m in models[:10]:
            print(" -", m)
except Exception as e:
    print(f"Error listing models: {e}")
