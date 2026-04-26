export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMProvider {
  name: string;
  models: string[];
  streamable: boolean;

  chat(messages: Message[], config: Partial<LLMConfig>): Promise<ReadableStream<string>>;
  chatNonStreaming(messages: Message[], config: Partial<LLMConfig>): Promise<string>;
  checkAvailable?(apiKey: string): Promise<boolean>;
  listModels?(apiKey?: string): Promise<string[]>;
}

export type ProviderType = 'openai' | 'deepseek' | 'anthropic' | 'ollama';

export interface ProviderConfig {
  type: ProviderType;
  apiKey?: string;
  baseUrl?: string;
}

export class LLMError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'LLMError';
  }
}
