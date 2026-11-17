/**
 * GTM Testing and Validation Utilities
 * Use these functions to test GTM implementation comprehensively
 */

import { isGTMLoaded, gtmTrackEvent } from './gtm';

interface GTMTestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  data?: any;
}

/**
 * Comprehensive GTM validation suite
 */
export const runGTMValidationSuite = (): GTMTestResult[] => {
  const results: GTMTestResult[] = [];

  // Test 1: GTM Container Loading
  results.push({
    test: 'GTM Container Loading',
    status: isGTMLoaded() ? 'pass' : 'fail',
    message: isGTMLoaded() ? 'GTM container loaded successfully' : 'GTM container not loaded',
    data: { containerId: 'GTM-W8X4TM6V' }
  });

  // Test 2: DataLayer Initialization
  if (typeof window !== 'undefined') {
    results.push({
      test: 'DataLayer Initialization',
      status: Array.isArray(window.dataLayer) ? 'pass' : 'fail',
      message: Array.isArray(window.dataLayer) ? 'DataLayer initialized' : 'DataLayer not found',
      data: { dataLayerLength: window.dataLayer?.length || 0 }
    });

    // Test 3: GTM Script Loading
    const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
    results.push({
      test: 'GTM Script Loading',
      status: gtmScripts.length > 0 ? 'pass' : 'fail',
      message: `Found ${gtmScripts.length} GTM script(s)`,
      data: { scriptCount: gtmScripts.length }
    });

    // Test 4: GTM NoScript Fallback
    const gtmNoScript = document.querySelector('noscript iframe[src*="GTM-W8X4TM6V"]');
    results.push({
      test: 'GTM NoScript Fallback',
      status: gtmNoScript ? 'pass' : 'warning',
      message: gtmNoScript ? 'NoScript fallback found' : 'NoScript fallback not found',
    });

    // Test 5: Check for Duplicate GTM
    const gtmInstances = window.dataLayer?.filter(item => item['gtm.start']) || [];
    results.push({
      test: 'Duplicate GTM Check',
      status: gtmInstances.length === 1 ? 'pass' : gtmInstances.length > 1 ? 'warning' : 'fail',
      message: `Found ${gtmInstances.length} GTM initialization(s)`,
      data: { instances: gtmInstances.length }
    });
  }

  return results;
};

/**
 * Test specific GTM events
 */
export const testGTMEvents = () => {
  const testResults: GTMTestResult[] = [];

  if (!isGTMLoaded()) {
    testResults.push({
      test: 'GTM Events Test',
      status: 'fail',
      message: 'Cannot test events - GTM not loaded'
    });
    return testResults;
  }

  // Test basic event
  try {
    gtmTrackEvent('test_event', {
      event_category: 'testing',
      event_label: 'gtm_validation',
      custom_parameters: {
        test_timestamp: Date.now(),
        test_type: 'validation'
      }
    });

    testResults.push({
      test: 'Basic Event Tracking',
      status: 'pass',
      message: 'Test event sent successfully'
    });
  } catch (error) {
    testResults.push({
      test: 'Basic Event Tracking',
      status: 'fail',
      message: `Error sending test event: ${error}`
    });
  }

  return testResults;
};

/**
 * Validate Madrid Roadshow specific tracking
 */
export const validateRoadshowTracking = (): GTMTestResult[] => {
  const results: GTMTestResult[] = [];

  if (typeof window === 'undefined') {
    results.push({
      test: 'Roadshow Validation',
      status: 'fail',
      message: 'Cannot validate - not in browser environment'
    });
    return results;
  }

  // Check for roadshow-specific events in dataLayer
  const roadshowEvents = window.dataLayer?.filter(event => 
    event.event_name === 'Madrid Roadshow 2025' ||
    event.event?.includes('roadshow') ||
    event.content_name === 'Madrid Roadshow 2025'
  ) || [];

  results.push({
    test: 'Roadshow Events',
    status: roadshowEvents.length > 0 ? 'pass' : 'warning',
    message: `Found ${roadshowEvents.length} roadshow-related events`,
    data: { eventCount: roadshowEvents.length, events: roadshowEvents.slice(-3) }
  });

  // Check for form tracking
  const formEvents = window.dataLayer?.filter(event => 
    event.form_name?.includes('Madrid Roadshow') ||
    event.event === 'form_submit'
  ) || [];

  results.push({
    test: 'Form Tracking',
    status: formEvents.length > 0 ? 'pass' : 'warning',
    message: `Found ${formEvents.length} form events`,
    data: { formEvents: formEvents.length }
  });

  // Check for lead generation events
  const leadEvents = window.dataLayer?.filter(event => 
    event.event === 'generate_lead'
  ) || [];

  results.push({
    test: 'Lead Generation Tracking',
    status: leadEvents.length > 0 ? 'pass' : 'warning',
    message: `Found ${leadEvents.length} lead generation events`,
    data: { leadEvents: leadEvents.length }
  });

  return results;
};

/**
 * Monitor GTM events in real-time with filtering
 */
export const monitorGTMEventsFiltered = (
  filter: string | RegExp,
  duration: number = 30000
): void => {
  if (!isGTMLoaded()) {
    return;
  }

  const originalPush = window.dataLayer.push;
  let eventCount = 0;

  window.dataLayer.push = function(...args) {
    const event = args[0];
    const eventString = JSON.stringify(event);
    
    let shouldLog = false;
    if (typeof filter === 'string') {
      shouldLog = eventString.includes(filter);
    } else if (filter instanceof RegExp) {
      shouldLog = filter.test(eventString);
    }

    if (shouldLog) {
      eventCount++;
    }

    return originalPush.apply(this, args);
  };

  setTimeout(() => {
    window.dataLayer.push = originalPush;
  }, duration);
};

/**
 * Export dataLayer events as CSV
 */
export const exportDataLayerAsCSV = (): string => {
  if (!window.dataLayer) {
    return 'Error: No dataLayer found';
  }

  const headers = ['Index', 'Timestamp', 'Event', 'Category', 'Label', 'Value', 'Custom_Data'];
  const rows = [headers.join(',')];

  window.dataLayer.forEach((event, index) => {
    const row = [
      index,
      event.gtm_timestamp || event.timestamp || 'N/A',
      event.event || 'unknown',
      event.event_category || 'N/A',
      event.event_label || 'N/A',
      event.value || 'N/A',
      JSON.stringify(event).replace(/"/g, '""') // Escape quotes for CSV
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
};

/**
 * Performance analysis of GTM events
 */
export const analyzeGTMPerformance = () => {
  if (!window.dataLayer) {
    return;
  }

  const events = window.dataLayer;
  const analysis = {
    totalEvents: events.length,
    eventTypes: {} as Record<string, number>,
    categories: {} as Record<string, number>,
    timeRange: {
      first: null as string | null,
      last: null as string | null
    },
    avgEventsPerMinute: 0
  };

  events.forEach(event => {
    // Count event types
    const eventType = event.event || 'unknown';
    analysis.eventTypes[eventType] = (analysis.eventTypes[eventType] || 0) + 1;

    // Count categories
    if (event.event_category) {
      analysis.categories[event.event_category] = (analysis.categories[event.event_category] || 0) + 1;
    }

    // Track time range
    if (event.gtm_timestamp) {
      if (!analysis.timeRange.first) analysis.timeRange.first = event.gtm_timestamp;
      analysis.timeRange.last = event.gtm_timestamp;
    }
  });

  // Calculate events per minute
  if (analysis.timeRange.first && analysis.timeRange.last) {
    const startTime = new Date(analysis.timeRange.first);
    const endTime = new Date(analysis.timeRange.last);
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    analysis.avgEventsPerMinute = Math.round(analysis.totalEvents / durationMinutes * 100) / 100;
  }

  return analysis;
};

/**
 * Generate GTM health report
 */
export const generateGTMHealthReport = () => {

  const validationResults = runGTMValidationSuite();
  const testResults = testGTMEvents();
  const roadshowResults = validateRoadshowTracking();

  const allResults = [...validationResults, ...testResults, ...roadshowResults];
  const passCount = allResults.filter(r => r.status === 'pass').length;
  const warningCount = allResults.filter(r => r.status === 'warning').length;
  const failCount = allResults.filter(r => r.status === 'fail').length;

  allResults.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    if (result.data) {
    }
  });

  return {
    total: allResults.length,
    passed: passCount,
    warnings: warningCount,
    failed: failCount,
    healthScore: Math.round((passCount / allResults.length) * 100),
    results: allResults
  };
};

export default {
  runGTMValidationSuite,
  testGTMEvents,
  validateRoadshowTracking,
  monitorGTMEventsFiltered,
  exportDataLayerAsCSV,
  analyzeGTMPerformance,
  generateGTMHealthReport
};
