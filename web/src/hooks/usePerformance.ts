'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualScrollResult {
  virtualItems: Array<{
    index: number;
    style: {
      position: string;
      top: number;
      left: string;
      width: string;
      height: number;
    };
  }>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
}

export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3
}: VirtualScrollOptions): [VirtualScrollResult, (scrollTop: number) => void] {
  const [scrollTop, setScrollTop] = useState(0);

  const updateScrollTop = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  const result = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      itemCount - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const virtualItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: '0',
          width: '100%',
          height: itemHeight
        }
      });
    }

    return {
      virtualItems,
      totalHeight: itemCount * itemHeight,
      startIndex,
      endIndex
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  return [result, updateScrollTop];
}

export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number | null>(null);

  const throttledCallback = useCallback(
    function throttledFn(...args: unknown[]) {
      const now = Date.now();
      if (lastRun.current === null || now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  );

  return throttledCallback as T;
}

export function useLazyLoad<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
): [T | null, boolean, Error | null] {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const stableFetchFn = useRef(fetchFn);
  
  useEffect(() => {
    stableFetchFn.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await stableFetchFn.current();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [data, loading, error];
}

export function useMediaQuery(query: string): boolean {
  const getMatches = (q: string): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(q).matches;
  };

  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    const currentMatches = media.matches;
    
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    if (currentMatches !== matches) {
      setMatches(currentMatches);
    }
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
