'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import SkillCard from '@/components/SkillCard';
import Breadcrumb from '@/components/Breadcrumb';
import { usePreferences } from '@/hooks/usePreferences';
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

const DEFAULT_FILTERS: SearchFilters = {
  categories: [],
  minRating: 0,
  minUseCount: 0,
  mobileOptimized: null,
  sortBy: 'rating',
  sortOrder: 'desc'
};

const CATEGORY_OPTIONS = [
  { value: 'functional', label: '功能型', icon: '🛠️' },
  { value: 'professional', label: '专业型', icon: '💼' },
  { value: 'creative', label: '创意型', icon: '🎨' },
  { value: 'character', label: '角色型', icon: '🎭' },
  { value: 'fiction', label: '虚构世界', icon: '📖' }
];

const SORT_OPTIONS = [
  { value: 'popular', label: '热门度' },
  { value: 'newest', label: '最新更新' },
  { value: 'rating', label: '评分' },
  { value: 'name', label: '名称' }
];

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

export default function AdvancedSearchPage() {
  const { skills } = skillsData as SkillsData;
  const { preferences } = usePreferences();

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...DEFAULT_FILTERS,
    sortBy: preferences.defaultSort
  }));
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => getInitialSavedSearches());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchQuery.trim() ||
    filters.categories.length > 0 ||
    filters.minRating > 0 ||
    filters.minUseCount > 0 ||
    filters.mobileOptimized !== null;

  const autoSaveCurrentSearch = useCallback(() => {
    if (!preferences.autoSaveSearch) return;
    if (!hasActiveFilters) return;

    const currentSearch: SavedSearch = {
      id: 'auto-save',
      name: `自动保存 - ${new Date().toLocaleString('zh-CN')}`,
      query: searchQuery,
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
  }, [preferences.autoSaveSearch, searchQuery, filters, hasActiveFilters, savedSearches]);

  useEffect(() => {
    const timer = setTimeout(autoSaveCurrentSearch, 2000);
    return () => clearTimeout(timer);
  }, [searchQuery, filters, autoSaveCurrentSearch]);

  const filteredSkills = useMemo(() => {
    let result = [...skills];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
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
          comparison = a.name.localeCompare(b.name, 'zh');
          break;
      }
      if (comparison === 0) {
        return a.id.localeCompare(b.id);
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [skills, searchQuery, filters]);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters(DEFAULT_FILTERS);
  };

  const saveSearch = () => {
    if (!saveName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveName,
      query: searchQuery,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('saved-searches', JSON.stringify(updated));
    setShowSaveModal(false);
    setSaveName('');
  };

  const loadSearch = (saved: SavedSearch) => {
    setSearchQuery(saved.query);
    setFilters(saved.filters);
  };

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('saved-searches', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: '首页', href: '/' },
            { label: '高级搜索' }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl">🔍</span>
            <div>
              <h1 className="text-4xl font-bold">高级搜索</h1>
              <p className="text-white/80 mt-2">使用多条件筛选找到您需要的技能</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索技能名称、描述、标签或作者..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button
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
                筛选
                {hasActiveFilters && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">!</span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  重置
                </button>
              )}
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                保存
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    分类筛选
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
                    最低评分: {filters.minRating.toFixed(1)}
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
                    最低使用次数: {filters.minUseCount}
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
                    移动端优化
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
                      ✓ 已优化
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, mobileOptimized: prev.mobileOptimized === false ? null : false }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.mobileOptimized === false
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      ✗ 未优化
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    排序方式
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
                    排序顺序
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
                      ↓ 降序
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.sortOrder === 'asc'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      ↑ 升序
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {savedSearches.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              已保存的搜索
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

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            搜索结果
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filteredSkills.length} 个技能)
            </span>
          </h2>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              没有找到匹配的技能
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              试试调整搜索条件或重置筛选器
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
            >
              重置筛选
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill, index) => (
              <div key={skill.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.03}s` }}>
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">保存搜索</h3>
            <input
              type="text"
              placeholder="为这个搜索命名..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveSearch}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
