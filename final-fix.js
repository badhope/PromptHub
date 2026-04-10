const fs = require('fs');
const data = JSON.parse(fs.readFileSync('web/public/ai-tools.json', 'utf-8'));

console.log('📋 所有工具:\n');
data.tools.forEach((t, i) => {
  console.log(`${String(i+1).padStart(2)}. [${t.category}] ${t.id} → ${t.name} (${t.activation.length} chars)`);
});

// 终极清理 OMEGA
const omega = data.tools.find(t => t.name.includes('OMEGA'));
if (omega) {
  console.log('\n🧹 清理OMEGA残留...');
  let clean = omega.activation;
  
  // 深度清理所有版本痕迹
  clean = clean.replace(/v\d+\.?\d*\.?\d*/gi, '');
  clean = clean.replace(/version\s*\d+\.?\d*/gi, '');
  clean = clean.replace(/functional/gi, '专业功能');
  clean = clean.replace(/unique features/gi, '独特功能');
  clean = clean.replace(/\s{3,}/g, '\n\n');
  clean = clean.replace(/---\s*---/g, '---');
  
  omega.activation = clean;
  omega.name = 'OMEGA PROTOCOL 通用提示模板';
  console.log('✅ OMEGA已清理');
}

data.generated_at = new Date().toISOString();
fs.writeFileSync('web/public/ai-tools.json', JSON.stringify(data, null, 2));

console.log('\n' + '='.repeat(50));
console.log('✅ 最终修复完成');
console.log('='.repeat(50));
