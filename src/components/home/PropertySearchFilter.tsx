import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { PropertiesApiService } from '../../services/propertiesApiService';

interface PropertySearchFilterProps {
  className?: string;
}

const fetcher = (category: 'uae' | 'spain' | 'argentina') =>
  PropertiesApiService.getPropertiesByCategory(category);

const PropertySearchFilter: React.FC<PropertySearchFilterProps> = ({ className = '' }) => {
  const router = useRouter();

  const [buyOrRent, setBuyOrRent] = useState('buy');
  const [listingType, setListingType] = useState('offplan');
  const [country, setCountry] = useState('UAE');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const category: 'uae' | 'spain' | 'argentina' = country === 'Spain' ? 'spain' : country === 'Argentina' ? 'argentina' : 'uae';

  // ✅ SWR Caching with keepPreviousData to avoid layout shift
  const { data: properties = [], isLoading } = useSWR(
    category,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      dedupingInterval: 600000, // 10 minutes cache
      keepPreviousData: true,
    }
  );

  // Extract cities
  const { availableCities, cityCounts } = useMemo(() => {
    const citiesSet = new Set<string>();
    const counts: Record<string, number> = {};

    properties.forEach((p: any) => {
      if (p.city) {
        citiesSet.add(p.city);
        counts[p.city] = (counts[p.city] || 0) + 1;
      }
    });

    return {
      availableCities: Array.from(citiesSet),
      cityCounts: counts,
    };
  }, [properties]);

  // Sort cities by property count
  const sortedCities = useMemo(() => {
    return [...availableCities].sort((a, b) => {
      const countA = cityCounts[a] || 0;
      const countB = cityCounts[b] || 0;

      if (countB !== countA) return countB - countA;
      return a.localeCompare(b);
    });
  }, [availableCities, cityCounts]);

  const locations = useMemo(() => [
    { value: '', label: 'Location' },
    ...sortedCities.map(city => ({ value: city, label: city })),
  ], [sortedCities]);

  const dubaiPropertyTypes = [
    { value: '', label: 'Property Type' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Commercial', label: 'Commercial' },
  ];

  const spainPropertyTypes = [
    { value: '', label: 'Property Type' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Farm', label: 'Farm' },
    { value: 'Factory', label: 'Factory' },
  ];

  const argentinaPropertyTypes = [
    { value: '', label: 'Property Type' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Farm', label: 'Farm' },
  ];

  const propertyTypes = country === 'Spain'
    ? spainPropertyTypes
    : country === 'Argentina'
    ? argentinaPropertyTypes
    : dubaiPropertyTypes;

  // Show listing type (Off-Plan / Ready to Move) for all countries and buy/rent
  const showListingType = true;

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Set propertyType (buy/rent)
    if (buyOrRent === 'buy') {
      params.set('propertyType', 'buy');
    } else if (buyOrRent === 'rent') {
      params.set('propertyType', 'rent');
    }

    // Set listingType for both countries
    if (listingType === 'offplan') {
      params.set('listingType', 'Off-Plan');
    } else if (listingType === 'ready') {
      params.set('listingType', 'Ready');
    }

    if (location) params.set('city', location);
    if (propertyType) params.set('filter', propertyType);

    const basePath =
      country === 'Spain'
        ? '/properties/spain'
        : country === 'Argentina'
        ? '/properties/international'
        : '/properties/dubai';

    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6 lg:p-8">
        <div className={`grid grid-cols-2 sm:grid-cols-2 ${showListingType ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-3 sm:gap-4 items-end`}>

          {/* Buy / Rent - First dropdown */}
          <div className="space-y-2 min-w-[140px]">
            <select
              value={buyOrRent}
              onChange={(e) => {
                const value = e.target.value;
                setBuyOrRent(value);
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg"
            >
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* Country - Second dropdown */}
          <div className="space-y-2 min-w-[140px]">
            <select
              value={country}
              onChange={(e) => {
                const value = e.target.value;
                setCountry(value);
                setLocation('');
                setPropertyType('');
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg"
            >
              <option value="UAE">Dubai</option>
              <option value="Spain">Spain</option>
              <option value="Argentina">Argentina</option>
            </select>
          </div>

          {/* Listing Type - Only show when Buy is selected AND country is UAE */}
          {showListingType && (
            <div className="space-y-2 min-w-[140px]">
              <select
                value={listingType}
                onChange={(e) => setListingType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg"
              >
                <option value="offplan">Off-Plan</option>
                <option value="ready">Ready to Move</option>
              </select>
            </div>
          )}

          {/* Area - Always visible to prevent layout shift */}
          <div className="space-y-2 min-w-[140px]">
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPropertyType('');
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-2 min-w-[140px]">
           
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg"
            >
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="min-w-[140px]">
            <button
              onClick={handleSearch}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-300 col-span-2 sm:col-span-2 lg:col-span-1"
            >
              Search
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertySearchFilter;