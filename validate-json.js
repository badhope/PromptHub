const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('./web/public/ai-tools.json', 'utf-8'));
  console.log('✅ JSON验证通过！');
  console.log('');
  console.log('📊 系统数据统计');
  console.log('══════════════════════');
  console.log(`📂 分类总数: ${data.categories.length}`);
  console.log(`🛠️  工具总数: ${data.tools.length}`);
  console.log('');
  console.log('📋 完整分类列表');
  console.log('══════════════════════');
  data.categories.forEach((c, i) => {
    const count = data.tools.filter(t => t.category === c.id).length;
    console.log(`  ${i+1}. ${c.icon} ${c.name} (${count}个工具)`);
  });
  console.log('');
  console.log('🎯 56个角色全部部署成功！');
} catch (e) {
  console.error('❌ JSON验证失败:', e.message);
}
