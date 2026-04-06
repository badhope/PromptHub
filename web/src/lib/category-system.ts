import type { CategorySystem, Skill } from '@/types/skill';

export const MULTI_LEVEL_CATEGORY_SYSTEM: CategorySystem = {
  functional: {
    id: 'functional',
    name: '功能型',
    name_en: 'Functional',
    description: '实用工具类技能，帮助您完成日常任务和提升工作效率',
    icon: '🛠️',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    subcategories: [
      {
        id: 'writing',
        name: '写作辅助',
        name_en: 'Writing Assistance',
        icon: '✍️',
        description: '论文助手、PPT助手、润色助手、翻译助手等写作工具',
        skills: ['论文助手', 'PPT助手', '润色助手', '翻译助手', '摘要生成', '大纲生成', '内容扩写', '风格转换']
      },
      {
        id: 'productivity',
        name: '效率提升',
        name_en: 'Productivity',
        icon: '⚡',
        description: '日程管理、任务规划、时间管理等效率工具',
        skills: ['日程管理', '任务规划', '时间管理', '目标设定', '习惯养成', '效率分析']
      },
      {
        id: 'data',
        name: '数据处理',
        name_en: 'Data Processing',
        icon: '📊',
        description: '数据分析、图表生成、报告生成等数据处理工具',
        skills: ['数据分析', '图表生成', '报告生成', '数据可视化', '统计分析']
      },
      {
        id: 'programming',
        name: '编程开发',
        name_en: 'Programming',
        icon: '💻',
        description: '代码生成、代码审查、Bug修复等编程工具',
        skills: ['代码生成', '代码审查', 'Bug修复', 'API文档', '测试用例', '代码优化']
      },
      {
        id: 'consulting',
        name: '专业咨询',
        name_en: 'Consulting',
        icon: '💼',
        description: '法律咨询、财务咨询、投资建议等专业咨询服务',
        skills: ['法律咨询', '财务咨询', '投资建议', '商业计划', '市场分析']
      },
      {
        id: 'automation',
        name: '自动化工具',
        name_en: 'Automation',
        icon: '🤖',
        description: '工作流自动化、批量处理、定时任务等自动化工具',
        skills: ['工作流自动化', '批量处理', '定时任务', '脚本生成', 'API集成']
      }
    ]
  },
  professional: {
    id: 'professional',
    name: '专业型',
    name_en: 'Professional',
    description: '专业领域技能，提供深度专业知识和咨询服务',
    icon: '💼',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    subcategories: [
      {
        id: 'health',
        name: '医疗健康',
        name_en: 'Healthcare',
        icon: '🏥',
        description: '健康评估、症状分析、用药指导、喝水提醒等健康服务',
        skills: ['健康评估助手', '症状分析助手', '用药指导助手', '康复建议助手', '心理健康助手', '营养咨询助手', '喝水提醒助手', '运动指导助手']
      },
      {
        id: 'legal',
        name: '法律专业',
        name_en: 'Legal',
        icon: '⚖️',
        description: '法律咨询、合同审查、案例分析等法律服务',
        skills: ['法律咨询助手', '合同审查助手', '案例分析助手', '法规解读助手', '诉讼指导助手']
      },
      {
        id: 'finance',
        name: '金融财务',
        name_en: 'Finance',
        icon: '💰',
        description: '投资分析、财务规划、税务咨询等金融服务',
        skills: ['投资分析助手', '财务规划助手', '税务咨询助手', '风险评估助手', '理财建议助手']
      },
      {
        id: 'education',
        name: '教育培训',
        name_en: 'Education',
        icon: '📚',
        description: '课程设计、学习计划、考试辅导等教育服务',
        skills: ['课程设计助手', '学习计划助手', '考试辅导助手', '职业规划助手', '技能培训助手']
      },
      {
        id: 'engineering',
        name: '技术工程',
        name_en: 'Engineering',
        icon: '🔧',
        description: '技术方案、系统架构、性能优化等工程服务',
        skills: ['技术方案助手', '系统架构助手', '性能优化助手', '安全评估助手', '技术选型助手']
      }
    ]
  },
  creative: {
    id: 'creative',
    name: '创意型',
    name_en: 'Creative',
    description: '创意内容生成技能，激发您的创造力',
    icon: '🎨',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    subcategories: [
      {
        id: 'art',
        name: '艺术设计',
        name_en: 'Art & Design',
        icon: '🎨',
        description: '绘画指导、设计灵感、配色方案等艺术设计工具',
        skills: ['绘画指导', '设计灵感', '配色方案', '排版设计', 'UI设计']
      },
      {
        id: 'music',
        name: '音乐创作',
        name_en: 'Music',
        icon: '🎵',
        description: '作曲编曲、歌词创作、音乐分析等音乐创作工具',
        skills: ['作曲编曲', '歌词创作', '音乐分析', '乐器学习', '音乐制作']
      },
      {
        id: 'video',
        name: '视频制作',
        name_en: 'Video Production',
        icon: '🎬',
        description: '脚本创作、分镜设计、剪辑指导等视频制作工具',
        skills: ['脚本创作', '分镜设计', '剪辑指导', '特效制作', '配音指导']
      },
      {
        id: 'literature',
        name: '文学创作',
        name_en: 'Literature',
        icon: '✍️',
        description: '小说创作、诗歌创作、剧本创作等文学创作工具',
        skills: ['小说创作', '诗歌创作', '剧本创作', '散文写作', '创意写作']
      }
    ]
  },
  character: {
    id: 'character',
    name: '角色型',
    name_en: 'Character',
    description: '角色扮演技能，体验不同角色的对话风格',
    icon: '🎭',
    color: 'pink',
    gradient: 'from-pink-400 to-purple-400',
    subcategories: [
      {
        id: 'anime',
        name: '动漫角色',
        name_en: 'Anime Characters',
        icon: '🎌',
        description: '海贼王、火影忍者、咒术回战、鬼灭之刃等热门动漫角色',
        skills: []
      },
      {
        id: 'novel',
        name: '小说角色',
        name_en: 'Novel Characters',
        icon: '📖',
        description: '起点金奖、番茄热门、晋江文学城等网文角色',
        skills: []
      },
      {
        id: 'game',
        name: '游戏角色',
        name_en: 'Game Characters',
        icon: '🎮',
        description: '原神、王者荣耀、英雄联盟等游戏角色',
        skills: []
      },
      {
        id: 'history',
        name: '历史人物',
        name_en: 'Historical Figures',
        icon: '📜',
        description: '中国历史、世界历史、科学家、文学家等历史人物',
        skills: []
      },
      {
        id: 'movie',
        name: '电影角色',
        name_en: 'Movie Characters',
        icon: '🎬',
        description: '经典电影、热门电影、奥斯卡获奖等电影角色',
        skills: []
      },
      {
        id: 'original',
        name: '原创角色',
        name_en: 'Original Characters',
        icon: '✨',
        description: '猫娘、女朋友、男朋友、宠物等原创角色',
        skills: []
      }
    ]
  },
  fiction: {
    id: 'fiction',
    name: '虚构世界',
    name_en: 'Fiction',
    description: '虚构世界构建技能，创造独特的幻想世界',
    icon: '📖',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    subcategories: [
      {
        id: 'fantasy',
        name: '奇幻世界',
        name_en: 'Fantasy World',
        icon: '🧙',
        description: '魔法世界、精灵王国、龙族世界、仙侠世界等奇幻世界',
        skills: []
      },
      {
        id: 'scifi',
        name: '科幻世界',
        name_en: 'Sci-Fi World',
        icon: '🚀',
        description: '赛博朋克、太空歌剧、末日废土、时间旅行等科幻世界',
        skills: []
      },
      {
        id: 'wuxia',
        name: '武侠世界',
        name_en: 'Wuxia World',
        icon: '⚔️',
        description: '江湖世界、武林门派、武侠冒险、侠义传说等武侠世界',
        skills: []
      }
    ]
  },
  tool: {
    id: 'tool',
    name: '工具类',
    name_en: 'Tools',
    description: '实用工具与辅助技能，提升工作效率',
    icon: '🔧',
    color: 'violet',
    gradient: 'from-violet-400 to-purple-500',
    subcategories: [
      {
        id: 'office',
        name: '办公工具',
        name_en: 'Office Tools',
        icon: '📊',
        description: 'PPT制作、Excel处理、Word编辑、PDF转换等办公工具',
        skills: ['PPT制作', 'Excel处理', 'Word编辑', 'PDF转换', '文档管理']
      },
      {
        id: 'daily',
        name: '日常工具',
        name_en: 'Daily Tools',
        icon: '📅',
        description: '日程提醒、待办事项、记账助手、天气查询等日常工具',
        skills: ['日程提醒', '待办事项', '记账助手', '天气查询', '汇率转换']
      },
      {
        id: 'learning',
        name: '学习工具',
        name_en: 'Learning Tools',
        icon: '📚',
        description: '单词记忆、题目解答、知识问答、学习计划等学习工具',
        skills: ['单词记忆', '题目解答', '知识问答', '学习计划', '考试准备']
      }
    ]
  },
  game: {
    id: 'game',
    name: '游戏互动',
    name_en: 'Games',
    description: 'AI驱动的互动游戏，享受游戏乐趣',
    icon: '🎮',
    color: 'rose',
    gradient: 'from-rose-400 to-pink-500',
    subcategories: [
      {
        id: 'social',
        name: '社交推理',
        name_en: 'Social Deduction',
        icon: '🔍',
        description: '狼人杀、剧本杀、谁是卧底、阿瓦隆等社交推理游戏',
        skills: ['狼人杀', '剧本杀', '谁是卧底', '阿瓦隆', '血染钟楼']
      },
      {
        id: 'strategy',
        name: '策略游戏',
        name_en: 'Strategy Games',
        icon: '♟️',
        description: '文字冒险、角色扮演、模拟经营、战棋游戏等策略游戏',
        skills: ['文字冒险', '角色扮演', '模拟经营', '战棋游戏']
      },
      {
        id: 'casual',
        name: '休闲游戏',
        name_en: 'Casual Games',
        icon: '🎯',
        description: '猜谜游戏、文字接龙、成语接龙、知识问答等休闲游戏',
        skills: ['猜谜游戏', '文字接龙', '成语接龙', '知识问答']
      }
    ]
  }
};

export const getSubcategorySkills = (categoryId: string, subcategoryId: string, allSkills: Skill[]) => {
  const category = MULTI_LEVEL_CATEGORY_SYSTEM[categoryId];
  if (!category) return [];
  
  const subcategory = category.subcategories.find(s => s.id === subcategoryId);
  if (!subcategory) return [];
  
  if (subcategory.skills.length === 0) {
    return allSkills.filter(skill => {
      const tags = skill.categorization.tags || [];
      const secondaryCategories = skill.categorization.secondary_categories || [];
      return tags.some((tag: string) => 
        tag.toLowerCase().includes(subcategoryId) || 
        subcategory.name.includes(tag)
      ) || secondaryCategories.some((cat: string) => 
        cat.toLowerCase().includes(subcategoryId)
      );
    });
  }
  
  return allSkills.filter(skill => 
    subcategory.skills.some(skillName => 
      skill.name.includes(skillName) || 
      skill.categorization.tags.some((tag: string) => skillName.includes(tag))
    )
  );
};

export const getCategorySkills = (categoryId: string, allSkills: Skill[]) => {
  return allSkills.filter(skill => skill.categorization.primary_category === categoryId);
};
