'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface CollapsiblePanelProps {
  title: string;
  icon: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const SPRING_CONFIG = { type: 'spring', damping: 25, stiffness: 220 } as const;

export function CollapsiblePanel({ title, icon, expanded, onToggle, children }: CollapsiblePanelProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={SPRING_CONFIG}
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={SPRING_CONFIG}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
