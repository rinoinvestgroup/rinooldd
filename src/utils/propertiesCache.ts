/**
 * Properties Cache Utility
 * Caches properties data in memory and sessionStorage to prevent re-fetching
 * when navigating back to property listing pages.
 */

import { Property } from '../data/properties';

// Cache key prefix
const CACHE_KEY_PREFIX = 'properties_cache_';
const CACHE_TIMESTAMP_PREFIX = 'properties_cache_ts_';

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

// In-memory cache for faster access during the same session
const memoryCache: Map<string, { data: Property[]; timestamp: number }> = new Map();

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
 * Get cached properties for a category
 * Returns null if no valid cache exists
 */
export const getCachedProperties = (category: string): Property[] | null => {
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
        const data = JSON.parse(cachedData) as Property[];
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
    console.warn('Failed to read properties cache:', error);
  }

  return null;
};

/**
 * Cache properties for a category
 */
export const setCachedProperties = (category: string, properties: Property[]): void => {
  const timestamp = Date.now();
  
  // Update memory cache
  memoryCache.set(category, { data: properties, timestamp });

  // Update sessionStorage
  try {
    if (typeof window === 'undefined') return;
    
    const cacheKey = getCacheKey(category);
    const timestampKey = getTimestampKey(category);
    
    sessionStorage.setItem(cacheKey, JSON.stringify(properties));
    sessionStorage.setItem(timestampKey, timestamp.toString());
  } catch (error) {
    console.warn('Failed to write properties cache:', error);
    // If sessionStorage is full, just keep memory cache
  }
};

/**
 * Clear cache for a specific category
 */
export const clearPropertiesCache = (category: string): void => {
  memoryCache.delete(category);

  try {
    if (typeof window === 'undefined') return;
    
    const cacheKey = getCacheKey(category);
    const timestampKey = getTimestampKey(category);
    
    sessionStorage.removeItem(cacheKey);
    sessionStorage.removeItem(timestampKey);
  } catch (error) {
    console.warn('Failed to clear properties cache:', error);
  }
};

/**
 * Clear all properties caches
 */
export const clearAllPropertiesCaches = (): void => {
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
    console.warn('Failed to clear all properties caches:', error);
  }
};

/**
 * Get cache status for debugging
 */
export const getCacheStatus = (category: string): { cached: boolean; age: number | null; count: number | null } => {
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
