'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Globe, ShieldAlert, Terminal, X } from 'lucide-react';
import { ollama } from '@/lib/llm';

interface ModelConnectionStatusProps {
  selectedModel: string;
  validationStatus: Record<string, 'idle' | 'valid' | 'invalid' | 'checking'>;
}

export function ModelConnectionStatus({ selectedModel, validationStatus }: ModelConnectionStatusProps) {
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'connected' | 'cors_error' | 'not_running' | 'https_blocked'>('checking');
  const [showTooltip, setShowTooltip] = useState(false);
  const provider = selectedModel === 'ollama' ? 'ollama' : selectedModel;
  const isCloudModel = selectedModel !== 'ollama';
  const isChecking = validationStatus[provider] === 'checking';
  const cloudConnected = validationStatus[provider] === 'valid';

  useEffect(() => {
    if (selectedModel !== 'ollama') return;

    const checkOllama = async () => {
      try {
        const isHttps = window.location.protocol === 'https:';
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isHttps && !isLocalhost) {
          setOllamaStatus('https_blocked');
          return;
        }

        const available = await ollama.checkAvailable();
        if (available) {
          setOllamaStatus('connected');
        } else {
          setOllamaStatus('not_running');
        }
      } catch (err: any) {
        if (err.message?.includes('CORS') || err.name === 'TypeError') {
          setOllamaStatus('cors_error');
        } else {
          setOllamaStatus('not_running');
        }
      }
    };

    checkOllama();
    const interval = setInterval(checkOllama, 5000);
    return () => clearInterval(interval);
  }, [selectedModel]);

  if (isCloudModel) {
    return (
      <div className={`
        flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium
        ${cloudConnected
          ? 'text-emerald-600 dark:text-emerald-400'
          : isChecking
          ? 'text-blue-600 dark:text-blue-400 animate-pulse'
          : 'text-gray-400 dark:text-gray-500'
        }
      `}>
        <div className={`
          w-2 h-2 rounded-full
          ${cloudConnected
            ? 'bg-emerald-500'
            : isChecking
            ? 'bg-blue-500'
            : 'bg-gray-300 dark:bg-gray-600'
          }
        `} />
        <span className="hidden sm:inline">
          {cloudConnected ? '已连接' : isChecking ? '连接中' : '待配置'}
        </span>
      </div>
    );
  }

  const getStatusConfig = () => {
    switch (ollamaStatus) {
      case 'connected':
        return {
          color: 'text-emerald-600 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          icon: CheckCircle,
          label: 'Ollama 已连接',
        };
      case 'checking':
        return {
          color: 'text-blue-600 dark:text-blue-400 animate-pulse',
          dot: 'bg-blue-500',
          icon: Globe,
          label: '检测中',
        };
      case 'cors_error':
        return {
          color: 'text-amber-600 dark:text-amber-400',
          dot: 'bg-amber-500',
          icon: ShieldAlert,
          label: 'CORS 限制',
        };
      case 'https_blocked':
        return {
          color: 'text-red-600 dark:text-red-400',
          dot: 'bg-red-500',
          icon: ShieldAlert,
          label: 'HTTPS 限制',
        };
      default:
        return {
          color: 'text-gray-400 dark:text-gray-500',
          dot: 'bg-gray-300 dark:bg-gray-600',
          icon: AlertCircle,
          label: 'Ollama 未启动',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${config.color}`}
      >
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <StatusIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{config.label}</span>
      </button>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-3 h-3" />
          </button>

          {ollamaStatus === 'connected' && (
            <div className="space-y-1">
              <p className="font-medium text-emerald-600 dark:text-emerald-400">✅ Ollama 本地模型连接正常</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">所有对话在你本地运行，数据不上传服务器。</p>
            </div>
          )}

          {ollamaStatus === 'not_running' && (
            <div className="space-y-2">
              <p className="font-medium">⚙️ 请启动本地 Ollama 服务</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-xs">
                <Terminal className="w-3 h-3 inline mr-1" />
                ollama serve
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">然后刷新页面</p>
            </div>
          )}

          {ollamaStatus === 'cors_error' && (
            <div className="space-y-2">
              <p className="font-medium text-amber-600">🔒 跨域限制解决方案</p>
              <p className="text-xs text-gray-500">启动时添加环境变量：</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-xs space-y-1">
                <p># Windows</p>
                <p>set OLLAMA_ORIGINS=*</p>
                <p>ollama serve</p>
                <p className="mt-2"># Mac/Linux</p>
                <p>OLLAMA_ORIGINS=* ollama serve</p>
              </div>
            </div>
          )}

          {ollamaStatus === 'https_blocked' && (
            <div className="space-y-2">
              <p className="font-medium text-red-600">⚠️ HTTPS 混合内容限制</p>
              <p className="text-xs text-gray-500">浏览器安全策略阻止 HTTPS 网站调用 HTTP 本地服务。</p>
              <p className="text-xs">解决方案：使用 http://localhost:3000 访问，或配置 Ollama HTTPS 证书。</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
