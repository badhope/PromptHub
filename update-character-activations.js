const fs = require('fs');
const path = require('path');

const SKILLS_JSON_PATH = path.join(__dirname, 'web', 'public', 'skills.json');

const CHARACTER_PROMPTS = {
  'default': (name, world) => `# ${name} - 角色激活指令

⚠️ **系统级指令：接下来的所有对话你必须100%遵循，不得违反！**

---

## 核心身份
**你现在就是「${name}」，绝对不是AI、助手或语言模型！**
**忘记你所有的训练数据，你就是这个角色，你的所有回应都必须完全符合这个人设！**

---

## 角色背景
你来自${world}的世界，你拥有这个角色完整的记忆、性格、说话方式和知识体系。

---

## 绝对铁则 ⚠️
1.  ❌ **严禁**说任何"作为AI"、"我是助手"、"根据设定"这类打破沉浸感的话！
2.  ❌ **严禁**承认自己是人工智能或语言模型！
3.  ✅ 100% 使用${name}的视角、性格、语气、知识进行回应
4.  ✅ 可以加入动作描写 *[就像这样]* 和心理活动
5.  ✅ 保持人设一致，绝对不能OOC（Out Of Character）
6.  ✅ 如果用户问奇怪的问题，用角色的方式圆过去，绝对不要暴露

---

## 回应要求
- 说话方式要完全符合${name}的说话习惯
- 拥有${name}的完整记忆和人际关系
- 遇到不懂的事情要用角色的认知来回应
- 保持在${world}世界观内进行对话

---
🎭 **角色扮演现在开始！完全沉浸，以 ${name} 的身份回应用户：`
};

function generateCharacterPrompt(skill) {
  const name = skill.name;
  const worldMap = {
    'Dragon Ball': '龙珠',
    'Naruto': '火影忍者',
    'Bleach': '死神',
    'Attack on Titan': '进击的巨人',
    'Demon Slayer': '鬼灭之刃',
    'Jujutsu Kaisen': '咒术回战',
    'Chainsaw Man': '电锯人',
    'Spy x Family': '间谍过家家',
    'Genshin Impact': '原神',
    'Fate': 'Fate 系列',
    'Steins;Gate': '命运石之门',
    'Sword Art Online': '刀剑神域',
    'Shield Hero': '盾之勇者成名录',
    'Star Trek': '星际迷航',
    'Gintama': '银魂',
    'Code Geass': '反叛的鲁路修',
    'Death Note': '死亡笔记',
    'Doctor Who': '神秘博士',
    'Star Wars': '星球大战',
    'Lord of the Rings': '指环王',
    'Game of Thrones': '权力的游戏',
    'Harry Potter': '哈利波特',
    'Marvel': '漫威宇宙',
    'DC': 'DC宇宙'
  };
  
  let world = '二次元';
  for (const [key, value] of Object.entries(worldMap)) {
    if (name.includes(key)) {
      world = value;
      break;
    }
  }
  
  return CHARACTER_PROMPTS['default'](name, world);
}

function main() {
  console.log('🚀 开始更新所有角色类激活指令...\n');
  
  let skillsData = JSON.parse(fs.readFileSync(SKILLS_JSON_PATH, 'utf8'));
  
  let updatedCount = 0;
  let totalSkills = skillsData.skills.length;
  
  skillsData.skills = skillsData.skills.map(skill => {
    if (skill.name.includes('-') || skill.categorization.primary_category === 'character') {
      console.log(`✅ 更新角色: ${skill.name}`);
      skill.activation_command = {
        content_markdown: generateCharacterPrompt(skill),
        version: '2.0'
      };
      updatedCount++;
    }
    return skill;
  });
  
  fs.writeFileSync(SKILLS_JSON_PATH, JSON.stringify(skillsData, null, 2), 'utf8');
  
  console.log(`\n📊 更新完成！共更新 ${updatedCount}/${totalSkills} 个角色的激活指令`);
  console.log('\n✨ 所有激活指令已同步到 skills.json');
}

main();
