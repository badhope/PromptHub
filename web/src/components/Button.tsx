'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/useGestures';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const { selection } = useHapticFeedback();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        selection();
        onClick?.(e);
      }
    };

    const baseStyles = 'relative inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
      primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95',
      secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95',
      ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95',
      danger: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-105 active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm gap-1.5',
      md: 'px-5 py-3 text-sm gap-2',
      lg: 'px-6 py-4 text-base gap-2.5',
    };

    const width = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
        {...(props as any)}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-current/10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            />
          </div>
        )}
        <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
