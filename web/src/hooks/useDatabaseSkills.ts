'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Skill } from '@/types/skill';
import { skillDbToEntity } from '@/lib/db';

interface UseDatabaseSkillsOptions {
  enabled?: boolean;
}

interface UseDatabaseSkillsResult {
  status: 'loading' | 'success' | 'error';
  skills: Skill[];
  error: Error | null;
  refresh: () => Promise<void>;
  getSkillById: (id: string) => Skill | undefined;
}

let skillsCache: Skill[] | null = null;

export function useDatabaseSkills(
  options: UseDatabaseSkillsOptions = {}
): UseDatabaseSkillsResult {
  const { enabled = true } = options;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    skillsCache ? 'success' : 'loading'
  );
  const [skills, setSkills] = useState<Skill[]>(skillsCache || []);
  const [error, setError] = useState<Error | null>(null);

  const fetchSkills = async () => {
    if (!enabled) {
      setStatus('success');
      setSkills([]);
      return;
    }

    try {
      setStatus('loading');
      
      const res = await fetch('/api/db/skills');
      if (!res.ok) throw new Error('Failed to fetch skills');
      
      const data = await res.json();
      const converted = data.map((dbSkill: any) => skillDbToEntity(dbSkill));
      
      skillsCache = converted;
      setSkills(converted);
      setStatus('success');
      setError(null);
    } catch (e) {
      setStatus('error');
      setError(e as Error);
      console.error('useDatabaseSkills error:', e);
    }
  };

  useEffect(() => {
    if (!skillsCache) {
      fetchSkills();
    }
  }, [enabled]);

  const getSkillById = (id: string): Skill | undefined => {
    return skills.find(s => s.id === id);
  };

  return {
    status,
    skills,
    error,
    refresh: fetchSkills,
    getSkillById,
  };
}

export function useDatabaseSkill(id: string | undefined) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [skill, setSkill] = useState<Skill | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setStatus('idle');
      return;
    }

    const fetchSkill = async () => {
      try {
        setStatus('loading');
        const res = await fetch(`/api/db/skills/${id}`);
        if (!res.ok) throw new Error('Skill not found');
        
        const data = await res.json();
        setSkill(skillDbToEntity(data));
        setStatus('success');
      } catch (e) {
        setStatus('error');
        setError(e as Error);
      }
    };

    fetchSkill();
  }, [id]);

  return { status, skill, error };
}
