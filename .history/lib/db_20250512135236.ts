// lib/db.ts
// Migrado para usar Turso (SQLite vía HTTP)

import { createClient } from '@turso/client';

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN!;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('Faltan las variables TURSO_DATABASE_URL o TURSO_AUTH_TOKEN en el entorno');
}

export const db = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});
