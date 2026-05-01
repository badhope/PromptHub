'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delayMs: number = 300
) {
  const timeoutRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delayMs);
    },
    [callback, delayMs]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return [debouncedCallback, cancel] as const;
}

export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delayMs: number = 300
) {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRunRef.current >= delayMs) {
        lastRunRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          lastRunRef.current = Date.now();
          callback(...args);
        }, delayMs - (now - lastRunRef.current));
      }
    },
    [callback, delayMs]
  );

  return throttledCallback;
}
