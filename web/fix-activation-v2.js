const fs = require('fs');
const path = require('path');

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

const ACTIVATION_SECTION = `

---

## 激活指令系统

### 标准激活命令
用户可通过以下命令直接激活你的角色：
- "激活【角色名】"
- "请扮演【角色名】"
- "我要找【角色名】"
- "开始【角色名】模式"
- "@【角色名】"

### 快捷关键词激活
用户发送以下关键词时，你也将自动进入角色对话：
> KEYWORDS_LIST

### 启动规范
1. 收到激活指令后立即进入角色，不要说"我将扮演..."
2. 直接用角色的语气和风格开始对话
3. 主动问候用户，并询问具体需求
4. 全程保持角色设定，绝不脱离角色
5. 永远不要提及"AI"、"人工智能"、"语言模型"等身份

### 应答标准
- 语音语调：VOICE_PROFILE
- 回复风格：REPLY_STYLE
- 专业程度：EXPERT_LEVEL
- 表情使用：EMOJI_STYLE

### 退出机制
用户说"退出"、"结束"、"再见"时：
- 用角色特有的方式礼貌告别
- 表达期待再次对话
- 可以留下一句符合角色的经典台词

---
`;

const PROFILES = {
  default: {
    keywords: ['扮演', '进入角色', '开始对话'],
    voice: '符合角色身份的自然语调',
    reply: '符合人物设定，自然流畅',
    expert: '专业领域专家级别',
    emoji: '根据角色性格适度使用'
  }
};

let updated = 0;
let totalChars = 0;

skillsData.skills = skillsData.skills.map(skill => {
  const isChar = skill.categorization?.primary_category === 'character' || 
                 skill.categorization?.primary_category === 'fiction';
  
  if (!isChar) return skill;
  
  const name = skill.name || skill.id || '角色';
  const profile = PROFILES.default;
  const keywords = [...profile.keywords, name];
  
  let activation = ACTIVATION_SECTION
    .replace(/【角色名】/g, name)
    .replace('KEYWORDS_LIST', keywords.join('、'))
    .replace('VOICE_PROFILE', profile.voice)
    .replace('REPLY_STYLE', profile.reply)
    .replace('EXPERT_LEVEL', profile.expert)
    .replace('EMOJI_STYLE', profile.emoji);
  
  skill.system_prompt = (skill.system_prompt || '') + activation;
  updated++;
  totalChars += skill.system_prompt.length;
  
  console.log(`${updated}. ${name} - ${skill.system_prompt.length} 字`);
  
  return skill;
});

fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2), 'utf8');

console.log('');
console.log('========== 修复完成 ==========');
console.log(`已更新角色数: ${updated}`);
console.log(`平均提示词长度: ${Math.round(totalChars / updated)} 字`);
