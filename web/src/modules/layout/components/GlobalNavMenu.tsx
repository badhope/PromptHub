'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Search,
  TrendingUp,
  LayoutGrid,
  LayoutDashboard,
  Code2,
  BookOpen,
  Settings,
  Terminal,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useGestures';

const NAV_ITEMS = [
  {
    title: '首页',
    href: '/',
    icon: Home,
    description: '精选推荐',
  },
  {
    title: '发现应用',
    href: '/explore',
    icon: Search,
    description: '探索全部 AI 应用',
  },
  {
    title: '应用排行',
    href: '/rankings',
    icon: TrendingUp,
    description: '下载榜 / 好评榜',
  },
  {
    title: '精选合集',
    href: '/collections',
    icon: LayoutGrid,
    description: '场景化套装',
    badge: 'HOT',
  },
  {
    title: '工作台',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: '我的应用中心',
  },
  {
    title: '开发者中心',
    href: '/developer/dashboard',
    icon: Code2,
    description: '发布你的应用',
    badge: 'NEW',
  },
];

const QUICK_ACTIONS = [
  {
    title: '使用指南',
    href: '/guide',
    icon: BookOpen,
    description: '新手入门教程',
  },
  {
    title: '调试沙盒',
    href: '/workspace',
    icon: Terminal,
    description: 'Prompt 实时预览',
  },
  {
    title: '账号设置',
    href: '/settings',
    icon: Settings,
    description: '偏好与配置',
  },
];

export default function GlobalNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { selection } = useHapticFeedback();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    selection();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
        <span className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-300">
          导航
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-80 z-50"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h3 className="text-sm font-bold text-white">
                    Skillora 灵境
                  </h3>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  AI 应用商店 - 释放智能的无限可能
                </p>
              </div>

              <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2">
                  应用商店
                </h4>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => selection()}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400 font-bold' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                              item.badge === 'HOT' 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] opacity-70">
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="p-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2">
                  快捷工具
                </h4>
                {QUICK_ACTIONS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => selection()}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all mb-0.5
                        ${isActive 
                          ? 'text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-gray-800' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GitHub 仓库</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
