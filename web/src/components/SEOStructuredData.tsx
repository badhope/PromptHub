'use client';

import Script from 'next/script';

export default function SEOStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PromptHub - AI 提示词精选平台',
    url: 'https://badhope.github.io/mobile-skills/',
    description: '387+ 高质量 AI 提示词聚合平台，精选专业级 Prompt，支持一键复制使用。',
    author: {
      '@type': 'Person',
      name: 'badhope'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://badhope.github.io/mobile-skills/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://github.com/badhope/mobile-skills'
    ]
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://badhope.github.io/mobile-skills/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '全部技能',
        item: 'https://badhope.github.io/mobile-skills/skills/'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '搜索',
        item: 'https://badhope.github.io/mobile-skills/search/'
      }
    ]
  };

  return (
    <>
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}
