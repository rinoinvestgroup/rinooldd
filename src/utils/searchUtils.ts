/**
 * Utility functions for handling property search parameters and URL query strings
 */

export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  property_type?: string;
  listing_type?: string;
  type?: string; // 'buy' | 'rent'
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

/**
 * Convert URL query parameters to search filters
 */
export const parseSearchParams = (query: any): SearchFilters => {
  const filters: SearchFilters = {};

  if (query.search) {
    filters.query = query.search as string;
  }
  if (query.category) {
    filters.category = query.category as string;
  }
  if (query.city) {
    filters.city = query.city as string;
  }
  if (query.type) {
    // Check if this is a property type (buy/rent) or listing type
    const propertyTypes = ['buy', 'rent'];
    const typeValue = (query.type as string).toLowerCase();
    if (propertyTypes.includes(typeValue)) {
      filters.type = typeValue;
    } else {
      // Map UI values to API values for listing_type
      const typeMap: { [key: string]: string } = {
        'Ready to Move': 'ready-to-move',
        'Off plan': 'off-plan',
        'Off-Plan': 'off-plan'
      };
      filters.listing_type = typeMap[query.type as string] || query.type as string;
    }
  }
  if (query.listing_type) {
    const listingTypeMap: { [key: string]: string } = {
      'Ready to Move': 'ready-to-move',
      'ready-to-move': 'ready-to-move',
      'Off plan': 'off-plan',
      'Off-Plan': 'off-plan',
      'off-plan': 'off-plan'
    };
    filters.listing_type = listingTypeMap[query.listing_type as string] || query.listing_type as string;
  }
  if (query.propertyType) {
    filters.type = (query.propertyType as string).toLowerCase();
  }
  if (query.minPrice) {
    filters.minPrice = parseInt(query.minPrice as string);
  }
  if (query.maxPrice) {
    filters.maxPrice = parseInt(query.maxPrice as string);
  }
  if (query.page) {
    filters.page = parseInt(query.page as string);
  }
  if (query.limit) {
    filters.limit = parseInt(query.limit as string);
  }

  return filters;
};

/**
 * Convert search filters to URL query parameters
 */
export const filtersToQueryParams = (filters: SearchFilters): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'query') {
        params.append('search', value.toString());
      } else if (key === 'listing_type') {
        // Map API values back to UI values for URL
        const uiTypeMap: { [key: string]: string } = {
          'ready-to-move': 'Ready to Move',
          'off-plan': 'Off plan'
        };
        params.append('listing_type', uiTypeMap[value.toString()] || value.toString());
      } else if (key === 'type') {
        // property type: buy, rent
        params.append('propertyType', value.toString());
      } else {
        params.append(key, value.toString());
      }
    }
  });

  return params;
};

/**
 * Determine the appropriate page route based on search parameters
 */
export const getSearchRoute = (filters: SearchFilters): string => {
  if (filters.category === 'spain') {
    return '/properties/spain';
  } else if (filters.category === 'argentina') {
    return '/properties/international';
  } else {
    return '/properties/dubai';
  }
};

/**
 * Clean and normalize location input for search
 */
export const normalizeLocation = (location: string): string => {
  return location
    .replace(', Spain', '')
    .replace(', UAE', '')
    .replace(', Argentina', '')
    .trim();
};

/**
 * Detect category from location string
 */
export const getCategoryFromLocation = (location: string): string | undefined => {
  const lowerLocation = location.toLowerCase();
  
  const spainKeywords = ['spain', 'barcelona', 'madrid', 'valencia', 'marbella', 'seville', 'bilbao'];
  const uaeKeywords = ['dubai', 'uae', 'abu dhabi', 'marina', 'palm jumeirah', 'business bay', 'downtown'];
  const argentinaKeywords = ['argentina', 'buenos aires', 'mendoza', 'córdoba', 'cordoba', 'rosario', 'patagonia'];
  
  if (spainKeywords.some(keyword => lowerLocation.includes(keyword))) {
    return 'spain';
  } else if (uaeKeywords.some(keyword => lowerLocation.includes(keyword))) {
    return 'uae';
  } else if (argentinaKeywords.some(keyword => lowerLocation.includes(keyword))) {
    return 'argentina';
  }
  
  return undefined;
};

/**
 * Build search query for API based on the regex search fields
 * The API endpoint supports regex search across:
 * - title: { $regex: regex }
 * - city: { $regex: regex }
 * - status: { $regex: regex }
 * - property_id: { $regex: regex }
 * - listing_type: { $regex: regex }
 */
export const buildSearchQuery = (searchTerm: string): string => {
  // Clean the search term
  const cleanTerm = searchTerm.trim();
  
  // The API will handle the regex matching across multiple fields
  // We just need to provide the clean search term
  return cleanTerm;
};

/**
 * Validate search parameters before sending to API
 */
export const validateSearchParams = (params: SearchFilters): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if at least one search parameter is provided (allow category-only searches)
  const hasSearchCriteria = params.query || params.category || params.city || params.property_type;
  
  // Only require search criteria if we're doing a general search, not category-specific
  if (!hasSearchCriteria && !params.category) {
    errors.push('Please provide at least one search criterion');
  }

  // Validate numeric values
  if (params.minPrice !== undefined && (isNaN(params.minPrice) || params.minPrice < 0)) {
    errors.push('Minimum price must be a valid positive number');
  }

  if (params.maxPrice !== undefined && (isNaN(params.maxPrice) || params.maxPrice < 0)) {
    errors.push('Maximum price must be a valid positive number');
  }

  if (params.minPrice && params.maxPrice && params.minPrice > params.maxPrice) {
    errors.push('Minimum price cannot be greater than maximum price');
  }

  if (params.page !== undefined && (isNaN(params.page) || params.page < 1)) {
    errors.push('Page must be a valid positive number');
  }

  if (params.limit !== undefined && (isNaN(params.limit) || params.limit < 1 || params.limit > 200)) {
    errors.push('Limit must be between 1 and 200');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  parseSearchParams,
  filtersToQueryParams,
  getSearchRoute,
  normalizeLocation,
  getCategoryFromLocation,
  buildSearchQuery,
  validateSearchParams
};
