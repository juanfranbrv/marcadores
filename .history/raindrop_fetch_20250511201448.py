import requests
import webbrowser
import sys
import json

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

# Paso 3: Obtener los marcadores

def get_bookmarks(access_token):
    url = "https://api.raindrop.io/rest/v1/raindrops/0"  # 0 = todos los marcadores
    headers = {"Authorization": f"Bearer {access_token}"}
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print("Error al obtener marcadores:", resp.text)
        sys.exit(1)
    data = resp.json()
    print(json.dumps(data, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    code = get_authorization_code()
    token = get_access_token(code)
    get_bookmarks(token)
