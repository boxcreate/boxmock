import type { MockupOptions } from '../types';

const OPTIONS_KEY = 'boxmock_options_v1';
const DB_NAME = 'boxmock_db';
const STORE_NAME = 'assets';
const IMAGE_KEY = 'custom_screenshot';

/**
 * Saves options to localStorage (safe with try/catch).
 */
export function saveOptions(options: MockupOptions): void {
  try {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
  } catch (err) {
    console.warn('Failed to save options to localStorage:', err);
  }
}

/**
 * Loads options from localStorage, merging with defaults to ensure schema completeness.
 */
export function loadOptions(defaultOptions: MockupOptions): MockupOptions {
  try {
    const raw = localStorage.getItem(OPTIONS_KEY);
    if (!raw) return defaultOptions;
    const parsed = JSON.parse(raw);
    const loaded = { ...defaultOptions, ...parsed, showStatusBar: false, showNavigationPill: false };
    if (loaded.backgroundType === 'transparent' && loaded.exportFormat === 'jpeg') {
      loaded.exportFormat = 'png';
    }
    return loaded;
  } catch (err) {
    console.warn('Failed to load options from localStorage:', err);
    return defaultOptions;
  }
}

/**
 * Clears saved options from localStorage.
 */
export function clearOptions(): void {
  try {
    localStorage.removeItem(OPTIONS_KEY);
  } catch (err) {
    console.warn('Failed to clear options:', err);
  }
}

/**
 * Opens native IndexedDB for storing high-resolution custom screenshots without quota limits.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Saves the custom screenshot data URL into IndexedDB.
 */
export async function saveCustomScreenshot(dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, IMAGE_KEY);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save custom screenshot to IndexedDB:', err);
  }
}

/**
 * Loads the saved custom screenshot data URL from IndexedDB.
 */
export async function loadCustomScreenshot(): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(IMAGE_KEY);
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to load custom screenshot from IndexedDB:', err);
    return null;
  }
}

/**
 * Removes the saved custom screenshot from IndexedDB.
 */
export async function clearCustomScreenshot(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(IMAGE_KEY);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to clear custom screenshot from IndexedDB:', err);
  }
}
