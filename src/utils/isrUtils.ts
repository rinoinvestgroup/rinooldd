/**
 * Utility functions for ISR (Incremental Static Regeneration)
 */

/**
 * Triggers revalidation of a property page
 * @param slug - Property slug to revalidate
 * @param baseUrl - Base URL of the application (optional, defaults to current origin)
 */
export async function revalidatePropertyPage(slug: string, baseUrl?: string): Promise<boolean> {
  try {
    const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    const secret = process.env.REVALIDATION_SECRET || 'fallback-secret-change-in-production';
    
    const response = await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
        secret,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Triggers revalidation of multiple property pages
 * @param slugs - Array of property slugs to revalidate
 * @param baseUrl - Base URL of the application (optional)
 */
export async function revalidateMultiplePropertyPages(slugs: string[], baseUrl?: string): Promise<{ success: number; failed: number }> {
  const results = await Promise.allSettled(
    slugs.map(slug => revalidatePropertyPage(slug, baseUrl))
  );

  const success = results.filter(result => result.status === 'fulfilled' && result.value).length;
  const failed = results.length - success;

  return { success, failed };
}

/**
 * Get the recommended revalidation interval based on property characteristics
 * @param property - Property object
 * @returns Revalidation interval in seconds
 */
export function getRevalidationInterval(property: any): number {
  if (property.featured || property.status === 'sold') {
    // Featured or sold properties: moderate refresh rate
    return 900; // 15 minutes
  } else if (property.status === 'negotiable') {
    // Negotiable properties: faster updates for price changes
    return 600; // 10 minutes
  } else {
    // Regular properties: standard refresh rate
    return 1800; // 30 minutes
  }
}

/**
 * Get the recommended revalidation interval based on blog characteristics
 * @param blog - Blog object
 * @returns Revalidation interval in seconds
 */
export function getBlogRevalidationInterval(blog: any): number {
  if (blog.status === 'published' && blog.views > 1000) {
    // Popular published blogs: moderate refresh rate
    return 1800; // 30 minutes
  } else if (blog.status === 'published') {
    // Regular published blogs: standard refresh rate
    return 3600; // 1 hour
  } else if (blog.status === 'draft') {
    // Draft blogs: faster updates for content changes
    return 300; // 5 minutes
  } else {
    // Default case
    return 3600; // 1 hour
  }
}

/**
 * Triggers revalidation of a blog page
 * @param slug - Blog slug to revalidate
 * @param baseUrl - Base URL of the application (optional, defaults to current origin)
 */
export async function revalidateBlogPage(slug: string, baseUrl?: string): Promise<boolean> {
  try {
    const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    const secret = process.env.REVALIDATION_SECRET || 'fallback-secret-change-in-production';
    
    const response = await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: `/blog/${slug}`,
        secret,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

/**
 * Triggers revalidation of multiple blog pages
 * @param slugs - Array of blog slugs to revalidate
 * @param baseUrl - Base URL of the application (optional)
 */
export async function revalidateMultipleBlogPages(slugs: string[], baseUrl?: string): Promise<{ success: number; failed: number }> {
  const results = await Promise.allSettled(
    slugs.map(slug => revalidateBlogPage(slug, baseUrl))
  );

  const success = results.filter(result => result.status === 'fulfilled' && result.value).length;
  const failed = results.length - success;

  return { success, failed };
}

/**
 * Check if ISR is enabled for the current environment
 */
export function isISREnabled(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.ENABLE_ISR === 'true';
}

/**
 * Get ISR debug information
 */
export function getISRDebugInfo() {
  return {
    enabled: isISREnabled(),
    nodeEnv: process.env.NODE_ENV,
    hasRevalidationSecret: !!process.env.REVALIDATION_SECRET,
    timestamp: new Date().toISOString(),
  };
}
