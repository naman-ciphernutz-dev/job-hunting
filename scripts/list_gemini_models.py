import urllib.request
import json
import ssl

API_KEY = "AQ.Ab8RN6LaVDwfHZmL1kIKbc4LbGteGqzhh6UUZX9t_o2RWrI9LA"
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
