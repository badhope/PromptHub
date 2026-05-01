export type { Message, LLMConfig, LLMProvider, ProviderType, ProviderConfig } from './types';
export { LLMError } from './types';
export { parseSSEStream, createReadableStream, streamToString } from './stream-utils';
export { createOpenAICompatibleProvider, OpenAIProvider, DeepSeekProvider, AnthropicProvider } from './providers/openai-compatible';
export { OllamaProvider, ollamaProvider, ollamaProvider as ollama } from './providers/ollama';
export {
  QwenProvider,
  HunyuanProvider,
  WenxinProvider,
  DoubaoProvider,
  qwenProvider,
  hunyuanProvider,
  wenxinProvider,
  doubaoProvider,
  createChineseCloudProvider,
  CHINESE_PROVIDERS,
} from './providers/chinese-cloud';

import type { Message, LLMConfig, LLMProvider } from './types';
import { createOpenAICompatibleProvider } from './providers/openai-compatible';
import { OllamaProvider } from './providers/ollama';
import { createChineseCloudProvider } from './providers/chinese-cloud';

const providerCache = new Map<string, LLMProvider>();

export function getProvider(providerType: string, baseUrl?: string) {
  const cacheKey = `${providerType}-${baseUrl || ''}`;
  
  if (providerCache.has(cacheKey)) {
    return providerCache.get(cacheKey);
  }

  let provider;
  if (providerType === 'ollama') {
    provider = new OllamaProvider();
  } else {
    provider = createChineseCloudProvider(providerType);
    if (!provider) {
      provider = createOpenAICompatibleProvider(providerType, baseUrl);
    }
  }

  providerCache.set(cacheKey, provider);
  return provider;
}

async function streamViaProxy(
  providerType: string,
  messages: Message[],
  config: Partial<LLMConfig> & { onChunk: (content: string) => void }
): Promise<void> {
  const response = await fetch('/api/llm/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: providerType,
      messages,
      model: config.model,
      apiKey: config.apiKey,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      baseUrl: config.baseUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');

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
        const jsonData = trimmed.slice(6);
        const parsed = JSON.parse(jsonData);
        
        const content = parsed.choices?.[0]?.delta?.content 
          || parsed.message?.content
          || parsed.output?.choices?.[0]?.message?.content
          || parsed.content?.[0]?.text;

        if (content) {
          config.onChunk(content);
        }
      } catch {
      }
    }
  }
}

export async function streamChat(
  providerType: string,
  messages: Message[],
  config: Partial<LLMConfig> & { onChunk: (content: string) => void }
): Promise<void> {
  if (providerType === 'ollama' && !config.apiKey) {
    const provider = getProvider(providerType);
    if (!provider) {
      throw new Error(`Provider ${providerType} not found`);
    }
    const stream = await provider.chat(messages, config);
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      config.onChunk(value);
    }
  } else {
    await streamViaProxy(providerType, messages, config);
  }
}

const OLLAMA_MODEL_PREFIXES = ['llama', 'mistral', 'phi', 'vicuna', 'orca', 'codellama', 'zephyr', 'neural-chat', 'starling', 'gemma', 'mixtral', 'moondream', 'nous-hermes', 'openhermes', 'dolphin', 'wizard'];

export function getProviderForModel(modelId: string): string {
  const modelMap: Record<string, string> = {
    'gpt': 'openai',
    'deepseek': 'deepseek',
    'claude': 'anthropic',
    'ollama': 'ollama',
    'qwen': 'qwen',
    'tongyi': 'qwen',
    'dashscope': 'qwen',
    '通义': 'qwen',
    'hunyuan': 'hunyuan',
    '混元': 'hunyuan',
    'tencent': 'hunyuan',
    'ernie': 'wenxin',
    'wenxin': 'wenxin',
    '文心': 'wenxin',
    'baidu': 'wenxin',
    'doubao': 'doubao',
    '豆包': 'doubao',
    'ark': 'doubao',
    'bytedance': 'doubao',
    'zhipu': 'zhipu',
    'glm': 'zhipu',
    'baichuan': 'baichuan',
  };

  const modelIdLower = modelId.toLowerCase();

  for (const prefix of OLLAMA_MODEL_PREFIXES) {
    if (modelIdLower.includes(prefix) || modelIdLower.includes(':latest')) {
      return 'ollama';
    }
  }

  for (const [prefix, provider] of Object.entries(modelMap)) {
    if (modelIdLower.includes(prefix)) {
      return provider;
    }
  }

  return 'ollama';
}
