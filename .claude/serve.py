import http.server
import os
import socketserver

port = int(os.environ.get("PORT", "5679"))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.dirname(os.path.abspath(__file__))), **kwargs)

with socketserver.TCPServer(("", port), Handler) as httpd:
    print(f"Serving on port {port}")
    httpd.serve_forever()
