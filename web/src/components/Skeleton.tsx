'use client';

import { motion } from 'framer-motion';

const Pulse = ({ className = '' }: { className?: string }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className={`bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}
  />
);

export const SkillCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-start gap-4 mb-4">
        <Pulse className="w-14 h-14 rounded-2xl" />
        <div className="flex-1">
          <Pulse className="h-6 w-3/4 mb-2" />
          <Pulse className="h-4 w-full" />
        </div>
      </div>
      <Pulse className="h-4 w-full mb-2" />
      <Pulse className="h-4 w-2/3 mb-4" />
      <div className="flex gap-2 mb-4">
        <Pulse className="h-6 w-16 rounded-full" />
        <Pulse className="h-6 w-16 rounded-full" />
        <Pulse className="h-6 w-16 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Pulse className="h-10 flex-1" />
        <Pulse className="h-10 w-10" />
      </div>
    </div>
  );
};

export const SkillsGridSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkillCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const SearchBarSkeleton = () => (
  <Pulse className="h-14 w-full rounded-2xl mb-6" />
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {[1, 2, 3, 4].map(i => (
      <Pulse key={i} className="h-24 rounded-2xl" />
    ))}
  </div>
);

export const CategoryTabsSkeleton = () => (
  <div className="flex flex-wrap gap-3 mb-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <Pulse key={i} className="h-10 w-24 rounded-xl" />
    ))}
  </div>
);

export const SkillDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Pulse className="w-16 h-16 rounded-2xl" />
        <div>
          <Pulse className="h-8 w-64 mb-2" />
          <Pulse className="h-4 w-48" />
        </div>
      </div>
      <Pulse className="h-5 w-full mb-2" />
      <Pulse className="h-5 w-full mb-2" />
      <Pulse className="h-5 w-3/4 mb-6" />
      <div className="flex gap-3">
        <Pulse className="h-12 w-40 rounded-xl" />
        <Pulse className="h-12 w-32 rounded-xl" />
      </div>
    </div>
    <Pulse className="h-96 w-full rounded-2xl" />
  </div>
);

interface EmptyStateProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ 
  icon = '🔍', 
  title = '没有找到结果', 
  subtitle = '试试其他搜索词或者清除筛选条件',
  action,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-7xl mb-6"
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        {subtitle}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default {
  SkillCardSkeleton,
  SkillsGridSkeleton,
  SearchBarSkeleton,
  StatsSkeleton,
  CategoryTabsSkeleton,
  SkillDetailSkeleton,
  EmptyState,
};
