import { NextRequest, NextResponse } from 'next/server';

// Endpoint para redirigir al usuario a la autorización de Raindrop.io
export async function GET(req: NextRequest) {
  const clientId = process.env.RAINDROP_CLIENT_ID;
  const redirectUri = process.env.RAINDROP_REDIRECT_URI;
  const authUrl = `https://raindrop.io/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read`;
  return NextResponse.redirect(authUrl);
}
