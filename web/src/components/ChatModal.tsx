'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Settings, Download, Copy, Check, Key, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useHapticFeedback, useSwipe } from '@/hooks/useGestures';
import { useLLM } from '@/hooks/useLLM';
import html2canvas from 'html2canvas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  systemPrompt: string;
  icon: string;
}

const LoadingDots = () => (
  <div className="flex gap-1.5 items-end h-5">
    <motion.span
      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
    />
  </div>
);

const TouchButton = ({ children, onClick, className = '', disabled = false }: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const { selection } = useHapticFeedback();
  
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onClick={() => !disabled && onClick && (selection(), onClick())}
      className={`relative overflow-hidden touch-manipulation ${className}`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default function ChatModal({ isOpen, onClose, skillName, systemPrompt, icon }: Props) {
  const { success, error, selection } = useHapticFeedback();
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.5]);
  const scale = useTransform(y, [0, 200], [1, 0.95]);
  const springY = useSpring(y, { stiffness: 400, damping: 35 });

  const {
    messages,
    isStreaming: isLoading,
    sendMessage,
    clearMessages,
  } = useLLM({
    defaultModel: 'gpt-3.5-turbo',
    apiKeys: { openai: apiKey },
  });

  const { ref: swipeRef } = useSwipe({
    threshold: 100,
    onSwipeDown: () => {
      success();
      onClose();
    }
  });

  const modalRef = swipeRef as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    const saved = localStorage.getItem('openai-api-key');
    if (saved) {
      setApiKey(saved);
      setApiKeySaved(true);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleSettings = () => {
    selection();
    setShowSettings(prev => !prev);
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai-api-key', apiKey.trim());
      setApiKeySaved(true);
      setShowSettings(false);
      success();
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('openai-api-key');
    setApiKey('');
    setApiKeySaved(false);
    success();
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!apiKeySaved) {
      setShowSettings(true);
      return;
    }

    success();
    const currentInput = input;
    setInput('');

    await sendMessage(currentInput, systemPrompt);
  };

  const exportScreenshot = async () => {
    if (!chatRef.current) return;
    try {
      const canvas = await html2canvas(chatRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `${skillName}-chat-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      success();
    } catch {
      error();
    }
  };

  const copyToClipboard = async () => {
    const text = messages
      .map(m => `${m.role === 'user' ? '👤 用户' : '🤖 助手'}: ${m.content}`)
      .join('\n\n');
    await navigator.clipboard.writeText(text);
    success();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            ref={modalRef}
            style={{ y: springY, opacity, scale }}
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-2xl h-[85vh] sm:h-[80vh] max-h-[800px] bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2 sm:hidden" />
            
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 dark:text-white truncate">{skillName}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  ✅ CORS 已修复 · 后端代理模式
                </p>
              </div>
              
              <TouchButton onClick={exportScreenshot} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <Download className="w-5 h-5 text-gray-500" />
              </TouchButton>
              <TouchButton onClick={copyToClipboard} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <Copy className="w-5 h-5 text-gray-500" />
              </TouchButton>
              <TouchButton onClick={() => { clearMessages(); success(); }} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <Trash2 className="w-5 h-5 text-gray-500" />
              </TouchButton>
              <TouchButton onClick={toggleSettings} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <Settings className="w-5 h-5 text-gray-500" />
              </TouchButton>
              <TouchButton onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </TouchButton>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm
                    ${message.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                    }
                  `}>
                    {message.role === 'user' ? '👤' : icon}
                  </div>
                  <div className={`
                    flex-1 px-4 py-3 rounded-2xl max-w-[85%]
                    ${message.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }
                  `}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content || (isLoading && message.role === 'assistant' ? '' : '\u00A0')}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800">
                    <LoadingDots />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
              <div className="flex gap-3 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={apiKeySaved ? "输入消息... (Enter 发送)" : "请先设置 API Key"}
                  rows={1}
                  disabled={!apiKeySaved || isLoading}
                  className="flex-1 px-4 py-3 pr-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm disabled:opacity-50 min-h-[52px] max-h-32"
                />
                <TouchButton
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading || !apiKeySaved}
                  className={`
                    p-3 rounded-xl font-medium flex items-center justify-center shrink-0
                    ${input.trim() && !isLoading && apiKeySaved
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <Send className="w-5 h-5" />
                </TouchButton>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: 20 }}
                    className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Key className="w-5 h-5 text-amber-500" />
                      OpenAI API 设置
                    </h3>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">
                      ✅ 通过后端代理调用，无 CORS 限制
                    </p>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
                    />
                    <div className="flex gap-3">
                      <TouchButton
                        onClick={clearApiKey}
                        className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                      >
                        清除
                      </TouchButton>
                      <TouchButton
                        onClick={saveApiKey}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium"
                      >
                        保存
                      </TouchButton>
                    </div>
                    <TouchButton
                      onClick={() => setShowSettings(false)}
                      className="w-full mt-3 py-2 text-gray-500 text-sm"
                    >
                      取消
                    </TouchButton>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
