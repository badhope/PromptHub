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
  baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434/api') {
    this.baseUrl = baseUrl;
  }

  async checkAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
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
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model || 'llama3',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
          options: {
            temperature: config.temperature || 0.7,
            num_predict: config.maxTokens || 4096,
          },
        }),
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
