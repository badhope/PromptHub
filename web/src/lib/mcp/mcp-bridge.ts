export interface MCPMessage {
  type: 'call_tool' | 'tool_result' | 'error' | 'ready';
  id: string;
  name?: string;
  parameters?: Record<string, any>;
  result?: any;
  error?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface MCPProvider {
  id: string;
  name: string;
  tools: MCPTool[];
  endpoint?: string;
  enabled: boolean;
}

class MCPBridge {
  private providers: Map<string, MCPProvider> = new Map();
  private listeners: Map<string, (msg: MCPMessage) => void> = new Map();
  private initialized = false;

  constructor() {
    this.initBuiltinProviders();
  }

  private initBuiltinProviders() {
    this.providers.set('filesystem', {
      id: 'filesystem',
      name: '文件系统工具',
      enabled: true,
      tools: [
        {
          name: 'filesystem_read',
          description: '读取文件内容',
          parameters: { path: { type: 'string', description: '文件路径' } },
        },
        {
          name: 'filesystem_write',
          description: '写入文件内容',
          parameters: {
            path: { type: 'string', description: '文件路径' },
            content: { type: 'string', description: '文件内容' },
          },
        },
        {
          name: 'filesystem_list',
          description: '列出目录内容',
          parameters: { path: { type: 'string', description: '目录路径' } },
        },
      ],
    });

    this.providers.set('shell', {
      id: 'shell',
      name: '终端命令工具',
      enabled: true,
      tools: [
        {
          name: 'shell_exec',
          description: '执行系统命令',
          parameters: {
            command: { type: 'string', description: '要执行的命令' },
            timeout: { type: 'number', description: '超时时间(秒)' },
          },
        },
      ],
    });

    this.providers.set('web', {
      id: 'web',
      name: '网络工具',
      enabled: true,
      tools: [
        {
          name: 'web_fetch',
          description: '获取网页内容',
          parameters: { url: { type: 'string', description: '网页地址' } },
        },
        {
          name: 'web_search',
          description: '网络搜索',
          parameters: { query: { type: 'string', description: '搜索关键词' } },
        },
      ],
    });

    this.providers.set('skills', {
      id: 'skills',
      name: 'Skill 调用工具',
      enabled: true,
      tools: [
        {
          name: 'skill_activate',
          description: '激活并使用 Prompt Skill',
          parameters: {
            skillId: { type: 'string', description: 'Skill ID' },
            variables: { type: 'object', description: '注入变量' },
          },
        },
      ],
    });

    this.initialized = true;
  }

  getAvailableProviders(): MCPProvider[] {
    return Array.from(this.providers.values()).filter(p => p.enabled);
  }

  getAvailableTools(): MCPTool[] {
    return this.getAvailableProviders().flatMap(p => p.tools);
  }

  getToolsPrompt(): string {
    const tools = this.getAvailableTools();
    
    return `
## MCP 可用工具

你可以通过 MCP 协议调用以下工具。使用格式：

\`\`\`json
{
  "action": "mcp_call",
  "tool": "工具名称",
  "parameters": { "参数名": "参数值" }
}
\`\`\`

### 工具列表:
${tools.map(t => `
- **${t.name}**
  ${t.description}
  参数: ${Object.entries(t.parameters).map(([k, v]) => 
    `${k}: ${(v as any).description}`
  ).join(', ')}
`).join('\n')}

每次只调用一个工具，调用后等待返回结果再继续。
`;
  }

  private async callBackendTool(tool: string, parameters: Record<string, any>): Promise<any> {
    try {
      const response = await fetch('/api/mcp/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, parameters }),
      });
      return await response.json();
    } catch {
      return { success: false, error: '后端工具调用失败' };
    }
  }

  async callTool(toolName: string, parameters: Record<string, any>): Promise<any> {
    switch (toolName) {
      case 'filesystem_list':
        return await this.callBackendTool('filesystem_list', parameters);
      
      case 'filesystem_read':
        return await this.callBackendTool('filesystem_read', parameters);
      
      case 'filesystem_write':
        return await this.callBackendTool('filesystem_write', parameters);
      
      case 'shell_exec':
        return await this.callBackendTool('shell_exec', parameters);
      
      case 'web_fetch':
        try {
          const response = await fetch('/api/mcp/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: parameters.url }),
          });
          return await response.json();
        } catch {
          return { success: false, error: '抓取失败' };
        }
      
      case 'web_search':
        return await this.callBackendTool('web_search', parameters);
      
      case 'skill_activate':
        return { 
          success: true, 
          skillId: parameters.skillId,
          message: `Skill ${parameters.skillId} 已激活`,
          variables: parameters.variables,
        };
      
      default:
        return { success: false, error: `未知工具: ${toolName}` };
    }
  }

  parseMCPRequest(content: string) {
    const match = content.match(/```json\s*({[\s\S]*?})\s*```/);
    if (!match) return null;

    try {
      const parsed = JSON.parse(match[1]);
      if (parsed.action === 'mcp_call' && parsed.tool) {
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
}

export const mcpBridge = new MCPBridge();
