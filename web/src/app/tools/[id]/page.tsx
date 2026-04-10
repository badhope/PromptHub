'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { showCopyToast, showFavoriteToast } from '@/components/ToastProvider';

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  guide: string;
  scenarios: string[];
  activation: string;
  rawUrl?: string;
}

export default function ToolDetailPage() {
  const params = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/ai-tools.json')
      .then(res => res.json())
      .then(data => {
        const found = data.tools.find((t: Tool) => t.id === params.id);
        setTool(found || null);
      })
      .catch(err => console.error('加载工具数据失败:', err));
    
    const saved = localStorage.getItem('ai-tools-favorites');
    if (saved) {
      const favs = JSON.parse(saved);
      setIsFavorite(favs.includes(params.id));
    }
  }, [params.id]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem('ai-tools-favorites');
    const favs = saved ? JSON.parse(saved) : [];
    
    if (favs.includes(params.id)) {
      const newFavs = favs.filter((f: string) => f !== params.id);
      localStorage.setItem('ai-tools-favorites', JSON.stringify(newFavs));
      setIsFavorite(false);
      showFavoriteToast(tool?.name || '', false);
    } else {
      favs.push(params.id);
      localStorage.setItem('ai-tools-favorites', JSON.stringify(favs));
      setIsFavorite(true);
      showFavoriteToast(tool?.name || '', true);
    }
  };

  const handleCopy = async () => {
    if (!tool) return;
    try {
      await navigator.clipboard.writeText(tool.activation);
      setCopied(true);
      showCopyToast(tool.name);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (!mounted) return null;

  if (!tool) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-black mb-4">工具未找到</h1>
          <Link href="/ai-tools" className="inline-block px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
            返回工具库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        <nav className="mb-8">
          <Link href="/ai-tools" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回AI工具库
          </Link>
        </nav>

        <div className={`mb-8 transition-all duration-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-start gap-4 sm:gap-6 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0">
              {tool.icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-2">
                {tool.name}
              </h1>
              <p className="text-lg sm:text-xl text-gray-500">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCopy}
              className="flex-1 py-4 px-6 bg-black text-white text-base sm:text-lg font-bold rounded-xl
                  hover:bg-gray-800 active:scale-99 transition-all duration-200
                  flex items-center justify-center gap-3"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ✅ 已复制到剪贴板
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  📋 复制激活指令
                </>
              )}
            </button>

            <button
              onClick={toggleFavorite}
              className={`py-4 px-6 rounded-xl text-base sm:text-lg font-bold
                  transition-all duration-200 flex items-center justify-center gap-3
                  hover:scale-105 active:scale-95 ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
            >
              <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isFavorite ? '❤️ 已收藏' : '🤍 收藏'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className={`bg-gray-50 border border-gray-200 rounded-2xl p-6 transition-all duration-500 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <span>📖</span> 使用指南
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {tool.guide}
              </p>
            </div>

            <div className={`bg-gray-50 border border-gray-200 rounded-2xl p-6 transition-all duration-500 delay-150 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <span>🎯</span> 适用场景
              </h2>
              <div className="space-y-3">
                {tool.scenarios.map((scenario, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-gray-700 font-medium">{scenario}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`lg:col-span-2 transition-all duration-500 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                  <span>📄</span> 激活指令 (Markdown)
                </h2>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {copied ? '已复制' : '复制全部'}
                </button>
              </div>
              
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-black prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:my-4 prose-li:my-2">
                  <ReactMarkdown>{tool.activation}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-8 transition-all duration-500 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-black rounded-2xl p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              💡 激活小贴士
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              将上方激活指令完整复制后，直接粘贴发送给 ChatGPT、Claude、文心一言、通义千问等任意大语言模型，
              即可立刻召唤出专业级{tool.name}为您服务！
            </p>
          </div>
        </div>
      </div>

      <div className="sm:hidden fixed bottom-20 left-0 right-0 p-4 z-40">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleCopy}
            className="w-full py-4 px-6 bg-black text-white font-bold rounded-2xl
                shadow-2xl active:scale-98 transition-all duration-200
                flex items-center justify-center gap-3"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                ✅ 已复制
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
                📋 一键复制指令
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
