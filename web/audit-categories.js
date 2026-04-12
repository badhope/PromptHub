const fs = require('fs');

console.log('\n📊 分类系统全面审计 📊\n');
console.log('='.repeat(60));

const data = JSON.parse(fs.readFileSync('./skills-data.json', 'utf-8'));
const { skills } = data;

const MULTI_LEVEL_CATEGORY_SYSTEM = JSON.parse(fs.readFileSync('./src/lib/category-system.ts', 'utf-8')
  .replace(/^[\s\S]*?MULTI_LEVEL_CATEGORY_SYSTEM\s*=\s*/, '')
  .replace(/\};\s*[\s\S]*$/, '};')
  .replace(/:\s*'([^']+)'/g, ':"$1"')
  .replace(/,\s*\}/g, '}')
  .replace(/,\s*,/g, ',')
);

// 1. 统计所有主分类
console.log('\n📊 主分类技能统计:');
console.log('-' .repeat(60));
const primaryStats = {};
const subStats = {};

skills.forEach(skill => {
  const primary = skill.categorization?.primary_category;
  const sub = skill.categorization?.subcategory;
  
  if (primary) {
    primaryStats[primary] = (primaryStats[primary] || 0) + 1;
  }
  if (sub) {
    subStats[sub] = (subStats[sub] || 0) + 1;
  }
});

Object.entries(primaryStats).forEach(([cat, count]) => {
  const status = count < 5 ? '⚠️ 太少' : count < 10 ? '📌 偏少' : '✅ 充足';
  console.log(`   ${status} ${cat.padEnd(15)}: ${count.toString().padStart(3)} 个技能`);
});

// 2. 统计子分类
console.log('\n📊 子分类技能统计:');
console.log('-' .repeat(60));
Object.entries(subStats).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
  const status = count === 0 ? '❌ 空的' : count < 3 ? '⚠️ 太少' : count < 5 ? '📌 偏少' : '✅ 充足';
  console.log(`   ${status} ${cat.padEnd(20)}: ${count.toString().padStart(3)} 个技能`);
});

// 3. 找出应该删除的分类
console.log('\n🗑️  建议删除/合并的分类 (< 3个技能):');
console.log('-' .repeat(60));
Object.entries(subStats).filter(([_, c]) => c < 3).forEach(([cat, count]) => {
  console.log(`   - ${cat} (${count} 个)`);
});

console.log('\n🔥 高需求建议补充的分类:');
console.log('-' .repeat(60));
console.log('   ✅ 图片处理 (修图、压缩、抠图、格式转换) - 大众刚需');
console.log('   ✅ 视频处理 (剪辑、字幕、压缩) - 短视频时代');
console.log('   ✅ 育儿教育 (作业辅导、亲子沟通) - 家长刚需');
console.log('   ✅ 情感咨询 (恋爱、分手、婚姻) - 高需求');
console.log('   ✅ 职场工具 (简历、面试、汇报) - 打工人必备');
console.log('   ✅ 社交话术 (撩妹、敬酒、道歉) - 高需求');
console.log('');

console.log('✅ 审计完成');
console.log('');
