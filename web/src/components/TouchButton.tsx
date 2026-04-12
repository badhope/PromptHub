'use client';

import { motion } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/useGestures';

interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export default function TouchButton({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  onMouseEnter,
  type = 'button'
}: TouchButtonProps) {
  const { selection } = useHapticFeedback();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    selection();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 30 } } : {}}
      whileHover={!disabled ? { transition: { type: 'spring', stiffness: 400, damping: 20 } } : {}}
      className={`relative overflow-hidden touch-manipulation ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {children}
    </motion.button>
  );
}
