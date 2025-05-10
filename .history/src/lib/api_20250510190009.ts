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
  const allProducts = await fetchProducts()

  if (category === "all") {
    return allProducts
  }

  // This is a simplified example - in a real app, you'd have proper category mapping
  return allProducts.filter((product) => {
    // Simple matching logic - would be more sophisticated in a real app
    if (category === "ai" && product.tags.some((tag) => tag.toLowerCase().includes("ai"))) {
      return true
    }
    if (
      category === "development" &&
      product.tags.some((tag) => ["web development", "code", "development", "programming"].includes(tag.toLowerCase()))
    ) {
      return true
    }
    // Add more category filtering logic as needed
    return false
  })
}

export async function fetchProductsByTag(tag: string): Promise<Product[]> {
  const allProducts = await fetchProducts()

  if (tag === "all") {
    return allProducts
  }

  return allProducts.filter((product) => product.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
}
