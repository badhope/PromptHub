'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18nContext } from '@/components/I18nProvider';
import { MULTI_LEVEL_CATEGORY_SYSTEM } from '@/lib/category-system';

export default function CategoriesPage() {
  const { language } = useI18nContext();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = Object.values(MULTI_LEVEL_CATEGORY_SYSTEM);
  
  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return category.name.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'zh-CN' ? '返回首页' : 'Back to Home'}
          </Link>
          
          <div 
            className={`transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
              {language === 'zh-CN' ? '技能分类导航' : 'Skill Categories'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl font-medium">
              {language === 'zh-CN' 
                ? '探索丰富的技能类别，找到最适合您的AI助手'
                : 'Explore diverse skill categories to find the perfect AI assistant for you'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mb-12">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={language === 'zh-CN' ? '搜索分类...' : 'Search categories...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black focus:ring-4 focus:ring-gray-100 transition-all duration-200 outline-none text-base font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => {
            const subs = Array.isArray(category.subcategories)
              ? category.subcategories
              : Object.values(category.subcategories || {});

            return (
              <div
                key={category.id}
                className={`group transition-all duration-500 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="h-full bg-white border border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
                    
                  <div className="flex items-center gap-5 mb-6">
                    <Link href={`/category/${category.id}`} className="hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-3xl">
                        <span className="text-white">{category.icon}</span>
                      </div>
                    </Link>
                    <div>
                      <Link href={`/category/${category.id}`}>
                        <h3 className="text-2xl font-bold text-black mb-1 hover:opacity-70 transition-opacity">
                          {language === 'zh-CN' ? category.name : category.name_en}
                        </h3>
                      </Link>
                      <p className="text-sm font-semibold text-gray-500">
                        {subs.length} {language === 'zh-CN' ? '个子分类' : 'subcategories'}
                      </p>
                    </div>
                  </div>
                    
                  <Link href={`/category/${category.id}`}>
                    <p className="text-base text-gray-600 leading-relaxed mb-8 font-medium hover:text-gray-800 transition-colors">
                      {category.description}
                    </p>
                  </Link>
                    
                  <div className="space-y-3 mb-8">
                    {subs.slice(0, 4).map(sub => (
                      <Link
                        key={sub.id}
                        href={`/category/${category.id}?sub=${sub.id}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group/sub"
                      >
                        <span className="text-xl">{sub.icon}</span>
                        <span className="text-sm font-semibold text-gray-700 group-hover/sub:text-black">
                          {language === 'zh-CN' ? sub.name : sub.name_en}
                        </span>
                      </Link>
                    ))}
                    {subs.length > 4 && (
                      <div className="text-sm font-semibold text-gray-400 pl-1">
                        + {subs.length - 4} {language === 'zh-CN' ? '更多子分类' : 'more subcategories'}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <Link href={`/category/${category.id}`} className="flex items-center justify-between group/card">
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-wider group-hover/card:text-black transition-colors">
                        {language === 'zh-CN' ? '查看全部' : 'View All'}
                      </span>
                      <svg className="w-5 h-5 text-gray-400 group-hover/card:translate-x-1 group-hover/card:text-black transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
