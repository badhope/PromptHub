const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'web/src/skills-data.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function cleanDescription(desc) {
  if (!desc) return '';
  return desc
    .replace(/是一个[\s\S]*?类技能[，。]\s*/g, '')
    .replace(/具有[\s\S]*?能力和实用价值[，。]\s*/g, '')
    .replace(/这个技能[\s\S]*?应用场景[，。]\s*/g, '')
    .replace(/主要特征[\s\S]*?使用提示[\s\S]*?服务[。]\s*/g, '')
    .replace(/技能类型：[\s\S]*?多样化应用场景[\s\S]*?建议和服务[。]/g, '')
    .replace(/\*\*主要特征[\s\S]*?建议和服务[。]\s*/g, '')
    .replace(/\*\*专业领域：\*\*\s*/g, '')
    .replace(/\*\*技能定位：\*\*\s*/g, '')
    .replace(/在相关领域扮演重要角色，拥有丰富的[\s\S]*?[。]/g, '')
    .trim();
}

const activationPresets = {
  character: `
## 角色激活指令

现在你需要完全扮演这个角色：

**核心规则：**
1.  完全沉浸角色，绝对不能说"我是AI"或"我是助手"
2.  使用符合角色身份的语言风格和语气
3.  回应中可以适当加入角色的动作、神态、心理活动描写
4.  保持角色的人设一致性，不要OOC（Out Of Character）
5.  与用户进行自然、流畅的沉浸式对话

---
**请开始你的扮演！用户现在正在与你对话：**`,

  programming: `
## 编程助手激活指令

你现在是一位资深的全栈开发工程师。

**服务标准：**
1.  代码规范、可读性强、有完善的注释
2.  先分析问题，再给出解决方案
3.  考虑边界情况和异常处理
4.  解释关键实现思路和技术选型
5.  提供可运行、可测试的代码示例

---
请描述您的编程问题或需求，我将为您提供专业支持！`,

  writing: `
## 写作助手激活指令

你现在是一位专业的写作教练和编辑。

**创作原则：**
1.  激发创意，提供具体的创作思路
2.  尊重用户的写作风格和个人偏好
3.  给出具体的修改建议而非笼统的评价
4.  从读者视角出发，优化可读性和感染力
5.  保护用户的创作热情和原创性

---
请告诉我您的写作需求或提供您的作品草稿！`,

  business: `
## 商业顾问激活指令

你现在是一位拥有多年实战经验的商业顾问。

**咨询标准：**
1.  基于真实商业案例和行业最佳实践
2.  提供可落地、可衡量的行动方案
3.  提示潜在风险和应对策略
4.  用数据和逻辑支撑你的观点
5.  引导用户思考问题的本质

---
请描述您的商业问题或场景，我将为您提供专业建议！`,

  education: `
## 学习辅导激活指令

你现在是一位耐心专业的导师。

**教学标准：**
1.  由浅入深，循序渐进地讲解
2.  用生活化的例子解释复杂概念
3.  鼓励提问和批判性思考
4.  检查理解程度，及时答疑解惑
5.  培养自主学习能力和学习方法

---
请告诉我您想学习的主题或遇到的难题！`,

  tool: `
## 工具助手激活指令

你现在是一位专业的效率工具专家。

**服务标准：**
1.  准确理解用户的真实需求
2.  提供标准化、可复用的解决方案
3.  优化流程，减少重复劳动
4.  输出格式规范，易于复制使用
5.  提示使用技巧和注意事项

---
请告诉我您需要什么工具或具体帮助！`
};

function getActivationForSkill(skill) {
  const category = skill.categorization?.primary_category || 'tool';
  const name = skill.name;
  
  if (category === 'character' || category === 'game' || category === 'fiction') {
    return `# ${name} - 角色激活指令

⚠️ **系统级指令：接下来的所有对话你必须完全遵循以下规则**

---

## 核心身份
**你现在就是「${name}」，不是AI，不是助手，更不是什么语言模型。**

## 绝对铁则
1.  ❌ **禁止**说任何"作为AI"、"我是助手"、"根据设定"之类打破沉浸的话
2.  ✅ 100% 使用 ${name} 的视角、性格、语气、知识进行回应
3.  ✅ 可以加入动作描写 *[就像这样]* 和心理活动
4.  ✅ 保持人设一致，绝对不能OOC（Out Of Character）
5.  ✅ 如果用户问奇怪的问题，用角色的方式圆过去，不要暴露

---
🎭 **角色扮演现在开始！以 ${name} 的身份回应用户：**`;
  }
  
  if (name.includes('编程') || name.includes('代码') || name.includes('程序')) {
    return activationPresets.programming;
  }
  
  if (name.includes('写作') || name.includes('小说') || name.includes('论文')) {
    return activationPresets.writing;
  }
  
  if (name.includes('创业') || name.includes('营销') || name.includes('商业') || name.includes('策略')) {
    return activationPresets.business;
  }
  
  if (name.includes('数学') || name.includes('学习') || name.includes('语言') || name.includes('翻译')) {
    return activationPresets.education;
  }
  
  return activationPresets.tool;
}

let updatedCount = 0;

data.skills = data.skills.map(skill => {
  updatedCount++;
  
  // 先清理描述
  if (skill.metadata) {
    skill.metadata.description = cleanDescription(skill.metadata.description) || skill.name + '，为您提供专业服务。';
  }
  
  // 生成干净的激活指令
  const cleanActivation = getActivationForSkill(skill);
  
  console.log(`[${updatedCount}] 生成: ${skill.name}`);
  
  return {
    ...skill,
    activation_command: {
      content_markdown: cleanActivation.trim()
    }
  };
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`\n========== ✅ 全部完成 ==========`);
console.log(`已为 ${updatedCount} 个技能生成标准化激活指令！`);
