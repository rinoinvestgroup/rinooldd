/**
 * Brave Browser Cache Management Utility
 * Handles cache clearing and service worker cleanup for Brave browsers
 */

// Extend Navigator interface to include Brave API
declare global {
  interface Navigator {
    brave?: {
      isBrave: () => Promise<boolean>;
    };
  }
}

export const isBraveBrowser = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  // Check if Brave browser
  if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
    return await navigator.brave.isBrave();
  }
  
  return false;
};

export const clearBraveCache = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  const isBrave = await isBraveBrowser();
  
  if (!isBrave) {
    console.log('Not Brave browser, skipping cache clear');
    return;
  }
  
  console.log('Brave browser detected - clearing cache');
  
  // 1. Unregister all service workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      console.log('✅ Service workers unregistered');
    } catch (error) {
      console.error('Failed to unregister service workers:', error);
    }
  }
  
  // 2. Clear Cache Storage
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('✅ Cache storage cleared');
    } catch (error) {
      console.error('Failed to clear cache storage:', error);
    }
  }
  
  // 3. Clear localStorage for app-specific data
  try {
    const keysToKeep = ['cookieConsent', 'language']; // Preserve user preferences
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    console.log('✅ LocalStorage cleared (kept user preferences)');
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

/**
 * Version-based cache invalidation
 * Forces a page reload if the app version has changed
 */
export const checkAppVersion = (currentVersion: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const storedVersion = localStorage.getItem('app-version');
  
  if (!storedVersion) {
    // First visit
    localStorage.setItem('app-version', currentVersion);
    return false;
  }
  
  if (storedVersion !== currentVersion) {
    console.log(`App version changed: ${storedVersion} -> ${currentVersion}`);
    localStorage.setItem('app-version', currentVersion);
    return true; // Version changed, needs reload
  }
  
  return false; // Same version
};

/**
 * Add cache-busting parameter to URLs
 * Useful for API calls and dynamic content
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  const timestamp = Date.now();
  return `${url}${separator}_cb=${timestamp}`;
};

/**
 * Force page reload with cache bypass
 * Only for Brave browsers with cache issues
 */
export const forceReloadInBrave = async (): Promise<void> => {
  const isBrave = await isBraveBrowser();
  
  if (isBrave) {
    // Clear cache first
    await clearBraveCache();
    
    // Force reload bypassing cache
    window.location.reload();
  }
};
