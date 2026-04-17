'use client';

import { memo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ChevronRight, Copy, Check, Heart, MessageCircle } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import Balancer from 'react-wrap-balancer';
import { showCopyToast } from './ToastProvider';
import ChatModal from './ChatModal';
import type { Skill, SkillSummary } from '@/types/skill';
import {
  getSkillCategory,
  getSkillDescription,
  getSkillUseCount,
  getSkillSystemPrompt
} from '@/types/skill';
import {
  getCategoryIcon,
  CATEGORY_I18N_KEYS
} from '@/lib/categories';
import { useI18nContext } from '@/components/I18nProvider';
import { useLongPress, useHapticFeedback } from '@/hooks/useGestures';

interface SkillCardProps {
  skill: Skill | SkillSummary;
  index?: number;
}

const SkillCardComponent = function SkillCard({ skill, index = 0 }: SkillCardProps) {
  const { t } = useI18nContext();
  const category = getSkillCategory(skill);
  const description = getSkillDescription(skill);
  const useCount = getSkillUseCount(skill);
  const [isCopied, copyToClipboard] = useCopyToClipboard();
  const [isPressed, setIsPressed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { selection, success } = useHapticFeedback();
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { ref: longPressRef } = useLongPress({
    duration: 400,
    onLongPress: () => {
      setShowPreview(true);
      success();
    }
  });

  useEffect(() => {
    if (showPreview) {
      const timer = setTimeout(() => setShowPreview(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPreview]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsPressed(false);
  };

  const handleTouchStart = () => {
    setIsPressed(true);
    selection();
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleFavorite = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    success();
  };

  const icon = ('icon' in skill && skill.icon) ? skill.icon : getCategoryIcon(category);
  const categoryI18nKey = CATEGORY_I18N_KEYS[category];
  const categoryName = categoryI18nKey ? t(categoryI18nKey as Parameters<typeof t>[0]) : category;

  const rotateX = mousePos.y * -4;
  const rotateY = mousePos.x * 4;

  const systemPrompt = getSkillSystemPrompt(skill);

  const handleCopyActivation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    copyToClipboard(systemPrompt);
    success();
    showCopyToast(skill.name);
  };

  const handleStartChat = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowChat(true);
    success();
  };

  return (
    <>
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-11/12 max-w-md p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                {String(icon || '🤖')}
              </div>
              <div>
                <h3 className="text-xl font-bold">{skill.name}</h3>
                <p className="text-sm text-gray-500">{categoryName}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              <Balancer>{description}</Balancer>
            </p>
            <p className="text-xs text-center text-gray-400">松开关闭预览 • 长按进入详情</p>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: Math.min(index * 0.03, 0.3),
          type: 'spring',
          stiffness: 150
        }}
        className="h-full"
      >
        <HoverCard.Root openDelay={200} closeDelay={100}>
          <HoverCard.Trigger asChild>
            <Link 
              href={`/skills/${skill.id}`}
              className="block h-full group"
            >
              <div
                ref={(el) => {
                  (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                  if (longPressRef && el) {
                    (longPressRef as React.MutableRefObject<HTMLDivElement>).current = el;
                  }
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className={`
                  relative h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                  rounded-2xl p-4 sm:p-6 overflow-hidden
                  hover:border-indigo-500 dark:hover:border-indigo-400 
                  hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20
                  transition-all duration-300 ease-out
                  ${isPressed ? 'scale-[0.97]' : 'scale-100'}
                `}
                style={{
                  transform: window.innerWidth >= 768 
                    ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isPressed ? 0.97 : 1})`
                    : undefined,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white">{String(icon || '🤖')}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={handleFavorite}
                        className={`
                          touch-target w-11 h-11 flex items-center justify-center rounded-xl
                          transition-all duration-200
                          ${isFavorite 
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-500' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500'
                          }
                        `}
                        aria-label="收藏"
                      >
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={handleStartChat}
                        className="
                          touch-target w-11 h-11 flex items-center justify-center rounded-xl
                          bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30
                          hover:scale-105 active:scale-95 transition-all duration-200
                        "
                        aria-label="立即开始聊天"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={handleCopyActivation}
                        className="
                          touch-target w-11 h-11 flex items-center justify-center rounded-xl
                          bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400
                          hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200
                        "
                        aria-label="复制激活指令"
                      >
                        {isCopied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1.5 group-hover:translate-x-0.5 transition-transform duration-300 truncate">
                    {skill.name}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                    {categoryName}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 min-h-[40px] font-medium">
                    <Balancer>{description}</Balancer>
                  </p>

                  <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {useCount > 0 ? `${useCount.toLocaleString()} 人在玩` : '🔥 热门'}
                    </span>
                    <button
                      onClick={handleStartChat}
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all duration-300"
                    >
                      立即开始
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </HoverCard.Trigger>

          <HoverCard.Portal>
            <HoverCard.Content
              className="hidden sm:block z-50 w-80 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl"
              sideOffset={8}
              align="start"
              side="right"
            >
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{skill.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 font-medium">
                <Balancer>{description}</Balancer>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleStartChat}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl text-center transition-colors shadow-lg"
                >
                  🚀 立即开始聊天
                </button>
                <Link
                  href={`/skills/${skill.id}`}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl transition-colors"
                >
                  详情
                </Link>
              </div>
              <HoverCard.Arrow className="fill-white dark:fill-gray-800" width={16} height={8} />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </motion.div>

      <ChatModal
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        skillName={skill.name}
        systemPrompt={systemPrompt}
        icon={String(icon || '🤖')}
      />
    </>
  );
};

export default memo(SkillCardComponent);
