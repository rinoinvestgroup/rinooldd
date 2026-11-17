import "@/styles/globals.css";
import "@/pages/lanplot-spain/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import Script from "next/script";
import { LanguageProvider } from "../context/LanguageContext";
import { SearchProvider, useSearch } from "../context/SearchContext";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { canUseAnalytics } from "../utils/cookies";
import { clearAllBrowserCache, checkAppVersion } from "../utils/cacheManager";

// Lazy load heavy components
const SearchPopup = dynamic(() => import("../components/SearchPopup"), {
  ssr: false
});

const CookieConsent = dynamic(() => import("../components/CookieConsent"), {
  ssr: false
});

const MobileWebVitals = dynamic(() => import("../components/MobileWebVitals"), {
  ssr: false,
  loading: () => null
});

const MobileOptimization = dynamic(() => import("../components/MobileOptimization"), {
  ssr: false,
  loading: () => null
});

// Defer GTM tracking to reduce initial JS
const GTMTracker = dynamic(() => import("../hooks/useGTMTracking").then(mod => {
  function GTMTrackerComponent() {
    mod.useGTMTracking();
    return null;
  }
  return GTMTrackerComponent;
}), {
  ssr: false
});


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // All browsers cache fix - clear stale cache and force latest deployment
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleCacheInvalidation = async () => {
      // Auto-generated build version using build timestamp from env or fallback
      const appVersion = process.env.NEXT_PUBLIC_BUILD_ID || '__BUILD_TIME__';
      const versionChanged = checkAppVersion(appVersion);
      
      if (versionChanged) {
        // Clear all browser caches (service workers, Cache API, etc.)
        await clearAllBrowserCache();
        
        // Prevent infinite reload loop
        const lastClear = sessionStorage.getItem('cache-cleared');
        if (!lastClear) {
          sessionStorage.setItem('cache-cleared', Date.now().toString());
          window.location.reload();
        }
      }
      
      // Clear the reload guard after 5 seconds so future version changes work
      setTimeout(() => {
        sessionStorage.removeItem('cache-cleared');
      }, 5000);
    };
    
    handleCacheInvalidation();
  }, []);

  // Defer Meta Pixel tracking (only if analytics cookies are accepted)
  useEffect(() => {
    // Load tracking only after initial render
    if (typeof window === 'undefined') return;
    
    // Check if analytics cookies are allowed
    if (!canUseAnalytics()) return;
    
    const loadTracking = async () => {
      const { trackPageView: metaTrackPageView } = await import("../utils/metaPixel");
      const { trackPageView: gaTrackPageView } = await import("../utils/googleAnalytics");
      
      const handleRouteChange = () => {
        metaTrackPageView();
        gaTrackPageView();     // Google Ads page view on SPA navigation
      };

      router.events.on('routeChangeComplete', handleRouteChange);
      
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    };
    
    // Delay tracking to after page is interactive - increased for mobile
    const timer = setTimeout(loadTracking, 2000);
    return () => clearTimeout(timer);
  }, [router.events]);

  // Show roadshow popup on initial render (only once per session)
  // useEffect(() => {
  //   // Check for registration trigger in URL
  //   const shouldShowPopup = router.query.register === 'true';
    
  //   // Don't show on thank you page, but allow on Madrid roadshow page if register=true
  //   if (router.pathname === '/madrid-roadshow-thank-you') {
  //     return;
  //   }

  //   // Don't show on Madrid roadshow page unless specifically requested via URL parameter
  //   if (router.pathname === '/madrid-roadshow-2025' && !shouldShowPopup) {
  //     return;
  //   }

  //   // Don't show on Binghatti Vintage page unless specifically requested via URL parameter
  //     if (router.pathname === '/binghatti-vintage' && !shouldShowPopup) {
  //       return;
  //     }

  //   // Don't show on Dubai Maritime City page unless specifically requested via URL parameter
  //   if (router.pathname === '/dubai-maritime-city' && !shouldShowPopup) {
  //     return;
  //   }

  //   // Check if user has already seen the popup in this session (unless forced by URL parameter)
  //   const hasSeenPopup = sessionStorage.getItem('roadshowPopupSeen');
    
  //   if (!hasSeenPopup || shouldShowPopup) {
  //     // Show popup after a short delay for better UX
  //     const timer = setTimeout(() => {
  //       setShowRoadshowPopup(true);
  //       if (!shouldShowPopup) {
  //         sessionStorage.setItem('roadshowPopupSeen', 'true');
  //       }
        
  //       // Track popup view
  //       trackCustomEvent('RoadshowPopupView', {
  //         event: 'Madrid Roadshow 2025',
  //         page: router.pathname,
  //         trigger: shouldShowPopup ? 'url_parameter' : 'initial_render'
  //       });
  //     }, 2000); // 2 second delay

  //     return () => clearTimeout(timer);
  //   }
  // }, [router.pathname, router.query.register]);

  // const handleCloseRoadshowPopup = () => {
  //   setShowRoadshowPopup(false);
    
  //   // Track popup close
  //   trackCustomEvent('RoadshowPopupClose', {
  //     event: 'Madrid Roadshow 2025',
  //     page: router.pathname,
  //     action: 'close'
  //   });
  // };

  return (
    <LanguageProvider>
      <SearchProvider>
        {/* Block deprecated unload events BEFORE Facebook SDK loads */}
        <Script id="unload-blocker" strategy="beforeInteractive">
          {`
            (function() {
              if (typeof window === 'undefined') return;
              
              // Store original methods
              var originalAddEventListener = window.addEventListener;
              var originalRemoveEventListener = window.removeEventListener;
              
              // Permanently block deprecated unload/beforeunload events
              window.addEventListener = function(type, listener, options) {
                if (type === 'unload' || type === 'beforeunload') {
                  // Silently ignore - don't add the listener
                  return;
                }
                return originalAddEventListener.call(this, type, listener, options);
              };
              
              window.removeEventListener = function(type, listener, options) {
                if (type === 'unload' || type === 'beforeunload') {
                  return;
                }
                return originalRemoveEventListener.call(this, type, listener, options);
              };
              
              // Add modern pagehide event for tracking (set up early)
              originalAddEventListener.call(window, 'pagehide', function(event) {
                if (window.fbq && !event.persisted && navigator.sendBeacon) {
                  try {
                    fbq('track', 'PageUnload');
                  } catch(e) {}
                }
              }, { capture: true, passive: true });
            })();
          `}
        </Script>

        {/* Google Tag Manager - Load on user interaction or after delay */}
        <Script id="gtm-loader" strategy="lazyOnload">
          {`
            (function() {
              var gtmLoaded = false;
              function loadGTM() {
                if (gtmLoaded) return;
                gtmLoaded = true;

                // Initialize dataLayer for GTM
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});

                // Load GTM container
                (function(w,d,s,l,i){var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.defer=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-W8X4TM6V');

                // Load gtag.js for Google Ads conversion tracking
                var gtagScript = document.createElement('script');
                gtagScript.async = true;
                gtagScript.defer = true;
                gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17223287399';
                document.head.appendChild(gtagScript);

                // Initialize gtag
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', 'AW-17223287399');
              }
              // Load on user interaction
              ['scroll','mousemove','touchstart','click'].forEach(function(e){
                window.addEventListener(e, loadGTM, {once: true, passive: true});
              });
              // Fallback: load after 5 seconds if no interaction
              setTimeout(loadGTM, 5000);
            })();
          `}
        </Script>

        {/* Meta Pixel Code - Load on user interaction */}
        <Script id="meta-pixel-loader" strategy="lazyOnload">
          {`
            (function() {
              var fbLoaded = false;
              function loadFacebookPixel() {
                if (fbLoaded) return;
                fbLoaded = true;
                
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;t.defer=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                
                // Configure Facebook Pixel to prevent deprecated APIs
                fbq('init', '2326254387772475', {}, {
                  eventID: 'pageview_' + Date.now(),
                  agent: 'plnextjs',
                  em: 'external_id'
                });
                fbq('set', 'autoConfig', false, '2326254387772475');
                fbq('track', 'PageView');
              }
              
              // Load on user interaction
              ['scroll','mousemove','touchstart','click'].forEach(function(e){
                window.addEventListener(e, loadFacebookPixel, {once: true, passive: true});
              });
              // Fallback: load after 4 seconds if no interaction
              setTimeout(loadFacebookPixel, 4000);
            })();
          `}
        </Script>

        {/* Service Worker Registration for Facebook Resource Caching */}
        <Script id="sw-registration" strategy="lazyOnload">
          {`
            if ('serviceWorker' in navigator) {
              // Register service worker with cache-busting query to ensure latest version
              navigator.serviceWorker.register('/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID || Date.now()}')
                .then(function(registration) {
                  console.log('SW registered for Facebook caching:', registration.scope);
                  // Force the new service worker to activate immediately
                  registration.update();
                })
                .catch(function(error) {
                  console.log('SW registration failed:', error);
                });
            }
          `}
        </Script>

        {/* Global GTM Tracking */}
        <GTMTracker />
        {/* Mobile Web Vitals Monitoring */}
        <MobileWebVitals />
        {/* Mobile Performance Optimization */}
        <MobileOptimization />
        <Component {...pageProps} />
        {/* Global Search Popup */}
        <GlobalSearchPopup />
        {/* Global Cookie Consent Popup */}
        <GlobalCookieConsent />
        {/* Vercel Speed Insights */}
        <SpeedInsights />
        {/* Global Roadshow Registration Popup */}
        {/* <RegistrationModal 
          isOpen={showRoadshowPopup}
          onClose={handleCloseRoadshowPopup}
        /> */}
      </SearchProvider>
    </LanguageProvider>
  );
}

// Component to handle the global search popup
function GlobalSearchPopup() {
  const { isSearchOpen, closeSearch } = useSearch();
  
  return (
    <SearchPopup 
      isOpen={isSearchOpen} 
      onClose={closeSearch} 
    />
  );
}

// Component to handle the global cookie consent popup
function GlobalCookieConsent() {
  return <CookieConsent />;
}
