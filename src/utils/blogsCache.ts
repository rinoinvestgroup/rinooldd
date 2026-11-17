/**
 * Blogs Cache Utility
 * Caches blog data in memory and sessionStorage to prevent re-fetching
 * when navigating back to blog listing pages.
 */

import { Blog } from '../types/blog';

// Cache key prefix
const CACHE_KEY_PREFIX = 'blogs_cache_';
const CACHE_TIMESTAMP_PREFIX = 'blogs_cache_ts_';

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

// In-memory cache for faster access during the same session
const memoryCache: Map<string, { data: Blog[]; timestamp: number }> = new Map();

/**
 * Get the cache key for a category
 */
const getCacheKey = (category: string): string => {
  return `${CACHE_KEY_PREFIX}${category}`;
};

/**
 * Get the timestamp key for a category
 */
const getTimestampKey = (category: string): string => {
  return `${CACHE_TIMESTAMP_PREFIX}${category}`;
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

/**
 * Get cached blogs for a category
 * Returns null if no valid cache exists
 */
export const getCachedBlogs = (category: string): Blog[] | null => {
  // Check memory cache first (faster)
  const memCached = memoryCache.get(category);
  if (memCached && isCacheValid(memCached.timestamp)) {
    return memCached.data;
  }

  // Check sessionStorage
  try {
    if (typeof window === 'undefined') return null;
    
    const cacheKey = getCacheKey(category);
    const timestampKey = getTimestampKey(category);
    
    const cachedData = sessionStorage.getItem(cacheKey);
    const cachedTimestamp = sessionStorage.getItem(timestampKey);
    
    if (cachedData && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      if (isCacheValid(timestamp)) {
        const data = JSON.parse(cachedData) as Blog[];
        // Populate memory cache for faster subsequent access
        memoryCache.set(category, { data, timestamp });
        return data;
      } else {
        // Clear stale cache
        sessionStorage.removeItem(cacheKey);
        sessionStorage.removeItem(timestampKey);
      }
    }
  } catch (error) {
    console.warn('Failed to read blogs cache:', error);
  }

  return null;
};

/**
 * Cache blogs for a category
 */
export const setCachedBlogs = (category: string, blogs: Blog[]): void => {
  const timestamp = Date.now();
  
  // Update memory cache
  memoryCache.set(category, { data: blogs, timestamp });

  // Update sessionStorage
  try {
    if (typeof window === 'undefined') return;
    
    const cacheKey = getCacheKey(category);
    const timestampKey = getTimestampKey(category);
    
    sessionStorage.setItem(cacheKey, JSON.stringify(blogs));
    sessionStorage.setItem(timestampKey, timestamp.toString());
  } catch (error) {
    console.warn('Failed to write blogs cache:', error);
    // If sessionStorage is full, just keep memory cache
  }
};

/**
 * Clear cache for a specific category
 */
export const clearBlogsCache = (category: string): void => {
  memoryCache.delete(category);

  try {
    if (typeof window === 'undefined') return;
    
    const cacheKey = getCacheKey(category);
    const timestampKey = getTimestampKey(category);
    
    sessionStorage.removeItem(cacheKey);
    sessionStorage.removeItem(timestampKey);
  } catch (error) {
    console.warn('Failed to clear blogs cache:', error);
  }
};

/**
 * Clear all blogs caches
 */
export const clearAllBlogsCaches = (): void => {
  memoryCache.clear();

  try {
    if (typeof window === 'undefined') return;
    
    // Find and remove all cache entries
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith(CACHE_KEY_PREFIX) || key.startsWith(CACHE_TIMESTAMP_PREFIX))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear all blogs caches:', error);
  }
};

/**
 * Get cache status for debugging
 */
export const getBlogsCacheStatus = (category: string): { cached: boolean; age: number | null; count: number | null } => {
  const memCached = memoryCache.get(category);
  if (memCached) {
    return {
      cached: isCacheValid(memCached.timestamp),
      age: Date.now() - memCached.timestamp,
      count: memCached.data.length
    };
  }

  try {
    if (typeof window === 'undefined') return { cached: false, age: null, count: null };
    
    const timestampKey = getTimestampKey(category);
    const cacheKey = getCacheKey(category);
    
    const cachedTimestamp = sessionStorage.getItem(timestampKey);
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedTimestamp && cachedData) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const data = JSON.parse(cachedData);
      return {
        cached: isCacheValid(timestamp),
        age: Date.now() - timestamp,
        count: Array.isArray(data) ? data.length : null
      };
    }
  } catch {
    // Ignore
  }

  return { cached: false, age: null, count: null };
};
