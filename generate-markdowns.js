const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'web/src/skills-data.json');
const skillsDir = path.join(__dirname, 'web/src/skills');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let createdCount = 0;

data.skills.forEach(skill => {
  const mdPath = path.join(skillsDir, `${skill.id}.md`);
  
  if (!fs.existsSync(mdPath)) {
    const mdContent = `# ${skill.name}

## 技能描述

${skill.metadata.description}

## 激活指令

\`\`\`
${skill.activation_command?.content_markdown || '请使用该技能进行互动'}
\`\`\`

## 标签

${skill.metadata.tags?.map(tag => `- ${tag}`).join('\n') || '- 无'}

## 使用说明

直接与技能对话即可获得专业的帮助和建议。

---

*技能编号: ${skill.skill_number}*
`;

    fs.writeFileSync(mdPath, mdContent, 'utf8');
    createdCount++;
    console.log(`创建: ${skill.id}.md`);
  }
});

console.log(`\n完成创建 ${createdCount} 个Markdown文件！`);
