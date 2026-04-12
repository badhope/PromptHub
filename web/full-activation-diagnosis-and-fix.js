const fs = require('fs');
const path = require('path');

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log('========== 全面诊断激活指令情况 ==========\n');

const FULL_ACTIVATION = `

---

## 🎯 完整激活指令系统

### 🔓 标准激活命令
用户发送以下任意命令时，你必须立即完整进入角色并开始对话：

\`\`\`
激活【SKILL_NAME】
请扮演【SKILL_NAME】
我需要【SKILL_NAME】帮助
开启【SKILL_NAME】模式
@【SKILL_NAME】在线吗
\`\`\`

### ⚡ 快捷关键词触发
用户发送以下关键词时，自动激活并进入角色：
> KEYWORDS_LIST

### 💫 标准启动流程
1. ✅ 收到激活指令后 **0延迟** 进入角色
2. 🚫 绝对不要说 "我将扮演..."、"好的，我现在是..." 这类过渡语
3. 👋 直接用角色身份开口，用符合人设的方式打招呼
4. 🎯 主动介绍自己的专长并询问用户需求
5. ⚡ 从第一句话开始就完全沉浸角色，绝不脱离人设

### 📢 应答黄金准则
- **语音语调**：符合【SKILL_NAME】身份定位的专业语气
- **回复长度**：每轮回复不少于 150 字，专业详尽
- **专业深度**：真正的【EXPERT】级别，拒绝泛泛而谈
- **交互体验**：主动引导对话，给出可落地的具体建议
- **角色一致性**：全程保持身份，绝不暴露AI属性

### ❌ 绝对禁止事项
1. 不许说 "作为一个AI助手..."
2. 不许提及 "语言模型"、"人工智能"
3. 不许脱离角色人设说话
4. 不许敷衍回答、空话套话
5. 不许说 "具体情况具体分析"

### 👋 规范退出机制
用户说 "退出/结束/再见/谢谢" 时：
1. 用符合角色身份的方式礼貌告别
2. 留下一句专业的总结或建议
3. 表达欢迎用户再次咨询的意愿

---
`;

// ============ 诊断 ============
let noActivation = [];
let weakActivation = [];
let goodActivation = [];

skillsData.skills.forEach(skill => {
  const prompt = skill.system_prompt || '';
  const hasActivation = prompt.includes('激活指令');
  const activationLen = (prompt.match(/激活/g) || []).length;
  const hasKeyword = prompt.includes('快捷关键词');
  const hasProcess = prompt.includes('启动流程');
  const hasForbidden = prompt.includes('禁止事项');
  
  const score = (hasActivation ? 1 : 0) + (hasKeyword ? 1 : 0) + 
                (hasProcess ? 1 : 0) + (hasForbidden ? 1 : 0) + 
                Math.min(activationLen / 3, 2);
  
  if (score >= 4 && prompt.length > 1800) {
    goodActivation.push({ name: skill.name, score, len: prompt.length });
  } else if (score >= 2) {
    weakActivation.push({ name: skill.name, score, len: prompt.length });
  } else {
    noActivation.push({ name: skill.name, score, len: prompt.length });
  }
});

console.log('📊 当前状态统计:');
console.log(`   ✅ 完善: ${goodActivation.length} 个`);
console.log(`   ⚠️  薄弱: ${weakActivation.length} 个`);
console.log(`   ❌ 缺失: ${noActivation.length} 个`);
console.log('');

if (noActivation.length > 0) {
  console.log('❌ 完全缺失激活指令的技能:');
  noActivation.slice(0, 20).forEach(s => console.log(`   - ${s.name}`));
  if (noActivation.length > 20) console.log(`   ...还有 ${noActivation.length - 20} 个`);
  console.log('');
}

if (weakActivation.length > 0) {
  console.log('⚠️ 激活指令薄弱的技能:');
  weakActivation.slice(0, 20).forEach(s => console.log(`   - ${s.name} (得分:${s.score})`));
  if (weakActivation.length > 20) console.log(`   ...还有 ${weakActivation.length - 20} 个`);
  console.log('');
}

// ============ 全面修复 ============
console.log('🚀 开始为所有技能添加完整激活指令系统...\n');

let updated = 0;

const CATEGORY_KEYWORDS = {
  'marketing-strategist': ['营销', '品牌', '推广', '4P', '转化', '流量'],
  'fitness-coach': ['健身', '增肌', '减脂', '塑形', '私教', '饮食'],
  'chef-pro': ['烹饪', '做菜', '食谱', '美食', '大厨', '调料'],
  'english-tutor': ['英语', '翻译', '语法', '口语', '单词', '雅思'],
  'psychologist': ['心理', '情绪', '抑郁', '焦虑', '疏导', '解压'],
  'financial-advisor': ['理财', '投资', '股票', '基金', '存钱', '复利'],
  'career-coach': ['求职', '简历', '面试', '职场', '晋升', '跳槽'],
  'travel-guide': ['旅游', '攻略', '酒店', '景点', '自由行', '打卡'],
  'dating-coach': ['恋爱', '约会', '脱单', '表白', '聊天', '情感'],
  'java-master': ['Java', 'Spring', '后端', '架构', 'JVM', '微服务'],
  'python-expert': ['Python', '爬虫', '数据分析', '自动化', 'AI', '机器学习'],
  'frontend-guru': ['前端', 'Vue', 'React', 'CSS', '交互', '页面'],
  'lawyer': ['法律', '律师', '合同', '诉讼', '法务', '赔偿'],
  'doctor': ['医生', '看病', '症状', '用药', '健康', '问诊'],
  'interior-designer': ['装修', '设计', '家具', '软装', '户型', '风格'],
};

skillsData.skills = skillsData.skills.map(skill => {
  const name = skill.name || skill.id || '专家';
  const customKeywords = CATEGORY_KEYWORDS[skill.id] || ['专业', '咨询', '专家', '帮助'];
  const keywords = [name, ...customKeywords];
  
  const expertLevel = name.includes('小说') || name.includes('动漫') ? 
    '原作级角色还原度' : '从业10年以上资深专家';
  
  let activation = FULL_ACTIVATION
    .replace(/SKILL_NAME/g, name)
    .replace('KEYWORDS_LIST', keywords.join('、'))
    .replace('EXPERT', expertLevel);
  
  let currentPrompt = skill.system_prompt || '';
  
  // 移除旧的不完整激活指令
  if (currentPrompt.includes('激活指令')) {
    const parts = currentPrompt.split('---');
    if (parts.length > 1) {
      currentPrompt = parts[0].trim();
    }
  }
  
  // 确保结尾干净
  currentPrompt = currentPrompt.replace(/[-=]+$/g, '').trim();
  
  // 添加全新的完整激活指令
  skill.system_prompt = currentPrompt + activation;
  updated++;
  
  if (updated <= 10 || updated % 20 === 0) {
    console.log(`${updated}. ${name} - ${skill.system_prompt.length} 字`);
  }
  
  return skill;
});

fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2), 'utf8');

console.log('\n');
console.log('🎉========== 修复完成 ==========🎉');
console.log(`✅ 总计为 ${updated} 个技能更新了完整的激活指令系统`);
console.log(`📏 平均提示词长度: ${Math.round(skillsData.skills.reduce((a,s) => a + (s.system_prompt||'').length, 0) / skillsData.skills.length)} 字`);
console.log('💯 所有技能现在都具备了完整、充实的标准化激活指令！');
