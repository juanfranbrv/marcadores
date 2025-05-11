// Endpoint Astro para obtener las colecciones (categorías) de Raindrop.io usando el access token
export async function GET() {
  const token = import.meta.env.RAINDROP_ACCESS_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'No Raindrop access token configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const url = 'https://api.raindrop.io/rest/v1/collections';
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
