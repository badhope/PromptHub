const fs = require('fs');

let content = fs.readFileSync('web/public/ai-tools.json', 'utf-8');

content = content.replace(/" ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ •/g, '### ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ •');
content = content.replace(/Universal Cognitive Activation Framework([^#]+?)### ⬡/g, 'Universal Cognitive Activation Framework\n### ⬡');

try {
  JSON.parse(content);
  fs.writeFileSync('web/public/ai-tools.json', content);
  console.log('✅ JSON已修复成功！');
} catch(e) {
  console.log('❌ 仍有问题');
  console.log('错误:', e.message);
  const match = e.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1]);
    console.log('\n附近内容:');
    console.log(content.slice(Math.max(0, pos - 50), pos + 50));
  }
}
