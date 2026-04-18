export const APP_CONFIG = {
  name: 'PromptHub',
  version: '2.0.0',
  description: 'AI Prompt 精选平台',
  url: 'https://badhope.github.io/mobile-skills',
  github: 'https://github.com/badhope/mobile-skills',
  author: 'PromptHub Team',
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
  game: {
    icon: '🎮',
    name: { 'zh-CN': 'AI游戏', 'en-US': 'AI Games' },
    gradient: 'from-rose-500 to-pink-600',
    color: '#f43f5e, #db2777',
    featured: true,
    description: { 'zh-CN': 'AI驱动的沉浸式互动游戏！狼人杀、剧本杀、人生模拟、无限流！', 'en-US': 'AI-powered interactive games!' },
    subcategories: {
      'werewolf': { icon: '🐺', name: { 'zh-CN': '狼人杀', 'en-US': 'Werewolf' } },
      'rpg': { icon: '⚔️', name: { 'zh-CN': '角色扮演', 'en-US': 'RPG' } },
      'simulation': { icon: '🏰', name: { 'zh-CN': '模拟人生', 'en-US': 'Simulation' } },
      'board': { icon: '🎲', name: { 'zh-CN': '桌游卡牌', 'en-US': 'Board Games' } },
      'interactive-story': { icon: '📖', name: { 'zh-CN': '互动剧本', 'en-US': 'Interactive Story' } }
    }
  },
  fiction: {
    icon: '📖',
    name: { 'zh-CN': '爽文宇宙', 'en-US': 'Novel Universe' },
    gradient: 'from-orange-500 via-red-500 to-rose-500',
    color: '#f97316, #f43f5e',
    featured: true,
    description: { 'zh-CN': '🍅 番茄/起点爽文沉浸式体验！废柴逆袭、系统开挂、重生暴富、末世囤货！', 'en-US': 'Immersive web novel experience!' },
    subcategories: {
      'xianxia': { icon: '🌟', name: { 'zh-CN': '修仙修真', 'en-US': 'Xianxia' } },
      'system': { icon: '🎲', name: { 'zh-CN': '系统流', 'en-US': 'System' } },
      'reborn': { icon: '⏳', name: { 'zh-CN': '重生穿越', 'en-US': 'Reborn' } },
      'apocalypse': { icon: '🧟', name: { 'zh-CN': '末世求生', 'en-US': 'Apocalypse' } },
      'invincible': { icon: '🐢', name: { 'zh-CN': '无敌流', 'en-US': 'Invincible' } },
      'urban': { icon: '🌃', name: { 'zh-CN': '都市异能', 'en-US': 'Urban' } }
    }
  },
  character: {
    icon: '🎭',
    name: { 'zh-CN': '角色对话', 'en-US': 'Characters' },
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
    color: '#a855f7, #8b5cf6, #d946ef',
    featured: true,
    description: { 'zh-CN': '和任何角色对话！动漫人物、历史名人、原创OC、虚拟恋人！', 'en-US': 'Talk to any character!' },
    subcategories: {
      'anime': { icon: '🔥', name: { 'zh-CN': '动漫角色', 'en-US': 'Anime' } },
      'game-character': { icon: '⚔️', name: { 'zh-CN': '游戏角色', 'en-US': 'Game Characters' } },
      'historical': { icon: '👑', name: { 'zh-CN': '历史名人', 'en-US': 'Historical' } },
      'celebrity': { icon: '⭐', name: { 'zh-CN': '明星名人', 'en-US': 'Celebrity' } },
      'lover': { icon: '💖', name: { 'zh-CN': '虚拟恋人', 'en-US': 'Virtual Lover' } },
      'original-oc': { icon: '✨', name: { 'zh-CN': '原创角色', 'en-US': 'Original OC' } }
    }
  },
  creative: {
    icon: '🎨',
    name: { 'zh-CN': '创意创作', 'en-US': 'Creative' },
    gradient: 'from-cyan-500 to-teal-500',
    color: '#06b6d4, #14b8a6',
    description: { 'zh-CN': '写作、设计、音乐、视频创意辅助工具', 'en-US': 'Creative and artistic tools' },
    subcategories: {
      'writing': { icon: '✍️', name: { 'zh-CN': '写作辅助', 'en-US': 'Writing' } },
      'design': { icon: '🎨', name: { 'zh-CN': '设计灵感', 'en-US': 'Design' } },
      'music': { icon: '🎵', name: { 'zh-CN': '音乐制作', 'en-US': 'Music' } },
      'video': { icon: '🎬', name: { 'zh-CN': '视频脚本', 'en-US': 'Video' } },
      'brainstorm': { icon: '💡', name: { 'zh-CN': '头脑风暴', 'en-US': 'Brainstorm' } }
    }
  },
  tools: {
    icon: '⚡',
    name: { 'zh-CN': '效率工具', 'en-US': 'Tools' },
    gradient: 'from-indigo-500 to-purple-600',
    color: '#6366f1, #8b5cf6',
    description: { 'zh-CN': '编程、翻译、数据分析等实用工具', 'en-US': 'Productivity and utility tools' },
    subcategories: {
      'programming': { icon: '💻', name: { 'zh-CN': '编程助手', 'en-US': 'Programming' } },
      'translation': { icon: '🌐', name: { 'zh-CN': '翻译润色', 'en-US': 'Translation' } },
      'productivity': { icon: '🚀', name: { 'zh-CN': '办公效率', 'en-US': 'Productivity' } },
      'data-analysis': { icon: '📊', name: { 'zh-CN': '数据分析', 'en-US': 'Data Analysis' } },
      'automation': { icon: '🤖', name: { 'zh-CN': '自动化', 'en-US': 'Automation' } }
    }
  },
  professional: {
    icon: '💼',
    name: { 'zh-CN': '专业咨询', 'en-US': 'Professional' },
    gradient: 'from-pink-400 to-rose-500',
    color: '#ec4899, #f43f5e',
    description: { 'zh-CN': '法律、医疗、心理、金融专业建议', 'en-US': 'Professional domain advice' },
    subcategories: {
      'legal': { icon: '⚖️', name: { 'zh-CN': '法律咨询', 'en-US': 'Legal' } },
      'medical': { icon: '🏥', name: { 'zh-CN': '医疗建议', 'en-US': 'Medical' } },
      'finance': { icon: '💰', name: { 'zh-CN': '金融理财', 'en-US': 'Finance' } },
      'psychology': { icon: '🧠', name: { 'zh-CN': '心理咨询', 'en-US': 'Psychology' } },
      'career': { icon: '🧭', name: { 'zh-CN': '职业发展', 'en-US': 'Career' } }
    }
  },
  business: {
    icon: '📈',
    name: { 'zh-CN': '商业职场', 'en-US': 'Business' },
    gradient: 'from-emerald-500 to-green-600',
    color: '#10b981, #22c55e',
    description: { 'zh-CN': '创业、营销、管理、职场技能', 'en-US': 'Business and career skills' },
    subcategories: {
      'startup': { icon: '🚀', name: { 'zh-CN': '创业指导', 'en-US': 'Startup' } },
      'marketing': { icon: '📣', name: { 'zh-CN': '营销策划', 'en-US': 'Marketing' } },
      'management': { icon: '👔', name: { 'zh-CN': '团队管理', 'en-US': 'Management' } },
      'sales': { icon: '💼', name: { 'zh-CN': '销售技巧', 'en-US': 'Sales' } },
      'hr': { icon: '👥', name: { 'zh-CN': '人力资源', 'en-US': 'HR' } }
    }
  },
  lifestyle: {
    icon: '🏠',
    name: { 'zh-CN': '生活服务', 'en-US': 'Lifestyle' },
    gradient: 'from-amber-500 to-orange-500',
    color: '#f59e0b, #f97316',
    description: { 'zh-CN': '健身、美食、旅行、生活规划', 'en-US': 'Daily life services' },
    subcategories: {
      'fitness': { icon: '💪', name: { 'zh-CN': '健身计划', 'en-US': 'Fitness' } },
      'food': { icon: '🍳', name: { 'zh-CN': '美食烹饪', 'en-US': 'Cooking' } },
      'travel': { icon: '✈️', name: { 'zh-CN': '旅行攻略', 'en-US': 'Travel' } },
      'dating': { icon: '💕', name: { 'zh-CN': '恋爱脱单', 'en-US': 'Dating' } },
      'lifestyle': { icon: '📅', name: { 'zh-CN': '生活规划', 'en-US': 'Life Planning' } }
    }
  },
  education: {
    icon: '📚',
    name: { 'zh-CN': '学习教育', 'en-US': 'Education' },
    gradient: 'from-blue-500 to-indigo-600',
    color: '#3b82f6, #6366f1',
    description: { 'zh-CN': '学习辅导、考试备考、语言学习', 'en-US': 'Education and learning' },
    subcategories: {
      'tutoring': { icon: '📖', name: { 'zh-CN': '作业辅导', 'en-US': 'Tutoring' } },
      'exam': { icon: '📝', name: { 'zh-CN': '考试备考', 'en-US': 'Exam Prep' } },
      'language': { icon: '🗣️', name: { 'zh-CN': '语言学习', 'en-US': 'Language Learning' } },
      'skills': { icon: '🎯', name: { 'zh-CN': '技能提升', 'en-US': 'Skill Training' } }
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
