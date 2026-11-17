/**
 * Utility functions for generating and parsing property slugs
 */

// Generate URL-friendly slug from property title
export const createPropertySlug = (title: string, id?: string): string => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing whitespace
  
  // If an ID is provided and the slug is generic or too common, append a portion of the ID for uniqueness
  if (id && slug.length < 10) {
    const shortId = id.slice(-6); // Use last 6 characters of ID
    slug = `${slug}-${shortId}`;
  }
  
  return slug;
};

// Extract property by slug (you'll need to use this to find property by slug instead of ID)
export const extractSlugFromUrl = (slug: string): string => {
  if (!slug) return '';
  
  return slug; // Return the full slug as is
};

// Generate URL-friendly slug from blog post title
export const createBlogSlug = (title: string, id?: number): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return slug;
};

// Extract blog post slug (you'll need to find blog post by slug instead of ID)
export const extractBlogSlugFromUrl = (slug: string): string => {
  if (!slug) return ''; 
  
  return slug; // Return the full slug as is
};

// Validate slug format
export const isValidSlug = (slug: string): boolean => {
  if (!slug) return false;
  
  // Check if slug contains only lowercase letters, numbers, and hyphens
  const slugPattern = /^[a-z0-9-]+$/;
  return slugPattern.test(slug);
};

// Clean text for SEO-friendly URLs
export const cleanTextForUrl = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Helper function to check if two slugs are essentially the same (ignoring numeric suffixes)
export const isSimilarSlug = (slug1: string, slug2: string): boolean => {
  if (!slug1 || !slug2) return false;
  
  // Remove numeric suffixes for comparison
  const base1 = slug1.replace(/-\d+$/, '');
  const base2 = slug2.replace(/-\d+$/, '');
  
  return base1 === base2 || slug1 === slug2 || base1 === slug2 || base2 === slug1;
};

// Helper function to find the best matching property by slug
export const findPropertyBySlug = (properties: any[], targetSlug: string): any | null => {
  if (!properties || !targetSlug) return null;
  
  // First try exact match
  let property = properties.find(p => p.slug === targetSlug);
  if (property) {
    return property;
  }
  
  // Try similar slug matching
  property = properties.find(p => isSimilarSlug(p.slug, targetSlug));
  if (property) {
    return property;
  }
  
  // Try title-generated slug matching
  property = properties.find(p => {
    const generatedSlug = createPropertySlug(p.title, p.id);
    return isSimilarSlug(generatedSlug, targetSlug);
  });
  
  
  return property || null;
};
