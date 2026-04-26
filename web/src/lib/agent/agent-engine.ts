import { mcpBridge } from '@/lib/mcp/mcp-bridge';
import { skillRouter, type RoutingResult } from './skill-router';
import type { Skill } from '@/types/skill';

export type AgentStatus = 'idle' | 'routing' | 'thinking' | 'tool_calling' | 'executing' | 'finished' | 'error';

export interface AgentStep {
  id: number;
  type: 'routing' | 'thought' | 'action' | 'observation' | 'answer' | 'skill_activated';
  content: string;
  timestamp: number;
  tool?: string;
  data?: any;
}

export interface AgentConfig {
  model: string;
  apiKey?: string;
  maxIterations: number;
  enableTools: boolean;
  enableMCP: boolean;
  enableSkillRouting: boolean;
}

export class AgentEngine {
  private steps: AgentStep[] = [];
  private status: AgentStatus = 'idle';
  private config: AgentConfig;
  private iteration = 0;
  private systemPrompt: string = '';
  private activatedSkill: Skill | null = null;
  private routingResult: RoutingResult | null = null;
  private onStepCallback?: (step: AgentStep) => void;
  private onStatusCallback?: (status: AgentStatus) => void;

  constructor(config: Partial<AgentConfig> = {}) {
    this.config = {
      model: config.model || 'gpt-3.5-turbo',
      apiKey: config.apiKey,
      maxIterations: config.maxIterations || 10,
      enableTools: config.enableTools !== false,
      enableMCP: config.enableMCP !== false,
      enableSkillRouting: config.enableSkillRouting !== false,
    };
  }

  onStep(callback: (step: AgentStep) => void) {
    this.onStepCallback = callback;
  }

  onStatus(callback: (status: AgentStatus) => void) {
    this.onStatusCallback = callback;
  }

  setStatus(status: AgentStatus) {
    this.status = status;
    this.onStatusCallback?.(status);
  }

  addStep(type: AgentStep['type'], content: string, tool?: string, data?: any): AgentStep {
    const step: AgentStep = {
      id: this.steps.length + 1,
      type,
      content,
      timestamp: Date.now(),
      tool,
      data,
    };
    this.steps.push(step);
    this.onStepCallback?.(step);
    return step;
  }

  getSteps(): AgentStep[] {
    return [...this.steps];
  }

  getStatus(): AgentStatus {
    return this.status;
  }

  getActivatedSkill(): Skill | null {
    return this.activatedSkill;
  }

  async routeIntent(userPrompt: string, allSkills: Skill[]): Promise<RoutingResult> {
    this.setStatus('routing');
    
    skillRouter.registerSkills(allSkills);
    const result = await skillRouter.routeIntent(userPrompt);
    
    this.routingResult = result;
    
    if (result.skillId) {
      const skill = allSkills.find(s => s.id === result.skillId);
      if (skill) {
        this.activatedSkill = skill;
        this.addStep(
          'skill_activated',
          `🎯 自动匹配 Skill: ${skill.name}\n置信度: ${Math.round(result.confidence * 100)}%\n${result.reason}`,
          undefined,
          { skillId: result.skillId, confidence: result.confidence }
        );
      }
    } else {
      this.addStep('routing', `意图路由完成: 使用通用模式\n${result.reason}`);
    }

    return result;
  }

  buildSystemPrompt(userPrompt: string): string {
    let basePrompt = `
你是一个自主智能体（Agent），能够自动识别意图、匹配专业 Skill、使用 MCP 工具来解决复杂任务。

## 核心执行规范

采用 ReAct + Skill + MCP 三层增强架构：
1. **Routing**: 自动识别用户意图，匹配合适的专业 Skill
2. **Thought**: 深入思考当前状态和下一步策略
3. **Action**: 决定是否调用 MCP 工具，使用标准 JSON 格式
4. **Observation**: 接收工具执行结果，分析评估
5. **Reflection**: 每 3 步强制策略反思
6. **Answer**: 输出结构化最终答案

---

## Skill 激活说明

${this.activatedSkill ? `✅ 当前已激活 Skill: **${this.activatedSkill.name}**

${this.activatedSkill.description || ''}

### Skill 系统提示词:
${this.activatedSkill.prompt || ''}

请严格按照此 Skill 的专业设定来处理任务！
` : 'ℹ️ 无特定 Skill 激活，使用通用智能模式'}

---

## MCP 工具调用协议

${this.config.enableMCP ? mcpBridge.getToolsPrompt() : '工具模式已禁用，直接回答问题。'}

---

## 用户任务
${userPrompt}

---

现在开始执行任务，一步步思考：
`.trim();

    return basePrompt;
  }

  buildConversation(): { role: string; content: string }[] {
    const messages: { role: string; content: string }[] = [];

    messages.push({
      role: 'system',
      content: this.systemPrompt,
    });

    for (const step of this.steps) {
      if (step.type === 'thought' || step.type === 'action' || step.type === 'answer') {
        messages.push({
          role: 'assistant',
          content: step.content,
        });
      } else if (step.type === 'observation') {
        messages.push({
          role: 'user',
          content: `工具执行结果：\n${step.content}`,
        });
      }
    }

    return messages;
  }

  async executeToolCall(tool: string, parameters: Record<string, any>): Promise<string> {
    this.setStatus('executing');
    this.addStep('observation', `正在执行 MCP 工具: ${tool}...`, tool);

    const result = await mcpBridge.callTool(tool, parameters);
    return JSON.stringify(result, null, 2);
  }

  async *run(
    userPrompt: string,
    allSkills: Skill[],
    sendMessage: (messages: any[], config: any) => Promise<void>
  ): AsyncGenerator<AgentStep, void, unknown> {
    if (this.config.enableSkillRouting) {
      await this.routeIntent(userPrompt, allSkills);
    }

    this.systemPrompt = this.buildSystemPrompt(userPrompt);
    this.iteration = 0;

    this.setStatus('thinking');

    while (this.iteration < this.config.maxIterations) {
      this.iteration++;
      
      let fullResponse = '';
      
      await sendMessage(
        this.buildConversation(),
        {
          model: this.config.model,
          apiKey: this.config.apiKey,
          temperature: 0.3,
          onChunk: (chunk: string) => {
            fullResponse += chunk;
          },
        }
      );

      const mcpMatch = mcpBridge.parseMCPRequest(fullResponse);
      
      if (mcpMatch && this.config.enableMCP) {
        this.addStep('action', fullResponse, mcpMatch.tool);
        this.setStatus('tool_calling');

        const observation = await this.executeToolCall(mcpMatch.tool, mcpMatch.parameters);
        this.addStep('observation', observation, mcpMatch.tool);
        
        this.setStatus('thinking');
        continue;
      }

      if (fullResponse.includes('最终答案：') || fullResponse.includes('Final Answer:') || fullResponse.includes('## 最终答案')) {
        this.addStep('answer', fullResponse);
        this.setStatus('finished');
        break;
      }

      this.addStep('thought', fullResponse);

      if (this.iteration >= this.config.maxIterations) {
        this.addStep('answer', `达到最大迭代次数 (${this.config.maxIterations})，停止执行。\n\n${fullResponse}`);
        this.setStatus('finished');
        break;
      }

      yield this.steps[this.steps.length - 1];
    }
  }

  reset() {
    this.steps = [];
    this.status = 'idle';
    this.iteration = 0;
    this.systemPrompt = '';
    this.activatedSkill = null;
    this.routingResult = null;
  }
}
