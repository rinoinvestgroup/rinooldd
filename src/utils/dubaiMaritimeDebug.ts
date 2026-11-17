/**
 * Dubai Maritime City Analytics Debug Utilities
 * Use these functions in browser console to test tracking
 */

// Extend window interface
declare global {
  interface Window {
    dubaiMaritimeDebug?: any;
    pageStartTime?: number;
    google_tag_manager?: any;
  }
}

// Add to window for browser console access
if (typeof window !== 'undefined') {
  window.dubaiMaritimeDebug = {
    
    // Test all major tracking events
    testAllEvents: () => {
      
      // Import tracking functions (you'll need to import these in your component)
      // This is just a reference for console testing
      
    },
    
    // Monitor all GTM events
    monitorGTMEvents: (duration = 30000) => {
      
      const originalPush = window.dataLayer.push;
      const events: any[] = [];
      
      window.dataLayer.push = function() {
        const event = arguments[0];
        events.push({
          timestamp: new Date().toISOString(),
          event: event
        });
        return originalPush.apply(window.dataLayer, Array.from(arguments));
      };
      
      setTimeout(() => {
        window.dataLayer.push = originalPush;
      }, duration);
      
      return events;
    },
    
    // Check current GTM status
    checkGTMStatus: () => {
     
      // Check if GTM container is loaded
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
      
      // Check for our specific container
      const hasContainer = Array.from(gtmScripts).some(script => 
        (script as HTMLScriptElement).src?.includes('GTM-W8X4TM6V')
      );
    },
    
    // Test specific project tracking
    testProjectTracking: (projectName = 'Breez by Danube') => {
      
      // Simulate project click
      window.dataLayer.push({
        event: 'project_card_click',
        event_category: 'property_interaction',
        project_name: projectName,
        project_type: 'apartment',
        location: 'Dubai Maritime City',
        click_source: 'debug_test'
      });
      
      // Simulate enquiry
      window.dataLayer.push({
        event: 'generate_lead',
        lead_type: 'Property Inquiry',
        lead_source: 'Dubai Maritime City Landing Page',
        content_name: `${projectName} - Dubai Maritime City`,
        value: 1500,
        currency: 'AED',
        project_name: projectName
      });
      
    },
    
    // Test contact tracking
    testContactTracking: () => {
      
      const contactMethods = [
        { method: 'phone', value: '+97143212433', source: 'floating_button' },
        { method: 'whatsapp', value: '+97143212433', source: 'hero_cta' },
        { method: 'email', value: 'ask@rinoproperties.com', source: 'contact_section' }
      ];
      
      contactMethods.forEach(contact => {
        window.dataLayer.push({
          event: 'contact',
          event_category: 'contact_interaction',
          contact_method: contact.method,
          contact_value: contact.value,
          source: contact.source,
          location: 'Dubai Maritime City'
        });
      });
      
    },
    
    // Simulate user journey
    simulateUserJourney: () => {
      
      const journey = [
        { delay: 0, action: 'Page View', event: { event: 'page_view', page_title: 'Dubai Maritime City Properties' }},
        { delay: 2000, action: 'Scroll 25%', event: { event: 'scroll_milestone', scroll_percentage: 25 }},
        { delay: 5000, action: 'View Advantage', event: { event: 'advantage_engagement', advantage_title: 'Modern Seaside Community' }},
        { delay: 8000, action: 'Scroll 50%', event: { event: 'scroll_milestone', scroll_percentage: 50 }},
        { delay: 12000, action: 'Location Interaction', event: { event: 'location_interaction', interaction_type: 'map_view' }},
        { delay: 15000, action: 'Project Click', event: { event: 'project_card_click', project_name: 'Breez by Danube' }},
        { delay: 18000, action: 'Enquiry', event: { event: 'generate_lead', lead_type: 'Property Inquiry', value: 1500 }},
      ];
      
      journey.forEach(step => {
        setTimeout(() => {
          window.dataLayer.push(step.event);
        }, step.delay);
      });
      
    },
    
    // Get engagement metrics
    getEngagementMetrics: () => {
      // Cache layout measurements
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const metrics = {
        timeOnPage: Math.round((Date.now() - (window.pageStartTime || Date.now())) / 1000),
        scrollDepth: Math.round((scrollY / (documentHeight - windowHeight)) * 100),
        interactions: window.dataLayer.filter(event => 
          event.event && !event.event.includes('gtm')
        ).length,
        leadEvents: window.dataLayer.filter(event => 
          event.event === 'generate_lead'
        ).length,
        contactEvents: window.dataLayer.filter(event => 
          event.event === 'contact'
        ).length
      };
      
      return metrics;
    },
    
    // Export data for analysis
    exportTrackingData: () => {
      const data = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        dataLayer: window.dataLayer,
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        engagement: window.dubaiMaritimeDebug.getEngagementMetrics()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dubai-maritime-tracking-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    }
  };
  
  
}

export default window.dubaiMaritimeDebug || {};
