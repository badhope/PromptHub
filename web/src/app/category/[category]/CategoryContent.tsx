'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SkillCard from '@/components/SkillCard';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryNavigation from '@/components/CategoryNavigation';
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
    return categoryInfo.subcategories.find(s => s.id === subcategoryParam);
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
  
  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center px-4">
          <div className="text-6xl mb-4" role="img" aria-label="搜索图标">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            分类不存在
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            您访问的分类页面不存在或已被移除
          </p>
          <Link 
            href="/skills" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            浏览所有技能
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`bg-gradient-to-r ${categoryInfo.gradient} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb 
            items={[
              { label: '首页', href: '/' },
              { label: '技能', href: '/skills' },
              { label: categoryInfo.name }
            ]} 
          />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl" role="img" aria-label={categoryInfo.name}>{categoryInfo.icon}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {pageTitle}
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base">
                {pageDescription}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-bold text-lg">{displaySkills.length}</span>
              <span className="ml-1">项技能</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-bold text-lg">{totalUseCount.toLocaleString()}</span>
              <span className="ml-1">次使用量</span>
            </div>
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-expanded={showNavigation}
              aria-label={showNavigation ? '隐藏分类导航' : '显示分类导航'}
            >
              <span aria-hidden="true">📂</span>
              <span>{showNavigation ? '隐藏分类导航' : '显示分类导航'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {showNavigation && (
            <div className="lg:col-span-1">
              <CategoryNavigation
                skills={summaries}
                selectedCategory={category}
                selectedSubcategory={subcategoryParam || undefined}
              />
            </div>
          )}
          
          <div className={showNavigation ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedSubcategory ? selectedSubcategory.name : `所有 ${categoryInfo.name} 技能`}
              </h2>
              <Link 
                href="/skills" 
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium text-sm sm:text-base"
              >
                查看全部技能 →
              </Link>
            </div>

            {categoryInfo.subcategories.length > 0 && !showNavigation && (
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  快速筛选子分类
                </h3>
                <div className="flex flex-wrap gap-2" role="group" aria-label="子分类筛选">
                  <Link
                    href={`/category/${category}`}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      !selectedSubcategory
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-current={!selectedSubcategory ? 'page' : undefined}
                  >
                    全部
                  </Link>
                  {categoryInfo.subcategories.map(sub => (
                    <Link
                      key={sub.id}
                      href={`/category/${category}?sub=${sub.id}`}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        selectedSubcategory?.id === sub.id
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      aria-current={selectedSubcategory?.id === sub.id ? 'page' : undefined}
                    >
                      <span aria-hidden="true">{sub.icon}</span>
                      <span className="ml-1">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {sortedSkills.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4" role="img" aria-label="空状态图标">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  暂无技能
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedSubcategory 
                    ? '该子分类下暂无技能内容，我们正在持续更新中，敬请期待！' 
                    : '该分类下暂无技能内容'}
                </p>
                {selectedSubcategory && (
                  <Link
                    href={`/category/${category}`}
                    className="inline-flex items-center px-4 py-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                  >
                    ← 查看全部 {categoryInfo.name} 技能
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSkills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
