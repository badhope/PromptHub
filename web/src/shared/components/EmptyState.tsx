'use client';

import { motion } from 'framer-motion';
import { Search, Heart, FileX, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'favorites' | 'results' | 'error' | 'empty';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const iconMap = {
  search: Search,
  favorites: Heart,
  results: FileX,
  error: FileX,
  empty: Sparkles,
};

const colorMap = {
  search: 'from-indigo-400 to-purple-400',
  favorites: 'from-rose-400 to-pink-400',
  results: 'from-amber-400 to-orange-400',
  error: 'from-red-400 to-amber-400',
  empty: 'from-emerald-400 to-teal-400',
};

const titleMap = {
  search: '没有找到相关技能',
  favorites: '还没有收藏任何技能',
  results: '暂无内容',
  error: '加载出错了',
  empty: '这里空空如也',
};

const descriptionMap = {
  search: '试试其他关键词吧，比如「写作」、「编程」、「翻译」等',
  favorites: '点击技能卡片上的心形图标，收藏你喜欢的技能',
  results: '当前分类下还没有内容，稍后再来看看吧',
  error: '遇到了一点小问题，请刷新页面重试',
  empty: '马上就会有精彩内容在这里呈现',
};

export default function EmptyState({
  type = 'empty',
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const IconComponent = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative w-24 h-24 sm:w-32 sm:h-32 mb-6 sm:mb-8 rounded-3xl bg-gradient-to-br ${colorMap[type]} flex items-center justify-center shadow-xl`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-3xl" />
        {icon || <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 text-white relative z-10" />}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
      >
        {title || titleMap[type]}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed"
      >
        {description || descriptionMap[type]}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {action}
        </motion.div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${colorMap[type]} opacity-20`}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
