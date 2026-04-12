'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchMove?: boolean;
}

interface PullToRefreshConfig {
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
}

interface LongPressConfig {
  onLongPress?: () => void;
  duration?: number;
}

interface HapticConfig {
  intensity?: 'light' | 'medium' | 'heavy';
}

export function useSwipe(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchMove = false
  } = config;

  const ref = useRef<HTMLElement>(null);
  const stateRef = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    startTime: 0
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    stateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: true,
      startTime: Date.now()
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!stateRef.current.isSwiping) return;
    const touch = e.touches[0];
    stateRef.current.currentX = touch.clientX;
    stateRef.current.currentY = touch.clientY;
    if (preventDefaultTouchMove) {
      e.preventDefault();
    }
  }, [preventDefaultTouchMove]);

  const handleTouchEnd = useCallback(() => {
    if (!stateRef.current.isSwiping) return;
    const { startX, startY, currentX, currentY, startTime } = stateRef.current;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const velocity = Math.max(absX, absY) / (Date.now() - startTime);

    if (absX > absY && (absX > threshold || velocity > 1)) {
      if (deltaX > 0 && onSwipeRight) {
        hapticFeedback();
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        hapticFeedback();
        onSwipeLeft();
      }
    } else if (absY > absX && (absY > threshold || velocity > 1)) {
      if (deltaY > 0 && onSwipeDown) {
        hapticFeedback();
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        hapticFeedback();
        onSwipeUp();
      }
    }
    stateRef.current.isSwiping = false;
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchMove });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultTouchMove]);

  return { ref };
}

export function useHapticFeedback() {
  const vibrate = useCallback((config: HapticConfig = {}) => {
    const { intensity = 'medium' } = config;
    if (!navigator.vibrate) return;
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [40]
    };
    navigator.vibrate(patterns[intensity]);
  }, []);

  const selection = useCallback(() => vibrate({ intensity: 'light' }), [vibrate]);
  const success = useCallback(() => navigator.vibrate?.([10, 50, 10]), []);
  const warning = useCallback(() => navigator.vibrate?.([20, 50, 20, 50, 20]), []);
  const error = useCallback(() => navigator.vibrate?.([40, 100, 40, 100, 40]), []);

  return { vibrate, selection, success, warning, error };
}

export function hapticFeedback(config: HapticConfig = {}) {
  const { intensity = 'medium' } = config;
  if (!navigator.vibrate) return;
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [40]
  };
  navigator.vibrate(patterns[intensity]);
}

export function useLongPress(config: LongPressConfig) {
  const { onLongPress, duration = 500 } = config;
  const ref = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = useCallback(() => {
    timerRef.current = setTimeout(() => {
      hapticFeedback({ intensity: 'heavy' });
      onLongPress?.();
    }, duration);
  }, [duration, onLongPress]);

  const handleEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchend', handleEnd, { passive: true });
    element.addEventListener('touchmove', handleEnd, { passive: true });
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('mouseup', handleEnd);
    element.addEventListener('mouseleave', handleEnd);
    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('touchmove', handleEnd);
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('mouseup', handleEnd);
      element.removeEventListener('mouseleave', handleEnd);
      handleEnd();
    };
  }, [handleStart, handleEnd]);

  return { ref };
}

export function usePullToRefresh(config: PullToRefreshConfig) {
  const { onRefresh, threshold = 100 } = config;
  const ref = useRef<HTMLElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const stateRef = useRef({
    startY: 0,
    isPulling: false
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const element = ref.current;
    if (!element || isRefreshing) return;
    if (element.scrollTop === 0) {
      stateRef.current = {
        startY: e.touches[0].clientY,
        isPulling: true
      };
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!stateRef.current.isPulling || isRefreshing) return;
    const deltaY = e.touches[0].clientY - stateRef.current.startY;
    if (deltaY > 0) {
      const resistance = Math.min(deltaY * 0.5, threshold * 1.5);
      setPullDistance(resistance);
    }
  }, [isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!stateRef.current.isPulling) return;
    stateRef.current.isPulling = false;
    if (pullDistance >= threshold && onRefresh) {
      setIsRefreshing(true);
      hapticFeedback({ intensity: 'medium' });
      try {
        await Promise.resolve(onRefresh());
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, onRefresh]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ref,
    pullDistance,
    isRefreshing,
    canRefresh: pullDistance >= threshold
  };
}

export function useEdgeSwipeBack(enabled = true) {
  const router = useRouter();
  
  useEffect(() => {
    if (!enabled) return;
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = Math.abs(endY - startY);
      
      if (startX < 30 && deltaX > 50 && deltaY < 50) {
        hapticFeedback();
        router.back();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, router]);
}
