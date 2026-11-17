import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  normalizeLocation, 
  getCategoryFromLocation, 
  filtersToQueryParams, 
  getSearchRoute,
  validateSearchParams,
  type SearchFilters
} from '../utils/searchUtils';
import { PropertiesApiService } from '../services/propertiesApiService';
import { Property } from '../data/properties';
import { useLanguage } from '../context/LanguageContext';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [propertyResults, setPropertyResults] = useState<Property[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  
  // Refs for debouncing and cleanup
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  

  // Location categories
  const locationCategories = [
    { name: t('search.searchPopup.spainProperties'), query: '/properties/spain', icon: '🇪🇸' },
    { name: t('search.searchPopup.uaeProperties'), query: '/properties/dubai', icon: '🇦🇪' },
    { name: t('search.searchPopup.argentinaProperties', 'International Properties'), query: '/properties/international', icon: '🌍' },
  ];

  // Focus input when popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle search
  const handleSearch = async (searchQuery: string = location) => {
    if (!searchQuery.trim()) {
      router.push('/properties/dubai');
      onClose();
      return;
    }

    setIsSearching(true);
    
    try {
      const filters: SearchFilters = {};
      
      if (searchQuery && !searchQuery.includes('All')) {
        const cleanLocation = normalizeLocation(searchQuery);
        if (cleanLocation) {
          filters.query = cleanLocation;
          
          const detectedCategory = getCategoryFromLocation(searchQuery);
          if (detectedCategory) {
            filters.category = detectedCategory;
          }
        }
      }

      const validation = validateSearchParams(filters);
      if (!validation.isValid) {
        router.push('/properties/dubai');
        onClose();
        return;
      }

      const targetPage = getSearchRoute(filters);
      const queryParams = filtersToQueryParams(filters);
      const queryString = queryParams.toString();
      
      router.push(`${targetPage}${queryString ? `?${queryString}` : ''}`);
      onClose();

    } catch (error) {
      router.push('/properties/dubai');
      onClose();
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search for live results
  const debouncedSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setPropertyResults([]);
      setShowResults(false);
      setIsLoadingResults(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoadingResults(true);
      
      const results = await PropertiesApiService.searchProperties({
        query: searchTerm.trim(),
        limit: 4
      });

      if (Array.isArray(results)) {
        setPropertyResults(results);
        setShowResults(results.length > 0);
      }
      
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name !== 'AbortError') {
        setPropertyResults([]);
        setShowResults(false);
      }
    } finally {
      setIsLoadingResults(false);
    }
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      debouncedSearch(value);
    }, 300);
  };

  

  // Handle property click
  const handlePropertyClick = (property: Property) => {
    router.push(`/properties/${property.slug || property.id}`);
    onClose();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-top-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">{t('search.searchPopup.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={location}
                onChange={handleInputChange}
                placeholder={t('search.searchPopup.placeholder')}
                className="w-full h-14 px-6 pr-16 text-lg border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] bg-white text-gray-900 shadow-sm transition-all duration-200"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-2 h-10 px-4 bg-[#D69F3F] hover:bg-[#C4903A] disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                {isSearching ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Scrollable Content Container */}
        <div className="max-h-96 overflow-y-auto">
          {/* Live Search Results */}
          {(showResults || isLoadingResults) && location.length > 1 && (
            <div className="border-t border-gray-100">
              <div className="p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('search.searchPopup.searchResults')}</h3>
                {isLoadingResults ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : propertyResults.length > 0 ? (
                  <div className="space-y-2">
                    {propertyResults.map((property) => (
                      <div
                        key={property.id}
                        onClick={() => handlePropertyClick(property)}
                        className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                          {property.images && property.images[0] ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {property.title}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center space-x-2">
                            <span>{property.city}, {property.country}</span>
                            <span>•</span>
                            <span className="font-semibold text-[#D69F3F]">{property.price}</span>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    ))}
                    <button
                      onClick={() => handleSearch()}
                      className="w-full p-3 text-center text-sm font-medium text-[#D69F3F] hover:bg-gray-100 rounded-lg transition-colors duration-150"
                    >
                      {t('search.seeAllResults')} "{location}" →
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8 7.962 7.962 0 015.291 2z" />
                    </svg>
                    <p className="text-sm">{t('search.noPropertiesFound')} "{location}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Categories & Popular Searches */}
          {!showResults && (
            <div className="px-6 pb-6 space-y-6">
              {/* Location Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('search.searchPopup.browseByLocation')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {locationCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => router.push(category.query)}
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#D69F3F]/10 hover:to-[#C4903A]/10 rounded-xl transition-all duration-200 group"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-[#D69F3F] transition-colors duration-200">
                          {category.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
