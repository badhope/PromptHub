'use client';

import { useMemo } from 'react';
import type { Skill, SkillsData } from '@/types/skill';
import { useSkillData } from '@/lib/skill-data-loader';
import { skillSearchCache } from '@/lib/cache-manager';
import {
  sortSkills,
  filterSkillsByCategory,
  searchSkills,
  calculateSkillStats,
  getRecentUpdates,
  getRelatedSkills,
  type SortBy
} from '@/lib/skill-utils';

export interface UseLiteSkillsOptions {
  category?: string;
  searchQuery?: string;
  sortBy?: SortBy;
  limit?: number;
}

export interface UseLiteSkillsResult {
  skills: Skill[];
  allSkills: Skill[];
  categories: SkillsData['categories'];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  filteredCount: number;
}

export function useLiteSkills(options: UseLiteSkillsOptions = {}): UseLiteSkillsResult {
  const { category, searchQuery = '', sortBy = 'popular', limit } = options;

  const { skills: allSkills, isLoading, error, totalCount } = useSkillData();
  const categories = {};

  const filteredAndSortedSkills = useMemo(() => {
    let result = filterSkillsByCategory(allSkills, category);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const cacheKey = `lite-${query}-${category || 'all'}`;
      
      const cached = skillSearchCache.get(cacheKey);
      if (cached) {
        result = cached;
      } else {
        result = searchSkills(result, query);
        skillSearchCache.set(cacheKey, result);
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
    isLoading,
    error,
    totalCount,
    filteredCount: filteredAndSortedSkills.length,
  };
}

export interface UseLiteSkillResult {
  skill: Skill | null;
  isLoading: boolean;
  error: string | null;
  relatedSkills: Skill[];
}

export function useLiteSkill(skillId: string): UseLiteSkillResult {
  const { skills: allSkills, isLoading, error } = useSkillData();

  const skill = useMemo(() => {
    return allSkills.find(s => s.id === skillId) || null;
  }, [allSkills, skillId]);

  const relatedSkills = useMemo(() => {
    return getRelatedSkills(allSkills, skillId, 4);
  }, [skillId, allSkills]);

  return {
    skill,
    isLoading,
    error: skillId && !skill && !isLoading ? 'Skill not found' : error,
    relatedSkills,
  };
}

export interface LiteSkillStats {
  totalSkills: number;
  totalCategories: number;
  totalUses: number;
  averageRating: number;
  topCategories: Array<{ name: string; count: number }>;
  recentUpdates: Array<{ name: string; date: string; relativeTime: string }>;
}

export function useLiteSkillStats(): LiteSkillStats {
  const { skills: allSkills } = useSkillData();

  return useMemo(() => {
    const baseStats = calculateSkillStats(allSkills, 8);
    const recentUpdates = getRecentUpdates(allSkills, 5);

    return {
      ...baseStats,
      recentUpdates,
    };
  }, [allSkills]);
}
