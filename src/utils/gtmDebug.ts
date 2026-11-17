/**
 * GTM Debug and Testing Utilities
 * Use these functions to test and debug GTM implementation
 */

import { isGTMLoaded } from './gtm';

/**
 * Debug GTM dataLayer events
 */
export const debugGTM = () => {
  if (typeof window === 'undefined') {
    return;
  }

};

/**
 * Test GTM event firing
 */
export const testGTMEvent = () => {
  
  window.dataLayer.push({
    event: 'gtm_test_event',
    test_category: 'debug',
    test_label: 'manual_test',
    test_value: 1,
    timestamp: Date.now(),
    page_url: window.location.href
  });

};

/**
 * Monitor GTM events in real-time
 */
export const monitorGTMEvents = () => {
  if (!isGTMLoaded()) {
    return;
  }

  const originalPush = window.dataLayer.push;
  window.dataLayer.push = function(...args) {
    return originalPush.apply(this, args);
  };

  // Stop monitoring after 30 seconds
  setTimeout(() => {
    window.dataLayer.push = originalPush;
  }, 30000);
};

/**
 * Validate GTM setup for Madrid Roadshow
 */
export const validateRoadshowGTM = () => {

  debugGTM();

  // Check for roadshow-specific events
  if (window.dataLayer) {
    const roadshowEvents = window.dataLayer.filter(event => 
      event.event_name === 'Madrid Roadshow 2025' || 
      event.event?.includes('roadshow')
    );
    
  }

  // Test roadshow event
  testGTMEvent();
};

/**
 * Get GTM container info
 */
export const getGTMInfo = () => {
  return {
    containerId: 'GTM-W8X4TM6V',
    isLoaded: isGTMLoaded(),
    dataLayerLength: window.dataLayer?.length || 0,
    hasGtag: typeof window.gtag === 'function',
    pageUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
    timestamp: new Date().toISOString()
  };
};

/**
 * Export dataLayer events for analysis
 */
export const exportDataLayerEvents = () => {
  if (!window.dataLayer) {
    return;
  }

  const events = window.dataLayer.map((event, index) => ({
    index,
    timestamp: event.gtm_timestamp || event.timestamp || 'N/A',
    event: event.event || 'unknown',
    ...event
  }));

  return events;
};

// Auto-debug in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      debugGTM();
    }, 2000);
  });
}

export default {
  debugGTM,
  testGTMEvent,
  monitorGTMEvents,
  validateRoadshowGTM,
  getGTMInfo,
  exportDataLayerEvents
};
