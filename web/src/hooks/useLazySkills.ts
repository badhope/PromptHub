'use client';

import { useState, useEffect, useMemo, useRef, useTransition } from 'react';
import type { Skill, SkillSummary } from '@/types/skill';
import { skillSearchCache } from '@/lib/cache-manager';

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

function getInitialCachedData() {
  if (typeof window === 'undefined') return { skills: [], isLoading: true, hasLoaded: false };
  const cached = skillSearchCache.get('all_skills');
  if (cached) {
    return { skills: cached, isLoading: false, hasLoaded: true };
  }
  return { skills: [], isLoading: true, hasLoaded: false };
}

export function useLazySkills() {
  const initialData = useMemo(() => getInitialCachedData(), []);
  const [allSkills, setAllSkills] = useState<Skill[]>(initialData.skills);
  const [summaries, setSummaries] = useState<SkillSummary[]>(initialData.skills);
  const [isLoading, setIsLoading] = useState(initialData.isLoading);
  const [hasLoaded, setHasLoaded] = useState(initialData.hasLoaded);
  const [, startTransition] = useTransition();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (initialData.hasLoaded) return;

    loadFullSkillsData().then((skills) => {
      startTransition(() => {
        setAllSkills(skills);
        setSummaries(skills);
        skillSearchCache.set('all_skills', skills);
        setIsLoading(false);
        setHasLoaded(true);
      });
    });
  }, [initialData.hasLoaded, startTransition]);

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
