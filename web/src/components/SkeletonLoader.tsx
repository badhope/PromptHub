'use client';

import { motion } from 'framer-motion';

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard() {
  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 overflow-hidden">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="flex gap-1">
            <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="w-11 h-11 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl" />
            <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
        
        <div className="h-6 sm:h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3" />
        </div>
        
        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/5" />
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-gray-800/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}

export default function SkeletonLoader({ count = 6 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
