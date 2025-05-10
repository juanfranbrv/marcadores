// lib/add-icon-column.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

try {
  db.prepare("ALTER TABLE tags ADD COLUMN icon TEXT DEFAULT 'Hash'").run();
  console.log('Columna icon agregada correctamente a la tabla tags.');
} catch (e) {
  if (e.message.includes('duplicate column name')) {
    console.log('La columna icon ya existe en la tabla tags.');
  } else {
    console.error('Error al agregar la columna icon:', e.message);
  }
}
db.close();
