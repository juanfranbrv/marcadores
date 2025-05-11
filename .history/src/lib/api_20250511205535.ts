import db from '../../lib/db';
import type { Product } from "../types/product";

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
    WHERE c.title = ?
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
    WHERE c.title = ? AND t.name = ?
    GROUP BY b.id
  `).all(collection, tag);
  return bookmarks.map((b: any) => ({
    ...b,
    tags: b.tags ? b.tags.split(',') : [],
    collection: b.collection || null,
  }));
}

export async function fetchCollections() {
  const db = require('better-sqlite3')(process.env.DB_PATH || 'lib/data.db');
  const collections = db.prepare('SELECT * FROM collections').all();
  return collections;
}
