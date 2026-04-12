'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Grid3X3 } from 'lucide-react';
import { MULTI_LEVEL_CATEGORY_SYSTEM, getCategorySkills, getSubcategorySkills } from '@/lib/category-system';
import type { Skill, SkillSummary } from '@/types/skill';
import { useHapticFeedback } from '@/hooks/useGestures';
import TouchButton from './TouchButton';

interface CategoryNavigationProps {
  skills: Skill[] | SkillSummary[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export default function CategoryNavigation({
  skills,
  selectedCategory,
  selectedSubcategory,
  onCategorySelect
}: CategoryNavigationProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(selectedCategory || null);
  const { success, selection } = useHapticFeedback();

  const handleCategoryClick = (categoryId: string) => {
    selection();
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
        <h3 className="text-[16px] font-semibold text-gray-900 dark:text-white flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
            <Grid3X3 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          分类导航
        </h3>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {Object.entries(MULTI_LEVEL_CATEGORY_SYSTEM).map(([categoryId, category], index) => {
          const isExpanded = expandedCategory === categoryId;
          const categorySkills = getCategorySkills(categoryId, skills);
          const isSelected = selectedCategory === categoryId;
          const hasSubcategories = category.subcategories && Object.keys(category.subcategories as object).length > 0;
          
          return (
            <motion.div 
              key={categoryId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <TouchButton
                onClick={() => handleCategoryClick(categoryId)}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  isSelected 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <motion.div 
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg shadow-indigo-500/15`}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <span className="text-xl">{category.icon}</span>
                  </motion.div>
                  <div className="text-left">
                    <div className="font-semibold text-[14px] text-gray-900 dark:text-white tracking-tight">
                      {category.name}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {categorySkills.length} 个技能
                      {hasSubcategories && ` · ${Object.keys(category.subcategories as Record<string, unknown>).length} 个子类`}
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ 
                    rotate: isExpanded ? 180 : 0,
                    scale: isExpanded ? 1.1 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center gap-2"
                >
                  {isSelected && !isExpanded && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  )}
                  <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </motion.div>
              </TouchButton>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="overflow-hidden bg-gray-50/70 dark:bg-gray-900/30"
                  >
                    <div className="px-5 py-4">
                      <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Link
                          href={`/category/${categoryId}`}
                          onClick={() => success()}
                          className={`group px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                            !selectedSubcategory && isSelected
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-gray-200/60 dark:border-gray-700/60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">全部 {category.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[11px] ${
                                !selectedSubcategory && isSelected
                                  ? 'text-white/80'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {categorySkills.length}
                              </span>
                              <ChevronRight className={`w-4 h-4 ${
                                !selectedSubcategory && isSelected
                                  ? 'text-white/80'
                                  : 'text-gray-400 group-hover:translate-x-0.5 transition-transform'
                              }`} />
                            </div>
                          </div>
                        </Link>
                        
                        {Object.values(category.subcategories || {}).map((subcategory: any, subIndex: number) => {
                          const subcategorySkills = getSubcategorySkills(categoryId, subcategory.id || '', skills);
                          const isSubSelected = selectedSubcategory === subcategory.id;
                          
                          return (
                            <Link
                              key={subcategory.id}
                              href={`/category/${categoryId}?sub=${subcategory.id}`}
                              onClick={() => success()}
                              className={`group px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                                isSubSelected
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-gray-200/60 dark:border-gray-700/60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{subcategory.icon}</span>
                                  <span className="font-medium">{subcategory.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[11px] ${
                                    isSubSelected
                                      ? 'text-white/80'
                                      : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {subcategorySkills.length}
                                  </span>
                                  <ChevronRight className={`w-4 h-4 ${
                                    isSubSelected
                                      ? 'text-white/80'
                                      : 'text-gray-400 group-hover:translate-x-0.5 transition-transform'
                                  }`} />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
