import { NextRequest, NextResponse } from 'next/server';

// Endpoint para obtener las etiquetas de Raindrop.io usando el access token
export async function GET(req: NextRequest) {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  const res = await fetch('https://api.raindrop.io/rest/v1/tags', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }

  const data = await res.json();
  // data.items es el array de etiquetas
  return NextResponse.json(data.items);
}
