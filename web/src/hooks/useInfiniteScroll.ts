'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  items: T[];
  initialLoadCount?: number;
  batchSize?: number;
  threshold?: number;
}

interface UseInfiniteScrollResult<T> {
  visibleItems: T[];
  loaderRef: (node: HTMLDivElement | null) => void;
  observerTarget: (node: HTMLDivElement | null) => void;
  hasMore: boolean;
  isLoading: boolean;
  loadedCount: number;
  visibleCount: number;
  totalCount: number;
  reset: () => void;
  loadMore: () => void;
}

export function useInfiniteScroll<T>({
  items,
  initialLoadCount = 24,
  batchSize = 12,
  threshold = 200,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [visibleCount, setVisibleCount] = useState(initialLoadCount);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const totalCount = items.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = window.setTimeout(() => {
      if (mountedRef.current) {
        setVisibleCount(prev => Math.min(prev + batchSize, totalCount));
        setIsLoading(false);
        timerRef.current = null;
      }
    }, 16);
  }, [batchSize, hasMore, isLoading, totalCount]);

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setVisibleCount(initialLoadCount);
    }
  }, [initialLoadCount]);

  const loaderRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!node) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: `${threshold}px` }
    );

    observerRef.current.observe(node);
  }, [hasMore, isLoading, loadMore, threshold]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (mountedRef.current) {
      setVisibleCount(initialLoadCount);
    }
  }, [items.length, initialLoadCount]);

  return {
    visibleItems,
    loaderRef,
    observerTarget: loaderRef,
    hasMore,
    isLoading,
    loadedCount: visibleCount,
    visibleCount,
    totalCount,
    reset,
    loadMore,
  };
}
