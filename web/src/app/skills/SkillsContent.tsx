'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SkillCard from '@/components/SkillCard';
import type { SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';
import { usePreferences } from '@/hooks/usePreferences';
import { useI18nContext } from '@/components/I18nProvider';

function getInitialUrlState(searchParams: URLSearchParams) {
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort');
  const q = searchParams.get('q') || '';
  
  const validSort = sort && ['popular', 'newest', 'rating', 'name'].includes(sort) 
    ? sort as 'popular' | 'newest' | 'rating' | 'name'
    : 'popular' as const;
  
  return { category, sort: validSort, q };
}

export default function SkillsContent() {
  const { t, language } = useI18nContext();
  const { skills } = skillsData as SkillsData;
  const searchParams = useSearchParams();
  const { preferences, isLoaded: prefsLoaded } = usePreferences();
  
  const CATEGORY_OPTIONS: Record<string, string> = {
    all: t('skills.allCategories'),
    functional: t('skills.functional'),
    professional: t('skills.professional'),
    creative: t('skills.creative'),
    character: t('skills.character'),
    fiction: t('skills.fiction')
  };

  const SORT_OPTIONS = [
    { value: 'popular', label: t('skills.popular') },
    { value: 'newest', label: t('skills.newest') },
    { value: 'rating', label: t('skills.rating') },
    { value: 'name', label: t('skills.name') }
  ];
  
  const urlState = getInitialUrlState(searchParams);
  const [selectedCategory, setSelectedCategory] = useState(urlState.category);
  
  const defaultSort = useMemo(() => {
    return prefsLoaded ? preferences.defaultSort : urlState.sort;
  }, [prefsLoaded, preferences.defaultSort, urlState.sort]);
  
  const defaultView = useMemo(() => {
    return prefsLoaded ? preferences.defaultView : 'grid';
  }, [prefsLoaded, preferences.defaultView]);
  
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'name'>(defaultSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [searchQuery, setSearchQuery] = useState(urlState.q);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSkills = useMemo(() => {
    let result = [...skills];

    if (selectedCategory !== 'all') {
      result = result.filter(
        s => s.categorization.primary_category === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(query) ||
             s.metadata.description.toLowerCase().includes(query) ||
             s.categorization.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => {
          const diff = b.stats.use_count - a.stats.use_count;
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'newest':
        result.sort((a, b) => {
          const diff = new Date(b.metadata.updated_at).getTime() - new Date(a.metadata.updated_at).getTime();
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'rating':
        result.sort((a, b) => {
          const diff = b.stats.rating - a.stats.rating;
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
        break;
    }

    return result;
  }, [skills, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredSkills.length / preferences.itemsPerPage);
  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * preferences.itemsPerPage;
    return filteredSkills.slice(start, start + preferences.itemsPerPage);
  }, [filteredSkills, currentPage, preferences.itemsPerPage]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('skills.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {language === 'zh-CN' ? '共找到' : 'Found'} {filteredSkills.length} {language === 'zh-CN' ? '个技能' : 'skills'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <input
                type="text"
                placeholder={t('skills.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                {Object.entries(CATEGORY_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => {
                  const value = e.target.value;
                  if (['popular', 'newest', 'rating', 'name'].includes(value)) {
                    setSortBy(value as 'popular' | 'newest' | 'rating' | 'name');
                  }
                  setCurrentPage(1);
                }}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{language === 'zh-CN' ? '视图：' : 'View:'}</span>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  ⊞ {language === 'zh-CN' ? '网格' : 'Grid'}
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  ☰ {language === 'zh-CN' ? '列表' : 'List'}
                </button>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {language === 'zh-CN' ? '显示' : 'Showing'} {(currentPage - 1) * preferences.itemsPerPage + 1} - {Math.min(currentPage * preferences.itemsPerPage, filteredSkills.length)} / {language === 'zh-CN' ? '共' : 'of'} {filteredSkills.length} {language === 'zh-CN' ? '个结果' : 'results'}
            </div>
          </div>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="text-center py-12 sm:py-16 animate-fade-in">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('skills.noResults')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('skills.tryDifferent')}</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginatedSkills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {paginatedSkills.map(skill => (
                  <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{skill.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">{skill.metadata.description}</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                          {skill.categorization.tags.slice(0, 5).map(tag => (
                            <span key={tag} className="px-2 py-0.5 sm:py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            ⭐ {skill.stats.rating.toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            🔥 {skill.stats.use_count} {language === 'zh-CN' ? '次使用' : 'uses'}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {CATEGORY_OPTIONS[skill.categorization.primary_category]}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/skills/${skill.id}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap w-full sm:w-auto text-center"
                      >
                        {language === 'zh-CN' ? '查看详情' : 'View Details'} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ← {language === 'zh-CN' ? '上一页' : 'Previous'}
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors text-sm ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {language === 'zh-CN' ? '下一页' : 'Next'} →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
