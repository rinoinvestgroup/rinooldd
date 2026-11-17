import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Mobile-optimized Web Vitals monitoring component
 * Tracks Core Web Vitals with mobile-specific thresholds
 * Note: Using INP instead of deprecated FID
 */
const MobileWebVitals: React.FC = () => {
  useEffect(() => {
    // Only run in production and on client side
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return;
    }

    // Check if mobile device
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const sendToAnalytics = (metric: Metric) => {
      // Send to Google Analytics 4
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
          device_type: isMobile ? 'mobile' : 'desktop',
        });
      }

      // Send to GTM for more detailed tracking
      if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
          event: 'web_vitals',
          metric_name: metric.name,
          metric_value: metric.value,
          metric_rating: getMetricRating(metric),
          device_type: isMobile ? 'mobile' : 'desktop',
          page_path: window.location.pathname,
        });
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals - ${isMobile ? 'Mobile' : 'Desktop'}]`, {
          name: metric.name,
          value: metric.value,
          rating: getMetricRating(metric),
          id: metric.id,
        });
      }
    };

    // Mobile-specific thresholds (slightly relaxed)
    const getMetricRating = (metric: Metric): 'good' | 'needs-improvement' | 'poor' => {
      const thresholds = isMobile ? {
        // Mobile thresholds (more lenient)
        LCP: { good: 3000, poor: 4500 },      // vs desktop: 2500/4000
        INP: { good: 250, poor: 550 },        // vs desktop: 200/500 (replaces FID)
        CLS: { good: 0.15, poor: 0.30 },      // vs desktop: 0.1/0.25
        FCP: { good: 2200, poor: 4500 },      // vs desktop: 1800/3000
        TTFB: { good: 900, poor: 1900 },      // vs desktop: 800/1800
      } : {
        // Desktop thresholds (standard)
        LCP: { good: 2500, poor: 4000 },
        INP: { good: 200, poor: 500 },        // replaces FID
        CLS: { good: 0.1, poor: 0.25 },
        FCP: { good: 1800, poor: 3000 },
        TTFB: { good: 800, poor: 1800 },
      };

      const threshold = thresholds[metric.name as keyof typeof thresholds];
      if (!threshold) return 'needs-improvement';

      if (metric.value <= threshold.good) return 'good';
      if (metric.value <= threshold.poor) return 'needs-improvement';
      return 'poor';
    };

    // Collect all Core Web Vitals (using INP instead of deprecated FID)
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);  // Updated: INP replaces FID
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    // Mobile-specific performance monitoring
    if (isMobile && 'PerformanceObserver' in window) {
      try {
        // Monitor long tasks (> 50ms) on mobile
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              if (typeof window.dataLayer !== 'undefined') {
                window.dataLayer.push({
                  event: 'long_task',
                  task_duration: entry.duration,
                  device_type: 'mobile',
                });
              }
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });

        // Monitor layout shifts on mobile
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput && layoutShift.value > 0.1) {
              if (typeof window.dataLayer !== 'undefined') {
                window.dataLayer.push({
                  event: 'layout_shift',
                  shift_value: layoutShift.value,
                  device_type: 'mobile',
                });
              }
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        // Silently fail if observers not supported
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default MobileWebVitals;
