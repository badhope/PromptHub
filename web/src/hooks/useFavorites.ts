'use client';

import { useState, useCallback, useMemo } from 'react';

function getInitialFavorites(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn('Failed to parse favorites from localStorage:', error);
  }
  return [];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => getInitialFavorites());

  const toggleFavorite = useCallback((skillId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId];
      
      try {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.warn('Failed to save favorites to localStorage:', error);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((skillId: string) => {
    return favorites.includes(skillId);
  }, [favorites]);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const isFavoriteOptimized = useCallback((skillId: string) => {
    return favoritesSet.has(skillId);
  }, [favoritesSet]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem('favorites');
    } catch (error) {
      console.warn('Failed to clear favorites from localStorage:', error);
    }
  }, []);

  const favoritesCount = favorites.length;

  return { 
    favorites, 
    toggleFavorite, 
    isFavorite, 
    isFavoriteOptimized,
    clearFavorites,
    favoritesCount
  };
}
