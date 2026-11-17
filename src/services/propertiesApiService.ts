import { Property } from '../data/properties';
import { getPropertiesByCategory, getAllProperties, getPropertyById, getPropertyBySlug as httpGetPropertyBySlug, transformApiProperty, getFeaturedProperties as httpGetFeaturedProperties, getBuyProperties as httpGetBuyProperties, getRentProperties as httpGetRentProperties } from './httpServices';

/**
 * Centralized API service for fetching properties
 */
export class PropertiesApiService {
  
  /**
   * Fetch properties by category (spain or uae)
   */
  static async getPropertiesByCategory(category: 'spain' | 'uae' | 'argentina'): Promise<Property[]> {
    try {
   
      const response = await getPropertiesByCategory(category, { page: 1, limit: 200 });
      
      // Handle different response structures
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      if (responseData && Array.isArray(responseData)) {
        
        // Transform API data to UI format with safety checks
        const transformedProperties = responseData.map(transformApiProperty).map((property: any) => ({
          ...property,
          // Ensure all properties have required fields
          property_type: property.property_type || 'buy' as Property['property_type'],
          listing_type: property.property_type === 'buy' ? (property.listing_type || 'off-plan') : null,
          status: property.status || 'approved' as Property['status']
        }));
        
        return transformedProperties;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error: any) {
      
      // Provide detailed error information
      let errorMessage = `Failed to load ${category} properties from API`;
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Properties endpoint not found. Please check API configuration.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please check API credentials.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch all properties (both spain and uae)
   * Always fetches from both category endpoints to ensure consistency
   * with individual Spain and UAE pages
   */
  static async getAllProperties(): Promise<Property[]> {
    try {
      // Always fetch from both categories to ensure consistency with category-specific pages
      const [spainProperties, uaeProperties, argentinaProperties] = await Promise.all([
        this.getPropertiesByCategory('spain').catch(() => []),
        this.getPropertiesByCategory('uae').catch(() => []),
        this.getPropertiesByCategory('argentina').catch(() => [])
      ]);
      
      const combinedProperties = [...spainProperties, ...uaeProperties, ...argentinaProperties];
      
      // Deduplicate by property ID to avoid duplicates
      const uniquePropertiesMap = new Map<string, Property>();
      for (const property of combinedProperties) {
        if (property.id && !uniquePropertiesMap.has(property.id)) {
          uniquePropertiesMap.set(property.id, property);
        }
      }
      const allProperties = Array.from(uniquePropertiesMap.values());
      
      if (allProperties.length === 0) {
        // Fallback to general endpoint if category endpoints fail
        const response = await getAllProperties({ page: 1, limit: 200 });
        
        // Handle different response structures
        let responseData = response;
        if (response && response.data) {
          responseData = response.data;
        }
        
        if (responseData && Array.isArray(responseData)) {
          // Transform API data to UI format with safety checks
          const transformedProperties = responseData.map(transformApiProperty).map((property: any) => ({
            ...property,
            // Ensure all properties have required fields
            property_type: property.property_type || 'buy' as Property['property_type'],
            listing_type: property.property_type === 'buy' ? (property.listing_type || 'off-plan') : null,
            status: property.status || 'approved' as Property['status']
          }));
          
          return transformedProperties;
        }
      }
      
      return allProperties;
    } catch (error: any) {
      throw new Error('Failed to load properties from any API endpoint');
    }
  }

  /**
   * Fetch ALL properties from the general /items endpoint (all countries)
   * Unlike getAllProperties(), this is not limited to specific categories
   */
  static async getAllPropertiesUnfiltered(): Promise<Property[]> {
    try {
      const response = await getAllProperties({ page: 1, limit: 200 });
      
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      if (responseData && Array.isArray(responseData)) {
        const transformedProperties = responseData.map(transformApiProperty).map((property: any) => ({
          ...property,
          property_type: property.property_type || 'buy' as Property['property_type'],
          listing_type: property.property_type === 'buy' ? (property.listing_type || 'off-plan') : null,
          status: property.status || 'approved' as Property['status']
        }));
        
        return transformedProperties;
      }
      
      return [];
    } catch (error: any) {
      // Fallback to category-based fetch
      return this.getAllProperties();
    }
  }

  /**
   * Fetch featured properties (server-side via /items/featured)
   */
  static async getFeaturedProperties(options?: { limit?: number; property_type?: string }): Promise<Property[]> {
    try {
      // Only pass valid, non-empty parameters to prevent 400 errors
      const apiParams: { property_type?: string; page?: number; limit?: number } = {};
      
      if (options?.property_type && options.property_type.trim()) {
        apiParams.property_type = options.property_type.trim();
      }
      
      if (options?.limit && options.limit > 0) {
        apiParams.limit = options.limit;
      }
      
      const response = await httpGetFeaturedProperties(apiParams);
      
      let responseData = response;
      if (response && (response as any).data) {
        responseData = (response as any).data;
      }

      if (responseData && Array.isArray(responseData)) {
        const transformed = responseData.map(transformApiProperty).map((property: any) => ({
          ...property,
          property_type: property.property_type || 'buy' as Property['property_type'],
          listing_type: property.property_type === 'buy' ? (property.listing_type || 'off-plan') : null,
          status: property.status || 'approved' as Property['status'],
        }));
        return transformed;
      }
      
      throw new Error('Invalid API response format');
    } catch (error) {
      // Fallback to client-side filtering if server endpoint fails
      try {
        const all = await this.getAllProperties();
        const featured = all.filter(p => p.featured);
        if (options?.property_type) {
          const uiTypeMap: Record<string, Property['type']> = {
            'villa': 'Villa',
            'apartment': 'Apartment',
            'commercial-property': 'Commercial',
          };
          const wanted = uiTypeMap[options.property_type.toLowerCase()] || ('Apartment' as Property['type']);
          return featured.filter(p => p.type === wanted);
        }
        return featured;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  }

  /**
   * Get available cities for a country from API data
   */
  static getCitiesFromProperties(properties: Property[]): string[] {
    return Array.from(new Set(properties.map(p => p.city).filter(Boolean))).sort();
  }

  /**
   * Get available property types from API data
   */
  static getTypesFromProperties(properties: Property[]): Property['type'][] {
    return Array.from(new Set(properties.map(p => p.type))) as Property['type'][];
  }

  /**
   * Fetch properties for sale (type = 'buy') via /items/buy
   */
  static async getBuyProperties(options?: {
    category?: string;
    city?: string;
    listing_type?: string;
    property_type?: string;
    min?: number;
    max?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Property[]> {
    try {
      const response = await httpGetBuyProperties(options);
      
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      if (responseData && Array.isArray(responseData)) {
        return responseData.map(transformApiProperty).map((property: any) => ({
          ...property,
          property_type: 'buy' as const,
          listing_type: property.listing_type || 'off-plan',
          status: property.status || 'approved'
        }));
      }
      
      throw new Error('Invalid API response format');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch buy properties');
    }
  }

  /**
   * Fetch properties for rent (type = 'rent') via /items/rent
   */
  static async getRentProperties(options?: {
    category?: string;
    city?: string;
    property_type?: string;
    min?: number;
    max?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Property[]> {
    try {
      const response = await httpGetRentProperties(options);
      
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      if (responseData && Array.isArray(responseData)) {
        return responseData.map(transformApiProperty).map((property: any) => ({
          ...property,
          property_type: 'rent' as const,
          listing_type: null,
          status: property.status || 'approved'
        }));
      }
      
      throw new Error('Invalid API response format');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch rent properties');
    }
  }

  /**
   * Fetch a single property by ID
   */
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      const response = await getPropertyById(id);
      
      if (response) {
        
        // Handle different response structures
        const propertyData = response.data || response;
        
        // Transform API data to UI format
        const transformedProperty = transformApiProperty(propertyData);
        
        // Ensure all required fields are present
        const property = {
          ...transformedProperty,
          listing_type: transformedProperty.listing_type || 'off-plan' as Property['listing_type'],
          status: transformedProperty.status || 'approved' as Property['status']
        } as Property;
        
        return property;
      } else {
        return null;
      }
    } catch (error: any) {
      
      // If direct API call fails, try to find in all properties as fallback
      try {
        const allProperties = await this.getAllProperties();
        const property = allProperties.find(p => 
          p.id === id || 
          p.id.toString() === id
        );
        return property || null;
      } catch (fallbackError) {
        return null;
      }
    }
  }

  /**
   * Fetch a single property by slug - Optimized for ISR
   */
  static async getPropertyBySlug(slug: string): Promise<Property | null> {
    try {
      
      const response = await httpGetPropertyBySlug(slug);
      
      // Handle different response structures
      const propertyData = response.data || response;
      
      // Transform API data to UI format
      const transformedProperty = transformApiProperty(propertyData);
      
      // Ensure all required fields are present
      const property = {
        ...transformedProperty,
        listing_type: transformedProperty.listing_type as Property['listing_type'],
        status: transformedProperty.status as Property['status']
      } as Property;

      return property;
    } catch (error: any) {
      // Return null instead of expensive fallback for better ISR performance
      return null;
    }
  }

  /**
   * Fetch a single property by slug with fallback - Optimized for ISR build time and runtime
   */
  static async getPropertyBySlugWithFallback(slug: string): Promise<Property | null> {
    try {
      
      // Try direct API call first (fastest method)
      const property = await this.getPropertyBySlug(slug);
      if (property) {
        return property;
      }
      
      // This is more expensive but necessary for ISR builds and edge cases
      const allProperties = await this.getAllProperties();
      const { findPropertyBySlug } = await import('../utils/slugUtils');
      const fallbackProperty = findPropertyBySlug(allProperties, slug);
      
      return fallbackProperty;
    } catch (error: any) {
      return null;
    }
  }

  /**
   * Search properties using the /items/search endpoint
   * This endpoint supports regex search across multiple fields:
   * - title: { $regex: regex }
   * - city: { $regex: regex } 
   * - status: { $regex: regex }
   * - property_id: { $regex: regex }
   * - listing_type: { $regex: regex }
   */
  static async searchProperties(searchParams: {
    query?: string;
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    property_type?: string;
    listing_type?: string;
    type?: string; // 'buy' | 'rent'
    page?: number;
    limit?: number;
  }): Promise<Property[]> {
    try {
      const { searchProperties } = await import('./httpServices');
      
      const response = await searchProperties(searchParams);
      
      // Handle different response structures
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      if (responseData && Array.isArray(responseData)) {
        // Transform API data to UI format with safety checks
        const transformedProperties = responseData.map(transformApiProperty).map((property: any) => ({
          ...property,
          // Ensure all properties have required fields
          property_type: property.property_type || 'buy' as Property['property_type'],
          listing_type: property.property_type === 'buy' ? (property.listing_type || 'off-plan') : null,
          status: property.status || 'approved' as Property['status']
        }));
        
        return transformedProperties;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error: any) {
      // Provide detailed error information
      let errorMessage = 'Failed to search properties';
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Search endpoint not found. Please check API configuration.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please check API credentials.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
}

export default PropertiesApiService;
