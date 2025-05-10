-- Insertar etiquetas dummy con iconos
INSERT INTO tags (name, icon) VALUES
  ('Productivity', 'Zap'),
  ('Development', 'Code'),
  ('Design', 'Palette'),
  ('Marketing', 'BarChart2'),
  ('Business', 'Briefcase'),
  ('Finance', 'DollarSign'),
  ('AI', 'Brain'),
  ('Social Media', 'Share2'),
  ('Lifestyle', 'Compass');

-- Insertar productos dummy
INSERT INTO products (title, url, comment, image) VALUES
  ('Notion', 'https://www.notion.so/', 'Herramienta de productividad y organización todo en uno.', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png'),
  ('Figma', 'https://www.figma.com/', 'Diseño colaborativo de interfaces y prototipos.', 'https://cdn.worldvectorlogo.com/logos/figma-1.svg'),
  ('ChatGPT', 'https://chat.openai.com/', 'Asistente conversacional basado en IA.', 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg');

-- Relacionar productos con etiquetas
INSERT INTO product_tags (product_id, tag_id) VALUES
  (1, 1), -- Notion - Productivity
  (1, 2), -- Notion - Development
  (2, 3), -- Figma - Design
  (3, 7); -- ChatGPT - AI
