'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Heart,
  Download,
  Code2,
  LogOut,
  LogIn,
  ChevronDown,
  Crown,
  LayoutDashboard,
} from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useGestures';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  developerMode?: boolean;
}

interface UserMenuProps {
  user?: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selection, success } = useHapticFeedback();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const handleSignIn = () => {
    selection();
    router.push('/signin');
  };

  const handleSignOut = async () => {
    selection();
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      success();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSignIn}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">登录</span>
      </motion.button>
    );
  }

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: '控制台',
      href: '/dashboard',
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: '我的收藏',
      href: '/favorites',
    },
    {
      icon: <Download className="w-4 h-4" />,
      label: '已下载',
      href: '/downloads',
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: '设置',
      href: '/settings',
    },
  ];

  if (user.developerMode || user.role === 'admin') {
    menuItems.splice(1, 0, {
      icon: <Code2 className="w-4 h-4" />,
      label: '开发者中心',
      href: '/developer',
    });
  }

  if (user.role === 'admin') {
    menuItems.push({
      icon: <Crown className="w-4 h-4" />,
      label: '管理后台',
      href: '/admin',
    });
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          selection();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-7 h-7 rounded-lg object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800">
              <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {user.name || '用户'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
              {user.developerMode && (
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                  开发者
                </span>
              )}
            </div>

            <div className="py-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    selection();
                    setIsOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </div>

            <div className="py-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
