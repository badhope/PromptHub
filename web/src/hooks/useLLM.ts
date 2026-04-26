'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, LLMConfig } from '@/lib/llm';
import { streamChat, getProviderForModel, ollamaProvider, getProvider } from '@/lib/llm';

export interface UseLLMOptions {
  defaultModel?: string;
  apiKeys?: Record<string, string>;
}

export function useLLM(options: UseLLMOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);

  const defaultModel = options.defaultModel || 'gpt-3.5';

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(async (
    userContent: string,
    systemPrompt?: string,
    modelOverride?: string
  ): Promise<void> => {
    const model = modelOverride || defaultModel;
    const provider = getProviderForModel(model);
    const apiKey = options.apiKeys?.[provider];

    if (!apiKey && provider !== 'ollama') {
      setError(`请先配置 ${provider} API Key`);
      return;
    }

    setError(null);
    setIsStreaming(true);

    const userMessage: Message = { role: 'user', content: userContent };
    const currentMessages = messagesRef.current;
    const newMessages = systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...currentMessages, userMessage]
      : [...currentMessages, userMessage];

    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      const actualMessages = systemPrompt
        ? [{ role: 'system' as const, content: systemPrompt }, ...currentMessages, userMessage]
        : [...currentMessages, userMessage];

      await streamChat(provider, actualMessages, {
        apiKey,
        model,
        onChunk: (chunk) => {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
              return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
            }
            return prev;
          });
        },
      } as LLMConfig & { onChunk: (content: string) => void });
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接模型失败，请检查网络或 API Key');
    } finally {
      setIsStreaming(false);
    }
  }, [defaultModel, options.apiKeys]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const checkOllamaAvailable = useCallback(async (): Promise<boolean> => {
    try {
      return await ollamaProvider.checkAvailable();
    } catch {
      return false;
    }
  }, []);

  const listOllamaModels = useCallback(async () => {
    try {
      return await ollamaProvider.listModels();
    } catch {
      return [];
    }
  }, []);

  const validateProviderApiKey = useCallback(async (provider: string, apiKey: string): Promise<boolean> => {
    try {
      if (provider === 'ollama') {
        return await ollamaProvider.checkAvailable();
      }

      const response = await fetch('/api/llm/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey }),
      });

      if (!response.ok) return false;
      const data = await response.json();
      return data.valid || false;
    } catch {
      return apiKey.startsWith('sk-') && apiKey.length > 40;
    }
  }, []);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    stopStreaming,
    checkOllamaAvailable,
    listOllamaModels,
    validateProviderApiKey,
  };
}
