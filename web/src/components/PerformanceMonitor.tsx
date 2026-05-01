'use client';

import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  firstInputDelay: number | null;
  cumulativeLayoutShift: number | null;
  timeToFirstByte: number | null;
  domContentLoaded: number | null;
  loadComplete: number | null;
  memoryUsage: number | null;
  connectionType: string;
}

interface PerformanceMonitorProps {
  showInDev?: boolean;
  logToConsole?: boolean;
}

export function usePerformanceMonitor(options: PerformanceMonitorProps = {}) {
  const { logToConsole = true } = options;
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    firstContentfulPaint: null,
    largestContentfulPaint: null,
    firstInputDelay: null,
    cumulativeLayoutShift: null,
    timeToFirstByte: null,
    domContentLoaded: null,
    loadComplete: null,
    memoryUsage: null,
    connectionType: 'unknown',
  });

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    const perfEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (perfEntries) {
      setMetrics(prev => ({
        ...prev,
        timeToFirstByte: perfEntries.responseStart - perfEntries.requestStart,
        domContentLoaded: perfEntries.domContentLoadedEventEnd - perfEntries.startTime,
        loadComplete: perfEntries.loadEventEnd - perfEntries.startTime,
      }));
    }

    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      setMetrics(prev => ({
        ...prev,
        firstContentfulPaint: fcpEntry.startTime,
      }));
    }

    if ('connection' in navigator) {
      const conn = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      if (conn) {
        setMetrics(prev => ({
          ...prev,
          connectionType: conn.effectiveType || 'unknown',
        }));
      }
    }

    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
      if (memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / (1024 * 1024),
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observers: PerformanceObserver[] = [];

    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lastEntry.startTime,
          }));
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        observers.push(lcpObserver);

        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          setMetrics(prev => ({
            ...prev,
            firstInputDelay: (firstEntry as PerformanceEventTiming).processingStart - firstEntry.startTime,
          }));
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        observers.push(fidObserver);

        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          setMetrics(prev => ({
            ...prev,
            cumulativeLayoutShift: clsValue,
          }));
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        observers.push(clsObserver);
      } catch (e) {
        console.warn('PerformanceObserver not fully supported:', e);
      }
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (document.readyState === 'complete') {
      const timeoutId = setTimeout(measurePerformance, 0);
      return () => clearTimeout(timeoutId);
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [measurePerformance]);

  useEffect(() => {
    if (logToConsole && metrics.firstContentfulPaint !== null) {
      if (process.env.NODE_ENV === 'development') {
        console.group('📊 Performance Metrics');
        console.log(`FCP: ${metrics.firstContentfulPaint?.toFixed(2)}ms`);
        console.log(`LCP: ${metrics.largestContentfulPaint?.toFixed(2)}ms`);
        console.log(`FID: ${metrics.firstInputDelay?.toFixed(2)}ms`);
        console.log(`CLS: ${metrics.cumulativeLayoutShift?.toFixed(4)}`);
        console.log(`TTFB: ${metrics.timeToFirstByte?.toFixed(2)}ms`);
        console.log(`DCL: ${metrics.domContentLoaded?.toFixed(2)}ms`);
        console.log(`Load: ${metrics.loadComplete?.toFixed(2)}ms`);
        if (metrics.memoryUsage) {
          console.log(`Memory: ${metrics.memoryUsage?.toFixed(2)}MB`);
        }
        console.log(`Connection: ${metrics.connectionType}`);
        console.groupEnd();
      }
    }
  }, [metrics, logToConsole]);

  const getScore = useCallback((): { score: number; rating: string } => {
    let score = 100;
    
    if (metrics.firstContentfulPaint !== null) {
      if (metrics.firstContentfulPaint > 3000) score -= 25;
      else if (metrics.firstContentfulPaint > 1800) score -= 10;
    }
    
    if (metrics.largestContentfulPaint !== null) {
      if (metrics.largestContentfulPaint > 4000) score -= 30;
      else if (metrics.largestContentfulPaint > 2500) score -= 15;
    }
    
    if (metrics.firstInputDelay !== null) {
      if (metrics.firstInputDelay > 300) score -= 20;
      else if (metrics.firstInputDelay > 100) score -= 10;
    }
    
    if (metrics.cumulativeLayoutShift !== null) {
      if (metrics.cumulativeLayoutShift > 0.25) score -= 15;
      else if (metrics.cumulativeLayoutShift > 0.1) score -= 5;
    }

    let rating = 'excellent';
    if (score < 50) rating = 'poor';
    else if (score < 75) rating = 'needs-improvement';
    else if (score < 90) rating = 'good';

    return { score: Math.max(0, score), rating };
  }, [metrics]);

  return { metrics, getScore };
}

export function PerformanceMonitor(props: PerformanceMonitorProps = {}) {
  const { showInDev = false } = props;
  const { metrics, getScore } = usePerformanceMonitor(props);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined' && showInDev && process.env.NODE_ENV === 'development') {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  const { score, rating } = getScore();

  const ratingColors: Record<string, string> = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    'needs-improvement': 'bg-yellow-500',
    poor: 'bg-red-500',
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50 text-xs font-mono max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-900 dark:text-white">Performance</span>
        <div className={`px-2 py-0.5 rounded text-white ${ratingColors[rating]}`}>
          {score} - {rating}
        </div>
      </div>
      <div className="space-y-1 text-gray-600 dark:text-gray-400">
        {metrics.firstContentfulPaint !== null && (
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={metrics.firstContentfulPaint > 2000 ? 'text-red-500' : 'text-green-500'}>
              {metrics.firstContentfulPaint.toFixed(0)}ms
            </span>
          </div>
        )}
        {metrics.largestContentfulPaint !== null && (
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={metrics.largestContentfulPaint > 2500 ? 'text-red-500' : 'text-green-500'}>
              {metrics.largestContentfulPaint.toFixed(0)}ms
            </span>
          </div>
        )}
        {metrics.firstInputDelay !== null && (
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={metrics.firstInputDelay > 100 ? 'text-red-500' : 'text-green-500'}>
              {metrics.firstInputDelay.toFixed(0)}ms
            </span>
          </div>
        )}
        {metrics.cumulativeLayoutShift !== null && (
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={metrics.cumulativeLayoutShift > 0.1 ? 'text-red-500' : 'text-green-500'}>
              {metrics.cumulativeLayoutShift.toFixed(4)}
            </span>
          </div>
        )}
        {metrics.timeToFirstByte !== null && (
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span>{metrics.timeToFirstByte.toFixed(0)}ms</span>
          </div>
        )}
        {metrics.memoryUsage !== null && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{metrics.memoryUsage.toFixed(1)}MB</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Connection:</span>
          <span>{metrics.connectionType}</span>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="mt-2 w-full py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        Close (Ctrl+Shift+P)
      </button>
    </div>
  );
}

export default PerformanceMonitor;
