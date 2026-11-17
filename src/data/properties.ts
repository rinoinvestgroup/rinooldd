// Updated Data for all properties with new status and listing_type
export interface Property {
  id: string;
  title: string; // Default English title
  title_ar: string | null;
  title_zh: string | null;
  title_es: string | null;
  title_de: string | null;
  slug?: string; // URL-friendly slug for the property
  location: string;
  city: string;
  country: string;
  price: string;
  priceStarting:boolean;
  beds: number;
  baths: number;
  area: string; // Area in sqft (converted from m²)
  images: string[];
  type: 'Villa' | 'Apartment' | 'Penthouse' | 'Commercial' | 'Townhouse' | 'Studio' | 'Land' | 'Farm' | 'Factory';
  property_type: 'buy' | 'rent'; // Backend type field: buy or rent
  listing_type: 'off-plan' | 'ready-to-move' | null; // Only applicable when property_type is 'buy'
  featured: boolean;
  description: string | string[]; // Default English description
  description_ar: string | null;
  description_zh: string | null;
  description_es: string | null;
  description_de: string | null;
  longDescription: string;
  amenities: string[] | string; // Default English amenities - can be array or comma-separated string
  amenities_ar: string | null;
  amenities_zh: string | null;
  amenities_es: string | null;
  amenities_de: string | null;
  features: string[] | string; // Default English features - can be array or comma-separated string
  features_ar: string | null;
  features_zh: string | null;
  features_es: string | null;
  features_de: string | null;
  yearBuilt?: number;
  status: 'sold' | 'approved' | 'negotiable';
  pricePerSqm?: string; // Price per sqft (keeping field name for compatibility)
  property_id?: string;
  lat: number;
  lng: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  brochure?: string; // URL to downloadable property brochure
  logo?: string; // URL to company logo
}

// Note: Static property data removed - all properties now fetched from API
// Use PropertiesApiService for fetching properties

// Utility functions that don't depend on static data
export const getStatusOptions = (): Property['status'][] => {
  return ['sold', 'approved', 'negotiable'];
};

export const getPropertyTypeOptions = (): Property['property_type'][] => {
  return ['buy', 'rent'];
};

export const getListingTypeOptions = (): NonNullable<Property['listing_type']>[] => {
  return ['off-plan', 'ready-to-move'];
};

// Localization utility functions
export const getLocalizedTitle = (property: Property, language: string = 'en'): string => {
  if (language === 'ar' && property.title_ar) return property.title_ar;
  if (language === 'zh' && property.title_zh) return property.title_zh;
  if (language === 'es' && property.title_es) return property.title_es;
  if (language === 'de' && property.title_de) return property.title_de;
  return property.title; // Fallback to English
};

export const getLocalizedDescription = (property: Property, language: string = 'en'): string | string[] => {
  if (language === 'ar' && property.description_ar) return property.description_ar;
  if (language === 'zh' && property.description_zh) return property.description_zh;
  if (language === 'es' && property.description_es) return property.description_es;
  if (language === 'de' && property.description_de) return property.description_de;
  return property.description; // Fallback to English
};

export const getLocalizedAmenities = (property: Property, language: string = 'en'): string[] => {
  if (language === 'ar' && property.amenities_ar) {
    try {
      return JSON.parse(property.amenities_ar);
    } catch {
      return property.amenities_ar.split(',').map(item => item.trim());
    }
  }
  if (language === 'zh' && property.amenities_zh) {
    try {
      return JSON.parse(property.amenities_zh);
    } catch {
      return property.amenities_zh.split(',').map(item => item.trim());
    }
  }
  if (language === 'es' && property.amenities_es) {
    try {
      return JSON.parse(property.amenities_es);
    } catch {
      return property.amenities_es.split(',').map(item => item.trim());
    }
  }
  if (language === 'de' && property.amenities_de) {
    try {
      return JSON.parse(property.amenities_de);
    } catch {
      return property.amenities_de.split(',').map(item => item.trim());
    }
  }
  // Handle fallback to English amenities
  const englishAmenities = property.amenities || [];
  if (Array.isArray(englishAmenities)) {
    return englishAmenities;
  }
  return englishAmenities.split(',').map(item => item.trim());
};

export const getLocalizedFeatures = (property: Property, language: string = 'en'): string[] => {
  if (language === 'ar' && property.features_ar) {
    try {
      return JSON.parse(property.features_ar);
    } catch {
      return property.features_ar.split(',').map(item => item.trim());
    }
  }
  if (language === 'zh' && property.features_zh) {
    try {
      return JSON.parse(property.features_zh);
    } catch {
      return property.features_zh.split(',').map(item => item.trim());
    }
  }
  if (language === 'es' && property.features_es) {
    try {
      return JSON.parse(property.features_es);
    } catch {
      return property.features_es.split(',').map(item => item.trim());
    }
  }
  if (language === 'de' && property.features_de) {
    try {
      return JSON.parse(property.features_de);
    } catch {
      return property.features_de.split(',').map(item => item.trim());
    }
  }
  // Handle fallback to English features
  const englishFeatures = property.features || [];
  if (Array.isArray(englishFeatures)) {
    return englishFeatures;
  }
  return englishFeatures.split(',').map(item => item.trim());
};

