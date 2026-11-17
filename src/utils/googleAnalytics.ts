/**
 * Google Analytics & Google Ads utility functions
 * 
 * GTM Container: GTM-W8X4TM6V (loaded via _app.tsx)
 * GA4 Measurement ID: G-RP1C5Y4L7M (for Google Analytics tracking)
 * Google Ads ID: AW-17223287399 (for conversion tracking)
 * 
 * All events are pushed to both gtag (for Google Ads conversions)
 * and dataLayer (for GTM triggers/tags).
 */


// Tracking IDs - centralised constants
export const GTM_ID = 'GTM-W8X4TM6V';
export const GA4_MEASUREMENT_ID = 'G-RP1C5Y4L7M';
export const GOOGLE_ADS_ID = 'AW-17223287399';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (command: string, ...params: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Check if Google Analytics / gtag is loaded
 */
export const isGoogleAnalyticsLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Check if dataLayer is available (GTM)
 */
export const isDataLayerReady = (): boolean => {
  return typeof window !== 'undefined' && Array.isArray(window.dataLayer);
};

/**
 * Initialize the data layer if it doesn't exist
 */
export const initializeDataLayer = (): void => {
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = [];
  }
};

/**
 * Push event to GTM dataLayer (so GTM triggers fire)
 */
const pushToDataLayer = (event: Record<string, any>): void => {
  if (isDataLayerReady()) {
    window.dataLayer.push({
      ...event,
      timestamp: Date.now(),
    });
  }
};

/**
 * Track page view
 * Call this on route changes for SPA navigation.
 * Sends to Google Ads config + pushes to dataLayer for GTM.
 */
export const trackPageView = (pagePath?: string, pageTitle?: string): void => {
  const path = typeof window !== 'undefined' ? (pagePath || window.location.pathname) : pagePath || '';
  const title = typeof window !== 'undefined' ? (pageTitle || document.title) : pageTitle || '';

  // Google Ads page-level config
  if (isGoogleAnalyticsLoaded()) {
    window.gtag('config', GOOGLE_ADS_ID, {
      page_path: path,
      page_title: title,
    });
  }

  // GTM dataLayer
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
};

/**
 * Track custom events — fires via both gtag() and dataLayer.push()
 */
export const trackEvent = (
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    custom_parameters?: Record<string, any>;
  }
): void => {
  const eventParams: Record<string, any> = {
    event_category: parameters?.event_category || 'engagement',
    event_label: parameters?.event_label,
    value: parameters?.value,
    ...parameters?.custom_parameters,
  };

  // gtag (Google Ads / GA4 direct)
  if (isGoogleAnalyticsLoaded()) {
    window.gtag('event', eventName, eventParams);
  }

  // GTM dataLayer
  pushToDataLayer({
    event: eventName,
    ...eventParams,
  });
};

/**
 * Track form start (when user begins filling a form)
 */
export const trackFormStart = (
  formName: string,
  formId?: string,
  additionalParams?: Record<string, any>
): void => {
  trackEvent('form_start', {
    event_category: 'form',
    event_label: formName,
    custom_parameters: {
      form_name: formName,
      form_id: formId,
      ...additionalParams,
    },
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (
  formName: string,
  formType?: string,
  additionalParams?: Record<string, any>
): void => {
  trackEvent('form_submit', {
    event_category: 'form',
    event_label: formName,
    custom_parameters: {
      form_name: formName,
      form_type: formType,
      ...additionalParams,
    },
  });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
  buttonName: string,
  section?: string,
  additionalParams?: Record<string, any>
): void => {
  trackEvent('click', {
    event_category: 'button',
    event_label: buttonName,
    custom_parameters: {
      button_name: buttonName,
      section: section,
      ...additionalParams,
    },
  });
};

/**
 * Track file downloads
 */
export const trackDownload = (
  fileName: string,
  fileType?: string,
  source?: string
): void => {
  trackEvent('file_download', {
    event_category: 'download',
    event_label: fileName,
    custom_parameters: {
      file_name: fileName,
      file_type: fileType,
      source: source,
    },
  });
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (
  url: string,
  linkText?: string,
  source?: string
): void => {
  trackEvent('click', {
    event_category: 'external_link',
    event_label: url,
    custom_parameters: {
      link_url: url,
      link_text: linkText,
      source: source,
    },
  });
};

/**
 * Track video interactions
 */
export const trackVideoInteraction = (
  action: 'play' | 'pause' | 'complete',
  videoTitle: string,
  progress?: number
): void => {
  trackEvent('video_' + action, {
    event_category: 'video',
    event_label: videoTitle,
    value: progress,
    custom_parameters: {
      video_title: videoTitle,
      video_progress: progress,
    },
  });
};

/**
 * Track search events
 */
export const trackSearch = (
  searchTerm: string,
  searchCategory?: string,
  resultsCount?: number
): void => {
  trackEvent('search', {
    event_category: 'search',
    event_label: searchTerm,
    value: resultsCount,
    custom_parameters: {
      search_term: searchTerm,
      search_category: searchCategory,
      results_count: resultsCount,
    },
  });
};

/**
 * Track e-commerce events (for future use)
 */
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string = 'EUR',
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>
): void => {
  trackEvent('purchase', {
    custom_parameters: {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    },
  });
};

/**
 * Track user engagement
 */
export const trackEngagement = (
  engagementType: string,
  content: string,
  duration?: number
): void => {
  trackEvent('engagement', {
    event_category: 'user_engagement',
    event_label: engagementType,
    value: duration,
    custom_parameters: {
      engagement_type: engagementType,
      content: content,
      duration: duration,
    },
  });
};

/**
 * Track lead generation
 */
export const trackLead = (
  leadType: string,
  leadValue?: number,
  source?: string,
  additionalParams?: Record<string, any>
): void => {
  trackEvent('generate_lead', {
    event_category: 'lead',
    event_label: leadType,
    value: leadValue,
    custom_parameters: {
      lead_type: leadType,
      lead_source: source,
      ...additionalParams,
    },
  });
};

/**
 * Track contact attempts
 */
export const trackContact = (
  contactMethod: 'email' | 'phone' | 'whatsapp' | 'form',
  source?: string,
  additionalParams?: Record<string, any>
): void => {
  trackEvent('contact', {
    event_category: 'contact',
    event_label: contactMethod,
    custom_parameters: {
      contact_method: contactMethod,
      source: source,
      ...additionalParams,
    },
  });
};

/**
 * Track WhatsApp interactions
 */
export const trackWhatsApp = (
  phoneNumber: string,
  source?: string,
  message?: string,
  additionalParams?: Record<string, any>
): void => {
  trackEvent('whatsapp_click', {
    event_category: 'contact',
    event_label: 'whatsapp_interaction',
    custom_parameters: {
      contact_method: 'whatsapp',
      phone_number: phoneNumber,
      source: source,
      message_preview: message,
      ...additionalParams,
    },
  });
};

/**
 * Track social media interactions
 */
export const trackSocialInteraction = (
  platform: string,
  action: string,
  target?: string
): void => {
  trackEvent('social_interaction', {
    event_category: 'social',
    event_label: platform,
    custom_parameters: {
      social_platform: platform,
      social_action: action,
      social_target: target,
    },
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage: number, page?: string): void => {
  trackEvent('scroll', {
    event_category: 'engagement',
    event_label: `${percentage}%`,
    value: percentage,
    custom_parameters: {
      scroll_percentage: percentage,
      page: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
    },
  });
};

/**
 * Track timing events
 */
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
): void => {
  trackEvent('timing_complete', {
    event_category: category,
    event_label: label || variable,
    value: value,
    custom_parameters: {
      timing_category: category,
      timing_variable: variable,
      timing_value: value,
    },
  });
};

/**
 * Track exceptions/errors
 */
export const trackException = (
  description: string,
  fatal: boolean = false,
  additionalParams?: Record<string, any>
): void => {
  trackEvent('exception', {
    event_category: 'error',
    event_label: description,
    custom_parameters: {
      description: description,
      fatal: fatal,
      ...additionalParams,
    },
  });
};

/**
 * Enhanced conversion tracking for Google Ads.
 *
 * @param conversionLabel - The conversion label from Google Ads dashboard
 *   (e.g. "AbCdEfGh123"). If you are using GTM to fire conversions,
 *   pass a descriptive label here — it will still be pushed to
 *   dataLayer for GTM triggers, but the direct gtag() call requires
 *   the real label from Ads > Tools > Conversions to register.
 */
export const trackConversion = (
  conversionLabel: string,
  value?: number,
  currency: string = 'AED',
  transactionId?: string
): void => {
  if (isGoogleAnalyticsLoaded()) {
    window.gtag('event', 'Form Submit', {
      send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
      value: value,
      currency: currency,
      transaction_id: transactionId || `conv_${Date.now()}`,
    });
  }

  // Also push to dataLayer for GTM
  pushToDataLayer({
    event: 'Form Submit',
    conversion_id: GOOGLE_ADS_ID,
    conversion_label: conversionLabel,
    value: value,
    currency: currency,
    transaction_id: transactionId || `conv_${Date.now()}`,
  });
};

/**
 * Track user properties (for segmentation)
 */
export const setUserProperties = (properties: Record<string, any>): void => {
  if (isGoogleAnalyticsLoaded()) {
    window.gtag('set', 'user_properties', properties);
  }

  pushToDataLayer({
    event: 'user_properties_update',
    user_properties: properties,
  });
};

/**
 * Event tracking specific to real estate business
 */
export const trackPropertyView = (
  propertyId: string,
  propertyTitle: string,
  propertyType: string,
  price: number,
  location: string
): void => {
  trackEvent('view_item', {
    event_category: 'property',
    event_label: propertyTitle,
    value: price,
    custom_parameters: {
      property_id: propertyId,
      property_title: propertyTitle,
      property_type: propertyType,
      property_price: price,
      property_location: location,
      content_type: 'property',
    },
  });
};

export const trackPropertyInquiry = (
  propertyId: string,
  propertyTitle: string,
  inquiryType: string,
  userEmail?: string
): void => {
  trackEvent('property_inquiry', {
    event_category: 'property',
    event_label: propertyTitle,
    custom_parameters: {
      property_id: propertyId,
      property_title: propertyTitle,
      inquiry_type: inquiryType,
      user_email: userEmail,
    },
  });
};

export const trackPropertyFavorite = (
  propertyId: string,
  propertyTitle: string,
  action: 'add' | 'remove'
): void => {
  trackEvent(action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
    event_category: 'property',
    event_label: propertyTitle,
    custom_parameters: {
      property_id: propertyId,
      property_title: propertyTitle,
      wishlist_action: action,
    },
  });
};

/**
 * Track meeting scheduling events
 */
export const trackMeetingSchedule = (
  stage: 'opened' | 'type_selected' | 'date_selected' | 'time_selected' | 'form_started' | 'submitted' | 'success' | 'error',
  meetingType?: string,
  additionalParams?: Record<string, any>
): void => {
  trackEvent(`meeting_schedule_${stage}`, {
    event_category: 'meeting',
    event_label: meetingType || 'general',
    custom_parameters: {
      meeting_type: meetingType,
      schedule_stage: stage,
      ...additionalParams,
    },
  });

  // Fire a conversion on successful booking
  if (stage === 'success') {
    trackConversion('meeting_booked', 500, 'AED', `meeting_${Date.now()}`);
  }
};

/**
 * Madrid Roadshow specific events
 */
export const trackRoadshowPageView = (language: string): void => {
  trackEvent('roadshow_page_view', {
    event_category: 'event',
    event_label: 'Madrid Roadshow 2025',
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      event_date: '2025-11-20',
      page_language: language,
      event_type: 'real_estate_roadshow',
    },
  });
};

export const trackRoadshowRegistration = (
  country: string,
  propertyType: string,
  formCompletionStage: 'started' | 'completed' | 'failed'
): void => {
  trackEvent('roadshow_registration', {
    event_category: 'event_registration',
    event_label: 'Madrid Roadshow 2025',
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      user_country: country,
      property_interest: propertyType,
      form_completion: formCompletionStage,
      event_date: '2025-11-20',
    },
  });
};

export const trackRoadshowCTAClick = (
  ctaLocation: string,
  ctaText: string
): void => {
  trackEvent('roadshow_cta_click', {
    event_category: 'event_engagement',
    event_label: ctaText,
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      cta_location: ctaLocation,
      cta_text: ctaText,
    },
  });
};

export const trackRoadshowModalInteraction = (
  action: 'open' | 'close' | 'submit',
  source?: string
): void => {
  trackEvent('roadshow_modal_interaction', {
    event_category: 'modal',
    event_label: action,
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      modal_action: action,
      modal_source: source,
    },
  });
};
