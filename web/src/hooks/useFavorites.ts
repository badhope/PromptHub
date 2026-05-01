'use client';

import { useSyncExternalStore } from 'react';

interface FavoriteState {
  favorites: string[];
  downloads: string[];
}

const STORAGE_KEY = 'skillora_user_data';

function loadStorage(): FavoriteState {
  if (typeof window === 'undefined') {
    return { favorites: [], downloads: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('存储读取失败:', e);
  }
  return { favorites: [], downloads: [] };
}

function saveStorage(data: Partial<FavoriteState>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadStorage();
    const merged = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  } catch (e) {
    console.error('存储写入失败:', e);
  }
}

let store: FavoriteState = { favorites: [], downloads: [] };
const subscribers = new Set<() => void>();
let initialized = false;

function initializeStore() {
  if (typeof window !== 'undefined' && !initialized) {
    initialized = true;
    store = loadStorage();
    
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        store = loadStorage();
        subscribers.forEach(cb => cb());
      }
    });
  }
}

function notify() {
  subscribers.forEach(cb => cb());
}

function subscribe(callback: () => void) {
  initializeStore();
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot() {
  initializeStore();
  return store;
}

function getServerSnapshot(): FavoriteState {
  return { favorites: [], downloads: [] };
}

export function useFavorites() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleFavorite = (skillId: string) => {
    const newFavorites = state.favorites.includes(skillId)
      ? state.favorites.filter(id => id !== skillId)
      : [...state.favorites, skillId];
    
    store = { ...store, favorites: newFavorites };
    saveStorage({ favorites: newFavorites });
    notify();
  };

  const addDownload = (skillId: string) => {
    if (!state.downloads.includes(skillId)) {
      const newDownloads = [...state.downloads, skillId];
      store = { ...store, downloads: newDownloads };
      saveStorage({ downloads: newDownloads });
      notify();
    }
  };

  const isFavorite = (skillId: string) => state.favorites.includes(skillId);
  const hasDownloaded = (skillId: string) => state.downloads.includes(skillId);
  const favoriteCount = state.favorites.length;
  const downloadCount = state.downloads.length;

  return {
    favorites: state.favorites,
    downloads: state.downloads,
    toggleFavorite,
    addDownload,
    isFavorite,
    hasDownloaded,
    favoriteCount,
    downloadCount,
  };
}
