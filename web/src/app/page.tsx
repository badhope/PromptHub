'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18nContext } from '@/components/I18nProvider';

export default function Home() {
  const { language } = useI18nContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div 
            className={`transition-all duration-1000 ease-out ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <header className="mb-12">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
                <span className="text-black">Mobile</span>
                <span className="text-gray-400"> Skills</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                {language === 'zh-CN' 
                  ? '探索 AI 技能的无限可能，让智能触手可及'
                  : 'Explore the infinite possibilities of AI skills, making intelligence accessible'}
              </p>
            </header>

            <div 
              className={`transition-all duration-1000 ease-out ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link
                  href="/ai-tools"
                  className="group relative inline-flex items-center justify-center px-10 py-5 sm:px-14 sm:py-7 bg-black text-white rounded-2xl font-bold text-lg sm:text-xl hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 w-full sm:w-auto"
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl sm:text-2xl">🛠️</span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-400 mb-1 font-medium">推荐入口</div>
                      <div className="text-lg sm:text-xl font-bold">AI 工具库</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/categories"
                  className="group relative inline-flex items-center justify-center px-10 py-5 sm:px-14 sm:py-7 bg-white text-black border-2 border-black rounded-2xl font-bold text-lg sm:text-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 w-full sm:w-auto"
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-500 mb-1 font-medium">
                        {language === 'zh-CN' ? '开始探索' : 'Start Exploring'}
                      </div>
                      <div className="text-lg sm:text-xl font-bold">
                        {language === 'zh-CN' ? '技能分类导航' : 'Skill Categories'}
                      </div>
                    </div>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:translate-x-1 transition-transform duration-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <article 
            className={`transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black">
                {language === 'zh-CN' ? '关于 Mobile Skills' : 'About Mobile Skills'}
              </h2>
            </div>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium max-w-3xl">
              {language === 'zh-CN'
                ? 'Mobile Skills 是一个开放的 AI 技能生态系统，致力于让每个人都能轻松使用和创造 AI 技能。我们提供丰富的技能库，涵盖写作、编程、分析、创意等多个领域，帮助您提升工作效率和创造力。'
                : 'Mobile Skills is an open AI skill ecosystem dedicated to making AI skills accessible to everyone. We provide a rich skill library covering writing, programming, analysis, creativity, and more, helping you enhance productivity and creativity.'}
            </p>
          </article>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: '⚡',
                title: language === 'zh-CN' ? '即时激活' : 'Instant Activation',
                desc: language === 'zh-CN' ? '一键复制，直接在任意 AI 对话中使用' : 'One-click copy, use directly in any AI conversation'
              },
              {
                icon: '🎯',
                title: language === 'zh-CN' ? '精准专业' : 'Professional',
                desc: language === 'zh-CN' ? '每个技能都经过精心设计和优化' : 'Each skill is carefully designed and optimized'
              },
              {
                icon: '🌍',
                title: language === 'zh-CN' ? '开放生态' : 'Open Ecosystem',
                desc: language === 'zh-CN' ? '自由分享、改进、创造新技能' : 'Freely share, improve, and create new skills'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-8 bg-white border border-gray-100 rounded-2xl hover:border-black hover:shadow-xl transition-all duration-300 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-500 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
