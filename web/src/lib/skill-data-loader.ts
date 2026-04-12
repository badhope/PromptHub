'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Skill } from '@/types/skill';
import {
  loadUnifiedSkillsData,
  getSkillsSync,
  invalidateAllData
} from './unified-data-loader';
interface UseSkillDataOptions {
  autoFetch?: boolean;
}

interface UseSkillDataResult {
  skills: Skill[];
  allSkills: Skill[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalCount: number;
}

export async function fetchAllSkills(): Promise<Skill[]> {
  const data = await loadUnifiedSkillsData();
  return data.skills;
}

export function useSkillData(options: UseSkillDataOptions = {}): UseSkillDataResult {
  const { autoFetch = true } = options;
  const [skills, setSkills] = useState<Skill[]>(getSkillsSync());
  const [isLoading, setIsLoading] = useState(getSkillsSync().length === 0 && autoFetch);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadUnifiedSkillsData();
      setSkills(data.skills);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = getSkillsSync();
    if (cached.length > 0) {
      setSkills(cached);
      setIsLoading(false);
      return;
    }

    if (autoFetch) {
      loadSkills();
    }
  }, [autoFetch, loadSkills]);

  return {
    skills,
    allSkills: skills,
    isLoading,
    error,
    refetch: loadSkills,
    totalCount: skills.length,
  };
}

export function invalidateSkillCache() {
  invalidateAllData();
}

export type { UseSkillDataOptions, UseSkillDataResult };
