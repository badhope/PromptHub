'use client';

import { getProviderForModel } from '@/lib/llm';

interface ModelConnectionStatusProps {
  selectedModel: string;
  validationStatus: Record<string, 'idle' | 'valid' | 'invalid' | 'checking'>;
}

export function ModelConnectionStatus({ selectedModel, validationStatus }: ModelConnectionStatusProps) {
  const provider = getProviderForModel(selectedModel);
  const isConnected = selectedModel === 'ollama' || validationStatus[provider] === 'valid';
  const isChecking = validationStatus[provider] === 'checking';

  return (
    <div className={`
      flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium
      ${isConnected
        ? 'text-emerald-600 dark:text-emerald-400'
        : isChecking
        ? 'text-blue-600 dark:text-blue-400 animate-pulse'
        : 'text-gray-400 dark:text-gray-500'
      }
    `}>
      <div className={`
        w-2 h-2 rounded-full
        ${isConnected
          ? 'bg-emerald-500'
          : isChecking
          ? 'bg-blue-500'
          : 'bg-gray-300 dark:bg-gray-600'
        }
      `} />
      <span className="hidden sm:inline">
        {selectedModel === 'ollama' ? '已连接' :
         isConnected ? '已连接' :
         isChecking ? '连接中' : '待配置'}
      </span>
    </div>
  );
}
