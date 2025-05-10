import db from '../../lib/db';
import type { Product } from "../types/product";

export async function fetchProducts(): Promise<Product[]> {
  const products = db.prepare(`
    SELECT p.id, p.title, p.url, p.comment as description, p.image,
      GROUP_CONCAT(t.name, ',') as tags
    FROM products p
    LEFT JOIN product_tags pt ON p.id = pt.product_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    GROUP BY p.id
    ORDER BY p.id
  `).all();

  return products.map((p: any) => ({
    ...p,
    tags: p.tags ? p.tags.split(',') : [],
    isPaid: false // Dummy, puedes ajustar según tu modelo
  }));
}

export async function fetchTags() {
  return db.prepare('SELECT * FROM tags ORDER BY name').all();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  if (category === "all") {
    return fetchProducts();
  }
  // Buscar productos que tengan una etiqueta igual al nombre de la categoría
  const products = db.prepare(`
    SELECT p.id, p.title, p.url, p.comment as description, p.image,
      GROUP_CONCAT(t.name, ',') as tags
    FROM products p
    LEFT JOIN product_tags pt ON p.id = pt.product_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE LOWER(t.name) = ?
    GROUP BY p.id
    ORDER BY p.id
  `).all(category.toLowerCase());
  return products.map((p: any) => ({
    ...p,
    tags: p.tags ? p.tags.split(',') : [],
    isPaid: false
  }));
}

export async function fetchProductsByTag(tag: string): Promise<Product[]> {
  if (tag === "all") {
    return fetchProducts();
  }
  const products = db.prepare(`
    SELECT p.id, p.title, p.url, p.comment as description, p.image,
      GROUP_CONCAT(t.name, ',') as tags
    FROM products p
    LEFT JOIN product_tags pt ON p.id = pt.product_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE t.name = ?
    GROUP BY p.id
    ORDER BY p.id
  `).all(tag);
  return products.map((p: any) => ({
    ...p,
    tags: p.tags ? p.tags.split(',') : [],
    isPaid: false
  }));
}
