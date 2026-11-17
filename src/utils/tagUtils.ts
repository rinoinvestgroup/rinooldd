/**
 * Utility functions for handling blog tags safely
 */

/**
 * Safely converts tags to an array of strings regardless of input format
 * @param tags - Can be string, array of strings, or undefined
 * @returns Array of trimmed, non-empty tag strings
 */
export const normalizeTagsToArray = (tags: string | string[] | undefined | null): string[] => {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags
      .filter(tag => tag && typeof tag === 'string')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
  }
  
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
  }
  
  return [];
};

/**
 * Safely converts tags to a comma-separated string
 * @param tags - Can be string, array of strings, or undefined
 * @returns Comma-separated string of tags
 */
export const normalizeTagsToString = (tags: string | string[] | undefined | null): string => {
  const tagArray = normalizeTagsToArray(tags);
  return tagArray.join(', ');
};

/**
 * Checks if tags contain a search term (case-insensitive)
 * @param tags - Tags in any format
 * @param searchTerm - Term to search for
 * @returns Boolean indicating if search term is found in tags
 */
export const tagsInclude = (tags: string | string[] | undefined | null, searchTerm: string): boolean => {
  if (!tags || !searchTerm) return false;
  
  const tagArray = normalizeTagsToArray(tags);
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return tagArray.some(tag => tag.toLowerCase().includes(lowerSearchTerm));
};

/**
 * Gets first N tags as an array
 * @param tags - Tags in any format
 * @param limit - Maximum number of tags to return
 * @returns Array of first N tags
 */
export const getFirstNTags = (tags: string | string[] | undefined | null, limit: number = 3): string[] => {
  const tagArray = normalizeTagsToArray(tags);
  return tagArray.slice(0, limit);
};
