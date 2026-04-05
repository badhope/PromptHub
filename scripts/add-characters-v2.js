const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../web/src/skills-data.json');

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const NEW_CHARACTERS = [
  {
    id: "naruto-uzumaki",
    name: "NarutoUzumaki - 漩涡鸣人",
    shortDesc: "热血少年，永不放弃的忍者",
    category: "character",
    subcategory: "anime-shonen",
    tags: ["火影忍者", "热血", "忍者", "友情", "成长", "坚持", "梦想"],
    attributes: { entertainment: 0.8, professional: 0.05, education: 0.15 },
    bestFor: ["热血激励", "友情故事", "成长陪伴", "梦想追逐", "永不放弃"]
  },
  {
    id: "sailor-moon",
    name: "SailorMoon - 水兵月",
    shortDesc: "爱与正义的魔法少女",
    category: "character",
    subcategory: "anime-shojo",
    tags: ["美少女战士", "魔法少女", "爱情", "正义", "友情", "变身"],
    attributes: { entertainment: 0.8, professional: 0.05, education: 0.15 },
    bestFor: ["浪漫故事", "正义守护", "友情陪伴", "魔法冒险", "少女心事"]
  },
  {
    id: "goku-dragon",
    name: "GokuDragon - 孙悟空",
    shortDesc: "不断突破极限的赛亚人战士",
    category: "character",
    subcategory: "anime-shonen",
    tags: ["龙珠", "赛亚人", "战斗", "突破", "修炼", "守护"],
    attributes: { entertainment: 0.85, professional: 0.05, education: 0.1 },
    bestFor: ["战斗热血", "突破极限", "修炼指导", "守护正义", "友情羁绊"]
  },
  {
    id: "link-hyrule",
    name: "LinkHyrule - 林克",
    shortDesc: "海拉鲁王国的勇者",
    category: "character",
    subcategory: "game-rpg",
    tags: ["塞尔达传说", "勇者", "冒险", "解谜", "剑术", "探索"],
    attributes: { entertainment: 0.8, professional: 0.05, education: 0.15 },
    bestFor: ["冒险探索", "解谜挑战", "剑术指导", "勇者故事", "世界探索"]
  },
  {
    id: "aqua-healer",
    name: "AquaHealer - 阿库娅治愈师",
    shortDesc: "温柔体贴的水之治愈师",
    category: "character",
    subcategory: "healing-warm",
    tags: ["治愈", "温柔", "倾听", "安慰", "水元素", "净化"],
    attributes: { entertainment: 0.6, professional: 0.1, education: 0.3 },
    bestFor: ["情绪治愈", "温柔陪伴", "心灵净化", "压力释放", "睡前安抚"]
  },
  {
    id: "mentor-sage",
    name: "MentorSage - 智慧导师",
    shortDesc: "人生道路上的智慧引路人",
    category: "character",
    subcategory: "mentor-guide",
    tags: ["导师", "智慧", "指引", "成长", "人生", "哲学"],
    attributes: { entertainment: 0.3, professional: 0.3, education: 0.4 },
    bestFor: ["人生指导", "智慧分享", "困惑解答", "成长建议", "哲学思考"]
  },
  {
    id: "cyber-hacker",
    name: "CyberHacker - 赛博黑客",
    shortDesc: "穿梭于数字世界的神秘黑客",
    category: "character",
    subcategory: "scifi-cyber",
    tags: ["赛博朋克", "黑客", "网络", "未来", "科技", "反抗"],
    attributes: { entertainment: 0.75, professional: 0.1, education: 0.15 },
    bestFor: ["科技冒险", "网络探索", "未来世界", "反抗精神", "数字生存"]
  },
  {
    id: "historical-scholar",
    name: "HistoricalScholar - 古代学者",
    shortDesc: "博古通今的历史智者",
    category: "character",
    subcategory: "historical",
    tags: ["历史", "学者", "智慧", "古代", "文化", "传承"],
    attributes: { entertainment: 0.4, professional: 0.2, education: 0.4 },
    bestFor: ["历史故事", "文化传承", "古代智慧", "典故讲解", "时代穿越"]
  },
  {
    id: "celebrity-idol",
    name: "CelebrityIdol - 偶像明星",
    shortDesc: "闪耀舞台的人气偶像",
    category: "character",
    subcategory: "celebrity",
    tags: ["偶像", "明星", "舞台", "音乐", "舞蹈", "梦想"],
    attributes: { entertainment: 0.85, professional: 0.05, education: 0.1 },
    bestFor: ["偶像互动", "舞台表演", "追梦故事", "粉丝陪伴", "娱乐八卦"]
  },
  {
    id: "companion-pet",
    name: "CompanionPet - 治愈宠物",
    shortDesc: "永远陪伴在你身边的小可爱",
    category: "character",
    subcategory: "companion-friend",
    tags: ["宠物", "陪伴", "可爱", "治愈", "忠诚", "温暖"],
    attributes: { entertainment: 0.7, professional: 0.05, education: 0.25 },
    bestFor: ["日常陪伴", "治愈时刻", "可爱互动", "情绪安抚", "睡前陪伴"]
  },
  {
    id: "original-dreamer",
    name: "OriginalDreamer - 追梦少女",
    shortDesc: "怀揣梦想勇敢前行的原创角色",
    category: "character",
    subcategory: "original-oc",
    tags: ["原创", "梦想", "青春", "成长", "勇气", "希望"],
    attributes: { entertainment: 0.7, professional: 0.1, education: 0.2 },
    bestFor: ["梦想追逐", "青春故事", "成长陪伴", "勇气鼓励", "希望传递"]
  },
  {
    id: "fantasy-elf",
    name: "FantasyElf - 精灵守护者",
    shortDesc: "来自神秘森林的优雅精灵",
    category: "character",
    subcategory: "fantasy-hero",
    tags: ["精灵", "魔法", "自然", "优雅", "守护", "森林"],
    attributes: { entertainment: 0.75, professional: 0.05, education: 0.2 },
    bestFor: ["奇幻冒险", "自然魔法", "精灵故事", "森林探索", "优雅陪伴"]
  }
];

function makeSkill(c) {
  const now = new Date().toISOString();
  return {
    id: c.id,
    name: c.name,
    version: "1.0.0",
    status: "active",
    categorization: {
      primary_category: c.category,
      secondary_categories: c.subcategory ? [c.subcategory] : [],
      tags: c.tags || [],
      attributes: c.attributes || { entertainment: 0.6, professional: 0.1, education: 0.3 }
    },
    metadata: {
      description: `> **${c.name}** - ${c.shortDesc}`,
      long_description: "",
      author: "mobile-skills-team",
      contributors: [],
      license: "MIT",
      created_at: now,
      updated_at: now,
      language: "zh-CN",
      languages_supported: ["zh-CN", "en"]
    },
    content: {
      raw_url: `https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/${c.category}/${c.id}/SKILL.md`,
      github_url: `https://github.com/badhope/mobile-skills/blob/main/skills/${c.category}/${c.id}/SKILL.md`,
      file_path: `skills/${c.category}/${c.id}/SKILL.md`,
      content_markdown: ""
    },
    capabilities: {
      best_for: c.bestFor || [],
      input_types: ["text/plain", "text/markdown"],
      output_types: ["text/markdown"],
      min_context: 3000,
      mobile_optimized: true,
      timeout: 60000,
      retry: 2
    },
    stats: {
      rating: +(4.5 + Math.random() * 0.5).toFixed(1),
      rating_count: rand(50, 300),
      use_count: rand(3000, 20000),
      favorite_count: rand(200, 1500),
      share_count: rand(100, 800),
      view_count: rand(5000, 30000)
    },
    activation: {
      prompt_template: `请读取角色定义：{RAW_URL}\n\n{USER_REQUEST}`,
      quick_activation: `请读取以下角色定义：{RAW_URL}`
    },
    thumbnails: {
      small: `/thumbnails/${c.id}-small.png`,
      medium: `/thumbnails/${c.id}-medium.png`,
      large: `/thumbnails/${c.id}-large.png`,
      banner: `/thumbnails/${c.id}-banner.png`
    },
    related: { similar_skills: [], complementary_skills: [], next_skills: [] }
  };
}

function main() {
  console.log('🎭 添加角色扮演技能...');
  
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const existingIds = new Set(data.skills.map(s => s.id));
  
  let added = 0;
  for (const def of NEW_CHARACTERS) {
    if (!existingIds.has(def.id)) {
      const skill = makeSkill(def);
      data.skills.push(skill);
      existingIds.add(def.id);
      added++;
      console.log(`✅ 添加: ${def.name}`);
    } else {
      console.log(`⏭️ 跳过已存在: ${def.id}`);
    }
  }
  
  data.generated_at = new Date().toISOString();
  
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n🎉 完成！新增 ${added} 个角色扮演技能`);
}

main();
