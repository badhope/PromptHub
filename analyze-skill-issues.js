const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'web/src/skills-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const issues = {
  versionNumbers: [],
  templateDescriptions: [],
  missingActivation: [],
  missingMarkdown: []
};

data.skills.forEach(skill => {
  if (/v\d+/i.test(skill.name)) {
    issues.versionNumbers.push({
      id: skill.id,
      name: skill.name,
      number: skill.skill_number
    });
  }

  const desc = skill.metadata.description || '';
  if (desc.includes('functional 类技能') || 
      desc.includes('具有独特的功能和应用场景') ||
      desc.includes('扮演重要角色') ||
      desc.includes('多样化应用场景') ||
      desc.includes('获得专业的建议和服务') ||
      desc.length < 30) {
    issues.templateDescriptions.push({
      id: skill.id,
      name: skill.name,
      number: skill.skill_number,
      description: desc
    });
  }

  const activation = skill.activation_command || {};
  if (!activation.content_markdown || activation.content_markdown.length < 10) {
    issues.missingActivation.push({
      id: skill.id,
      name: skill.name,
      number: skill.skill_number
    });
  }

  const mdPath = path.join(__dirname, 'web/src/skills', `${skill.id}.md`);
  if (!fs.existsSync(mdPath)) {
    issues.missingMarkdown.push({
      id: skill.id,
      name: skill.name,
      number: skill.skill_number
    });
  }
});

console.log('=== 版本号问题技能 (' + issues.versionNumbers.length + '个) ===');
issues.versionNumbers.forEach((s, i) => 
  console.log(`${i+1}. [${s.number}] ${s.name}`)
);

console.log('\n=== 模板描述问题技能 (' + issues.templateDescriptions.length + '个) ===');
issues.templateDescriptions.forEach((s, i) => 
  console.log(`${i+1}. [${s.number}] ${s.name}: ${s.description.substring(0, 80)}...`)
);

console.log('\n=== 缺失激活指令技能 (' + issues.missingActivation.length + '个) ===');
issues.missingActivation.forEach((s, i) => 
  console.log(`${i+1}. [${s.number}] ${s.name}`)
);

console.log('\n=== 缺失Markdown文件技能 (' + issues.missingMarkdown.length + '个) ===');
issues.missingMarkdown.forEach((s, i) => 
  console.log(`${i+1}. [${s.number}] ${s.name}`)
);

fs.writeFileSync(path.join(__dirname, 'skill-issues.json'), JSON.stringify(issues, null, 2));
console.log('\n结果已保存到 skill-issues.json');
