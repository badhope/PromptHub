export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  enum?: string[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'search' | 'code' | 'file' | 'web' | 'data' | 'utility';
  parameters: ToolParameter[];
  examples: string[];
  enabled: boolean;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: 'web_search',
    name: '网络搜索',
    icon: '🔍',
    description: '搜索互联网获取实时信息、新闻、技术文档等',
    category: 'search',
    parameters: [
      { name: 'query', type: 'string', description: '搜索关键词', required: true },
    ],
    examples: ['搜索最新的 AI 新闻', '查找 React 19 的新特性'],
    enabled: true,
  },
  {
    id: 'file_read',
    name: '读取文件',
    icon: '📄',
    description: '读取并分析本地文件内容',
    category: 'file',
    parameters: [
      { name: 'path', type: 'string', description: '文件路径', required: true },
    ],
    examples: ['读取 package.json 内容'],
    enabled: true,
  },
  {
    id: 'file_write',
    name: '写入文件',
    icon: '✏️',
    description: '创建或修改本地文件',
    category: 'file',
    parameters: [
      { name: 'path', type: 'string', description: '文件路径', required: true },
      { name: 'content', type: 'string', description: '文件内容', required: true },
    ],
    examples: ['创建 index.ts 文件'],
    enabled: true,
  },
  {
    id: 'code_execute',
    name: '代码执行',
    icon: '⚡',
    description: '执行 Python/JavaScript 代码并返回结果',
    category: 'code',
    parameters: [
      { name: 'language', type: 'string', description: '编程语言', required: true, enum: ['python', 'javascript', 'typescript'] },
      { name: 'code', type: 'string', description: '要执行的代码', required: true },
    ],
    examples: ['计算 100 的阶乘'],
    enabled: true,
  },
  {
    id: 'shell_command',
    name: '终端命令',
    icon: '💻',
    description: '执行系统命令行指令',
    category: 'utility',
    parameters: [
      { name: 'command', type: 'string', description: 'Shell 命令', required: true },
    ],
    examples: ['查看当前目录文件', '安装 npm 依赖'],
    enabled: true,
  },
  {
    id: 'skill_activate',
    name: 'Skill 调用',
    icon: '🎯',
    description: '激活并使用 Prompt Skill',
    category: 'utility',
    parameters: [
      { name: 'skillId', type: 'string', description: 'Skill ID', required: true },
      { name: 'variables', type: 'object', description: '变量参数' },
    ],
    examples: ['激活代码审查 Skill'],
    enabled: true,
  },
  {
    id: 'fetch_url',
    name: '网页抓取',
    icon: '🌐',
    description: '获取并解析网页内容',
    category: 'web',
    parameters: [
      { name: 'url', type: 'string', description: '网页地址', required: true },
    ],
    examples: ['获取 GitHub 项目 README'],
    enabled: true,
  },
];

export function getToolPrompt(): string {
  const tools = TOOL_DEFINITIONS.filter(t => t.enabled);
  
  return `
## 可用工具

你可以使用以下工具来辅助完成任务。当需要调用工具时，使用以下 JSON 格式：

\`\`\`json
{
  "action": "tool_call",
  "tool": "工具ID",
  "parameters": { "参数名": "参数值" }
}
\`\`\`

### 工具列表:
${tools.map(t => `
- **${t.icon} ${t.name}** (${t.id})
  ${t.description}
  参数: ${t.parameters.map(p => `${p.name}${p.required ? '*' : ''}: ${p.description}`).join(', ')}
  示例: ${t.examples.join('; ')}
`).join('\n')}

### 工具调用规则:
1. 每次只调用一个工具
2. 调用工具时不需要其他解释，只输出 JSON
3. 工具执行完成后，我会给你返回结果
4. 分析结果后，决定是否继续调用工具或给出最终答案
`;
}

export function parseToolCall(content: string) {
  const match = content.match(/```json\s*({[\s\S]*?})\s*```/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1]);
    if (parsed.action === 'tool_call' && parsed.tool) {
      return {
        tool: parsed.tool,
        parameters: parsed.parameters || {},
        raw: match[1],
      };
    }
  } catch {
  }
  return null;
}
