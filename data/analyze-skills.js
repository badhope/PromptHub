const fs = require('fs');
const path = require('path');

const skillsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'skills.json'), 'utf-8'));

const versionedSkills = [];
const duplicateSkills = new Map();
const skillNameMap = new Map();

skillsData.skills.forEach(skill => {
  if (skill.id.includes('-v') && /-v\d+$/.test(skill.id)) {
    versionedSkills.push({
      id: skill.id,
      name: skill.name,
      version: skill.id.match(/-v(\d+)$/)?.[1]
    });
  }
  
  if (/\s+[Vv]\d+/.test(skill.name)) {
    versionedSkills.push({
      id: skill.id,
      name: skill.name,
      version: skill.name.match(/[Vv](\d+)/)?.[1]
    });
  }
  
  const baseName = skill.name.replace(/\s*[-–—]\s*.*$/, '').replace(/\s+[Vv]\d+.*$/, '').trim();
  if (skillNameMap.has(baseName)) {
    skillNameMap.get(baseName).push(skill);
  } else {
    skillNameMap.set(baseName, [skill]);
  }
});

skillNameMap.forEach((skills, baseName) => {
  if (skills.length > 1) {
    duplicateSkills.set(baseName, skills);
  }
});

console.log('=== 带版本号的技能 ===');
console.log(`共找到 ${versionedSkills.length} 个带版本号的技能：\n`);
versionedSkills.forEach(skill => {
  console.log(`- ${skill.name} (ID: ${skill.id}, Version: ${skill.version})`);
});

console.log('\n\n=== 重复的技能 ===');
console.log(`共找到 ${duplicateSkills.size} 组重复技能：\n`);
duplicateSkills.forEach((skills, baseName) => {
  console.log(`\n【${baseName}】(${skills.length}个版本):`);
  skills.forEach(skill => {
    console.log(`  - ${skill.name} (ID: ${skill.id})`);
  });
});

const report = {
  versionedSkills,
  duplicateSkills: Array.from(duplicateSkills.entries()).map(([name, skills]) => ({
    baseName: name,
    count: skills.length,
    skills: skills.map(s => ({ id: s.id, name: s.name }))
  }))
};

fs.writeFileSync(
  path.join(__dirname, 'skill-analysis-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n\n分析报告已保存到 skill-analysis-report.json');
