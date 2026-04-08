'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Skill } from '@/types/skill';

const fullSkillCache = new Map<string, Skill>();

export interface UseFullSkillResult {
  skill: Skill | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFullSkill(skillId: string): UseFullSkillResult {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFullSkill = useCallback(async () => {
    if (!skillId) {
      setSkill(null);
      setError(null);
      return;
    }

    const cached = fullSkillCache.get(skillId);
    if (cached) {
      setSkill(cached);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/skills/${skillId}.json`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch skill');
      }

      const data = await response.json();
      const fullSkill = data.skill;
      
      fullSkillCache.set(skillId, fullSkill);
      setSkill(fullSkill);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setSkill(null);
    } finally {
      setIsLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    fetchFullSkill();
  }, [fetchFullSkill]);

  return {
    skill,
    isLoading,
    error,
    refetch: fetchFullSkill,
  };
}

export function preloadFullSkill(skillId: string): void {
  if (fullSkillCache.has(skillId)) {
    return;
  }

  fetch(`/skills/${skillId}.json`)
    .then(res => res.json())
    .then(data => {
      if (data.skill) {
        fullSkillCache.set(skillId, data.skill);
      }
    })
    .catch(err => {
      console.error('Failed to preload skill:', err);
    });
}

export function clearFullSkillCache(): void {
  fullSkillCache.clear();
}

export function getFullSkillCacheSize(): number {
  return fullSkillCache.size;
}
