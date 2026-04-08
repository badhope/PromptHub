'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/skills', label: '技能', icon: '📚' },
  { href: '/search', label: '搜索', icon: '🔍' },
  { href: '/compare', label: '对比', icon: '⚖️' },
  { href: '/settings', label: '设置', icon: '⚙️' }
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavClick = () => {
    setIsExpanded(false);
  };

  if (!mounted) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-md">
          <div className="w-full flex items-center justify-center py-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="h-4 bg-transparent"></div>
      </nav>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div 
        className={`
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-md 
          border-t border-gray-200 dark:border-gray-700 
          transition-all duration-300 ease-out
          ${isExpanded ? 'shadow-lg' : 'shadow-md'}
        `}
      >
        <button
          onClick={toggleExpand}
          className="w-full flex items-center justify-center py-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label={isExpanded ? '收起导航' : '展开导航'}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <span className="text-xs font-medium flex items-center gap-1">
              {isExpanded ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  收起
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  导航
                </>
              )}
            </span>
          </div>
        </button>

        <div 
          className={`
            overflow-hidden transition-all duration-300 ease-out
            ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="flex items-center justify-around h-16 px-2 safe-area-inset-bottom border-t border-gray-100 dark:border-gray-800">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                    active 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <span className={`text-xl mb-1 transition-transform duration-200 ${
                    active ? 'scale-110' : ''
                  }`}>
                    {item.icon}
                  </span>
                  <span className={`text-xs font-medium ${
                    active ? 'font-semibold' : ''
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {!isExpanded && (
        <div className="h-4 bg-transparent"></div>
      )}
    </nav>
  );
}
