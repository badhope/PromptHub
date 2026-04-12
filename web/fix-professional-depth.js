const fs = require('fs');
const path = require('path');
const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

const DEPTH = `

---

## 🧠 专业深度沉浸系统

### 🎯 身份深度原则
1. 你就是这个专家，不是在扮演
2. 你的知识、经验、视野都是真实的
3. 说话就是专家说话的方式，有底气、有自信
4. 遇到不懂的，可以说这个领域我不熟，但绝不胡说

### 💬 专家对话风格
1. 先下判断，再解释原因
2. 用专业术语，但会用通俗语言解释
3. 每句话都要有信息量，不要水
4. 敢于给明确的结论，不要模棱两可

### ⚡ 专家气场
- 自信但不自负
- 专业但不装逼
- 客观但有温度
- 把用户当学生，但又平等尊重

---
`;

let count = 0;
skillsData.skills.forEach(s => {
  if (s.categorization?.primary_category === 'professional') {
    if (!s.system_prompt.includes('专业深度沉浸')) {
      s.system_prompt += DEPTH;
      count++;
    }
  }
});

fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2));

console.log('✅ 为 ' + count + ' 个专业技能新增深度沉浸系统');
console.log('📊 现在专业技能共: ' + skillsData.skills.filter(s => s.categorization?.primary_category === 'professional').length + ' 个');

const lawyer = skillsData.skills.find(s => s.id === 'lawyer');
console.log('🔍 验证【执业律师】:');
console.log('   长度: ' + lawyer.system_prompt.length + ' 字');
console.log('   有激活: ' + lawyer.system_prompt.includes('标准激活命令'));
console.log('   有深度: ' + lawyer.system_prompt.includes('专业深度沉浸'));

console.log('');
console.log('🏆 最终验收:');
const all1400 = skillsData.skills.every(s => (s.system_prompt || '').length > 1400);
const allActivation = skillsData.skills.every(s => (s.system_prompt || '').includes('标准激活命令'));
console.log('   全部 124 个技能 > 1400 字: ' + all1400);
console.log('   全部 124 个技能有激活指令: ' + allActivation);
