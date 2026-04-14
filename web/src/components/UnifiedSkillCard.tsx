'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Copy, Check, Sparkles, Wrench, Layers, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Skill } from '@/types/skill';
import { showCopyToast, showFavoriteToast } from '@/components/ToastProvider';
import { useHapticFeedback } from '@/hooks/useGestures';

interface UnifiedSkillCardProps {
  skill: Skill;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  professional: 'from-blue-500 to-indigo-600',
  programming: 'from-green-500 to-emerald-600',
  creation: 'from-pink-500 to-rose-600',
  academic: 'from-purple-500 to-violet-600',
  character: 'from-amber-500 to-orange-600',
  life: 'from-cyan-500 to-teal-600',
  game: 'from-red-500 to-rose-600',
};

const TouchButton = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: (e: React.MouseEvent) => void; className?: string }) => (
  <motion.button
    whileTap={{ scale: 0.85 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    onClick={onClick}
    className={`relative overflow-hidden ${className}`}
  >
    {children}
  </motion.button>
);

export default function UnifiedSkillCard({ skill, viewMode, isFavorite, onToggleFavorite, index = 0 }: UnifiedSkillCardProps) {
  const [copied, setCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { success, selection } = useHapticFeedback();

  const isAgent = skill.source === 'skill';
  const gradient = CATEGORY_COLORS[skill.category || 'professional'] || 'from-gray-500 to-gray-600';

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(skill.systemPrompt || '');
    setCopied(true);
    showCopyToast(skill.name);
    setTimeout(() => setCopied(false), 2000);
    success();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite();
    showFavoriteToast(skill.name, !isFavorite);
    success();
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/skills/${skill.id}`} className="block">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 28,
            delay: Math.min(index * 0.03, 0.3)
          }}
          whileHover={{ y: -2, scale: 1.005 }}
          whileTap={{ scale: 0.985 }}
          onHoverStart={() => selection()}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
        >
          <motion.div 
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <span className="text-2xl">{skill.icon}</span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white truncate tracking-tight">
                {skill.name}
              </h3>
              {isAgent ? (
                <span className="px-2 py-0.5 bg-gradient-to-r from-indigo-500/12 to-purple-500/12 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Agent
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500/12 to-orange-500/12 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-600 dark:text-amber-400 text-[11px] rounded-full font-semibold flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  工具
                </span>
              )}
            </div>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate leading-relaxed">
              {skill.description}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <TouchButton
              onClick={handleCopy}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Check className="w-4.5 h-4.5 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-4.5 h-4.5 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </TouchButton>
            
            <TouchButton
              onClick={handleFavorite}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <motion.div
                animate={{
                  scale: isFavorite ? [1, 1.3, 1] : 1,
                  rotate: isFavorite ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Heart
                  className={`w-4.5 h-4.5 transition-all duration-300 ${
                    isFavorite
                      ? 'fill-rose-500 text-rose-500 scale-110'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </motion.div>
            </TouchButton>

            <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/skills/${skill.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 250, 
          damping: 25,
          delay: Math.min(index * 0.04, 0.4)
        }}
        whileHover={{ 
          y: -6, 
          scale: 1.02,
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        whileTap={{ 
          scale: 0.97,
          transition: { type: 'spring', stiffness: 500, damping: 30 }
        }}
        onHoverStart={() => selection()}
        className="h-full bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-400 overflow-hidden relative group"
        style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/0 via-indigo-50/30 to-purple-50/30 dark:via-indigo-500/5 dark:to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        />

        <div className="relative p-4 sm:p-5">
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <TouchButton
                  onClick={handleFavorite}
                  className={`
                    p-2 rounded-xl backdrop-blur-sm transition-all duration-300
                    ${isFavorite
                      ? 'bg-rose-500/15 dark:bg-rose-500/25'
                      : 'bg-white/80 dark:bg-gray-800/80 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <motion.div
                    animate={{
                      scale: isFavorite ? [1, 1.4, 1] : 1,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${
                        isFavorite
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    />
                  </motion.div>
                </TouchButton>
              </motion.div>

              {isAgent ? (
                <span className="px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] rounded-full font-semibold flex items-center gap-1 shadow-lg shadow-indigo-500/25">
                  <Sparkles className="w-3.5 h-3.5" />
                  Agent
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] rounded-full font-semibold flex items-center gap-1 shadow-lg shadow-amber-500/25">
                  <Wrench className="w-3.5 h-3.5" />
                  工具
                </span>
              )}
            </div>
          </div>

          <motion.div 
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20`}
            whileHover={{ 
              scale: 1.15, 
              rotate: 5,
              transition: { type: 'spring', stiffness: 400, damping: 18 }
            }}
          >
            <motion.span 
              className="text-2xl"
              animate={{
                y: [0, -2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {skill.icon}
            </motion.span>
          </motion.div>

          <h3 className="text-[16px] font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 tracking-tight">
            {skill.name}
          </h3>

          <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-[1.65]">
            {skill.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white dark:border-gray-800" />
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white dark:border-gray-800" />
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">+</span>
              </div>
            </div>
            
            <motion.div 
              className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium"
              whileHover={{ x: 2 }}
            >
              <span>立即使用</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
