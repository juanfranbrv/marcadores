import requests
import webbrowser
import sys
import sqlite3
from pathlib import Path

# Configuración de la app (rellena con tus datos)
CLIENT_ID = "6820c1976b1d4e384b39bdb4"
CLIENT_SECRET = "1953b41e-fac9-4398-b288-fe3fbd022382"
REDIRECT_URI = "http://localhost:4321/api/auth/raindrop/callback"

# Paso 1: Solicitar autorización al usuario

def get_authorization_code():
    auth_url = (
        f"https://api.raindrop.io/v1/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
    )
    print("Abre este enlace en tu navegador y autoriza la app:")
    print(auth_url)
    webbrowser.open(auth_url)
    print("\nTras autorizar, copia el parámetro 'code' de la URL de redirección y pégalo aquí.")
    code = input("Introduce el código de autorización: ").strip()
    return code

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

def insert_product_and_tags(conn, title, url, comment, image, tags):
    cur = conn.cursor()
    # Insertar producto
    cur.execute("""
        INSERT INTO products (title, url, comment, image)
        VALUES (?, ?, ?, ?)
    """, (title, url, comment, image))
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
    count = 0
    for item in data.get("items", []):
        title = item.get("title", "")
        url_ = item.get("link", "")
        comment = item.get("excerpt", "")
        image = item.get("cover", None)
        tags = item.get("tags", [])
        insert_product_and_tags(conn, title, url_, comment, image, tags)
        count += 1
    conn.close()
    print(f"Se han insertado {count} marcadores en la base de datos.")

if __name__ == "__main__":
    code = get_authorization_code()
    token = get_access_token(code)
    get_bookmarks(token)
