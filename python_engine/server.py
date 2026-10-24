"""
Lightweight zero-dependency HTTP server for Job Hunt Autopilot.
Serves static dashboard and provides REST API endpoints:
- GET / : Web Dashboard
- GET /api/sample : Returns the 20-email sample inbox
- POST /api/classify : Accepts JSON array of emails, returns full classified tracker
- POST /api/gemini/classify : Live Gemini cloud model classification
"""

import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse

# Reconfigure stdout for UTF-8 on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, PROJECT_ROOT)

from python_engine.ingestion import load_inbox
from python_engine.classifier import process_inbox, DEFAULT_REFERENCE_DATE

PORT = 8080


class AutopilotHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_ROOT, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/sample":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            data = load_inbox(os.path.join(PROJECT_ROOT, "data", "sample_inbox.json"))
            result = process_inbox(data, DEFAULT_REFERENCE_DATE)
            self.wfile.write(json.dumps(result, indent=2).encode("utf-8"))
            return
        elif parsed.path == "/" or parsed.path == "/index.html":
            self.path = "/index.html"
            return super().do_GET()
        else:
            return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path in ["/api/classify", "/api/gemini/classify"]:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                emails = json.loads(body)
                if parsed.path == "/api/gemini/classify":
                    from python_engine.gemini_classifier import classify_with_gemini
                    from python_engine.application_tracker import group_emails_into_applications
                    classified = [classify_with_gemini(e, ref_date=DEFAULT_REFERENCE_DATE) for e in emails]
                    app_data = group_emails_into_applications(classified, DEFAULT_REFERENCE_DATE)
                    result = {
                        "items": classified,
                        "application_tracker": app_data,
                        "powered_by": "Google AI Live Models"
                    }
                else:
                    result = process_inbox(emails, DEFAULT_REFERENCE_DATE)

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(result, indent=2).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


def start_server(port=PORT):
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), AutopilotHandler) as httpd:
        print(f"\n=======================================================")
        print(f"🚀 Job Hunt Autopilot Web Server Running!")
        print(f"👉 Local URL: http://localhost:{port}")
        print(f"📂 Serving from: {PROJECT_ROOT}")
        print(f"Press Ctrl+C to stop.")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.server_close()


if __name__ == "__main__":
    port_arg = PORT
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port_arg = int(sys.argv[1])
    start_server(port_arg)
