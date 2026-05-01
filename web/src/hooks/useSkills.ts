import { useState, useEffect } from 'react';
import type { Skill } from '@/types/skill';
import { getSkillsSync, ensureDataLoaded, loadUnifiedSkillsData } from '@/lib/unified-data-loader';

type DataStatus = 'loading' | 'ready' | 'error';

/**
 * 加载所有技能列表的 React Hook
 * 
 * @remarks
 * 自动在组件挂载时初始化数据，支持刷新功能。
 * 使用简单的 useState + useEffect 模式实现，避免过度优化。
 * 
 * @example
 * ```tsx
 * function AppList() {
 *   const { skills, isLoading, error } = useSkills();
 *   
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *   
 *   return skills.map(skill => <AppCard key={skill.id} skill={skill} />);
 * }
 * ```
 * 
 * @returns 包含技能数据、加载状态、错误信息的对象
 */
export function useSkills() {
  const [status, setStatus] = useState<DataStatus>('loading');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await ensureDataLoaded();
        setSkills(getSkillsSync());
        setStatus('ready');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load skills'));
        setStatus('error');
      }
    };
    init();
  }, []);

  /**
   * 强制重新加载所有数据
   */
  const refresh = async () => {
    setStatus('loading');
    await loadUnifiedSkillsData();
    setSkills(getSkillsSync());
    setStatus('ready');
  };

  return {
    skills,
    status,
    error,
    refresh,
    data: skills,
    isLoading: status === 'loading',
  };
}

/**
 * 根据 ID 加载单个技能的 React Hook
 * 
 * @param id - 技能 ID，可选（未提供时返回 undefined）
 * 
 * @example
 * ```tsx
 * function SkillDetail({ id }) {
 *   const { skill, isLoading } = useSkill(id);
 *   
 *   if (isLoading) return <Loading />;
 *   if (!skill) return <NotFound />;
 *   
 *   return <h1>{skill.name}</h1>;
 * }
 * ```
 * 
 * @returns 单个技能数据和加载状态
 */
export function useSkill(id: string | undefined) {
  const [skill, setSkill] = useState<Skill | undefined>();
  const [status, setStatus] = useState<DataStatus>('loading');

  useEffect(() => {
    ensureDataLoaded().then(() => {
      if (id) {
        setSkill(getSkillsSync().find(s => s.id === id));
      }
      setStatus('ready');
    });
  }, [id]);

  return {
    skill,
    status,
    isLoading: status === 'loading',
  };
}
