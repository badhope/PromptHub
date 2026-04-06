'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MULTI_LEVEL_CATEGORY_SYSTEM, getCategorySkills, getSubcategorySkills } from '@/lib/category-system';
import type { Skill } from '@/types/skill';

interface CategoryNavigationProps {
  skills: Skill[];
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

  const handleCategoryClick = (categoryId: string) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📂</span>
          多级分类导航
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Object.entries(MULTI_LEVEL_CATEGORY_SYSTEM).map(([categoryId, category]) => {
          const isExpanded = expandedCategory === categoryId;
          const categorySkills = getCategorySkills(categoryId, skills);
          const isSelected = selectedCategory === categoryId;
          
          return (
            <div key={categoryId} className="animate-fade-in">
              <button
                onClick={() => handleCategoryClick(categoryId)}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${category.gradient}`}>
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {categorySkills.length} 个技能 · {category.subcategories.length} 个子类
                    </div>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isExpanded && (
                <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 animate-slide-down">
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Link
                      href={`/category/${categoryId}`}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !selectedSubcategory && isSelected
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>全部 {category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {categorySkills.length}
                        </span>
                      </div>
                    </Link>
                    
                    {category.subcategories.map(subcategory => {
                      const subcategorySkills = getSubcategorySkills(categoryId, subcategory.id, skills);
                      const isSubSelected = selectedSubcategory === subcategory.id;
                      
                      return (
                        <Link
                          key={subcategory.id}
                          href={`/category/${categoryId}?sub=${subcategory.id}`}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            isSubSelected
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{subcategory.icon}</span>
                              <span>{subcategory.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {subcategorySkills.length}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
