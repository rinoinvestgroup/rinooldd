/**
 * Google Tag Manager (GTM) Enhanced Implementation
 * Container ID: GTM-W8X4TM6V
 * 
 * This utility provides type-safe methods for GTM tracking
 * with proper dataLayer integration and enhanced ecommerce events
 */

// Type definitions for GTM events
interface GTMEventBase {
  event: string;
  [key: string]: any;
}

interface GTMPageViewEvent extends GTMEventBase {
  event: 'page_view';
  page_title: string;
  page_location: string;
  page_path: string;
  content_group1?: string;
  content_group2?: string;
  content_group3?: string;
  language?: string;
  user_type?: string;
  page_type?: string;
  [key: string]: any; // Allow additional custom parameters
}

interface GTMCustomEvent extends GTMEventBase {
  event: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface GTMEnhancedEcommerceEvent extends GTMEventBase {
  event: 'purchase' | 'begin_checkout' | 'add_to_cart' | 'view_item' | 'generate_lead';
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    item_variant?: string;
    price: number;
    quantity: number;
  }>;
}

interface GTMFormEvent extends GTMEventBase {
  event: 'form_submit' | 'form_start' | 'form_error';
  form_name: string;
  form_id?: string;
  form_destination?: string;
  form_submit_text?: string;
}

interface GTMLeadEvent extends GTMEventBase {
  event: 'generate_lead';
  currency: string;
  value: number;
  lead_type: string;
  lead_source: string;
  content_name: string;
}

// Extend the Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (command: string, ...params: any[]) => void;
  }
}

/**
 * Initialize GTM dataLayer if it doesn't exist
 */
export const initializeGTM = (): void => {
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = [];
  }
};

/**
 * Check if GTM is loaded and dataLayer is available
 */
export const isGTMLoaded = (): boolean => {
  return typeof window !== 'undefined' && Array.isArray(window.dataLayer);
};

/**
 * Push event to GTM dataLayer
 */
const pushToDataLayer = (event: GTMEventBase): void => {
  if (isGTMLoaded()) {
    // Add timestamp to all events
    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now(),
      gtm_timestamp: new Date().toISOString(),
    };
    
    window.dataLayer.push(eventWithTimestamp);
    
  } else {
  }
};

/**
 * Track page views with enhanced data
 */
export const gtmTrackPageView = (
  pageTitle: string,
  pagePath?: string,
  customDimensions?: {
    content_group1?: string;
    content_group2?: string;
    content_group3?: string;
    language?: string;
    user_type?: string;
    page_type?: string;
    [key: string]: any;
  }
): void => {
  const event: GTMPageViewEvent = {
    event: 'page_view',
    page_title: pageTitle,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
    ...customDimensions,
  };
  
  pushToDataLayer(event);
};

/**
 * Track custom events with enhanced parameters
 */
export const gtmTrackEvent = (
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    custom_parameters?: Record<string, any>;
  }
): void => {
  const event: GTMCustomEvent = {
    event: eventName,
    event_category: parameters?.event_category || 'engagement',
    event_label: parameters?.event_label,
    value: parameters?.value,
    ...parameters?.custom_parameters,
  };
  
  pushToDataLayer(event);
};

/**
 * Track form submissions with detailed form data
 */
export const gtmTrackFormSubmit = (
  formName: string,
  formData?: {
    form_id?: string;
    form_destination?: string;
    form_submit_text?: string;
    form_type?: string;
    lead_value?: number;
    currency?: string;
  }
): void => {
  const event: GTMFormEvent = {
    event: 'form_submit',
    form_name: formName,
    form_id: formData?.form_id,
    form_destination: formData?.form_destination,
    form_submit_text: formData?.form_submit_text,
    form_type: formData?.form_type,
    value: formData?.lead_value,
    currency: formData?.currency || 'EUR',
  };
  
  pushToDataLayer(event);
};

/**
 * Track form start (when user begins filling)
 */
export const gtmTrackFormStart = (
  formName: string,
  formId?: string
): void => {
  const event: GTMFormEvent = {
    event: 'form_start',
    form_name: formName,
    form_id: formId,
  };
  
  pushToDataLayer(event);
};

/**
 * Track form errors
 */
export const gtmTrackFormError = (
  formName: string,
  errorMessage: string,
  errorField?: string
): void => {
  const event: GTMFormEvent = {
    event: 'form_error',
    form_name: formName,
    error_message: errorMessage,
    error_field: errorField,
  };
  
  pushToDataLayer(event);
};

/**
 * Track lead generation with enhanced ecommerce
 */
export const gtmTrackLead = (
  leadData: {
    lead_type: string;
    lead_source: string;
    content_name: string;
    value: number;
    currency?: string;
    transaction_id?: string;
    custom_parameters?: Record<string, any>;
  }
): void => {
  const transactionId = leadData.transaction_id || `lead_${Date.now()}`;
  
  // Enhanced ecommerce lead event
  const event: GTMLeadEvent = {
    event: 'generate_lead',
    currency: leadData.currency || 'EUR',
    value: leadData.value,
    lead_type: leadData.lead_type,
    lead_source: leadData.lead_source,
    content_name: leadData.content_name,
    transaction_id: transactionId,
    // Enhanced ecommerce parameters
    ecommerce: {
      transaction_id: transactionId,
      value: leadData.value,
      currency: leadData.currency || 'EUR',
      items: [{
        item_id: transactionId,
        item_name: leadData.content_name,
        item_category: leadData.lead_type,
        item_variant: leadData.lead_source,
        price: leadData.value,
        quantity: 1
      }]
    },
    ...leadData.custom_parameters,
  };
  
  pushToDataLayer(event);
};

/**
 * Track button clicks with source attribution
 */
export const gtmTrackButtonClick = (
  buttonText: string,
  buttonLocation: string,
  customData?: Record<string, any>
): void => {
  gtmTrackEvent('click', {
    event_category: 'button_click',
    event_label: buttonText,
    custom_parameters: {
      button_text: buttonText,
      button_location: buttonLocation,
      click_type: 'button',
      ...customData,
    },
  });
};

/**
 * Track external link clicks
 */
export const gtmTrackExternalLink = (
  linkUrl: string,
  linkText: string,
  source: string
): void => {
  gtmTrackEvent('click', {
    event_category: 'external_link',
    event_label: linkUrl,
    custom_parameters: {
      link_url: linkUrl,
      link_text: linkText,
      link_domain: new URL(linkUrl).hostname,
      source: source,
      click_type: 'external_link',
    },
  });
};

/**
 * Track file downloads
 */
export const gtmTrackDownload = (
  fileName: string,
  fileUrl: string,
  fileType: string,
  source?: string
): void => {
  gtmTrackEvent('file_download', {
    event_category: 'download',
    event_label: fileName,
    custom_parameters: {
      file_name: fileName,
      file_url: fileUrl,
      file_type: fileType,
      file_extension: fileName.split('.').pop(),
      source: source,
    },
  });
};

/**
 * Track video interactions
 */
export const gtmTrackVideo = (
  action: 'play' | 'pause' | 'complete' | 'seek',
  videoTitle: string,
  videoUrl?: string,
  progress?: number
): void => {
  gtmTrackEvent(`video_${action}`, {
    event_category: 'video_engagement',
    event_label: videoTitle,
    value: progress,
    custom_parameters: {
      video_title: videoTitle,
      video_url: videoUrl,
      video_progress: progress,
      video_action: action,
    },
  });
};

/**
 * Track scroll depth
 */
export const gtmTrackScrollDepth = (
  percentage: number,
  page?: string
): void => {
  gtmTrackEvent('scroll', {
    event_category: 'scroll_tracking',
    event_label: `${percentage}%`,
    value: percentage,
    custom_parameters: {
      scroll_percentage: percentage,
      page_path: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
    },
  });
};

/**
 * Track contact interactions (phone, email, WhatsApp)
 */
export const gtmTrackContact = (
  contactMethod: 'phone' | 'email' | 'whatsapp' | 'form',
  contactValue: string,
  source?: string,
  customData?: Record<string, any>
): void => {
  gtmTrackEvent('contact', {
    event_category: 'contact_interaction',
    event_label: contactMethod,
    custom_parameters: {
      contact_method: contactMethod,
      contact_value: contactValue,
      source: source,
      ...customData,
    },
  });
};

/**
 * Track social media interactions
 */
export const gtmTrackSocial = (
  platform: string,
  action: string,
  content?: string
): void => {
  gtmTrackEvent('social_interaction', {
    event_category: 'social_engagement',
    event_label: platform,
    custom_parameters: {
      social_platform: platform,
      social_action: action,
      social_content: content,
    },
  });
};

/**
 * Track user engagement (time on page, interactions)
 */
export const gtmTrackEngagement = (
  engagementType: string,
  engagementValue?: number,
  content?: string
): void => {
  gtmTrackEvent('engagement', {
    event_category: 'user_engagement',
    event_label: engagementType,
    value: engagementValue,
    custom_parameters: {
      engagement_type: engagementType,
      engagement_value: engagementValue,
      content: content,
    },
  });
};

/**
 * Track conversions for Google Ads
 */
export const gtmTrackConversion = (
  conversionAction: string,
  value?: number,
  currency: string = 'EUR',
  customData?: Record<string, any>
): void => {
  const event = {
    event: 'Form Submit',
    conversion_action: conversionAction,
    value: value,
    currency: currency,
    ...customData,
  };
  
  pushToDataLayer(event);
};

/**
 * Set user properties for segmentation
 */
export const gtmSetUserProperties = (properties: Record<string, any>): void => {
  const event = {
    event: 'user_properties_update',
    user_properties: properties,
  };
  
  pushToDataLayer(event);
};

/**
 * Madrid Roadshow Specific Events
 */

/**
 * Track roadshow page view with event details
 */
export const gtmTrackRoadshowPageView = (
  language: string,
  userCountry?: string
): void => {
  gtmTrackPageView('Madrid Roadshow 2025', '/madrid-roadshow-2025', {
    content_group1: 'Event Pages',
    content_group2: 'Roadshow',
    content_group3: 'Madrid 2025',
    language: language,
    user_type: 'prospect',
  });

  // Additional roadshow-specific event
  gtmTrackEvent('roadshow_page_view', {
    event_category: 'event_engagement',
    event_label: 'Madrid Roadshow 2025',
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      event_date: '2025-11-20',
      event_location: 'Madrid, Spain',
      event_venue: 'Wellington Hotel & Spa',
      page_language: language,
      user_country: userCountry,
      roadshow_type: 'real_estate',
    },
  });
};

/**
 * Track roadshow registration events
 */
export const gtmTrackRoadshowRegistration = (
  registrationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    propertyType: string;
    language: string;
    stage: 'started' | 'completed' | 'failed';
  }
): void => {
  const eventName = `roadshow_registration_${registrationData.stage}`;
  
  if (registrationData.stage === 'completed') {
    // Lead generation event for completed registrations
    gtmTrackLead({
      lead_type: 'Event Registration',
      lead_source: 'Madrid Roadshow Landing Page',
      content_name: 'Madrid Roadshow 2025',
      value: 2000,
      currency: 'EUR',
      transaction_id: `roadshow_${Date.now()}`,
      custom_parameters: {
        event_name: 'Madrid Roadshow 2025',
        event_date: '2025-11-20',
        registrant_country: registrationData.country,
        property_interest: registrationData.propertyType,
        registrant_language: registrationData.language,
        registration_source: 'landing_page',
        lead_quality: 'high_intent',
      },
    });
  }

  // Registration tracking event
  gtmTrackEvent(eventName, {
    event_category: 'event_registration',
    event_label: 'Madrid Roadshow 2025',
    value: registrationData.stage === 'completed' ? 2000 : undefined,
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      registration_stage: registrationData.stage,
      registrant_country: registrationData.country,
      property_interest: registrationData.propertyType,
      form_language: registrationData.language,
      event_date: '2025-11-20',
      venue: 'Wellington Hotel & Spa',
      registration_method: 'online_form',
    },
  });
};

/**
 * Track roadshow CTA clicks
 */
export const gtmTrackRoadshowCTA = (
  ctaText: string,
  ctaLocation: string,
  ctaType: 'registration' | 'contact' | 'info' = 'registration'
): void => {
  gtmTrackButtonClick(ctaText, ctaLocation, {
    event_name: 'Madrid Roadshow 2025',
    cta_type: ctaType,
    cta_intent: 'event_registration',
  });
};

/**
 * Track roadshow modal interactions
 */
export const gtmTrackRoadshowModal = (
  action: 'open' | 'close' | 'submit',
  source?: string,
  formData?: any
): void => {
  gtmTrackEvent('roadshow_modal_interaction', {
    event_category: 'modal_interaction',
    event_label: action,
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      modal_action: action,
      modal_source: source,
      modal_type: 'registration_modal',
      form_data_present: !!formData,
    },
  });
};

/**
 * Track email clicks with roadshow context
 */
export const gtmTrackRoadshowEmail = (
  emailAddress: string,
  source: string
): void => {
  gtmTrackContact('email', emailAddress, source, {
    event_name: 'Madrid Roadshow 2025',
    contact_intent: 'event_inquiry',
  });
};

/**
 * Track phone clicks with roadshow context
 */
export const gtmTrackRoadshowPhone = (
  phoneNumber: string,
  source: string
): void => {
  gtmTrackContact('phone', phoneNumber, source, {
    event_name: 'Madrid Roadshow 2025',
    contact_intent: 'event_inquiry',
  });
};

/**
 * Track map/venue interactions
 */
export const gtmTrackVenueInteraction = (
  action: 'map_click' | 'directions' | 'venue_website',
  venue: string = 'Wellington Hotel & Spa'
): void => {
  gtmTrackEvent('venue_interaction', {
    event_category: 'location_engagement',
    event_label: action,
    custom_parameters: {
      event_name: 'Madrid Roadshow 2025',
      venue_name: venue,
      venue_city: 'Madrid',
      venue_country: 'Spain',
      interaction_type: action,
    },
  });
};

/**
 * Initialize roadshow-specific tracking
 */
export const initializeRoadshowTracking = (): void => {
  initializeGTM();
  
  // Set initial user properties for roadshow visitors
  gtmSetUserProperties({
    visitor_type: 'roadshow_prospect',
    content_interest: 'real_estate_events',
    geographic_focus: 'spain_dubai',
    lead_source: 'madrid_roadshow_2025',
  });
  
  // Track initial page load with additional context
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
    if (utmSource || utmMedium || utmCampaign) {
      gtmTrackEvent('utm_tracking', {
        event_category: 'traffic_source',
        event_label: utmSource || 'direct',
        custom_parameters: {
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          event_name: 'Madrid Roadshow 2025',
        },
      });
    }
  }
};

export default {
  initializeGTM,
  isGTMLoaded,
  gtmTrackPageView,
  gtmTrackEvent,
  gtmTrackFormSubmit,
  gtmTrackFormStart,
  gtmTrackFormError,
  gtmTrackLead,
  gtmTrackButtonClick,
  gtmTrackExternalLink,
  gtmTrackDownload,
  gtmTrackVideo,
  gtmTrackScrollDepth,
  gtmTrackContact,
  gtmTrackSocial,
  gtmTrackEngagement,
  gtmTrackConversion,
  gtmSetUserProperties,
  gtmTrackRoadshowPageView,
  gtmTrackRoadshowRegistration,
  gtmTrackRoadshowCTA,
  gtmTrackRoadshowModal,
  gtmTrackRoadshowEmail,
  gtmTrackRoadshowPhone,
  gtmTrackVenueInteraction,
  initializeRoadshowTracking,
};
