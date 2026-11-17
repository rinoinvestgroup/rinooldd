import { useEffect } from 'react';

/**
 * Web Vitals monitoring component
 * Tracks Core Web Vitals metrics: LCP, FID, CLS, FCP, TTFB
 */
const WebVitals = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: PerformanceEntry) => {
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }) => {
            if (!entry.hadRecentInput && entry.value) {
              clsScore += entry.value;
            }
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // First Contentful Paint (FCP)
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
          });
        });
        fcpObserver.observe({ type: 'paint', buffered: true });

        // Time to First Byte (TTFB)
        window.addEventListener('load', () => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            const ttfb = navigation.responseStart - navigation.requestStart;
          }
        });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
          fcpObserver.disconnect();
        };
      } catch (error) {
      }
    }
  }, []);

  return null;
};

export default WebVitals;
