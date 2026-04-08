'use client';

import { useState, useMemo, useCallback } from 'react';
import { debounce } from '@/lib/performance';

export function useDebouncedSearch(
  initialValue: string = '',
  delay: number = 300
): [string, string, (value: string) => void] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  const debouncedSetSearch = useMemo(
    () => debounce((newValue: string) => {
      setDebouncedValue(newValue);
    }, delay),
    [delay]
  );

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    debouncedSetSearch(newValue);
  }, [debouncedSetSearch]);

  return [value, debouncedValue, handleChange];
}
