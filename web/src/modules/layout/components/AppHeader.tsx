'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Moon, Sun, Monitor, Play } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { useHapticFeedback } from '@/hooks/useGestures';
import GlobalNavMenu from './GlobalNavMenu';
import { AuthUserMenu } from '@/components/AuthProvider';

const AppHeader = () => {
  const pathname = usePathname();
  const { selection } = useHapticFeedback();
  const [mounted, setMounted] = useState(false);
  const { preferences, isLoaded, updatePreference } = usePreferences();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1);
    return () => clearTimeout(timer);
  }, []);

  const currentTheme = useMemo(() => {
    return isLoaded ? preferences.theme : 'system';
  }, [isLoaded, preferences.theme]);

  // Theme detection used for internal consistency
  void useMemo(() => {
    if (!mounted) return false;
    return currentTheme === 'dark' ||
      (currentTheme === 'system' && typeof window !== 'undefined' &&
       window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [mounted, currentTheme]);

  const cycleTheme = () => {
    selection();
    if (!isLoaded) return;
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(preferences.theme as typeof themes[number]);
    const nextIndex = (currentIndex + 1) % themes.length;
    updatePreference('theme', themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (currentTheme === 'dark') return <Moon className="w-4 h-4" />;
    if (currentTheme === 'light') return <Sun className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const isSkills = pathname === '/skills';
  const isSkillDetail = pathname.startsWith('/skills/');
  const showBack = isSkillDetail;
  // For future use
  void (pathname === '/');

  const goBack = () => {
    selection();
    window.history.back();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-100/50 dark:border-gray-800/50 safe-area-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {showBack ? (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goBack}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">返回</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <Link href="/" className="flex items-center gap-2 group" onClick={() => selection()}>
                    <motion.span 
                      className="text-2xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✨
                    </motion.span>
                    <span className="font-black text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                      Skillora
                    </span>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 hidden sm:inline">
                      灵境
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {isSkillDetail && (
              <nav className="hidden md:flex items-center gap-2 text-sm ml-2">
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  onClick={() => selection()}
                >
                  首页
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <Link 
                  href="/explore" 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  onClick={() => selection()}
                >
                  应用商店
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  应用详情
                </span>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/workspace"
              onClick={() => selection()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">工作台</span>
              <span className="sm:hidden px-1.5 py-0.5 text-[10px] font-bold bg-white/20 rounded-full">
                NEW
              </span>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cycleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={mounted ? `当前主题: ${currentTheme}` : '主题切换'}
            >
              {mounted && getThemeIcon()}
            </motion.button>

            <AuthUserMenu />

            <GlobalNavMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
