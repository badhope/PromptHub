export type { Message, LLMConfig, LLMProvider, ProviderType, ProviderConfig } from './types';
export { LLMError } from './types';
export { parseSSEStream, createReadableStream, streamToString } from './stream-utils';
export { createOpenAICompatibleProvider, OpenAIProvider, DeepSeekProvider, AnthropicProvider } from './providers/openai-compatible';
export { OllamaProvider, ollamaProvider } from './providers/ollama';
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
    provider = new OllamaProvider(baseUrl);
  } else {
    provider = createChineseCloudProvider(providerType);
    if (!provider) {
      provider = createOpenAICompatibleProvider(providerType, baseUrl);
    }
  }

  providerCache.set(cacheKey, provider);
  return provider;
}

export async function streamChat(
  providerType: string,
  messages: Message[],
  config: Partial<LLMConfig> & { onChunk: (content: string) => void }
): Promise<void> {
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
