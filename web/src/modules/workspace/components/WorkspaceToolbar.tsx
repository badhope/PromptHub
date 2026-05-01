'use client';

import { Settings, Split, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import { ModelConnectionStatus } from './ModelConnectionStatus';

interface WorkspaceToolbarProps {
  selectedModel: string;
  validationStatus: Record<string, 'idle' | 'valid' | 'invalid' | 'checking'>;
  immersionMode: boolean;
  compareMode: boolean;
  onToggleImmersion: () => void;
  onToggleCompare: () => void;
  onOpenSettings: () => void;
  onClearChat: () => void;
}

export function WorkspaceToolbar({
  selectedModel,
  validationStatus,
  immersionMode,
  compareMode,
  onToggleImmersion,
  onToggleCompare,
  onOpenSettings,
  onClearChat,
}: WorkspaceToolbarProps) {
  return (
    <div className={`
      flex items-center justify-between px-4 h-12 border-b border-gray-200 dark:border-gray-700
      transition-all duration-300
      ${immersionMode ? 'bg-black/5 backdrop-blur-sm' : 'bg-gray-50/80 dark:bg-gray-800/80'}
    `}>
      <ModelConnectionStatus
        selectedModel={selectedModel}
        validationStatus={validationStatus}
      />

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleImmersion}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${immersionMode
              ? 'bg-black/20 text-black dark:bg-white/20 dark:text-white'
              : compareMode
              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
              : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
            }
          `}
        >
          {immersionMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{immersionMode ? '退出沉浸' : '沉浸模式'}</span>
        </button>

        <button
          onClick={onToggleCompare}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${compareMode
              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
              : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
            }
          `}
        >
          <Split className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">A/B对比</span>
        </button>

        <button
          onClick={onClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">清空</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">设置</span>
        </button>
      </div>
    </div>
  );
}
