import { formatRelativeTime } from './performance';
import type { Skill, SkillSummary } from '@/types/skill';
import {
  getSkillCategory,
  getSkillDescription,
  getSkillTags
} from '@/types/skill';

export type SortBy = 'popular' | 'newest' | 'rating' | 'name';

export interface SortableSkillBase {
  id: string;
  name: string;
  useCount?: number;
  rating?: number;
  updatedAt?: string;
  stats?: {
    use_count: number;
    rating: number;
  };
  metadata?: {
    updated_at?: string;
  };
}

export function sortSkills<T extends SortableSkillBase>(
  skills: T[],
  sortBy: SortBy
): T[] {
  const result = [...skills];

  switch (sortBy) {
    case 'popular':
      return result.sort((a, b) => {
        const aCount = a.useCount ?? a.stats?.use_count ?? 0;
        const bCount = b.useCount ?? b.stats?.use_count ?? 0;
        const diff = bCount - aCount;
        return diff !== 0 ? diff : a.id.localeCompare(b.id);
      });

    case 'newest':
      return result.sort((a, b) => {
        const aDate = a.updatedAt ?? a.metadata?.updated_at ?? '';
        const bDate = b.updatedAt ?? b.metadata?.updated_at ?? '';
        const diff = new Date(bDate).getTime() - new Date(aDate).getTime();
        return diff !== 0 ? diff : a.id.localeCompare(b.id);
      });

    case 'rating':
      return result.sort((a, b) => {
        const aRating = a.rating ?? a.stats?.rating ?? 0;
        const bRating = b.rating ?? b.stats?.rating ?? 0;
        const diff = bRating - aRating;
        return diff !== 0 ? diff : a.id.localeCompare(b.id);
      });

    case 'name':
      return result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));

    default:
      return result;
  }
}

export function filterSkillsByCategory<T extends Skill | SkillSummary>(
  skills: T[],
  category?: string
): T[] {
  if (!category) return skills;

  return skills.filter(skill => getSkillCategory(skill) === category);
}

export function searchSkills<T extends Skill | SkillSummary>(
  skills: T[],
  query: string
): T[] {
  if (!query.trim()) return skills;

  const lowerQuery = query.toLowerCase().trim();

  return skills.filter(skill => {
    const nameMatch = skill.name.toLowerCase().includes(lowerQuery);
    const descMatch = getSkillDescription(skill).toLowerCase().includes(lowerQuery);
    const tags = getSkillTags(skill);
    const tagsMatch = tags.some(tag => tag.toLowerCase().includes(lowerQuery));

    return nameMatch || descMatch || tagsMatch;
  });
}

export interface StatsSkillBase {
  id: string;
  name: string;
  category?: string;
  categorization?: {
    primary_category: string;
  };
  useCount?: number;
  rating?: number;
  stats?: {
    use_count: number;
    rating: number;
  };
}

export interface SkillStatsResult {
  totalSkills: number;
  totalCategories: number;
  totalUses: number;
  averageRating: number;
  topCategories: Array<{ name: string; count: number }>;
}

export function calculateSkillStats<T extends StatsSkillBase>(
  skills: T[],
  categoriesCount: number
): SkillStatsResult {
  const totalSkills = skills.length;
  const totalUses = skills.reduce((sum, s) => {
    const count = s.useCount ?? s.stats?.use_count ?? 0;
    return sum + count;
  }, 0);
  
  const averageRating = skills.reduce((sum, s) => {
    const rating = s.rating ?? s.stats?.rating ?? 0;
    return sum + rating;
  }, 0) / totalSkills;

  const topCategories = getTopCategories(skills);

  return {
    totalSkills,
    totalCategories: categoriesCount,
    totalUses,
    averageRating: Math.round(averageRating * 10) / 10,
    topCategories,
  };
}

export function getTopCategories<T extends StatsSkillBase>(
  skills: T[]
): Array<{ name: string; count: number }> {
  const categoryCount: Record<string, number> = {};
  
  skills.forEach(skill => {
    const cat = skill.category ?? skill.categorization?.primary_category ?? '';
    if (cat) {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    }
  });

  return Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const diff = b.count - a.count;
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    })
    .slice(0, 5);
}

export interface RecentUpdateSkill extends StatsSkillBase {
  name: string;
  updatedAt?: string;
  metadata?: {
    updated_at?: string;
  };
}

export function getRecentUpdates<T extends RecentUpdateSkill>(
  skills: T[],
  count: number = 5
): Array<{ name: string; date: string; relativeTime: string }> {
  return sortSkills(skills, 'newest')
    .slice(0, count)
    .map(skill => {
      const date = skill.updatedAt ?? skill.metadata?.updated_at ?? '';
      return {
        name: skill.name,
        date,
        relativeTime: formatRelativeTime(date),
      };
    });
}

export function getRelatedSkills<T extends Skill | SkillSummary>(
  skills: T[],
  currentSkillId: string,
  limit: number = 4
): T[] {
  const currentSkill = skills.find(s => s.id === currentSkillId);
  if (!currentSkill) return [];

  const currentCategory = getSkillCategory(currentSkill);

  return skills
    .filter(skill => getSkillCategory(skill) === currentCategory && skill.id !== currentSkillId)
    .slice(0, limit);
}
