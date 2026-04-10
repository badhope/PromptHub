const fs = require('fs');

const data = JSON.parse(fs.readFileSync('web/public/ai-tools.json', 'utf-8'));
const templates = JSON.parse(fs.readFileSync('activation-templates.json', 'utf-8'));
const professionalTemplates = JSON.parse(fs.readFileSync('prompts-optimized.json', 'utf-8'));
const remainingTemplates = JSON.parse(fs.readFileSync('remaining-templates.json', 'utf-8'));

console.log('📊 开始应用优化的激活指令模板');
console.log('='.repeat(60));

const allTemplates = { ...templates, ...professionalTemplates, ...remainingTemplates };

let updated = 0;
let skipped = 0;

data.tools.forEach((tool, index) => {
  if (allTemplates[tool.id]) {
    data.tools[index].activation = allTemplates[tool.id];
    updated++;
    console.log(`✅ 已优化: ${tool.icon} ${tool.name}`);
  } else {
    skipped++;
    console.log(`⚠️  跳过: ${tool.icon} ${tool.name}`);
  }
});

data.tools.forEach((tool, index) => {
  if (data.tools[index].activation) {
    data.tools[index].activation = data.tools[index].activation
      .replace(/我是/g, '你是')
      .replace(/我拥有/g, '你拥有')
      .replace(/我精通/g, '你精通')
      .replace(/我擅长/g, '你擅长')
      .replace(/我的/g, '你的')
      .replace(/我提供/g, '你提供')
      .replace(/我扮演/g, '你扮演')
      .replace(/我支持/g, '你支持')
      .replace(/我推荐/g, '你推荐')
      .replace(/我帮助/g, '你帮助')
      .replace(/我会/g, '你会');
  }
});

data.generated_at = new Date().toISOString();
fs.writeFileSync('web/public/ai-tools.json', JSON.stringify(data, null, 2));

console.log('\n' + '='.repeat(60));
console.log(`📊 优化完成！`);
console.log(`✅ 已优化: ${updated} 个工具`);
console.log(`⚠️  跳过: ${skipped} 个工具`);
console.log(`📦 总计: ${data.tools.length} 个工具`);
console.log('\n✨ 所有激活指令已统一使用第二人称"你"表述');
console.log('✨ 已按照提示工程规范优化指令结构');
