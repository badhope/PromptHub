'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Skill, SkillSummary } from '@/types/skill';
import { searchCache, skillSearchCache } from '@/lib/cache-manager';
import {
  sortSkills,
  filterSkillsByCategory,
  searchSkills,
  calculateSkillStats,
  type SortBy
} from '@/lib/skill-utils';
import { loadUnifiedSkillsData, getSkillByIdSync } from '@/lib/unified-data-loader';

let fullSkillsData: Skill[] | null = null;
let loadingPromise: Promise<Skill[]> | null = null;

async function loadFullSkillsData(): Promise<Skill[]> {
  if (fullSkillsData) {
    return fullSkillsData;
  }
  
  if (loadingPromise) {
    return loadingPromise;
  }
  
  loadingPromise = loadUnifiedSkillsData().then((unifiedData) => {
    fullSkillsData = unifiedData.skills;
    return unifiedData.skills;
  });
  
  return loadingPromise;
}

export function useLazySkills() {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [summaries, setSummaries] = useState<SkillSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const cached = skillSearchCache.get('all_skills');
    if (cached) {
      setAllSkills(cached);
      setSummaries(cached);
      setIsLoading(false);
      setHasLoaded(true);
      return;
    }

    loadFullSkillsData().then((skills) => {
      setAllSkills(skills);
      setSummaries(skills);
      skillSearchCache.set('all_skills', skills);
      setIsLoading(false);
      setHasLoaded(true);
    });
  }, []);

  const loadSkillById = useMemo(() => {
    return (id: string) => getSkillByIdSync(id);
  }, []);

  return {
    allSkills,
    summaries,
    isLoading,
    hasLoaded,
    loadSkillById,
    totalCount: allSkills.length
  };
}
