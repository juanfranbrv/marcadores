// lib/update-category-icons.ts
import db from './db';

const iconMap: Record<string, string> = {
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
