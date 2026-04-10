'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { showCopyToast, showFavoriteToast } from './ToastProvider';

interface AIToolCardProps {
  tool: {
    id: string;
    name: string;
    icon: string;
    description: string;
    scenarios: string[];
    activation: string;
    rawUrl?: string;
  };
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function AIToolCard({ tool, index, isFavorite, onToggleFavorite }: AIToolCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(tool.activation);
      setCopied(true);
      showCopyToast(tool.name);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showFavoriteToast(tool.name, !isFavorite);
    onToggleFavorite?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className={`h-full border rounded-2xl overflow-hidden
          hover:shadow-xl hover:shadow-gray-100
          transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-50 border-red-200 hover:border-red-400' 
              : 'bg-white border-gray-200 hover:border-black'
          }`}>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 border rounded-xl 
                flex items-center justify-center text-2xl
                transition-all duration-300 ${
                  isFavorite
                    ? 'bg-red-100 border-red-200'
                    : 'bg-gray-50 border-gray-200 group-hover:bg-black group-hover:border-black'
                }`}>
              <span className="group-hover:scale-110 transition-transform duration-300">
                {tool.icon}
              </span>
            </div>
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-all duration-200
                  hover:scale-110 active:scale-95 ${
                    isFavorite 
                      ? 'text-red-500 bg-red-100' 
                      : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                  }`}
            >
              <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <Link href={`/tools/${tool.id}`} className="block">
            <h3 className="text-xl font-bold text-black mb-2 
                group-hover:opacity-70 transition-opacity">
              {tool.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {tool.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {tool.scenarios.slice(0, 3).map((scenario, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full
                    border border-gray-100"
              >
                {scenario}
              </span>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3 px-4 bg-black text-white text-sm font-bold rounded-xl
                hover:bg-gray-800 active:scale-98 transition-all duration-200
                flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 13l4 4L19 7" />
                </svg>
                ✅ 已复制到剪贴板
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                📋 复制激活指令
              </>
            )}
          </button>
        </div>

        <Link
          href={`/tools/${tool.id}`}
          className="block border-t border-gray-100 py-4 px-6
              hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider
                group-hover:text-black transition-colors">
              查看详情
            </span>
            <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 
                group-hover:text-black transition-all duration-300" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
