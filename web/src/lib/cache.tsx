'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Skill, SkillSummary } from '@/types/skill';

interface SkillCache {
  summaries: Map<string, SkillSummary>;
  fullSkills: Map<string, Skill>;
  lastUpdated: number;
}

interface CacheContextType {
  getCachedSkill: (id: string) => Skill | SkillSummary | null;
  setCachedSkill: (id: string, skill: Skill) => void;
  getCachedSkills: (ids: string[]) => Array<Skill | SkillSummary>;
  clearCache: () => void;
  getCacheStats: () => { size: number; hitRate: number };
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

const CACHE_KEY = 'mobile-skills-cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}

interface CacheProviderProps {
  children: React.ReactNode;
}

export function CacheProvider({ children }: CacheProviderProps) {
  const [cache, setCache] = useState<SkillCache>(() => {
    if (typeof window === 'undefined') {
      return {
        summaries: new Map(),
        fullSkills: new Map(),
        lastUpdated: Date.now()
      };
    }
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.lastUpdated < CACHE_EXPIRY) {
          return {
            summaries: new Map(Object.entries(parsed.summaries || {})),
            fullSkills: new Map(Object.entries(parsed.fullSkills || {})),
            lastUpdated: parsed.lastUpdated
          };
        }
      }
    } catch (e) {
      console.error('Failed to load cache:', e);
    }
    
    return {
      summaries: new Map(),
      fullSkills: new Map(),
      lastUpdated: Date.now()
    };
  });
  
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cacheData = {
        summaries: Object.fromEntries(cache.summaries),
        fullSkills: Object.fromEntries(cache.fullSkills),
        lastUpdated: cache.lastUpdated
      };
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (e) {
        console.error('Failed to save cache:', e);
      }
    }
  }, [cache]);

  const getCachedSkill = useCallback((id: string): Skill | SkillSummary | null => {
    const skill = cache.fullSkills.get(id) || cache.summaries.get(id);
    if (skill) {
      setHits(h => h + 1);
      return skill;
    }
    setMisses(m => m + 1);
    return null;
  }, [cache]);

  const setCachedSkill = useCallback((id: string, skill: Skill) => {
    setCache(prev => {
      const newCache = {
        ...prev,
        fullSkills: new Map(prev.fullSkills).set(id, skill),
        lastUpdated: Date.now()
      };
      return newCache;
    });
  }, []);

  const getCachedSkills = useCallback((ids: string[]): Array<Skill | SkillSummary> => {
    return ids.map(id => getCachedSkill(id)).filter((s): s is Skill | SkillSummary => s !== null);
  }, [getCachedSkill]);

  const clearCache = useCallback(() => {
    setCache({
      summaries: new Map(),
      fullSkills: new Map(),
      lastUpdated: Date.now()
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  const getCacheStats = useCallback(() => {
    const total = hits + misses;
    return {
      size: cache.fullSkills.size + cache.summaries.size,
      hitRate: total > 0 ? hits / total : 0
    };
  }, [cache, hits, misses]);

  return (
    <CacheContext.Provider value={{
      getCachedSkill,
      setCachedSkill,
      getCachedSkills,
      clearCache,
      getCacheStats
    }}>
      {children}
    </CacheContext.Provider>
  );
}
