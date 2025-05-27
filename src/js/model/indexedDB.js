import { openDB } from 'idb';

const DB_NAME = 'story-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

export async function saveStory(story) {
  const db = await dbPromise;
  return db.put(STORE_NAME, story);
}

export async function removeStory(id) {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
}

export async function getStoryById(id) {
  const db = await dbPromise;
  return db.get(STORE_NAME, id);
}

export async function getAllSavedStories() {
  const db = await dbPromise;
  const stories = await db.getAll(STORE_NAME);
  return stories.filter(s => s.imageBlob instanceof Blob);
}

export async function isStorySaved(id) {
  const db = await dbPromise;
  return !!(await db.get(STORE_NAME, id));
}

export async function getAllLocalStories() {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
}