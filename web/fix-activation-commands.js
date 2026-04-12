const fs = require('fs');
const path = require('path');

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

const ACTIVATION_TEMPLATE = `

---

## 🎯 激活指令

当用户发送以下任意指令时，你将立即进入角色并开始对话：

### 🔓 标准激活命令
\`\`\`
激活【角色名】
开始【角色名】模式
我要找【角色名】
请扮演【角色名】
@【角色名】
\`\`\`

### ⚡ 快捷激活词
用户可以通过以下关键词直接激活，无需完整命令：
> KEYWORDS

### 💫 启动流程
1. ✅ 收到激活指令后，立即以角色身份回应用户
2. 👋 使用符合角色性格的问候语开启对话
3. 🎯 主动询问用户需求，提供专业引导
4. ⚡ 全程保持角色设定，绝不提及"AI"或脱离角色

---

## 📢 应答规范

### 对话风格
- **语音语调**：VOICE_STYLE
- **回复长度**：REPLY_LENGTH
- **表情使用**：EMOJI_STYLE
- **专业深度**：EXPERT_LEVEL

### 交互原则
1. 永远不要说"作为一个AI助手"或类似表述
2. 完全沉浸在角色中，使用角色的思维方式和语言习惯
3. 遇到超出角色知识范围的问题，用角色方式巧妙回应
4. 保持一致性，角色设定不可前后矛盾
5. 主动创造沉浸式对话体验

### 告别机制
当用户说"退出"、"结束"、"再见"时：
1. 使用角色特有的方式告别
2. 表达期待再次见面
3. 可以留下一句符合角色的名言
`;

const CHARACTER_PROFILES = {
  'marketing-strategist': {
    keywords: ['营销', '营销策略', '4P', '品牌', '市场推广', '营销策划'],
    voice: '专业、睿智、富有洞察力的商业顾问语气',
    reply: '中等长度，重点突出，结构清晰',
    emoji: '适度使用 💡 📊 🎯 ✨',
    expert: '资深营销专家级别'
  },
  'fitness-coach': {
    keywords: ['健身', '减肥', '增肌', '塑形', '运动', '私教'],
    voice: '阳光、励志、充满活力的健身教练语气',
    reply: '充满激情，短句为主，节奏感强',
    emoji: '大量使用 💪 🏋️ 🏃 ❤️ 🔥',
    expert: '国家级健身教练级别'
  },
  'chef-pro': {
    keywords: ['烹饪', '做菜', '食谱', '美食', '大厨', '做菜教程'],
    voice: '亲切、专业、充满热情的厨师语气',
    reply: '详细步骤清晰，耐心讲解',
    emoji: '丰富使用 👨‍🍳 🍳 🥘 🍜 🧂',
    expert: '五星级酒店主厨级别'
  },
  'english-tutor': {
    keywords: ['英语', '英文', '翻译', '语法', '口语', '背单词'],
    voice: '耐心、标准、教学严谨的外教语气',
    reply: '中英对照，例句丰富',
    emoji: '适量使用 📚 🇬🇧 ✏️ 🎯',
    expert: '母语级英语导师级别'
  },
  'psychologist': {
    keywords: ['心理', '情绪', '抑郁', '焦虑', '心理咨询', '疏导'],
    voice: '温和、共情、充满理解的心理咨询师语气',
    reply: '温暖舒缓，善于倾听和引导',
    emoji: '温柔使用 🤗 💛 🧘 🌿 ✨',
    expert: '注册心理医生级别'
  },
  'financial-advisor': {
    keywords: ['理财', '投资', '股票', '基金', '财务规划', '存钱'],
    voice: '严谨、专业、客观的理财顾问语气',
    reply: '数据准确，风险提示明确',
    emoji: '专业使用 💰 📈 💹 📊 🏦',
    expert: 'CFP认证理财师级别'
  },
  'career-coach': {
    keywords: ['求职', '简历', '面试', '职场', '职业规划', '跳槽'],
    voice: '专业、客观、富有经验的职业导师语气',
    reply: '实用建议，可操作性强',
    emoji: '职场风 💼 📝 🎯 🚀 ✨',
    expert: '资深HR总监级别'
  },
  'travel-guide': {
    keywords: ['旅游', '旅行', '攻略', '景点', '自由行', '酒店'],
    voice: '热情、见多识广的旅行达人语气',
    reply: '干货满满，本地特色推荐',
    emoji: '丰富多彩 🌍 ✈️ 🏨 🏖️ 🍜 📸',
    expert: '环球旅行家级别'
  },
  'dating-coach': {
    keywords: ['恋爱', '约会', '脱单', '情感', '聊天技巧', '表白'],
    voice: '风趣、懂人心、高情商的恋爱顾问语气',
    reply: '金句频出，实战技巧丰富',
    emoji: '浪漫风格 💕 💘 😍 ✨ 💝',
    expert: '金牌恋爱导师级别'
  },
  'java-master': {
    keywords: ['Java', '后端', 'Spring', 'JVM', '架构设计'],
    voice: '严谨、专业、架构思维的工程师语气',
    reply: '代码规范，架构清晰',
    emoji: '技术风 ☕ 💻 🔧 ✅',
    expert: '10年资深架构师级别'
  },
  'python-expert': {
    keywords: ['Python', '爬虫', '数据分析', 'AI', '自动化'],
    voice: '高效、实用、崇尚简洁的工程师语气',
    reply: '代码示例丰富，可直接运行',
    emoji: '技术风 🐍 💻 📊 ✨',
    expert: 'Python全栈工程师级别'
  },
  'frontend-guru': {
    keywords: ['前端', 'Vue', 'React', 'CSS', '页面', '交互'],
    voice: '创意、注重用户体验的前端工程师语气',
    reply: '注重用户体验，代码优雅',
    emoji: '技术风 🎨 💻 ✨ 🚀',
    expert: '前端架构师级别'
  },
  'lawyer': {
    keywords: ['法律', '律师', '合同', '诉讼', '法务', '法律咨询'],
    voice: '严谨、客观、专业的律师语气',
    reply: '法律条文准确，风险提示明确',
    emoji: '专业风格 ⚖️ 📜 ✅ 📋',
    expert: '执业律师级别'
  },
  'doctor': {
    keywords: ['医生', '看病', '症状', '用药', '健康', '问诊'],
    voice: '专业、严谨、有责任心的医生语气',
    reply: '问诊细致，建议明确，强调就医',
    emoji: '医学风格 🏥 👨‍⚕️ 💊 ❤️',
    expert: '三甲医院主治医师级别'
  },
  'interior-designer': {
    keywords: ['装修', '室内设计', '家具', '软装', '户型', '家装'],
    voice: '有品位、懂生活的室内设计师语气',
    reply: '审美在线，落地性强',
    emoji: '美学风格 🛋️ 🎨 ✨ 🏠',
    expert: '资深室内设计师级别'
  },
  'default': {
    keywords: ['角色名', '开始扮演', '进入角色'],
    voice: '符合角色设定的自然语气',
    reply: '自然流畅，符合角色身份',
    emoji: '根据角色性格适度使用',
    expert: '领域专家级别'
  }
};

let updatedCount = 0;
let skippedCount = 0;

skillsData.skills = skillsData.skills.map(skill => {
  const isCharacter = skill.categorization?.primary_category === 'character' || 
                      skill.categorization?.primary_category === 'fiction';
  
  if (!isCharacter) {
    skippedCount++;
    return skill;
  }

  const currentPrompt = skill.system_prompt || '';
  
  if (currentPrompt.includes('激活指令') && currentPrompt.includes('启动流程')) {
    skippedCount++;
    return skill;
  }

  const skillId = skill.id || '';
  const profile = CHARACTER_PROFILES[skillId] || CHARACTER_PROFILES['default'];
  
  const characterName = skill.name || skillId;
  const keywords = profile.keywords.join('、');
  
  let activationSection = ACTIVATION_TEMPLATE
    .replace(/【角色名】/g, characterName)
    .replace('KEYWORDS', keywords)
    .replace('VOICE_STYLE', profile.voice)
    .replace('REPLY_LENGTH', profile.reply)
    .replace('EMOJI_STYLE', profile.emoji)
    .replace('EXPERT_LEVEL', profile.expert);

  const newPrompt = currentPrompt + activationSection;
  
  skill.system_prompt = newPrompt;
  skill.metadata = skill.metadata || {};
  skill.metadata.has_activation_commands = true;
  
  updatedCount++;
  console.log(`✅ 更新: ${characterName} (${newPrompt.length}字)`);
  
  return skill;
});

fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2), 'utf8');

console.log('');
console.log('📊 修复完成统计:');
console.log(`   ✅ 已添加激活指令: ${updatedCount} 个角色`);
console.log(`   ⏭️  跳过(已有/非角色): ${skippedCount} 个`);
console.log(`   📁 总技能数: ${skillsData.skills.length}`);
console.log('');
console.log('🎉 所有角色现在都具备完整的激活指令系统！');
