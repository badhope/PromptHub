'use client';

import { useState } from 'react';

interface ActivationCommandProps {
  command: string;
  title?: string;
}

export default function ActivationCommand({ command, title }: ActivationCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-white/80">{title}</span>
        </div>
      )}
      
      <div className="relative group">
        <div className="bg-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-gray-400 font-mono">activation-command.md</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              aria-label="复制激活指令"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400">已复制</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>复制指令</span>
                </>
              )}
            </button>
          </div>
          
          <div className="relative">
            <pre className="p-4 text-sm font-mono text-gray-100 whitespace-pre-wrap break-words overflow-x-auto max-h-96 overflow-y-auto">
              <code>{command}</code>
            </pre>
            
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-transparent to-gray-900/50 pointer-events-none"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
      
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>点击复制按钮即可复制完整Markdown指令</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          {command.length} 字符
        </div>
      </div>
    </div>
  );
}
