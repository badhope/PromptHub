'use client';

import { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  '正在加载技能库...',
  '准备AI角色...',
  '优化性能中...',
  '即将完成...',
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-7xl md:text-8xl animate-bounce-subtle inline-block">🚀</span>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
          PromptHub
        </h2>

        {/* Loading message with fade */}
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 min-h-[28px] transition-all duration-300">
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-64 md:w-80 mx-auto mb-6">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {Math.min(Math.round(progress), 100)}%
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === messageIndex % 3
                  ? 'bg-indigo-500 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 scale-100'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
