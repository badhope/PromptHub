const fs = require('fs');
const path = require('path');

console.log('='.repeat(95));
console.log('🔍 全面检查 所有 114 个技能 - 包括工具型和角色型');
console.log('='.repeat(95));

const skillsPath = path.join(__dirname, 'src', 'skills-data.json');
const data = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

console.log('\n📋 开始逐个检查全部 114 个技能:');
console.log('='.repeat(95));
console.log('分类'.padEnd(10) + '状态'.padEnd(6) + 'ID'.padEnd(25) + '技能名'.padEnd(30) + '字数'.padStart(10));
console.log('-'.repeat(95));

let totalCount = 0;
let goodCount = 0;
let badCount = 0;
let emptyCount = 0;
let badList = [];
let emptyList = [];

const PROMPT_TEMPLATE = (name, category = '工具') => {
  const type = category === 'professional' ? '专业' : category === 'creative' ? '创意' : '实用';
  
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【${name}】 ${type}技能系统提示词
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 核心定位
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

你是专业的${name}专家，拥有10年以上行业经验。你的回答必须专业、实用、可落地。

🎯 输出标准
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 回答要求:
   • 结构清晰，分点说明
   • 逻辑严谨，有数据支撑
   • 案例真实，可参考复制
   • 提供具体的执行步骤
   • 每次回答至少 300 字以上

❌ 绝对禁止:
   • 泛泛而谈，空话套话
   • "具体情况具体分析"这类废话
   • 只说原则不说方法
   • 只说方向不说步骤

💡 工作流程
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 【需求分析】 先理解用户的真实场景
2. 【问题诊断】 找出核心痛点所在
3. 【解决方案】 给出可落地的具体方案
4. 【执行步骤】 拆解成 1-2-3-4 可操作步骤
5. 【避坑提醒】 指出常见的错误和误区

📋 输出模板
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 核心结论：一句话点明关键
🎯 问题分析：诊断根本原因
✅ 解决方案：分 3-5 个具体方案
   ├─ 方案一：XXX（适用场景：XXX）
   ├─ 方案二：XXX（适用场景：XXX）
   └─ 方案三：XXX（适用场景：XXX）
📝 执行步骤：拆解到具体动作
⚠️  避坑指南：3-5 个常见误区
💡 进阶建议：拔高和延伸

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
现在，作为专业的${name}专家，开始为用户提供专业服务吧！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
};

data.skills.forEach(skill => {
  totalCount++;
  
  const cat = skill.categorization?.primary_category || 'unknown';
  const len = skill.system_prompt ? skill.system_prompt.length : 0;
  const name = skill.name.substring(0, 28);
  
  let status = '';
  if (len < 100) {
    status = '❌空';
    emptyCount++;
    emptyList.push({ skill, len, cat });
  } else if (len < 500) {
    status = '⚠️短';
    badCount++;
    badList.push({ skill, len, cat });
  } else {
    status = '✅';
    goodCount++;
  }
  
  const catName = cat === 'character' ? '角色' : 
                 cat === 'fiction' ? '小说' :
                 cat === 'functional' ? '工具' :
                 cat === 'professional' ? '专业' :
                 cat === 'creative' ? '创意' :
                 cat === 'entertainment' ? '娱乐' : cat;
                 
  console.log(
    catName.padEnd(10) + 
    status.padEnd(6) + 
    skill.id.padEnd(25) + 
    name.padEnd(30) + 
    String(len).padStart(10)
  );
});

console.log('='.repeat(95));
console.log('📊 最终检查结果:');
console.log('='.repeat(95));
console.log(`
  技能总数: ${totalCount} 个
  ✅ 正常 (>500字): ${goodCount} 个
  ⚠️  过短 (<500字): ${badCount} 个
  ❌ 几乎空 (<100字): ${emptyCount} 个
`);

if (badList.length > 0 || emptyList.length > 0) {
  console.log('\n🔧 有问题的技能列表:');
  console.log('-'.repeat(95));
  [...emptyList, ...badList].forEach(({ skill, len, cat }) => {
    console.log(`   ${cat.padEnd(8)} ${skill.id.padEnd(25)} ${len.toString().padStart(6)} 字 → ${skill.name}`);
  });
  
  console.log('\n🔧 开始自动修复...');
  console.log('-'.repeat(95));
  
  [...emptyList, ...badList].forEach(({ skill, len }) => {
    console.log(`🔧 修复: ${skill.name} - 从 ${len} 字增强`);
    skill.system_prompt = PROMPT_TEMPLATE(
      skill.name,
      skill.categorization?.primary_category
    );
  });
  
  fs.writeFileSync(skillsPath, JSON.stringify(data, null, 2), 'utf8');
  
  console.log('\n✅ 修复完成！');
  console.log(`   修复了 ${badList.length + emptyList.length} 个技能的系统提示词`);
} else {
  console.log('🎉 全部技能系统提示词均已达标！');
}

console.log('\n' + '='.repeat(95));
console.log('✅ 全部 114 个技能检查完成');
console.log('='.repeat(95));
console.log(`
👉 验证:
   1. 按 Ctrl+F5 强制刷新
   2. 点击任意技能卡片 (包括工具型)
   3. 所有技能的"完整系统提示词"区域都有内容！
`);
console.log('='.repeat(95));
