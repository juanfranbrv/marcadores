// Endpoint mínimo para probar rutas API en Astro
export async function GET() {
  return new Response(JSON.stringify({ message: 'Hello from Astro API!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
