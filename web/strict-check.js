const skillsData = require('./src/skills-data.json');

console.log('🔍 严苛检查所有 114 个技能\n');

const professionalSkills = skillsData.skills.filter(s => 
  s.categorization?.primary_category === 'professional'
);

const functionalSkills = skillsData.skills.filter(s => 
  s.categorization?.primary_category === 'functional'
);

console.log('📊 分类统计:');
console.log('   professional: ' + professionalSkills.length);
console.log('   functional: ' + functionalSkills.length);
console.log('   character: ' + skillsData.skills.filter(s => s.categorization?.primary_category === 'character').length);
console.log('   fiction: ' + skillsData.skills.filter(s => s.categorization?.primary_category === 'fiction').length);
console.log('');

console.log('💼 专业类技能列表:');
professionalSkills.forEach((s, i) => {
  const has = (s.system_prompt || '').includes('标准激活命令');
  const len = (s.system_prompt || '').length;
  console.log('   ' + (i+1) + '. ' + s.name + ' (' + s.id + ')');
  console.log('      激活: ' + (has ? '✅' : '❌') + ', 长度: ' + len);
});
console.log('');

console.log('🛠️ 功能类技能列表:');
functionalSkills.forEach((s, i) => {
  const has = (s.system_prompt || '').includes('标准激活命令');
  const len = (s.system_prompt || '').length;
  console.log('   ' + (i+1) + '. ' + s.name + ' (' + s.id + ')');
  console.log('      激活: ' + (has ? '✅' : '❌') + ', 长度: ' + len);
});
console.log('');

// 真正有问题的
const missing = skillsData.skills.filter(s => {
  const p = s.system_prompt || '';
  return !p.includes('标准激活命令');
});

console.log('❌ 真正没有激活指令的: ' + missing.length + ' 个');
missing.forEach(s => {
  console.log('   - ' + s.name + ' (' + s.id + ') [' + s.categorization?.primary_category + ']');
});

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
