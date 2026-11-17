import React, { memo, useCallback, useMemo, useState } from 'react';
import { Property } from '../data/properties';
import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../context/SearchContext';

interface PropertyFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  activeTypeFilter: string;
  setActiveTypeFilter: (type: string) => void;
  activeCityFilter: string;
  setActiveCityFilter: (city: string) => void;
  activeCountryFilter?: string;
  setActiveCountryFilter?: (country: string) => void;
  activeStatusFilter: string;
  setActiveStatusFilter: (status: string) => void;
  activeListingTypeFilter?: string;
  setActiveListingTypeFilter?: (listingType: string) => void;
  activePropertyTypeFilter?: string;
  setActivePropertyTypeFilter?: (propertyType: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  availableTypes: Property['type'][];
  availableCities: string[];
  availableCountries?: string[];
  cityCounts?: Record<string, number>; // Optional: property count per city for sorting
  country: 'Spain' | 'UAE' | 'Argentina' | 'International';
  sortBy?: string;
  setSortBy?: (sort: string) => void;
  hideListingType?: boolean;
  hidePropertyType?: boolean;
  hideCountry?: boolean;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = memo(({
  activeFilter,
  setActiveFilter,
  setActiveTypeFilter,
  activeCityFilter,
  setActiveCityFilter,
  activeCountryFilter = 'All Countries',
  setActiveCountryFilter = () => {},
  activeStatusFilter,
  setActiveStatusFilter,
  activeListingTypeFilter = 'All Types',
  setActiveListingTypeFilter = () => {},
  activePropertyTypeFilter = 'All',
  setActivePropertyTypeFilter = () => {},
  setPriceRange,
  availableTypes,
  availableCities,
  availableCountries = [],
  cityCounts,
  sortBy = 'featured',
  setSortBy,
  hideListingType = false,
  hidePropertyType = false,
  hideCountry = true
}) => {
  const { t } = useLanguage();
  
  // Sort cities by property count (highest first), then alphabetically for ties
  // Only include cities that actually have properties
  const sortedCities = useMemo(() => {
    if (!availableCities || availableCities.length === 0) return [];
    
    // Filter out empty/whitespace-only city names
    const validCities = availableCities.filter(city => city && city.trim().length > 0);
    
    // If cityCounts is provided, only show cities with at least 1 property, then sort by count
    if (cityCounts && Object.keys(cityCounts).length > 0) {
      return validCities
        .filter(city => (cityCounts[city] || 0) > 0)
        .sort((a, b) => {
          const countA = cityCounts[a] || 0;
          const countB = cityCounts[b] || 0;
          if (countB !== countA) {
            return countB - countA;
          }
          return a.localeCompare(b);
        });
    }
    
    // Fallback: sort alphabetically if no counts provided
    return validCities.sort((a, b) => a.localeCompare(b));
  }, [availableCities, cityCounts]);

  // Memoize filter options for better performance
  const filterOptions = useMemo(() => [t('propertyFilters.all', 'All'), ...availableTypes], [availableTypes, t]);
  const statusOptions = useMemo(() => [t('propertyFilters.all', 'All'), t('propertyFilters.status.sold', 'Sold'), t('propertyFilters.status.approved', 'Approved'), t('propertyFilters.status.negotiable', 'Negotiable')], [t]);
  const listingTypeOptions = useMemo(() => [t('propertyFilters.allTypes', 'All Types'), t('propertyFilters.listingType.offPlan', 'Off-Plan'), t('propertyFilters.listingType.readyToMove', 'Ready to Move')], [t]);
  const propertyTypeOptions = useMemo(() => [
    { value: 'All', label: t('propertyFilters.all', 'All') },
    { value: 'buy', label: t('propertyFilters.propertyTypeOptions.buy', 'Buy') },
    { value: 'rent', label: t('propertyFilters.propertyTypeOptions.rent', 'Rent') }
  ], [t]);
  const cityOptions = useMemo(() => [t('propertyFilters.allCities', 'All Areas'), ...sortedCities], [sortedCities, t]);
  const countryOptions = useMemo(
    () => [t('propertyFilters.allCountries', 'All Countries'), ...availableCountries],
    [availableCountries, t]
  );
  const sortOptions = useMemo(() => [
    { value: 'featured', label: t('propertyFilters.sort.featuredFirst', 'Featured First') },
    { value: 'price-low', label: t('propertyFilters.sort.priceLowToHigh', 'Price: Low to High') },
    { value: 'price-high', label: t('propertyFilters.sort.priceHighToLow', 'Price: High to Low') },
    { value: 'newest', label: t('propertyFilters.sort.newestFirst', 'Newest First') }
  ], [t]);

  // Mobile filter panel toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { openSearch } = useSearch();

  // Count active filters for the badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    const allValues = new Set(['All', t('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', t('propertyFilters.allCities', 'All Areas')]);
    const allTypesValues = new Set(['All Types', t('propertyFilters.allTypes', 'All Types')]);
    const allCountriesValues = new Set(['All Countries', t('propertyFilters.allCountries', 'All Countries')]);
    if (!allValues.has(activePropertyTypeFilter)) count++;
    if (!allCountriesValues.has(activeCountryFilter)) count++;
    if (!allCitiesValues.has(activeCityFilter)) count++;
    if (!allValues.has(activeFilter)) count++;
    if (!allTypesValues.has(activeListingTypeFilter)) count++;
    if (!allValues.has(activeStatusFilter)) count++;
    if (sortBy !== 'featured') count++;
    return count;
  }, [activePropertyTypeFilter, activeCountryFilter, activeCityFilter, activeFilter, activeListingTypeFilter, activeStatusFilter, sortBy, t]);

  // Memoized handlers for better performance
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, [setActiveFilter]);

  const handleClearFilters = useCallback(() => {
    setActiveFilter(t('propertyFilters.all', 'All'));
    setActiveTypeFilter(t('propertyFilters.all', 'All'));
    setActiveCountryFilter(t('propertyFilters.allCountries', 'All Countries'));
    setActiveCityFilter(t('propertyFilters.allCities', 'All Areas'));
    setActiveStatusFilter(t('propertyFilters.all', 'All'));
    // Always reset all filters (including hidden ones) so URL params are fully cleared
    setActiveListingTypeFilter(t('propertyFilters.allTypes', 'All Types'));
    setActivePropertyTypeFilter('All');
    setPriceRange([0, 0]);
    if (setSortBy) setSortBy('featured');
  }, [setActiveFilter, setActiveTypeFilter, setActiveCountryFilter, setActiveCityFilter, setActiveStatusFilter, setActiveListingTypeFilter, setActivePropertyTypeFilter, setPriceRange, setSortBy, t]);

  // Shared filter dropdowns JSX
  const filterDropdowns = (
    <>
      {/* Property Type (Buy/Rent) */}
      {!hidePropertyType && (
        <select
          value={activePropertyTypeFilter}
          onChange={(e) => {
            setActivePropertyTypeFilter(e.target.value);
            if (!hideListingType) {
              const selectedOption = propertyTypeOptions.find(opt => opt.label === e.target.value || opt.value === e.target.value);
              if (selectedOption && selectedOption.value !== 'buy') {
                setActiveListingTypeFilter(t('propertyFilters.allTypes', 'All Types'));
              }
            }
          }}
          className="px-3 py-2.5 text-sm font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm min-w-[100px]"
        >
          {propertyTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      )}

      {/* Area / Location */}
      {!hideCountry && countryOptions.length > 1 && (
        <select
          value={activeCountryFilter}
          onChange={(e) => setActiveCountryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm min-w-[140px]"
        >
          {countryOptions.map((countryOption) => (
            <option key={countryOption} value={countryOption}>{countryOption}</option>
          ))}
        </select>
      )}

      {/* Area / Location */}
      <select
        value={activeCityFilter}
        onChange={(e) => setActiveCityFilter(e.target.value)}
        className="flex-1 min-w-[140px] px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm"
      >
        {cityOptions.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      {/* Property Category (Apartment, Villa, etc.) */}
      <select
        value={activeFilter}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm min-w-[130px]"
      >
        {filterOptions.map((filter) => (
          <option key={filter} value={filter}>{filter}</option>
        ))}
      </select>

      {/* Listing Type (Off-Plan / Ready to Move) */}
      {(() => {
        if (hideListingType) return null;
        const isBuySelected = propertyTypeOptions.some(opt => 
          opt.value === 'buy' && (opt.label === activePropertyTypeFilter || opt.value === activePropertyTypeFilter)
        );
        const isAllSelected = activePropertyTypeFilter === t('propertyFilters.all', 'All') || activePropertyTypeFilter === 'All';
        const showListingType = isBuySelected || isAllSelected;
        
        return showListingType ? (
          <select
            value={activeListingTypeFilter}
            onChange={(e) => setActiveListingTypeFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm min-w-[140px]"
          >
            {listingTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        ) : null;
      })()}

      {/* Status */}
      <select
        value={activeStatusFilter}
        onChange={(e) => setActiveStatusFilter(e.target.value)}
        className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm min-w-[120px]"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy && setSortBy(e.target.value)}
        className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm min-w-[150px]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      {/* Clear Filters */}
      <button
        onClick={handleClearFilters}
        className="px-4 py-2.5 text-sm font-medium text-[#D69F3F] hover:text-white hover:bg-[#D69F3F] border border-[#D69F3F]/30 hover:border-[#D69F3F] rounded-lg transition-all duration-300 whitespace-nowrap flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {t('propertyFilters.clearAllFilters', 'Clear All Filters')}
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* ===== MOBILE: Compact search bar + filter toggle ===== */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <button
            onClick={openSearch}
            className="flex-1 flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-left"
          >
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-400 text-sm">{t('propertyFilters.searchPlaceholder', 'Search by title, location...')}</span>
          </button>

          {/* Filter toggle button */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="relative flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0 transition-colors duration-200 active:bg-gray-50"
            aria-label={t('propertyFilters.toggleFilters', 'Toggle filters')}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D69F3F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible filter panel for mobile */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            mobileFiltersOpen ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            {filterDropdowns}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP: Original single-row filter bar ===== */}
      <div className="hidden sm:flex flex-row items-center gap-3">
        {filterDropdowns}
      </div>
    </div>
  );
});

PropertyFilters.displayName = 'PropertyFilters';

export default PropertyFilters;
