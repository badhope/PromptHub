'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Settings, Download, Copy, Check, Key, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useHapticFeedback, useSwipe } from '@/hooks/useGestures';
import html2canvas from 'html2canvas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatModalProps {
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

const TouchButton = ({ children, onClick, className = '', disabled = false }: any) => {
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

export default function ChatModal({ isOpen, onClose, skillName, systemPrompt, icon }: ChatModalProps) {
  const { success, error, selection } = useHapticFeedback();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.5]);
  const scale = useTransform(y, [0, 200], [1, 0.95]);
  const springY = useSpring(y, { stiffness: 400, damping: 35 });

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
    if (isOpen) {
      y.set(0);
      setShowSettings(false);
      if (messages.length === 0) {
        setMessages([{
          id: '1',
          role: 'assistant',
          content: `你好！我是 ${skillName} ${icon}。有什么想和我聊的吗？\n\n💡 提示：下拉可关闭对话，点击设置可以生成截图分享！`,
          timestamp: Date.now()
        }]);
      }
    }
  }, [isOpen, skillName, icon, messages.length, y]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleSettings = () => {
    selection();
    setShowSettings(!showSettings);
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!apiKeySaved) {
      setShowSettings(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    success();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input }
          ],
          max_tokens: 1000
        })
      });

      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      success();
    } catch (e) {
      error();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '😅 哎呀，API Key 好像有问题，请检查设置。也可能是网络问题~',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportScreenshot = async () => {
    if (!chatRef.current) return;
    success();
    
    const canvas = await html2canvas(chatRef.current, {
      backgroundColor: '#ffffff',
      scale: 2
    });
    
    const link = document.createElement('a');
    link.download = `${skillName}-聊天记录-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    success();
  };

  const copyMessages = () => {
    const text = messages.map(m => {
      const prefix = m.role === 'user' ? '你：' : `${skillName}：`;
      return prefix + m.content;
    }).join('\n\n');
    navigator.clipboard.writeText(text);
    success();
  };

  const handleClose = () => {
    selection();
    onClose();
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            ref={modalRef}
            style={{ y: springY, opacity, scale }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full sm:w-[90vw] sm:max-w-2xl h-[88vh] sm:h-[82vh] max-h-[850px] bg-[#f2f2f7] dark:bg-black rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) {
                success();
                onClose();
              }
            }}
          >
            <div className="flex justify-center py-2.5 sm:hidden">
              <div className="w-36 h-1.5 bg-gray-300/80 dark:bg-gray-600/80 rounded-full touch-none" />
            </div>

            <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20"
                >
                  {icon}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-[17px] text-gray-900 dark:text-white tracking-tight">{skillName}</h3>
                  <p className="text-[12px] text-gray-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    在线
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-0.5">
                <TouchButton
                  onClick={toggleSettings}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800/80"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </TouchButton>
                <TouchButton
                  onClick={exportScreenshot}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800/80"
                >
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </TouchButton>
                <TouchButton
                  onClick={copyMessages}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800/80"
                >
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </TouchButton>
                <TouchButton
                  onClick={handleClose}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800/80 sm:hidden"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </TouchButton>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="overflow-hidden border-b border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-semibold text-[15px] text-gray-800 dark:text-gray-200">OpenAI API Key 设置</span>
                    </div>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-3">
                      ⚠️ Key 仅保存在本地浏览器，不会上传到任何服务器
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[15px]"
                      />
                      {apiKeySaved ? (
                        <TouchButton
                          onClick={clearApiKey}
                          className="px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[14px] font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          清除
                        </TouchButton>
                      ) : (
                        <TouchButton
                          onClick={saveApiKey}
                          className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-[14px] font-medium flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          保存
                        </TouchButton>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
              {messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ 
                    type: 'spring', 
                    stiffness: 350, 
                    damping: 28,
                    delay: Math.min(i * 0.03, 0.15)
                  }}
                  className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[20px] rounded-br-[6px] shadow-sm shadow-indigo-500/20'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-[20px] rounded-bl-[6px] shadow-sm'
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-[20px] rounded-bl-[6px] shadow-sm">
                    <LoadingDots />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm pb-safe">
              <div className="flex gap-2.5 items-end">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={apiKeySaved ? "输入消息..." : "请先在设置中添加 API Key"}
                  className="flex-1 px-4 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-[20px] text-[15px] min-h-[52px] max-h-[120px]"
                />
                <TouchButton
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className={`w-13 h-13 rounded-[20px] flex items-center justify-center text-white shadow-sm min-w-[52px] min-h-[52px] ${
                    isLoading || !input.trim()
                      ? 'bg-gray-300 dark:bg-gray-700'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </TouchButton>
              </div>
              <p className="text-[11px] text-center text-gray-400 mt-2.5">
                ↓ 下拉可关闭 · 按 Enter 发送 · 截图可分享
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
