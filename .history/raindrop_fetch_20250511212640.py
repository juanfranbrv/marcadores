import requests
import webbrowser
import sys
import sqlite3
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import urllib.parse

# Configuración de la app (rellena con tus datos)
CLIENT_ID = "6820c1976b1d4e384b39bdb4"
CLIENT_SECRET = "1953b41e-fac9-4398-b288-fe3fbd022382"
REDIRECT_URI = "http://localhost:4321/api/auth/raindrop/callback"

# Paso 1: Solicitar autorización al usuario

def get_authorization_code():
    code_holder = {}
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            # Solo aceptar la ruta exacta del redirect_uri
            if parsed.path == '/api/auth/raindrop/callback':
                params = urllib.parse.parse_qs(parsed.query)
                if 'code' in params:
                    code_holder['code'] = params['code'][0]
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()
                    self.wfile.write(b"<h1>Autorizaci\xf3n completada. Puedes cerrar esta ventana.</h1>")
                else:
                    self.send_response(400)
                    self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
        def log_message(self, format, *args):
            return  # Silencia logs en consola
    server_address = ('', 4321)
    httpd = HTTPServer(server_address, Handler)
    def run_server():
        httpd.handle_request()
    t = threading.Thread(target=run_server)
    t.start()
    auth_url = (
        f"https://api.raindrop.io/v1/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
    )
    print("Abriendo navegador para autorizar la app...")
    webbrowser.open(auth_url)
    print("Esperando autorización...")
    t.join()
    return code_holder.get('code')

# Paso 2: Intercambiar el código por un access_token

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

def ensure_collections_table_and_column(conn):
    cur = conn.cursor()
    # Crear tabla collections si no existe
    cur.execute('''
        CREATE TABLE IF NOT EXISTS collections (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            color TEXT,
            icon TEXT
        )
    ''')
    # Crear tabla bookmarks si no existe
    cur.execute('''
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            comment TEXT,
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Añadir columna collection_id a bookmarks si no existe
    cur.execute("PRAGMA table_info(bookmarks)")
    columns = [row[1] for row in cur.fetchall()]
    if 'collection_id' not in columns:
        cur.execute("ALTER TABLE bookmarks ADD COLUMN collection_id INTEGER")
    # Crear tabla tags si no existe
    cur.execute('''
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            icon TEXT DEFAULT 'Hash'
        )
    ''')
    # Crear tabla bookmark_tags si no existe
    cur.execute('''
        CREATE TABLE IF NOT EXISTS bookmark_tags (
            bookmark_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
            PRIMARY KEY (bookmark_id, tag_id)
        )
    ''')
    conn.commit()

def insert_bookmark_and_tags(conn, title, url, comment, image, tags, collection_id=None):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO bookmarks (title, url, comment, image, collection_id)
        VALUES (?, ?, ?, ?, ?)
    """, (title, url, comment, image, collection_id))
    bookmark_id = cur.lastrowid
    for tag in tags:
        cur.execute("INSERT OR IGNORE INTO tags (name) VALUES (?)", (tag,))
        cur.execute("SELECT id FROM tags WHERE name = ?", (tag,))
        tag_id = cur.fetchone()[0]
        cur.execute("INSERT OR IGNORE INTO bookmark_tags (bookmark_id, tag_id) VALUES (?, ?)", (bookmark_id, tag_id))
    conn.commit()

# Paso 3: Obtener los marcadores

def get_bookmarks(access_token):
    # Crear SIEMPRE una nueva base de datos vacía antes de poblar
    db_path = Path(__file__).parent / "lib" / "data.db"
    if db_path.exists():
        db_path.unlink()  # Elimina la base de datos anterior
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    ensure_collections_table_and_column(conn)
    # Obtener marcadores y colecciones
    url = "https://api.raindrop.io/rest/v1/raindrops/0"
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print("Error al obtener marcadores:", resp.text)
        sys.exit(1)
    data = resp.json()
    collections_url = "https://api.raindrop.io/rest/v1/collections"
    collections_resp = requests.get(collections_url, headers=headers)
    if collections_resp.status_code != 200:
        print("Error al obtener colecciones:", collections_resp.text)
        sys.exit(1)
    collections_data = collections_resp.json()
    # Insertar colecciones
    for col in collections_data.get("items", []):
        col_id = col.get("_id")
        title = col.get("title", "")
        color = col.get("color", None)
        icon = col.get("cover", {}).get("icon", None)  # Para estructuras anidadas
        cur.execute("INSERT INTO collections (id, title, color, icon) VALUES (?, ?, ?, ?)", (col_id, title, color, icon))
    conn.commit()
    # Insertar marcadores y etiquetas
    count = 0
    for item in data.get("items", []):
        title = item.get("title", "")
        url_ = item.get("link", "")
        comment = item.get("excerpt", "")
        image = item.get("cover", None)
        tags = item.get("tags", [])
        collection_id = item.get("collectionId")
        insert_bookmark_and_tags(conn, title, url_, comment, image, tags, collection_id)
        count += 1
    conn.close()
    print(f"Se han insertado {count} marcadores en la base de datos.")

if __name__ == "__main__":
    code = get_authorization_code()
    token = get_access_token(code)
    get_bookmarks(token)
