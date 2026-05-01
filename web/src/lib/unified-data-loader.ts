import type { Skill } from '@/types/skill';
import { runDataHealthCheck } from './data-health-check';
import { generateFinalEliteSkills, FINAL_ELITE_COUNT } from './final-elite-skills';
import { FINAL_ELITE_SYSTEM } from './final-elite-system';

/**
 * 统一技能数据加载器返回的数据结构
 * @property skills - 所有技能的数组
 * @property categories - 所有分类 ID 数组
 * @property categoriesMap - 分类到技能的映射表
 * @property skillsByCategory - 同 categoriesMap，兼容别名
 * @property totalCount - 技能总数
 * @property version - 数据版本号
 */
export interface UnifiedSkillsData {
  skills: Skill[];
  categories: string[];
  categoriesMap: Record<string, Skill[]>;
  skillsByCategory: Record<string, Skill[]>;
  totalCount: number;
  version: string;
}

let globalUnifiedData: UnifiedSkillsData | null = null;

/**
 * 加载统一的技能数据（精英系统）
 * 
 * @remarks
 * 这是核心的数据加载函数，支持服务端和客户端调用。
 * 采用单例模式，首次调用后数据会缓存到内存中，后续调用直接返回缓存。
 * 开发环境下会自动运行数据健康检查。
 * 
 * @returns 包含所有技能、分类、统计的完整数据对象
 * 
 * @example
 * ```ts
 * // Server Component
 * const data = await loadUnifiedSkillsData();
 * console.log(`共加载 ${data.totalCount} 个技能`);
 * ```
 */
export async function loadUnifiedSkillsData(): Promise<UnifiedSkillsData> {
  if (globalUnifiedData) {
    return globalUnifiedData;
  }

  const eliteSkills = generateFinalEliteSkills();
  
  const categories = Object.keys(FINAL_ELITE_SYSTEM);
  const categoriesMap: Record<string, Skill[]> = {};
  categories.forEach(cat => {
    categoriesMap[cat] = eliteSkills.filter(s => (s.category || '').startsWith(cat)) as Skill[];
  });

  globalUnifiedData = {
    skills: eliteSkills as Skill[],
    categories,
    categoriesMap,
    skillsByCategory: categoriesMap,
    totalCount: eliteSkills.length,
    version: '5.0.0-skillora-elite',
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ Skillora 精英系统 v5.0 加载成功，${eliteSkills.length} 个高质量应用`);
    runDataHealthCheck(globalUnifiedData.skills);
  }

  return globalUnifiedData;
}

/**
 * 同步获取所有技能
 * 
 * @remarks
 * 必须先调用过 loadUnifiedSkillsData() 或 ensureDataLoaded()
 * 否则返回空数组。主要用于客户端 hooks。
 * 
 * @returns 技能数组，未初始化时返回空数组
 */
export function getSkillsSync(): Skill[] {
  return globalUnifiedData?.skills || [];
}

/**
 * 根据 ID 同步查找单个技能
 * 
 * @param id - 技能的唯一标识符
 * @returns 找到的技能对象，未找到返回 undefined
 */
export function getSkillByIdSync(id: string): Skill | undefined {
  return getSkillsSync().find(s => s.id === id);
}

/**
 * 使数据缓存失效，强制下次重新加载
 * 
 * @remarks
 * 用于开发环境热更新或数据刷新场景
 */
export function invalidateAllData() {
  globalUnifiedData = null;
}

/**
 * 确保数据已加载（幂等）
 * 
 * @remarks
 * 如果数据未加载或为空，自动调用 loadUnifiedSkillsData()
 * 可安全地多次调用，不会重复加载
 */
export async function ensureDataLoaded() {
  if (!globalUnifiedData || globalUnifiedData.skills.length === 0) {
    await loadUnifiedSkillsData();
  }
}
