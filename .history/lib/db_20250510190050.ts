// lib/db.ts
import Database from 'better-sqlite3';
import { join } from 'path';
import fs from 'fs';

const dbPath = join(process.cwd(), 'lib', 'data.db');

// Inicializar la base de datos si no existe
if (!fs.existsSync(dbPath)) {
  const dbInit = new Database(dbPath);
  const schema = fs.readFileSync(join(process.cwd(), 'lib', 'schema.sql'), 'utf-8');
  dbInit.exec(schema);
  const seed = fs.readFileSync(join(process.cwd(), 'lib', 'seed.sql'), 'utf-8');
  dbInit.exec(seed);
  dbInit.close();
}

const db = new Database(dbPath);

export default db;
