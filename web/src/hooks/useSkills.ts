'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Skill, SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';
import { LRUCache, debounce, formatRelativeTime } from '@/lib/performance';

const searchCache = new LRUCache<string, Skill[]>(100);

export interface UseSkillsOptions {
  category?: string;
  searchQuery?: string;
  sortBy?: 'popular' | 'newest' | 'rating' | 'name';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = skillsData as SkillsData;
  const allSkills = data.skills;
  const categories = data.categories;

  const filteredAndSortedSkills = useMemo(() => {
    let result = [...allSkills];

    if (category) {
      result = result.filter(skill => skill.categorization.primary_category === category);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const cacheKey = `${query}-${category || 'all'}`;
      
      const cached = searchCache.get(cacheKey);
      if (cached) {
        result = cached;
      } else {
        result = result.filter(skill => {
          const nameMatch = skill.name.toLowerCase().includes(query);
          const descMatch = skill.metadata.description.toLowerCase().includes(query);
          const tagsMatch = skill.categorization.tags.some(tag => 
            tag.toLowerCase().includes(query)
          );
          return nameMatch || descMatch || tagsMatch;
        });
        searchCache.set(cacheKey, result);
      }
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => {
          const diff = b.stats.use_count - a.stats.use_count;
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'newest':
        result.sort((a, b) => {
          const diff = new Date(b.metadata.updated_at).getTime() - new Date(a.metadata.updated_at).getTime();
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'rating':
        result.sort((a, b) => {
          const diff = b.stats.rating - a.stats.rating;
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
        break;
    }

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const data = skillsData as SkillsData;

  const skill = useMemo(() => {
    return data.skills.find(s => s.id === skillId) || null;
  }, [data.skills, skillId]);

  const relatedSkills = useMemo(() => {
    if (!skill) return [];

    const sameCategory = data.skills.filter(
      s => s.categorization.primary_category === skill.categorization.primary_category && s.id !== skill.id
    );

    return sameCategory.slice(0, 4);
  }, [skill, data.skills]);

  useEffect(() => {
    setIsLoading(false);
    if (skillId && !skill) {
      setError('Skill not found');
    } else {
      setError(null);
    }
  }, [skillId, skill]);

  return {
    skill,
    isLoading,
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
    const totalSkills = skills.length;
    const totalCategories = Object.keys(data.categories).length;
    const totalUses = skills.reduce((sum, s) => sum + s.stats.use_count, 0);
    const averageRating = skills.reduce((sum, s) => sum + s.stats.rating, 0) / totalSkills;

    const categoryCount: Record<string, number> = {};
    skills.forEach(skill => {
      const cat = skill.categorization.primary_category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        const diff = b.count - a.count;
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      })
      .slice(0, 5);

    const recentUpdates = [...skills]
      .sort((a, b) => {
        const diff = new Date(b.metadata.updated_at).getTime() - new Date(a.metadata.updated_at).getTime();
        return diff !== 0 ? diff : a.id.localeCompare(b.id);
      })
      .slice(0, 5)
      .map(skill => ({
        name: skill.name,
        date: skill.metadata.updated_at,
        relativeTime: formatRelativeTime(skill.metadata.updated_at),
      }));

    return {
      totalSkills,
      totalCategories,
      totalUses,
      averageRating: Math.round(averageRating * 10) / 10,
      topCategories,
      recentUpdates,
    };
  }, [skills, data.categories]);
}

export function useDebouncedSearch(
  initialValue: string = '',
  delay: number = 300
): [string, string, (value: string) => void] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  const debouncedSetSearch = useMemo(
    () => debounce((newValue: string) => {
      setDebouncedValue(newValue);
    }, delay),
    [delay]
  );

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    debouncedSetSearch(newValue);
  }, [debouncedSetSearch]);

  return [value, debouncedValue, handleChange];
}
