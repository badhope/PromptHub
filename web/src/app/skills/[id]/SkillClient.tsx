'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Skill } from '@/types/skill';
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import {
  getCategoryIcon,
  getCategoryName,
  getCategoryGradient
} from '@/lib/categories';
import { useI18nContext } from '@/components/I18nProvider';
import ActivationCommand from '@/components/ActivationCommand';

interface RelatedSkill {
  id: string;
  name: string;
  categorization: {
    primary_category: string;
  };
  metadata: {
    description: string;
  };
  stats: {
    rating: number;
    use_count: number;
  };
}

function getInitialFavorite(skillId: string): boolean {
  if (typeof window === 'undefined') return false;
  const favorites = JSON.parse(localStorage.getItem('favorite-skills') || '[]');
  return favorites.includes(skillId);
}

interface SkillClientProps {
  skill: Skill;
  relatedSkills: RelatedSkill[];
}

export default function SkillClient({ skill, relatedSkills }: SkillClientProps) {
  const { language } = useI18nContext();
  const [isFavorite, setIsFavorite] = useState(() => getInitialFavorite(skill.id));
  const [showRawContent, setShowRawContent] = useState(false);
  const [mounted] = useState(false);

  const category = skill.categorization.primary_category;
  const icon = getCategoryIcon(category);
  const gradient = getCategoryGradient(category);
  const categoryName = getCategoryName(category);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorite-skills') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== skill.id);
      localStorage.setItem('favorite-skills', JSON.stringify(newFavorites));
    } else {
      favorites.push(skill.id);
      localStorage.setItem('favorite-skills', JSON.stringify(favorites));
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-shift" aria-hidden="true"></div>
      
      <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-cyan-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-300/40 to-pink-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-pink-300/35 to-orange-300/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <SoftwareApplicationJsonLd
        name={skill.name}
        description={skill.metadata.description}
        url={`https://badhope.github.io/mobile-skills/skills/${skill.id}`}
        applicationCategory="UtilitiesApplication"
        operatingSystem="Any"
        offers={{
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        }}
        aggregateRating={{
          '@type': 'AggregateRating',
          ratingValue: skill.stats.rating,
          ratingCount: skill.stats.rating_count,
        }}
        author={{
          '@type': 'Organization',
          name: skill.metadata.author,
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: '首页', url: 'https://badhope.github.io/mobile-skills/' },
          { name: '技能', url: 'https://badhope.github.io/mobile-skills/skills' },
          { name: skill.name, url: `https://badhope.github.io/mobile-skills/skills/${skill.id}` },
        ]}
      />

      <div className="relative z-10">
        <div className={`bg-gradient-to-br ${gradient} text-white py-12 sm:py-16 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link 
              href="/skills" 
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'zh-CN' ? '返回技能列表' : 'Back to Skills'}
            </Link>
            
            <div 
              className={`flex flex-col sm:flex-row items-start gap-6 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/30 shadow-2xl">
                <span className="text-4xl sm:text-5xl">{icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30 font-medium">
                    {categoryName}
                  </span>
                  <span className="text-white/90 text-sm font-medium">
                    v{skill.version}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">{skill.name}</h1>
                <p className="text-lg text-white/95 font-medium">{skill.metadata.description}</p>
              </div>
            </div>
          </div>
        </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div 
            className={`mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <ActivationCommand 
              command={skill.content.content_markdown}
              title={language === 'zh-CN' ? '激活指令' : 'Activation Command'}
            />
          </div>

          <div 
            className={`bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={toggleFavorite}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 ${
                  isFavorite
                    ? 'border-pink-400/50 text-pink-300 bg-pink-500/20'
                    : 'border-white/40 text-white bg-white/15 hover:bg-white/25'
                }`}
              >
                {isFavorite ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {language === 'zh-CN' ? '已收藏' : 'Favorited'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {language === 'zh-CN' ? '收藏' : 'Favorite'}
                  </>
                )}
              </button>
              <a
                href={skill.content.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 rounded-xl font-semibold border-2 border-white/40 text-white bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {language === 'zh-CN' ? '查看源码' : 'View Source'}
              </a>
            </div>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{skill.stats.rating.toFixed(1)}</div>
                  <div className="text-sm text-white/90 font-medium">{language === 'zh-CN' ? '评分' : 'Rating'}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{skill.stats.use_count.toLocaleString()}</div>
                  <div className="text-sm text-white/90 font-medium">{language === 'zh-CN' ? '使用次数' : 'Uses'}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{skill.stats.favorite_count.toLocaleString()}</div>
                  <div className="text-sm text-white/90 font-medium">{language === 'zh-CN' ? '收藏' : 'Favorites'}</div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className={`bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h2 className="text-lg font-bold text-white mb-4 drop-shadow-lg">{language === 'zh-CN' ? '标签' : 'Tags'}</h2>
            <div className="flex flex-wrap gap-2">
              {skill.categorization.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm border border-white/30 hover:bg-white/30 transition-all font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div 
            className={`bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="border-b border-white/20 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white drop-shadow-lg">{language === 'zh-CN' ? '技能详情' : 'Skill Details'}</h2>
              <button
                onClick={() => setShowRawContent(!showRawContent)}
                className="text-sm text-white/90 hover:text-white transition-colors font-medium"
              >
                {showRawContent 
                  ? (language === 'zh-CN' ? '查看渲染' : 'View Rendered') 
                  : (language === 'zh-CN' ? '查看原文' : 'View Raw')}
              </button>
            </div>
            <div className="p-6">
              {showRawContent ? (
                <pre className="bg-black/30 backdrop-blur-sm text-white/95 p-4 rounded-lg overflow-x-auto text-sm border border-white/20 font-medium">
                  <code>{skill.content.content_markdown}</code>
                </pre>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="relative">
                            <pre className="bg-black/30 backdrop-blur-sm text-white/90 p-4 rounded-lg overflow-x-auto border border-white/10">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <code className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-sm border border-white/20" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {skill.content.content_markdown}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {relatedSkills.length > 0 && (
            <div 
              className={`mt-8 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                {language === 'zh-CN' ? '相关技能推荐' : 'Related Skills'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedSkills.map(related => (
                  <Link
                    key={related.id}
                    href={`/skills/${related.id}`}
                    className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {getCategoryIcon(related.categorization.primary_category)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-cyan-200 truncate transition-colors">
                          {related.name}
                        </h3>
                        <p className="text-sm text-white/60 line-clamp-2 mt-1">
                          {related.metadata.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                          <span className="flex items-center gap-1">
                            ⭐ {related.stats.rating.toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            👥 {related.stats.use_count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
