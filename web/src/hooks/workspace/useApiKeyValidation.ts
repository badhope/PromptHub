'use client';

import { useState, useCallback, useRef } from 'react';
import { getProvider } from '@/lib/llm';

type ValidationStatus = 'idle' | 'valid' | 'invalid' | 'checking';

interface ApiKeyConfig {
  openai: string;
  deepseek: string;
  anthropic: string;
  qwen: string;
  hunyuan: string;
  wenxin: string;
  doubao: string;
}

export function useApiKeyValidation() {
  const [validationStatus, setValidationStatus] = useState<Record<string, ValidationStatus>>({});
  const validateTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const validateApiKey = useCallback(async (provider: string, apiKey: string) => {
    if (!apiKey || apiKey.length < 5) {
      setValidationStatus(prev => ({ ...prev, [provider]: 'idle' }));
      return;
    }

    setValidationStatus(prev => ({ ...prev, [provider]: 'checking' }));

    const llmProvider = getProvider(provider);
    if (
      llmProvider &&
      'checkAvailable' in llmProvider &&
      typeof (llmProvider as { checkAvailable: (key: string) => Promise<boolean> }).checkAvailable === 'function'
    ) {
      const valid = await (llmProvider as { checkAvailable: (key: string) => Promise<boolean> }).checkAvailable(apiKey);
      setValidationStatus(prev => ({ ...prev, [provider]: valid ? 'valid' : 'invalid' }));
    } else {
      setValidationStatus(prev => ({ ...prev, [provider]: apiKey.length > 10 ? 'valid' : 'invalid' }));
    }
  }, []);

  const debouncedValidate = useCallback((provider: string, apiKey: string) => {
    clearTimeout(validateTimeoutRef.current[provider]);
    validateTimeoutRef.current[provider] = setTimeout(() => {
      validateApiKey(provider, apiKey);
    }, 800);
  }, [validateApiKey]);

  return {
    validationStatus,
    validateApiKey,
    debouncedValidate,
  };
}
