const fs = require('fs');
const path = require('path');

console.log('🔍 深度内容质量审计开始！\n');

const skillsPath = path.join(__dirname, 'public', 'skills-data.json');
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
const skills = skillsData.skills || skillsData;

const simNames = ['模拟器', '测评', '测试', '游戏', '种田', '相簿', '退婚', '演讲'];
const simSkills = skills.filter(s => simNames.some(n => (s.name || '').includes(n)));

console.log(`🎯 找到 ${simSkills.length} 个模拟器/测评类技能：`);
simSkills.forEach(s => console.log(`   - ${s.name}`));

console.log('\n🚨 开始深度抨击内容质量问题！\n');

let problems = [];

simSkills.forEach(skill => {
  const content = skill.system_prompt || '';
  
  // 检查1：选项重复率
  const options = content.match(/[ABCDF]\. /g) || [];
  const uniqueOptions = [...new Set(content.match(/[ABCDF]\. [^\n→]+/g) || [])];
  
  if (options.length !== uniqueOptions.length) {
    problems.push({
      skill: skill.name,
      level: '🔴 严重',
      issue: `发现重复选项！选项总数${options.length}，去重后${uniqueOptions.length}`,
      fix: '必须每个选项都100%独特，不能有重复'
    });
  }
  
  // 检查2：有没有敷衍的"什么都不做"类选项泛滥
  const nothingOptions = (content.match(/假装|算了|不管|装没看见|老实|无所谓/g) || []).length;
  if (nothingOptions > 3) {
    problems.push({
      skill: skill.name,
      level: '🟠 严重',
      issue: `敷衍选项太多！共有${nothingOptions}个"什么都不做"类选项`,
      fix: '最多只能有1个保守选项，其他必须有戏剧冲突！'
    });
  }
  
  // 检查3：选项后果描述是否具体
  const vagueConsequences = (content.match(/结局|展开|路线/g) || []).length;
  const specificConsequences = (content.match(/\+\d+|-\d+|震惊|全场|疯了|傻了/g) || []).length;
  if (specificConsequences < vagueConsequences * 2) {
    problems.push({
      skill: skill.name,
      level: '🟡 中等',
      issue: '后果描述太模糊！太多"XX结局"没有具体数值和戏剧化描述',
      fix: '每个选项必须带具体的：属性变化 + 戏剧化描述'
    });
  }
  
  // 检查4：事件数量够不够多
  const events = (content.match(/【事件\d+】|名场面|分支/g) || []).length;
  if (events < 3) {
    problems.push({
      skill: skill.name,
      level: '🔴 致命',
      issue: `事件太少！只有${events}个，玩家玩一次就腻了`,
      fix: '至少要有5个以上分支事件，每个事件3-6个选项'
    });
  }
  
  // 检查5：有没有离谱/沙雕选项（灵魂所在）
  const crazyOptions = (content.match(/gay|搞事情|阴招|骚操作|离谱|阿姨我不想努力了|NTR/g) || []).length;
  if (crazyOptions < 2) {
    problems.push({
      skill: skill.name,
      level: '🟠 严重',
      issue: '不够好玩！离谱/沙雕/搞事情选项太少',
      fix: '至少30%选项必须是离谱的、搞事情的、打破常规的！'
    });
  }
  
  // 检查6：角色数量
  const roles = (content.match(/✅ .+ - /g) || []).length;
  if (roles < 4) {
    problems.push({
      skill: skill.name,
      level: '🟡 中等',
      issue: `可玩角色太少！只有${roles}个`,
      fix: '至少要有4个以上可扮演角色，包括反派和路人视角'
    });
  }
});

console.log('═══════════════════════════════════════════');
console.log(`📊 总计发现 ${problems.length} 个内容质量问题！`);
console.log('═══════════════════════════════════════════\n');

problems.forEach((p, i) => {
  console.log(`${i+1}. [${p.level}] 【${p.skill}】`);
  console.log(`   ❌ 问题：${p.issue}`);
  console.log(`   🔥 修复：${p.fix}`);
  console.log('');
});

if (problems.length === 0) {
  console.log('🎉 暂时没发现大问题！但还可以继续深挖优化！');
}

console.log('\n💡 核心结论：现在只是"有没有"的问题，还远远没到"好不好玩"的程度！');
console.log('💡 模拟器的灵魂就是：戏剧冲突 + 沙雕选项 + 多分支！必须全部强化！');
