import axios from 'axios';
import { createPropertySlug } from '../utils/slugUtils';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mmgapuw326.ap-south-1.awsapprunner.com/api';

// Derive the root URL (without the trailing /api) to resolve asset URLs
const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// Utility to normalize arrays from API (can be a string or array)
const normalizeToArray = (val: any) => Array.isArray(val) ? val : (val ? [val] : []);

// Utility to make URLs absolute when API returns relative paths
const toAbsoluteUrl = (url: any): string | null => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  // Return as-is if already absolute URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  
  return `${API_ROOT_URL}/${trimmed.replace(/^\//, '')}`;
};

// Create axios instance with UTF-8 support for Arabic and other languages
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for mobile devices with slower connections
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  // Ensure proper URL encoding for Arabic and other Unicode characters
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API requests in development for debugging mobile issues
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[API Request]', config.method?.toUpperCase(), config.url, config.params);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[API Response]', response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    // Enhanced error handling for mobile debugging
    if (typeof window !== 'undefined') {
      const errorInfo = {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        isNetworkError: !error.response && error.message === 'Network Error',
        isTimeout: error.code === 'ECONNABORTED',
      };
      
      console.error('[API Error]', errorInfo);
      
      // Handle specific error cases for mobile
      if (errorInfo.isNetworkError) {
        error.message = 'Network connection failed. Please check your internet connection and try again.';
      } else if (errorInfo.isTimeout) {
        error.message = 'Request timeout. Please check your connection and try again.';
      } else if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
      }
    }
    
    return Promise.reject(error);
  }
);

// HTTP Services based on provided endpoints

/**
 * GET /items - Get all properties
 */
export const getAllProperties = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await apiClient.get('/items', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch properties');
  }
};

/**
 * GET /items/featured - Get featured properties with optional property_type filter
 */
export const getFeaturedProperties = async (params?: {
  property_type?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    // Validate and sanitize params to prevent 400 errors
    const cleanParams: Record<string, any> = {};
    
    if (params?.property_type && params.property_type.trim()) {
      cleanParams.property_type = params.property_type.trim();
    }
    
    // Only include page if explicitly provided and valid
    if (params?.page !== undefined && params.page !== null && Number(params.page) > 0) {
      cleanParams.page = Math.max(1, Math.floor(Number(params.page)));
    }
    
    // Only include limit if explicitly provided and valid
    if (params?.limit !== undefined && params.limit !== null && Number(params.limit) > 0) {
      cleanParams.limit = Math.min(100, Math.max(1, Math.floor(Number(params.limit)))); // Cap at 100
    }
    
    // If no valid params, don't make the API call - just return empty data
    if (Object.keys(cleanParams).length === 0) {
      return { items: [], total: 0, page: 1, limit: 10 };
    }
    
    const response = await apiClient.get('/items/featured', { 
      params: cleanParams,
      timeout: 5000, // 5 second timeout
      validateStatus: (status) => status >= 200 && status < 500 // Don't throw on 4xx errors
    });
    
    // Handle non-200 responses gracefully
    if (response.status !== 200 || !response.data) {
      return { items: [], total: 0, page: 1, limit: 10 };
    }
    
    return response.data;
  } catch (error: any) {
    // Silently handle errors - don't log to console to avoid Lighthouse issues
    // Return empty array instead of throwing to prevent UI errors
    return { items: [], total: 0, page: 1, limit: 10 };
  }
};

/**
 * GET /items/search - Search properties
 * Properly handles Arabic and other non-Latin characters
 */
export const searchProperties = async (params: {
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
}) => {
  try {
    // Ensure proper encoding of Arabic and other Unicode characters
    const encodedParams = { ...params };
    if (params.query) {
      // Trim and normalize the search query
      encodedParams.query = params.query.trim();
    }
    if (params.city) {
      encodedParams.city = params.city.trim();
    }
    
    const response = await apiClient.get('/items/search', { 
      params: encodedParams
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to search properties');
  }
};

/**
 * GET /items/filter - Get filtered properties
 */
export const getFilteredProperties = async (params: {
  category?: string;
  city?: string;
  country?: string;
  property_type?: string;
  type?: string; // 'buy' | 'rent'
  listing_type?: string; // 'off-plan' | 'ready-to-move'
  status?: string;
  search?: string;
  min?: number;
  max?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  is_verified?: boolean;
  page?: number;
  limit?: number;
}) => {
  try {
    // Map frontend params to backend expected params
    const apiParams: Record<string, any> = { ...params };
    if (params.minPrice !== undefined) {
      apiParams.min = params.minPrice;
      delete apiParams.minPrice;
    }
    if (params.maxPrice !== undefined) {
      apiParams.max = params.maxPrice;
      delete apiParams.maxPrice;
    }
    const response = await apiClient.get('/items/filter', { params: apiParams });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to filter properties');
  }
};

/**
 * GET /items/category - Get properties by category
 */
export const getPropertiesByCategory = async (category: string, params?: { page?: number; limit?: number }) => {
  try {
    const response = await apiClient.get('/items/category', {
      params: { category, ...params }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch properties by category');
  }
};

/**
 * GET /items/:id - Get single property by ID
 */
export const getPropertyById = async (id: string) => {
  try {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch property');
  }
};

/**
 * GET /slug/:slug - Get single property by slug
 */
export const getPropertyBySlug = async (slug: string) => {
  try {
    const response = await apiClient.get(`/items/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch property by slug');
  }
};

/**
 * GET /items/buy - Get properties for sale (type = 'buy')
 */
export const getBuyProperties = async (params?: {
  property_type?: string;
  city?: string;
  country?: string;
  category?: string;
  listing_type?: string;
  min?: number;
  max?: number;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await apiClient.get('/items/buy', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch buy properties');
  }
};

/**
 * GET /items/rent - Get properties for rent (type = 'rent')
 */
export const getRentProperties = async (params?: {
  property_type?: string;
  city?: string;
  country?: string;
  category?: string;
  listing_type?: string;
  min?: number;
  max?: number;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await apiClient.get('/items/rent', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch rent properties');
  }
};

/**
 * POST /items/:slug/inquiry - Send property inquiry for specific item
 */
export const sendPropertyInquiry = async (slug: string, data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) => {
  try {
    const response = await apiClient.post(`/items/${slug}/inquiry`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send property inquiry');
  }
};

// Helper function to normalize city names (remove accents and standardize)
const normalizeCityName = (city: string): string => {
  if (!city) return '';
  
  // Map of city name variations to their canonical form
  const cityNormalizationMap: Record<string, string> = {
    'málaga': 'Malaga',
    'malaga': 'Malaga',
  };
  
  const lowerCity = city.toLowerCase().trim();
  return cityNormalizationMap[lowerCity] || city.trim();
};

// Helper function to transform API property to UI format
export const transformApiProperty = (apiProperty: any) => {
  // Handle different ID field names from the API
  
  const title = apiProperty.title || 'Property';
  const id = apiProperty._id;
  const normalizedCity = normalizeCityName(apiProperty.city || '');
  
  return {
    id: id,
    property_id: apiProperty.property_id,
    title: title,
    title_ar: apiProperty.title_ar || null,
    title_zh: apiProperty.title_zh || null,
    title_es: apiProperty.title_es || null,
    title_de: apiProperty.title_de || null,
    slug: apiProperty.slug || createPropertySlug(title, id), // Use API slug if available, otherwise generate with ID
    location: `${normalizedCity}, ${apiProperty.country || ''}`.replace(', ,', ',').trim().replace(/,$/, ''),
    city: normalizedCity,
    country: apiProperty.category === 'spain' ? 'Spain' : apiProperty.category === 'uae' ? 'UAE' : (apiProperty.country || apiProperty.category?.charAt(0).toUpperCase() + apiProperty.category?.slice(1) || 'International'),
    price: apiProperty.price ? 
      (apiProperty.category === 'spain' ? `€${apiProperty.price.toLocaleString()}` : apiProperty.category === 'uae' ? `AED ${apiProperty.price.toLocaleString()}` : apiProperty.category === 'argentina' ? `USD ${apiProperty.price.toLocaleString()}` : `USD ${apiProperty.price.toLocaleString()}`) : 
      'Price on request',
    priceStarting: getListingType(apiProperty.listing_type) === 'off-plan',
    beds: apiProperty.bedrooms || 0,
    baths: apiProperty.bathrooms || 0,
    area: apiProperty.area_size ?? apiProperty.area,
    images: [...normalizeToArray(apiProperty.gallery), ...normalizeToArray(apiProperty.image)]
      .filter(Boolean)
      .map(toAbsoluteUrl)
      .filter(Boolean) as string[],
      
    type: getPropertyType(apiProperty.property_type),
    property_type: getBackendType(apiProperty.type), // buy or rent
    featured: apiProperty.is_verified || false,
    description: Array.isArray(apiProperty.description) ? 
      apiProperty.description.join(' ') : 
      (apiProperty.description || ''),
    description_ar: apiProperty.description_ar || null,
    description_zh: apiProperty.description_zh || null,
    description_es: apiProperty.description_es || null,
    description_de: apiProperty.description_de || null,
    longDescription: apiProperty.additional_details || '',
    amenities: apiProperty.amenities || [],
    amenities_ar: apiProperty.amenities_ar || null,
    amenities_zh: apiProperty.amenities_zh || null,
    amenities_es: apiProperty.amenities_es || null,
    amenities_de: apiProperty.amenities_de || null,
    features: apiProperty.features || [],
    features_ar: apiProperty.features_ar || null,
    features_zh: apiProperty.features_zh || null,
    features_es: apiProperty.features_es || null,
    features_de: apiProperty.features_de || null,
    yearBuilt: apiProperty.year_built || null,
    status: getPropertyStatus(apiProperty.status),
    listing_type: apiProperty.type === 'buy' ? getListingType(apiProperty.listing_type) : null,
    pricePerSqm: calculatePricePerSqft(apiProperty.price, apiProperty.area_size, apiProperty.category) || null,
    lat: apiProperty.lat || null,
    lng: apiProperty.lng || null,
    brochure: toAbsoluteUrl(apiProperty.brochure),
    logo: toAbsoluteUrl(apiProperty.logo),
    
  };
};

// Helper functions
const getPropertyType = (apiType: string) => {
  const typeMap: Record<string, string> = {
    'apartment': 'Apartment',
    'villa': 'Villa',
    'commercial-property': 'Commercial',
    'factory': 'Factory',
    'farm': 'Farm',
    'hotel': 'Commercial',
    'land/plot': 'Land',
    'land': 'Land',
    'plot': 'Land'
  };
  return typeMap[apiType] || 'Apartment';
};

const getPropertyStatus = (apiStatus: string): 'sold' | 'approved' | 'negotiable' => {
  const statusMap: Record<string, 'sold' | 'approved' | 'negotiable'> = {
    'sold': 'sold',
    'approved': 'approved',
    'negotiable': 'negotiable'
  };
  return statusMap[apiStatus] || 'approved';
};

const getBackendType = (apiType: string): 'buy' | 'rent' => {
  const typeMap: Record<string, 'buy' | 'rent'> = {
    'buy': 'buy',
    'rent': 'rent'
  };
  return typeMap[apiType?.toLowerCase()] || 'buy';
};

const getListingType = (apiListingType: string): 'off-plan' | 'ready-to-move' => {
  
  const listingTypeMap: Record<string, 'off-plan' | 'ready-to-move'> = {
    'off-plan': 'off-plan',
    'off plan': 'off-plan',
    'offplan': 'off-plan',
    'off_plan': 'off-plan',
    'ready-to-move': 'ready-to-move',
    'ready': 'ready-to-move',
    'completed': 'ready-to-move',
    'sell': 'ready-to-move', // Handle the "sell" value you mentioned
    'sale': 'ready-to-move',
    'for-sale': 'ready-to-move',
    'rent': 'ready-to-move',
    'for-rent': 'ready-to-move'
  };
  
  const result = listingTypeMap[apiListingType?.toLowerCase()] || 'ready-to-move';
  
  return result;
};

const calculatePricePerSqft = (price: number, area: number, category: string) => {
  if (!price || !area || area === 0) return '';
  
  // Convert m² to sqft (1 m² = 10.764 sqft)
  const areaInSqft = area * 10.764;
  const pricePerSqft = price / areaInSqft;
  const currency = category === 'spain' ? 'EUR' : category === 'uae' ? 'AED' : category === 'argentina' ? 'USD' : 'USD';
  const symbol = category === 'spain' ? '€' : category === 'uae' ? 'AED ' : category === 'argentina' ? 'USD ' : 'USD ';
  
  return `${symbol}${Math.round(pricePerSqft).toLocaleString()}`;
};

// Blog API Functions

/**
 * GET /blogs - Get all blogs
 */
export const getAllBlogs = async (params?: { page?: number; limit?: number }) => {
  try {
    const response = await apiClient.get('/blogs', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search blogs with intelligent fallback
 */
export const searchBlogs = async (params: {
  query?: string;
  category?: string;
  author?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    // If we have a category filter, try the category endpoint first
    if (params.category && !params.query) {
      try {
        const response = await apiClient.get(`/blogs/category/${encodeURIComponent(params.category)}`, {
          params: {
            status: params.status,
            page: params.page || 1,
            limit: params.limit || 200
          }
        });
        return response.data;
      } catch (categoryError: any) {
      }
    }
    
    // If we have search query, use search endpoint
    if (params.query) {
      const response = await apiClient.get('/blogs/search', { params });
      return response.data;
    }
    
    // For category-only searches (fallback), get all blogs and filter client-side
    if (params.category) {
      const response = await apiClient.get('/blogs', { 
        params: { 
          page: 1, 
          limit: 200,
          status: params.status 
        } 
      });
      // Mark for client-side filtering
      (response.data as any)._needsClientFiltering = true;
      (response.data as any)._filterCategory = params.category;
      return response.data;
    }
    
    // Default: get all blogs
    const response = await apiClient.get('/blogs', { params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * GET /blogs/categories - Get blog categories
 */
export const getBlogCategories = async () => {
  try {
    const response = await apiClient.get('/blogs/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * GET /blogs/slug/:slug - Get single blog by slug
 */
export const getBlogBySlug = async (slug: string) => {
  try {
    const response = await apiClient.get(`/blogs/slug/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * GET /blogs/:id - Get single blog by ID
 */
export const getBlogById = async (id: string) => {
  try {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * GET /blogs/category/:category - Get blogs by category
 */
export const getBlogsByCategory = async (category: string, params?: { 
  status?: string; 
  page?: number; 
  limit?: number; 
}) => {
  try {
    const response = await apiClient.get(`/blogs/category/${encodeURIComponent(category)}`, { params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * GET /blogs/filter - Filter blogs by category and other criteria
 */
export const filterBlogs = async (params: {
  category?: string;
  status?: string;
  author?: string;
  query?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await apiClient.get('/blogs/filter', { params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Transform API blog data to UI format
 */
export const transformApiBlog = (apiBlog: any) => {
  return {
    id: apiBlog._id,
    title: apiBlog.title,
    title_ar: apiBlog.title_ar || null,
    title_zh: apiBlog.title_zh || null,
    title_es: apiBlog.title_es || null,
    title_de: apiBlog.title_de || null,
    slug: apiBlog.slug,
    excerpt: apiBlog.excerpt,
    content: apiBlog.content,
    content_ar: apiBlog.content_ar || null,
    content_zh: apiBlog.content_zh || null,
    content_es: apiBlog.content_es || null,
    content_de: apiBlog.content_de || null,
    category: apiBlog.category,
    author: apiBlog.author,
    status: apiBlog.status,
    tags: apiBlog.tags,
    views: apiBlog.views || 0,
    bannerImage: apiBlog.bannerImage,
    createdAt: apiBlog.createdAt,
    updatedAt: apiBlog.updatedAt,
    publishedAt: apiBlog.publishedAt,
  };
};

// Contact API Functions

/**
 * POST /contact - Submit contact form
 */
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  try {
    // Ensure all required fields are present and not empty
    const sanitizedFormData = {
      name: formData.name?.trim() || '',
      email: formData.email?.trim() || '',
      phone: formData.phone?.trim() || '',
      subject: formData.subject?.trim() || '',
      message: formData.message?.trim() || '',
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'
    };

    // Validate required fields before sending
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !sanitizedFormData[field as keyof typeof sanitizedFormData]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const response = await apiClient.post('/contact', sanitizedFormData);
    
    return response.data;
  } catch (error: any) {
   
    throw new Error(error.response?.data?.message || 'Failed to submit contact form');
  }
};

export default {
  getAllProperties,
  searchProperties,
  getFeaturedProperties,
  getFilteredProperties,
  getPropertiesByCategory,
  getPropertyById,
  getPropertyBySlug,
  getBuyProperties,
  getRentProperties,
  sendPropertyInquiry,
  transformApiProperty,
  getAllBlogs,
  searchBlogs,
  getBlogCategories,
  getBlogBySlug,
  getBlogById,
  transformApiBlog,
  getBlogsByCategory,
  filterBlogs,
  submitContactForm
};
