'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Heart, Settings, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipe, useHapticFeedback } from '@/hooks/useGestures';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: '首页', icon: <Home className="w-5.5 h-5.5" strokeWidth={2.1} /> },
  { href: '/skills', label: '提示词', icon: <Cpu className="w-5.5 h-5.5" strokeWidth={2.1} /> },
  { href: '/favorites', label: '收藏', icon: <Heart className="w-5.5 h-5.5" strokeWidth={2.1} /> },
  { href: '/search', label: '搜索', icon: <Search className="w-5.5 h-5.5" strokeWidth={2.1} /> },
  { href: '/settings', label: '设置', icon: <Settings className="w-5.5 h-5.5" strokeWidth={2.1} /> }
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { success, selection } = useHapticFeedback();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeIndex = useMemo(() => {
    const currentIndex = NAV_ITEMS.findIndex(item => 
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
    );
    return currentIndex >= 0 ? currentIndex : 0;
  }, [pathname]);

  const handleNavClick = useCallback((index: number) => {
    const item = NAV_ITEMS[index];
    if (index === activeIndex) {
      success();
    } else {
      selection();
    }
    router.push(item.href);
  }, [router, activeIndex, success, selection]);

  const { ref } = useSwipe({
    threshold: 60,
    onSwipeLeft: () => {
      const nextIndex = (activeIndex + 1) % NAV_ITEMS.length;
      if (nextIndex !== activeIndex) {
        selection();
        router.push(NAV_ITEMS[nextIndex].href);
      }
    },
    onSwipeRight: () => {
      const prevIndex = (activeIndex - 1 + NAV_ITEMS.length) % NAV_ITEMS.length;
      if (prevIndex !== activeIndex) {
        selection();
        router.push(NAV_ITEMS[prevIndex].href);
      }
    }
  });

  if (!mounted) {
    return (
      <nav 
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
      >
        <div className="h-16 bg-transparent" />
      </nav>
    );
  }

  return (
    <nav 
      ref={ref}
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 swipe-container"
      style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/6 to-transparent pointer-events-none -top-3 h-6" />
      
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/60 dark:border-gray-700/60 shadow-[0_-1px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around relative h-16">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.button
                key={item.href}
                onClick={() => handleNavClick(index)}
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`
                  relative flex flex-col items-center justify-center
                  transition-all duration-400 ease-out
                  min-w-[56px] min-h-[56px] px-2
                `}
              >
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-x-1 inset-y-1 rounded-2xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <motion.span 
                  className={`
                    relative z-10 transform transition-all duration-300
                    ${isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 scale-105 -translate-y-0.5' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                  animate={{
                    y: isActive ? [0, -2, 0] : 0
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  {item.icon}
                </motion.span>
                <span 
                  className={`
                    text-[11px] font-semibold relative z-10 transition-all duration-300 mt-0.5 tracking-tight
                    ${isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 opacity-100 scale-1' 
                      : 'text-gray-500 dark:text-gray-400 opacity-80 scale-0.95'
                    }
                  `}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
