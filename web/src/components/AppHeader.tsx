'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Moon, Sun, Monitor } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { useHapticFeedback } from '@/hooks/useGestures';

const AppHeader = () => {
  const pathname = usePathname();
  const { selection } = useHapticFeedback();
  const [mounted, setMounted] = useState(false);
  const { preferences, isLoaded, updatePreference } = usePreferences();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = useMemo(() => {
    return isLoaded ? preferences.theme : 'system';
  }, [isLoaded, preferences.theme]);

  const isDark = useMemo(() => {
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

  const isHome = pathname === '/';
  const isSkills = pathname === '/skills';
  const isSkillDetail = pathname.startsWith('/skills/');
  const showBack = isSkillDetail;

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
                      🧠
                    </motion.span>
                    <span className="font-black text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                      Mobile Skills
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
                  href="/skills" 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  onClick={() => selection()}
                >
                  技能库
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  技能详情
                </span>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isSkills && (
              <Link
                href="/skills"
                onClick={() => selection()}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
              >
                🔍 探索技能
              </Link>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cycleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={`当前主题: ${currentTheme}`}
            >
              {mounted && getThemeIcon()}
              <span className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-300">
                {currentTheme === 'light' ? '浅色' : currentTheme === 'dark' ? '深色' : '跟随'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
