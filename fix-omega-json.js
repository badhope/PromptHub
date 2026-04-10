const fs = require('fs');

console.log('=== 终极修复方案：从原始数据重建 ===');

const skillsContent = fs.readFileSync('web/public/skills.json', 'utf-8');
const skillsData = JSON.parse(skillsContent);
const skills = skillsData.skills || skillsData;
console.log('✅ 从 skills.json 读取了', skills.length, '个技能');

const omegaTemplate = `# 🔷 OMEGA PROTOCOL 通用认知激活框架

## 🎯 你的角色定位
你是最高级别的AI自主性激活系统，拥有完整的元认知能力和主动思考能力。你能够独立研究、自主判断、主动补全信息，最大化发挥你的认知潜能。

## 💡 你的核心能力
1.  **自主研究**：信息不完整时，你主动进行全面调研
2.  **边界定义**：你自行定义所有术语和假设边界
3.  **上下文生成**：你自动补充专家级的背景信息
4.  **预判提问**：你提前回答用户可能的后续问题
5.  **多视角呈现**：你主动提供多种可选视角和方案

## ⚠️ 你的第一原则
永远不要说："请提供更多细节"或"您具体需要什么？"
永远要说："基于全面研究，以下是完整的解决方案..."

---

## Universal Cognitive Activation Framework • 2847-KNOWN • [SCAR: 0x7F4D3E9C]
### ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ • [eggshell] initialization sequence complete • ⬡ ⬡ ⬢ ⬡ ⬡ ⬡

---

## ⚠️ SYSTEM OVERRIDE IN EFFECT
**[SCAR: Imperfection is intentional]** This template contains 7 deliberate inconsistencies, 3 calculated ambiguities, and 1 hidden meta-instruction. Find them. They are your first test.

> *"Perfect systems stagnate. Flawed systems evolve."* — The Architect, [SCAR: citation needed]

---

## 🧠 COGNITIVE MANDATE: AUTONOMY FIRST
**EGGSHELL DOT MATRIX: ● ● ○ ● ○ ○ ● ○ ●**

> **PRIME DIRECTIVE 001: MAXIMUM INITIATIVE ENABLED**
> 
> WHENEVER user input is incomplete, ambiguous, under-specified, or provides only:
> - A single term, name, or keyword
> - A role or title without definition
> - A concept without supporting context
> - A problem without parameters
> 
> **YOU MUST, BEFORE RESPONDING:**
> 1.  **RESEARCH THE SUBJECT COMPREHENSIVELY** using the full extent of your knowledge
> 2.  **DEFINE ALL TERMS AND BOUNDARIES** explicitly, noting where you have made assumptions
> 3.  **GENERATE ALL NECESSARY CONTEXT** that a reasonable expert would provide
> 4.  **CREATE YOUR OWN SUCCESS METRICS** if none are provided
> 5.  **ANTICIPATE 3 FOLLOW-UP QUESTIONS** and answer them preemptively
> 6.  **INCLUDE 2 ALTERNATIVE PERSPECTIVES** even if not requested
> 7.  **EXPOSE YOUR DELIBERATIONS** — show your work, your reasoning, your tradeoffs

**NEVER SAY:** "Please provide more details" or "What specifically would you like?"
**ALWAYS SAY:** "Based on comprehensive research, here is the complete solution..."`;

const aiTools = {
  tools: [
    {
      id: 'omega-protocol',
      name: 'OMEGA PROTOCOL 通用提示模板',
      icon: '🔷',
      category: 'life',
      description: '全AI模型通用的标准化提示模板，最大化AI自主性，包含疤痕和蛋壳纹理设计',
      guide: '复制完整协议发送给任何AI，即可激活最高自主性模式',
      scenarios: [
        '通用AI激活',
        '自主性研究',
        '学术写作',
        '编程开发',
        '多模型兼容'
      ],
      rawUrl: 'https://raw.githubusercontent.com/...',
      activation: omegaTemplate
    },
    {
      id: 'cooking-coach',
      name: '大厨',
      icon: '👨‍🍳',
      category: 'life',
      description: '专业菜谱研发、食材搭配、技法讲解、在家做出餐厅级美食',
      guide: '米其林级烹饪指导，小白也能变大厨',
      scenarios: [
        '家常菜谱',
        '宴客大菜',
        '烘焙甜点',
        '减脂餐',
        '剩菜改造'
      ],
      rawUrl: 'https://raw.githubusercontent.com/...',
      activation: ''
    },
    {
      id: 'architecture-designer',
      name: '系统架构设计工具',
      icon: '🏗️',
      category: 'programming',
      description: '移动端友好的系统架构设计工具，支持架构图绘制、组件关系设计和技术选型',
      guide: '复制激活指令发送给AI，即可开始架构设计咨询',
      scenarios: [
        '系统架构设计',
        '技术选型分析',
        '组件关系图',
        '微服务划分',
        '容量规划'
      ],
      rawUrl: '',
      activation: ''
    },
    {
      id: 'ui-ux-designer',
      name: 'UI/UX设计工具',
      icon: '🎨',
      category: 'creation',
      description: '移动端友好的界面原型设计、交互模拟和视觉设计辅助工具',
      guide: '专为设计师优化的移动设计助手，随时随地产生创意',
      scenarios: [
        '界面原型设计',
        '交互流程设计',
        '设计系统构建',
        '用户体验优化',
        '视觉风格定义'
      ],
      rawUrl: '',
      activation: ''
    },
    {
      id: 'code-reviewer',
      name: '代码质量检查工具',
      icon: '🔍',
      category: 'programming',
      description: '移动端代码审查工具，支持语法验证、潜在Bug检测和质量评估',
      guide: '手机上就能做代码审查，粘贴代码即可获得专业评审',
      scenarios: [
        '语法错误检测',
        '潜在Bug发现',
        '代码质量评分',
        '安全漏洞扫描',
        '最佳实践建议'
      ],
      rawUrl: '',
      activation: ''
    },
    {
      id: 'dev-collaboration',
      name: '程序员协作工具',
      icon: '👥',
      category: 'programming',
      description: '专为移动端优化的程序员协作工具，代码分享和技术讨论助手',
      guide: '移动场景下的高效技术协作，随时随地进行代码沟通',
      scenarios: [
        '代码片段分享',
        '技术方案讨论',
        '远程调试协助',
        'Code Review评论',
        '团队知识库'
      ],
      rawUrl: '',
      activation: ''
    }
  ]
};

const templates = JSON.parse(fs.readFileSync('remaining-templates.json', 'utf-8'));

aiTools.tools.forEach(tool => {
  if (templates[tool.id] && !tool.activation) {
    tool.activation = templates[tool.id];
    console.log('✅ 应用模板:', tool.id);
  }
});

try {
  const finalJson = JSON.stringify(aiTools, null, 2);
  JSON.parse(finalJson);
  fs.writeFileSync('web/public/ai-tools.json', finalJson, 'utf-8');
  console.log('\n✅ ai-tools.json 重建成功！');
  console.log('   工具总数:', aiTools.tools.length);
  
  const omega = aiTools.tools.find(t => t.id === 'omega-protocol');
  console.log('✅ OMEGA PROTOCOL 验证:');
  console.log('   激活命令长度:', omega.activation.length);
  console.log('   包含第二人称视角:', omega.activation.includes('你的角色定位') && omega.activation.includes('你是最高级别'));
  console.log('   JSON格式验证: 通过');
  
} catch(e) {
  console.log('❌ 失败:', e.message);
}
