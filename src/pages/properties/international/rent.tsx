import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import PropertyCard from '../../../components/PropertyCard';
import PropertyFilters from '../../../components/PropertyFilters';
import Pagination from '../../../components/Pagination';
import { Property } from '../../../data/properties';
import { PropertiesApiService } from '../../../services/propertiesApiService';
import { parseSearchParams } from '../../../utils/searchUtils';
import { useLanguage } from '../../../context/LanguageContext';
import { usePagination } from '../../../hooks/usePagination';
import { useScrollRestoration } from '../../../hooks/useScrollRestoration';
import { getCachedProperties, setCachedProperties } from '../../../utils/propertiesCache';
import { isInternationalProperty } from '../../../utils/internationalProperties';

const InternationalRentPropertiesPage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  useScrollRestoration();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeCountryFilter, setActiveCountryFilter] = useState('All Countries');
  const [activeCityFilter, setActiveCityFilter] = useState('All Areas');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeListingTypeFilter, setActiveListingTypeFilter] = useState('Ready to Move');
  const [activePropertyTypeFilter, setActivePropertyTypeFilter] = useState('Rent');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState('featured');
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [scrollRestored, setScrollRestored] = useState(false);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const prevLanguageRef = useRef(language);
  const prevFiltersRef = useRef<string>('');
  const tRef = useRef(t);
  tRef.current = t;
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    const hasData = properties.length > 0 || error;
    if (!loading && !scrollRestored && router.isReady && hasData) {
      dataLoadedRef.current = true;
      const currentPath = router.asPath;
      const scrollKey = `scroll_position_${currentPath}`;
      const attemptRestore = (attempts: number, delay: number) => {
        if (attempts <= 0) { setScrollRestored(true); return; }
        try {
          let saved = sessionStorage.getItem(scrollKey);
          if (!saved) saved = localStorage.getItem(scrollKey);
          if (saved) {
            const { y, timestamp } = JSON.parse(saved);
            if (Date.now() - timestamp < 7200000 && y > 0) {
              window.scrollTo({ top: y, left: 0, behavior: 'instant' });
              setTimeout(() => {
                if (Math.abs(window.scrollY - y) > 50 && attempts > 1) attemptRestore(attempts - 1, Math.min(delay + 100, 500));
                else setScrollRestored(true);
              }, 50);
            } else setScrollRestored(true);
          } else setScrollRestored(true);
        } catch { setScrollRestored(true); }
      };
      const timer = setTimeout(() => attemptRestore(15, 50), 10);
      return () => clearTimeout(timer);
    }
  }, [loading, scrollRestored, router.isReady, router.asPath, properties.length, error]);

  useEffect(() => {
    if (!router.isReady || filtersInitialized) return;
    const { filter, city, status, sort, country } = router.query;
    if (filter && typeof filter === 'string') setActiveFilter(filter);
    if (country && typeof country === 'string') setActiveCountryFilter(country);
    if (city && typeof city === 'string') setActiveCityFilter(city);
    if (status && typeof status === 'string') setActiveStatusFilter(status);
    if (sort && typeof sort === 'string') setSortBy(sort);
    setFiltersInitialized(true);
  }, [router.isReady, router.query, filtersInitialized]);

  useEffect(() => {
    if (!router.isReady || !filtersInitialized) return;
    const currentT = tRef.current;
    const allValues = new Set(['All', currentT('properties.page.all', 'All'), currentT('propertyFilters.all', 'All')]);
    const allCountriesValues = new Set(['All Countries', currentT('propertyFilters.allCountries', 'All Countries')]);
    const allCitiesValues = new Set(['All Areas', currentT('properties.page.allCities', 'All Areas'), currentT('propertyFilters.allCities', 'All Areas')]);
    const query: Record<string, string> = {};
    if (activeFilter && !allValues.has(activeFilter)) query.filter = activeFilter;
    if (activeCountryFilter && !allCountriesValues.has(activeCountryFilter)) query.country = activeCountryFilter;
    if (activeCityFilter && !allCitiesValues.has(activeCityFilter)) query.city = activeCityFilter;
    if (activeStatusFilter && !allValues.has(activeStatusFilter)) query.status = activeStatusFilter;
    if (sortBy && sortBy !== 'featured') query.sort = sortBy;
    const currentPage = router.query.page;
    if (currentPage && typeof currentPage === 'string') query.page = currentPage;
    const newQueryString = JSON.stringify(query);
    if (prevFiltersRef.current === newQueryString) return;
    prevFiltersRef.current = newQueryString;
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
  }, [router.isReady, filtersInitialized, activeFilter, activeCountryFilter, activeCityFilter, activeStatusFilter, sortBy]);

  const prevAllValueRef = useRef(t('propertyFilters.all', 'All'));

  useEffect(() => {
    const allValue = t('propertyFilters.all', 'All');
    const allCountriesValue = t('propertyFilters.allCountries', 'All Countries');
    const allCitiesValue = t('propertyFilters.allCities', 'All Areas');
    const languageChanged = prevLanguageRef.current !== language;
    const translationsChanged = prevAllValueRef.current !== allValue;
    if (languageChanged || translationsChanged) {
      prevLanguageRef.current = language;
      prevAllValueRef.current = allValue;
      setActiveFilter(allValue);
      setActiveTypeFilter(allValue);
      setActiveCountryFilter(allCountriesValue);
      setActiveCityFilter(allCitiesValue);
      setActiveStatusFilter(allValue);
      setActiveListingTypeFilter('Ready to Move');
      setActivePropertyTypeFilter('Rent');
    }
  }, [language, t]);

  const fetchProperties = useCallback(async (forceRefresh = false) => {
    const searchFilters = parseSearchParams(router.query);
    const hasSearchFilters = !!(searchFilters.query);
    
    if (!hasSearchFilters && !forceRefresh) {
      const cachedData = getCachedProperties('international');
      if (cachedData && cachedData.length > 0) {
        const rentProperties = cachedData.filter(p => isInternationalProperty(p) && p.property_type === 'rent' && p.type !== 'Commercial');
        setProperties(rentProperties);
        setSearchQuery('');
        setLoading(false);
        setError(null);
        return;
      }
    }
    
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    
    try {
      let transformedProperties: Property[] = [];
      
      if (hasSearchFilters) {
        const searchParams = { ...searchFilters, page: 1, limit: 200 };
        transformedProperties = await PropertiesApiService.searchProperties(searchParams);
        transformedProperties = transformedProperties.filter(p => isInternationalProperty(p) && p.property_type === 'rent' && p.type !== 'Commercial');
        if (searchFilters.query) setSearchQuery(searchFilters.query);
      } else {
        const allProperties = await PropertiesApiService.getAllProperties();
        const internationalAll = allProperties.filter(isInternationalProperty);
        transformedProperties = internationalAll.filter(p => p.property_type === 'rent' && p.type !== 'Commercial');
        setSearchQuery('');
        if (internationalAll.length > 0) setCachedProperties('international', internationalAll);
      }
      
      setProperties(transformedProperties);
      setError(null);
    } catch (err: any) {
      setProperties([]);
      setError(err.message || 'Failed to load international rental properties');
    } finally {
      setLoading(false);
    }
  }, [router.query]);

  useEffect(() => {
    if (router.isReady) fetchProperties();
  }, [router.isReady, fetchProperties]);

  const availableCities = useMemo(() => {
    return properties.length > 0 ? Array.from(new Set(properties.map(p => p.city).filter(Boolean))).sort() : [];
  }, [properties]);

  const availableCountries = useMemo(() => {
    return properties.length > 0 ? Array.from(new Set(properties.map(p => p.country).filter(Boolean))).sort() : [];
  }, [properties]);

  const cityCounts = useMemo(() => {
    return properties.reduce((acc, p) => { if (p.city) acc[p.city] = (acc[p.city] || 0) + 1; return acc; }, {} as Record<string, number>);
  }, [properties]);

  const availableTypes = useMemo(() => {
    const allTypes: Property['type'][] = ['Villa', 'Apartment', 'Land', 'Farm'];
    if (properties.length > 0) {
      const existingTypes = new Set(properties.map(p => p.type));
      return allTypes.filter(type => existingTypes.has(type));
    }
    return allTypes;
  }, [properties]);

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];
    const allValues = new Set(['All', t('properties.page.all', 'All'), t('propertyFilters.all', 'All')]);
    const allCountriesValues = new Set(['All Countries', t('propertyFilters.allCountries', 'All Countries')]);
    const allCitiesValues = new Set(['All Areas', t('properties.page.allCities', 'All Areas'), t('propertyFilters.allCities', 'All Areas')]);
    const isAllFilter = (val: string) => allValues.has(val);
    const isAllCities = (val: string) => allCitiesValues.has(val);

    if (activeFilter === 'Featured') filtered = filtered.filter(p => p.featured);
    else if (!isAllFilter(activeFilter) && availableTypes.includes(activeFilter as Property['type'])) filtered = filtered.filter(p => p.type === activeFilter);
    if (!allCountriesValues.has(activeCountryFilter)) filtered = filtered.filter(p => p.country === activeCountryFilter);
    if (!isAllCities(activeCityFilter)) filtered = filtered.filter(p => p.city === activeCityFilter);

    if (!isAllFilter(activeStatusFilter)) {
      const soldLabels = new Set(['Sold', 'sold', t('propertyFilters.status.sold', 'Sold')]);
      const approvedLabels = new Set(['Available', 'Approved', 'approved', t('propertyFilters.status.approved', 'Approved')]);
      let statusToFilter = activeStatusFilter;
      if (soldLabels.has(activeStatusFilter)) statusToFilter = 'sold';
      else if (approvedLabels.has(activeStatusFilter)) statusToFilter = 'approved';
      filtered = filtered.filter(p => p.status === statusToFilter);
    }

    if (priceRange[0] > 0 || priceRange[1] > 0) {
      filtered = filtered.filter(p => {
        const price = parseInt(p.price.replace(/[€,AED,USD]/g, '').replace(/[^0-9]/g, '')) || 0;
        return price >= (priceRange[0] || 0) && price <= (priceRange[1] || Infinity);
      });
    }

    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => (parseInt(a.price.replace(/[^0-9]/g, '')) || 0) - (parseInt(b.price.replace(/[^0-9]/g, '')) || 0)); break;
      case 'price-high': filtered.sort((a, b) => (parseInt(b.price.replace(/[^0-9]/g, '')) || 0) - (parseInt(a.price.replace(/[^0-9]/g, '')) || 0)); break;
      case 'newest': filtered.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0)); break;
      case 'featured': filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return filtered;
  }, [properties, activeFilter, activeCountryFilter, activeCityFilter, activeStatusFilter, priceRange, sortBy, availableTypes, t]);

  const pagination = usePagination({ items: filteredProperties, initialItemsPerPage: 12, dependencies: [activeFilter, activeCountryFilter, activeCityFilter, activeStatusFilter, priceRange, sortBy, searchQuery] });

  const goToPage = useCallback((page: number) => {
    pagination.goToPage(page);
    document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pagination]);

  const clearFilters = useCallback(() => {
    setActiveFilter(t('propertyFilters.all', 'All'));
    setActiveTypeFilter(t('propertyFilters.all', 'All'));
    setActiveCountryFilter(t('propertyFilters.allCountries', 'All Countries'));
    setActiveCityFilter(t('propertyFilters.allCities', 'All Areas'));
    setActiveStatusFilter(t('propertyFilters.all', 'All'));
    setActiveListingTypeFilter('Ready to Move');
    setActivePropertyTypeFilter('Rent');
    setPriceRange([0, 0]);
    setSortBy('featured');
    setSearchQuery('');
    router.push('/properties/international/rent', undefined, { shallow: true });
    pagination.resetToFirstPage();
  }, [pagination, t, router]);

  return (
    <>
      <Head>
        <title>Rent International Property | Global Rental Properties | Rino Properties</title>
        <meta name="description" content="Rent international properties — furnished apartments, villas & homes for rent across global markets. Short & long-term leases. Expat relocation support. Verified listings. Rino Properties." />
        <meta name="keywords" content="rent property abroad, international rental properties, apartments for rent worldwide, expat rental guide, furnished apartment overseas, long-term rental abroad, short-term international rental, corporate housing global, relocation property rental, global luxury rentals, overseas villa for rent, international lease, rent house abroad 2026, serviced apartments worldwide, digital nomad rental" />
        <link rel="canonical" href="https://rinoproperties.com/properties/international/rent" />
        <meta property="og:title" content="Rent International Property | Global Rental Properties" />
        <meta property="og:description" content="Rent property abroad. Furnished apartments & villas worldwide. Expert relocation support. Rino Properties." />
        <meta property="og:url" content="https://rinoproperties.com/properties/international/rent" />
        <meta property="og:type" content="website" />
      </Head>

      <Layout title="Rent International Property | Rino Properties" description="Rent international properties — furnished apartments, villas & homes worldwide. Short & long-term leases. Rino Properties.">
        <div className="bg-white min-h-screen">
          <section className="relative bg-white pt-28 pb-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-100 shadow-md border border-gray-200 p-3 sm:p-4 rounded-xl relative z-20 mx-2 sm:mx-4 md:mx-0 max-w-full">
                <PropertyFilters
                  activeFilter={activeFilter} setActiveFilter={setActiveFilter}
                  activeTypeFilter={activeTypeFilter} setActiveTypeFilter={setActiveTypeFilter}
                  activeCountryFilter={activeCountryFilter} setActiveCountryFilter={setActiveCountryFilter}
                  activeCityFilter={activeCityFilter} setActiveCityFilter={setActiveCityFilter}
                  activeStatusFilter={activeStatusFilter} setActiveStatusFilter={setActiveStatusFilter}
                  activeListingTypeFilter={activeListingTypeFilter} setActiveListingTypeFilter={setActiveListingTypeFilter}
                  activePropertyTypeFilter={activePropertyTypeFilter} setActivePropertyTypeFilter={setActivePropertyTypeFilter}
                  priceRange={priceRange} setPriceRange={setPriceRange}
                  availableTypes={availableTypes} availableCountries={availableCountries} availableCities={availableCities} cityCounts={cityCounts}
                  country="International" sortBy={sortBy} setSortBy={setSortBy}
                  hideCountry={false} hideListingType={true} hidePropertyType={true}
                />
              </div>
            </div>
          </section>
          
          <section id="properties-section" className="relative py-8 overflow-hidden bg-white min-h-screen">
            <div className="absolute inset-0 bg-white z-0"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
              {searchQuery && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs xs:text-sm font-medium text-blue-800">Search Results for:</h3>
                      <p className="text-sm xs:text-base text-blue-600">&quot;{searchQuery}&quot;</p>
                    </div>
                    <button onClick={() => { setSearchQuery(''); router.push('/properties/international/rent', undefined, { shallow: true }); }} className="text-blue-600 hover:text-blue-800 text-xs xs:text-sm font-medium">Clear Search</button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                    {loading ? 'Loading Rental Properties...' : `${filteredProperties.length} International Properties for Rent`}
                  </h2>
                  <p className="text-sm xs:text-base text-gray-600 font-light">
                    {!loading && !error && filteredProperties.length > 0 && (
                      <span>Showing {pagination.startIndex + 1}-{Math.min(pagination.endIndex, filteredProperties.length)} of {filteredProperties.length}</span>
                    )}
                    {error && !loading && <span className="text-red-600 font-medium">Unable to load properties</span>}
                  </p>
                </div>
                {!loading && !error && filteredProperties.length > 0 && (
                  <div className="mt-4 sm:mt-0 flex items-center gap-2">
                    <label htmlFor="items-per-page" className="text-sm text-gray-600">Items per page:</label>
                    <select id="items-per-page" value={pagination.itemsPerPage} onChange={(e) => pagination.setItemsPerPage(Number(e.target.value))} className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 shadow-sm">
                      <option value={6}>6</option><option value={12}>12</option><option value={24}>24</option><option value={48}>48</option>
                    </select>
                  </div>
                )}
              </div>

              {loading && (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm xs:text-base text-gray-600">Loading rental properties...</p>
                  </div>
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-16">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg mx-auto">
                    <div className="text-red-600 mb-2 text-lg font-semibold">Failed to load properties</div>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <button onClick={() => fetchProperties(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">Retry</button>
                  </div>
                </div>
              )}

              {!loading && filteredProperties.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pagination.currentItems.map((property: Property, index: number) => (
                    <PropertyCard key={property.id} property={property} index={pagination.startIndex + index} />
                  ))}
                </div>
              )}

              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} itemsPerPage={pagination.itemsPerPage} totalItems={filteredProperties.length} onPageChange={goToPage} onItemsPerPageChange={pagination.setItemsPerPage} showItemsPerPage={false} showQuickJump={true} className="mt-12" t={(key: string, fallback: string) => t(`international.${key}`, fallback)} />

              {!loading && filteredProperties.length === 0 && (
                <div className="text-center py-16">
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900 mb-4">No Rental Properties Found</h3>
                  <p className="text-sm xs:text-base text-gray-600 mb-8 font-light">Try adjusting your filters.</p>
                  <button onClick={clearFilters} className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-8 py-3 font-medium hover:from-[#C4903A] hover:to-[#D69F3F] transition-all duration-300 text-sm xs:text-base">Clear All Filters</button>
                </div>
              )}
            </div>
          </section>

          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1920&h=1080&fit=crop')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6">Rent International Property - Contact Our Experts</h2>
              <p className="text-base xs:text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">Find the perfect rental property in international markets.</p>
              <a href="/contact" className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4 font-light hover:bg-white transition-all duration-300 text-sm xs:text-base">Contact Our Experts</a>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default InternationalRentPropertiesPage;
