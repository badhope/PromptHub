import type { Message, LLMConfig, LLMProvider } from '../types';
import { createReadableStream, streamToString } from '../stream-utils';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface OllamaTagResponse {
  models: OllamaModel[];
}

export class OllamaProvider implements LLMProvider {
  name = 'ollama';
  models: string[] = [];
  streamable = true;
  useProxy: boolean;

  constructor() {
    this.useProxy = typeof window !== 'undefined' && window.location.protocol === 'https:';
  }

  getBaseUrl(): string {
    if (this.useProxy) {
      return '';
    }
    return 'http://localhost:11434/api';
  }

  async proxyRequest(endpoint: string, method: string = 'GET', data?: any, timeoutMs?: number): Promise<Response> {
    const controller = timeoutMs ? new AbortController() : undefined;
    const timeoutId = controller && timeoutMs 
      ? setTimeout(() => controller.abort(), timeoutMs) 
      : undefined;

    try {
      if (this.useProxy) {
        const proxyUrl = '/api/ollama/proxy';
        if (method === 'GET') {
          return fetch(`${proxyUrl}?endpoint=${encodeURIComponent(`/api${endpoint}`)}`, { 
            method: 'GET',
            signal: controller?.signal,
          });
        }
        return fetch(proxyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: `/api${endpoint}`, data, stream: data?.stream }),
          signal: controller?.signal,
        });
      }

      return fetch(`http://localhost:11434/api${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller?.signal,
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async checkAvailable(): Promise<boolean> {
    try {
      const response = await this.proxyRequest('/tags', 'GET', undefined, 3000);
      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await this.proxyRequest('/tags', 'GET', undefined, 3000);
      
      if (!response.ok) return [];
      
      const data = await response.json() as OllamaTagResponse;
      this.models = data.models.map(m => m.name);
      return this.models;
    } catch {
      return [];
    }
  }

  async chat(messages: Message[], config: Partial<LLMConfig>): Promise<ReadableStream<string>> {
    const available = await this.checkAvailable();
    if (!available) {
      throw new Error('Ollama is not running. Please start Ollama first.');
    }

    return createReadableStream(async (controller) => {
      const response = await this.proxyRequest('/chat', 'POST', {
        model: config.model || 'llama3',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        options: {
          temperature: config.temperature || 0.7,
          num_predict: config.maxTokens || 4096,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama Error ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

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

          try {
            const parsed = JSON.parse(trimmed);
            const content = parsed.message?.content;
            if (content) {
              controller.enqueue(content);
            }
          } catch {
            continue;
          }
        }
      }
    });
  }

  async chatNonStreaming(messages: Message[], config: Partial<LLMConfig>): Promise<string> {
    const stream = await this.chat(messages, config);
    return streamToString(stream);
  }
}

export const ollamaProvider = new OllamaProvider();
