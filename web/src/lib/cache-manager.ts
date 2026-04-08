import { LRUCache } from './performance';
import type { Skill, SkillSummary } from '@/types/skill';

export const searchCache = new LRUCache<string, SkillSummary[]>(100);
export const fullSkillCache = new LRUCache<string, Skill>(50);
export const skillSearchCache = new LRUCache<string, Skill[]>(100);

export function clearAllCaches(): void {
  searchCache.clear();
  fullSkillCache.clear();
  skillSearchCache.clear();
}

export function getCacheStats(): {
  searchCacheSize: number;
  fullSkillCacheSize: number;
  skillSearchCacheSize: number;
} {
  return {
    searchCacheSize: (searchCache as unknown as { size: number }).size || 0,
    fullSkillCacheSize: (fullSkillCache as unknown as { size: number }).size || 0,
    skillSearchCacheSize: (skillSearchCache as unknown as { size: number }).size || 0,
  };
}
