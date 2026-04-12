'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { useI18nContext } from '@/components/I18nProvider';

function ThemeToggleButton({ 
  mounted, 
  currentTheme, 
  onToggle 
}: { 
  mounted: boolean; 
  currentTheme: string; 
  onToggle: () => void;
}) {
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg w-9 h-9 bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }
  
  const isDark = currentTheme === 'dark' ||
    (currentTheme === 'system' && typeof window !== 'undefined' &&
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const { t } = useI18nContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { preferences, isLoaded, updatePreference } = usePreferences();

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const currentTheme = useMemo(() => {
    return isLoaded ? preferences.theme : 'system';
  }, [isLoaded, preferences.theme]);
  
  const handleToggleTheme = () => {
    if (!isLoaded) return;
    
    document.documentElement.classList.add('theme-transition');
    
    const newTheme = preferences.theme === 'light' ? 'dark' :
                     preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreference('theme', newTheme);
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 600);
  };

  const navItems = [
    { href: '/', label: t('nav.home'), icon: '🏠' },
    { href: '/skills', label: 'AI工具库', icon: '🔧' },
    { href: '/models', label: '模型接入', icon: '🤖' },
    { href: '/favorites', label: t('nav.favorites'), icon: '❤️' },
  ];

  const moreItems = [
    { href: '/compare', label: t('nav.compare'), icon: '⚖️' },
    { href: '/guide', label: t('nav.guide'), icon: '📖' },
    { href: '/about', label: t('nav.about'), icon: 'ℹ️' },
    { href: '/settings', label: t('nav.settings'), icon: '⚙️' },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group relative">
              <span className="text-xl sm:text-2xl group-hover:scale-125 group-active:scale-90 transition-all duration-300 cursor-pointer relative z-10">🚀</span>
              <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-200 cursor-pointer relative z-10 group-active:scale-95">
                Mobile Skills
              </span>
              <div className="absolute inset-0 -inset-x-3 -inset-y-2 bg-gray-100 dark:bg-gray-800 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-left opacity-0 group-hover:opacity-100" />
              <div className="absolute inset-0 -inset-x-3 -inset-y-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl scale-0 group-active:scale-100 transition-transform duration-150 origin-center opacity-0 group-active:opacity-100" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map(item => (
              <Link 
                key={item.href}
                href={item.href} 
                className="px-3 xl:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200 text-sm xl:text-base"
              >
                {item.label}
              </Link>
            ))}
            
            <div className="relative group ml-2">
              <button className="px-3 xl:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200 text-sm xl:text-base flex items-center gap-1.5">
                更多
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                {moreItems.map(item => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-all duration-200 text-sm"
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <a
                    href="https://github.com/badhope/mobile-skills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-all duration-200 text-sm"
                  >
                    🔗 GitHub
                  </a>
                </div>
              </div>
            </div>
            
            <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggleButton 
                mounted={mounted} 
                currentTheme={currentTheme} 
                onToggle={handleToggleTheme} 
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
            <ThemeToggleButton 
              mounted={mounted} 
              currentTheme={currentTheme} 
              onToggle={handleToggleTheme} 
            />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 animate-slide-in-left">
          <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
            {moreItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
            <a
              href="https://github.com/badhope/mobile-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 sm:px-4 py-2.5 sm:py-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              🔗 GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
