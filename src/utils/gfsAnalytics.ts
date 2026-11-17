/**
 * GFS Development Analytics Integration
 * Combines GTM, Facebook Pixel, and Google Analytics tracking for the GFS page
 */

import { 
  gtmTrackPageView, 
  gtmTrackEvent, 
  gtmTrackFormSubmit, 
  gtmTrackFormStart,
  gtmTrackButtonClick, 
  gtmTrackContact,
  gtmTrackLead,
  gtmSetUserProperties
} from './gtm';

import { 
  trackPageView as pixelTrackPageView,
  trackLead as pixelTrackLead,
  trackContact as pixelTrackContact,
  trackViewContent,
  trackCustomEvent as pixelTrackCustomEvent,
  trackButtonClick as pixelTrackButtonClick,
  isMetaPixelLoaded
} from './metaPixel';

// Google Analytics 4 tracking via gtag (if available)
// Note: gtag interface is already declared in gtm.ts

/**
 * Track page view across all platforms
 */
export const trackGFSPageView = (language: string = 'en'): void => {
  // GTM Page View
  gtmTrackPageView('GFS Development - Dubai Property Payment Plan', '/gfs-development', {
    content_group1: 'Property Pages',
    content_group2: 'Dubai Properties', 
    content_group3: 'GFS Development',
    language,
    page_type: 'property_landing',
    user_type: 'prospect',
    property_developer: 'GFS Developments',
    property_location: 'Dubai',
    payment_plan: '0.5% Monthly',
  });

  // Facebook Pixel Page View
  pixelTrackPageView();

  // Facebook Pixel View Content
  trackViewContent({
    content_name: 'GFS Development Dubai Property',
    content_category: 'Real Estate',
    content_ids: ['gfs-dubai-property'],
    value: 999,
    currency: 'AED'
  });

  // Google Analytics (if available)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: 'GFS Development - Dubai Property Payment Plan',
      page_location: window.location.href,
      content_group1: 'Property Pages',
      content_group2: 'Dubai Properties',
      custom_map: {
        custom_parameter_1: 'GFS Development',
        custom_parameter_2: 'Dubai Property',
        custom_parameter_3: '0.5% Payment Plan'
      }
    });
  }

  // Set user properties
  gtmSetUserProperties({
    property_interest: 'Dubai Real Estate',
    developer_preference: 'GFS Developments',
    payment_plan_interest: '0.5% Monthly',
    price_range: 'AED 500K - 1M',
    visit_timestamp: new Date().toISOString()
  });
};

/**
 * Track virtual tour interaction
 */
export const trackVirtualTour = (action: 'open' | 'close' | 'view'): void => {
  // GTM Event
  gtmTrackEvent('virtual_tour_interaction', {
    event_category: 'property_engagement',
    event_label: 'GFS Development Virtual Tour',
    custom_parameters: {
      tour_action: action,
      property_name: 'GFS Development Dubai',
      engagement_type: 'virtual_tour',
      tour_type: 'matterport_3d'
    }
  });

  // Facebook Pixel
  pixelTrackCustomEvent('VirtualTourInteraction', {
    action,
    property_name: 'GFS Development Dubai',
    tour_type: '3D Virtual Tour'
  });

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'virtual_tour_interaction', {
      event_category: 'engagement',
      event_label: action,
      custom_map: {
        property_name: 'GFS Development Dubai',
        tour_action: action
      }
    });
  }
};

/**
 * Track property reservation/booking
 */
export const trackPropertyReservation = (formData: {
  fullName: string;
  email: string;
  phone: string;
  nationality?: string;
  stage: 'started' | 'completed' | 'failed';
}): void => {
  const leadValue = 25000; // AED booking amount

  if (formData.stage === 'completed') {
    // GTM Lead Event
    gtmTrackLead({
      lead_type: 'Property Reservation',
      lead_source: 'GFS Development Landing Page',
      content_name: 'GFS Dubai Property Booking',
      value: leadValue,
      currency: 'AED',
      transaction_id: `gfs_booking_${Date.now()}`,
      custom_parameters: {
        property_name: 'GFS Development Dubai',
        booking_amount: leadValue,
        payment_plan: '0.5% Monthly',
        nationality: formData.nationality,
        lead_quality: 'high_intent',
        form_source: 'property_page'
      }
    });

    // Facebook Pixel Lead
    pixelTrackLead({
      content_name: 'GFS Dubai Property Booking',
      content_category: 'Real Estate Reservation',
      value: leadValue,
      currency: 'AED'
    });

    // Google Analytics Conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'generate_lead', {
        event_category: 'lead_generation',
        value: leadValue,
        currency: 'AED',
        custom_map: {
          lead_type: 'Property Reservation',
          property_name: 'GFS Development Dubai',
          booking_amount: leadValue
        }
      });

      // Enhanced ecommerce for Google Analytics
      window.gtag('event', 'purchase', {
        transaction_id: `gfs_booking_${Date.now()}`,
        value: leadValue,
        currency: 'AED',
        items: [{
          item_id: 'gfs-dubai-property',
          item_name: 'GFS Development Dubai Property',
          item_category: 'Real Estate',
          item_variant: '0.5% Payment Plan',
          price: leadValue,
          quantity: 1
        }]
      });
    }
  }

  // Form tracking
  const eventName = `property_reservation_${formData.stage}`;
  gtmTrackEvent(eventName, {
    event_category: 'form_interaction',
    event_label: 'GFS Property Booking Form',
    value: formData.stage === 'completed' ? leadValue : undefined,
    custom_parameters: {
      form_stage: formData.stage,
      property_name: 'GFS Development Dubai',
      nationality: formData.nationality,
      form_type: 'property_booking'
    }
  });
};

/**
 * Track form interactions (start, complete, error)
 */
export const trackGFSFormInteraction = (
  action: 'start' | 'submit' | 'error',
  formName: string = 'GFS Property Booking',
  formData?: any
): void => {
  if (action === 'start') {
    gtmTrackFormStart(formName, 'gfs-booking-form');
    pixelTrackCustomEvent('FormStart', {
      form_name: formName,
      property_name: 'GFS Development Dubai'
    });
  } else if (action === 'submit') {
    gtmTrackFormSubmit(formName, {
      form_id: 'gfs-booking-form',
      form_type: 'property_booking',
      lead_value: 25000,
      currency: 'AED'
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', `form_${action}`, {
      event_category: 'form_interaction',
      event_label: formName,
      custom_map: {
        property_name: 'GFS Development Dubai',
        form_action: action
      }
    });
  }
};

/**
 * Track button clicks with enhanced data
 */
export const trackGFSButtonClick = (
  buttonText: string,
  buttonType: 'cta' | 'contact' | 'info' | 'navigation',
  location: string
): void => {
  // GTM Button Click
  gtmTrackButtonClick(buttonText, location, {
    button_type: buttonType,
    property_name: 'GFS Development Dubai',
    page_type: 'property_landing'
  });

  // Facebook Pixel
  pixelTrackButtonClick(buttonText, {
    button_type: buttonType,
    button_location: location,
    property_name: 'GFS Development Dubai'
  });

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'button_click',
      event_label: buttonText,
      custom_map: {
        button_type: buttonType,
        button_location: location,
        property_name: 'GFS Development Dubai'
      }
    });
  }
};

/**
 * Track contact interactions (phone, WhatsApp, email)
 */
export const trackGFSContact = (
  contactType: 'phone' | 'whatsapp' | 'email',
  contactValue: string,
  source: string
): void => {
  // GTM Contact Event
  gtmTrackContact(contactType, contactValue, source, {
    property_name: 'GFS Development Dubai',
    contact_intent: 'property_inquiry',
    lead_score: 'high'
  });

  // Facebook Pixel Contact
  pixelTrackContact({
    content_name: 'GFS Dubai Property Contact'
  });

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact', {
      event_category: 'contact_interaction',
      event_label: contactType,
      custom_map: {
        contact_method: contactType,
        contact_source: source,
        property_name: 'GFS Development Dubai'
      }
    });
  }
};

/**
 * Track scroll depth milestones
 */
export const trackGFSScrollDepth = (percentage: number): void => {
  gtmTrackEvent('scroll', {
    event_category: 'user_engagement',
    event_label: `${percentage}% Scroll Depth`,
    value: percentage,
    custom_parameters: {
      scroll_percentage: percentage,
      property_name: 'GFS Development Dubai',
      page_type: 'property_landing'
    }
  });

  // Facebook Pixel
  if (percentage >= 75) { // Track deep engagement
    pixelTrackCustomEvent('DeepPageEngagement', {
      scroll_depth: percentage,
      property_name: 'GFS Development Dubai'
    });
  }

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      value: percentage,
      custom_map: {
        scroll_depth: percentage,
        property_name: 'GFS Development Dubai'
      }
    });
  }
};

/**
 * Track project views (Coventry Gardens, etc.)
 */
export const trackProjectView = (projectName: string): void => {
  gtmTrackEvent('project_view', {
    event_category: 'property_engagement',
    event_label: projectName,
    custom_parameters: {
      project_name: projectName,
      developer: 'GFS Developments',
      view_source: 'gfs_development_page'
    }
  });

  // Facebook Pixel
  pixelTrackCustomEvent('ProjectView', {
    project_name: projectName,
    developer: 'GFS Developments'
  });

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'property_catalog',
      event_label: projectName,
      custom_map: {
        project_name: projectName,
        developer: 'GFS Developments'
      }
    });
  }
};

/**
 * Track FAQ interaction
 */
export const trackFAQInteraction = (question: string, action: 'open' | 'close'): void => {
  gtmTrackEvent('faq_interaction', {
    event_category: 'content_engagement',
    event_label: question,
    custom_parameters: {
      faq_action: action,
      faq_question: question,
      property_name: 'GFS Development Dubai'
    }
  });

  // Facebook Pixel
  pixelTrackCustomEvent('FAQInteraction', {
    action,
    question: question.substring(0, 50) // Truncate for pixel
  });
};

/**
 * Track page exit intent
 */
export const trackExitIntent = (): void => {
  gtmTrackEvent('exit_intent', {
    event_category: 'user_behavior',
    event_label: 'Page Exit Intent',
    custom_parameters: {
      property_name: 'GFS Development Dubai',
      page_type: 'property_landing',
      exit_trigger: 'mouse_leave'
    }
  });

  pixelTrackCustomEvent('ExitIntent', {
    property_name: 'GFS Development Dubai'
  });
};

/**
 * Initialize GFS-specific tracking on page load
 */
export const initializeGFSTracking = (): (() => void) => {
  // Track page view immediately
  trackGFSPageView();

  // Set up scroll tracking
  let scrollDepthTracked = new Set<number>();
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
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
            trackGFSScrollDepth(milestone);
          }
        }
        
        ticking = false;
      });
      ticking = true;
    }
  };

  // Throttle scroll events
  let scrollTimeout: NodeJS.Timeout;
  const throttledScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 1000);
  };

  window.addEventListener('scroll', throttledScroll, { passive: true });

  // Track exit intent
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0) {
      trackExitIntent();
    }
  });

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    if (scrollTimeout) clearTimeout(scrollTimeout);
  };
};

/**
 * Track time spent on page
 */
export const trackTimeOnPage = (): void => {
  const startTime = Date.now();
  
  const trackTimeSpent = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
    
    gtmTrackEvent('time_on_page', {
      event_category: 'user_engagement',
      event_label: 'GFS Development Page',
      value: timeSpent,
      custom_parameters: {
        time_spent_seconds: timeSpent,
        property_name: 'GFS Development Dubai',
        engagement_level: timeSpent > 120 ? 'high' : timeSpent > 60 ? 'medium' : 'low'
      }
    });

    if (timeSpent > 120) { // 2+ minutes = high engagement
      pixelTrackCustomEvent('HighEngagement', {
        time_spent: timeSpent,
        property_name: 'GFS Development Dubai'
      });
    }
  };

  // Track time on page visibility change or unload
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackTimeSpent();
    }
  });

  window.addEventListener('pagehide', trackTimeSpent);
};

export default {
  trackGFSPageView,
  trackVirtualTour,
  trackPropertyReservation,
  trackGFSFormInteraction,
  trackGFSButtonClick,
  trackGFSContact,
  trackGFSScrollDepth,
  trackProjectView,
  trackFAQInteraction,
  trackExitIntent,
  initializeGFSTracking,
  trackTimeOnPage
};
