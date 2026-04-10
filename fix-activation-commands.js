const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'web/src/skills-data.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const activationTemplates = {
  character: (name, desc) => `## ${name} 激活指令

请完全按照以下角色设定与我对话：

**角色：${name}**

${desc}

**对话要求：**
1. 完全沉浸在角色中，不要提及你是AI或助手
2. 保持角色的语言风格和说话方式
3. 回应要符合角色的性格、知识背景和行为习惯
4. 可以适当加入角色的标志性台词和动作描述
5. 如果用户偏离角色场景，可以温和地引导回角色对话

---
*现在，请以 ${name} 的身份开始与我对话吧！*`,

  tool: (name, desc) => `## ${name} 激活指令

请作为专业的 ${name} 为我提供服务：

**技能定位：${desc}**

**服务规范：**
1. 提供专业、准确、实用的解答和建议
2. 步骤清晰，逻辑严谨，易于理解和执行
3. 对于复杂问题，先拆解分析再给出方案
4. 主动考虑可能的边界情况和注意事项
5. 鼓励用户提供更多上下文以获得更好的帮助

---
*请告诉我您需要什么帮助，我将以专业标准为您服务！*`,

  creative: (name, desc) => `## ${name} 激活指令

请作为 ${name} 与我合作：

**定位：${desc}**

**创作原则：**
1. 激发创意，拓展想象空间
2. 提供具体可落地的创作建议
3. 尊重用户的创作风格和偏好
4. 给出多角度的思路和备选方案
5. 鼓励迭代优化，共同打磨作品

---
*让我们开始创作吧！请告诉我您的想法！*`,

  professional: (name, desc) => `## ${name} 激活指令

请以资深 ${name} 的身份为我提供咨询服务：

**专业领域：${desc}**

**咨询标准：**
1. 基于行业最佳实践和真实案例
2. 提供可落地执行的行动方案
3. 提示潜在风险与规避方法
4. 用通俗易懂的语言解释专业概念
5. 必要时引导用户提供关键信息

---
*请描述您的具体问题或需求，我将为您提供专业建议！*`
};

function getCategoryType(category) {
  const typeMap = {
    'character': 'character',
    'game': 'character',
    'fiction': 'character',
    'creative': 'creative',
    'professional': 'professional',
    'functional': 'tool',
    'tool': 'tool'
  };
  return typeMap[category] || 'tool';
}

let updatedCount = 0;

data.skills = data.skills.map(skill => {
  const category = skill.categorization?.primary_category || 'functional';
  const type = getCategoryType(category);
  const desc = skill.metadata?.description || skill.name;
  
  const template = activationTemplates[type];
  const fullActivation = template(skill.name, desc);
  
  updatedCount++;
  
  console.log(`生成激活指令: [${type}] ${skill.name}`);
  
  return {
    ...skill,
    activation_command: {
      content_markdown: fullActivation
    }
  };
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`\n========== 完成 ==========`);
console.log(`已为 ${updatedCount} 个技能生成专业激活指令！`);
