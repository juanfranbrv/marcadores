// Endpoint Astro para obtener las etiquetas de Raindrop.io usando el access token
export async function get({ request }) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return new Response(JSON.stringify({ error: 'No access token provided' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const accessToken = auth.replace('Bearer ', '');
  const res = await fetch('https://api.raindrop.io/rest/v1/tags', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tags' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data.items), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
