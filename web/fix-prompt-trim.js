const fs = require('fs');
const path = require('path');

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const data = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log('🔧 修复所有 system_prompt 去掉开头空行...\n');

let fixed = 0;
data.skills.forEach(skill => {
  if (skill.system_prompt) {
    // 强制 trim 去掉所有开头空行
    const originalLen = skill.system_prompt.length;
    skill.system_prompt = skill.system_prompt.trim();
    if (originalLen !== skill.system_prompt.length) {
      fixed++;
    }
    
    // 再确保不是空的
    if (skill.system_prompt.length < 100) {
      console.log(`❌ ${skill.id} 仍然太短: ${skill.system_prompt.length} 字`);
    }
  }
});

fs.writeFileSync(skillsPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ 修复了 ${fixed} 个技能的开头空行`);
console.log(`\n👉 验证:`);
console.log(`   1. 按 Ctrl+F5 强制刷新`);
console.log(`   2. 访问 /skills/marketing-strategist`);
console.log(`   3. 现在一定能看到内容了！`);
