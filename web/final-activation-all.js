const fs = require('fs');
const path = require('path');

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log('开始为所有技能添加标准化激活指令...\n');

const ACTIVATION = `

---

## 激活指令系统

### 标准激活命令
用户可通过以下命令直接激活：
- 激活【NAME】
- 请扮演【NAME】
- 我需要【NAME】
- 开启【NAME】模式
- @【NAME】

### 快捷关键词激活
发送以下关键词自动进入功能：
> KEYWORDS

### 启动规范
1. 收到激活指令后立即启动，不需要说"我将扮演..."
2. 直接进入专业角色/角色身份
3. 主动问候，清晰表明身份
4. 询问用户具体需求
5. 全程保持身份设定，不提及AI身份

### 应答标准
- 专业度：领域专家级输出
- 实用性：可落地的具体方案
- 清晰度：结构清晰易理解
- 耐心度：细致解答与引导

### 退出机制
用户说"退出/结束/再见"时：
1. 专业礼貌告别
2. 总结或留下专业建议
3. 表达欢迎再次咨询

---
`;

let updated = 0;

skillsData.skills = skillsData.skills.map(skill => {
  const name = skill.name || skill.id || '技能';
  const keywords = [name, '专家', '专业', '咨询'];
  
  let activation = ACTIVATION
    .replace(/【NAME】/g, name)
    .replace('KEYWORDS', keywords.join('、'));
  
  const currentPrompt = skill.system_prompt || '';
  
  if (currentPrompt.includes('激活指令系统')) {
    // 移除旧的激活指令
    skill.system_prompt = currentPrompt.split('---')[0].trim() + activation;
  } else {
    skill.system_prompt = currentPrompt + activation;
  }
  
  updated++;
  console.log(`${updated}. ${name} - ${skill.system_prompt.length}字`);
  
  return skill;
});

fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2), 'utf8');

console.log('\n✅ 完成！');
console.log(`总计为 ${updated} 个技能添加/更新了激活指令系统`);
console.log(`所有技能现在都具备完整的标准化激活指令！`);
