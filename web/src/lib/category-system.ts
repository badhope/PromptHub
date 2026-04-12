import type { CategorySystem, Skill, SkillSummary } from '@/types/skill';

function isSkillWithCategorization(skill: Skill | SkillSummary): skill is Skill & { categorization: NonNullable<Skill['categorization']> } {
  return 'categorization' in skill && skill.categorization != null;
}

export const MULTI_LEVEL_CATEGORY_SYSTEM: CategorySystem = {
  tool: {
    id: 'tool',
    name: '工具类',
    name_en: 'Tools',
    description: '普通人真正会用的实用工具，解决日常各种问题',
    icon: '🛠️',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    subcategories: [
      {
        id: 'daily',
        name: '日常工具',
        name_en: 'Daily Tools',
        icon: '🏠',
        description: '图片处理、职场、育儿、社交、生活服务',
        skills: ['AI抠图', '去水印', '证件照', '简历优化', '周报', '请假', '作业辅导', '起名', '投诉维权', '砍价', '检讨书']
      },
      {
        id: 'development',
        name: '开发工具',
        name_en: 'Development',
        icon: '💻',
        description: '编程、代码生成、架构设计、开发辅助',
        skills: ['前端开发', '后端开发', '算法设计', '架构设计', '代码审查', '自动化工具']
      }
    ]
  },
  character: {
    id: 'character',
    name: '角色类',
    name_en: 'Characters',
    description: '各种有趣的角色扮演，体验不同的人生',
    icon: '🎭',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    subcategories: [
      {
        id: 'character',
        name: '经典角色',
        name_en: 'Classic Characters',
        icon: '👤',
        description: '历史名人、经典人物、经典角色对话',
        skills: ['诸葛亮', '曹操', '孙悟空', '唐僧', '甄嬛', '魏璎珞']
      },
      {
        id: 'comedy',
        name: '搞笑整活',
        name_en: 'Comedy',
        icon: '😂',
        description: '嘴替、杠精、各种搞笑人格',
        skills: ['罗永浩', '高晓松', '郭德纲', '周树人', '毒舌吐槽', '鸡汤大师']
      },
      {
        id: 'anime-waifu',
        name: '动漫老婆',
        name_en: 'Anime Waifu',
        icon: '💖',
        description: '二次元老婆/老公合集',
        skills: ['初音未来', '刻晴', '甘雨', '雷电将军', '八重神子', '散兵']
      }
    ]
  },
  fiction: {
    id: 'fiction',
    name: '小说/剧情',
    name_en: 'Fiction',
    description: '文字冒险、剧情模拟、小说生成',
    icon: '📖',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    subcategories: [
      {
        id: 'xianxia',
        name: '仙侠世界',
        name_en: 'Xianxia',
        icon: '⚔️',
        description: '修仙、玄幻、仙侠类剧情模拟',
        skills: ['凡人修仙', '无限流', '诡秘之主', '斗破苍穹', '全职法师']
      },
      {
        id: 'history',
        name: '历史穿越',
        name_en: 'History',
        icon: '🏯',
        description: '穿越历史、改变人生',
        skills: ['回到明朝', '三国争霸', '大唐盛世', '清宫剧', '民国风云']
      },
      {
        id: 'anime',
        name: '动漫同人',
        name_en: 'Anime',
        icon: '🎌',
        description: '动漫世界冒险',
        skills: ['火影忍者', '海贼王', '进击的巨人', '鬼灭之刃', '咒术回战']
      },
      {
        id: 'controversy',
        name: '争议话题',
        name_en: 'Controversy',
        icon: '🌶️',
        description: '魔幻现实主义、争议人物、敏感话题',
        skills: ['不说真话主持人', '打太极发言人', '各种争议人物']
      }
    ]
  },
  game: {
    id: 'game',
    name: '游戏类',
    name_en: 'Games',
    description: '文字游戏、策略模拟、人生重开',
    icon: '🎮',
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    subcategories: [
      {
        id: 'game',
        name: '文字游戏',
        name_en: 'Text Games',
        icon: '🎲',
        description: '人生重开、文字冒险、选择类游戏',
        skills: ['人生重开模拟器', '打工模拟器', '恋爱模拟器', '修仙模拟器']
      },
      {
        id: 'strategy',
        name: '策略经营',
        name_en: 'Strategy',
        icon: '♟️',
        description: '商业、经营、策略类游戏',
        skills: ['商业帝国', '股市模拟', '官场模拟', '后宫模拟器']
      },
      {
        id: 'wuxia',
        name: '武侠江湖',
        name_en: 'Wuxia',
        icon: '🥷',
        description: '武侠类游戏和剧情',
        skills: ['金庸群侠传', '古龙武侠', '武林盟主', '江湖恩怨']
      }
    ]
  },
  professional: {
    id: 'professional',
    name: '专业类',
    name_en: 'Professional',
    description: '专业领域深度技能',
    icon: '🎓',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    subcategories: [
      {
        id: 'professional',
        name: '专业服务',
        name_en: 'Professional Services',
        icon: '💼',
        description: '法律、医疗、财务、教育专业咨询',
        skills: ['法律咨询', '医疗建议', '财务规划', '心理咨询', '职业规划']
      },
      {
        id: 'business',
        name: '商业战略',
        name_en: 'Business',
        icon: '📈',
        description: '商业分析、战略规划、管理咨询',
        skills: ['商业计划书', '市场分析', '竞品分析', '组织设计', '股权设计']
      }
    ]
  }
};

export function getCategoryInfo(categoryId: string) {
  for (const [catKey, category] of Object.entries(MULTI_LEVEL_CATEGORY_SYSTEM)) {
    if (catKey === categoryId) {
      return category;
    }
    const subs = category.subcategories;
    if (Array.isArray(subs)) {
      const sub = subs.find(s => s.id === categoryId);
      if (sub) {
        return { ...sub, parent: category };
      }
    } else if (subs) {
      for (const sub of Object.values(subs)) {
        if (sub.id === categoryId) {
          return { ...sub, parent: category };
        }
      }
    }
  }
  return null;
}

export function countSkillsBySubcategory(skills: readonly (Skill | SkillSummary)[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  for (let i = 0, len = skills.length; i < len; i++) {
    const skill = skills[i];
    if (isSkillWithCategorization(skill)) {
      const sub = skill.categorization.subcategory;
      if (sub) {
        counts[sub] = (counts[sub] || 0) + 1;
      }
    }
  }
  
  return counts;
}

export function getCategorySkills<T extends Skill | SkillSummary>(categoryId: string, skills: readonly T[]): T[] {
  const result: T[] = [];
  for (let i = 0, len = skills.length; i < len; i++) {
    const skill = skills[i];
    if (isSkillWithCategorization(skill) && skill.categorization.primary_category === categoryId) {
      result.push(skill);
    }
  }
  return result;
}

export function getSubcategorySkills<T extends Skill | SkillSummary>(categoryId: string, subcategoryId: string, skills: readonly T[]): T[] {
  const result: T[] = [];
  for (let i = 0, len = skills.length; i < len; i++) {
    const skill = skills[i];
    if (
      isSkillWithCategorization(skill) &&
      skill.categorization.primary_category === categoryId &&
      skill.categorization.subcategory === subcategoryId
    ) {
      result.push(skill);
    }
  }
  return result;
}
