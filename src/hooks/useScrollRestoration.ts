import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';

// Key prefix for storage - using localStorage for persistence across page refresh
const SCROLL_KEY_PREFIX = 'scroll_position_';
const NAVIGATION_STACK_KEY = 'navigation_stack';
const LAST_VISITED_KEY = 'last_visited_path';

// Helper to safely access storage
const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return localStorage;
};

/**
 * Custom hook for scroll position restoration
 * Saves scroll position when navigating away and restores it when coming back
 * Works with pagination - preserves position across paginated pages
 * Uses localStorage to persist scroll positions across page refreshes
 */
export const useScrollRestoration = () => {
  const router = useRouter();
  const isRestoringRef = useRef(false);
  const previousPathRef = useRef<string>('');
  const hasInitializedRef = useRef(false);
  const lastSavedPositionRef = useRef<number>(0);
  const isPopStateNavigationRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // Generate a unique key for the current page (includes query params for pagination)
  const getScrollKey = useCallback((path: string) => {
    // Use the full path including query params for unique identification
    // This ensures each paginated state gets its own scroll position
    return `${SCROLL_KEY_PREFIX}${path}`;
  }, []);

  // Get navigation stack from localStorage
  const getNavigationStack = useCallback((): string[] => {
    try {
      const storage = getStorage();
      if (!storage) return [];
      const stack = storage.getItem(NAVIGATION_STACK_KEY);
      return stack ? JSON.parse(stack) : [];
    } catch {
      return [];
    }
  }, []);

  // Save navigation stack to localStorage
  const saveNavigationStack = useCallback((stack: string[]) => {
    try {
      const storage = getStorage();
      if (!storage) return;
      // Keep only last 20 entries to prevent storage issues
      const trimmedStack = stack.slice(-20);
      storage.setItem(NAVIGATION_STACK_KEY, JSON.stringify(trimmedStack));
    } catch {
      // Ignore errors
    }
  }, []);

  // Save last visited path for page refresh restoration
  const saveLastVisitedPath = useCallback((path: string) => {
    try {
      const storage = getStorage();
      if (!storage) return;
      storage.setItem(LAST_VISITED_KEY, path);
    } catch {
      // Ignore errors
    }
  }, []);

  // Get last visited path
  const getLastVisitedPath = useCallback((): string | null => {
    try {
      const storage = getStorage();
      if (!storage) return null;
      return storage.getItem(LAST_VISITED_KEY);
    } catch {
      return null;
    }
  }, []);

  // Save current scroll position with the full path including query params
  const saveScrollPosition = useCallback((path?: string) => {
    if (typeof window === 'undefined') return;
    
    // Don't save if we're currently navigating (prevents saving wrong position)
    if (isNavigatingRef.current) {
      return;
    }
    
    const currentPath = path || router.asPath;
    const scrollKey = getScrollKey(currentPath);
    const currentY = window.scrollY;
    
    // Avoid saving 0 position if we just restored (prevents overwriting valid position)
    if (currentY === 0 && lastSavedPositionRef.current > 100) {
      return;
    }
    
    // Avoid saving if at the very bottom (likely a navigation artifact)
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (currentY >= maxScroll - 10 && lastSavedPositionRef.current < maxScroll - 100) {
      // Jumped to bottom, likely due to navigation - use last saved position instead
      return;
    }
    
    lastSavedPositionRef.current = currentY;
    
    const scrollPosition = {
      x: window.scrollX,
      y: currentY,
      fullPath: currentPath, // Store full path with query params
      timestamp: Date.now()
    };
    
    try {
      const storage = getStorage();
      if (!storage) return;
      storage.setItem(scrollKey, JSON.stringify(scrollPosition));
      // Also save to sessionStorage for faster access during same session
      sessionStorage.setItem(scrollKey, JSON.stringify(scrollPosition));
    } catch (e) {
      // Storage might be full or disabled
      console.warn('Failed to save scroll position:', e);
    }
  }, [router.asPath, getScrollKey]);

  // Restore scroll position
  const restoreScrollPosition = useCallback((targetPath?: string) => {
    if (typeof window === 'undefined' || isRestoringRef.current) return;
    
    const currentPath = targetPath || router.asPath;
    const scrollKey = getScrollKey(currentPath);
    
    try {
      // Try sessionStorage first (faster, same session), then localStorage (persists refresh)
      let saved = sessionStorage.getItem(scrollKey);
      if (!saved) {
        const storage = getStorage();
        if (storage) {
          saved = storage.getItem(scrollKey);
        }
      }
      
      if (saved) {
        const { x, y, timestamp } = JSON.parse(saved);
        
        // Only restore if saved within last 2 hours (extended for refresh scenarios)
        const twoHours = 2 * 60 * 60 * 1000;
        if (Date.now() - timestamp < twoHours && y > 0) {
          isRestoringRef.current = true;
          lastSavedPositionRef.current = y;
          
          // Use multiple attempts to ensure scroll after content loads
          const attemptRestore = (attempts: number, delay: number) => {
            if (attempts <= 0) {
              isRestoringRef.current = false;
              return;
            }
            
            setTimeout(() => {
              window.scrollTo({ top: y, left: x, behavior: 'instant' });
              
              // Verify scroll was successful, retry with increasing delay if not
              setTimeout(() => {
                const diff = Math.abs(window.scrollY - y);
                if (diff > 50 && attempts > 1) {
                  // Content may still be loading, try again with longer delay
                  attemptRestore(attempts - 1, Math.min(delay + 50, 300));
                } else {
                  isRestoringRef.current = false;
                }
              }, 50);
            }, delay);
          };
          
          // Start attempting immediately with more attempts
          attemptRestore(15, 10);
        } else {
          // Remove stale entries from both storages
          sessionStorage.removeItem(scrollKey);
          const storage = getStorage();
          if (storage) {
            storage.removeItem(scrollKey);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to restore scroll position:', e);
      isRestoringRef.current = false;
    }
  }, [router.asPath, getScrollKey]);

  // Clear scroll position for current page
  const clearScrollPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const scrollKey = getScrollKey(router.asPath);
    try {
      sessionStorage.removeItem(scrollKey);
      const storage = getStorage();
      if (storage) {
        storage.removeItem(scrollKey);
      }
    } catch (e) {
      // Ignore errors
    }
  }, [router.asPath, getScrollKey]);

  // Save scroll position before route change
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const currentPath = router.asPath;
      const currentBasePath = currentPath.split('?')[0];
      const newBasePath = url.split('?')[0];
      
      // Mark that navigation is starting
      isNavigatingRef.current = true;
      
      // Always save scroll position when navigating away
      saveScrollPosition(currentPath);
      saveLastVisitedPath(currentPath);
      previousPathRef.current = currentPath;
      
      // Add to navigation stack if navigating to a different page (not pagination)
      // But don't add if we're going BACK to a page already in the stack
      if (currentBasePath !== newBasePath) {
        const stack = getNavigationStack();
        const targetInStack = stack.some(path => path.split('?')[0] === newBasePath);
        
        // Only push to stack if we're navigating FORWARD (target not in stack)
        if (!targetInStack) {
          stack.push(currentPath);
          saveNavigationStack(stack);
        }
      }
    };

    const handleRouteChangeError = () => {
      // Clear navigation flag on error
      isNavigatingRef.current = false;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events, router.asPath, saveScrollPosition, saveLastVisitedPath, getNavigationStack, saveNavigationStack]);

  // Restore scroll position after route change complete
  useEffect(() => {
    const handleRouteChangeComplete = (url: string) => {
      // Clear navigation flag
      isNavigatingRef.current = false;
      
      // Skip if this is a popstate navigation (browser back/forward)
      // as handlePopState will handle scroll restoration
      if (isPopStateNavigationRef.current) {
        isPopStateNavigationRef.current = false;
        return;
      }
      
      const currentBasePath = url.split('?')[0];
      
      // Check if we're coming back to a previously visited page
      const stack = getNavigationStack();
      const matchingEntry = stack.find(path => path.split('?')[0] === currentBasePath);
      const isNavigatingBack = !!matchingEntry;
      
      // Check if breadcrumb or other component flagged that we should restore scroll
      let shouldRestoreFromFlag = false;
      let flaggedPath = '';
      try {
        flaggedPath = sessionStorage.getItem('should_restore_scroll') || '';
        if (flaggedPath && (flaggedPath === url || flaggedPath.split('?')[0] === currentBasePath)) {
          shouldRestoreFromFlag = true;
          sessionStorage.removeItem('should_restore_scroll');
        }
      } catch {
        // Ignore
      }
      
      // Also check if we have a saved scroll position for this URL (even without stack entry)
      const scrollKey = getScrollKey(url);
      let hasSavedPosition = false;
      let savedPositionPath = url;
      try {
        let saved = sessionStorage.getItem(scrollKey);
        if (!saved) {
          const storage = getStorage();
          if (storage) {
            saved = storage.getItem(scrollKey);
          }
        }
        if (saved) {
          const { timestamp, y } = JSON.parse(saved);
          const twoHours = 2 * 60 * 60 * 1000;
          hasSavedPosition = Date.now() - timestamp < twoHours && y > 0;
        }
        
        // If no saved position for exact URL, try the flagged path
        if (!hasSavedPosition && shouldRestoreFromFlag && flaggedPath !== url) {
          const flaggedKey = getScrollKey(flaggedPath);
          let flaggedSaved = sessionStorage.getItem(flaggedKey);
          if (!flaggedSaved) {
            const storage = getStorage();
            if (storage) {
              flaggedSaved = storage.getItem(flaggedKey);
            }
          }
          if (flaggedSaved) {
            const { timestamp, y } = JSON.parse(flaggedSaved);
            const twoHours = 2 * 60 * 60 * 1000;
            if (Date.now() - timestamp < twoHours && y > 0) {
              hasSavedPosition = true;
              savedPositionPath = flaggedPath;
            }
          }
        }
      } catch {
        // Ignore
      }
      
      // Restore if we're navigating back, have a saved position, or breadcrumb flagged it
      if (isNavigatingBack || hasSavedPosition || shouldRestoreFromFlag) {
        // Try to restore scroll for the exact saved URL (with query params)
        // This handles cases like clicking breadcrumb which goes to base URL
        // but we want to restore position from the paginated URL
        setTimeout(() => {
          // First try exact URL match or flagged path
          if (hasSavedPosition) {
            restoreScrollPosition(savedPositionPath);
          } else if (matchingEntry) {
            // Fall back to the saved entry from navigation stack
            restoreScrollPosition(matchingEntry);
          } else if (shouldRestoreFromFlag && flaggedPath) {
            restoreScrollPosition(flaggedPath);
          }
        }, 150);
        
        // Remove entries from stack up to and including this page
        // (simulating going "back" in history)
        if (isNavigatingBack) {
          const updatedStack = stack.filter(path => path.split('?')[0] !== currentBasePath);
          saveNavigationStack(updatedStack);
        }
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, restoreScrollPosition, getNavigationStack, saveNavigationStack, getScrollKey]);

  // Restore scroll on initial mount - handles page refresh and direct URL access
  useEffect(() => {
    if (!hasInitializedRef.current && router.isReady) {
      hasInitializedRef.current = true;
      
      const currentPath = router.asPath;
      const currentBasePath = currentPath.split('?')[0];
      const stack = getNavigationStack();
      const matchingEntry = stack.find(path => path.split('?')[0] === currentBasePath);
      
      // Check if we have a saved scroll position for this exact path (page refresh case)
      const scrollKey = getScrollKey(currentPath);
      let hasSavedPosition = false;
      
      try {
        // Check localStorage first (persists across refresh)
        const storage = getStorage();
        if (storage) {
          const saved = storage.getItem(scrollKey);
          if (saved) {
            const { timestamp } = JSON.parse(saved);
            const twoHours = 2 * 60 * 60 * 1000;
            hasSavedPosition = Date.now() - timestamp < twoHours;
          }
        }
        // Also check sessionStorage
        if (!hasSavedPosition) {
          const savedSession = sessionStorage.getItem(scrollKey);
          if (savedSession) {
            const { timestamp } = JSON.parse(savedSession);
            const twoHours = 2 * 60 * 60 * 1000;
            hasSavedPosition = Date.now() - timestamp < twoHours;
          }
        }
      } catch {
        // Ignore errors
      }
      
      // If we have a saved position (page refresh) or matching stack entry (back navigation)
      if (hasSavedPosition || matchingEntry) {
        setTimeout(() => {
          if (hasSavedPosition) {
            restoreScrollPosition(currentPath);
          } else if (matchingEntry) {
            restoreScrollPosition(matchingEntry);
          }
          
          // Clean up the stack if we came from navigation
          if (matchingEntry) {
            const updatedStack = stack.filter(path => path.split('?')[0] !== currentBasePath);
            saveNavigationStack(updatedStack);
          }
        }, 200);
      }
    }
  }, [router.isReady, router.asPath, getNavigationStack, getScrollKey, restoreScrollPosition, saveNavigationStack]);

  // Handle browser back/forward buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disable browser's default scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const handlePopState = () => {
      // Mark that this is a popstate navigation so handleRouteChangeComplete skips
      isPopStateNavigationRef.current = true;
      
      // The URL has already changed when popstate fires
      // Get the target path from navigation stack (it has the full URL with query params)
      const currentBasePath = window.location.pathname;
      const currentPath = window.location.pathname + window.location.search;
      
      // Find matching entry in stack (with query params for correct scroll position)
      const stack = getNavigationStack();
      const matchingEntry = stack.find(path => path.split('?')[0] === currentBasePath);
      
      // Wait for Next.js to update the router, then restore scroll
      setTimeout(() => {
        // Restore scroll using the saved entry (with query params) or current path
        if (matchingEntry) {
          restoreScrollPosition(matchingEntry);
        } else {
          restoreScrollPosition(currentPath);
        }
        
        // Pop from navigation stack when going back
        if (stack.length > 0) {
          const updatedStack = stack.filter(path => path.split('?')[0] !== currentBasePath);
          saveNavigationStack(updatedStack);
        }
      }, 150);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Re-enable browser's default scroll restoration on cleanup
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [restoreScrollPosition, getNavigationStack, saveNavigationStack]);

  // Save scroll position periodically and before page unload
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Save scroll position before page unload (for refresh)
    const handleBeforeUnload = () => {
      const currentPath = router.asPath;
      saveScrollPosition(currentPath);
      saveLastVisitedPath(currentPath);
    };

    // Save scroll position on scroll (throttled)
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isRestoringRef.current) {
          saveScrollPosition(router.asPath);
        }
      }, 500);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [router.asPath, saveScrollPosition, saveLastVisitedPath]);

  // Get saved path for a given base URL (useful for breadcrumbs)
  const getSavedPathForBase = useCallback((basePath: string): string => {
    const stack = getNavigationStack();
    // Find the last entry that matches this base path
    const matchingEntry = [...stack].reverse().find(path => path.split('?')[0] === basePath);
    return matchingEntry || basePath;
  }, [getNavigationStack]);

  // Mark that scroll should be restored when navigating to a path
  // Call this onClick before navigation to ensure scroll restoration
  const markForScrollRestore = useCallback((path: string) => {
    try {
      sessionStorage.setItem('should_restore_scroll', path);
    } catch {
      // Ignore
    }
  }, []);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    getSavedPathForBase,
    markForScrollRestore,
    getNavigationStack
  };
};

export default useScrollRestoration;
