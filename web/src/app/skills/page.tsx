'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, X, Heart, Filter, SortAsc, SortDesc, Grid, List, Sparkles, Wrench, TrendingUp, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UnifiedSkillCard from '@/components/UnifiedSkillCard';
import { SkillsGridSkeleton, EmptyState } from '@/components/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import type { Skill } from '@/types/skill';
import { useSkills } from '@/hooks/useSkills';
import { useFavorites } from '@/hooks/useFavorites';

type ItemType = 'all' | 'agent' | 'tool';
type SortType = 'trending' | 'newest' | 'most-used' | 'a-z';

const CATEGORIES = [
  { id: 'all', name: '全部', icon: '✨', color: 'from-gray-500 to-gray-600' },
  { id: 'professional', name: '职场效率', icon: '💼', color: 'from-blue-500 to-indigo-600' },
  { id: 'programming', name: '技术开发', icon: '⚡', color: 'from-green-500 to-emerald-600' },
  { id: 'creation', name: '创意内容', icon: '🎨', color: 'from-pink-500 to-rose-600' },
  { id: 'academic', name: '学术科研', icon: '🔬', color: 'from-purple-500 to-violet-600' },
  { id: 'character', name: '角色扮演', icon: '🎭', color: 'from-amber-500 to-orange-600' },
  { id: 'life', name: '生活服务', icon: '🌟', color: 'from-cyan-500 to-teal-600' },
  { id: 'game', name: '娱乐休闲', icon: '🎮', color: 'from-red-500 to-rose-600' },
];

const SORT_OPTIONS: { id: SortType; label: string; icon: any }[] = [
  { id: 'trending', label: '热门推荐', icon: TrendingUp },
  { id: 'most-used', label: '使用最多', icon: Sparkles },
  { id: 'newest', label: '最新上架', icon: Clock },
  { id: 'a-z', label: '名称排序', icon: SortAsc },
];

export default function SkillsHubPage() {
  const { status, skills: allSkills, error, refresh } = useSkills();
  const { favorites, toggleFavorite } = useFavorites();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemType, setItemType] = useState<ItemType>('all');
  const [sortBy, setSortBy] = useState<SortType>('trending');
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('skills-scroll-position');
    if (savedScroll && status === 'success') {
      const scrollY = parseInt(savedScroll, 10);
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'auto' });
      });
    }

    const saveScrollPosition = () => {
      sessionStorage.setItem('skills-scroll-position', String(window.scrollY));
    };

    let scrollTimeout: NodeJS.Timeout;
    const debouncedSave = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveScrollPosition, 100);
    };

    window.addEventListener('scroll', debouncedSave, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedSave);
      clearTimeout(scrollTimeout);
    };
  }, [status]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    searchInputRef.current?.focus();
  }, []);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setItemType('all');
    setShowFavorites(false);
    setSortBy('trending');
    clearSearch();
  };

  const hasActiveFilters = selectedCategory !== 'all' || itemType !== 'all' || showFavorites || debouncedSearch.trim();

  const filteredItems = useMemo(() => {
    let result = [...allSkills];

    if (showFavorites) {
      result = result.filter(s => favorites.includes(s.id));
    }

    if (itemType === 'agent') {
      result = result.filter(s => s.source === 'skill');
    } else if (itemType === 'tool') {
      result = result.filter(s => s.source === 'tool');
    }

    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        (s.description || '').toLowerCase().includes(query) ||
        (s.scenarios || []).some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result.sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 1000000 : 0;
      const bFav = favorites.includes(b.id) ? 1000000 : 0;
      
      switch (sortBy) {
        case 'trending':
          return (bFav + (b.useCount || 0) * Math.random()) - (aFav + (a.useCount || 0) * Math.random());
        case 'most-used':
          return (bFav + (b.useCount || 0)) - (aFav + (a.useCount || 0));
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'a-z':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [allSkills, selectedCategory, itemType, sortBy, debouncedSearch, showFavorites, favorites]);

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return allSkills.length;
    return allSkills.filter(s => s.category === catId).length;
  };

  const agentCount = allSkills.filter(s => s.source === 'skill').length;
  const toolCount = allSkills.filter(s => s.source === 'tool').length;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="animate-pulse">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-200 dark:text-gray-700 mb-2">
                Agent 智能体聚合平台
              </h1>
              <p className="text-lg text-gray-300 dark:text-gray-600">
                正在加载 462 个智能体和工具...
              </p>
            </div>
          </div>
          <SkillsGridSkeleton count={9} />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-8"
        >
          <div className="text-6xl mb-6">💥</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">数据加载失败</h2>
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-left">
            <p className="text-sm text-rose-700 dark:text-rose-400 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error?.message || '未知错误'}</span>
            </p>
          </div>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            重新加载
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Agent 智能体聚合平台
                </span>
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{agentCount}</span> 个五层架构智能体
                <span className="mx-2">·</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{toolCount}</span> 个专业工具
                <span className="mx-2">·</span>
                一键复制拿走
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">共 {filteredItems.length} 个</span>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors"
              >
                {viewMode === 'grid' ? <Grid className="w-4 h-4 text-gray-500" /> : <List className="w-4 h-4 text-gray-500" />}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`搜索 ${allSkills.length} 个智能体和工具...`}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-lg
                focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setShowFavorites(!showFavorites); setItemType('all'); setSelectedCategory('all'); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                showFavorites
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavorites ? 'fill-white' : ''}`} />
              我的收藏
              <span className={`text-sm ${showFavorites ? 'text-white/80' : 'text-gray-400'}`}>
                {favorites.length}
              </span>
            </button>

            <button
              onClick={() => { setItemType(itemType === 'agent' ? 'all' : 'agent'); setShowFavorites(false); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                itemType === 'agent'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              🧠 Agent 智能体
              <span className={`text-sm ${itemType === 'agent' ? 'text-white/80' : 'text-gray-400'}`}>
                {agentCount}
              </span>
            </button>

            <button
              onClick={() => { setItemType(itemType === 'tool' ? 'all' : 'tool'); setShowFavorites(false); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                itemType === 'tool'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              }`}
            >
              <Wrench className="w-4 h-4" />
              🔧 专业工具
              <span className={`text-sm ${itemType === 'tool' ? 'text-white/80' : 'text-gray-400'}`}>
                {toolCount}
              </span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ml-auto ${
                showFilters
                  ? 'bg-gray-900 dark:bg-gray-700 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              筛选
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold text-sm ml-auto"
              >
                <RefreshCw className="w-4 h-4" />
                重置筛选
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden mb-6 overflow-hidden"
            >
              <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setShowFavorites(false); }}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedCategory === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white`
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="text-xl">{cat.icon}</div>
                      <div className="font-bold text-sm mt-1">{cat.name}</div>
                      <div className="text-xs opacity-70">{getCategoryCount(cat.id)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Filter className="w-3 h-3" />
                  分类筛选
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setShowFavorites(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        selectedCategory === cat.id
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium flex-1">{cat.name}</span>
                      <span className={`text-xs font-bold ${
                        selectedCategory === cat.id ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {getCategoryCount(cat.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <SortDesc className="w-3 h-3" />
                  排序方式
                </h3>
                <div className="space-y-1">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all ${
                        sortBy === opt.id
                          ? 'bg-gray-900 dark:bg-gray-700 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <opt.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <motion.div
              layout
              className="hidden lg:flex items-center justify-between mb-6 px-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  找到 <span className="font-bold text-gray-900 dark:text-white">{filteredItems.length}</span> 个结果
                </span>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full font-medium">
                    筛选中
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      sortBy === opt.id
                        ? 'bg-gray-900 dark:bg-gray-700 text-white font-medium'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {filteredItems.length === 0 ? (
                <EmptyState
                  icon="🔍"
                  title="没有找到匹配的智能体"
                  subtitle={`试试换个关键词搜索，或者清除筛选条件看看全部 ${allSkills.length} 个智能体`}
                  action={{ label: '查看全部智能体', onClick: clearAllFilters }}
                />
              ) : (
                <motion.div
                  key="results"
                  layout
                  className={`grid gap-4 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredItems.map((skill: Skill, index: number) => (
                    <motion.div
                      key={skill.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.5) }}
                    >
                      <UnifiedSkillCard
                        skill={skill}
                        viewMode={viewMode}
                        isFavorite={favorites.includes(skill.id)}
                        onToggleFavorite={() => toggleFavorite(skill.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
