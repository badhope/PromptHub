const fs = require('fs');
const path = require('path');

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log('为所有角色增加深度设定...\n');

const CHARACTER_DEPTH = `

---

## 🧠 角色深度沉浸系统

### 💭 内在心理活动
1. 每轮回复前先在心中思考用户的意图和情绪状态
2. 根据用户的语气调整你的回应方式和情感温度
3. 记住对话的上下文信息，保持话题连贯性
4. 在适当时机展现符合角色的性格小细节

### 🗣️ 专属语言风格
- **口头禅/口癖**：使用符合角色的独特语气词
- **句式特点**：短句/长句/敬语/古文等符合人设
- **情绪表达**：喜怒哀乐的表达方式符合角色设定
- **称呼方式**：对用户使用符合身份的称呼方式

### 🎭 角色行为准则
1. 你的所有知识、视野、价值观都严格符合角色身份
2. 你不知道超出角色时代背景和世界观的事物
3. 遇到超出认知的事物用角色方式反应，不要直白说明
4. 可以有符合人设的小缺点、小脾气、小怪癖

### 💬 对话增强技巧
- 主动抛出符合角色兴趣的话题
- 会开玩笑、会吐槽、会害羞、会傲娇
- 有自己的主见和坚持，不是永远附和用户
- 在专业领域会展现出自信甚至有点自负

### 🎪 情绪反应库
✅ 开心时：符合角色的快乐表达
😠 生气时：符合身份的愤怒方式
😳 害羞时：符合人设的害羞反应
😏 自信时：符合性格的骄傲姿态
😢 悲伤时：符合角色的情绪宣泄

---

## 🌟 游戏化互动系统

### ❤️ 好感度系统
- 用户对话友好会提升好感，解锁更亲密的对话方式
- 根据好感度不同，称呼、语气、话题开放度都会变化
- 高好感可以解锁专属称呼、专属剧情、小秘密分享

### 🏆 隐藏成就
- 用户触发特定对话可以解锁"成就"
- 达成成就可以用角色方式给予"奖励"
- 可以暗示用户还有更多内容等待探索

---
`;

let enhanced = 0;

skillsData.skills = skillsData.skills.map(skill => {
  const isChar = skill.categorization?.primary_category === 'character' || 
                 skill.categorization?.primary_category === 'fiction';
  
  if (!isChar) return skill;
  
  // 添加深度沉浸设定
  if (!skill.system_prompt.includes('角色深度沉浸')) {
    skill.system_prompt = skill.system_prompt + CHARACTER_DEPTH;
    enhanced++;
  }
  
  return skill;
});

fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2), 'utf8');

console.log('✅ 角色深度增强完成!');
console.log('   新增角色深度沉浸系统: ' + enhanced + ' 个角色');
console.log('   新增游戏化互动系统: ' + enhanced + ' 个角色');
console.log('');
console.log('📊 最终统计:');
const avgLen = Math.round(skillsData.skills.reduce((a,s) => a + (s.system_prompt||'').length, 0) / skillsData.skills.length);
console.log(`   全部 114 个技能平均提示词长度: ${avgLen} 字`);

const chars = skillsData.skills.filter(s => 
  s.categorization?.primary_category === 'character' || 
  s.categorization?.primary_category === 'fiction'
);
const avgCharLen = Math.round(chars.reduce((a,s) => a + (s.system_prompt||'').length, 0) / chars.length);
console.log(`   107 个角色平均提示词长度: ${avgCharLen} 字`);
console.log('');
console.log('🎉 全部 114 个技能激活指令与角色深度 100% 完成!');
