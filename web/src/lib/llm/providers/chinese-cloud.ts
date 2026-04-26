import type { Message, LLMConfig, LLMProvider } from '../types';
import { createReadableStream } from '../stream-utils';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextWindow?: number;
}

export abstract class BaseChineseCloudProvider implements LLMProvider {
  abstract name: string;
  abstract models: string[];
  abstract baseUrl: string;
  streamable = true;

  abstract checkAvailable(apiKey: string): Promise<boolean>;
  abstract listModels(apiKey: string): Promise<string[]>;
  abstract chat(messages: Message[], config: Partial<LLMConfig>): Promise<ReadableStream<string>>;

  async chatNonStreaming(messages: Message[], config: Partial<LLMConfig>): Promise<string> {
    const stream = await this.chat(messages, config);
    const reader = stream.getReader();
    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += value;
    }
    return result;
  }

  protected getApiKey(config: Partial<LLMConfig>): string {
    return config.apiKey || '';
  }
}

export class QwenProvider extends BaseChineseCloudProvider {
  name = 'qwen';
  models = [
    'qwen-turbo',
    'qwen-plus',
    'qwen-max',
    'qwen-max-longcontext',
    'qwen-72b-chat',
    'qwen-14b-chat',
    'qwen-7b-chat',
  ];
  baseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

  async checkAvailable(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) return this.models;
      
      const data = await response.json() as { data: Array<{ id: string }> };
      this.models = data.data?.map((m: { id: string }) => m.id) || this.models;
      return this.models;
    } catch {
      return this.models;
    }
  }

  async chat(messages: Message[], config: Partial<LLMConfig>): Promise<ReadableStream<string>> {
    const apiKey = this.getApiKey(config);
    if (!apiKey) {
      throw new Error('请输入阿里云 DashScope API Key');
    }

    return createReadableStream(async (controller) => {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model || 'qwen-plus',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`通义千问错误: ${response.status} ${error}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无响应数据');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(content);
          } catch {}
        }
      }
    });
  }
}

export class HunyuanProvider extends BaseChineseCloudProvider {
  name = 'hunyuan';
  models = [
    'hunyuan-pro',
    'hunyuan-standard',
    'hunyuan-lite',
    'hunyuan-code',
    'hunyuan-functioncall',
  ];
  baseUrl = 'https://hunyuan.tencentcloudapi.com';

  async checkAvailable(apiKey: string): Promise<boolean> {
    try {
      if (!apiKey || apiKey.length < 10) return false;
      const response = await fetch('https://api.hunyuan.cloud.tencent.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'hunyuan-lite',
          messages: [{ role: 'user', content: 'hi' }],
          stream: false,
          top_p: 0.1,
          temperature: 0,
        }),
      });
      return response.status !== 401 && response.status !== 403;
    } catch {
      return apiKey.length > 20;
    }
  }

  async listModels(): Promise<string[]> {
    return this.models;
  }

  async chat(messages: Message[], config: Partial<LLMConfig>): Promise<ReadableStream<string>> {
    const apiKey = this.getApiKey(config);
    if (!apiKey) {
      throw new Error('请输入腾讯云 API Key');
    }

    return createReadableStream(async (controller) => {
      const response = await fetch('https://api.hunyuan.cloud.tencent.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model || 'hunyuan-pro',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          temperature: config.temperature || 0.7,
          top_p: 0.95,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`混元错误: ${response.status} ${error}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无响应数据');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(content);
          } catch {}
        }
      }
    });
  }
}

export class WenxinProvider extends BaseChineseCloudProvider {
  name = 'wenxin';
  models = [
    'ernie-4.0',
    'ernie-3.5',
    'ernie-3.5-8k',
    'ernie-lite',
    'ernie-tiny',
  ];
  baseUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop';

  async checkAvailable(apiKey: string): Promise<boolean> {
    try {
      if (!apiKey || apiKey.length < 10) return false;
      const response = await fetch(`${this.baseUrl}/chat/chat?access_token=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'hi' }],
          stream: false,
        }),
      });
      return response.status !== 401 && response.status !== 403;
    } catch {
      return apiKey.length > 20;
    }
  }

  async listModels(): Promise<string[]> {
    return this.models;
  }

  async chat(messages: Message[], config: Partial<LLMConfig>): Promise<ReadableStream<string>> {
    const apiKey = this.getApiKey(config);
    if (!apiKey) {
      throw new Error('请输入百度文心一言 API Key (Access Token)');
    }

    const modelMap: Record<string, string> = {
      'ernie-4.0': 'completions_pro',
      'ernie-3.5': 'chat',
      'ernie-3.5-8k': 'chat_8k',
      'ernie-lite': 'eb-instant',
      'ernie-tiny': 'ernie-tiny-8k',
    };
    const modelEndpoint = modelMap[config.model || 'ernie-3.5'] || 'chat';

    return createReadableStream(async (controller) => {
      const response = await fetch(`${this.baseUrl}/chat/${modelEndpoint}?access_token=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          temperature: config.temperature || 0.7,
          top_p: 0.8,
          penalty_score: 1.0,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`文心一言错误: ${response.status} ${error}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无响应数据');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.result;
            if (content && !json.is_end) {
              controller.enqueue(content);
            }
          } catch {}
        }
      }
    });
  }
}

export class DoubaoProvider extends BaseChineseCloudProvider {
  name = 'doubao';
  models = [
    'doubao-pro-32k',
    'doubao-pro-128k',
    'doubao-lite-32k',
    'doubao-lite-128k',
  ];
  baseUrl = 'https://ark.cn-beijing.volces.com/api/v3';

  async checkAvailable(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'doubao-pro-32k',
          messages: [{ role: 'user', content: 'hi' }],
          max_tokens: 1,
        }),
      });
      return response.status !== 401;
    } catch {
      return !!apiKey;
    }
  }

  async listModels(): Promise<string[]> {
    return this.models;
  }

  async chat(messages: Message[], config: Partial<LLMConfig>): Promise<ReadableStream<string>> {
    const apiKey = this.getApiKey(config);
    if (!apiKey) {
      throw new Error('请输入字节跳动方舟 API Key');
    }

    return createReadableStream(async (controller) => {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.model || 'doubao-pro-32k',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          temperature: config.temperature || 0.7,
          max_tokens: config.maxTokens || 4096,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`豆包错误: ${response.status} ${error}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无响应数据');

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(content);
          } catch {}
        }
      }
    });
  }
}

export const qwenProvider = new QwenProvider();
export const hunyuanProvider = new HunyuanProvider();
export const wenxinProvider = new WenxinProvider();
export const doubaoProvider = new DoubaoProvider();

export function createChineseCloudProvider(providerType: string): BaseChineseCloudProvider | null {
  switch (providerType) {
    case 'qwen':
    case 'tongyi':
    case 'dashscope':
      return new QwenProvider();
    case 'hunyuan':
    case 'tencent':
      return new HunyuanProvider();
    case 'wenxin':
    case 'ernie':
    case 'baidu':
      return new WenxinProvider();
    case 'doubao':
    case 'ark':
    case 'bytedance':
      return new DoubaoProvider();
    default:
      return null;
  }
}

export const CHINESE_PROVIDERS: ModelInfo[] = [
  { id: 'qwen', name: '阿里通义千问', provider: 'qwen', description: '阿里云 DashScope', contextWindow: 8000 },
  { id: 'hunyuan', name: '腾讯混元', provider: 'hunyuan', description: '腾讯云 Hunyuan', contextWindow: 8000 },
  { id: 'wenxin', name: '百度文心一言', provider: 'wenxin', description: '百度智能云', contextWindow: 8000 },
  { id: 'doubao', name: '字节豆包', provider: 'doubao', description: '火山引擎方舟', contextWindow: 32000 },
];
