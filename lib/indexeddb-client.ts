import { openDB, IDBPDatabase } from 'idb';
import type { MuseumItem, Category } from './api-client';

const DB_NAME = 'MuseumDB';
const DB_VERSION = 2; // Incrementar la versión para el upgrade, esto me da miedo
const STORES = {
    ITEMS: 'items',
    CATEGORIES: 'categories',
    IMAGES: 'images',
};

// HAY QUE INSTALAR: pnpm install idb

let db: IDBPDatabase | null = null;

export async function initDB(): Promise<IDBPDatabase> {
    if (db) return db;

    db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
            // Se ejecuta solo si la DB es nueva o la versión es mayor
            if (oldVersion < 2) {
                if (!db.objectStoreNames.contains(STORES.ITEMS)) {
                    db.createObjectStore(STORES.ITEMS, { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
                    db.createObjectStore(STORES.CATEGORIES, { keyPath: 'value' });
                }
            }
            if (!db.objectStoreNames.contains(STORES.IMAGES)) {
                db.createObjectStore(STORES.IMAGES, { keyPath: 'url' });
            }
        },
    });
    return db;
}

// --- Items ---
export async function saveItems(items: MuseumItem[]): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(STORES.ITEMS, 'readwrite');
    await Promise.all(items.map(item => tx.store.put(item)));
    await tx.done;
}

export async function getItems(): Promise<MuseumItem[]> {
    const db = await initDB();
    return db.getAll(STORES.ITEMS);
}

export async function saveItem(item: MuseumItem): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(STORES.ITEMS, 'readwrite');
    await tx.store.put(item);
    await tx.done;
}

export async function getItem(id: number): Promise<MuseumItem | undefined> {
    const db = await initDB();
    return db.get(STORES.ITEMS, id);
}


// --- Categories ---
export async function saveCategories(categories: Category[]): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(STORES.CATEGORIES, 'readwrite');
    await Promise.all(categories.map(cat => tx.store.put(cat)));
    await tx.done;
}

export async function getCategories(): Promise<Category[]> {
    const db = await initDB();
    return db.getAll(STORES.CATEGORIES);
}


// --- Images ---
export async function saveImage(url: string, blob: Blob): Promise<void> {
    const db = await initDB();
    const tx = db.transaction(STORES.IMAGES, 'readwrite');
    await tx.store.put({ url, data: blob, timestamp: Date.now() });
    await tx.done;
}

export async function getImage(url: string): Promise<Blob | undefined> {
    const db = await initDB();
    const image = await db.get(STORES.IMAGES, url);
    return image ? image.data : undefined;
}