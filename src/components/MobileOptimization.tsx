import { useEffect } from 'react';

/**
 * Mobile-specific performance optimization component
 * Implements strategies to improve Core Web Vitals on mobile devices
 */
const MobileOptimization: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth <= 768 || 
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) return;

    // 1. Optimize scroll performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false;
        });
        ticking = true;
      }
    };

    // 2. Implement passive event listeners for better scrolling
    const passiveSupported = (() => {
      let supported = false;
      try {
        const options: any = {
          get passive() {
            supported = true;
            return false;
          }
        };
        const testFn = () => {};
        window.addEventListener('test' as any, testFn, options);
        window.removeEventListener('test' as any, testFn);
      } catch {
        supported = false;
      }
      return supported;
    })();

    const scrollOptions = passiveSupported ? { passive: true } : false;
    window.addEventListener('scroll', handleScroll, scrollOptions);

    // 3. Lazy load images below the fold
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
        }
      );

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }

    // 4. Optimize font loading on mobile
    if ('fonts' in document) {
      (document as any).fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    // 5. Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      document.documentElement.classList.add('reduce-motion');
    }

    // 6. Network-aware loading
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      // Disable non-essential features on slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.documentElement.classList.add('slow-connection');
        
        // Disable autoplay videos
        document.querySelectorAll('video[autoplay]').forEach((video) => {
          (video as HTMLVideoElement).pause();
        });
      }

      // Monitor for connection changes
      connection.addEventListener('change', () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          document.documentElement.classList.add('slow-connection');
        } else {
          document.documentElement.classList.remove('slow-connection');
        }
      });
    }

    // 7. Battery-aware optimizations
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          // Reduce animations and heavy operations when battery is low
          if (battery.level < 0.2 || !battery.charging) {
            document.documentElement.classList.add('low-battery');
          } else {
            document.documentElement.classList.remove('low-battery');
          }
        };

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        updateBatteryStatus();
      });
    }

    // 8. Defer non-critical scripts
    const deferScripts = () => {
      const scripts = document.querySelectorAll('script[data-defer-mobile]');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.src = script.getAttribute('src') || '';
        newScript.async = true;
        newScript.defer = true;
        document.body.appendChild(newScript);
      });
    };

    // Defer non-critical scripts until after page load
    if (document.readyState === 'complete') {
      setTimeout(deferScripts, 3000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(deferScripts, 3000);
      });
    }

    // 9. Optimize touch events
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });

    // 10. Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default MobileOptimization;
