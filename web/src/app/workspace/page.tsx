'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Settings,
  Bot,
  Variable,
  Send,
  AlertCircle,
  ChevronLeft,
  Menu as MenuIcon,
  X,
  Database,
  Key,
} from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useGestures';
import { useLLM } from '@/hooks/useLLM';
import { getProviderForModel } from '@/lib/llm';
import { AgentDebugPanel } from '@/components/workspace/AgentDebugPanel';

interface Variable {
  name: string;
  value: string;
  type: string;
}

const ALL_MODELS = [
  { id: 'ollama', name: 'Ollama (本地)', provider: 'ollama', icon: '🦙', local: true },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', icon: '🟢' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', icon: '🟢' },
  { id: 'deepseek-chat', name: 'DeepSeek V2', provider: 'deepseek', icon: '🔵' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic', icon: '🟠' },
  { id: 'qwen-plus', name: '通义千问 Plus', provider: 'qwen', icon: '☁️' },
  { id: 'hunyuan-pro', name: '腾讯混元 Pro', provider: 'hunyuan', icon: '🐧' },
  { id: 'ernie-4.0', name: '文心一言 4.0', provider: 'wenxin', icon: '👣' },
  { id: 'doubao-pro', name: '字节豆包 Pro', provider: 'doubao', icon: '🫘' },
] as const;

const MESSAGE_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
} as const;

const SPRING_CONFIG = { type: 'spring', damping: 25, stiffness: 200 } as const;

export default function WorkspacePage() {
  const { success } = useHapticFeedback();
  const mountedRef = useRef(false);

  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [prompt, setPrompt] = useState('');
  const [userInput, setUserInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [validationStatus, setValidationStatus] = useState<Record<string, 'idle' | 'valid' | 'invalid' | 'checking'>>({});

  const [apiKeyConfig, setApiKeyConfig] = useState<Record<string, string>>({
    openai: '',
    deepseek: '',
    anthropic: '',
    qwen: '',
    hunyuan: '',
    wenxin: '',
    doubao: '',
  });

  const [variables, setVariables] = useState<Variable[]>([]);

  const validateTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = prompt.match(regex);
    const extractedNames = new Set<string>();
    
    if (matches) {
      matches.forEach(match => {
        const varName = match.replace(/[{}]/g, '');
        extractedNames.add(varName);
      });
    }

    setVariables(prev => {
      const newVars: Variable[] = [];
      extractedNames.forEach(name => {
        const existing = prev.find(v => v.name === name);
        newVars.push(existing || { name, value: '', type: 'text' });
      });
      return newVars;
    });
  }, [prompt]);

  const {
    messages,
    isStreaming,
    error: llmError,
    sendMessage,
    clearMessages,
    checkOllamaAvailable,
    listOllamaModels,
    validateProviderApiKey,
  } = useLLM({
    defaultModel: selectedModel,
    apiKeys: apiKeyConfig,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [userInput]);

  useEffect(() => {
    mountedRef.current = true;

    const saved = localStorage.getItem('workspace:apiKeys');
    if (saved) {
      try {
        setApiKeyConfig(JSON.parse(saved));
      } catch {}
    }

    (async () => {
      const available = await checkOllamaAvailable();
      if (!mountedRef.current) return;
      
      setOllamaAvailable(available);
      if (available) {
        const models = await listOllamaModels();
        if (!mountedRef.current) return;
        
        setOllamaModels(models);
        if (models.length > 0) {
          setSelectedModel('ollama');
        }
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [checkOllamaAvailable, listOllamaModels]);

  useEffect(() => {
    localStorage.setItem('workspace:apiKeys', JSON.stringify(apiKeyConfig));
  }, [apiKeyConfig]);

  const validateApiKey = useCallback(async (provider: string, apiKey: string) => {
    if (!apiKey || apiKey.length < 5) {
      setValidationStatus(prev => ({ ...prev, [provider]: 'idle' }));
      return;
    }

    setValidationStatus(prev => ({ ...prev, [provider]: 'checking' }));
    const valid = await validateProviderApiKey(provider, apiKey);
    setValidationStatus(prev => ({ ...prev, [provider]: valid ? 'valid' : 'invalid' }));
  }, [validateProviderApiKey]);

  const debouncedValidate = useCallback((provider: string, apiKey: string) => {
    clearTimeout(validateTimeoutRef.current[provider]);
    validateTimeoutRef.current[provider] = setTimeout(() => {
      validateApiKey(provider, apiKey);
    }, 1000);
  }, [validateApiKey]);

  const applyVariables = useCallback((text: string): string => {
    let result = text;
    variables.forEach(v => {
      const regex = new RegExp(`\\{\\{${v.name}\\}\\}`, 'g');
      result = result.replace(regex, v.value || `{{${v.name}}}`);
    });
    return result;
  }, [variables]);

  const handleSendMessage = useCallback(() => {
    if (!userInput.trim()) return;

    const provider = getProviderForModel(selectedModel);
    if (provider !== 'ollama' && !apiKeyConfig[provider]) {
      setShowSettings(true);
      return;
    }

    const finalPrompt = prompt ? applyVariables(prompt) : undefined;
    sendMessage(userInput, finalPrompt, selectedModel);
    setUserInput('');
    success();
  }, [userInput, prompt, selectedModel, apiKeyConfig, applyVariables, sendMessage, success]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const getConnectionStatus = () => {
    const provider = getProviderForModel(selectedModel);
    if (provider === 'ollama' || ollamaModels.includes(selectedModel)) {
      return ollamaAvailable ? 'valid' : 'invalid';
    }
    return validationStatus[provider] || 'idle';
  };

  const connectionStatus = getConnectionStatus();

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          Prompt 工作台
        </h2>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <button
          onClick={() => { clearMessages(); setMobileSidebarOpen(false); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] mb-4"
        >
          <Plus className="w-5 h-5" />
          新建对话
        </button>

        <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            选择模型
          </h3>
          <div className="space-y-1">
            {ALL_MODELS.map(model => {
              const isOllama = model.provider === 'ollama';
              const status = isOllama
                ? (ollamaAvailable ? 'valid' : 'invalid')
                : (apiKeyConfig[model.provider] ? (validationStatus[model.provider] || 'idle') : 'idle');

              return (
                <button
                  key={model.id}
                  onClick={() => { setSelectedModel(model.id); }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${model.id === selectedModel
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <span className="text-lg">{model.icon}</span>
                  <span className="flex-1 text-left truncate">{model.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'valid' ? 'bg-emerald-500' :
                    status === 'checking' ? 'bg-blue-500 animate-pulse' :
                    status === 'invalid' ? 'bg-red-500' :
                    'bg-gray-300'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {ollamaAvailable && ollamaModels.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
              🦙 本地模型 ({ollamaModels.length})
            </h3>
            <div className="space-y-1">
              {ollamaModels.map(model => (
                <button
                  key={model}
                  onClick={() => { setSelectedModel(model); }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${selectedModel === model
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                    }
                  `}
                >
                  <span>🦙</span>
                  <span className="flex-1 text-left truncate font-mono">{model}</span>
                  {selectedModel === model && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <Key className="w-5 h-5" />
          API Key 设置
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={SPRING_CONFIG}
                className="fixed left-0 top-0 h-full w-72 z-50 lg:hidden"
              >
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ width: sidebarOpen ? 256 : 0, opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="hidden lg:block border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0 overflow-hidden"
        >
          <SidebarContent />
        </motion.div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center shrink-0">
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileSidebarOpen(prev => !prev);
                } else {
                  setSidebarOpen(prev => !prev);
                }
              }}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <MenuIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Variable className="w-5 h-5 text-indigo-500" />
              Prompt 调试工作台
            </h2>

            <div className="flex-1" />

            <div className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              ${connectionStatus === 'valid'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                : connectionStatus === 'checking'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 animate-pulse'
                : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
              }
            `}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'valid' ? 'bg-emerald-500' :
                connectionStatus === 'checking' ? 'bg-blue-500' :
                'bg-red-500'
              }`} />
              <span className="hidden sm:inline">
                {connectionStatus === 'valid' ? '已连接' :
                 connectionStatus === 'checking' ? '检测中' :
                 selectedModel === 'ollama' ? 'Ollama 未启动' : '需配置 API Key'}
              </span>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">设置</span>
            </button>
          </div>

          <div className="shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
              <Variable className="w-3.5 h-3.5 text-amber-500" />
              系统提示词 (使用 {'{{变量名}}'} 定义参数)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="你是一名专业的{{领域}}专家，请用{{语言}}回答问题，输出格式为{{格式}}..."
              className="w-full h-20 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm font-mono transition-all"
            />
          </div>

          {variables.length > 0 && (
            <div className="shrink-0 border-b border-gray-200 dark:border-gray-700 bg-amber-50/50 dark:bg-amber-500/5 px-4 py-3">
              <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                <Variable className="w-3.5 h-3.5" />
                自动提取的变量 ({variables.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {variables.map(v => (
                  <div key={v.name}>
                    <label className="block text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                      {v.name}
                    </label>
                    <input
                      type="text"
                      value={v.value}
                      onChange={(e) => setVariables(prev =>
                        prev.map(x => x.name === v.name ? { ...x, value: e.target.value } : x)
                      )}
                      placeholder={`输入 ${v.name} 的值...`}
                      className="w-full px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto scroll-smooth p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {llmError && (
                <motion.div
                  {...MESSAGE_ANIMATION}
                  className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-red-800 dark:text-red-400">连接错误</p>
                      <p className="text-sm text-red-600 dark:text-red-500">{llmError}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  {...MESSAGE_ANIMATION}
                  transition={{ ...MESSAGE_ANIMATION.transition, delay: idx * 0.05 }}
                >
                  <div className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${message.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                      }
                    `}>
                      {message.role === 'user' ? '👤' : <Bot className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                    </div>
                    <div className={`
                      flex-1 px-5 py-4 rounded-2xl max-w-[85%]
                      ${message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm'
                      }
                    `}>
                      <div className={`
                        text-sm leading-relaxed whitespace-pre-wrap
                        ${message.role === 'user' ? 'text-white/95' : 'text-gray-700 dark:text-gray-300'}
                      `}>
                        {message.content || (isStreaming && message.role === 'assistant' ? '' : '\u00A0')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <motion.div {...MESSAGE_ANIMATION}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.length === 0 && (
                <motion.div {...MESSAGE_ANIMATION} className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <Bot className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    开始调试你的 Prompt
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    {connectionStatus !== 'valid'
                      ? '请先在设置中配置 API Key 或启动本地 Ollama'
                      : '配置系统提示词，实时测试不同模型的输出效果'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['代码审查', '翻译优化', '创意写作', '数学解题'].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setUserInput(suggestion)}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={connectionStatus === 'valid' ? '输入你的消息...' : '请先配置 API Key...'}
                    rows={1}
                    disabled={connectionStatus !== 'valid'}
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm transition-all min-h-[52px] max-h-32 disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isStreaming || connectionStatus !== 'valid'}
                  className={`
                    p-3 rounded-xl font-medium transition-all flex items-center justify-center
                    ${userInput.trim() && !isStreaming && connectionStatus === 'valid'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.05] active:scale-[0.95]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 text-center">
                当前模型: {ALL_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={SPRING_CONFIG}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 overflow-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Key className="w-5 h-5" />
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
                  <div className={`p-4 rounded-xl border ${
                    ollamaAvailable
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <h3 className={`font-bold flex items-center gap-2 mb-2 ${
                      ollamaAvailable
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      🦙 Ollama 本地模型
                      {ollamaAvailable && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </h3>
                    <p className={`text-sm ${
                      ollamaAvailable
                        ? 'text-emerald-600 dark:text-emerald-500'
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {ollamaAvailable
                        ? `检测到 Ollama 正在运行，发现 ${ollamaModels.length} 个模型`
                        : '未检测到 Ollama，请先启动本地 Ollama 服务'}
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
                            setApiKeyConfig(prev => ({ ...prev, [provider]: newKey }));
                            debouncedValidate(provider, newKey);
                          }}
                          onBlur={() => validateApiKey(provider, key)}
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
                          🔒 Key 只保存在你的浏览器中
                        </p>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => { setShowSettings(false); success(); }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    保存配置
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AgentDebugPanel />
      </div>
    </div>
  );
}
