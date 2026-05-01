'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, FileText } from 'lucide-react';
import type { Skill, SkillSummary } from '@/types/skill';
import ExportModal from './ExportModal';
import { useHapticFeedback } from '@/hooks/useGestures';

interface ExportButtonProps {
  skill: Skill | SkillSummary;
  variant?: 'icon' | 'button' | 'card';
  className?: string;
}

export default function ExportButton({ skill, variant = 'icon', className = '' }: ExportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selection } = useHapticFeedback();

  const handleClick = () => {
    selection();
    setIsModalOpen(true);
  };

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
          title="导出角色文档"
        >
          <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
        <ExportModal skill={skill} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === 'button') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all ${className}`}
        >
          <Download className="w-4 h-4" />
          导出角色文档
        </motion.button>
        <ExportModal skill={skill} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border border-emerald-500/20 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-medium rounded-xl hover:from-emerald-500/20 hover:to-teal-500/20 transition-all ${className}`}
      >
        <FileText className="w-5 h-5" />
        <span>导出为 Markdown 文档</span>
        <Share2 className="w-4 h-4" />
      </motion.button>
      <ExportModal skill={skill} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
