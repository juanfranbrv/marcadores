import { NextRequest, NextResponse } from 'next/server';

// Endpoint para recibir el código de autorización y canjearlo por un access token
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const clientId = process.env.RAINDROP_CLIENT_ID;
  const clientSecret = process.env.RAINDROP_CLIENT_SECRET;
  const redirectUri = process.env.RAINDROP_REDIRECT_URI;

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
  if (!tokenRes.ok) {
    return NextResponse.json({ error: tokenData.error || 'Token exchange failed' }, { status: 400 });
  }

  // Aquí puedes guardar el access token en sesión, cookie segura, etc.
  // Por ahora, solo lo devolvemos (no recomendado en producción)
  return NextResponse.json(tokenData);
}
