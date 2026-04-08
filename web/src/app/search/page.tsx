'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import SkillCard from '@/components/SkillCard';
import Breadcrumb from '@/components/Breadcrumb';
import { usePreferences } from '@/hooks/usePreferences';
import { useI18nContext } from '@/components/I18nProvider';
import type { SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';

interface SearchFilters {
  categories: string[];
  minRating: number;
  minUseCount: number;
  mobileOptimized: boolean | null;
  sortBy: 'popular' | 'newest' | 'rating' | 'name';
  sortOrder: 'asc' | 'desc';
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: string;
}

interface SearchHistory {
  query: string;
  timestamp: string;
}

const DEFAULT_FILTERS: SearchFilters = {
  categories: [],
  minRating: 0,
  minUseCount: 0,
  mobileOptimized: null,
  sortBy: 'rating',
  sortOrder: 'desc'
};

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48, 96] as const;

function getInitialSavedSearches(): SavedSearch[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('saved-searches');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

function getInitialSearchHistory(): SearchHistory[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('search-history');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return parts.map((part, index) => 
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={index} className="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-white px-0.5 rounded">{part}</mark>
      : part
  );
}

export default function AdvancedSearchPage() {
  const { skills } = skillsData as SkillsData;
  const { preferences } = usePreferences();
  const { language } = useI18nContext();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    sortBy: preferences.defaultSort
  }));
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => getInitialSavedSearches());
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => getInitialSearchHistory());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(preferences.itemsPerPage);

  const CATEGORY_OPTIONS = useMemo(() => [
    { value: 'functional', label: language === 'zh-CN' ? '功能型' : 'Functional', icon: '🛠️' },
    { value: 'professional', label: language === 'zh-CN' ? '专业型' : 'Professional', icon: '💼' },
    { value: 'creative', label: language === 'zh-CN' ? '创意型' : 'Creative', icon: '🎨' },
    { value: 'character', label: language === 'zh-CN' ? '角色型' : 'Character', icon: '🎭' },
    { value: 'fiction', label: language === 'zh-CN' ? '虚构世界' : 'Fiction', icon: '📖' }
  ], [language]);

  const SORT_OPTIONS = useMemo(() => [
    { value: 'popular', label: language === 'zh-CN' ? '热门度' : 'Popular' },
    { value: 'newest', label: language === 'zh-CN' ? '最新更新' : 'Newest' },
    { value: 'rating', label: language === 'zh-CN' ? '评分' : 'Rating' },
    { value: 'name', label: language === 'zh-CN' ? '名称' : 'Name' }
  ], [language]);

  const QUICK_FILTERS = useMemo(() => [
    { label: language === 'zh-CN' ? '高评分' : 'High Rating', filter: { minRating: 4.5 } as Partial<SearchFilters> },
    { label: language === 'zh-CN' ? '热门' : 'Popular', filter: { minUseCount: 1000 } as Partial<SearchFilters> },
    { label: language === 'zh-CN' ? '移动端优化' : 'Mobile Optimized', filter: { mobileOptimized: true } as Partial<SearchFilters> },
    { label: language === 'zh-CN' ? '最新' : 'Newest', filter: { sortBy: 'newest' as const } as Partial<SearchFilters> }
  ], [language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hasActiveFilters = debouncedQuery.trim() ||
    filters.categories.length > 0 ||
    filters.minRating > 0 ||
    filters.minUseCount > 0 ||
    filters.mobileOptimized !== null;

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    const newHistory: SearchHistory = {
      query,
      timestamp: new Date().toISOString()
    };
    
    const updated = [
      newHistory,
      ...searchHistory.filter(h => h.query !== query)
    ].slice(0, 10);
    
    setSearchHistory(updated);
    localStorage.setItem('search-history', JSON.stringify(updated));
  }, [searchHistory]);

  const autoSaveCurrentSearch = useCallback(() => {
    if (!preferences.autoSaveSearch) return;
    if (!hasActiveFilters) return;

    const currentSearch: SavedSearch = {
      id: 'auto-save',
      name: `${language === 'zh-CN' ? '自动保存' : 'Auto-save'} - ${new Date().toLocaleString()}`,
      query: debouncedQuery,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };

    const existing = savedSearches.findIndex(s => s.id === 'auto-save');
    let updated;
    if (existing >= 0) {
      updated = [...savedSearches];
      updated[existing] = currentSearch;
    } else {
      updated = [...savedSearches, currentSearch];
    }

    setSavedSearches(updated);
    localStorage.setItem('saved-searches', JSON.stringify(updated));
  }, [preferences.autoSaveSearch, debouncedQuery, filters, hasActiveFilters, savedSearches, language]);

  useEffect(() => {
    const timer = setTimeout(autoSaveCurrentSearch, 2000);
    return () => clearTimeout(timer);
  }, [debouncedQuery, filters, autoSaveCurrentSearch]);

  const filteredSkills = useMemo(() => {
    let result = [...skills];

    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(query) ||
             s.metadata.description.toLowerCase().includes(query) ||
             s.categorization.tags.some(tag => tag.toLowerCase().includes(query)) ||
             s.metadata.author.toLowerCase().includes(query)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter(s => filters.categories.includes(s.categorization.primary_category));
    }

    if (filters.minRating > 0) {
      result = result.filter(s => s.stats.rating >= filters.minRating);
    }

    if (filters.minUseCount > 0) {
      result = result.filter(s => s.stats.use_count >= filters.minUseCount);
    }

    if (filters.mobileOptimized !== null) {
      result = result.filter(s => s.capabilities.mobile_optimized === filters.mobileOptimized);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'popular':
          comparison = a.stats.use_count - b.stats.use_count;
          break;
        case 'newest':
          comparison = new Date(a.metadata.updated_at).getTime() - new Date(b.metadata.updated_at).getTime();
          break;
        case 'rating':
          comparison = a.stats.rating - b.stats.rating;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name, language === 'zh-CN' ? 'zh' : 'en');
          break;
      }
      if (comparison === 0) {
        return a.id.localeCompare(b.id);
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [skills, debouncedQuery, filters, language]);

  const paginatedSkills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSkills.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSkills, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    skills.forEach(skill => {
      if (skill.name.toLowerCase().includes(query)) {
        suggestions.add(skill.name);
      }
      skill.categorization.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [searchQuery, skills]);

  const searchStats = useMemo(() => {
    const stats = {
      total: skills.length,
      filtered: filteredSkills.length,
      byCategory: {} as Record<string, number>,
      avgRating: 0,
      avgUseCount: 0
    };
    
    filteredSkills.forEach(skill => {
      const cat = skill.categorization.primary_category;
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;
    });
    
    if (filteredSkills.length > 0) {
      stats.avgRating = filteredSkills.reduce((sum, s) => sum + s.stats.rating, 0) / filteredSkills.length;
      stats.avgUseCount = filteredSkills.reduce((sum, s) => sum + s.stats.use_count, 0) / filteredSkills.length;
    }
    
    return stats;
  }, [skills, filteredSkills]);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);

  const saveSearch = useCallback(() => {
    if (!saveName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveName,
      query: debouncedQuery,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('saved-searches', JSON.stringify(updated));
    setShowSaveModal(false);
    setSaveName('');
  }, [saveName, debouncedQuery, filters, savedSearches]);

  const loadSearch = useCallback((saved: SavedSearch) => {
    setSearchQuery(saved.query);
    setDebouncedQuery(saved.query);
    setFilters(saved.filters);
    setShowHistory(false);
  }, []);

  const deleteSearch = useCallback((id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('saved-searches', JSON.stringify(updated));
  }, [savedSearches]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  }, []);

  const applyQuickFilter = useCallback((quickFilter: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...quickFilter }));
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim());
      setShowSuggestions(false);
      setShowHistory(false);
    }
  }, [searchQuery, addToHistory]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setDebouncedQuery(suggestion);
    addToHistory(suggestion);
    setShowSuggestions(false);
    setShowHistory(false);
  }, [addToHistory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: language === 'zh-CN' ? '首页' : 'Home', href: '/' },
            { label: language === 'zh-CN' ? '高级搜索' : 'Advanced Search' }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-4xl sm:text-5xl">🔍</span>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">{language === 'zh-CN' ? '高级搜索' : 'Advanced Search'}</h1>
              <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">
                {language === 'zh-CN' ? '使用多条件筛选找到您需要的技能' : 'Find the skills you need with multiple filters'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={language === 'zh-CN' ? '搜索技能名称、描述、标签或作者...' : 'Search skill name, description, tags or author...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setShowSuggestions(true);
                  if (searchHistory.length > 0) setShowHistory(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSuggestions(false);
                    setShowHistory(false);
                  }, 200);
                }}
                className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white flex items-center gap-3"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>{highlightText(suggestion, searchQuery)}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {showHistory && !searchQuery && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {language === 'zh-CN' ? '搜索历史' : 'Search History'}
                    </span>
                    <button
                      type="button"
                      onMouseDown={clearHistory}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      {language === 'zh-CN' ? '清除' : 'Clear'}
                    </button>
                  </div>
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onMouseDown={() => handleSuggestionClick(item.query)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white flex items-center gap-3"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item.query}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {language === 'zh-CN' ? '筛选' : 'Filter'}
                {hasActiveFilters && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">!</span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-3 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  {language === 'zh-CN' ? '重置' : 'Reset'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {language === 'zh-CN' ? '保存' : 'Save'}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_FILTERS.map((qf, index) => (
              <button
                key={index}
                onClick={() => applyQuickFilter(qf.filter)}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
              >
                {qf.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh-CN' ? '分类筛选' : 'Category Filter'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          filters.categories.includes(cat.value)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh-CN' ? '最低评分' : 'Min Rating'}: {filters.minRating.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh-CN' ? '最低使用次数' : 'Min Use Count'}: {filters.minUseCount}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.minUseCount}
                    onChange={(e) => setFilters(prev => ({ ...prev, minUseCount: parseInt(e.target.value) }))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh-CN' ? '移动端优化' : 'Mobile Optimized'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, mobileOptimized: prev.mobileOptimized === true ? null : true }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.mobileOptimized === true
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      ✓ {language === 'zh-CN' ? '已优化' : 'Optimized'}
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, mobileOptimized: prev.mobileOptimized === false ? null : false }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.mobileOptimized === false
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      ✗ {language === 'zh-CN' ? '未优化' : 'Not Optimized'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh-CN' ? '排序方式' : 'Sort By'}
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh-CN' ? '排序顺序' : 'Sort Order'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.sortOrder === 'desc'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      ↓ {language === 'zh-CN' ? '降序' : 'Desc'}
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.sortOrder === 'asc'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      ↑ {language === 'zh-CN' ? '升序' : 'Asc'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'zh-CN' ? '每页显示' : 'Per Page'}
                  </label>
                  <div className="flex gap-2">
                    {ITEMS_PER_PAGE_OPTIONS.map(count => (
                      <button
                        key={count}
                        onClick={() => setItemsPerPage(count)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          itemsPerPage === count
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {savedSearches.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {language === 'zh-CN' ? '已保存的搜索' : 'Saved Searches'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map(saved => (
                <div key={saved.id} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => loadSearch(saved)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    {saved.name}
                  </button>
                  <button
                    onClick={() => deleteSearch(saved.id)}
                    className="px-2 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchStats.filtered > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'zh-CN' ? '搜索统计' : 'Search Statistics'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {searchStats.filtered}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'zh-CN' ? '匹配结果' : 'Results'}
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {searchStats.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'zh-CN' ? '平均评分' : 'Avg Rating'}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(searchStats.avgUseCount).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'zh-CN' ? '平均使用次数' : 'Avg Uses'}
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {Object.keys(searchStats.byCategory).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'zh-CN' ? '涉及分类' : 'Categories'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'zh-CN' ? '搜索结果' : 'Search Results'}
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filteredSkills.length} {language === 'zh-CN' ? '个技能' : 'skills'})
            </span>
          </h2>
          {totalPages > 1 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'zh-CN' ? '第' : 'Page'} {currentPage} {language === 'zh-CN' ? '页，共' : 'of'} {totalPages} {language === 'zh-CN' ? '页' : ''}
            </div>
          )}
        </div>

        {filteredSkills.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'zh-CN' ? '没有找到匹配的技能' : 'No matching skills found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'zh-CN' ? '试试调整搜索条件或重置筛选器' : 'Try adjusting your search criteria or reset filters'}
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
            >
              {language === 'zh-CN' ? '重置筛选' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedSkills.map((skill, index) => (
                <div key={skill.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.03}s` }}>
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {language === 'zh-CN' ? '上一页' : 'Previous'}
                </button>
                
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
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {language === 'zh-CN' ? '下一页' : 'Next'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'zh-CN' ? '保存搜索' : 'Save Search'}
            </h3>
            <input
              type="text"
              placeholder={language === 'zh-CN' ? '为这个搜索命名...' : 'Name this search...'}
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {language === 'zh-CN' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={saveSearch}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {language === 'zh-CN' ? '保存' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
