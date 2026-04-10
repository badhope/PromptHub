const fs = require('fs');

const data = JSON.parse(fs.readFileSync('web/public/ai-tools.json', 'utf-8'));

const omegaIndex = data.tools.findIndex(t => t.id === 'omega-protocol-v7');

if (omegaIndex >= 0) {
  const chineseIntro = `# 🔷 OMEGA PROTOCOL 通用认知激活框架

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

`;

  const originalEnglish = data.tools[omegaIndex].activation
    .replace('# 🔷 OMEGA PROTOCOL \n##', '##')
    .replace('# 🔷 OMEGA PROTOCOL 通用认知激活框架\n\n## 🎯 你的角色定位[\s\S]*?---\n\n', '');

  data.tools[omegaIndex].activation = chineseIntro + originalEnglish
    .replace('" ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ •', '### ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ •');

  data.generated_at = new Date().toISOString();

  fs.writeFileSync('web/public/ai-tools.json', JSON.stringify(data, null, 2));
  console.log('✅ OMEGA PROTOCOL 模板已优化，已添加中文第二人称角色定义');
} else {
  console.log('❌ 未找到 OMEGA PROTOCOL 模板');
}
