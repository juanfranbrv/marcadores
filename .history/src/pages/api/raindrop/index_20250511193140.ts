// src/pages/api/raindrop/index.ts
// Endpoint para obtener los marcadores públicos de Raindrop.io usando un token fijo del backend

export async function GET() {
  const token = import.meta.env.RAINDROP_ACCESS_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'No Raindrop access token configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Puedes personalizar la colección consultada si lo deseas
  const url = 'https://api.raindrop.io/rest/v1/raindrops/0'; // 0 = todos los marcadores
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
