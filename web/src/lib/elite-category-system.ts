export interface Subcategory {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  description: string;
  eliteSkills: string[];
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  priority: number;
  featured?: boolean;
  appCount?: number;
  subcategories: Subcategory[];
}

export const ELITE_CATEGORY_SYSTEM: Record<string, Category> = {
  development: {
    id: 'development',
    name: '技术开发',
    name_en: 'Development',
    description: '硬核技术能力，专业开发者必备',
    icon: '💻',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    priority: 1,
    subcategories: [
      {
        id: 'frontend',
        name: '前端开发',
        name_en: 'Frontend',
        icon: '🎨',
        description: 'React/Vue/TypeScript/性能优化',
        eliteSkills: ['React专家', 'Vue架构师', 'TypeScript大师', 'CSS魔法师', '性能优化专家', '组件设计系统']
      },
      {
        id: 'backend',
        name: '后端架构',
        name_en: 'Backend',
        icon: '🏗️',
        description: 'API设计/数据库/微服务',
        eliteSkills: ['API架构师', '数据库专家', '微服务设计', '并发编程', '安全审计']
      },
      {
        id: 'devops',
        name: '运维部署',
        name_en: 'DevOps',
        icon: '🚀',
        description: 'Docker/K8s/CI-CD/云服务',
        eliteSkills: ['Docker专家', 'Kubernetes运维', 'CI-CD流水线', '云架构师', '监控告警']
      },
      {
        id: 'codequality',
        name: '代码质量',
        name_en: 'Code Quality',
        icon: '✨',
        description: '重构/测试/设计模式',
        eliteSkills: ['代码重构专家', '测试驱动开发', '代码审查官', '设计模式顾问']
      }
    ]
  },
  content: {
    id: 'content',
    name: '内容创作',
    name_en: 'Content Creation',
    description: '专业文案、营销内容、创意写作',
    icon: '✍️',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    priority: 2,
    subcategories: [
      {
        id: 'professional',
        name: '专业写作',
        name_en: 'Professional Writing',
        icon: '📝',
        description: '公文/论文/报告/商务邮件',
        eliteSkills: ['公文写作专家', '学术论文助手', '商务邮件大师', '报告撰写顾问', '新闻稿撰写']
      },
      {
        id: 'marketing',
        name: '营销文案',
        name_en: 'Marketing Copy',
        icon: '📣',
        description: '短视频/公众号/广告文案',
        eliteSkills: ['短视频脚本', '公众号小编', '广告文案大师', '品牌slogan', '海报文案']
      },
      {
        id: 'creative',
        name: '创意内容',
        name_en: 'Creative Writing',
        icon: '🌈',
        description: '小说/剧本/诗歌/故事',
        eliteSkills: ['小说创作家', '剧本编剧', '诗歌诗人', '故事策划师', '脑洞创意']
      }
    ]
  },
  business: {
    id: 'business',
    name: '商业管理',
    name_en: 'Business Management',
    description: '商业战略、运营增长、财务风控',
    icon: '📊',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    priority: 3,
    subcategories: [
      {
        id: 'strategy',
        name: '战略决策',
        name_en: 'Strategy',
        icon: '🎯',
        description: 'SWOT/竞品/商业计划书',
        eliteSkills: ['SWOT分析专家', '竞品分析师', '商业计划书', '股权设计师', '商业模式']
      },
      {
        id: 'operation',
        name: '运营增长',
        name_en: 'Operations',
        icon: '📈',
        description: '用户运营/活动/数据分析',
        eliteSkills: ['用户运营专家', '活动策划师', '增长黑客', '数据分析师', '转化优化']
      },
      {
        id: 'finance',
        name: '财务管理',
        name_en: 'Finance',
        icon: '💰',
        description: '报表/预算/税务/投融资',
        eliteSkills: ['财务报表专家', '预算规划师', '税务顾问', '投融资顾问', '风控专家']
      }
    ]
  },
  education: {
    id: 'education',
    name: '教育学习',
    name_en: 'Education',
    description: '语言学习、思维训练、职业技能',
    icon: '🎓',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    priority: 4,
    subcategories: [
      {
        id: 'language',
        name: '语言学习',
        name_en: 'Language',
        icon: '🌍',
        description: '雅思/托福/商务英语',
        eliteSkills: ['雅思备考', '托福写作', '商务英语', '翻译官', '日语韩语']
      },
      {
        id: 'thinking',
        name: '思维训练',
        name_en: 'Thinking Skills',
        icon: '🧠',
        description: '批判性思维/结构化思维',
        eliteSkills: ['批判性思维', '结构化思考', '费曼学习法', '逻辑训练', '决策模型']
      },
      {
        id: 'career',
        name: '职业技能',
        name_en: 'Career Skills',
        icon: '💼',
        description: '面试/PPT/Excel/汇报',
        eliteSkills: ['面试辅导', 'PPT大师', 'Excel专家', '职场汇报', '职业规划']
      }
    ]
  },
  lifestyle: {
    id: 'lifestyle',
    name: '生活服务',
    name_en: 'Lifestyle Services',
    description: '情感心理、健康生活、实用工具',
    icon: '🌟',
    color: 'rose',
    gradient: 'from-rose-500 to-orange-500',
    priority: 5,
    subcategories: [
      {
        id: 'emotion',
        name: '情感心理',
        name_en: 'Emotion & Psychology',
        icon: '💝',
        description: '心理咨询/恋爱/人际',
        eliteSkills: ['心理咨询师', '恋爱顾问', '人际沟通', '情绪管理', '情商提升']
      },
      {
        id: 'health',
        name: '健康生活',
        name_en: 'Health',
        icon: '💪',
        description: '健身/饮食/睡眠/养生',
        eliteSkills: ['健身私教', '营养师', '睡眠顾问', '中医养生', '减重专家']
      },
      {
        id: 'utility',
        name: '实用工具',
        name_en: 'Utilities',
        icon: '🛠️',
        description: '起名/简历/旅游/法律',
        eliteSkills: ['起名大师', '简历优化', '旅游攻略', '法律常识', '职场礼仪']
      }
    ]
  },
  entertainment: {
    id: 'entertainment',
    name: '创意娱乐',
    name_en: 'Entertainment',
    description: '角色扮演、文字游戏、脑洞创意',
    icon: '🎮',
    color: 'amber',
    gradient: 'from-amber-500 to-yellow-500',
    priority: 6,
    subcategories: [
      {
        id: 'roleplay',
        name: '角色扮演',
        name_en: 'Role Play',
        icon: '🎭',
        description: '经典高质量角色对话',
        eliteSkills: ['诸葛亮', '曹操', '苏东坡', '福尔摩斯']
      },
      {
        id: 'game',
        name: '文字游戏',
        name_en: 'Text Games',
        icon: '🎲',
        description: '精品互动文字游戏',
        eliteSkills: ['人生重开', '修仙模拟器', '剧本杀DM']
      }
    ]
  }
};

export function getAllEliteSkills(): string[] {
  const allSkills: string[] = [];
  for (const category of Object.values(ELITE_CATEGORY_SYSTEM)) {
    for (const sub of category.subcategories) {
      allSkills.push(...sub.eliteSkills);
    }
  }
  return allSkills;
}

export function getSkillCategoryPath(skillName: string): {
  category: Category;
  subcategory: Subcategory;
  categoryId: string;
  subcategoryId: string;
} | null {
  for (const [categoryId, category] of Object.entries(ELITE_CATEGORY_SYSTEM)) {
    for (const subcategory of category.subcategories) {
      if (subcategory.eliteSkills.includes(skillName)) {
        return { category, subcategory, categoryId, subcategoryId: subcategory.id };
      }
    }
  }
  return null;
}

export function getCategoryBreadcrumb(categoryId: string, subcategoryId?: string): string[] {
  const breadcrumb: string[] = [];
  const category = ELITE_CATEGORY_SYSTEM[categoryId];
  if (category) {
    breadcrumb.push(category.name);
    if (subcategoryId) {
      const sub = category.subcategories.find(s => s.id === subcategoryId);
      if (sub) breadcrumb.push(sub.name);
    }
  }
  return breadcrumb;
}
