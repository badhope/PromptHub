'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useI18nContext } from '@/components/I18nProvider';

const LazyBackground = dynamic(() => import('@/components/AnimatedBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
});

export default function Home() {
  const { language } = useI18nContext();
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'Mobile Skills';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [mounted]);

  useEffect(() => {
    if (!showCursor) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, [showCursor]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        {language === 'zh-CN' ? '跳转到主要内容' : 'Skip to main content'}
      </a>
      
      <div className="min-h-screen relative overflow-hidden" role="application">
        <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />}>
          <LazyBackground />
        </Suspense>

        <main id="main-content" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8" aria-label="Hero section">
          <div className="text-center max-w-4xl mx-auto">
            <div 
              className={`transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <header className="mb-8 sm:mb-12 animate-logo-glow inline-block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-2xl blur-xl opacity-50" aria-hidden="true"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-8 sm:px-12 py-6 sm:py-8">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                      <span className="inline-block bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                        {displayText}
                        {showCursor && <span className="animate-blink" aria-hidden="true">|</span>}
                      </span>
                    </h1>
                  </div>
                </div>
              </header>

              <p 
                className={`text-lg sm:text-xl md:text-2xl text-white/95 mb-12 sm:mb-16 max-w-2xl mx-auto transition-all duration-1000 ease-out ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                {language === 'zh-CN' 
                  ? '探索 AI 技能的无限可能，让智能触手可及'
                  : 'Explore the infinite possibilities of AI skills, making intelligence accessible'}
              </p>

              <nav aria-label="Main navigation" className="w-full flex justify-center">
                <div 
                  className={`transition-all duration-1000 ease-out ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <Link
                    href="/categories"
                    className="group relative inline-flex items-center justify-center px-16 sm:px-20 py-8 sm:py-10 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-xl border-2 border-white/40 text-white rounded-3xl font-semibold text-xl sm:text-2xl hover:from-cyan-500/30 hover:via-blue-500/30 hover:to-purple-500/30 hover:border-white/60 hover:scale-105 transition-all duration-300 shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                    aria-label={language === 'zh-CN' ? '进入技能分类页面' : 'Navigate to Skill Categories'}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 via-blue-400/40 to-purple-400/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg" aria-hidden="true">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <div className="text-center sm:text-left">
                        <div className="text-base text-white/95 mb-2 font-medium">{language === 'zh-CN' ? '开始探索' : 'Start Exploring'}</div>
                        <div className="text-2xl sm:text-3xl font-bold">{language === 'zh-CN' ? '技能分类导航' : 'Skill Categories'}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </main>

        <section className="relative z-10 bg-gradient-to-b from-transparent via-black/20 to-black/40 min-h-screen" aria-label="About section">
          <div className="h-32 sm:h-40" aria-hidden="true"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <article 
              className={`bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-indigo-500/15 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 sm:p-12 transition-all duration-1000 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <header className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {language === 'zh-CN' ? '关于 Mobile Skills' : 'About Mobile Skills'}
                </h2>
              </header>
              <p className="text-white/95 text-base sm:text-lg leading-relaxed font-medium">
                {language === 'zh-CN'
                  ? 'Mobile Skills 是一个开放的 AI 技能生态系统，致力于让每个人都能轻松使用和创造 AI 技能。我们提供丰富的技能库，涵盖写作、编程、分析、创意等多个领域，帮助您提升工作效率和创造力。'
                  : 'Mobile Skills is an open AI skill ecosystem dedicated to making AI skills accessible to everyone. We provide a rich skill library covering writing, programming, analysis, creativity, and more, helping you enhance productivity and creativity.'}
              </p>
            </article>

            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <article 
                className={`bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-purple-500/15 backdrop-blur-xl border border-rose-400/30 rounded-3xl p-8 sm:p-10 transition-all duration-1000 hover:border-rose-400/50 hover:shadow-2xl hover:shadow-rose-500/20 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                <header className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {language === 'zh-CN' ? '核心功能' : 'Core Features'}
                  </h2>
                </header>
                <ul className="space-y-4" role="list">
                  <li className="flex items-start gap-3">
                    <span className="text-rose-300 mt-1" aria-hidden="true">•</span>
                    <span className="text-white/95 text-base font-medium">
                      {language === 'zh-CN' ? '丰富的技能库：涵盖多个领域的 AI 技能' : 'Rich skill library: AI skills across multiple domains'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-pink-300 mt-1" aria-hidden="true">•</span>
                    <span className="text-white/95 text-base font-medium">
                      {language === 'zh-CN' ? '智能搜索：快速找到最适合您需求的技能' : 'Smart search: Quickly find the skills that best fit your needs'}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-300 mt-1" aria-hidden="true">•</span>
                    <span className="text-white/95 text-base font-medium">
                      {language === 'zh-CN' ? '一键激活：直接复制使用，无需复杂配置' : 'One-click activation: Copy and use directly, no complex setup'}
                    </span>
                  </li>
                </ul>
              </article>

              <article 
                className={`bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-yellow-500/15 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-8 sm:p-10 transition-all duration-1000 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/20 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '1000ms' }}
              >
                <header className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {language === 'zh-CN' ? '来源信息' : 'Source Information'}
                  </h2>
                </header>
                <p className="text-white/95 text-base leading-relaxed mb-6 font-medium">
                  {language === 'zh-CN'
                    ? '本项目基于开源社区贡献，所有技能均经过精心筛选和优化。'
                    : 'This project is based on open source community contributions, with all skills carefully curated and optimized.'}
                </p>
                <nav aria-label="External links">
                  <a
                    href="https://github.com/badhope/mobile-skills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-lg text-white/90 hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50"
                    aria-label={language === 'zh-CN' ? '访问 GitHub 仓库（在新标签页打开）' : 'Visit GitHub repository (opens in new tab)'}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">GitHub</span>
                  </a>
                </nav>
              </article>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
