// lib/update-category-icons.js
const db = require('./db.js').default;

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

console.log('Iconos de categorías actualizados correctamente.');
