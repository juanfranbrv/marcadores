import requests
import webbrowser
import sys
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import urllib.parse
import time  # <-- Añadido

CLIENT_ID = "6820c1976b1d4e384b39bdb4"
CLIENT_SECRET = "1953b41e-fac9-4398-b288-fe3fbd022382"
REDIRECT_URI = "http://localhost:4321/api/auth/raindrop/callback"

def get_authorization_code():
    code_holder = {}
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            if parsed.path == '/api/auth/raindrop/callback':
                params = urllib.parse.parse_qs(parsed.query)
                if 'code' in params:
                    code_holder['code'] = params['code'][0]
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    self.wfile.write(b"<h1>Autorizaci\xf3n completada. Puedes cerrar esta ventana.</h1>")
                    # Cerrar el servidor después de recibir el código
                    threading.Thread(target=httpd.shutdown, daemon=True).start()
                else:
                    self.send_response(400)
                    self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
        def log_message(self, format, *args):
            return
    server_address = ('', 4321)
    httpd = HTTPServer(server_address, Handler)
    def run_server():
        httpd.serve_forever()
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(1)  # Espera para asegurar que el servidor está listo
    auth_url = (
        f"https://api.raindrop.io/v1/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
    )
    print("Abriendo navegador para autorizar la app...")
    webbrowser.open(auth_url)
    print("Esperando autorización...")
    while 'code' not in code_holder:
        time.sleep(0.2)
    return code_holder.get('code')

def get_access_token(code):
    url = "https://raindrop.io/oauth/access_token"
    headers = {"Content-Type": "application/json"}
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "client_secret": CLIENT_SECRET,
        "grant_type": "authorization_code"
    }
    resp = requests.post(url, headers=headers, json=data)
    if resp.status_code != 200:
        print("Error al obtener el token:", resp.text)
        sys.exit(1)
    return resp.json()["access_token"]

def fetch_raindrop_data(access_token):
    # Colecciones
    collections_url = "https://api.raindrop.io/rest/v1/collections"
    headers = {"Authorization": f"Bearer {access_token}"}
    collections_resp = requests.get(collections_url, headers=headers)
    if collections_resp.status_code != 200:
        print("Error al obtener colecciones:", collections_resp.text)
        sys.exit(1)
    collections_data = collections_resp.json().get("items", [])

    # Marcadores
    bookmarks_url = "https://api.raindrop.io/rest/v1/raindrops/0"
    bookmarks_resp = requests.get(bookmarks_url, headers=headers)
    if bookmarks_resp.status_code != 200:
        print("Error al obtener marcadores:", bookmarks_resp.text)
        sys.exit(1)
    bookmarks_data = bookmarks_resp.json().get("items", [])

    return collections_data, bookmarks_data

def build_json_schema(collections_data, bookmarks_data):
    # Estructuras
    collections = []
    bookmarks = []
    tags = {}
    bookmark_tags = []

    # Procesar colecciones
    for col in collections_data:
        collections.append({
            "id": col.get("_id"),
            "title": col.get("title", ""),
            "color": col.get("color"),
            "icon": (col.get("cover", [None])[0] if isinstance(col.get("cover"), list) and col.get("cover") else None)
        })

    # Procesar bookmarks y tags
    tag_id_map = {}
    tag_counter = 1
    for bm in bookmarks_data:
        bookmark_id = bm.get("_id")
        bookmarks.append({
            "id": bookmark_id,
            "title": bm.get("title", ""),
            "url": bm.get("link", ""),
            "comment": bm.get("excerpt", ""),
            "image": bm.get("cover"),
            "created_at": bm.get("created", ""),
            "collection_id": bm.get("collectionId")
        })
        for tag in bm.get("tags", []):
            if tag not in tag_id_map:
                tag_id_map[tag] = tag_counter
                tags[tag_counter] = {"id": tag_counter, "name": tag, "icon": "Hash"}
                tag_counter += 1
            bookmark_tags.append({"bookmark_id": bookmark_id, "tag_id": tag_id_map[tag]})

    # Convertir tags a lista
    tags_list = list(tags.values())

    # Estructura final
    return {
        "collections": collections,
        "bookmarks": bookmarks,
        "tags": tags_list,
        "bookmark_tags": bookmark_tags
    }

def main():
    code = get_authorization_code()
    token = get_access_token(code)
    collections_data, bookmarks_data = fetch_raindrop_data(token)
    data_json = build_json_schema(collections_data, bookmarks_data)
    out_path = Path(__file__).parent / "lib" / "data.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data_json, f, ensure_ascii=False, indent=2)
    print(f"Exportado a {out_path}")

if __name__ == "__main__":
    main()
