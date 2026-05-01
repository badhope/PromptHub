import type { Skill, SkillSummary } from '@/types/skill';
import { getSkillSystemPrompt, getSkillDescription } from '@/types/skill';

export type ExportPlatform = 'generic' | 'doubao' | 'chatgpt' | 'kimi' | 'wenxin' | 'qwen' | 'claude';

export interface ExportOptions {
  platform: ExportPlatform;
  includeMetadata: boolean;
  includeUsageGuide: boolean;
  includeScenarios: boolean;
}

const PLATFORM_CONFIGS: Record<ExportPlatform, { name: string; icon: string; greeting: string; instructions: string }> = {
  generic: {
    name: '通用格式',
    icon: '📄',
    greeting: '请将以下内容作为你的角色设定，严格按照此设定与我对话：',
    instructions: '使用方法：复制全部内容发送给 AI 即可激活角色',
  },
  doubao: {
    name: '豆包',
    icon: '🫘',
    greeting: '豆包你好，请读取以下角色设定文档，然后严格按照设定扮演这个角色：',
    instructions: '使用方法：打开豆包 → 点击"发送文件" → 选择此文档 → 等待豆包确认激活',
  },
  chatgpt: {
    name: 'ChatGPT',
    icon: '💬',
    greeting: 'Please read the following role definition document carefully, then strictly follow this role:',
    instructions: '使用方法：打开 ChatGPT → 粘贴全部内容 → 发送',
  },
  kimi: {
    name: 'Kimi',
    icon: '🌙',
    greeting: 'Kimi你好，请仔细阅读以下角色设定，然后完全进入这个角色：',
    instructions: '使用方法：打开 Kimi → 发送文件 → 选择此文档 → 等待 Kimi 确认',
  },
  wenxin: {
    name: '文心一言',
    icon: '👣',
    greeting: '文心你好，请读取以下角色设定，严格按照设定扮演：',
    instructions: '使用方法：打开文心一言 → 粘贴全部内容 → 发送',
  },
  qwen: {
    name: '通义千问',
    icon: '☁️',
    greeting: '千问你好，请读取以下角色设定文档，然后严格按照设定扮演：',
    instructions: '使用方法：打开通义千问 → 发送文件 → 选择此文档 → 等待确认',
  },
  claude: {
    name: 'Claude',
    icon: '🟠',
    greeting: 'Please carefully read the following role definition and strictly follow this role:',
    instructions: '使用方法：打开 Claude → 粘贴全部内容 → 发送',
  },
};

function generateMarkdown(skill: Skill | SkillSummary, options: ExportOptions): string {
  const { includeMetadata, includeUsageGuide, includeScenarios } = options;

  const systemPrompt = getSkillSystemPrompt(skill);
  const description = getSkillDescription(skill);
  const name = skill.name || skill.metadata?.title || '未知角色';
  const tags = skill.categorization?.tags || [];
  const category = skill.categorization?.primary_category || '';

  let markdown = '';

  markdown += `# 🎭 ${name}\n\n`;

  if (description) {
    markdown += `> ${description}\n\n`;
  }

  if (tags.length > 0) {
    markdown += `**标签**: ${tags.join(' · ')}\n\n`;
  }

  markdown += `---\n\n`;

  markdown += `## 📋 角色设定\n\n`;
  markdown += `${systemPrompt}\n\n`;

  if (includeMetadata) {
    markdown += `---\n\n`;
    markdown += `## ℹ️ 角色信息\n\n`;
    markdown += `| 属性 | 值 |\n|------|-----|\n`;
    markdown += `| 名称 | ${name} |\n`;
    markdown += `| 分类 | ${category} |\n`;
    if ('metadata' in skill && skill.metadata && 'version' in skill.metadata) {
      markdown += `| 版本 | ${(skill.metadata as any).version || 'N/A'} |\n`;
    }
    if ('metadata' in skill && skill.metadata && 'author' in skill.metadata) {
      markdown += `| 作者 | ${(skill.metadata as any).author || 'N/A'} |\n`;
    }
    if (skill.stats) {
      markdown += `| 评分 | ${skill.stats.rating || 'N/A'} ⭐ |\n`;
      markdown += `| 使用次数 | ${skill.stats.use_count || 0} |\n`;
    }
    markdown += `\n`;
  }

  if (includeScenarios && 'capabilities' in skill && skill.capabilities?.scenarios) {
    markdown += `---\n\n`;
    markdown += `## 🎯 适用场景\n\n`;
    (skill.capabilities as any).scenarios.forEach((scenario: any, index: number) => {
      markdown += `${index + 1}. **${scenario.scenario}**: ${scenario.description}\n`;
    });
    markdown += `\n`;
  }

  if (includeUsageGuide) {
    markdown += `---\n\n`;
    markdown += `## 💡 使用指南\n\n`;
    markdown += `### 如何开始对话\n\n`;
    markdown += `1. 将本文档发送给 AI\n`;
    markdown += `2. 等待 AI 确认已读取角色设定\n`;
    markdown += `3. 直接描述你的需求，AI 会以角色身份回答\n\n`;
    markdown += `### 使用技巧\n\n`;
    markdown += `- **提供背景**: 告诉 AI 你的具体情况，回答会更精准\n`;
    markdown += `- **明确目标**: 说清楚你想要什么结果\n`;
    markdown += `- **多轮对话**: 可以追问、让 AI 修改、优化\n`;
    markdown += `- **保存对话**: 重要的对话结果记得保存\n\n`;
    markdown += `### 注意事项\n\n`;
    markdown += `- AI 的回答仅供参考，重要决策请自行验证\n`;
    markdown += `- 涉及专业领域（法律、医疗等），建议咨询专业人士\n`;
    markdown += `- 不要向 AI 透露个人敏感信息\n\n`;
  }

  markdown += `---\n\n`;
  markdown += `> 📱 来自 Skillora (灵境) - AI 应用商店\n`;
  markdown += `> 🔗 skillora.com\n`;

  return markdown;
}

export function exportSkillToMarkdown(skill: Skill | SkillSummary, platform: ExportPlatform = 'generic'): { content: string; filename: string } {
  const config = PLATFORM_CONFIGS[platform];
  
  const options: ExportOptions = {
    platform,
    includeMetadata: true,
    includeUsageGuide: true,
    includeScenarios: true,
  };

  const markdown = generateMarkdown(skill, options);
  
  const header = `${config.icon} ${config.name}专用角色文档\n\n${config.greeting}\n\n---\n\n`;
  const footer = `\n---\n\n📖 ${config.instructions}`;
  
  const fullContent = header + markdown + footer;
  
  const rawName = skill.name || skill.metadata?.title || 'skill';
  const sanitizedName = rawName
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  const filename = `${sanitizedName}-${platform === 'generic' ? 'role' : platform}.md`;
  
  return { content: fullContent, filename };
}

export function exportSkillToFile(skill: Skill | SkillSummary, platform: ExportPlatform = 'generic'): void {
  const { content, filename } = exportSkillToMarkdown(skill, platform);
  
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getExportPlatforms(): Array<{ id: ExportPlatform; name: string; icon: string; description: string }> {
  return [
    { id: 'generic', name: '通用 Markdown', icon: '📄', description: '适配所有 AI 平台' },
    { id: 'doubao', name: '豆包', icon: '🫘', description: '针对豆包优化' },
    { id: 'chatgpt', name: 'ChatGPT', icon: '💬', description: '针对 ChatGPT 优化' },
    { id: 'kimi', name: 'Kimi', icon: '🌙', description: '针对 Kimi 优化' },
    { id: 'wenxin', name: '文心一言', icon: '👣', description: '针对文心一言优化' },
    { id: 'qwen', name: '通义千问', icon: '☁️', description: '针对通义千问优化' },
    { id: 'claude', name: 'Claude', icon: '🟠', description: '针对 Claude 优化' },
  ];
}
