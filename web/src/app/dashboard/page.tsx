'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Heart,
  Download,
  ShoppingBag,
  Clock,
  Settings,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AppCard from '@/modules/store/components/AppCard';
import { useSkills } from '@/hooks/useSkills';
import { useFavorites } from '@/hooks/useFavorites';

const navItems = [
  { id: 'overview', name: '概览', icon: LayoutDashboard },
  { id: 'favorites', name: '我的收藏', icon: Heart },
  { id: 'downloads', name: '已下载', icon: Download },
  { id: 'purchases', name: '已购买', icon: ShoppingBag },
  { id: 'recent', name: '最近使用', icon: Clock },
  { id: 'settings', name: '账号设置', icon: Settings },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const { skills } = useSkills();
  const { favorites, downloads, favoriteCount, downloadCount } = useFavorites();

  const favoriteSkills = useMemo(() => {
    return skills.filter(s => favorites.includes(s.id));
  }, [skills, favorites]);

  const downloadedSkills = useMemo(() => {
    return skills.filter(s => downloads.includes(s.id));
  }, [skills, downloads]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      }
    };
    checkSession();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6">
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {user.name || '用户'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-500'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-7 h-7 text-indigo-500" />
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                  我的工作台
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                管理你的 AI 应用和偏好设置
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <Download className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  {downloadCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  已下载
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  {favoriteCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  收藏数
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                    +24%
                  </span>
                </div>
                <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  156
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  使用次数
                </p>
              </motion.div>
            </div>

            <div className="mb-8">
              {activeTab === 'overview' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      最近使用
                    </h2>
                    <Link
                      href="/explore"
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      发现更多
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skills.slice(0, 4).map((skill, index) => (
                      <AppCard key={skill.id} skill={skill} index={index} variant="compact" />
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'favorites' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      我的收藏 ({favoriteCount})
                    </h2>
                  </div>
                  {favoriteSkills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoriteSkills.map((skill, index) => (
                        <AppCard key={skill.id} skill={skill} index={index} variant="compact" />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">还没有收藏的应用</p>
                      <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors"
                      >
                        去发现应用
                      </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'downloads' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      已下载 ({downloadCount})
                    </h2>
                  </div>
                  {downloadedSkills.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {downloadedSkills.map((skill, index) => (
                        <AppCard key={skill.id} skill={skill} index={index} variant="compact" />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <Download className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">还没有下载的应用</p>
                      <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors"
                      >
                        去发现应用
                      </Link>
                    </div>
                  )}
                </>
              )}

              {(activeTab === 'purchases' || activeTab === 'recent' || activeTab === 'settings') && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <Sparkles className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">该功能即将上线，敬请期待</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-xl mb-2">
                    成为开发者，分享你的创作
                  </h3>
                  <p className="text-white/80 text-sm mb-4 max-w-md">
                    发布你的 AI 智能体，获得 70% 的收益分成，加入全球开发者生态
                  </p>
                  <Link
                    href="/developer/onboarding"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    立即入驻
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="text-6xl hidden sm:block">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
