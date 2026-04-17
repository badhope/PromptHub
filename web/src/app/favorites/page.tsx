'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SimpleSkillCard from '@/components/SimpleSkillCard';
import AIToolCard from '@/components/AIToolCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useSkills } from '@/hooks/useSkills';

interface AITool {
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

type TabType = 'skills' | 'tools';

function getInitialFavoriteIds(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.warn(`Failed to load favorites for key "${key}":`, error);
  }
  return [];
}

export default function FavoritesPage() {
  const { data: skills, status } = useSkills();
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [skillFavoriteIds, setSkillFavoriteIds] = useState<string[]>([]);
  const [toolFavoriteIds, setToolFavoriteIds] = useState<string[]>([]);
  const [aiTools, setAiTools] = useState<{ tools: AITool[] }>({ tools: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSkillFavoriteIds(getInitialFavoriteIds('favorite-skills'));
    setToolFavoriteIds(getInitialFavoriteIds('ai-tools-favorites'));
  }, []);

  useEffect(() => {
    fetch('/ai-tools.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => setAiTools(data))
      .catch(error => console.warn('Failed to load AI tools:', error));
  }, []);

  const toggleSkillFavorite = (skillId: string) => {
    const newFavorites = skillFavoriteIds.includes(skillId)
      ? skillFavoriteIds.filter(id => id !== skillId)
      : [...skillFavoriteIds, skillId];
    setSkillFavoriteIds(newFavorites);
    try {
      localStorage.setItem('favorite-skills', JSON.stringify(newFavorites));
    } catch (error) {
      console.warn('Failed to save skill favorites:', error);
    }
  };

  const toggleToolFavorite = (id: string) => {
    const newFavorites = toolFavoriteIds.includes(id)
      ? toolFavoriteIds.filter(f => f !== id)
      : [...toolFavoriteIds, id];
    setToolFavoriteIds(newFavorites);
    try {
      localStorage.setItem('ai-tools-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.warn('Failed to save tool favorites:', error);
    }
  };

  const favoriteSkills = (skills || []).filter(skill => skillFavoriteIds.includes(skill.id));
  const favoriteTools = aiTools.tools.filter(tool => toolFavoriteIds.includes(tool.id));
  const totalFavorites = favoriteSkills.length + favoriteTools.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: '首页', href: '/' },
            { label: '我的收藏' }
          ]} />
          <div className="flex items-center gap-4 mt-4">
            <span className="text-5xl">❤️</span>
            <div>
              <h1 className="text-4xl font-bold">我的收藏</h1>
              <p className="text-white/80 mt-2">您收藏的技能与工具将保存在本地浏览器中</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3">
              <span className="text-2xl">❤️</span>
              <div>
                <div className="font-bold text-2xl">{totalFavorites}</div>
                <div className="text-white/70 text-xs">总收藏</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3">
              <span className="text-2xl">🎭</span>
              <div>
                <div className="font-bold text-2xl">{favoriteSkills.length}</div>
                <div className="text-white/70 text-xs">技能角色</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center gap-3">
              <span className="text-2xl">🔧</span>
              <div>
                <div className="font-bold text-2xl">{favoriteTools.length}</div>
                <div className="text-white/70 text-xs">AI 工具</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {totalFavorites === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              还没有收藏任何内容
            </h3>
            <p className="text-gray-600 mb-6">
              浏览技能和工具库，点击心形图标即可收藏
            </p>
            <Link 
              href="/skills" 
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
            >
              开始探索
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex gap-3">
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform
                  ${activeTab === 'skills'
                    ? 'bg-black text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:scale-102'
                  }`}
              >
                🎭 技能角色
                <span className={`ml-2 text-sm ${activeTab === 'skills' ? 'text-white/70' : 'text-gray-400'}`}>
                  {favoriteSkills.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform
                  ${activeTab === 'tools'
                    ? 'bg-black text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:scale-102'
                  }`}
              >
                🔧 AI 工具
                <span className={`ml-2 text-sm ${activeTab === 'tools' ? 'text-white/70' : 'text-gray-400'}`}>
                  {favoriteTools.length}
                </span>
              </button>
            </div>

            {activeTab === 'skills' ? (
              favoriteSkills.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <div className="text-5xl mb-4">🎭</div>
                  <p className="text-gray-500">还没有收藏任何技能</p>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className="mt-4 text-rose-500 font-semibold hover:underline"
                  >
                    查看收藏的工具 →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {favoriteSkills.map(skill => (
                    <div key={skill.id} className="relative group">
                      <SimpleSkillCard skill={skill} />
                      <button
                        onClick={() => toggleSkillFavorite(skill.id)}
                        className="absolute top-6 right-6 p-2 bg-white rounded-xl shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title="取消收藏"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              favoriteTools.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <div className="text-5xl mb-4">🔧</div>
                  <p className="text-gray-500">还没有收藏任何工具</p>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="mt-4 text-rose-500 font-semibold hover:underline"
                  >
                    查看收藏的技能 →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {favoriteTools.map(tool => (
                    <div key={tool.id} className="relative group">
                      <AIToolCard tool={tool} isFavorite={true} onToggleFavorite={() => toggleToolFavorite(tool.id)} />
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
