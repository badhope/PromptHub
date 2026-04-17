import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import type { Skill } from '@/types/skill';
import { getSkillByIdSync, invalidateAllData, loadUnifiedSkillsData } from '@/lib/unified-data-loader';

type DataStatus = 'idle' | 'loading' | 'success' | 'error';

interface SkillsState {
  status: DataStatus;
  data: Skill[];
  error: Error | null;
}

interface SkillState {
  status: DataStatus;
  data: Skill | null;
  error: Error | null;
}

let globalState: SkillsState = {
  status: 'idle',
  data: [],
  error: null,
};

const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach(cb => cb());
}

function setState(partial: Partial<SkillsState>) {
  globalState = { ...globalState, ...partial };
  notify();
}

async function ensureDataLoaded() {
  if (globalState.data.length === 0 && globalState.status !== 'loading') {
    setState({ status: 'loading' });
    try {
      invalidateAllData();
      const unifiedData = await loadUnifiedSkillsData();
      setState({ status: 'success', data: unifiedData.skills, error: null });
      return unifiedData.skills;
    } catch (e) {
      console.error('数据加载失败:', e);
      setState({ status: 'error', error: e as Error });
      return [];
    }
  }
  return globalState.data;
}

const SERVER_STATE: SkillsState = {
  status: 'loading',
  data: [],
  error: null,
};

export function useSkills() {
  const state = useSyncExternalStore(
    cb => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    () => globalState,
    () => SERVER_STATE
  );

  useEffect(() => {
    if (state.status === 'idle') {
      ensureDataLoaded();
    }
  }, [state.status]);

  const refresh = useCallback(() => {
    setState({ status: 'loading' });
    setTimeout(async () => {
      invalidateAllData();
      const unifiedData = await loadUnifiedSkillsData();
      setState({ status: 'success', data: unifiedData.skills, error: null });
    }, 0);
  }, []);

  return {
    ...state,
    skills: state.data,
    refresh,
  };
}

export function useSkill(id: string | undefined) {
  const [state, setState] = useState<SkillState>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!id) return;

    async function loadSkill() {
      setState({ status: 'loading', data: null, error: null });
      try {
        const skills = await ensureDataLoaded();
        const skill = skills.find(s => s.id === id) || (id ? getSkillByIdSync(id) : null);
        if (skill) {
          setState({ status: 'success', data: skill, error: null });
        } else {
          setState({ status: 'error', data: null, error: new Error('Skill not found') });
        }
      } catch (e) {
        setState({ status: 'error', data: null, error: e as Error });
      }
    }

    loadSkill();
  }, [id]);

  return state;
}
