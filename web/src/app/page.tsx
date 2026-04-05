'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SkillCard from '@/components/SkillCard';
import { CategoryGridSkeleton, StatCardSkeleton } from '@/components/Skeleton';
import { OrganizationJsonLd, WebSiteJsonLd, ItemListJsonLd } from '@/components/JsonLd';
import { useI18nContext } from '@/components/I18nProvider';
import type { SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';

const CATEGORY_INFO: Record<string, { icon: string; color: string; gradient: string }> = {
  functional: { icon: '🛠️', color: 'bg-indigo-500', gradient: 'from-indigo-500 to-purple-500' },
  professional: { icon: '💼', color: 'bg-pink-500', gradient: 'from-pink-500 to-rose-500' },
  creative: { icon: '🎨', color: 'bg-cyan-500', gradient: 'from-cyan-500 to-blue-500' },
  character: { icon: '🎭', color: 'bg-pink-400', gradient: 'from-pink-400 to-purple-400' },
  fiction: { icon: '📖', color: 'bg-green-500', gradient: 'from-green-500 to-emerald-500' }
};

export default function Home() {
  const { t, language } = useI18nContext();
  const { skills, categories } = skillsData as SkillsData;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const { hotSkills, newSkills, stats } = useMemo(() => {
    const sortedByPopular = [...skills].sort((a, b) => {
      const diff = b.stats.use_count - a.stats.use_count;
      return diff !== 0 ? diff : a.id.localeCompare(b.id);
    });
    const hot = sortedByPopular.slice(0, 8);

    const sortedByNew = [...skills].sort((a, b) => {
      const diff = new Date(b.metadata.updated_at).getTime() - new Date(a.metadata.updated_at).getTime();
      return diff !== 0 ? diff : a.id.localeCompare(b.id);
    });
    const newest = sortedByNew.slice(0, 8);

    const totalUseCount = skills.reduce((sum, s) => sum + s.stats.use_count, 0);
    const avgRating = (skills.reduce((sum, s) => sum + s.stats.rating, 0) / skills.length).toFixed(1);

    return {
      hotSkills: hot,
      newSkills: newest,
      stats: {
        total: skills.length,
        categories: Object.keys(categories).length,
        useCount: totalUseCount,
        avgRating
      }
    };
  }, [skills, categories]);

  const categoryNames: Record<string, string> = {
    functional: t('skills.functional'),
    professional: t('skills.professional'),
    creative: t('skills.creative'),
    character: t('skills.character'),
    fiction: t('skills.fiction')
  };

  return (
    <div className="min-h-screen">
      <OrganizationJsonLd
        name="Mobile Skills"
        url="https://badhope.github.io/mobile-skills/"
        description={language === 'zh-CN' ? 'AI Skill 生态系统，提供丰富的 AI 角色和技能，让 AI 变得更有用、更有趣。' : 'AI Skill Ecosystem providing rich AI roles and skills, making AI more useful and fun.'}
      />
      <WebSiteJsonLd
        name="Mobile Skills - AI Skill 生态系统"
        url="https://badhope.github.io/mobile-skills/"
        description={language === 'zh-CN' ? 'AI Skill 生态系统，提供丰富的 AI 角色和技能，让 AI 变得更有用、更有趣。' : 'AI Skill Ecosystem providing rich AI roles and skills, making AI more useful and fun.'}
        potentialAction={{
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://badhope.github.io/mobile-skills/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }}
      />
      <ItemListJsonLd
        name={language === 'zh-CN' ? '热门 AI 技能' : 'Hot AI Skills'}
        items={hotSkills.map((skill, index) => ({
          name: skill.name,
          url: `https://badhope.github.io/mobile-skills/skills/${skill.id}`,
          position: index + 1,
          description: skill.metadata.description
        }))}
      />
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.05%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%27')"
        }}></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
              {t('home.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-indigo-100 mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.1s' }}>
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/skills"
                className="bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {t('home.browseAll')}
              </Link>
              <a
                href="https://github.com/badhope/mobile-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300"
              >
                {t('home.github')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
            {t('home.categories')}
          </h2>
          {!isLoaded ? (
            <CategoryGridSkeleton count={5} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(categories).map(([key, category], index) => {
                const info = CATEGORY_INFO[key] || { icon: '🧩', color: 'bg-gray-500', gradient: 'from-gray-500 to-gray-600' };
                const categorySkills = skills.filter(s => s.categorization.primary_category === key);
                return (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className="text-center p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 group animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 bg-gradient-to-br ${info.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl sm:text-3xl">{info.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{categoryNames[key] || key}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{categorySkills.length} {t('home.skillsCount')}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('home.hotSkills')}
            </h2>
            <Link href="/skills" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1 group text-sm sm:text-base">
              {t('home.viewAll')} 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {hotSkills.map((skill, index) => (
              <div key={skill.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('home.newSkills')}
            </h2>
            <Link href="/skills?sort=newest" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1 group text-sm sm:text-base">
              {t('home.viewAll')} 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newSkills.map((skill, index) => (
              <div key={skill.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.05%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%27')"
        }}></div>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {language === 'zh-CN' ? '统计数据' : 'Statistics'}
          </h2>
          {!isLoaded ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-6 sm:mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-6 sm:mt-8">
              <div className="animate-bounce-subtle" style={{ animationDelay: '0s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{stats.total}</div>
                <div className="text-indigo-200 text-xs sm:text-sm md:text-base">{language === 'zh-CN' ? '技能总数' : 'Total Skills'}</div>
              </div>
              <div className="animate-bounce-subtle" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{stats.categories}</div>
                <div className="text-indigo-200 text-xs sm:text-sm md:text-base">{language === 'zh-CN' ? '分类' : 'Categories'}</div>
              </div>
              <div className="animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{stats.useCount.toLocaleString()}</div>
                <div className="text-indigo-200 text-xs sm:text-sm md:text-base">{language === 'zh-CN' ? '总使用次数' : 'Total Uses'}</div>
              </div>
              <div className="animate-bounce-subtle" style={{ animationDelay: '0.3s' }}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{stats.avgRating}</div>
                <div className="text-indigo-200 text-xs sm:text-sm md:text-base">{language === 'zh-CN' ? '平均评分' : 'Avg Rating'}</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
