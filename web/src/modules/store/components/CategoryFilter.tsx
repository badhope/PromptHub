'use client';

import { useHapticFeedback } from '@/hooks/useGestures';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { selection } = useHapticFeedback();

  const handleSelect = (id: string) => {
    selection();
    onSelect(id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">
          分类导航
        </h3>
      </div>

      <div className="p-2">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(category.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
              selected === category.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
            {selected === category.id && (
              <motion.div
                layoutId="category-indicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          应用类型
        </h4>
        <div className="space-y-1">
          {[
            { id: 'agent', name: 'AI 智能体', icon: '🤖' },
            { id: 'prompt', name: '提示词', icon: '💡' },
            { id: 'tool', name: 'MCP 工具', icon: '🔧' },
            { id: 'workflow', name: '工作流', icon: '⚡' },
          ].map((type) => (
            <button
              key={type.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          价格
        </h4>
        <div className="space-y-1">
          {[
            { id: 'free', name: '免费应用' },
            { id: 'paid', name: '付费应用' },
            { id: 'subscription', name: '订阅制' },
          ].map((price) => (
            <button
              key={price.id}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {price.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
