'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Skill } from '@/types/skill';
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import {
  getCategoryIcon,
  getCategoryName
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const category = skill.categorization.primary_category;
  const icon = getCategoryIcon(category);
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
    <div className="min-h-screen bg-white">
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

      <div>
        <div className="bg-black text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/categories" 
              className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors font-medium text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'zh-CN' ? '返回分类' : 'Back to Categories'}
            </Link>
            
            <div 
              className={`flex flex-col sm:flex-row items-start gap-6 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl sm:text-4xl">{icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold text-gray-300">
                    {categoryName}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">
                    v{skill.version}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">{skill.name}</h1>
                <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-2xl">{skill.metadata.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div 
            className={`mb-12 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <ActivationCommand 
              command={skill.activation_command?.content_markdown || `你是${skill.name}。请根据你的角色设定，与我进行对话和互动。`}
              title={language === 'zh-CN' ? '激活指令' : 'Activation Command'}
            />
          </div>

          {skill.system_prompt && (
            <div 
              className={`mb-12 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <h2 className="text-2xl font-bold text-black mb-6">
                {language === 'zh-CN' ? '系统提示词' : 'System Prompt'}
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {skill.system_prompt}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {skill.categorization.tags && skill.categorization.tags.length > 0 && (
            <div 
              className={`transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                {language === 'zh-CN' ? '标签' : 'Tags'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.categorization.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
