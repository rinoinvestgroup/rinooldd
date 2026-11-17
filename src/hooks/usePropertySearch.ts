import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { PropertiesApiService } from '../services/propertiesApiService';
import { Property } from '../data/properties';

interface SearchParams {
  query?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  property_type?: string;
  page?: number;
  limit?: number;
}

interface UsePropertySearchReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  searchParams: SearchParams;
  searchProperties: (params: SearchParams) => Promise<void>;
  clearSearch: () => void;
  totalResults: number;
}

export const usePropertySearch = (initialParams?: SearchParams): UsePropertySearchReturn => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>(initialParams || {});
  const [totalResults, setTotalResults] = useState(0);

  const searchProperties = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      setSearchParams(params);

      const results = await PropertiesApiService.searchProperties({
        ...params,
        page: params.page || 1,
        limit: params.limit || 50,
      });

      setProperties(results);
      setTotalResults(results.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search properties');
      setProperties([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchParams({});
    setProperties([]);
    setTotalResults(0);
    setError(null);
  }, []);

  // Initialize search from URL parameters
  useEffect(() => {
    if (router.isReady) {
      const urlParams = router.query;
      const hasSearchParams = Object.keys(urlParams).some(key => 
        ['search', 'category', 'city', 'type', 'status'].includes(key)
      );

      if (hasSearchParams) {
        const params: SearchParams = {};
        
        if (urlParams.search) {
          params.query = urlParams.search as string;
        }
        if (urlParams.category) {
          params.category = urlParams.category as string;
        }
        if (urlParams.city) {
          params.city = urlParams.city as string;
        }
        if (urlParams.type) {
          params.property_type = urlParams.type as string;
        }

        searchProperties(params);
      }
    }
  }, [router.isReady, router.query, searchProperties]);

  return {
    properties,
    loading,
    error,
    searchParams,
    searchProperties,
    clearSearch,
    totalResults,
  };
};

export default usePropertySearch;
