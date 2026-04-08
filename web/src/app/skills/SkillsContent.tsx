'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { SkillsSummaryData } from '@/types/skill';
import skillsSummaryData from '@/skills-summary.json';
import { usePreferences } from '@/hooks/usePreferences';
import { useI18nContext } from '@/components/I18nProvider';

const SkillCard = dynamic(() => import('@/components/SkillCard'), {
  loading: () => (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
      <div className="h-4 bg-white/20 rounded w-5/6"></div>
    </div>
  ),
  ssr: false
});

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
  const { summaries } = skillsSummaryData as SkillsSummaryData;
  const searchParams = useSearchParams();
  const { preferences, isLoaded: prefsLoaded } = usePreferences();
  
  const CATEGORY_OPTIONS: Record<string, string> = {
    all: t('skills.allCategories'),
    functional: t('skills.functional'),
    professional: t('skills.professional'),
    creative: t('skills.creative'),
    character: t('skills.character'),
    fiction: t('skills.fiction'),
    tool: t('skills.tool'),
    game: t('skills.game')
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
    let result = [...summaries];

    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(query) ||
             s.description.toLowerCase().includes(query) ||
             s.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => {
          const diff = b.useCount - a.useCount;
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'newest':
        result.sort((a, b) => {
          const diff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'rating':
        result.sort((a, b) => {
          const diff = b.rating - a.rating;
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        });
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
        break;
    }

    return result;
  }, [summaries, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredSkills.length / preferences.itemsPerPage);
  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * preferences.itemsPerPage;
    return filteredSkills.slice(start, start + preferences.itemsPerPage);
  }, [filteredSkills, currentPage, preferences.itemsPerPage]);

  const getCategoryTheme = (category: string) => {
    const themes: Record<string, { bg: string; accent: string; glow: string }> = {
      all: {
        bg: 'from-indigo-500 via-purple-500 to-pink-500',
        accent: 'from-purple-300/40 to-pink-300/30',
        glow: 'from-purple-300/40 to-pink-300/30'
      },
      functional: {
        bg: 'from-indigo-500 via-blue-500 to-cyan-500',
        accent: 'from-indigo-300/40 to-blue-300/30',
        glow: 'from-indigo-300/40 to-cyan-300/30'
      },
      professional: {
        bg: 'from-pink-500 via-rose-500 to-red-500',
        accent: 'from-pink-300/40 to-rose-300/30',
        glow: 'from-pink-300/40 to-red-300/30'
      },
      creative: {
        bg: 'from-cyan-500 via-teal-500 to-emerald-500',
        accent: 'from-cyan-300/40 to-teal-300/30',
        glow: 'from-cyan-300/40 to-emerald-300/30'
      },
      character: {
        bg: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accent: 'from-violet-300/40 to-purple-300/30',
        glow: 'from-violet-300/40 to-fuchsia-300/30'
      },
      fiction: {
        bg: 'from-emerald-500 via-green-500 to-teal-500',
        accent: 'from-emerald-300/40 to-green-300/30',
        glow: 'from-emerald-300/40 to-teal-300/30'
      },
      tool: {
        bg: 'from-amber-500 via-orange-500 to-yellow-500',
        accent: 'from-amber-300/40 to-orange-300/30',
        glow: 'from-amber-300/40 to-yellow-300/30'
      },
      game: {
        bg: 'from-red-500 via-orange-500 to-yellow-500',
        accent: 'from-red-300/40 to-orange-300/30',
        glow: 'from-red-300/40 to-yellow-300/30'
      }
    };
    return themes[category] || themes.all;
  };

  const currentTheme = getCategoryTheme(selectedCategory);

  return (
    <>
      <a href="#main-content" className="skip-link">
        {language === 'zh-CN' ? '跳转到主要内容' : 'Skip to main content'}
      </a>
      
      <div className="min-h-screen relative overflow-hidden" role="application">
        <div className={`fixed inset-0 bg-gradient-to-br ${currentTheme.bg} animate-gradient-shift transition-all duration-700`} aria-hidden="true"></div>
        
        <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${currentTheme.glow} rounded-full blur-3xl animate-float`} style={{ animationDelay: '0s' }}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br ${currentTheme.accent} rounded-full blur-3xl animate-float`} style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-white/20 to-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <main id="main-content" className="relative z-10 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <header className="mb-6 sm:mb-8">
              <nav className="mb-4" aria-label="Breadcrumb">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium drop-shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {language === 'zh-CN' ? '返回首页' : 'Back to Home'}
                </Link>
              </nav>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-xl">
                {t('skills.title')}
              </h1>
              <p className="text-white/95 text-base sm:text-lg font-medium drop-shadow-lg">
                {language === 'zh-CN' ? '共找到' : 'Found'} <span className="text-white font-bold">{filteredSkills.length}</span> {language === 'zh-CN' ? '个技能' : 'skills'}
              </p>
            </header>

            <section 
              className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8"
              aria-label="Search and filter controls"
            >
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <label htmlFor="search-input" className="sr-only">
                    {t('skills.searchPlaceholder')}
                  </label>
                  <input
                    id="search-input"
                    type="text"
                    placeholder={t('skills.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/15 backdrop-blur-sm border-2 border-white/40 rounded-2xl focus:ring-4 focus:ring-white/40 focus:border-white/60 transition-all text-white placeholder-white/60 text-base sm:text-lg font-medium"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <label htmlFor="category-select" className="sr-only">
                      {language === 'zh-CN' ? '选择分类' : 'Select Category'}
                    </label>
                    <select
                      id="category-select"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/15 backdrop-blur-sm border-2 border-white/40 rounded-2xl focus:ring-4 focus:ring-white/40 focus:border-white/60 transition-all text-white text-base sm:text-lg font-medium appearance-none cursor-pointer"
                    >
                      {Object.entries(CATEGORY_OPTIONS).map(([value, label]) => (
                        <option key={value} value={value} className="bg-gray-900 text-white">{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="sort-select" className="sr-only">
                      {language === 'zh-CN' ? '选择排序' : 'Select Sort'}
                    </label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (['popular', 'newest', 'rating', 'name'].includes(value)) {
                          setSortBy(value as 'popular' | 'newest' | 'rating' | 'name');
                        }
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white/15 backdrop-blur-sm border-2 border-white/40 rounded-2xl focus:ring-4 focus:ring-white/40 focus:border-white/60 transition-all text-white text-base sm:text-lg font-medium appearance-none cursor-pointer"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900 text-white">{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-white/30 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/90 font-medium">{language === 'zh-CN' ? '视图：' : 'View:'}</span>
                  <div className="flex gap-1 bg-white/15 backdrop-blur-sm rounded-xl p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white/25 text-white'
                          : 'text-white/80 hover:text-white'
                      }`}
                      aria-label={language === 'zh-CN' ? '网格视图' : 'Grid view'}
                      aria-pressed={viewMode === 'grid'}
                    >
                      ⊞ {language === 'zh-CN' ? '网格' : 'Grid'}
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === 'list'
                          ? 'bg-white/25 text-white'
                          : 'text-white/80 hover:text-white'
                      }`}
                      aria-label={language === 'zh-CN' ? '列表视图' : 'List view'}
                      aria-pressed={viewMode === 'list'}
                    >
                      ☰ {language === 'zh-CN' ? '列表' : 'List'}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-white/90 font-medium">
                  {language === 'zh-CN' ? '显示' : 'Showing'} <span className="text-white font-bold">{(currentPage - 1) * preferences.itemsPerPage + 1} - {Math.min(currentPage * preferences.itemsPerPage, filteredSkills.length)}</span> / {language === 'zh-CN' ? '共' : 'of'} <span className="text-white font-bold">{filteredSkills.length}</span> {language === 'zh-CN' ? '个结果' : 'results'}
                </div>
              </div>
            </section>

            {filteredSkills.length === 0 ? (
              <div className="text-center py-12 sm:py-16 animate-fade-in">
                <div className="text-6xl sm:text-7xl mb-6">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 drop-shadow-lg">{t('skills.noResults')}</h3>
                <p className="text-white/90 text-base sm:text-lg font-medium">{t('skills.tryDifferent')}</p>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                    role="list"
                    aria-label="Skills grid"
                  >
                    {paginatedSkills.map(skill => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                ) : (
                  <div 
                    className="space-y-3 sm:space-y-4"
                    role="list"
                    aria-label="Skills list"
                  >
                    {paginatedSkills.map(skill => (
                      <article key={skill.id} className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 drop-shadow-lg">{skill.name}</h3>
                            <p className="text-white/90 text-sm mb-3 line-clamp-2 font-medium">{skill.description}</p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                              {skill.tags.slice(0, 5).map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-white/90 font-medium">
                              <span className="flex items-center gap-1">
                                ⭐ {skill.rating.toFixed(1)}
                              </span>
                              <span className="flex items-center gap-1">
                                🔥 {skill.useCount} {language === 'zh-CN' ? '次使用' : 'uses'}
                              </span>
                              <span className="px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs">
                                {CATEGORY_OPTIONS[skill.category]}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/skills/${skill.id}`}
                            className="px-6 py-3 bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white rounded-xl hover:bg-white/25 hover:border-white/60 transition-all text-sm font-semibold whitespace-nowrap w-full sm:w-auto text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                            aria-label={language === 'zh-CN' ? `查看 ${skill.name} 详情` : `View ${skill.name} details`}
                          >
                            {language === 'zh-CN' ? '查看详情' : 'View Details'} →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <nav 
                    className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="w-full sm:w-auto px-6 py-3 bg-white/15 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white hover:bg-white/25 hover:border-white/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                      aria-label={language === 'zh-CN' ? '上一页' : 'Previous page'}
                    >
                      ← {language === 'zh-CN' ? '上一页' : 'Previous'}
                    </button>
                    <div className="flex gap-1" role="group" aria-label="Page numbers">
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
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-semibold transition-all text-sm ${
                              currentPage === pageNum
                                ? 'bg-white/25 backdrop-blur-sm border-2 border-white/60 text-white'
                                : 'bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white/90 hover:bg-white/25 hover:text-white'
                            } focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50`}
                            aria-label={language === 'zh-CN' ? `第 ${pageNum} 页` : `Page ${pageNum}`}
                            aria-current={currentPage === pageNum ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="w-full sm:w-auto px-6 py-3 bg-white/15 backdrop-blur-sm border-2 border-white/40 rounded-xl text-white hover:bg-white/25 hover:border-white/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                      aria-label={language === 'zh-CN' ? '下一页' : 'Next page'}
                    >
                      {language === 'zh-CN' ? '下一页' : 'Next'} →
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
