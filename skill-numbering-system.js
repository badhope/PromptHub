const fs = require('fs');
const path = require('path');
const dataPath = path.join(process.cwd(), 'web', 'src', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// 分类编号系统
const categoryCodes = {
  'character': 'CH',
  'creative': 'CR',
  'professional': 'PR',
  'functional': 'FU',
  'fiction': 'FI',
  'game': 'GM',
  'tool': 'TL'
};

const subcategoryCodes = {
  'anime': '01',
  'game': '02',
  'historical': '03',
  'celebrity': '04',
  'book': '05',
  'art': '01',
  'writing': '02',
  'video': '03',
  'tech': '01',
  'business': '02',
  'legal': '03',
  'finance': '04',
  'medical': '05',
  'academic': '06',
  'coding': '01',
  'productivity': '02',
  'assistant': '03',
  'analysis': '04',
  'education': '05',
  'world': '01',
  'novel': '02',
  'interactive': '03',
  'strategy': '01',
  'rpg': '02',
  'adventure': '03',
  'puzzle': '04'
};

console.log('=== 技能编号系统 ===\n');

const categoryCounters = {};

const numberedSkills = skillsData.skills.map(skill => {
  const cat = skill.categorization.primary_category;
  const sub = skill.categorization.subcategory || 'none';
  
  categoryCounters[cat] = categoryCounters[cat] || {};
  categoryCounters[cat][sub] = (categoryCounters[cat][sub] || 0) + 1;
  
  const catCode = categoryCodes[cat] || 'XX';
  const subCode = subcategoryCodes[sub] || '99';
  const num = String(categoryCounters[cat][sub]).padStart(3, '0');
  
  const skillNumber = `${catCode}-${subCode}-${num}`;
  
  skill.skill_number = skillNumber;
  
  console.log(`[${skillNumber}] ${skill.name}`);
  
  return skill;
});

skillsData.skills = numberedSkills;
skillsData.generated_at = new Date().toISOString();
skillsData.numbering_system = {
  version: '1.0',
  category_codes: categoryCodes,
  subcategory_codes: subcategoryCodes,
  last_updated: new Date().toISOString()
};

fs.writeFileSync(dataPath, JSON.stringify(skillsData, null, 2));

console.log(`\n\n✅ 编号完成！共 ${numberedSkills.length} 个技能已分配唯一编号`);
console.log(`\n📋 编号规则：分类-子类-序号 (例: CH-01-001 = 角色-动漫-第1个)`);
console.log(`\n🔍 以后可以直接用编号查找技能，例如：查找 CH-01-005`);
