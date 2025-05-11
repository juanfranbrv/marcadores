-- Tabla de colecciones (collections)
CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  color TEXT,
  icon TEXT
);

-- Tabla de marcadores (bookmarks)
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  comment TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  collection_id INTEGER,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE SET NULL
);

-- Tabla de etiquetas (tags)
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'Hash'
);

-- Relación muchos a muchos entre bookmarks y tags
CREATE TABLE IF NOT EXISTS bookmark_tags (
  bookmark_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (bookmark_id, tag_id)
);
