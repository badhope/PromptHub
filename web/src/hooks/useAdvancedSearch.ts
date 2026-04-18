'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { Skill } from '@/types/skill';
import { useLocalStorage } from './useLocalStorage';

function useDebounce<T>(value: T, delay: number = 150): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export interface SearchHistory {
  query: string;
  timestamp: number;
  count: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'history' | 'tag' | 'name' | 'category';
  count?: number;
}

export interface AdvancedSearchOptions {
  category?: string;
  subcategory?: string;
  tags?: string[];
  minRating?: number;
  maxRating?: number;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
}

const globalSearchCache = new LRUCache<string, Skill[]>(50);

export function useAdvancedSearch(skills: Skill[]) {
  const [rawQuery, setQuery] = useState('');
  const [options, setOptions] = useState<AdvancedSearchOptions>({});
  const { value: searchHistory, setValue: setSearchHistory } = useLocalStorage<SearchHistory[]>('search-history', []);
  
  const query = useDebounce(rawQuery, 150);

  const suggestions = useMemo(() => {
    if (!query.trim()) {
      const recentHistory = searchHistory
        .sort((a: SearchHistory, b: SearchHistory) => b.timestamp - a.timestamp)
        .slice(0, 5);
      
      return recentHistory.map((h: SearchHistory) => ({
        text: h.query,
        type: 'history' as const,
        count: h.count
      }));
    }

    const lowerQuery = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    const matchingTags = new Map<string, number>();
    skills.forEach(skill => {
      const tags = skill.categorization?.tags || [];
      tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          matchingTags.set(tag, (matchingTags.get(tag) || 0) + 1);
        }
      });
    });

    matchingTags.forEach((count, tag) => {
      suggestions.push({ text: tag, type: 'tag', count });
    });

    const matchingNames = skills
      .filter(skill => skill.name.toLowerCase().includes(lowerQuery))
      .slice(0, 5);
    
    matchingNames.forEach(skill => {
      suggestions.push({ text: skill.name, type: 'name' });
    });

    const matchingHistory = searchHistory
      .filter((h: SearchHistory) => h.query.toLowerCase().includes(lowerQuery))
      .slice(0, 3);
    
    matchingHistory.forEach((h: SearchHistory) => {
      suggestions.push({ text: h.query, type: 'history', count: h.count });
    });

    return suggestions.slice(0, 10);
  }, [query, skills, searchHistory]);

  const results = useMemo(() => {
    const cacheKey = JSON.stringify({ query, options });
    const cached = globalSearchCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    let filtered = [...skills];

    if (query.trim()) {
      const lowerQuery = query.toLowerCase().trim();
      filtered = filtered.filter(skill => {
        const nameMatch = skill.name.toLowerCase().includes(lowerQuery);
        const descMatch = (skill.metadata?.description || '').toLowerCase().includes(lowerQuery);
        const tagsMatch = (skill.categorization?.tags || []).some(tag => 
          tag.toLowerCase().includes(lowerQuery)
        );
        
        return nameMatch || descMatch || tagsMatch;
      });
    }

    if (options.category) {
      filtered = filtered.filter(skill => 
        skill.categorization?.primary_category === options.category
      );
    }

    if (options.subcategory) {
      filtered = filtered.filter(skill => 
        skill.categorization?.subcategory === options.subcategory
      );
    }

    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(skill => {
        const skillTags = skill.categorization?.tags || [];
        return options.tags!.some(tag => skillTags.includes(tag));
      });
    }

    if (options.minRating !== undefined) {
      filtered = filtered.filter(skill => 
        (skill.stats?.rating || 0) >= options.minRating!
      );
    }

    if (options.maxRating !== undefined) {
      filtered = filtered.filter(skill => 
        (skill.stats?.rating || 0) <= options.maxRating!
      );
    }

    if (options.dateRange) {
      if (options.dateRange.start) {
        const startDate = new Date(options.dateRange.start);
        filtered = filtered.filter(skill => 
          new Date(skill.metadata?.updated_at || 0) >= startDate
        );
      }
      if (options.dateRange.end) {
        const endDate = new Date(options.dateRange.end);
        filtered = filtered.filter(skill => 
          new Date(skill.metadata?.updated_at || 0) <= endDate
        );
      }
    }

    globalSearchCache.set(cacheKey, filtered);

    return filtered;
  }, [skills, query, options]);

  const addToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const existingIndex = searchHistory.findIndex((h: SearchHistory) => h.query === searchQuery);
    
    if (existingIndex >= 0) {
      const updated = [...searchHistory];
      updated[existingIndex] = {
        ...updated[existingIndex],
        timestamp: Date.now(),
        count: updated[existingIndex].count + 1
      };
      setSearchHistory(updated);
    } else {
      setSearchHistory([
        { query: searchQuery, timestamp: Date.now(), count: 1 },
        ...searchHistory.slice(0, 19)
      ]);
    }
  }, [searchHistory, setSearchHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  const removeFromHistory = useCallback((queryToRemove: string) => {
    setSearchHistory(searchHistory.filter((h: SearchHistory) => h.query !== queryToRemove));
  }, [searchHistory, setSearchHistory]);

  const updateOptions = useCallback((newOptions: Partial<AdvancedSearchOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const clearOptions = useCallback(() => {
    setOptions({});
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setOptions({});
  }, []);

  return {
    query,
    setQuery,
    options,
    updateOptions,
    clearOptions,
    results,
    suggestions,
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    clearSearch,
    hasResults: results.length > 0,
    resultCount: results.length,
    totalCount: skills.length
  };
}
