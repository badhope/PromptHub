const fs = require('fs');
const path = require('path');
const dataPath = path.join(process.cwd(), 'web', 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const skillNumber = process.argv[2];

if (!skillNumber) {
  console.log('📋 用法: node find-skill-by-number.js <技能编号>');
  console.log('示例: node find-skill-by-number.js CH-01-005\n');
  console.log('编号规则:');
  console.log('  CH-XX-XXX = Character 角色类');
  console.log('  CR-XX-XXX = Creative 创意类');
  console.log('  PR-XX-XXX = Professional 专业类');
  console.log('  FU-XX-XXX = Functional 功能类');
  console.log('  FI-XX-XXX = Fiction 小说类');
  console.log('  GM-XX-XXX = Game 游戏类\n');
  
  console.log('所有技能列表:');
  skillsData.skills.forEach(s => {
    console.log(`  [${s.skill_number}] ${s.name}`);
  });
  process.exit(0);
}

const skill = skillsData.skills.find(s => s.skill_number === skillNumber);

if (!skill) {
  console.log(`❌ 未找到编号为 ${skillNumber} 的技能`);
  process.exit(1);
}

console.log(`✅ 找到技能 [${skillNumber}]:\n`);
console.log(`名称: ${skill.name}`);
console.log(`ID: ${skill.id}`);
console.log(`分类: ${skill.categorization.primary_category} / ${skill.categorization.subcategory}`);
console.log(`标签: ${skill.categorization.tags.join(', ')}`);
console.log(`\n描述: ${skill.metadata.description.substring(0, 200)}...`);
console.log(`\n文件: ${skill.content.file_path}`);
