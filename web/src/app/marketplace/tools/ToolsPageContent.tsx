'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Heart, LayoutGrid, List, Filter, ArrowRight, Wrench, Clock, ChevronDown, ExternalLink, Plug } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useFavorites } from '@/hooks/useFavorites';
import type { Skill } from '@/types/skill';

const CATEGORIES = [
  { id: 'all', label: '全部', icon: LayoutGrid },
  { id: 'filesystem', label: '文件系统', icon: Wrench },
  { id: 'database', label: '数据库', icon: Wrench },
  { id: 'network', label: '网络请求', icon: Wrench },
  { id: 'system', label: '系统操作', icon: Wrench },
  { id: 'media', label: '媒体处理', icon: Wrench },
];

export default function ToolsPageContent() {
  const { skills: allSkills, status } = useSkills();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 200);

  useEffect(() => {
    let scrollTimeout: number;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        setIsScrolled(window.scrollY > 50);
      }, 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const filteredItems = useMemo(() => {
    console.log('Tools - 总数据:', allSkills.length);
    let result = allSkills.filter(s => s.source === 'tool');
    if (showFavorites) {
      result = result.filter(s => favorites.includes(s.id));
    }
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query)
      );
    }
    return result;
  }, [allSkills, showFavorites, selectedCategory, debouncedSearch, favorites]);

  const {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    totalCount,
    visibleCount,
    observerTarget
  } = useInfiniteScroll({ items: filteredItems, initialLoadCount: 24, batchSize: 12 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
      <div className={`sticky top-16 z-30 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <Plug className="w-3 h-3 mr-1" />
                  MCP 工具
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  已加载 {visibleCount}/{totalCount}
                </span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                MCP 工具市场
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">模型上下文协议工具，打通 AI 与真实世界的能力</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  showFavorites
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <Heart className="w-4 h-4 inline mr-1" fill={showFavorites ? 'currentColor' : 'none'} />
                收藏
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具名称、能力、协议..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                {CATEGORIES.find(c => c.id === selectedCategory)?.label || '分类'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50 py-2 overflow-hidden"
                >
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setIsFilterOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center justify-between transition-colors ${
                        selectedCategory === cat.id ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : ''
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {status === 'loading' && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">正在加载工具数据...</p>
            </div>
          </div>
        )}
        
        {(status === 'ready' || filteredItems.length > 0) && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleItems.map((skill: Skill, index: number) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.5) }}
                  className="group relative rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/50 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(skill.id); }}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${favorites.includes(skill.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                        />
                      </button>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                      {skill.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {skill.useCount?.toLocaleString()} 次安装
                        </span>
                      </div>
                      <Link
                        href={`/skills/${skill.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                      >
                        安装
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-10">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                      加载中...
                    </>
                  ) : (
                    <>加载更多 <ExternalLink className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">未找到匹配的工具</h3>
                <p className="text-sm text-gray-500">试试其他关键词或筛选条件</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
