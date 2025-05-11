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

def ensure_categories_table_and_column(conn):
    cur = conn.cursor()
    # Crear tabla categories si no existe
    cur.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            color TEXT,
            icon TEXT
        )
    ''')
    # Añadir columna category_id a products si no existe
    cur.execute("PRAGMA table_info(products)")
    columns = [row[1] for row in cur.fetchall()]
    if 'category_id' not in columns:
        cur.execute("ALTER TABLE products ADD COLUMN category_id INTEGER")
    conn.commit()

def insert_product_and_tags(conn, title, url, comment, image, tags, category_id=None):
    cur = conn.cursor()
    # Insertar producto con category_id
    cur.execute("""
        INSERT INTO products (title, url, comment, image, category_id)
        VALUES (?, ?, ?, ?, ?)
    """, (title, url, comment, image, category_id))
    product_id = cur.lastrowid
    # Insertar etiquetas y relaciones
    for tag in tags:
        cur.execute("INSERT OR IGNORE INTO tags (name) VALUES (?)", (tag,))
        cur.execute("SELECT id FROM tags WHERE name = ?", (tag,))
        tag_id = cur.fetchone()[0]
        cur.execute("INSERT OR IGNORE INTO product_tags (product_id, tag_id) VALUES (?, ?)", (product_id, tag_id))
    conn.commit()

# Paso 3: Obtener los marcadores

def get_bookmarks(access_token):
    url = "https://api.raindrop.io/rest/v1/raindrops/0"  # 0 = todos los marcadores
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print("Error al obtener marcadores:", resp.text)
        sys.exit(1)
    data = resp.json()
    # Conexión a la base de datos
    db_path = Path(__file__).parent / "lib" / "data.db"
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    ensure_categories_table_and_column(conn)
    # Obtener colecciones (categorías) de Raindrop.io
    collections_url = "https://api.raindrop.io/rest/v1/collections"
    collections_resp = requests.get(collections_url, headers=headers)
    if collections_resp.status_code != 200:
        print("Error al obtener colecciones:", collections_resp.text)
        sys.exit(1)
    collections_data = collections_resp.json()
    # Borrar productos, relaciones, etiquetas y categorías previas
    cur.execute("DELETE FROM product_tags")
    cur.execute("DELETE FROM products")
    cur.execute("DELETE FROM tags")
    cur.execute("DELETE FROM categories")
    conn.commit()
    # Insertar categorías
    category_map = {}
    for cat in collections_data.get("items", []):
        cat_id = cat.get("_id")
        title = cat.get("title", "")
        color = cat.get("color", None)
        icon = cat.get("icon", None)
        cur.execute("INSERT INTO categories (id, title, color, icon) VALUES (?, ?, ?, ?)", (cat_id, title, color, icon))
        category_map[cat_id] = cat_id
    conn.commit()
    # Insertar productos y etiquetas
    count = 0
    for item in data.get("items", []):
        title = item.get("title", "")
        url_ = item.get("link", "")
        comment = item.get("excerpt", "")
        image = item.get("cover", None)
        tags = item.get("tags", [])
        category_id = item.get("collectionId")
        insert_product_and_tags(conn, title, url_, comment, image, tags, category_id)
        count += 1
    conn.close()
    print(f"Se han insertado {count} marcadores en la base de datos.")

if __name__ == "__main__":
    code = get_authorization_code()
    token = get_access_token(code)
    get_bookmarks(token)
