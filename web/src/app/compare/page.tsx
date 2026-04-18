'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import type { Skill } from '@/types/skill';
import { useSkills } from '@/hooks/useSkills';
import { getCategoryIcon, getCategoryName } from '@/lib/categories';

const MAX_COMPARE = 4;

interface CompareItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  useCount: number;
  favoriteCount: number;
  mobileOptimized: boolean;
  bestFor: string[];
  tags: string[];
  attributes: {
    entertainment: number;
    professional: number;
    education: number;
  };
}

function convertToCompareItem(skill: Skill): CompareItem {
  return {
    id: skill.id,
    name: skill.name,
    category: skill.categorization.primary_category,
    rating: skill.stats.rating,
    useCount: skill.stats.use_count,
    favoriteCount: skill.stats.favorite_count,
    mobileOptimized: skill.capabilities?.mobile_optimized ?? false,
    bestFor: skill.capabilities?.best_for ?? [],
    tags: skill.categorization.tags,
    attributes: (skill.categorization.attributes ?? { entertainment: 0, professional: 0, education: 0 }) as { entertainment: number; professional: number; education: number }
  };
}

import { getValidatedCompareIds } from '@/lib/validation';

function getInitialState() {
  if (typeof window === 'undefined') return { selectedIds: [], mounted: false };
  return {
    selectedIds: getValidatedCompareIds(),
    mounted: true
  };
}

export default function ComparePage() {
  const { data: skills, status } = useSkills();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialState = getInitialState();
    setSelectedIds(initialState.selectedIds);
  }, []);

  void status;
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('compare-skills', JSON.stringify(selectedIds));
    } catch (error) {
      console.warn('Failed to save compare skills:', error);
    }
  }, [selectedIds]);

  const filteredSkills = useMemo(() => {
    let result = (skills || []).filter(s => !selectedIds.includes(s.id));
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.metadata.description?.toLowerCase().includes(query)
      );
    }
    
    if (categoryFilter) {
      result = result.filter(s => s.categorization.primary_category === categoryFilter);
    }
    
    return result.slice(0, 12);
  }, [skills, selectedIds, searchQuery, categoryFilter]);

  const selectedSkills = useMemo(() => {
    return skills.filter(s => selectedIds.includes(s.id)).map(convertToCompareItem);
  }, [skills, selectedIds]);

  const addSkill = (id: string) => {
    if (selectedIds.length < MAX_COMPARE && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeSkill = (id: string) => {
    setSelectedIds(selectedIds.filter(sid => sid !== id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const getBestValue = (key: keyof Pick<CompareItem, 'rating' | 'useCount' | 'favoriteCount'>) => {
    if (selectedSkills.length === 0) return null;
    const values = selectedSkills.map(s => s[key]);
    return Math.max(...values);
  };

  const bestRating = getBestValue('rating');
  const bestUseCount = getBestValue('useCount');
  const bestFavoriteCount = getBestValue('favoriteCount');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: '首页', href: '/' },
            { label: '技能对比' }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl">⚖️</span>
            <div>
              <h1 className="text-4xl font-bold">技能对比</h1>
              <p className="text-white/80 mt-2">选择多个技能进行特性对比，最多支持 {MAX_COMPARE} 个技能</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedSkills.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                已选择 {selectedSkills.length}/{MAX_COMPARE} 个技能
              </h2>
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                清空选择
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 w-40">
                        对比项
                      </th>
                      {selectedSkills.map(skill => (
                        <th key={skill.id} className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white min-w-[200px]">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-lg flex-shrink-0">{getCategoryIcon(skill.category)}</span>
                              <span className="truncate">{skill.name}</span>
                            </div>
                            <button
                              onClick={() => removeSkill(skill.id)}
                              className="text-gray-400 hover:text-red-500 flex-shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">分类</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                            {getCategoryName(skill.category)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">评分</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-semibold ${skill.rating === bestRating ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                              {skill.rating.toFixed(1)}
                            </span>
                            <span className="text-yellow-500">⭐</span>
                            {skill.rating === bestRating && selectedSkills.length > 1 && (
                              <span className="text-xs text-green-600 dark:text-green-400">最高</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">使用次数</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-semibold ${skill.useCount === bestUseCount ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                              {skill.useCount.toLocaleString()}
                            </span>
                            {skill.useCount === bestUseCount && selectedSkills.length > 1 && (
                              <span className="text-xs text-green-600 dark:text-green-400">最高</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">收藏数</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-semibold ${skill.favoriteCount === bestFavoriteCount ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                              {skill.favoriteCount.toLocaleString()}
                            </span>
                            {skill.favoriteCount === bestFavoriteCount && selectedSkills.length > 1 && (
                              <span className="text-xs text-green-600 dark:text-green-400">最高</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">移动端优化</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          {skill.mobileOptimized ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              ✅ 支持
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              ❌ 不支持
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">娱乐属性</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-pink-500 h-2 rounded-full" 
                              style={{ width: `${skill.attributes.entertainment * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.round(skill.attributes.entertainment * 100)}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">专业属性</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${skill.attributes.professional * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.round(skill.attributes.professional * 100)}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">教育属性</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${skill.attributes.education * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.round(skill.attributes.education * 100)}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">标签</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {skill.tags.slice(0, 5).map(tag => (
                              <span 
                                key={tag} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                            {skill.tags.length > 5 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{skill.tags.length - 5}
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">操作</td>
                      {selectedSkills.map(skill => (
                        <td key={skill.id} className="px-4 py-3">
                          <Link
                            href={`/skills/${skill.id}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                          >
                            查看详情
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            添加技能进行对比
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索技能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">全部分类</option>
                {Object.entries({
                  functional: '功能型',
                  professional: '专业型',
                  creative: '创意型',
                  character: '角色型',
                  fiction: '虚构世界'
                }).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedIds.length >= MAX_COMPARE && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ 已达到最大对比数量（{MAX_COMPARE}个），请移除部分技能后再添加。
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map(skill => (
              <button
                key={skill.id}
                onClick={() => addSkill(skill.id)}
                disabled={selectedIds.length >= MAX_COMPARE}
                className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getCategoryIcon(skill.categorization.primary_category)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {skill.metadata.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-yellow-500">⭐ {skill.stats.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.stats.use_count.toLocaleString()} 次使用
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-500 dark:text-gray-400">
                没有找到匹配的技能
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
