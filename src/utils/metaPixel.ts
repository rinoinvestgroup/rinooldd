/**
 * Meta Pixel (Facebook Pixel) utility functions
 * Provides type-safe methods to track events across the website
 */

// Extend the Window interface to include fbq
declare global {
  interface Window {
    fbq: (action: string, event: string, params?: Record<string, any>) => void;
    _fbq: any;
  }
}

/**
 * Check if Meta Pixel is loaded
 */
export const isMetaPixelLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
};

/**
 * Track page view
 * Call this on route changes
 */
export const trackPageView = (): void => {
  if (isMetaPixelLoaded()) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Track contact form submission
 */
export const trackContact = (params?: { content_name?: string }): void => {
  if (isMetaPixelLoaded()) {
    window.fbq('track', 'Contact', params || {});
  }
};


/**
 * Track property inquiry/lead
 */
export const trackLead = (params?: { 
  content_name?: string; 
  content_category?: string;
  value?: number;
  currency?: string;
}): void => {
  if (isMetaPixelLoaded()) {
    window.fbq('track', 'Lead', params || {});
  }
};

/**
 * Track view content (property details page)
 */
export const trackViewContent = (params: { 
  content_name: string; 
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}): void => {
  if (isMetaPixelLoaded()) {
    window.fbq('track', 'ViewContent', params);
  }
};

/**
 * Track search (property search)
 */
export const trackSearch = (params?: { 
  search_string?: string;
  content_category?: string;
}): void => {
  if (isMetaPixelLoaded()) {
    window.fbq('track', 'Search', params || {});
  }
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, params?: Record<string, any>): void => {
  if (isMetaPixelLoaded()) {
    window.fbq('trackCustom', eventName, params || {});
  }
};

/**
 * Track button click - generic
 */
export const trackButtonClick = (buttonName: string, params?: Record<string, any>): void => {
  trackCustomEvent('ButtonClick', {
    button_name: buttonName,
    ...params
  });
};

/**
 * Track WhatsApp button click
 */
export const trackWhatsAppClick = (source?: string): void => {
  trackCustomEvent('WhatsAppClick', { source });
};

/**
 * Track phone call click
 */
export const trackPhoneClick = (phone: string, source?: string): void => {
  trackCustomEvent('PhoneClick', { phone, source });
};

/**
 * Track email click
 */
export const trackEmailClick = (source?: string): void => {
  trackCustomEvent('EmailClick', { source });
};

/**
 * Track social media click
 */
export const trackSocialClick = (platform: string): void => {
  trackCustomEvent('SocialMediaClick', { platform });
};

/**
 * Track brochure download
 */
export const trackBrochureDownload = (propertyId?: string, propertyName?: string): void => {
  trackCustomEvent('BrochureDownload', {
    property_id: propertyId,
    property_name: propertyName
  });
};
