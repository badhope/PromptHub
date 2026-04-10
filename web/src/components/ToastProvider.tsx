'use client';

import { Toaster, toast as hotToast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Info, AlertTriangle,
  Copy, Heart, Star, Sparkles
} from 'lucide-react';

interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning' | 'custom';
  icon?: React.ReactNode;
  duration?: number;
}

const toastStyles = {
  success: 'bg-gradient-to-r from-emerald-500 to-green-600',
  error: 'bg-gradient-to-r from-red-500 to-rose-600',
  info: 'bg-gradient-to-r from-blue-500 to-cyan-600',
  warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
  custom: 'bg-gradient-to-r from-purple-500 to-pink-600'
};

const toastIcons = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
  custom: <Sparkles size={20} />
};

export function showToast({ title, message, type = 'info', icon, duration = 4000 }: ToastOptions) {
  hotToast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`${toastStyles[type]} text-white px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-4 min-w-[320px] cursor-pointer`}
        onClick={() => hotToast.dismiss(t.id)}
      >
        <div className="flex-shrink-0 mt-0.5">
          {icon || toastIcons[type]}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-bold text-sm mb-1">{title}</h4>
          )}
          <p className="text-sm opacity-95 leading-relaxed">{message}</p>
        </div>
      </motion.div>
    ),
    {
      duration,
      position: 'top-right',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0
      }
    }
  );
}

export function showCopyToast(content: string) {
  showToast({
    type: 'success',
    title: '已复制',
    message: `"${content}" 已复制到剪贴板`,
    icon: <Copy size={20} />
  });
}

export function showFavoriteToast(name: string, isAdded: boolean) {
  showToast({
    type: 'custom',
    title: isAdded ? '已收藏' : '已取消收藏',
    message: isAdded ? `"${name}" 已添加到收藏夹` : `"${name}" 已从收藏夹移除`,
    icon: <Heart size={20} className={isAdded ? 'fill-white' : ''} />
  });
}

export function showActivateToast(name: string) {
  showToast({
    type: 'info',
    title: '激活技能',
    message: `正在加载 "${name}" 技能定义...`,
    icon: <Sparkles size={20} />
  });
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        containerClassName="toast-container"
        gutter={16}
        toastOptions={{
          style: {
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0
          }
        }}
      />
    </>
  );
}
