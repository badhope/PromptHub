'use client';

import { motion } from 'framer-motion';
import { Search, Heart, Star, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useHapticFeedback } from '@/hooks/useGestures';

interface EmptyStateProps {
  type: 'search' | 'favorites' | 'error' | 'empty' | 'welcome';
  title?: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

const icons = {
  search: Search,
  favorites: Heart,
  error: AlertCircle,
  empty: Sparkles,
  welcome: Star,
};

const gradients = {
  search: 'from-blue-400 to-indigo-500',
  favorites: 'from-rose-400 to-pink-500',
  error: 'from-amber-400 to-orange-500',
  empty: 'from-purple-400 to-violet-500',
  welcome: 'from-green-400 to-emerald-500',
};

const defaultContent = {
  search: {
    title: '没有找到相关结果',
    description: '试试其他关键词，或者浏览全部智能体',
  },
  favorites: {
    title: '还没有收藏',
    description: '点击 ❤️ 收藏你喜欢的智能体，随时可以快速访问',
  },
  error: {
    title: '出了点小问题',
    description: '请刷新页面重试，或者稍后再来',
  },
  empty: {
    title: '这里空空如也',
    description: '很快就会有更多精彩内容上线',
  },
  welcome: {
    title: '欢迎使用 Mobile Skills',
    description: '发现数百个专业级 AI 智能体，即刻开始你的效率革命',
  },
};

export default function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const Icon = icons[type];
  const gradient = gradients[type];
  const content = defaultContent[type];
  const { selection } = useHapticFeedback();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20,
          delay: 0.1
        }}
        className={`
          w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient}
          flex items-center justify-center mb-6
          shadow-xl shadow-indigo-500/20
        `}
      >
        <motion.div
          animate={{ 
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-12 h-12 text-white" strokeWidth={2} />
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[20px] font-semibold text-gray-900 dark:text-white mb-2 tracking-tight"
      >
        {title || content.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-[15px] text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-6"
      >
        {description || content.description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href={action.href}
            onClick={() => selection()}
            className="
              inline-flex items-center gap-2 px-5 py-3
              bg-gradient-to-r from-indigo-500 to-purple-500
              text-white text-[14px] font-semibold rounded-2xl
              shadow-lg shadow-indigo-500/25
              hover:shadow-xl hover:shadow-indigo-500/30
              transition-all duration-300
              active:scale-95
            "
          >
            {action.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
