// lib/update-category-icons.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

const iconMap = {
  'Productivity': 'Zap',
  'Development': 'Code',
  'Design': 'Palette',
  'Marketing': 'BarChart2',
  'Business': 'Briefcase',
  'Finance': 'DollarSign',
  'AI': 'Brain',
  'Social Media': 'Share2',
  'Lifestyle': 'Compass',
};

for (const [name, icon] of Object.entries(iconMap)) {
  db.prepare('UPDATE tags SET icon = ? WHERE name = ?').run(icon, name);
}

db.close();
console.log('Iconos de categorías actualizados correctamente.');
