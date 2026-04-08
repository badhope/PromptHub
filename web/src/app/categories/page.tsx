'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useI18nContext } from '@/components/I18nProvider';
import { MULTI_LEVEL_CATEGORY_SYSTEM } from '@/lib/category-system';
import type { Category, Subcategory } from '@/types/skill';

const LazyBackground = dynamic(() => import('@/components/AnimatedBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
});

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  language: string;
}

function CategoryCard({ category, isSelected, onClick, language }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-full p-6 sm:p-8 rounded-2xl transition-all duration-300 cursor-pointer
        backdrop-blur-xl border-2 text-left
        min-h-[180px] sm:min-h-[200px]
        ${isSelected 
          ? 'bg-white/25 border-white/50 shadow-2xl scale-105' 
          : 'bg-white/15 border-white/30 hover:bg-white/20 hover:border-white/40 hover:shadow-xl'
        }
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className={`
            w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-4xl
            bg-gradient-to-br ${category.gradient} shadow-lg
            transition-transform duration-300 ${isHovered ? 'scale-110' : ''}
          `}>
            {category.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {language === 'zh-CN' ? category.name : category.name_en}
            </h3>
            <p className="text-sm text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {Array.isArray(category.subcategories) 
                ? category.subcategories.length 
                : Object.keys(category.subcategories || {}).length
              } {language === 'zh-CN' ? '个子类' : 'subcategories'}
            </p>
          </div>
        </div>
        
        <p className="text-sm sm:text-base text-white font-semibold leading-relaxed flex-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {category.description}
        </p>
        
        {isSelected && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

interface SubcategoryCardProps {
  subcategory: Subcategory;
  categoryId: string;
  language: string;
}

function SubcategoryCard({ subcategory, categoryId, language }: SubcategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/category/${categoryId}?sub=${subcategory.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block p-5 sm:p-6 bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl
        hover:bg-white/20 hover:border-white/40 hover:shadow-lg transition-all duration-300
        min-h-[140px] sm:min-h-[160px]"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`
          w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-2xl sm:text-3xl
          bg-gradient-to-br from-white/20 to-white/10
          transition-transform duration-300 ${isHovered ? 'scale-110' : ''}
        `}>
          {subcategory.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-base sm:text-lg font-bold text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {language === 'zh-CN' ? subcategory.name : subcategory.name_en}
          </h4>
          {subcategory.skills && subcategory.skills.length > 0 && (
            <p className="text-xs text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {subcategory.skills.length} {language === 'zh-CN' ? '个技能' : 'skills'}
            </p>
          )}
        </div>
      </div>
      
      <p className="text-sm text-white font-semibold leading-relaxed line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        {subcategory.description}
      </p>
    </Link>
  );
}

export default function CategoriesPage() {
  const { language } = useI18nContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = Object.values(MULTI_LEVEL_CATEGORY_SYSTEM);
  
  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      (category.name_en?.toLowerCase().includes(query) ?? false) ||
      (category.description?.toLowerCase().includes(query) ?? false) ||
      (Array.isArray(category.subcategories) 
        ? category.subcategories.some(sub => 
            sub.name.toLowerCase().includes(query) ||
            (sub.name_en?.toLowerCase().includes(query) ?? false) ||
            (sub.description?.toLowerCase().includes(query) ?? false)
          )
        : Object.values(category.subcategories || {}).some(sub => 
            sub.name.toLowerCase().includes(query) ||
            (sub.name_en?.toLowerCase().includes(query) ?? false) ||
            (sub.description?.toLowerCase().includes(query) ?? false)
          )
      )
    );
  });

  const selectedCategoryData = selectedCategory 
    ? categories.find(c => c.id === selectedCategory) 
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LazyBackground />
      
      <div className="relative z-10">
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link 
              href="/" 
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'zh-CN' ? '返回首页' : 'Back to Home'}
            </Link>
            
            <div 
              className={`transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                {language === 'zh-CN' ? '技能分类导航' : 'Skill Categories'}
              </h1>
              <p className="text-lg sm:text-xl text-white/95 font-medium max-w-2xl">
                {language === 'zh-CN' 
                  ? '探索丰富的技能类别，找到最适合您的AI助手'
                  : 'Explore diverse skill categories to find the perfect AI assistant for you'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div 
            className={`mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'zh-CN' ? '搜索分类或技能...' : 'Search categories or skills...'}
                  className="w-full px-6 py-4 bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-2xl
                    text-white placeholder-white/60 font-medium
                    focus:outline-none focus:border-white/50 focus:bg-white/20
                    transition-all duration-300"
                />
                <svg 
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <Link
                href="/custom"
                className="px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-2 border-white/30 text-white rounded-2xl font-semibold hover:from-purple-500/30 hover:to-pink-500/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{language === 'zh-CN' ? '自定义技能' : 'Custom Skills'}</span>
              </Link>
            </div>
          </div>

          <div 
            className={`mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                {language === 'zh-CN' ? '技能大类' : 'Main Categories'}
              </h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-white/25 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                {language === 'zh-CN' ? '全部显示' : 'Show All'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                  language={language}
                />
              ))}
            </div>
          </div>

          {selectedCategoryData && (
            <div 
              className={`transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  bg-gradient-to-br ${selectedCategoryData.gradient} shadow-lg`}>
                  {selectedCategoryData.icon}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                    {language === 'zh-CN' ? selectedCategoryData.name : selectedCategoryData.name_en}
                  </h2>
                  <p className="text-sm text-white/80 font-medium">
                    {selectedCategoryData.subcategories.length} {language === 'zh-CN' ? '个子类' : 'subcategories'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {selectedCategoryData.subcategories.map((subcategory) => (
                  <SubcategoryCard
                    key={subcategory.id}
                    subcategory={subcategory}
                    categoryId={selectedCategoryData.id}
                    language={language}
                  />
                ))}
              </div>
            </div>
          )}

          {!selectedCategory && (
            <div 
              className={`transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 drop-shadow-lg">
                  {language === 'zh-CN' ? '💡 使用提示' : '💡 Usage Tips'}
                </h3>
                <div className="space-y-3 text-white/90 font-medium">
                  <p className="flex items-start gap-2">
                    <span className="text-white/60">1.</span>
                    <span>
                      {language === 'zh-CN' 
                        ? '点击上方分类卡片查看该类别下的所有子类'
                        : 'Click on a category card above to view all subcategories'}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-white/60">2.</span>
                    <span>
                      {language === 'zh-CN' 
                        ? '使用搜索框快速查找您需要的技能分类'
                        : 'Use the search box to quickly find the skill category you need'}
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-white/60">3.</span>
                    <span>
                      {language === 'zh-CN' 
                        ? '点击子类卡片进入该分类的技能列表页面'
                        : 'Click on a subcategory card to enter the skill list page'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
