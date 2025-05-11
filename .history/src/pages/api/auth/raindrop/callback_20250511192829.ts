// src/pages/api/auth/raindrop/callback.ts
export async function GET({ request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response(JSON.stringify({ error: 'No code provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const clientId = import.meta.env.RAINDROP_CLIENT_ID;
  const clientSecret = import.meta.env.RAINDROP_CLIENT_SECRET;
  const redirectUri = import.meta.env.RAINDROP_REDIRECT_URI;

  const tokenRes = await fetch('https://raindrop.io/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    return new Response(JSON.stringify({ error: tokenData.error || 'Token exchange failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Redirigir a /auth-success?token=... para que el frontend lo capture
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/auth-success?token=${encodeURIComponent(tokenData.access_token)}`
    }
  });
}