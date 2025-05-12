import db from '../../lib/db';
import type { Product } from "../types/product";
import Database from 'better-sqlite3';

export async function fetchBookmarks(): Promise<Product[]> {
  const bookmarks = db.prepare(`
    SELECT b.*, c.title as collection, GROUP_CONCAT(t.name, ',') as tags
    FROM bookmarks b
    LEFT JOIN collections c ON b.collection_id = c.id
    LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    GROUP BY b.id
  `).all();
  return bookmarks.map((b: any) => ({
    ...b,
    tags: b.tags ? b.tags.split(',') : [],
    collection: b.collection || null,
  }));
}

export async function fetchTags() {
  return db.prepare('SELECT * FROM tags ORDER BY name').all();
}

export async function fetchBookmarksByCollection(collection: string): Promise<Product[]> {
  if (!collection || collection === 'Todas') return fetchBookmarks();
  const bookmarks = db.prepare(`
    SELECT b.*, c.title as collection, GROUP_CONCAT(t.name, ',') as tags
    FROM bookmarks b
    LEFT JOIN collections c ON b.collection_id = c.id
    LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    WHERE LOWER(c.title) = LOWER(?)
    GROUP BY b.id
  `).all(collection);
  return bookmarks.map((b: any) => ({
    ...b,
    tags: b.tags ? b.tags.split(',') : [],
    collection: b.collection || null,
  }));
}

export async function fetchBookmarksByTag(tag: string): Promise<Product[]> {
  if (!tag || tag === 'Todas') return fetchBookmarks();
  const bookmarks = db.prepare(`
    SELECT b.*, c.title as collection, GROUP_CONCAT(t.name, ',') as tags
    FROM bookmarks b
    LEFT JOIN collections c ON b.collection_id = c.id
    LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    WHERE t.name = ?
    GROUP BY b.id
  `).all(tag);
  return bookmarks.map((b: any) => ({
    ...b,
    tags: b.tags ? b.tags.split(',') : [],
    collection: b.collection || null,
  }));
}

export async function fetchBookmarksByCollectionAndTag(collection: string, tag: string): Promise<Product[]> {
  if ((!collection || collection === 'Todas') && (!tag || tag === 'Todas')) return fetchBookmarks();
  if (!collection || collection === 'Todas') return fetchBookmarksByTag(tag);
  if (!tag || tag === 'Todas') return fetchBookmarksByCollection(collection);
  const bookmarks = db.prepare(`
    SELECT b.*, c.title as collection, GROUP_CONCAT(t.name, ',') as tags
    FROM bookmarks b
    LEFT JOIN collections c ON b.collection_id = c.id
    LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    WHERE LOWER(c.title) = LOWER(?) AND LOWER(t.name) = LOWER(?)
    GROUP BY b.id
  `).all(collection, tag);
  return bookmarks.map((b: any) => ({
    ...b,
    tags: b.tags ? b.tags.split(',') : [],
    collection: b.collection || null,
  }));
}

export async function fetchCollections() {
  const collections = db.prepare('SELECT * FROM collections').all();
  return collections;
}

export async function fetchBookmarksByTitle(term: string): Promise<Product[]> {
  if (!term || term.trim() === "") return fetchBookmarks();
  // Depuración: mostrar el término recibido
  console.log("Buscando por título:", term);
  const bookmarks = db.prepare(`
    SELECT b.*, c.title as collection, GROUP_CONCAT(t.name, ',') as tags
    FROM bookmarks b
    LEFT JOIN collections c ON b.collection_id = c.id
    LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
    LEFT JOIN tags t ON bt.tag_id = t.id
    WHERE b.title LIKE ? COLLATE NOCASE
    GROUP BY b.id
  `).all(`%${term}%`);
  return bookmarks.map((b: any) => ({
    ...b,
    tags: b.tags ? b.tags.split(',') : [],
    collection: b.collection || null,
  }));
}
