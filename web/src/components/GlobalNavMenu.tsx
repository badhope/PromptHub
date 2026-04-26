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
  Play,
  BookOpen,
  Settings,
  Heart,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useGestures';

const NAV_ITEMS = [
  {
    title: '首页',
    href: '/',
    icon: Home,
    description: '平台概览',
  },
  {
    title: '技能库',
    href: '/skills',
    icon: Search,
    description: '探索 462+ 智能体',
  },
  {
    title: '工作台',
    href: '/workspace',
    icon: Play,
    description: 'Prompt 调试沙盒',
    badge: 'NEW',
  },
  {
    title: '我的收藏',
    href: '/favorites',
    icon: Heart,
    description: '已收藏的技能',
  },
  {
    title: '使用指南',
    href: '/guide',
    icon: BookOpen,
    description: '新手入门教程',
  },
];

const QUICK_ACTIONS = [
  {
    title: 'Ollama 本地模型',
    href: '/workspace?provider=ollama',
    icon: Terminal,
    description: '零配置本地运行',
  },
  {
    title: 'API 配置',
    href: '/workspace?tab=settings',
    icon: Settings,
    description: '管理你的 API Key',
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
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white px-2">
                  快速导航
                </h3>
              </div>

              <div className="p-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => selection()}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        ${isActive 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`
                            font-semibold text-sm
                            ${isActive 
                              ? 'text-indigo-600 dark:text-indigo-400' 
                              : 'text-gray-900 dark:text-white'
                            }
                          `}>
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-2">
                  快捷操作
                </h4>
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => selection()}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all mb-1 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-900 dark:text-white flex items-center gap-1">
                          {action.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href="/workspace"
                  onClick={() => selection()}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  立即进入工作台
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
