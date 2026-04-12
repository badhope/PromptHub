'use client';

import { Toaster, toast as hotToast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Info, AlertTriangle,
  Copy, Heart, Sparkles, Share2, Settings, X
} from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useGestures';

interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning' | 'custom';
  icon?: React.ReactNode;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastStyles = {
  success: 'bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60',
  error: 'bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60',
  info: 'bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60',
  warning: 'bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60',
  custom: 'bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60'
};

const iconStyles = {
  success: 'bg-gradient-to-br from-emerald-500 to-green-600 text-white',
  error: 'bg-gradient-to-br from-red-500 to-rose-600 text-white',
  info: 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white',
  warning: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
  custom: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
};

const iconComponents = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
  custom: <Sparkles size={18} />
};

function ToastContent({ 
  t, 
  options,
  onDismiss 
}: { 
  t: any; 
  options: ToastOptions;
  onDismiss: () => void;
}) {
  const { success, selection } = useHapticFeedback();
  const type = options.type || 'info';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`
        ${toastStyles[type]} px-4 py-3.5 rounded-2xl 
        shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        flex items-start gap-3.5 min-w-[340px] sm:min-w-[380px] cursor-default
        backdrop-blur-xl bg-white/95 dark:bg-gray-800/95
      `}
      onClick={() => {
        selection();
      }}
    >
      <motion.div 
        className={`
          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          shadow-lg ${iconStyles[type]}
        `}
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
      >
        {options.icon || iconComponents[type]}
      </motion.div>
      
      <div className="flex-1 min-w-0 pt-0.5">
        {options.title && (
          <h4 className="font-semibold text-[14px] text-gray-900 dark:text-white mb-0.5 tracking-tight">
            {options.title}
          </h4>
        )}
        <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
          {options.message}
        </p>
        
        {options.action && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              success();
              options.action?.onClick();
              onDismiss();
            }}
            className="mt-2.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[12px] font-medium rounded-xl shadow-lg shadow-indigo-500/20 active:scale-0.95 transition-transform"
          >
            {options.action.label}
          </button>
        )}
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          selection();
          onDismiss();
        }}
        className="flex-shrink-0 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-0.5"
      >
        <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </button>
    </motion.div>
  );
}

export function showToast({ title, message, type = 'info', icon, duration = 3500, action }: ToastOptions) {
  const toastId = hotToast.custom(
    (t) => (
      <ToastContent 
        t={t} 
        options={{ title, message, type, icon, action }}
        onDismiss={() => hotToast.dismiss(t.id)}
      />
    ),
    {
      duration,
      position: 'top-right',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        maxWidth: 'none'
      }
    }
  );
  return toastId;
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
