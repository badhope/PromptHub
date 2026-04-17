'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface VirtualScrollOptions {
  itemHeight: number;
  overscan?: number;
  windowScroller?: boolean;
}

interface VirtualScrollResult<T> {
  virtualItems: T[];
  totalHeight: number;
  containerProps: {
    style: React.CSSProperties;
    ref: React.RefObject<HTMLDivElement | null>;
  };
  innerProps: {
    style: React.CSSProperties;
  };
}

export function useVirtualScroll<T>(
  items: T[],
  { itemHeight, overscan = 5, windowScroller = true }: VirtualScrollOptions
): VirtualScrollResult<T> {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    if (!windowScroller) return;

    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    const handleResize = () => {
      setContainerHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [windowScroller]);

  useEffect(() => {
    if (windowScroller || !containerRef.current) return;

    const container = containerRef.current;
    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [windowScroller]);

  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
    const end = Math.min(items.length, start + visibleItems);
    return {
      startIndex: start,
      endIndex: end,
      offsetY: start * itemHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const virtualItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;

  return {
    virtualItems,
    totalHeight,
    containerProps: {
      style: {
        height: windowScroller ? 'auto' : '100%',
        overflow: windowScroller ? 'visible' : 'auto',
        position: 'relative',
      },
      ref: containerRef,
    },
    innerProps: {
      style: {
        height: totalHeight,
        paddingTop: offsetY,
        boxSizing: 'border-box',
      },
    },
  };
}

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasBeenVisible(true);
        observer.unobserve(element);
      }
    }, {
      rootMargin: '200px',
      threshold: 0.1,
      ...options,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { isVisible, hasBeenVisible, elementRef };
}
