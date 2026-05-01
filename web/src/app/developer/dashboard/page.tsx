'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Upload,
  DollarSign,
  Download,
  Eye,
  Star,
  TrendingUp,
  ChevronRight,
  Settings,
  Package,
  Wallet,
  Bell,
  HelpCircle,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const navItems = [
  { id: 'dashboard', name: '数据看板', icon: BarChart3, href: '/developer/dashboard' },
  { id: 'apps', name: '我的应用', icon: Package, href: '/developer/apps' },
  { id: 'earnings', name: '收益中心', icon: DollarSign, href: '/developer/earnings' },
  { id: 'payouts', name: '提现管理', icon: Wallet, href: '/developer/payouts' },
  { id: 'settings', name: '开发者设置', icon: Settings, href: '/developer/settings' },
];

const stats = [
  { label: '总下载量', value: '12,458', change: '+12.5%', icon: Download, color: 'text-blue-500' },
  { label: '总曝光量', value: '89,234', change: '+8.3%', icon: Eye, color: 'text-purple-500' },
  { label: '平均评分', value: '4.8', change: '+0.2', icon: Star, color: 'text-amber-500' },
  { label: '预估收益', value: '¥2,458', change: '+24.5%', icon: DollarSign, color: 'text-emerald-500' },
];

const recentApps = [
  { id: 1, name: '全能编程助手 Pro', downloads: 3245, rating: 4.9, status: 'published', earnings: 892 },
  { id: 2, name: '文案创作大师', downloads: 1823, rating: 4.7, status: 'published', earnings: 547 },
  { id: 3, name: '数据分析专家', downloads: 856, rating: 4.8, status: 'review', earnings: 0 },
];

export default function DeveloperDashboardPage() {
  const [user, setUser] = useState<any>(null);

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
              <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-5 mb-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">开发者中心</h3>
                    <p className="text-xs opacity-80">已认证开发者</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>分成比例</span>
                  <span className="font-bold">70%</span>
                </div>
              </div>

              <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all ${
                        item.id === 'dashboard'
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-500'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 space-y-2">
                <a href="#" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  <Bell className="w-4 h-4" />
                  消息通知
                </a>
                <a href="#" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  帮助文档
                </a>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    数据看板
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    查看你的应用表现和收益数据
                  </p>
                </div>
                <Link
                  href="/developer/apps/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105"
                >
                  <Upload className="w-4 h-4" />
                  发布新应用
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 dark:text-white">
                  我的应用
                </h2>
                <Link
                  href="/developer/apps"
                  className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  查看全部
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentApps.map((app) => (
                  <div key={app.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl">
                        🤖
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate">
                            {app.name}
                          </h3>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            app.status === 'published'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          }`}>
                            {app.status === 'published' ? '已发布' : '审核中'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{app.downloads} 下载</span>
                          <span>⭐ {app.rating}</span>
                          <span>¥{app.earnings} 收益</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-xl mb-2">
                    💡 本周收益增长 24.5%
                  </h3>
                  <p className="text-white/80 text-sm mb-4 max-w-md">
                    你的应用表现非常出色！继续优化应用描述可以获得更多曝光
                  </p>
                  <Link
                    href="/developer/earnings"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-lg"
                  >
                    查看收益详情
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="text-6xl hidden sm:block">💰</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
