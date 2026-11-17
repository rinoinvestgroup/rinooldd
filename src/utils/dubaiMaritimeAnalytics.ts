/**
 * Dubai Maritime City Analytics Tracking
 * Specialized tracking for Dubai Maritime City property page
 */

import {
  gtmTrackPageView,
  gtmTrackEvent,
  gtmTrackButtonClick,
  gtmTrackContact,
  gtmTrackLead,
  gtmTrackScrollDepth,
  gtmTrackFormSubmit,
  initializeGTM,
  gtmSetUserProperties
} from './gtm';

import {
  trackPageView,
  trackEvent,
  trackPropertyView,
  trackPropertyInquiry,
  trackContact,
  trackButtonClick,
  trackScrollDepth,
  trackLead
} from './googleAnalytics';

/**
 * Helper function to ensure client-side only execution
 */
const withClientCheck = (fn: Function) => {
  return (...args: any[]) => {
    if (typeof window === 'undefined') {
      return;
    }
    return fn(...args);
  };
};

/**
 * Initialize Dubai Maritime City tracking
 */
export const initializeDubaiMaritimeTracking = (language: string = 'en'): void => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // Initialize GTM
  initializeGTM();
  
  // Set user properties for Dubai Maritime City visitors
  gtmSetUserProperties({
    visitor_type: 'property_prospect',
    content_interest: 'waterfront_properties',
    location_interest: 'dubai_maritime_city',
    property_category: 'luxury_residential',
    page_language: language,
  });

  // Track page view with enhanced data
  trackDubaiMaritimePageView(language);
  
  // Track UTM parameters if present
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  
  if (utmSource || utmMedium || utmCampaign) {
    trackUTMParameters(utmSource, utmMedium, utmCampaign);
  }
};

/**
 * Track Dubai Maritime City page view
 */
export const trackDubaiMaritimePageView = (language: string = 'en'): void => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // GTM tracking
  gtmTrackPageView('Dubai Maritime City Properties', '/dubai-maritime-city', {
    content_group1: 'Property Pages',
    content_group2: 'Dubai Properties',
    content_group3: 'Maritime City',
    language: language,
    page_type: 'property_listing',
    property_location: 'Dubai Maritime City',
    property_category: 'waterfront_luxury',
  });

  // GA4 tracking
  trackPageView('/dubai-maritime-city', 'Dubai Maritime City Properties - Luxury Waterfront Living');
  
  // Custom Dubai Maritime City event
  gtmTrackEvent('maritime_city_page_view', {
    event_category: 'property_engagement',
    event_label: 'Dubai Maritime City Landing',
    custom_parameters: {
      location: 'Dubai Maritime City',
      property_type: 'luxury_waterfront',
      page_language: language,
      content_type: 'property_landing_page',
      featured_projects: ['Breez by Danube', 'Il Vento Premium Residences', '31 Above'],
    },
  });
};

/**
 * Track project card clicks
 */
export const trackProjectClick = (
  projectName: string,
  projectType: 'apartment' | 'penthouse' | 'office' | 'villa',
  developer: string,
  handoverDate: string,
  clickSource: string
): void => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // GTM tracking
  gtmTrackEvent('project_card_click', {
    event_category: 'property_interaction',
    event_label: projectName,
    custom_parameters: {
      project_name: projectName,
      project_type: projectType,
      developer: developer,
      handover_date: handoverDate,
      location: 'Dubai Maritime City',
      click_source: clickSource,
      interaction_type: 'project_selection',
    },
  });

  // GA4 tracking
  trackPropertyView(
    projectName.replace(/\s+/g, '_').toLowerCase(),
    projectName,
    projectType,
    0, // Price not specified in current data
    'Dubai Maritime City'
  );
};

/**
 * Track enquiry button clicks for specific projects
 */
export const trackProjectEnquiry = withClientCheck((
  projectName: string,
  enquiryType: 'enquire_now' | 'contact_us' | 'download_brochure',
  buttonLocation: string
): void => {
  // GTM tracking - Lead generation event
  gtmTrackLead({
    lead_type: 'Property Inquiry',
    lead_source: 'Dubai Maritime City Landing Page',
    content_name: `${projectName} - Dubai Maritime City`,
    value: 1500, // Estimated lead value for Dubai property inquiry
    currency: 'AED',
    custom_parameters: {
      project_name: projectName,
      inquiry_type: enquiryType,
      location: 'Dubai Maritime City',
      button_location: buttonLocation,
      lead_quality: 'high_intent',
      property_category: 'luxury_waterfront',
    },
  });

  // GTM button click tracking
  gtmTrackButtonClick(`${enquiryType} - ${projectName}`, buttonLocation, {
    project_name: projectName,
    location: 'Dubai Maritime City',
    button_type: enquiryType,
  });

  // GA4 tracking
  trackPropertyInquiry(
    projectName.replace(/\s+/g, '_').toLowerCase(),
    projectName,
    enquiryType
  );
});

/**
 * Track contact method interactions
 */
export const trackMaritimeCityContact = (
  contactMethod: 'phone' | 'email' | 'whatsapp',
  contactValue: string,
  source: string,
  projectContext?: string
): void => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  // GTM tracking
  gtmTrackContact(contactMethod, contactValue, source, {
    location: 'Dubai Maritime City',
    project_context: projectContext,
    contact_intent: 'property_inquiry',
    page_type: 'property_landing',
  });

  // GA4 tracking
  trackContact(contactMethod, source, {
    location: 'Dubai Maritime City',
    project_context: projectContext,
  });
};

/**
 * Track hero slider interactions
 */
export const trackHeroSliderInteraction = (
  action: 'slide_change' | 'navigation_click' | 'auto_advance',
  slideIndex: number,
  slideTitle: string,
  interactionType?: 'manual' | 'automatic'
): void => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  gtmTrackEvent('hero_slider_interaction', {
    event_category: 'user_interface',
    event_label: slideTitle,
    value: slideIndex + 1,
    custom_parameters: {
      slider_action: action,
      slide_index: slideIndex,
      slide_title: slideTitle,
      interaction_type: interactionType || 'manual',
      location: 'Dubai Maritime City',
      element_type: 'hero_carousel',
    },
  });
};

/**
 * Track CTA button clicks in hero section
 */
export const trackHeroCTA = (
  ctaText: string,
  ctaType: 'primary' | 'secondary',
  slideContext: string
): void => {
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  gtmTrackButtonClick(ctaText, 'hero_section', {
    cta_type: ctaType,
    slide_context: slideContext,
    location: 'Dubai Maritime City',
    button_category: 'hero_cta',
  });
};

/**
 * Track advantages section engagement
 */
export const trackAdvantageEngagement = (
  advantageTitle: string,
  advantageIndex: number,
  interactionType: 'view' | 'hover' | 'click'
): void => {
  gtmTrackEvent('advantage_engagement', {
    event_category: 'content_engagement',
    event_label: advantageTitle,
    value: advantageIndex + 1,
    custom_parameters: {
      advantage_title: advantageTitle,
      advantage_index: advantageIndex,
      interaction_type: interactionType,
      location: 'Dubai Maritime City',
      content_section: 'key_advantages',
    },
  });
};

/**
 * Track location/map interactions
 */
export const trackLocationInteraction = (
  interactionType: 'map_view' | 'travel_time_view' | 'landmark_click',
  target?: string
): void => {
  gtmTrackEvent('location_interaction', {
    event_category: 'location_engagement',
    event_label: interactionType,
    custom_parameters: {
      interaction_type: interactionType,
      target: target,
      location: 'Dubai Maritime City',
      content_section: 'location_connectivity',
      nearby_landmarks: [
        'Burj Khalifa',
        'Dubai International Airport',
        'Dubai Mall',
        'Dubai Marina'
      ],
    },
  });
};

/**
 * Track scroll depth with maritime city context
 */
export const trackMaritimeCityScrollDepth = (percentage: number): void => {
  // GTM tracking
  gtmTrackScrollDepth(percentage, '/dubai-maritime-city');
  
  // GA4 tracking
  trackScrollDepth(percentage, '/dubai-maritime-city');
  
  // Additional maritime city context
  gtmTrackEvent('scroll_milestone', {
    event_category: 'engagement',
    event_label: `${percentage}% scroll`,
    value: percentage,
    custom_parameters: {
      scroll_percentage: percentage,
      location: 'Dubai Maritime City',
      page_type: 'property_landing',
      content_length: 'long_form',
    },
  });
};

/**
 * Track floating action button interactions
 */
export const trackFloatingActionButton = (
  actionType: 'call' | 'whatsapp',
  phoneNumber: string
): void => {
  gtmTrackButtonClick(`floating_${actionType}`, 'floating_actions', {
    button_type: 'floating_action',
    action_type: actionType,
    phone_number: phoneNumber,
    location: 'Dubai Maritime City',
    urgency_level: 'immediate_contact',
  });

  // Track as high-intent lead
  if (actionType === 'call' || actionType === 'whatsapp') {
    gtmTrackLead({
      lead_type: 'Immediate Contact Intent',
      lead_source: 'Dubai Maritime City Floating Button',
      content_name: 'Dubai Maritime City Properties',
      value: 2000, // High value for immediate contact intent
      currency: 'AED',
      custom_parameters: {
        contact_method: actionType,
        urgency_level: 'immediate',
        location: 'Dubai Maritime City',
        lead_quality: 'very_high_intent',
      },
    });
  }
};

/**
 * Track economic attractiveness section engagement
 */
export const trackEconomicSectionEngagement = (
  sectionType: 'about_area' | 'economic_attractiveness' | 'business_properties',
  timeSpent?: number
): void => {
  gtmTrackEvent('economic_section_engagement', {
    event_category: 'content_engagement',
    event_label: sectionType,
    value: timeSpent,
    custom_parameters: {
      section_type: sectionType,
      time_spent: timeSpent,
      location: 'Dubai Maritime City',
      content_category: 'market_information',
      engagement_depth: timeSpent && timeSpent > 30 ? 'deep' : 'surface',
    },
  });
};

/**
 * Track form interactions (for future contact forms)
 */
export const trackMaritimeCityFormInteraction = (
  formType: 'contact' | 'inquiry' | 'callback_request',
  formStage: 'start' | 'field_complete' | 'submit' | 'error',
  fieldName?: string,
  formData?: Record<string, any>
): void => {
  const eventName = `form_${formStage}`;
  
  gtmTrackEvent(eventName, {
    event_category: 'form_interaction',
    event_label: formType,
    custom_parameters: {
      form_type: formType,
      form_stage: formStage,
      field_name: fieldName,
      location: 'Dubai Maritime City',
      has_project_interest: !!formData?.project_interest,
      contact_preference: formData?.contact_preference,
    },
  });

  if (formStage === 'submit') {
    gtmTrackLead({
      lead_type: 'Form Submission',
      lead_source: 'Dubai Maritime City Contact Form',
      content_name: 'Dubai Maritime City Properties',
      value: 1800,
      currency: 'AED',
      custom_parameters: {
        form_type: formType,
        location: 'Dubai Maritime City',
        submission_source: 'landing_page_form',
      },
    });
  }
};

/**
 * Track UTM parameters for traffic source analysis
 */
export const trackUTMParameters = (
  utmSource?: string | null,
  utmMedium?: string | null,
  utmCampaign?: string | null
): void => {
  gtmTrackEvent('utm_tracking', {
    event_category: 'traffic_source',
    event_label: utmSource || 'direct',
    custom_parameters: {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      location: 'Dubai Maritime City',
      landing_page: 'dubai_maritime_city',
      traffic_quality: utmCampaign?.includes('premium') ? 'premium' : 'standard',
    },
  });
};

/**
 * Track time spent on page
 */
export const trackPageTimeSpent = (timeSpent: number): void => {
  const engagementLevel = 
    timeSpent > 300 ? 'very_high' :
    timeSpent > 120 ? 'high' :
    timeSpent > 60 ? 'medium' : 'low';

  gtmTrackEvent('page_time_engagement', {
    event_category: 'engagement',
    event_label: engagementLevel,
    value: timeSpent,
    custom_parameters: {
      time_spent_seconds: timeSpent,
      engagement_level: engagementLevel,
      location: 'Dubai Maritime City',
      page_type: 'property_landing',
      likely_interested: timeSpent > 120,
    },
  });
};

/**
 * Track exit intent (when user is about to leave)
 */
export const trackExitIntent = (
  trigger: 'mouse_leave' | 'back_button' | 'tab_switch',
  timeOnPage: number,
  scrollDepth: number
): void => {
  gtmTrackEvent('exit_intent', {
    event_category: 'user_behavior',
    event_label: trigger,
    value: timeOnPage,
    custom_parameters: {
      trigger_type: trigger,
      time_on_page: timeOnPage,
      scroll_depth: scrollDepth,
      location: 'Dubai Maritime City',
      engagement_score: (timeOnPage * 0.1) + (scrollDepth * 0.5),
      potential_retarget: timeOnPage > 60 && scrollDepth > 50,
    },
  });
};

// Add SSR protection to remaining functions
const ssrSafeTrackAdvantageEngagement = (
  advantageTitle: string,
  advantageIndex: number,
  interactionType: 'view' | 'hover' | 'click'
): void => {
  if (typeof window === 'undefined') return;
  trackAdvantageEngagement(advantageTitle, advantageIndex, interactionType);
};

const ssrSafeTrackLocationInteraction = (
  interactionType: 'map_view' | 'travel_time_view' | 'landmark_click',
  target?: string
): void => {
  if (typeof window === 'undefined') return;
  trackLocationInteraction(interactionType, target);
};

const ssrSafeTrackMaritimeCityScrollDepth = (percentage: number): void => {
  if (typeof window === 'undefined') return;
  trackMaritimeCityScrollDepth(percentage);
};

const ssrSafeTrackFloatingActionButton = (
  actionType: 'call' | 'whatsapp',
  phoneNumber: string
): void => {
  if (typeof window === 'undefined') return;
  trackFloatingActionButton(actionType, phoneNumber);
};

const ssrSafeTrackEconomicSectionEngagement = (
  sectionType: 'about_area' | 'economic_attractiveness' | 'business_properties',
  timeSpent?: number
): void => {
  if (typeof window === 'undefined') return;
  trackEconomicSectionEngagement(sectionType, timeSpent);
};

const ssrSafeTrackPageTimeSpent = (timeSpent: number): void => {
  if (typeof window === 'undefined') return;
  trackPageTimeSpent(timeSpent);
};

const ssrSafeTrackExitIntent = (
  trigger: 'mouse_leave' | 'back_button' | 'tab_switch',
  timeOnPage: number,
  scrollDepth: number
): void => {
  if (typeof window === 'undefined') return;
  trackExitIntent(trigger, timeOnPage, scrollDepth);
};

// Export all functions as default object
export default {
  initializeDubaiMaritimeTracking,
  trackDubaiMaritimePageView,
  trackProjectClick,
  trackProjectEnquiry,
  trackMaritimeCityContact,
  trackHeroSliderInteraction,
  trackHeroCTA,
  trackAdvantageEngagement: ssrSafeTrackAdvantageEngagement,
  trackLocationInteraction: ssrSafeTrackLocationInteraction,
  trackMaritimeCityScrollDepth: ssrSafeTrackMaritimeCityScrollDepth,
  trackFloatingActionButton: ssrSafeTrackFloatingActionButton,
  trackEconomicSectionEngagement: ssrSafeTrackEconomicSectionEngagement,
  trackMaritimeCityFormInteraction,
  trackUTMParameters,
  trackPageTimeSpent: ssrSafeTrackPageTimeSpent,
  trackExitIntent: ssrSafeTrackExitIntent,
};
