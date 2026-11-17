/**
 * Global GTM Hook for All Pages
 * Provides comprehensive GTM tracking across the entire website
 */

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { canUseAnalytics } from '@/utils/cookies';

// Lazy load GTM utilities to reduce initial bundle
let gtmUtils: typeof import('@/utils/gtm') | null = null;


const loadGTMUtils = async () => {
  if (!gtmUtils) {
    gtmUtils = await import('@/utils/gtm');
  }
  return gtmUtils;
};

// Page type mapping
const getPageType = (pathname: string): string => {
  if (pathname === '/') return 'homepage';
  if (pathname.startsWith('/properties')) return 'property_listing';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/agents')) return 'agents';
  if (pathname === '/madrid-roadshow-2025') return 'event_page';
  if (pathname.includes('roadshow')) return 'event_page';
  if (pathname.includes('privacy') || pathname.includes('terms') || pathname.includes('cookie')) return 'legal';
  return 'other';
};

// Content group mapping
const getContentGroups = (pathname: string) => {
  const pageType = getPageType(pathname);
  
  const groups = {
    content_group1: 'Website Pages',
    content_group2: pageType,
    content_group3: pathname
  };

  // Specific mappings
  if (pathname.startsWith('/properties/spain')) {
    groups.content_group1 = 'Property Pages';
    groups.content_group2 = 'Spain Properties';
  } else if (pathname.startsWith('/properties/dubai')) {
    groups.content_group1 = 'Property Pages';
    groups.content_group2 = 'Dubai Properties';
  } else if (pathname.startsWith('/blog')) {
    groups.content_group1 = 'Content Pages';
    groups.content_group2 = 'Blog';
  } else if (pathname === '/madrid-roadshow-2025' || pathname.includes('roadshow')) {
    groups.content_group1 = 'Event Pages';
    groups.content_group2 = 'Roadshow';
    groups.content_group3 = 'Madrid 2025';
  }

  return groups;
};

// Extract page language from router
import { NextRouter } from 'next/router';

const getPageLanguage = (router: NextRouter): string => {
  return router.locale || 'en';
};

// Extract UTM parameters
const getUTMParameters = () => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
  };
};

// Utility function to safely check if target is a valid Element with closest method
const isValidElement = (target: any): target is Element => {
  return target && 
         typeof target === 'object' && 
         target instanceof Element && 
         'closest' in target && 
         typeof target.closest === 'function';
};

export const useGTMTracking = () => {
  const router = useRouter();

  // Initialize GTM on mount with lazy loading (only if analytics cookies are accepted)
  useEffect(() => {
    if (!canUseAnalytics()) return;
    
    loadGTMUtils().then(utils => {
      utils.initializeGTM();
    });
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      const utils = await loadGTMUtils();
      const pageType = getPageType(url);
      const contentGroups = getContentGroups(url);
      const language = getPageLanguage(router);
      const utmParams = getUTMParameters();

      // Track page view with enhanced data
      utils.gtmTrackPageView(document.title, url, {
        ...contentGroups,
        language,
        user_type: 'visitor',
        page_type: pageType
      });

      // Track UTM parameters if present
      if (Object.values(utmParams).some(param => param)) {
        utils.gtmTrackEvent('utm_tracking', {
          event_category: 'traffic_source',
          event_label: utmParams.utm_source || 'direct',
          custom_parameters: {
            ...utmParams,
            page_type: pageType,
            page_url: url
          }
        });
      }

      // Set user properties based on page
      utils.gtmSetUserProperties({
        current_page_type: pageType,
        language_preference: language,
        visit_timestamp: new Date().toISOString(),
        page_category: contentGroups.content_group1,
      });
    };

    // Delay initial tracking slightly
    const timer = setTimeout(() => {
      handleRouteChange(router.asPath);
    }, 500);

    // Track subsequent route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      clearTimeout(timer);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Scroll depth tracking with lazy loading
  useEffect(() => {
    let scrollDepthTracked = new Set<number>();
    let ticking = false;
    
    const handleScroll = async () => {
      if (!ticking) {
        window.requestAnimationFrame(async () => {
          const utils = await loadGTMUtils();
          
          // Batch all layout reads together
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          const scrollPercent = Math.round(
            (scrollY / (documentHeight - windowHeight)) * 100
          );

          const milestones = [25, 50, 75, 90, 100];
          
          for (const milestone of milestones) {
            if (scrollPercent >= milestone && !scrollDepthTracked.has(milestone)) {
              scrollDepthTracked.add(milestone);
              utils.gtmTrackScrollDepth(milestone, router.asPath);
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    const throttledScroll = throttle(handleScroll, 1000);
    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [router.asPath]);

  // Auto-track external links with lazy loading
  useEffect(() => {
    const handleLinkClick = async (event: MouseEvent) => {
      try {
        const target = event.target;
        if (!isValidElement(target)) return;
        
        const link = target.closest('a');
        
        if (link && link.href) {
          // Skip auto-tracking for elements opting into manual tracking
          if (link.closest('[data-gtm-manual]')) return;
          const utils = await loadGTMUtils();
          const url = new URL(link.href, window.location.origin);
          
          // Check if it's an external link
          if (url.hostname !== window.location.hostname) {
            utils.gtmTrackExternalLink(
              link.href,
              link.textContent || link.getAttribute('aria-label') || 'External Link',
              getPageType(router.pathname)
            );
          }
          
          // Track specific link types
          if (link.href.includes('wa.me') || link.href.includes('whatsapp')) {
            utils.gtmTrackContact('whatsapp', link.href, getPageType(router.pathname));
          } else if (link.href.startsWith('mailto:')) {
            utils.gtmTrackContact('email', link.href.replace('mailto:', ''), getPageType(router.pathname));
          } else if (link.href.startsWith('tel:')) {
            utils.gtmTrackContact('phone', link.href.replace('tel:', ''), getPageType(router.pathname));
          }
        }
      } catch (error) {
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [router.pathname]);

  // Auto-track button clicks with lazy loading
  useEffect(() => {
    const handleButtonClick = async (event: MouseEvent) => {
      try {
        const target = event.target;
        if (!isValidElement(target)) return;
        
        const button = target.closest('button');
        
        if (button) {
          // Skip auto-tracking for elements opting into manual tracking
          if (button.closest('[data-gtm-manual]')) return;
          const utils = await loadGTMUtils();
          const buttonText = button.textContent || button.getAttribute('aria-label') || 'Button';
          const section = button.closest('section')?.id || button.closest('[data-section]')?.getAttribute('data-section') || 'unknown';
          
          utils.gtmTrackButtonClick(buttonText, section, {
            page_type: getPageType(router.pathname),
            button_type: button.type || 'button',
            button_class: button.className
          });
        }
      } catch (error) {
      }
    };

    document.addEventListener('click', handleButtonClick);
    return () => document.removeEventListener('click', handleButtonClick);
  }, [router.pathname]);

  // Auto-track form interactions (only for forms without manual tracking)
  useEffect(() => {
    let formStartTracked = new Set<string>();

    const handleFormInteraction = async (event: Event) => {
      try {
        const target = event.target;
        if (!isValidElement(target)) return;
        
        const form = target.closest('form');
        
        if (form && !form.hasAttribute('data-gtm-manual')) {
          const utils = await loadGTMUtils();
          const formName = form.getAttribute('name') || form.id || `form_${getPageType(router.pathname)}`;
          
          // Track form start on first input
          if (event.type === 'focus' && !formStartTracked.has(formName)) {
            formStartTracked.add(formName);
            utils.gtmTrackFormStart(formName, form.id);
          }
          
          // Only auto-track submission for non-manual forms
          if (event.type === 'submit' && !form.hasAttribute('data-gtm-manual')) {
            utils.gtmTrackFormSubmit(formName, {
              form_id: form.id,
              form_type: form.getAttribute('data-type') || 'general',
              form_destination: form.action || window.location.href
            });
          }
        }
      } catch (error) {
      }
    };

    // Listen for form events
    document.addEventListener('focus', handleFormInteraction, true);
    document.addEventListener('submit', handleFormInteraction, true);

    return () => {
      document.removeEventListener('focus', handleFormInteraction, true);
      document.removeEventListener('submit', handleFormInteraction, true);
    };
  }, [router.pathname]);

  // Page-specific tracking functions
  const trackPropertyView = useCallback(async (propertyData: {
    id: string;
    title: string;
    type: string;
    price: number;
    location: string;
    currency?: string;
  }) => {
    const utils = await loadGTMUtils();
    utils.gtmTrackEvent('view_item', {
      event_category: 'property_engagement',
      event_label: propertyData.title,
      value: propertyData.price,
      custom_parameters: {
        property_id: propertyData.id,
        property_title: propertyData.title,
        property_type: propertyData.type,
        property_price: propertyData.price,
        property_location: propertyData.location,
        currency: propertyData.currency || 'EUR',
        content_type: 'property'
      }
    });
  }, []);

  const trackPropertyInquiry = useCallback(async (propertyData: {
    id: string;
    title: string;
    inquiryType: string;
    userEmail?: string;
  }) => {
    const utils = await loadGTMUtils();
    utils.gtmTrackEvent('property_inquiry', {
      event_category: 'lead_generation',
      event_label: propertyData.title,
      custom_parameters: {
        property_id: propertyData.id,
        property_title: propertyData.title,
        inquiry_type: propertyData.inquiryType,
        user_email: propertyData.userEmail,
        page_type: 'property_detail'
      }
    });
  }, []);

  const trackBlogRead = useCallback(async (blogData: {
    title: string;
    category: string;
    author?: string;
    readTime?: number;
  }) => {
    const utils = await loadGTMUtils();
    utils.gtmTrackEvent('blog_read', {
      event_category: 'content_engagement',
      event_label: blogData.title,
      custom_parameters: {
        blog_title: blogData.title,
        blog_category: blogData.category,
        blog_author: blogData.author,
        estimated_read_time: blogData.readTime,
        content_type: 'blog_post'
      }
    });
  }, []);

  const trackSearch = useCallback(async (searchData: {
    query: string;
    category?: string;
    resultsCount?: number;
    filters?: Record<string, any>;
  }) => {
    const utils = await loadGTMUtils();
    utils.gtmTrackEvent('search', {
      event_category: 'site_search',
      event_label: searchData.query,
      value: searchData.resultsCount,
      custom_parameters: {
        search_term: searchData.query,
        search_category: searchData.category,
        results_count: searchData.resultsCount,
        search_filters: searchData.filters,
        page_type: getPageType(router.pathname)
      }
    });
  }, [router.pathname]);

  const trackDownload = useCallback(async (downloadData: {
    fileName: string;
    fileType: string;
    source: string;
  }) => {
    const utils = await loadGTMUtils();
    utils.gtmTrackEvent('file_download', {
      event_category: 'download',
      event_label: downloadData.fileName,
      custom_parameters: {
        file_name: downloadData.fileName,
        file_type: downloadData.fileType,
        download_source: downloadData.source,
        page_type: getPageType(router.pathname)
      }
    });
  }, [router.pathname]);

  // Expose wrapper functions for direct GTM utils
  const trackEvent = useCallback(async (...args: Parameters<typeof import('@/utils/gtm').gtmTrackEvent>) => {
    const utils = await loadGTMUtils();
    return utils.gtmTrackEvent(...args);
  }, []);

  const trackButtonClick = useCallback(async (...args: Parameters<typeof import('@/utils/gtm').gtmTrackButtonClick>) => {
    const utils = await loadGTMUtils();
    return utils.gtmTrackButtonClick(...args);
  }, []);

  const trackContact = useCallback(async (...args: Parameters<typeof import('@/utils/gtm').gtmTrackContact>) => {
    const utils = await loadGTMUtils();
    return utils.gtmTrackContact(...args);
  }, []);

  const trackExternalLink = useCallback(async (...args: Parameters<typeof import('@/utils/gtm').gtmTrackExternalLink>) => {
    const utils = await loadGTMUtils();
    return utils.gtmTrackExternalLink(...args);
  }, []);

  return {
    trackPropertyView,
    trackPropertyInquiry,
    trackBlogRead,
    trackSearch,
    trackDownload,
    // Expose other tracking functions
    trackEvent,
    trackButtonClick,
    trackContact,
    trackExternalLink
  };
};

// Utility function to throttle scroll events
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

export default useGTMTracking;
