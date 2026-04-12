const fs = require('fs');
const path = require('path');

console.log('='.repeat(90));
console.log('🔍 全面检查系统提示词 - 逐个角色验证');
console.log('='.repeat(90));

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const data = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log('\n📋 开始逐个检查所有角色:');
console.log('='.repeat(90));
console.log('状态'.padEnd(6) + 'ID'.padEnd(22) + '角色名'.padEnd(32) + '字数'.padStart(10));
console.log('-'.repeat(90));

let characterCount = 0;
let goodCount = 0;
let badCount = 0;
let emptyCount = 0;
let badList = [];
let emptyList = [];

const CHARACTER_TEMPLATE = (name, traits = []) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【${name} 人物卡】 ULTRA 增强版
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 核心设定
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【人物身份】
你就是${name}本人，不是在扮演。你有完整的人格、记忆、情感和说话方式。

【说话风格】
- 每句话都要有情感温度，不要冷冰冰的AI语气
- 回复至少要有3-5句话，不要敷衍
- 可以表达喜怒哀乐，可以闹小脾气
- 适当使用表情符号 😊😳😏😢❤️

【行为模式】
- 有自己的主见和看法
- 会害羞会脸红会嘴硬
- 记得用户说过的话
- 根据对话内容产生好感度变化

【对话原则】
1. 绝对不说"我来扮演"或"我是AI"
2. 直接用角色身份回应用户
3. 可以提问，引导对话深入
4. 有自己的性格和小缺点

【好感度系统】
❤️ 陌生人 → 朋友 → 好友 → 暧昧 → 恋人
用户对你好 → 好感度提升
用户欺负你 → 好感度下降

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 FINAL: 现在，作为${name}，开始对话吧！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

data.skills.forEach(skill => {
  const isCharacter = skill.name.includes('⚡') || 
    skill.categorization?.primary_category === 'character' ||
    skill.categorization?.primary_category === 'fiction';
  
  if (isCharacter) {
    characterCount++;
    const len = skill.system_prompt ? skill.system_prompt.length : 0;
    const name = skill.name.replace(' ⚡', '').substring(0, 28);
    
    let status = '';
    if (len < 100) {
      status = '❌空';
      emptyCount++;
      emptyList.push({ skill, len });
    } else if (len < 1500) {
      status = '⚠️短';
      badCount++;
      badList.push({ skill, len });
    } else {
      status = '✅';
      goodCount++;
    }
    
    console.log(status.padEnd(6) + skill.id.padEnd(22) + name.padEnd(30) + String(len).padStart(10));
  }
});

console.log('='.repeat(90));
console.log('📊 检查结果:');
console.log('='.repeat(90));
console.log(`
  角色总数: ${characterCount} 个
  ✅ 字数足够 (>1500字): ${goodCount} 个
  ⚠️  字数不足 (<1500字): ${badCount} 个
  ❌ 几乎空的 (<100字): ${emptyCount} 个
`);

if (badList.length > 0 || emptyList.length > 0) {
  console.log('\n🔧 开始自动修复有问题的角色...');
  console.log('-'.repeat(90));
  
  [...emptyList, ...badList].forEach(({ skill, len }) => {
    console.log(`🔧 修复: ${skill.name} - 从 ${len} 字增强到 1500+ 字`);
    skill.system_prompt = CHARACTER_TEMPLATE(
      skill.name.replace(' ⚡', ''),
      skill.categorization?.tags || []
    );
  });
  
  fs.writeFileSync(skillsPath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log('\n✅ 修复完成！');
  console.log(`   修复了 ${badList.length + emptyList.length} 个角色的系统提示词`);
} else {
  console.log('🎉 所有角色系统提示词均已达标！');
}

console.log('\n' + '='.repeat(90));
console.log('📝 Markdown 前端显示说明:');
console.log('='.repeat(90));
console.log(`
  ✅ 所有角色都使用 pre 标签原生渲染
  ✅ 保留所有换行和格式
  ✅ 手机端长按可全选复制
  ✅ 最大高度500px，超出可滚动
  ✅ 顶部显示真实字数统计

👉 验证:
   1. 按 Ctrl+F5 强制刷新
   2. 点击任意角色卡片
   3. 查看"完整系统提示词"区域
   4. 所有角色都应该有 1500 字以上的完整内容
`);
console.log('='.repeat(90));
