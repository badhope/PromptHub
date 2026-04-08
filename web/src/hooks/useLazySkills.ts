'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Skill, SkillSummary, SkillsData, SkillsSummaryData } from '@/types/skill';
import { searchCache, fullSkillCache } from '@/lib/cache-manager';
import {
  sortSkills,
  filterSkillsByCategory,
  searchSkills,
  calculateSkillStats,
  type SortBy
} from '@/lib/skill-utils';
import skillsSummaryData from '@/skills-summary.json';

let fullSkillsData: SkillsData | null = null;
let loadingPromise: Promise<SkillsData> | null = null;

async function loadFullSkillsData(): Promise<SkillsData> {
  if (fullSkillsData) {
    return fullSkillsData;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }
  
  loadingPromise = import('@/skills-data.json').then((module) => {
    fullSkillsData = module.default as SkillsData;
    return fullSkillsData;
  });
  
  return loadingPromise;
}

export interface UseLazySkillsOptions {
  category?: string;
  searchQuery?: string;
  sortBy?: SortBy;
  limit?: number;
}

export interface UseLazySkillsResult {
  skills: SkillSummary[];
  allSkills: SkillSummary[];
  categories: SkillsSummaryData['categories'];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  filteredCount: number;
}

export function useLazySkills(options: UseLazySkillsOptions = {}): UseLazySkillsResult {
  const { category, searchQuery = '', sortBy = 'popular', limit } = options;

  const summaryData = skillsSummaryData as SkillsSummaryData;
  const allSkills = summaryData.summaries;
  const categories = summaryData.categories;

  const filteredAndSortedSkills = useMemo(() => {
    let result = filterSkillsByCategory(allSkills, category);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const cacheKey = `${query}-${category || 'all'}`;
      
      const cached = searchCache.get(cacheKey);
      if (cached) {
        result = cached;
      } else {
        result = searchSkills(result, query);
        searchCache.set(cacheKey, result);
      }
    }

    result = sortSkills(result, sortBy);

    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  }, [allSkills, category, searchQuery, sortBy, limit]);

  return {
    skills: filteredAndSortedSkills,
    allSkills,
    categories,
    isLoading: false,
    error: null,
    totalCount: allSkills.length,
    filteredCount: filteredAndSortedSkills.length,
  };
}

export interface UseFullSkillResult {
  skill: Skill | null;
  isLoading: boolean;
  error: string | null;
}

export function useFullSkill(skillId: string): UseFullSkillResult {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const cachedSkill = fullSkillCache.get(skillId);
    if (cachedSkill) {
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          setSkill(cachedSkill);
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const loadingTimeoutId = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(true);
        setError(null);
      }
    }, 0);

    loadFullSkillsData()
      .then((data) => {
        if (!mountedRef.current) return;
        
        const foundSkill = data.skills.find(s => s.id === skillId) || null;
        if (foundSkill) {
          fullSkillCache.set(skillId, foundSkill);
        }
        setSkill(foundSkill);
        setError(skillId && !foundSkill ? 'Skill not found' : null);
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load skill');
      })
      .finally(() => {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      mountedRef.current = false;
      clearTimeout(loadingTimeoutId);
    };
  }, [skillId]);

  return { skill, isLoading, error };
}

export interface UseFullSkillsResult {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

export function useFullSkills(skillIds: string[]): UseFullSkillsResult {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const skillIdsKey = skillIds.join(',');

  useEffect(() => {
    if (skillIds.length === 0) {
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          setSkills([]);
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    mountedRef.current = true;

    const cachedSkills: Skill[] = [];
    const uncachedIds: string[] = [];

    skillIds.forEach(id => {
      const cached = fullSkillCache.get(id);
      if (cached) {
        cachedSkills.push(cached);
      } else {
        uncachedIds.push(id);
      }
    });

    if (uncachedIds.length === 0) {
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          setSkills(cachedSkills);
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const loadingTimeoutId = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(true);
        setError(null);
      }
    }, 0);

    loadFullSkillsData()
      .then((data) => {
        if (!mountedRef.current) return;

        const newSkills: Skill[] = [];
        uncachedIds.forEach(id => {
          const found = data.skills.find(s => s.id === id);
          if (found) {
            fullSkillCache.set(id, found);
            newSkills.push(found);
          }
        });

        setSkills([...cachedSkills, ...newSkills]);
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to load skills');
      })
      .finally(() => {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      mountedRef.current = false;
      clearTimeout(loadingTimeoutId);
    };
  }, [skillIdsKey, skillIds]);

  return { skills, isLoading, error };
}

export interface LazySkillStats {
  totalSkills: number;
  totalCategories: number;
  totalUses: number;
  averageRating: number;
  topCategories: Array<{ name: string; count: number }>;
}

export function useLazySkillStats(): LazySkillStats {
  const summaryData = skillsSummaryData as SkillsSummaryData;
  const summaries = summaryData.summaries;

  return useMemo(() => {
    return calculateSkillStats(summaries, Object.keys(summaryData.categories).length);
  }, [summaries, summaryData.categories]);
}

export { loadFullSkillsData };
