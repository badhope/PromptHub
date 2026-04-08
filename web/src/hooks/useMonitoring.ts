'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { PerformanceMetrics } from '@/types/skill';

interface ErrorInfo {
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  timestamp: number;
}

export function usePerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-contentful-paint') {
            metricsRef.current.fcp = entry.startTime;
          }
        }

        if (entry.entryType === 'largest-contentful-paint') {
          metricsRef.current.lcp = entry.startTime;
        }

        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          metricsRef.current.fid = fidEntry.processingStart - fidEntry.startTime;
        }

        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as LayoutShift;
          if (!clsEntry.hadRecentInput) {
            metricsRef.current.cls = (metricsRef.current.cls || 0) + clsEntry.value;
          }
        }
      }
    });

    try {
      observer.observe({
        entryTypes: [
          'paint',
          'largest-contentful-paint',
          'first-input',
          'layout-shift'
        ]
      });
    } catch {
      console.warn('Performance observer not supported');
    }

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metricsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  const reportMetrics = useCallback(() => {
    const metrics = getMetrics();
    
    console.group('📊 Performance Metrics');
    console.log('FCP (First Contentful Paint):', metrics.fcp?.toFixed(2), 'ms');
    console.log('LCP (Largest Contentful Paint):', metrics.lcp?.toFixed(2), 'ms');
    console.log('FID (First Input Delay):', metrics.fid?.toFixed(2), 'ms');
    console.log('CLS (Cumulative Layout Shift):', metrics.cls?.toFixed(4));
    console.log('TTFB (Time to First Byte):', metrics.ttfb?.toFixed(2), 'ms');
    console.groupEnd();

    return metrics;
  }, [getMetrics]);

  return {
    getMetrics,
    reportMetrics
  };
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

export function useErrorTracking() {
  const errorsRef = useRef<ErrorInfo[]>([]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error: ErrorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      };

      errorsRef.current.push(error);

      if (process.env.NODE_ENV === 'development') {
        console.error('Error tracked:', error);
      }

      if (typeof window !== 'undefined' && 'trackError' in window) {
        (window as { trackError: (error: ErrorInfo) => void }).trackError(error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error: ErrorInfo = {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      };

      errorsRef.current.push(error);

      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled rejection tracked:', error);
      }

      if (typeof window !== 'undefined' && 'trackError' in window) {
        (window as { trackError: (error: ErrorInfo) => void }).trackError(error);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const getErrors = useCallback(() => {
    return [...errorsRef.current];
  }, []);

  const clearErrors = useCallback(() => {
    errorsRef.current = [];
  }, []);

  const reportErrors = useCallback(() => {
    const errors = getErrors();
    
    console.group('🐛 Error Tracking Report');
    console.log('Total errors:', errors.length);
    errors.forEach((error, index) => {
      console.log(`Error ${index + 1}:`, error);
    });
    console.groupEnd();

    return errors;
  }, [getErrors]);

  return {
    getErrors,
    clearErrors,
    reportErrors
  };
}

export function useNetworkStatus() {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const [online, setOnline] = useState(isOnline);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline: online,
    isOffline: !online
  };
}

import { useState } from 'react';

function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      os: 'unknown' as string,
      browser: 'unknown' as string
    };
  }

  const ua = navigator.userAgent;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  let os = 'unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(ua)) os = 'MacOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iOS|iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

  let browser = 'unknown';
  if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edge/i.test(ua)) browser = 'Edge';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isTouch,
    os,
    browser
  };
}

export function useDeviceDetect() {
  const [deviceInfo] = useState(getDeviceInfo);
  return deviceInfo;
}

export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const performance = window.performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };
    if (!performance?.memory) return;

    const updateMemoryInfo = () => {
      const memory = performance.memory;
      if (memory) {
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();

    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return {
    ...memoryInfo,
    usedMB: formatBytes(memoryInfo.usedJSHeapSize),
    totalMB: formatBytes(memoryInfo.totalJSHeapSize),
    limitMB: formatBytes(memoryInfo.jsHeapSizeLimit),
    usagePercent: ((memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100).toFixed(2)
  };
}
