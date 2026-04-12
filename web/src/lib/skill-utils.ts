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
  skills: T[] | undefined | null,
  sortBy: SortBy
): T[] {
  const safeSkills = skills || [];
  const result = [...safeSkills];

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
  skills: readonly T[] | undefined | null,
  category?: string
): T[] {
  const safeSkills = skills || [];
  if (!category) return safeSkills as T[];

  const result: T[] = [];
  for (let i = 0, len = safeSkills.length; i < len; i++) {
    const skill = safeSkills[i];
    const directCategory = ('category' in skill && skill.category) || '';
    const primary = ('categorization' in skill && skill.categorization?.primary_category) || '';
    const sub = ('categorization' in skill && skill.categorization?.subcategory) || '';
    const secondary = ('categorization' in skill && skill.categorization?.secondary_categories) || [];
    
    if (
      directCategory === category ||
      primary === category ||
      sub === category ||
      secondary.includes(category)
    ) {
      result.push(skill);
    }
  }
  return result;
}

export function searchSkills<T extends Skill | SkillSummary>(
  skills: readonly T[] | undefined | null,
  query: string
): T[] {
  const safeSkills = skills || [];
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return safeSkills as T[];

  const lowerQuery = trimmedQuery.toLowerCase();
  const result: T[] = [];

  for (let i = 0, len = safeSkills.length; i < len; i++) {
    const skill = safeSkills[i];
    
    if (skill.name.toLowerCase().includes(lowerQuery)) {
      result.push(skill);
      continue;
    }
    
    if (getSkillDescription(skill).toLowerCase().includes(lowerQuery)) {
      result.push(skill);
      continue;
    }
    
    const tags = getSkillTags(skill);
    if (tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
      result.push(skill);
    }
  }

  return result;
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
  skills: readonly T[],
  categoriesCount: number
): SkillStatsResult {
  const totalSkills = skills.length;
  let totalUses = 0;
  let totalRating = 0;

  for (let i = 0, len = skills.length; i < len; i++) {
    const s = skills[i];
    totalUses += s.useCount ?? s.stats?.use_count ?? 0;
    totalRating += s.rating ?? s.stats?.rating ?? 0;
  }
  
  const averageRating = totalSkills > 0 ? Math.round((totalRating / totalSkills) * 10) / 10 : 0;
  const topCategories = getTopCategories(skills as T[]);

  return {
    totalSkills,
    totalCategories: categoriesCount,
    totalUses,
    averageRating,
    topCategories,
  };
}

export function getTopCategories<T extends StatsSkillBase>(
  skills: readonly T[]
): Array<{ name: string; count: number }> {
  const categoryCount: Record<string, number> = {};
  
  for (let i = 0, len = skills.length; i < len; i++) {
    const skill = skills[i];
    const cat = skill.category ?? skill.categorization?.primary_category ?? '';
    if (cat) {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    }
  }

  const categories = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
  categories.sort((a, b) => {
    const diff = b.count - a.count;
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });
  return categories.slice(0, 5);
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
