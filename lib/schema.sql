-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  comment TEXT,
  image TEXT,
  -- Las etiquetas se almacenarán como una relación aparte
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de etiquetas con campo de icono
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Hash'
);

-- Relación muchos a muchos entre productos y etiquetas
CREATE TABLE IF NOT EXISTS product_tags (
  product_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);
