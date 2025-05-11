import { NextRequest, NextResponse } from 'next/server';

// Endpoint para obtener los marcadores de Raindrop.io usando el access token
export async function GET(req: NextRequest) {
  const accessToken = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!accessToken) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 401 });
  }

  // Ejemplo: obtener todos los marcadores de la colección principal ("All")
  const res = await fetch('https://api.raindrop.io/rest/v1/raindrops/0', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch raindrops' }, { status: 500 });
  }

  const data = await res.json();
  // Puedes transformar los datos aquí si lo necesitas
  return NextResponse.json(data);
}
