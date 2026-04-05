'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Skill, SkillsData } from '@/types/skill';
import skillsData from '@/skills-data.json';
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import {
  getCategoryIcon,
  getCategoryName,
  getCategoryGradient
} from '@/lib/categories';

function getInitialFavorite(skillId: string): boolean {
  if (typeof window === 'undefined') return false;
  const favorites = JSON.parse(localStorage.getItem('favorite-skills') || '[]');
  return favorites.includes(skillId);
}

export default function SkillClient({ skill }: { skill: Skill }) {
  const { skills } = skillsData as SkillsData;
  const [isFavorite, setIsFavorite] = useState(() => getInitialFavorite(skill.id));
  const [copied, setCopied] = useState(false);
  const [showRawContent, setShowRawContent] = useState(false);

  const category = skill.categorization.primary_category;
  const icon = getCategoryIcon(category);
  const gradient = getCategoryGradient(category);
  const categoryName = getCategoryName(category);
  const skillTags = skill.categorization.tags;

  const relatedSkills = useMemo(() => {
    const sameCategory = skills.filter(
      s => s.categorization.primary_category === category && s.id !== skill.id
    );
    
    const withSimilarTags = skills.filter(s => {
      if (s.id === skill.id) return false;
      const commonTags = s.categorization.tags.filter(tag => 
        skillTags.includes(tag)
      );
      return commonTags.length > 0;
    });
    
    const combined = [...new Map(
      [...sameCategory, ...withSimilarTags].map(s => [s.id, s])
    ).values()];
    
    return combined
      .sort((a, b) => {
        const diff = b.stats.use_count - a.stats.use_count;
        return diff !== 0 ? diff : a.id.localeCompare(b.id);
      })
      .slice(0, 6);
  }, [skills, skill.id, category, skillTags]);

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

  const copyActivation = async () => {
    try {
      await navigator.clipboard.writeText(skill.activation.quick_activation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className={`bg-gradient-to-br ${gradient} text-white py-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/skills" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回技能列表
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-5xl">{icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {categoryName}
                </span>
                <span className="text-white/80 text-sm">
                  v{skill.version}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{skill.name}</h1>
              <p className="text-lg text-white/90">{skill.metadata.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={copyActivation}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制！
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制激活指令
                </>
              )}
            </button>
            <button
              onClick={toggleFavorite}
              className={`px-6 py-3 rounded-lg font-semibold border-2 transition-colors flex items-center justify-center gap-2 ${
                isFavorite
                  ? 'border-red-500 text-red-500 bg-red-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isFavorite ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  已收藏
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  收藏
                </>
              )}
            </button>
            <a
              href={skill.content.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{skill.stats.rating.toFixed(1)}</div>
                <div className="text-sm text-gray-500">评分</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{skill.stats.use_count.toLocaleString()}</div>
                <div className="text-sm text-gray-500">使用次数</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">❤️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{skill.stats.favorite_count.toLocaleString()}</div>
                <div className="text-sm text-gray-500">收藏</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">标签</h2>
          <div className="flex flex-wrap gap-2">
            {skill.categorization.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">技能详情</h2>
            <button
              onClick={() => setShowRawContent(!showRawContent)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {showRawContent ? '查看渲染' : '查看原文'}
            </button>
          </div>
          <div className="p-6">
            {showRawContent ? (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{skill.content.content_markdown}</code>
              </pre>
            ) : (
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm" {...props}>
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
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              相关技能推荐
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSkills.map(related => (
                <Link
                  key={related.id}
                  href={`/skills/${related.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getCategoryIcon(related.categorization.primary_category)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {related.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {related.metadata.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">
                          ⭐ {related.stats.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
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
  );
}
