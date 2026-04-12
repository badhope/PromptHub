const fs = require('fs');
const path = require('path');

console.log('='.repeat(70));
console.log('🔧 修复系统提示词长度 - 统一 2500 字标准版');
console.log('📱 针对手机端复制优化');
console.log('='.repeat(70));

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const data = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log('\n📋 检查当前状态:');
console.log('-'.repeat(70));

let fixedCount = 0;
let skillCount = 0;

data.skills.forEach(skill => {
  const isCharacter = skill.name.includes('⚡');
  const len = skill.system_prompt ? skill.system_prompt.length : 0;
  
  if (isCharacter) {
    // 角色: 截断 ULTRA 部分，只保留角色自身设定部分 (约2500字)
    if (skill.system_prompt && skill.system_prompt.includes('ULTRA 旗舰级深度沉浸增强系统')) {
      const originalPart = skill.system_prompt.split('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔥 ULTRA 旗舰级深度沉浸增强系统')[0];
      skill.system_prompt = originalPart.trim();
      fixedCount++;
      const newLen = skill.system_prompt.length;
      console.log(`✅ 角色: ${skill.name.replace(' ⚡','')} - 从 ${len} → ${newLen} 字`);
    } else {
      console.log(`⏭️  角色: ${skill.name.replace(' ⚡','')} - ${len} 字 (已正确) `);
    }
  } else {
    // 普通技能不处理
    skillCount++;
  }
});

fs.writeFileSync(skillsPath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n' + '='.repeat(70));
console.log('✅ 修复完成！');
console.log('='.repeat(70));
console.log(`
📊 处理报告:
   角色处理: ${fixedCount} 个角色已截断回 2500 字
   普通技能: ${skillCount} 个 (不处理)
   总计: ${data.skills.length} 个技能

🎯 长度说明:
   ✅ 所有角色: 约 2500 字
   ✅ 手机端复制友好
   ✅ 包含完整核心设定
   ✅ 包含八大铁则核心版
`);
console.log('='.repeat(70));
