'use client';

import { useState, useEffect } from 'react';
import AIToolCard from '@/components/AIToolCard';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  guide: string;
  scenarios: string[];
  activation: string;
  rawUrl?: string;
}

export default function AIToolsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [data, setData] = useState<{ categories: Category[]; tools: Tool[] }>({
    categories: [],
    tools: []
  });

  useEffect(() => {
    setMounted(true);
    fetch('/ai-tools.json')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('加载AI工具数据失败:', err));
    
    const saved = localStorage.getItem('ai-tools-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-tools-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  let displayTools = data.tools;
  
  if (activeCategory === 'favorites') {
    displayTools = data.tools.filter(t => favorites.includes(t.id));
  } else {
    displayTools = data.tools.filter(t => {
      const matchCategory = !activeCategory || t.category === activeCategory;
      const matchSearch = !searchQuery || (
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.scenarios.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return matchCategory && matchSearch;
    });
  }

  const sortedTools = [...displayTools].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;
    return bFav - aFav;
  });

  const activeCategoryInfo = activeCategory && activeCategory !== 'favorites'
    ? data.categories.find(c => c.id === activeCategory)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className={`transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mb-4">
              AI 工具库
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              精选实用AI工具，一键复制专业提示词，立刻激活AI超能力
            </p>
          </div>
        </div>

        <div className={`mb-6 transition-all duration-500 delay-100 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 搜索工具名称、功能或场景..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-14 text-base border-2 border-gray-200 rounded-2xl
                  focus:border-black focus:outline-none focus:ring-4 focus:ring-gray-100
                  transition-all duration-200 bg-white"
            />
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-500">
              🔍 找到 <span className="font-bold text-black">{sortedTools.length}</span> 个相关工具
            </div>
          )}
        </div>

        <div className={`mb-10 transition-all duration-500 delay-150 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-bold text-gray-700">分类筛选:</span>
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                !activeCategory
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⭐ 全部
            </button>
            <button
              onClick={() => setActiveCategory('favorites')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeCategory === 'favorites'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ❤️ 收藏 ({favorites.length})
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {data.categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(
                  activeCategory === category.id ? null : category.id
                )}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ transitionDelay: `${index * 20}ms` }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {activeCategoryInfo && (
            <div className="mt-4 p-4 sm:p-6 bg-black rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{activeCategoryInfo.icon}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {activeCategoryInfo.name}
                </h2>
              </div>
              <p className="text-gray-300">{activeCategoryInfo.description}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sortedTools.map((tool, index) => (
            <AIToolCard 
              key={tool.id} 
              tool={tool} 
              index={index}
              isFavorite={favorites.includes(tool.id)}
              onToggleFavorite={() => toggleFavorite(tool.id)}
            />
          ))}
        </div>

        {sortedTools.length === 0 && mounted && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{activeCategory === 'favorites' ? '❤️' : '🔍'}</div>
            <h3 className="text-xl font-bold text-black mb-2">
              {activeCategory === 'favorites' ? '还没有收藏' : '暂无工具'}
            </h3>
            <p className="text-gray-500">
              {activeCategory === 'favorites' 
                ? '点击工具卡片上的❤️收藏常用工具吧'
                : '没有找到匹配的工具，请试试其他关键词或分类'}
            </p>
          </div>
        )}

        <div className={`mt-16 transition-all duration-500 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">📊 工具统计</h2>
              <span className="text-sm text-gray-500">共 {data.tools.length} 个专业工具</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {data.categories.map(cat => {
                const count = data.tools.filter(t => t.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="p-4 bg-white rounded-xl border border-gray-200 hover:border-black 
                        transition-all duration-200 text-left hover:shadow-lg"
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="text-2xl font-black text-black">{count}</div>
                    <div className="text-sm text-gray-500">{cat.name}</div>
                  </button>
                );
              })}
            </div>

            <h3 className="text-lg font-bold text-black mb-4">💡 使用说明</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">选择工具</h3>
                  <p className="text-sm text-gray-600">
                    根据您的需求，选择合适的AI工具类别
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">复制指令</h3>
                  <p className="text-sm text-gray-600">
                    点击复制按钮，复制专业级提示词模板
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-black mb-1">激活AI</h3>
                  <p className="text-sm text-gray-600">
                    粘贴到ChatGPT、Claude等大模型，立即获得专家能力
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="sm:hidden fixed bottom-20 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-black text-white rounded-full shadow-2xl
              flex items-center justify-center active:scale-95 transition-all duration-200"
          title="回到顶部"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        
        <button
          onClick={() => {
            const randomTool = data.tools[Math.floor(Math.random() * data.tools.length)];
            window.location.href = `/tools/${randomTool.id}`;
          }}
          className="w-12 h-12 bg-white text-black border-2 border-black rounded-full shadow-2xl
              flex items-center justify-center active:scale-95 transition-all duration-200"
          title="随机工具"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

    </div>
  );
}
