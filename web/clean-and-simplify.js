const fs = require('fs');

console.log('\n🧹 清理并简化分类系统 🧹\n');

const data = JSON.parse(fs.readFileSync('./skills-data.json', 'utf-8'));
let { skills } = data;

// ==================== 清理分类映射 ====================
// 没用的主分类 → 合并到有用的分类
const PRIMARY_CATEGORY_MAP = {
  'functional': 'tool',
  'creative': 'tool',
  'lifestyle': 'tool'
};

// 没用的子分类(只有1个的) → 合并到通用子分类
const SUBCATEGORY_MAP = {
  'conspiracy': 'controversy',
  'assistant': 'daily',
  'novel': 'fiction',
  'art': 'daily',
  'legal': 'professional',
  'medical': 'professional',
  'mental': 'professional',
  'finance': 'daily',
  'cooking': 'daily',
  'education': 'professional',
  'design': 'development',
  'social': 'comedy',
  'dating': 'comedy',
  'office': 'daily',
  'sci-fi': 'fiction',
  'code-generator': 'development',
  'code-review': 'development',
  'tool-utilities': 'daily',
  'ai-tools': 'development',
  'database': 'development',
  'security': 'development',
  'documentation': 'development',
  'interview': 'development',
  'programming': 'development',
  'code-quality': 'development'
};

let primaryFixed = 0;
let subFixed = 0;

skills.forEach(skill => {
  const primary = skill.categorization?.primary_category;
  const sub = skill.categorization?.subcategory;
  
  if (primary && PRIMARY_CATEGORY_MAP[primary]) {
    skill.categorization.primary_category = PRIMARY_CATEGORY_MAP[primary];
    primaryFixed++;
  }
  
  if (sub && SUBCATEGORY_MAP[sub]) {
    skill.categorization.subcategory = SUBCATEGORY_MAP[sub];
    subFixed++;
  }
});

// ==================== 统计结果 ====================
const primaryStats = {};
const subStats = {};
skills.forEach(skill => {
  const p = skill.categorization?.primary_category;
  const s = skill.categorization?.subcategory;
  if (p) primaryStats[p] = (primaryStats[p] || 0) + 1;
  if (s) subStats[s] = (subStats[s] || 0) + 1;
});

console.log('📊 简化后的主分类:');
Object.entries(primaryStats).forEach(([cat, count]) => {
  console.log(`   ✅ ${cat.padEnd(15)}: ${count.toString().padStart(3)} 个`);
});

console.log('\n📊 简化后的子分类 (> 2个技能的):');
Object.entries(subStats).filter(([_, c]) => c > 2).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`   ✅ ${cat.padEnd(20)}: ${count.toString().padStart(3)} 个`);
});

console.log('\n🗑️  清理统计:');
console.log(`   合并主分类: ${primaryFixed} 个`);
console.log(`   合并子分类: ${subFixed} 个`);

// ==================== 保存 ====================
data.skills = skills;
const locations = [
  './src/skills-data.json',
  './skills-data.json',
  './skills-data-lite.json',
  './public/skills-data.json'
];

locations.forEach(loc => {
  fs.writeFileSync(loc, JSON.stringify(data, null, 2));
});

console.log('\n✅ 所有数据文件已更新！');
console.log('');
console.log('🎯 现在分类系统非常简洁了！');
console.log('');
