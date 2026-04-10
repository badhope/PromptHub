'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SkillCard from '@/components/SkillCard';
import { MULTI_LEVEL_CATEGORY_SYSTEM, getSubcategorySkills } from '@/lib/category-system';
import type { SkillsSummaryData } from '@/types/skill';
import skillsSummaryData from '@/skills-summary.json';

export default function CategoryContent({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const searchParams = useSearchParams();
  const subcategoryParam = searchParams.get('sub');
  const { summaries } = skillsSummaryData as SkillsSummaryData;
  const [showNavigation, setShowNavigation] = useState(false);
  
  const categoryInfo = MULTI_LEVEL_CATEGORY_SYSTEM[category];
  const allCategorySkills = useMemo(() => 
    summaries.filter(s => s.category === category),
    [summaries, category]
  );
  
  const displaySkills = useMemo(() => {
    if (subcategoryParam && categoryInfo) {
      return getSubcategorySkills(category, subcategoryParam, summaries);
    }
    return allCategorySkills;
  }, [category, subcategoryParam, summaries, allCategorySkills, categoryInfo]);
  
  const selectedSubcategory = useMemo(() => {
    if (!subcategoryParam || !categoryInfo) return null;
    const subs = Array.isArray(categoryInfo.subcategories)
      ? categoryInfo.subcategories
      : Object.values(categoryInfo.subcategories || {});
    return subs.find(s => s.id === subcategoryParam);
  }, [subcategoryParam, categoryInfo]);

  const sortedSkills = useMemo(() => {
    return [...displaySkills].sort((a, b) => {
      const aUseCount = 'useCount' in a ? a.useCount : 0;
      const bUseCount = 'useCount' in b ? b.useCount : 0;
      const diff = bUseCount - aUseCount;
      return diff !== 0 ? diff : a.id.localeCompare(b.id);
    });
  }, [displaySkills]);

  const totalUseCount = useMemo(() => {
    return displaySkills.reduce((sum, s) => {
      const useCount = 'useCount' in s ? s.useCount : 0;
      return sum + useCount;
    }, 0);
  }, [displaySkills]);
  
  const subs = categoryInfo ? (
    Array.isArray(categoryInfo.subcategories)
      ? categoryInfo.subcategories
      : Object.values(categoryInfo.subcategories || {})
  ) : [];
  
  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-black mb-4">分类不存在</h1>
          <p className="text-gray-500 mb-8">您访问的分类页面不存在或已被移除</p>
          <Link 
            href="/categories" 
            className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            浏览技能分类
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = selectedSubcategory 
    ? `${categoryInfo.name} - ${selectedSubcategory.name}` 
    : categoryInfo.name;
  const pageDescription = selectedSubcategory 
    ? selectedSubcategory.description 
    : categoryInfo.description;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/categories" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors font-medium text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回分类
          </Link>
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center text-4xl sm:text-5xl">
              {categoryInfo.icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
                {pageTitle}
              </h1>
              <p className="text-gray-400 mt-2 text-base sm:text-lg font-medium">
                {pageDescription}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="bg-white/10 rounded-xl px-6 py-3">
              <span className="font-bold text-xl">{displaySkills.length}</span>
              <span className="ml-2 text-gray-400">项技能</span>
            </div>
            <div className="bg-white/10 rounded-xl px-6 py-3">
              <span className="font-bold text-xl">{totalUseCount.toLocaleString()}</span>
              <span className="ml-2 text-gray-400">次使用</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {subs.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              子分类
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/category/${category}`}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  !selectedSubcategory
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </Link>
              {subs.map(sub => (
                <Link
                  key={sub.id}
                  href={`/category/${category}?sub=${sub.id}`}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedSubcategory?.id === sub.id
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{sub.icon}</span>
                  <span className="ml-2">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
            {selectedSubcategory ? selectedSubcategory.name : `所有 ${categoryInfo.name} 技能`}
          </h2>
        </div>

        {sortedSkills.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-xl font-bold text-black mb-3">暂无技能</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedSubcategory 
                ? '该子分类下暂无技能内容，我们正在持续更新中' 
                : '该分类下暂无技能内容'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
