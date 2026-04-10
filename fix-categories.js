const fs = require('fs');
const data = JSON.parse(fs.readFileSync('web/public/ai-tools.json', 'utf-8'));

const categoryRemap = {
  'writing': 'creation',
  'chat': 'life',
  'academic': 'learning',
  'design': 'creation',
  'productivity': 'life',
  'marketing': 'creation',
  'cooking': 'life',
  'health': 'life'
};

data.tools = data.tools.map(t => {
  if (categoryRemap[t.category]) {
    return {...t, category: categoryRemap[t.category]};
  }
  return t;
});

const ppt = data.tools.find(t => t.id === 'presentation-master');
if (ppt) ppt.category = 'life';

data.generated_at = new Date().toISOString();
fs.writeFileSync('web/public/ai-tools.json', JSON.stringify(data, null, 2));

console.log('✅ 分类重新映射完成');
console.log('\n📋 最终分类统计:');
['programming', 'learning', 'creation', 'life'].forEach(cat => {
  const c = data.categories.find(x => x.id === cat);
  const count = data.tools.filter(t => t.category === cat).length;
  console.log(`   ${c.icon} ${c.name}: ${count} 个工具`);
});
console.log('\n📊 总计:', data.tools.length, '个工具');
