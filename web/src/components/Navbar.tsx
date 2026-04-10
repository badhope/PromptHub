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
    const newTheme = preferences.theme === 'light' ? 'dark' :
                     preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreference('theme', newTheme);
  };

  const navItems = [
    { href: '/', label: t('nav.home'), icon: '🏠' },
    { href: '/ai-tools', label: 'AI工具库', icon: '🛠️' },
    { href: '/skills', label: t('nav.skills'), icon: '📚' },
    { href: '/search', label: t('nav.search'), icon: '🔍' },
    { href: '/favorites', label: t('nav.favorites'), icon: '❤️' },
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
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">🚀</span>
              <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                Mobile Skills
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
            {navItems.map(item => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200 relative group text-sm xl:text-base"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            <ThemeToggleButton 
              mounted={mounted} 
              currentTheme={currentTheme} 
              onToggle={handleToggleTheme} 
            />
            
            <a
              href="https://github.com/badhope/mobile-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
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
            <a
              href="https://github.com/badhope/mobile-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
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
