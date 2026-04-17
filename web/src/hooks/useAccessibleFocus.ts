'use client';

import { useRef, useCallback } from 'react';

export function useAccessibleFocus() {
  const containerRef = useRef<HTMLElement>(null);

  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const focusArray = Array.from(focusableElements);
    const currentIndex = focusArray.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'Tab') {
      if (e.shiftKey && currentIndex <= 0) {
        e.preventDefault();
        focusLast();
      } else if (!e.shiftKey && currentIndex >= focusArray.length - 1) {
        e.preventDefault();
        focusFirst();
      }
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  }, [focusFirst, focusLast]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    handleKeyDown,
  };
}

export function a11yButtonProps(onClick: () => void, label?: string) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  };
}
