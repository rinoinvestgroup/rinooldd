import { useState, useEffect, memo } from 'react';
import PropertyCard from '../PropertyCard';
import SearchPopup from '../SearchPopup';
import { PropertiesApiService } from '../../services/propertiesApiService';
import { Property } from '../../data/properties';
import { useLanguage } from '../../context/LanguageContext';
import { getCachedProperties, setCachedProperties } from '../../utils/propertiesCache';

const FeaturedProperties = memo(() => {
  const { t } = useLanguage();
  
  // Initialize state from sessionStorage to persist across navigation
  const [activeCountry, setActiveCountry] = useState<'UAE' | 'Spain' | 'Argentina'>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('featuredPropertiesCountry');
      return (saved === 'Spain' || saved === 'UAE' || saved === 'Argentina') ? saved : 'UAE';
    }
    return 'UAE';
  });
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);

  // Persist active country to sessionStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('featuredPropertiesCountry', activeCountry);
    }
  }, [activeCountry]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Try to use cached data first
        const cacheKey = `featured_${activeCountry}`;
        const cachedData = getCachedProperties(cacheKey);
        if (cachedData && cachedData.length > 0) {
          setProperties(cachedData.slice(0, 6));
          setLoading(false);
          setError(null);
          return;
        }
        
        setLoading(true);
        setError(null);
        
        // Fetch featured properties from API filtered by country
        let featuredProperties = await PropertiesApiService.getFeaturedProperties({
          limit: 50,
        });
        
        // Filter by country on client side
        const filteredByCountry = featuredProperties.filter(
          property => property.country === activeCountry
        );
        
        // Cache the filtered properties
        if (filteredByCountry.length > 0) {
          setCachedProperties(cacheKey, filteredByCountry);
        }
        
        setProperties(filteredByCountry.slice(0, 6));
      } catch (err) {
        // Silently handle error - API service already logs and returns empty array
        // Don't log again to console to avoid Lighthouse errors
        setError(null); // Don't show error to user
        setProperties([]); // Set empty array as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeCountry]);

  const filteredProperties = properties; // server filtering already applied; fallback handled in fetch

  const countryOptions = [
    { key: 'UAE', label: 'Dubai', icon: '🇦🇪' },
    { key: 'Spain', label: 'Spain', icon: '🇪🇸' },
    { key: 'Argentina', label: 'Argentina', icon: '🇦🇷' }
  ] as const;

  return (
    <section className="relative py-14 overflow-hidden">
     
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-light text-black leading-tight tracking-normal mb-2 px-2">
            <span className="font-normal text-gray-700">{t('properties.featured.title')} </span>
            <span className="font-medium text-[#D69F3F]">{t('properties.featured.titleHighlight')}</span>
          </h2>
         
        </div>

        {/* Country Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
          {countryOptions.map((country) => (
            <button
              key={country.key}
              onClick={() => setActiveCountry(country.key)}
              className={`px-5 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 font-medium text-sm xs:text-base sm:text-lg transition-all duration-300 rounded-lg border-2 flex items-center gap-2 ${
                activeCountry === country.key
                  ? 'bg-[#D69F3F] text-white border-[#D69F3F] shadow-lg scale-105'
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-[#D69F3F] border-gray-300 hover:border-[#D69F3F] shadow-sm hover:shadow-md'
              }`}
            >
              <span className="text-xl">{country.icon}</span>
              <span>{country.label}</span>
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 mb-16 sm:mb-20 px-2 sm:px-4 lg:px-0">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-full flex">
                <div className="w-full bg-gray-200 animate-pulse rounded-lg h-96"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-sm xs:text-base text-red-600 mb-4 px-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#D69F3F] text-white px-4 xs:px-6 py-2 xs:py-2 text-sm xs:text-base rounded hover:bg-[#C4903A] transition-colors"
              >
                {t('properties.featured.tryAgain')}
              </button>
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property, index) => (
              <div key={property.id} className="h-full flex">
                <PropertyCard 
                  property={property} 
                  index={index}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-sm xs:text-base text-gray-600 px-4">{t('properties.featured.noPropertiesFilter')}</p>
            </div>
          )}
        </div>
        <h2 className='max-w-2xl mx-auto text-center text-base xs:text-lg sm:text-xl font-normal text-gray-600 mb-4 px-4'>{t('properties.featured.notWhatLookingFor')}</h2>
        {/* CTA Section */}
        <div className="text-center px-4">
          <button 
            onClick={() => setIsSearchPopupOpen(true)}
            className="inline-flex items-center bg-[#D69F3F] hover:bg-[#C4903A] text-white px-6 xs:px-8 py-2.5 xs:py-3 text-sm xs:text-base font-normal transition-all duration-300  justify-center"
          >
            {t('properties.featured.searchForProperty')}
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Popup */}
      <SearchPopup 
        isOpen={isSearchPopupOpen} 
        onClose={() => setIsSearchPopupOpen(false)} 
      />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
});

FeaturedProperties.displayName = 'FeaturedProperties';

export default FeaturedProperties;

// Map UI type labels to API property_type values
function mapUiTypeToApi(uiType: string | undefined): string | undefined {
  if (!uiType || uiType === 'All') return undefined;
  const map: Record<string, string> = {
    Villa: 'villa',
    Apartment: 'apartment',
    'commercial-property': 'commercial-property',
  };
  return map[uiType] || undefined;
}