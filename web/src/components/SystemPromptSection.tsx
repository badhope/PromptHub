'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useHapticFeedback } from '@/hooks/useGestures';

interface SystemPromptSectionProps {
  systemPrompt: string;
  onCopy: () => void;
  copied: boolean;
}

interface TouchButtonProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const TouchButton = ({ children, onClick, className = '' }: TouchButtonProps) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    onClick={onClick}
    className={`relative overflow-hidden ${className}`}
  >
    {children}
  </motion.button>
);

export default function SystemPromptSection({ systemPrompt, onCopy, copied }: SystemPromptSectionProps) {
  const { success, selection } = useHapticFeedback();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const stats = {
    characters: systemPrompt.length,
    chineseChars: (systemPrompt.match(/[一-龥]/g) || []).length,
    estimatedReadingTime: Math.ceil(systemPrompt.length / 300),
  };

  const handleToggleExpand = () => {
    selection();
    setIsExpanded(!isExpanded);
  };

  const handleToggleFull = () => {
    success();
    setShowFullPrompt(!showFullPrompt);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/90 to-orange-500/90 flex items-center justify-center text-white text-sm">📋</span>
            系统提示词
          </h2>
          
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-gray-400 dark:text-gray-500 hidden sm:inline">
              {stats.chineseChars} 字 · {stats.estimatedReadingTime} 分钟阅读
            </span>
            
            <TouchButton
              onClick={onCopy}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <Check className="w-4.5 h-4.5 text-green-500" />
              ) : (
                <Copy className="w-4.5 h-4.5 text-gray-500" />
              )}
            </TouchButton>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-3 sm:hidden">
          <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] rounded-lg font-medium">
            {stats.chineseChars} 字
          </span>
          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] rounded-lg font-medium">
            {stats.estimatedReadingTime} 分钟
          </span>
          <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] rounded-lg font-medium">
            Agent 五层架构
          </span>
        </div>
      </div>
      
      <div className="relative">
        <div 
          className={`
            transition-all duration-500 ease-out
            ${showFullPrompt 
              ? 'max-h-none' 
              : isExpanded 
                ? 'max-h-[800px]' 
                : 'max-h-[380px]'
            }
            overflow-y-auto overscroll-contain
          `}
        >
          <div className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
            <div 
              className="
                prose dark:prose-invert 
                prose-sm sm:prose-base 
                max-w-none
                prose-p:leading-[1.8]
                prose-p:my-2.5
                prose-h2:text-[15px]
                prose-h2:font-semibold
                prose-h2:mt-5
                prose-h2:mb-3
                prose-h3:text-[14px]
                prose-h3:font-medium
                prose-h3:mt-4
                prose-h3:mb-2
                prose-code:text-[12px]
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:rounded-lg
                prose-code:bg-gray-100
                dark:prose-code:bg-gray-800
                prose-pre:my-3
                prose-pre:p-4
                prose-pre:rounded-xl
                prose-pre:text-[12px]
                prose-pre:leading-[1.6]
                prose-li:my-1.5
                prose-li:leading-[1.7]
                prose-strong:text-gray-800
                dark:prose-strong:text-gray-200
              "
            >
              <ReactMarkdown>{systemPrompt}</ReactMarkdown>
            </div>
          </div>
        </div>
        
        {!showFullPrompt && (
          <div 
            className={`
              absolute bottom-0 left-0 right-0 h-20 pointer-events-none
              bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent
              dark:from-gray-900 dark:via-gray-900/80
              transition-opacity duration-300
              ${isExpanded ? 'opacity-0' : 'opacity-100'}
            `}
          />
        )}
      </div>
      
      <div className="px-5 sm:px-6 py-3.5 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <TouchButton
            onClick={handleToggleExpand}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-[13px] font-medium text-gray-600 dark:text-gray-300"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>收起</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>展开更多</span>
              </>
            )}
          </TouchButton>
          
          <TouchButton
            onClick={handleToggleFull}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors text-[13px] font-medium
              ${showFullPrompt
                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }
            `}
          >
            {showFullPrompt ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>退出全屏</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>全屏阅读</span>
              </>
            )}
          </TouchButton>
        </div>
      </div>
      
      <AnimatePresence>
        {showFullPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[100] bg-[#f2f2f7] dark:bg-black pt-safe"
          >
            <div className="sticky top-0 z-10 bg-[#f2f2f7]/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
                <TouchButton
                  onClick={handleToggleFull}
                  className="-ml-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronDown className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </TouchButton>
                
                <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                  系统提示词全文
                </h3>
                
                <TouchButton
                  onClick={onCopy}
                  className="-mr-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </TouchButton>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto px-4 py-6 pb-safe">
              <div 
                className="
                  prose dark:prose-invert 
                  prose-sm sm:prose-base 
                  max-w-none
                  prose-p:leading-[1.9]
                  prose-p:my-3
                  prose-h2:text-[16px]
                  prose-h2:font-semibold
                  prose-h2:mt-6
                  prose-h2:mb-4
                  prose-h3:text-[15px]
                  prose-h3:font-medium
                  prose-h3:mt-5
                  prose-h3:mb-3
                  prose-code:text-[13px]
                  prose-code:px-2
                  prose-code:py-1
                  prose-pre:my-4
                  prose-pre:p-5
                  prose-pre:text-[13px]
                  prose-pre:leading-[1.7]
                  prose-li:my-2
                  prose-li:leading-[1.8]
                "
              >
                <ReactMarkdown>{systemPrompt}</ReactMarkdown>
              </div>
              
              <div className="h-10" />
              
              <div className="text-center text-[13px] text-gray-400 dark:text-gray-500">
                阅读完成，下拉关闭
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
