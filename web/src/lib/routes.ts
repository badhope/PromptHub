/**
 * 集中管理所有应用路由配置
 * 
 * @remarks
 * 消除魔法字符串，确保路由跳转统一且类型安全。
 * 新增路由时请在此定义，不要在组件中硬编码。
 * 
 * @example
 * ```tsx
 * // 正确 - 使用统一路由
 * router.push(ROUTES.explore);
 * router.push(ROUTES.skill(skill.id));
 * 
 * // 错误 - 硬编码
 * router.push('/explore');       // ❌ 不要这样写！
 * router.push(`/skills/${id}`);  // ❌ 不要这样写！
 * ```
 */
export const ROUTES = {
  /** 首页 */
  home: '/',
  /** 发现页 - 应用商店主入口 */
  explore: '/explore',
  /** 排行榜页 */
  rankings: '/rankings',
  /** 应用收藏集 */
  collections: '/collections',
  /** 用户仪表盘 */
  dashboard: '/dashboard',
  /** 登录页 */
  signin: '/signin',

  /**
   * 分类详情页
   * @param categoryId - 一级分类 ID
   */
  category: (categoryId: string) => `/category/${categoryId}`,

  /**
   * 子分类详情页
   * @param categoryId - 一级分类 ID
   * @param subcategoryId - 二级子分类 ID
   */
  subcategory: (categoryId: string, subcategoryId: string) =>
    `/category/${categoryId}/${subcategoryId}`,

  /**
   * 技能/应用详情页
   * @param skillId - 技能唯一 ID
   */
  skill: (skillId: string) => `/skills/${skillId}`,

  /** 开发者后台相关路由 */
  developer: {
    /** 开发者仪表盘 */
    dashboard: '/developer/dashboard',
  },

  /** API 路由 */
  api: {
    /** LLM 接口相关 */
    llm: {
      /** 聊天接口 */
      chat: '/api/llm/chat',
    },
  },
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
