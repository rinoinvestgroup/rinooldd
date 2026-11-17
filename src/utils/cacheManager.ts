/**
 * Browser Cache Management Utility
 * Handles cache clearing and service worker cleanup for ALL browsers
 * (Chrome, Safari, Firefox, Brave, Edge, etc.)
 * Ensures latest deployment is always served after updates.
 */

/**
 * Clear all browser caches - works across all browsers
 * Unregisters service workers and clears Cache Storage API
 */
export const clearAllBrowserCache = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  console.log('[CacheManager] Clearing browser caches for latest deployment...');

  // 1. Unregister all service workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      if (registrations.length > 0) {
        console.log(`[CacheManager] Unregistered ${registrations.length} service worker(s)`);
      }
    } catch (error) {
      console.error('[CacheManager] Failed to unregister service workers:', error);
    }
  }

  // 2. Clear Cache Storage API (used by service workers and Cache API)
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      if (cacheNames.length > 0) {
        console.log(`[CacheManager] Cleared ${cacheNames.length} cache(s): ${cacheNames.join(', ')}`);
      }
    } catch (error) {
      console.error('[CacheManager] Failed to clear cache storage:', error);
    }
  }

  // 3. Clear stale app data from localStorage (preserve user preferences)
  try {
    const keysToKeep = ['cookieConsent', 'language', 'app-version'];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    console.log('[CacheManager] Cleared stale localStorage entries');
  } catch (error) {
    console.error('[CacheManager] Failed to clear localStorage:', error);
  }
};

/**
 * Version-based cache invalidation
 * Returns true if the app version has changed (new deployment detected)
 */
export const checkAppVersion = (currentVersion: string): boolean => {
  if (typeof window === 'undefined') return false;

  const storedVersion = localStorage.getItem('app-version');

  if (!storedVersion) {
    // First visit — store version, no reload needed
    localStorage.setItem('app-version', currentVersion);
    return false;
  }

  if (storedVersion !== currentVersion) {
    console.log(`[CacheManager] New deployment detected: ${storedVersion} → ${currentVersion}`);
    localStorage.setItem('app-version', currentVersion);
    return true; // Version changed, needs cache clear + reload
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
