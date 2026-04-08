export const APP_CONFIG = {
  name: 'Mobile Skills',
  version: '1.0.0',
  description: 'AI Skill 生态系统',
  url: 'https://badhope.github.io/mobile-skills',
  github: 'https://github.com/badhope/mobile-skills',
  author: 'Mobile Skills Team',
} as const;

export const STORAGE_KEYS = {
  PREFERENCES: 'user-preferences',
  FAVORITES: 'skill-favorites',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent-searches',
} as const;

export const CACHE_CONFIG = {
  SKILLS_DATA_TTL: 5 * 60 * 1000,
  SEARCH_RESULTS_TTL: 2 * 60 * 1000,
  MAX_RECENT_SEARCHES: 10,
} as const;

export const UI_CONFIG = {
  ITEMS_PER_PAGE_DEFAULT: 20,
  ITEMS_PER_PAGE_OPTIONS: [12, 20, 36, 48],
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
} as const;

export const CATEGORY_CONFIG = {
  functional: {
    icon: '🛠️',
    name: { 'zh-CN': '功能型', 'en-US': 'Functional' },
    gradient: 'from-indigo-500 to-purple-600',
    color: '#6366f1, #8b5cf6',
    description: { 'zh-CN': '实用工具与功能型技能', 'en-US': 'Utility and functional skills' },
    subcategories: {
      'data-analysis': { icon: '📊', name: { 'zh-CN': '数据分析', 'en-US': 'Data Analysis' } },
      'programming': { icon: '💻', name: { 'zh-CN': '编程开发', 'en-US': 'Programming' } },
      'productivity': { icon: '⚡', name: { 'zh-CN': '效率工具', 'en-US': 'Productivity' } },
      'translation': { icon: '🌐', name: { 'zh-CN': '语言翻译', 'en-US': 'Translation' } },
      'automation': { icon: '🤖', name: { 'zh-CN': '自动化', 'en-US': 'Automation' } }
    }
  },
  professional: {
    icon: '💼',
    name: { 'zh-CN': '专业型', 'en-US': 'Professional' },
    gradient: 'from-pink-400 to-rose-500',
    color: '#ec4899, #f43f5e',
    description: { 'zh-CN': '专业领域专家技能', 'en-US': 'Professional domain expert skills' },
    subcategories: {
      'legal': { icon: '⚖️', name: { 'zh-CN': '法律咨询', 'en-US': 'Legal' } },
      'medical': { icon: '🏥', name: { 'zh-CN': '医疗健康', 'en-US': 'Medical' } },
      'finance': { icon: '💰', name: { 'zh-CN': '金融投资', 'en-US': 'Finance' } },
      'psychology': { icon: '🧠', name: { 'zh-CN': '心理咨询', 'en-US': 'Psychology' } },
      'consulting': { icon: '📋', name: { 'zh-CN': '管理咨询', 'en-US': 'Consulting' } }
    }
  },
  creative: {
    icon: '🎨',
    name: { 'zh-CN': '创意型', 'en-US': 'Creative' },
    gradient: 'from-cyan-400 to-cyan-500',
    color: '#06b6d4, #0891b2',
    description: { 'zh-CN': '创意与艺术类技能', 'en-US': 'Creative and artistic skills' },
    subcategories: {
      'design': { icon: '🎨', name: { 'zh-CN': '视觉设计', 'en-US': 'Design' } },
      'writing': { icon: '✍️', name: { 'zh-CN': '内容创作', 'en-US': 'Writing' } },
      'music': { icon: '🎵', name: { 'zh-CN': '音乐制作', 'en-US': 'Music' } },
      'video': { icon: '🎬', name: { 'zh-CN': '影视制作', 'en-US': 'Video' } },
      'photography': { icon: '📷', name: { 'zh-CN': '摄影', 'en-US': 'Photography' } }
    }
  },
  character: {
    icon: '🎭',
    name: { 'zh-CN': '角色型', 'en-US': 'Character' },
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    color: '#8b5cf6, #a855f7, #d946ef',
    description: { 'zh-CN': '角色扮演类技能', 'en-US': 'Role-playing skills' },
    subcategories: {
      'anime-shonen': { icon: '🔥', name: { 'zh-CN': '热血动漫', 'en-US': 'Shonen Anime' } },
      'anime-shojo': { icon: '🌸', name: { 'zh-CN': '少女动漫', 'en-US': 'Shojo Anime' } },
      'anime-seinen': { icon: '🌙', name: { 'zh-CN': '青年动漫', 'en-US': 'Seinen Anime' } },
      'game-rpg': { icon: '⚔️', name: { 'zh-CN': '游戏角色', 'en-US': 'Game RPG' } },
      'original-oc': { icon: '✨', name: { 'zh-CN': '原创角色', 'en-US': 'Original OC' } },
      'healing-warm': { icon: '💖', name: { 'zh-CN': '治愈温暖', 'en-US': 'Healing' } },
      'companion-friend': { icon: '🤝', name: { 'zh-CN': '陪伴伙伴', 'en-US': 'Companion' } },
      'mentor-guide': { icon: '🎓', name: { 'zh-CN': '导师指引', 'en-US': 'Mentor' } },
      'fantasy-hero': { icon: '🧙', name: { 'zh-CN': '奇幻英雄', 'en-US': 'Fantasy Hero' } },
      'scifi-cyber': { icon: '🤖', name: { 'zh-CN': '科幻赛博', 'en-US': 'Sci-Fi Cyber' } },
      'historical': { icon: '📜', name: { 'zh-CN': '历史人物', 'en-US': 'Historical' } },
      'celebrity': { icon: '⭐', name: { 'zh-CN': '名人明星', 'en-US': 'Celebrity' } },
      'villain-antagonist': { icon: '😈', name: { 'zh-CN': '反派角色', 'en-US': 'Villain' } },
      'comedy-funny': { icon: '😂', name: { 'zh-CN': '搞笑角色', 'en-US': 'Comedy' } },
      'mystery-enigmatic': { icon: '🔮', name: { 'zh-CN': '神秘角色', 'en-US': 'Mystery' } },
      'warrior-fighter': { icon: '🗡️', name: { 'zh-CN': '战士武者', 'en-US': 'Warrior' } },
      'mage-sorcerer': { icon: '🌟', name: { 'zh-CN': '法师巫师', 'en-US': 'Mage' } },
      'assassin-ninja': { icon: '🥷', name: { 'zh-CN': '刺客忍者', 'en-US': 'Assassin' } },
      'princess-royal': { icon: '👑', name: { 'zh-CN': '公主皇室', 'en-US': 'Princess' } },
      'demon-supernatural': { icon: '👹', name: { 'zh-CN': '恶魔超自然', 'en-US': 'Demon' } }
    }
  },
  fiction: {
    icon: '📖',
    name: { 'zh-CN': '虚构世界', 'en-US': 'Fiction' },
    gradient: 'from-green-400 to-teal-400',
    color: '#10b981, #14b8a6',
    description: { 'zh-CN': '虚构世界与故事类技能', 'en-US': 'Fictional world and story skills' },
    subcategories: {
      'eastern-fantasy': { icon: '🐉', name: { 'zh-CN': '东方玄幻', 'en-US': 'Eastern Fantasy' } },
      'western-fantasy': { icon: '🏰', name: { 'zh-CN': '西方奇幻', 'en-US': 'Western Fantasy' } },
      'scifi': { icon: '🚀', name: { 'zh-CN': '科幻未来', 'en-US': 'Sci-Fi' } },
      'mystery': { icon: '🔍', name: { 'zh-CN': '悬疑推理', 'en-US': 'Mystery' } },
      'urban': { icon: '🌃', name: { 'zh-CN': '都市异能', 'en-US': 'Urban' } },
      'apocalypse': { icon: '☢️', name: { 'zh-CN': '末世废土', 'en-US': 'Apocalypse' } },
      'wuxia': { icon: '⚔️', name: { 'zh-CN': '武侠江湖', 'en-US': 'Wuxia' } },
      'xianxia': { icon: '🌟', name: { 'zh-CN': '仙侠修真', 'en-US': 'Xianxia' } },
      'magic': { icon: '✨', name: { 'zh-CN': '魔法世界', 'en-US': 'Magic' } },
      'horror': { icon: '👻', name: { 'zh-CN': '灵异恐怖', 'en-US': 'Horror' } }
    }
  },
  lifestyle: {
    icon: '🏠',
    name: { 'zh-CN': '生活服务', 'en-US': 'Lifestyle' },
    gradient: 'from-orange-400 to-amber-500',
    color: '#fb923c, #f59e0b',
    description: { 'zh-CN': '日常生活服务技能', 'en-US': 'Daily life service skills' },
    subcategories: {
      'fitness': { icon: '💪', name: { 'zh-CN': '健康健身', 'en-US': 'Fitness' } },
      'nutrition': { icon: '🥗', name: { 'zh-CN': '美食营养', 'en-US': 'Nutrition' } },
      'travel': { icon: '✈️', name: { 'zh-CN': '旅行规划', 'en-US': 'Travel' } },
      'life-management': { icon: '📅', name: { 'zh-CN': '生活管理', 'en-US': 'Life Management' } },
      'wedding': { icon: '💒', name: { 'zh-CN': '婚礼策划', 'en-US': 'Wedding' } }
    }
  },
  education: {
    icon: '📚',
    name: { 'zh-CN': '教育学习', 'en-US': 'Education' },
    gradient: 'from-blue-400 to-indigo-500',
    color: '#60a5fa, #6366f1',
    description: { 'zh-CN': '教育与学习辅导技能', 'en-US': 'Education and learning skills' },
    subcategories: {
      'tutoring': { icon: '📖', name: { 'zh-CN': '学习辅导', 'en-US': 'Tutoring' } },
      'exam-prep': { icon: '📝', name: { 'zh-CN': '考试准备', 'en-US': 'Exam Prep' } },
      'skill-training': { icon: '🎯', name: { 'zh-CN': '技能培训', 'en-US': 'Skill Training' } },
      'language-learning': { icon: '🗣️', name: { 'zh-CN': '语言学习', 'en-US': 'Language Learning' } },
      'career-guidance': { icon: '🧭', name: { 'zh-CN': '职业规划', 'en-US': 'Career Guidance' } }
    }
  },
  business: {
    icon: '📊',
    name: { 'zh-CN': '商业职场', 'en-US': 'Business' },
    gradient: 'from-emerald-400 to-green-500',
    color: '#34d399, #22c55e',
    description: { 'zh-CN': '商业与职场相关技能', 'en-US': 'Business and career skills' },
    subcategories: {
      'startup': { icon: '🚀', name: { 'zh-CN': '创业指导', 'en-US': 'Startup' } },
      'management': { icon: '👔', name: { 'zh-CN': '管理咨询', 'en-US': 'Management' } },
      'marketing': { icon: '📣', name: { 'zh-CN': '营销策略', 'en-US': 'Marketing' } },
      'sales': { icon: '💼', name: { 'zh-CN': '销售技巧', 'en-US': 'Sales' } },
      'hr': { icon: '👥', name: { 'zh-CN': '人力资源', 'en-US': 'HR' } }
    }
  },
  tool: {
    icon: '🔧',
    name: { 'zh-CN': '工具类', 'en-US': 'Tools' },
    gradient: 'from-violet-400 to-purple-500',
    color: '#a78bfa, #8b5cf6',
    description: { 'zh-CN': '实用工具与辅助技能', 'en-US': 'Utility and assistant tools' },
    subcategories: {
      'code-assistant': { icon: '💻', name: { 'zh-CN': '编程助手', 'en-US': 'Code Assistant' } },
      'writing-tool': { icon: '✍️', name: { 'zh-CN': '写作工具', 'en-US': 'Writing Tool' } },
      'data-tool': { icon: '📊', name: { 'zh-CN': '数据工具', 'en-US': 'Data Tool' } },
      'design-tool': { icon: '🎨', name: { 'zh-CN': '设计工具', 'en-US': 'Design Tool' } },
      'productivity-tool': { icon: '⚡', name: { 'zh-CN': '效率工具', 'en-US': 'Productivity Tool' } }
    }
  },
  game: {
    icon: '🎮',
    name: { 'zh-CN': '游戏互动', 'en-US': 'Games' },
    gradient: 'from-rose-400 to-pink-500',
    color: '#fb7185, #ec4899',
    description: { 'zh-CN': 'AI驱动的互动游戏', 'en-US': 'AI-powered interactive games' },
    subcategories: {
      'werewolf': { icon: '🐺', name: { 'zh-CN': '狼人杀', 'en-US': 'Werewolf' } },
      'rpg': { icon: '⚔️', name: { 'zh-CN': '角色扮演', 'en-US': 'RPG' } },
      'strategy': { icon: '🎯', name: { 'zh-CN': '策略游戏', 'en-US': 'Strategy' } },
      'simulation': { icon: '🏰', name: { 'zh-CN': '模拟游戏', 'en-US': 'Simulation' } },
      'interactive-story': { icon: '📖', name: { 'zh-CN': '互动故事', 'en-US': 'Interactive Story' } }
    }
  }
} as const;

export const SORT_OPTIONS = [
  { value: 'popular', label: { 'zh-CN': '热门优先', 'en-US': 'Most Popular' } },
  { value: 'newest', label: { 'zh-CN': '最新发布', 'en-US': 'Newest' } },
  { value: 'rating', label: { 'zh-CN': '评分最高', 'en-US': 'Highest Rated' } },
  { value: 'name', label: { 'zh-CN': '名称排序', 'en-US': 'Name' } },
] as const;

export const VIEW_OPTIONS = [
  { value: 'grid', label: { 'zh-CN': '网格视图', 'en-US': 'Grid View' }, icon: '▦' },
  { value: 'list', label: { 'zh-CN': '列表视图', 'en-US': 'List View' }, icon: '☰' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { value: 'en-US', label: 'English', flag: '🇺🇸' },
] as const;

export const THEME_OPTIONS = [
  { value: 'light', label: { 'zh-CN': '浅色模式', 'en-US': 'Light Mode' }, icon: '☀️' },
  { value: 'dark', label: { 'zh-CN': '深色模式', 'en-US': 'Dark Mode' }, icon: '🌙' },
  { value: 'system', label: { 'zh-CN': '跟随系统', 'en-US': 'System' }, icon: '💻' },
] as const;
