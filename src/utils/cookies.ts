/**
 * Cookie utility functions for managing site cookies
 */

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (typeof document === 'undefined') return;

  const {
    expires,
    path = '/',
    domain,
    secure = true,
    sameSite = 'lax',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    const expiresDate = typeof expires === 'number' 
      ? new Date(Date.now() + expires * 24 * 60 * 60 * 1000)
      : expires;
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  cookieString += `; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Delete a cookie
 */
export const deleteCookie = (
  name: string,
  options: Omit<CookieOptions, 'expires'> = {}
): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  });
};

/**
 * Check if cookies are enabled
 */
export const areCookiesEnabled = (): boolean => {
  if (typeof document === 'undefined') return false;

  try {
    const testCookie = 'cookietest';
    setCookie(testCookie, 'test', { expires: 1 });
    const enabled = getCookie(testCookie) !== null;
    deleteCookie(testCookie);
    return enabled;
  } catch {
    return false;
  }
};

/**
 * Cookie consent management
 */
export const COOKIE_CONSENT_NAME = 'rino_cookie_consent';
export const COOKIE_PREFERENCES_NAME = 'rino_cookie_preferences';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const getDefaultPreferences = (): CookiePreferences => ({
  necessary: true, // Always true, can't be disabled
  analytics: false,
  marketing: false,
  functional: false,
});

export const getCookieConsent = (): boolean => {
  return getCookie(COOKIE_CONSENT_NAME) === 'true';
};

export const setCookieConsent = (accepted: boolean): void => {
  setCookie(COOKIE_CONSENT_NAME, accepted.toString(), {
    expires: 365, // 1 year
    path: '/',
  });
};

export const getCookiePreferences = (): CookiePreferences => {
  const prefsString = getCookie(COOKIE_PREFERENCES_NAME);
  
  if (!prefsString) {
    return getDefaultPreferences();
  }

  try {
    return JSON.parse(prefsString);
  } catch {
    return getDefaultPreferences();
  }
};

export const setCookiePreferences = (preferences: CookiePreferences): void => {
  setCookie(COOKIE_PREFERENCES_NAME, JSON.stringify(preferences), {
    expires: 365, // 1 year
    path: '/',
  });
};

/**
 * Check if analytics cookies are allowed
 */
export const canUseAnalytics = (): boolean => {
  if (!getCookieConsent()) return false;
  const prefs = getCookiePreferences();
  return prefs.analytics;
};

/**
 * Check if marketing cookies are allowed
 */
export const canUseMarketing = (): boolean => {
  if (!getCookieConsent()) return false;
  const prefs = getCookiePreferences();
  return prefs.marketing;
};

/**
 * Check if functional cookies are allowed
 */
export const canUseFunctional = (): boolean => {
  if (!getCookieConsent()) return false;
  const prefs = getCookiePreferences();
  return prefs.functional;
};
