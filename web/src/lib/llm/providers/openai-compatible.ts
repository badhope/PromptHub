import type { Message, LLMConfig, LLMProvider } from '../types';
import { parseSSEStream, createReadableStream, streamToString } from '../stream-utils';

const PROVIDER_CONFIGS: Record<string, { baseUrl: string; models: string[] }> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'],
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-coder'],
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
  },
};

export function createOpenAICompatibleProvider(
  providerType: string,
  customBaseUrl?: string
): LLMProvider {
  const config = PROVIDER_CONFIGS[providerType] || PROVIDER_CONFIGS.openai;
  const baseUrl = customBaseUrl || config.baseUrl;

  return {
    name: providerType,
    models: config.models,
    streamable: true,

    async checkAvailable(apiKey: string): Promise<boolean> {
      try {
        if (!apiKey || apiKey.length < 10) return false;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (providerType === 'anthropic') {
          headers['x-api-key'] = apiKey;
          headers['anthropic-version'] = '2023-06-01';
        } else {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(`${baseUrl}/models`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          const testResponse = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model: config.models[0],
              messages: [{ role: 'user', content: 'hi' }],
              max_tokens: 1,
              stream: false,
            }),
          });
          return testResponse.status !== 401 && testResponse.status !== 403;
        }

        return true;
      } catch {
        return apiKey.startsWith('sk-') && apiKey.length > 40;
      }
    },

    async chat(messages: Message[], llmConfig: Partial<LLMConfig>): Promise<ReadableStream<string>> {
      const apiKey = llmConfig.apiKey;
      if (!apiKey && providerType !== 'ollama') {
        throw new Error(`${providerType} API Key is required. Browser-only mode: Use Ollama for CORS-free local chatting!`);
      }

      return createReadableStream(async (controller) => {
        const requestUrl = `${baseUrl}/chat/completions`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (apiKey) {
          if (providerType === 'anthropic') {
            headers['x-api-key'] = apiKey;
            headers['anthropic-version'] = '2023-06-01';
          } else {
            headers['Authorization'] = `Bearer ${apiKey}`;
          }
        }

        const response = await fetch(requestUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: llmConfig.model || config.models[0],
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            stream: true,
            temperature: llmConfig.temperature || 0.7,
            max_tokens: llmConfig.maxTokens || 4096,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        await parseSSEStream(response, (chunk) => {
          controller.enqueue(chunk);
        });
      });
    },

    async chatNonStreaming(messages: Message[], config: Partial<LLMConfig>): Promise<string> {
      const stream = await this.chat(messages, config);
      return streamToString(stream);
    },
  };
}

export const OpenAIProvider = createOpenAICompatibleProvider('openai');
export const DeepSeekProvider = createOpenAICompatibleProvider('deepseek');
export const AnthropicProvider = createOpenAICompatibleProvider('anthropic');
