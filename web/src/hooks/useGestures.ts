'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchMove?: boolean;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
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
  const stateRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    stateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: true
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

    const { startX, startY, currentX, currentY } = stateRef.current;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (absY > absX && absY > threshold) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
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

  return ref;
}

interface LongPressConfig {
  onLongPress: () => void;
  delay?: number;
  onPressStart?: () => void;
  onPressEnd?: () => void;
}

export function useLongPress(config: LongPressConfig) {
  const {
    onLongPress,
    delay = 500,
    onPressStart,
    onPressEnd
  } = config;

  const ref = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const handleTouchStart = useCallback(() => {
    setIsLongPress(false);
    
    if (onPressStart) {
      onPressStart();
    }

    timeoutRef.current = setTimeout(() => {
      setIsLongPress(true);
      onLongPress();
    }, delay);
  }, [onLongPress, delay, onPressStart]);

  const handleTouchEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (onPressEnd) {
      onPressEnd();
    }
  }, [onPressEnd]);

  const handleTouchMove = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return { ref, isLongPress };
}

interface PullToRefreshConfig {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
}

export function usePullToRefresh(config: PullToRefreshConfig) {
  const {
    onRefresh,
    threshold = 80,
    resistance = 2.5
  } = config;

  const ref = useRef<HTMLElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const element = ref.current;
    if (!element || element.scrollTop > 0) return;

    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    isPullingRef.current = true;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPullingRef.current || isRefreshing) return;

    const element = ref.current;
    if (!element || element.scrollTop > 0) return;

    const touch = e.touches[0];
    const deltaY = (touch.clientY - startYRef.current) / resistance;

    if (deltaY > 0) {
      setPullDistance(Math.min(deltaY, threshold * 1.5));
    }
  }, [isRefreshing, threshold, resistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return;

    isPullingRef.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

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

  return { ref, isRefreshing, pullDistance };
}

interface DoubleTapConfig {
  onDoubleTap: () => void;
  delay?: number;
}

export function useDoubleTap(config: DoubleTapConfig) {
  const { onDoubleTap, delay = 300 } = config;
  
  const ref = useRef<HTMLElement>(null);
  const lastTapRef = useRef(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;

    if (timeDiff < delay && timeDiff > 0) {
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [onDoubleTap, delay]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('click', handleTap);

    return () => {
      element.removeEventListener('click', handleTap);
    };
  }, [handleTap]);

  return ref;
}

interface PinchConfig {
  onPinchIn?: () => void;
  onPinchOut?: () => void;
  threshold?: number;
}

export function usePinch(config: PinchConfig) {
  const { onPinchIn, onPinchOut, threshold = 10 } = config;
  
  const ref = useRef<HTMLElement>(null);
  const initialDistanceRef = useRef(0);

  const getDistance = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistanceRef.current = getDistance(e.touches);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 2) return;

    const currentDistance = getDistance(e.touches);
    const distanceDiff = currentDistance - initialDistanceRef.current;

    if (Math.abs(distanceDiff) > threshold) {
      if (distanceDiff > 0 && onPinchOut) {
        onPinchOut();
      } else if (distanceDiff < 0 && onPinchIn) {
        onPinchIn();
      }
      initialDistanceRef.current = currentDistance;
    }
  }, [threshold, onPinchIn, onPinchOut]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchMove]);

  return ref;
}
