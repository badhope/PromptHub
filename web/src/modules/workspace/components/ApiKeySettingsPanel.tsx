'use client';

import { motion } from 'framer-motion';
import { X, Settings, Bot, Wrench, Search, RefreshCw } from 'lucide-react';

const CLOUD_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', color: 'bg-emerald-500' },
  { id: 'deepseek', name: 'DeepSeek', color: 'bg-blue-500' },
  { id: 'anthropic', name: 'Anthropic', color: 'bg-orange-500' },
  { id: 'qwen', name: '通义千问', color: 'bg-purple-500' },
  { id: 'hunyuan', name: '腾讯混元', color: 'bg-cyan-500' },
  { id: 'wenxin', name: '文心一言', color: 'bg-blue-600' },
  { id: 'doubao', name: '豆包', color: 'bg-pink-500' },
] as const;

const MAX_ITERATION_OPTIONS = [1, 3, 5, 8, 10, 15];

interface ApiKeySettingsPanelProps {
  apiKeyConfig: { [key: string]: string };
  setApiKeyConfig: (config: { [key: string]: string }) => void;
  agentConfig: {
    enableAgent: boolean;
    enableTools: boolean;
    enableMCP: boolean;
    enableSkillRouting: boolean;
    maxIterations: number;
  };
  setAgentConfig: (config: any) => void;
  setShowSettings: (show: boolean) => void;
  validationStatus: Record<string, 'idle' | 'valid' | 'invalid' | 'checking'>;
  onValidate: (provider: string, key: string) => void;
  onDebouncedValidate: (provider: string, key: string) => void;
  onSuccess: () => void;
}

const SPRING_CONFIG = { type: 'spring', damping: 25, stiffness: 200 } as const;

function ToggleSwitch({ enabled, onChange, label, icon, description }: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 mt-0.5 ${
          enabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
          enabled ? 'left-6' : 'left-1'
        }`} />
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export function ApiKeySettingsPanel({
  apiKeyConfig,
  setApiKeyConfig,
  agentConfig,
  setAgentConfig,
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
      className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 overflow-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                全局设置
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">配置模型和智能体</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Ollama 状态 */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-2">
              ✅ Ollama 本地模型
            </h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-500">
              检测到本地 Ollama 正在运行，无需任何配置即可使用！
              <br />
              <span className="text-xs opacity-80">HTTPS 环境自动通过代理连接</span>
            </p>
          </div>

          {/* Agent 智能体系统 */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-500" />
              Agent 智能体系统
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                agentConfig.enableAgent
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                {agentConfig.enableAgent ? '已启用' : '已禁用'}
              </span>
            </h3>

            <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-2">
              <ToggleSwitch
                enabled={agentConfig.enableAgent}
                onChange={(v) => setAgentConfig({ ...agentConfig, enableAgent: v })}
                label="开启 Agent 推理"
                icon={<span className="text-base">🧠</span>}
                description="开启完整的 ReAct 思考流程，每一步都可视化"
              />
              
              <ToggleSwitch
                enabled={agentConfig.enableSkillRouting}
                onChange={(v) => setAgentConfig({ ...agentConfig, enableSkillRouting: v })}
                label="Skill 自动匹配"
                icon={<Search className="w-4 h-4 text-emerald-500" />}
                description="用户输入时自动识别意图，匹配最佳技能"
              />
              
              <ToggleSwitch
                enabled={agentConfig.enableMCP}
                onChange={(v) => setAgentConfig({ ...agentConfig, enableMCP: v })}
                label="MCP 工具调用"
                icon={<Wrench className="w-4 h-4 text-amber-500" />}
                description="允许智能体调用网页抓取、搜索等工具"
              />
              
              <div className="p-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-500" />
                  最大思考迭代次数
                  <span className="ml-auto font-bold text-indigo-600 dark:text-indigo-400">
                    {agentConfig.maxIterations} 次
                  </span>
                </label>
                <div className="flex gap-1.5">
                  {MAX_ITERATION_OPTIONS.map(n => (
                    <button
                      key={n}
                      onClick={() => setAgentConfig({ ...agentConfig, maxIterations: n })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        agentConfig.maxIterations === n
                          ? 'bg-indigo-500 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 云服务 API Key */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <span className="text-lg">☁️</span>
              云服务 API Key
              <span className="ml-auto text-xs text-gray-500">共 {CLOUD_PROVIDERS.length} 家</span>
            </h3>

            <div className="space-y-4">
              {CLOUD_PROVIDERS.map(provider => {
                const key = apiKeyConfig[provider.id] || '';
                const status = validationStatus[provider.id] || 'idle';
                return (
                  <div key={provider.id}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${provider.color}`}></span>
                        {provider.name}
                      </span>
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
                        setApiKeyConfig({ ...apiKeyConfig, [provider.id]: newKey });
                        onDebouncedValidate(provider.id, newKey);
                      }}
                      onBlur={() => onValidate(provider.id, key)}
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
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-base">🔒</span>
              所有 Key 只保存在你的浏览器本地存储中，永不上传任何服务器
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.setItem('workspace:agentConfig', JSON.stringify(agentConfig));
              onSuccess();
              setShowSettings(false);
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            💾 保存所有配置
          </button>
        </div>
      </div>
    </motion.div>
  );
}
