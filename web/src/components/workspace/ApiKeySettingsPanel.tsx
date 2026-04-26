'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ApiKeySettingsPanelProps {
  apiKeyConfig: { [key: string]: string };
  setApiKeyConfig: (config: { [key: string]: string }) => void;
  setShowSettings: (show: boolean) => void;
  validationStatus: Record<string, 'idle' | 'valid' | 'invalid' | 'checking'>;
  onValidate: (provider: string, key: string) => void;
  onDebouncedValidate: (provider: string, key: string) => void;
  onSuccess: () => void;
}

const SPRING_CONFIG = { type: 'spring', damping: 25, stiffness: 200 } as const;

export function ApiKeySettingsPanel({
  apiKeyConfig,
  setApiKeyConfig,
  setShowSettings,
  validationStatus,
  onValidate,
  onDebouncedValidate,
  onSuccess,
}: ApiKeySettingsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={SPRING_CONFIG}
      className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 overflow-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            API Key 设置
          </h2>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-2">
              ✅ Ollama 本地模型
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-500">
              检测到本地 Ollama 正在运行，无需任何配置即可使用！
            </p>
          </div>

          {Object.entries(apiKeyConfig).map(([provider, key]) => {
            const status = validationStatus[provider] || 'idle';
            return (
              <div key={provider}>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 capitalize flex items-center justify-between">
                  <span>{provider} API Key</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    status === 'valid' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    status === 'invalid' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                    status === 'checking' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    {status === 'valid' ? '✅ 有效' :
                     status === 'invalid' ? '❌ 无效' :
                     status === 'checking' ? '⏳ 检测中' : '○ 未检测'}
                  </span>
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    setApiKeyConfig({ ...apiKeyConfig, [provider]: newKey });
                    onDebouncedValidate(provider, newKey);
                  }}
                  onBlur={() => onValidate(provider, key)}
                  placeholder="sk-..."
                  className={`
                    w-full px-4 py-3 rounded-xl border font-mono text-sm transition-all focus:outline-none focus:ring-2
                    ${status === 'valid'
                      ? 'border-emerald-300 dark:border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-500/5'
                      : status === 'invalid'
                      ? 'border-red-300 dark:border-red-500/50 bg-red-50/50 dark:bg-red-500/5'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }
                    ${status === 'checking' ? 'animate-pulse' : ''}
                    text-gray-900 dark:text-white focus:ring-indigo-500
                  `}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  🔒 Key 只保存在你的浏览器中，永不上传服务器
                </p>
              </div>
            );
          })}

          <button
            onClick={() => { onSuccess(); setShowSettings(false); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            保存配置
          </button>
        </div>
      </div>
    </motion.div>
  );
}
