'use client';

import { useMemo } from 'react';
import type { Skill, SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';
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

export interface UseSkillsOptions {
  category?: string;
  searchQuery?: string;
  sortBy?: SortBy;
  limit?: number;
}

export interface UseSkillsResult {
  skills: Skill[];
  allSkills: Skill[];
  categories: SkillsData['categories'];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  filteredCount: number;
}

export function useSkills(options: UseSkillsOptions = {}): UseSkillsResult {
  const { category, searchQuery = '', sortBy = 'popular', limit } = options;

  const data = skillsData as SkillsData;
  const allSkills = data.skills;
  const categories = data.categories;

  const filteredAndSortedSkills = useMemo(() => {
    let result = filterSkillsByCategory(allSkills, category);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const cacheKey = `${query}-${category || 'all'}`;
      
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
    isLoading: false,
    error: null,
    totalCount: allSkills.length,
    filteredCount: filteredAndSortedSkills.length,
  };
}

export interface UseSkillResult {
  skill: Skill | null;
  isLoading: boolean;
  error: string | null;
  relatedSkills: Skill[];
}

export function useSkill(skillId: string): UseSkillResult {
  const data = skillsData as SkillsData;

  const skill = useMemo(() => {
    return data.skills.find(s => s.id === skillId) || null;
  }, [data.skills, skillId]);

  const relatedSkills = useMemo(() => {
    return getRelatedSkills(data.skills, skillId, 4);
  }, [skillId, data.skills]);

  const error = useMemo(() => {
    return skillId && !skill ? 'Skill not found' : null;
  }, [skillId, skill]);

  return {
    skill,
    isLoading: false,
    error,
    relatedSkills,
  };
}

export interface SkillStats {
  totalSkills: number;
  totalCategories: number;
  totalUses: number;
  averageRating: number;
  topCategories: Array<{ name: string; count: number }>;
  recentUpdates: Array<{ name: string; date: string; relativeTime: string }>;
}

export function useSkillStats(): SkillStats {
  const data = skillsData as SkillsData;
  const skills = data.skills;

  return useMemo(() => {
    const baseStats = calculateSkillStats(skills, Object.keys(data.categories).length);
    const recentUpdates = getRecentUpdates(skills, 5);

    return {
      ...baseStats,
      recentUpdates,
    };
  }, [skills, data.categories]);
}
