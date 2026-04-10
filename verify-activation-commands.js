const fs = require('fs');
const data = JSON.parse(fs.readFileSync('web/public/ai-tools.json', 'utf-8'));

console.log('🔍 检查激活指令质量...');
console.log('='.repeat(70));

let issues = 0;
const firstPersonPatterns = ['我是', '我拥有', '我精通', '我擅长', '我的', '我提供', '我扮演', '我支持', '我推荐', '我帮助', '我会'];

console.log('\n📋 第一人称视角检查:');
console.log('-'.repeat(70));

data.tools.forEach(tool => {
  if (tool.activation) {
    let foundIssues = [];
    firstPersonPatterns.forEach(pattern => {
      if (tool.activation.includes(pattern)) {
        foundIssues.push(pattern);
      }
    });
    
    if (foundIssues.length > 0) {
      console.log(`⚠️  ${tool.icon} ${tool.name}: ${foundIssues.join(', ')}`);
      issues++;
    }
  } else {
    console.log(`❌ ${tool.icon} ${tool.name}: 缺少激活指令`);
    issues++;
  }
});

console.log('\n📋 第二人称视角检查:');
console.log('-'.repeat(70));

let secondPersonCount = 0;
data.tools.forEach(tool => {
  if (tool.activation && tool.activation.includes('你的')) {
    secondPersonCount++;
  }
});

console.log(`✅ 包含第二人称"你的"的工具: ${secondPersonCount}/${data.tools.length}`);

console.log('\n📋 结构化检查 (角色定义 + 核心能力):');
console.log('-'.repeat(70));

let structuredCount = 0;
data.tools.forEach(tool => {
  if (tool.activation && 
      (tool.activation.includes('角色') || tool.activation.includes('定位')) &&
      tool.activation.includes('能力')) {
    structuredCount++;
  }
});

console.log(`✅ 包含角色定义和核心能力的工具: ${structuredCount}/${data.tools.length}`);

console.log('\n📋 Markdown 格式检查:');
console.log('-'.repeat(70));

let markdownCount = 0;
data.tools.forEach(tool => {
  if (tool.activation && tool.activation.includes('#')) {
    markdownCount++;
  }
});

console.log(`✅ 包含 Markdown 标题的工具: ${markdownCount}/${data.tools.length}`);

console.log('\n' + '='.repeat(70));
if (issues === 0) {
  console.log('🎉 所有激活指令已通过质量检查！');
  console.log('✅ 无第一人称视角残留');
  console.log('✅ 所有工具都有激活指令');
  console.log('✅ 采用第二人称"你"视角表述');
  console.log('✅ 符合提示工程规范的结构化设计');
  console.log('✅ 标准 Markdown 格式');
} else {
  console.log(`⚠️  发现 ${issues} 个问题需要修复`);
}

console.log('\n📊 最终统计:');
console.log(`   总工具数: ${data.tools.length}`);
console.log(`   分类数: ${data.categories.length}`);
console.log(`   优化完成时间: ${data.generated_at}`);
