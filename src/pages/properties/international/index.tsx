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

const InternationalPropertiesPage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  useScrollRestoration();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeCountryFilter, setActiveCountryFilter] = useState('All Countries');
  const [activeCityFilter, setActiveCityFilter] = useState('All Areas');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeListingTypeFilter, setActiveListingTypeFilter] = useState('All Types');
  const [activePropertyTypeFilter, setActivePropertyTypeFilter] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState('featured');
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const [scrollRestored, setScrollRestored] = useState(false);

  // API state
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

  // Restore scroll position after content loads
  useEffect(() => {
    const hasData = properties.length > 0 || error;
    if (!loading && !scrollRestored && router.isReady && hasData) {
      dataLoadedRef.current = true;
      const currentPath = router.asPath;
      const scrollKey = `scroll_position_${currentPath}`;
      
      const attemptRestore = (attempts: number, delay: number) => {
        if (attempts <= 0) {
          setScrollRestored(true);
          return;
        }
        
        try {
          let saved = sessionStorage.getItem(scrollKey);
          if (!saved) {
            saved = localStorage.getItem(scrollKey);
          }
          
          if (saved) {
            const { y, timestamp } = JSON.parse(saved);
            const twoHours = 2 * 60 * 60 * 1000;
            
            if (Date.now() - timestamp < twoHours && y > 0) {
              window.scrollTo({ top: y, left: 0, behavior: 'instant' });
              
              setTimeout(() => {
                const diff = Math.abs(window.scrollY - y);
                if (diff > 50 && attempts > 1) {
                  attemptRestore(attempts - 1, Math.min(delay + 100, 500));
                } else {
                  setScrollRestored(true);
                }
              }, 50);
            } else {
              setScrollRestored(true);
            }
          } else {
            setScrollRestored(true);
          }
        } catch {
          setScrollRestored(true);
        }
      };
      
      const timer = setTimeout(() => attemptRestore(15, 50), 10);
      return () => clearTimeout(timer);
    }
  }, [loading, scrollRestored, router.isReady, router.asPath, properties.length, error]);

  const filtersFromUrlRef = useRef(false);

  // Initialize filters from URL
  useEffect(() => {
    if (!router.isReady || filtersInitialized) return;
    
    const { filter, city, status, listingType, sort, country } = router.query;
    const listingTypeSnake = router.query.listing_type;
    
    if (filter && typeof filter === 'string') setActiveFilter(filter);
    if (country && typeof country === 'string') setActiveCountryFilter(country);
    if (city && typeof city === 'string') setActiveCityFilter(city);
    if (status && typeof status === 'string') setActiveStatusFilter(status);
    
    const rawListingType = (listingType && typeof listingType === 'string') ? listingType
      : (listingTypeSnake && typeof listingTypeSnake === 'string') ? listingTypeSnake
      : null;
    if (rawListingType) {
      const listingTypeMap: Record<string, string> = {
        'Ready': 'Ready to Move', 'ready': 'Ready to Move', 'Ready to Move': 'Ready to Move',
        'ready-to-move': 'Ready to Move', 'Off-Plan': 'Off-Plan', 'off-plan': 'Off-Plan',
        'Off Plan': 'Off-Plan', 'OffPlan': 'Off-Plan', 'offplan': 'Off-Plan',
      };
      setActiveListingTypeFilter(listingTypeMap[rawListingType] || rawListingType);
    }
    if (sort && typeof sort === 'string') setSortBy(sort);
    
    const { propertyType } = router.query;
    if (propertyType && typeof propertyType === 'string') {
      const propertyTypeMap: Record<string, string> = {
        'buy': 'buy', 'rent': 'rent', 'Buy': 'buy', 'Rent': 'rent',
      };
      setActivePropertyTypeFilter(propertyTypeMap[propertyType] || propertyType);
    }
    
    const hasUrlFilters = !!(filter || country || city || status || rawListingType || sort || propertyType);
    if (hasUrlFilters) filtersFromUrlRef.current = true;
    
    setFiltersInitialized(true);
  }, [router.isReady, router.query, filtersInitialized]);

  // Update URL when filters change
  useEffect(() => {
    if (!router.isReady || !filtersInitialized) return;
    
    const currentT = tRef.current;
    const allValues = new Set(['All', currentT('properties.page.all', 'All'), currentT('propertyFilters.all', 'All')]);
    const allCountriesValues = new Set(['All Countries', currentT('propertyFilters.allCountries', 'All Countries')]);
    const allCitiesValues = new Set(['All Areas', currentT('properties.page.allCities', 'All Areas'), currentT('propertyFilters.allCities', 'All Areas')]);
    const allTypesValues = new Set(['All Types', currentT('properties.page.allTypes', 'All Types'), currentT('propertyFilters.allTypes', 'All Types')]);
    
    const query: Record<string, string> = {};
    
    if (activeFilter && !allValues.has(activeFilter)) query.filter = activeFilter;
    if (activeCountryFilter && !allCountriesValues.has(activeCountryFilter)) query.country = activeCountryFilter;
    if (activeCityFilter && !allCitiesValues.has(activeCityFilter)) query.city = activeCityFilter;
    if (activeStatusFilter && !allValues.has(activeStatusFilter)) query.status = activeStatusFilter;
    if (activeListingTypeFilter && !allTypesValues.has(activeListingTypeFilter)) query.listingType = activeListingTypeFilter;
    if (activePropertyTypeFilter && !allValues.has(activePropertyTypeFilter)) query.propertyType = activePropertyTypeFilter.toLowerCase();
    if (sortBy && sortBy !== 'featured') query.sort = sortBy;
    
    const currentPage = router.query.page;
    if (currentPage && typeof currentPage === 'string') query.page = currentPage;
    
    const newQueryString = JSON.stringify(query);
    if (prevFiltersRef.current === newQueryString) return;
    prevFiltersRef.current = newQueryString;
    
    router.replace(
      { pathname: router.pathname, query },
      undefined,
      { shallow: true, scroll: false }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, filtersInitialized, activeFilter, activeCountryFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, sortBy]);

  const prevAllValueRef = useRef(t('propertyFilters.all', 'All'));

  // Update filter states when language changes
  useEffect(() => {
    const allValue = t('propertyFilters.all', 'All');
    const allCountriesValue = t('propertyFilters.allCountries', 'All Countries');
    const allCitiesValue = t('propertyFilters.allCities', 'All Areas');
    const allTypesValue = t('propertyFilters.allTypes', 'All Types');
    
    const languageChanged = prevLanguageRef.current !== language;
    const translationsChanged = prevAllValueRef.current !== allValue;
    
    if (languageChanged) {
      prevLanguageRef.current = language;
      prevAllValueRef.current = allValue;
      filtersFromUrlRef.current = false;
      
      setActiveFilter(allValue);
      setActiveTypeFilter(allValue);
      setActiveCountryFilter(allCountriesValue);
      setActiveCityFilter(allCitiesValue);
      setActiveStatusFilter(allValue);
      setActiveListingTypeFilter(allTypesValue);
      setActivePropertyTypeFilter('All');
    } else if (translationsChanged) {
      prevAllValueRef.current = allValue;
      
      if (!filtersFromUrlRef.current) {
        setActiveFilter(allValue);
        setActiveTypeFilter(allValue);
        setActiveCountryFilter(allCountriesValue);
        setActiveCityFilter(allCitiesValue);
        setActiveStatusFilter(allValue);
        setActiveListingTypeFilter(allTypesValue);
        setActivePropertyTypeFilter('All');
      }
    }
  }, [language, t]);

  // Fetch international properties (all properties except Spain and Dubai/UAE)
  const fetchProperties = useCallback(async (forceRefresh = false) => {
    const searchFilters = parseSearchParams(router.query);
    const hasSearchFilters = !!(searchFilters.query || searchFilters.listing_type);
    
    if (!hasSearchFilters && !forceRefresh) {
      const cachedData = getCachedProperties('international');
      if (cachedData && cachedData.length > 0) {
        setProperties(cachedData);
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
        const searchParams = {
          ...searchFilters,
          page: 1,
          limit: 200
        };
        
        transformedProperties = await PropertiesApiService.searchProperties(searchParams);
        // Filter out Spain and Dubai/UAE
        transformedProperties = transformedProperties.filter(isInternationalProperty);
        
        if (searchFilters.query) setSearchQuery(searchFilters.query);
        
        if (searchFilters.listing_type === 'ready-to-move') {
          setActiveListingTypeFilter(tRef.current('propertyFilters.listingType.readyToMove', 'Ready to Move'));
        } else if (searchFilters.listing_type === 'off-plan') {
          setActiveListingTypeFilter(tRef.current('propertyFilters.listingType.offPlan', 'Off-Plan'));
        }
      } else {
        // Get all properties and filter out Spain and Dubai/UAE
        const allProperties = await PropertiesApiService.getAllProperties();
        transformedProperties = allProperties.filter(isInternationalProperty);
        setSearchQuery('');
        
        if (transformedProperties.length > 0) {
          setCachedProperties('international', transformedProperties);
        }
      }
      
      setProperties(transformedProperties);
      setError(null);
    } catch (err: any) {
      setProperties([]);
      setError(err.message || 'Failed to load international properties from API');
    } finally {
      setLoading(false);
    }
  }, [router.query]);

  useEffect(() => {
    if (router.isReady) fetchProperties();
  }, [router.isReady, fetchProperties]);

  const availableCities = useMemo(() => {
    if (properties.length > 0) {
      return Array.from(new Set(properties.map(p => p.city).filter(Boolean))).sort();
    }
    return [];
  }, [properties]);

  const availableCountries = useMemo(() => {
    if (properties.length > 0) {
      return Array.from(new Set(properties.map(p => p.country).filter(Boolean))).sort();
    }
    return [];
  }, [properties]);

  const cityCounts = useMemo(() => {
    return properties.reduce((acc, p) => {
      if (p.city) acc[p.city] = (acc[p.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [properties]);

  const availableTypes = useMemo(() => {
    const allTypes: Property['type'][] = ['Villa', 'Apartment', 'Commercial', 'Land', 'Farm'];
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
    const allTypesValues = new Set(['All Types', t('properties.page.allTypes', 'All Types'), t('propertyFilters.allTypes', 'All Types')]);

    const isAllFilter = (val: string) => allValues.has(val);
    const isAllCities = (val: string) => allCitiesValues.has(val);
    const isAllTypes = (val: string) => allTypesValues.has(val);

    if (activeFilter === 'Featured') {
      filtered = filtered.filter(property => property.featured);
    } else if (!isAllFilter(activeFilter) && availableTypes.includes(activeFilter as Property['type'])) {
      filtered = filtered.filter(property => property.type === activeFilter);
    }

    if (!allCountriesValues.has(activeCountryFilter)) {
      filtered = filtered.filter(property => property.country === activeCountryFilter);
    }

    if (!isAllCities(activeCityFilter)) {
      filtered = filtered.filter(property => property.city === activeCityFilter);
    }

    if (!isAllFilter(activeStatusFilter)) {
      let statusToFilter: string = activeStatusFilter;
      const soldLabels = new Set(['Sold', 'sold', t('propertyFilters.status.sold', 'Sold'), t('properties.page.statusOptions.sold', 'Sold')]);
      const approvedLabels = new Set(['Available', 'Approved', 'approved', t('propertyFilters.status.approved', 'Approved'), t('properties.page.statusOptions.approved', 'Available')]);
      const negotiableLabels = new Set(['Negotiable', 'negotiable', t('propertyFilters.status.negotiable', 'Negotiable'), t('properties.page.statusOptions.negotiable', 'Negotiable')]);
      
      if (soldLabels.has(activeStatusFilter)) statusToFilter = 'sold';
      else if (approvedLabels.has(activeStatusFilter)) statusToFilter = 'approved';
      else if (negotiableLabels.has(activeStatusFilter)) statusToFilter = 'negotiable';
      
      filtered = filtered.filter(property => property.status === statusToFilter);
    }

    if (!isAllTypes(activeListingTypeFilter)) {
      const offPlanLabels = new Set([
        'Off-Plan', 'Off Plan', 'off-plan', 'OffPlan', 'Offplan', 'offplan',
        t('propertyFilters.listingType.offPlan', 'Off-Plan'),
        t('properties.page.listingTypeOptions.offPlan', 'Off Plan')
      ]);
      const readyLabels = new Set([
        'Ready to Move', 'Ready', 'ready', 'ready-to-move',
        t('propertyFilters.listingType.readyToMove', 'Ready to Move'),
        t('properties.page.listingTypeOptions.readyToMove', 'Ready to Move')
      ]);
      
      let mappedListingType: Property['listing_type'] | null = null;
      if (offPlanLabels.has(activeListingTypeFilter)) mappedListingType = 'off-plan';
      else if (readyLabels.has(activeListingTypeFilter)) mappedListingType = 'ready-to-move';
    
      if (mappedListingType) {
        filtered = filtered.filter(property => property.listing_type === mappedListingType);
      }
    }

    if (activePropertyTypeFilter && !isAllFilter(activePropertyTypeFilter)) {
      const buyLabels = new Set(['Buy', 'buy', t('propertyFilters.propertyType.buy', 'Buy')]);
      const rentLabels = new Set(['Rent', 'rent', t('propertyFilters.propertyType.rent', 'Rent')]);

      let mappedPropertyType: string | null = null;
      if (buyLabels.has(activePropertyTypeFilter)) mappedPropertyType = 'buy';
      else if (rentLabels.has(activePropertyTypeFilter)) mappedPropertyType = 'rent';

      if (mappedPropertyType) {
        filtered = filtered.filter(property => property.property_type === mappedPropertyType);
      }
    }

    if (priceRange[0] > 0 || priceRange[1] > 0) {
      filtered = filtered.filter(property => {
        const price = parseInt(property.price.replace(/[€,AED,USD]/g, '').replace(/[^0-9]/g, '')) || 0;
        const min = priceRange[0] || 0;
        const max = priceRange[1] || Infinity;
        return price >= min && price <= max;
      });
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[€,AED,USD]/g, '').replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[€,AED,USD]/g, '').replace(/[^0-9]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[€,AED,USD]/g, '').replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[€,AED,USD]/g, '').replace(/[^0-9]/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [properties, activeFilter, activeCountryFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, priceRange, sortBy, availableTypes, t]);

  const pagination = usePagination({
    items: filteredProperties,
    initialItemsPerPage: 12,
    dependencies: [activeFilter, activeCountryFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, priceRange, sortBy, searchQuery]
  });

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
    setActiveListingTypeFilter(t('propertyFilters.allTypes', 'All Types'));
    setActivePropertyTypeFilter('All');
    setPriceRange([0, 0]);
    setSortBy('featured');
    setSearchQuery('');
    router.push('/properties/international', undefined, { shallow: true });
    pagination.resetToFirstPage();
  }, [pagination, t, router]);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "International Properties for Sale & Rent",
      "description": "Discover luxury international properties for sale and rent. Expert real estate guidance from Rino Properties across global markets.",
      "url": "https://rinoproperties.com/properties/international",
      "inLanguage": "en",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rinoproperties.com" },
          { "@type": "ListItem", "position": 2, "name": "Properties", "item": "https://rinoproperties.com/properties" },
          { "@type": "ListItem", "position": 3, "name": "International", "item": "https://rinoproperties.com/properties/international" }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "International Property Collection",
      "numberOfItems": properties.length,
      "itemListElement": properties.slice(0, 10).map((property, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "RealEstateListing",
          "name": property.title,
          "description": property.description,
          "url": `https://rinoproperties.com/properties/${property.slug}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": property.city,
            "addressCountry": property.country
          }
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What international properties does Rino Properties offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rino Properties offers a curated selection of international properties across emerging and established markets worldwide, including Argentina, and other global destinations. Our portfolio includes luxury villas, apartments, commercial properties, and land investments."
          }
        },
        {
          "@type": "Question",
          "name": "Can foreigners buy international property through Rino Properties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Rino Properties provides full support for foreign buyers looking to invest in international real estate. We handle legal requirements, documentation, and provide expert guidance throughout the entire purchase process in each country."
          }
        },
        {
          "@type": "Question",
          "name": "What are the benefits of international property investment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "International property investment offers portfolio diversification, potential for strong rental yields, capital appreciation in emerging markets, lifestyle benefits, and in some cases, residency or citizenship opportunities. Rino Properties helps identify the best opportunities across global markets."
          }
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>International Properties for Sale & Rent | Global Real Estate Investment | Rino Properties</title>
        <meta name="description" content="Buy & rent international properties worldwide — luxury villas, apartments & commercial real estate across Europe, Americas, Asia. Expert cross-border investment guidance. Currency-hedged portfolios. Rino Properties — global real estate partner." />
        <meta name="keywords" content="international properties for sale, global real estate investment, buy property abroad, overseas property investment, international real estate agency, luxury properties worldwide, cross-border real estate, foreign property purchase, expat property investment, international rental properties, global property portfolio, emerging market real estate, property investment abroad, overseas apartments for sale, international villas, real estate diversification, buy property overseas 2026, global property market, second home abroad, residency by investment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <meta property="og:title" content="International Properties for Sale & Rent | Global Real Estate" />
        <meta property="og:description" content="Luxury international properties worldwide. Expert guidance for global property investment." />
        <meta property="og:url" content="https://rinoproperties.com/properties/international" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rino Properties" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="International Properties for Sale & Rent" />
        <meta name="twitter:description" content="Luxury properties across international markets. Expert guidance from Rino Properties." />
        
        <link rel="canonical" href="https://rinoproperties.com/properties/international" />
        <link rel="alternate" hrefLang="en" href="https://rinoproperties.com/properties/international" />
        <link rel="alternate" hrefLang="x-default" href="https://rinoproperties.com/properties/international" />
        
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rinoproperties.com" },
                { "@type": "ListItem", "position": 2, "name": "Properties", "item": "https://rinoproperties.com/properties" },
                { "@type": "ListItem", "position": 3, "name": "International Properties", "item": "https://rinoproperties.com/properties/international" }
              ]
            })
          }}
        />
      </Head>

      <Layout 
        title="International Properties for Sale & Rent | Rino Properties"
        description="Buy & rent international properties worldwide — luxury villas, apartments & commercial real estate across Europe, Americas, Asia. Expert cross-border investment guidance. Rino Properties."
      >
        <div className="bg-white min-h-screen">
          {/* Filter Bar Section */}
          <section className="relative bg-white pt-28 pb-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-100 shadow-md border border-gray-200 p-3 sm:p-4 rounded-xl relative z-20 mx-2 sm:mx-4 md:mx-0 max-w-full">
                <PropertyFilters
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  activeTypeFilter={activeTypeFilter}
                  setActiveTypeFilter={setActiveTypeFilter}
                  activeCountryFilter={activeCountryFilter}
                  setActiveCountryFilter={setActiveCountryFilter}
                  activeCityFilter={activeCityFilter}
                  setActiveCityFilter={setActiveCityFilter}
                  activeStatusFilter={activeStatusFilter}
                  setActiveStatusFilter={setActiveStatusFilter}
                  activeListingTypeFilter={activeListingTypeFilter}
                  setActiveListingTypeFilter={setActiveListingTypeFilter}
                  activePropertyTypeFilter={activePropertyTypeFilter}
                  setActivePropertyTypeFilter={setActivePropertyTypeFilter}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  availableTypes={availableTypes}
                  availableCountries={availableCountries}
                  availableCities={availableCities}
                  cityCounts={cityCounts}
                  country="International"
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  hideCountry={false}
                  hideListingType={false}
                  hidePropertyType={false}
                />
              </div>
            </div>
          </section>
          
          {/* Properties Section */}
          <section id="properties-section" className="relative py-8 overflow-hidden bg-white min-h-screen">
            <div className="absolute inset-0 bg-white z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
              {/* Search Results Info */}
              {searchQuery && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs xs:text-sm font-medium text-blue-800">Search Results for:</h3>
                      <p className="text-sm xs:text-base text-blue-600">&quot;{searchQuery}&quot; in International Properties</p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        router.push('/properties/international', undefined, { shallow: true });
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs xs:text-sm font-medium"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}

              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                    {loading ? 'Loading International Properties...' : `${filteredProperties.length} International Properties Found`}
                  </h2>
                  <p className="text-sm xs:text-base text-gray-600 font-light">
                    {!loading && !error && (
                      <>
                        {searchQuery && `Search results for "${searchQuery}" in International Properties`}
                        {activeFilter !== 'All' && `${searchQuery ? ' • ' : ''}Filtered by: ${activeFilter}`}
                        {activeCityFilter !== 'All Areas' && ` in ${activeCityFilter}`}
                        {filteredProperties.length > 0 && (
                          <span className="block mt-1">
                            Showing {pagination.startIndex + 1}-{Math.min(pagination.endIndex, filteredProperties.length)} of {filteredProperties.length}
                          </span>
                        )}
                      </>
                    )}
                    {error && !loading && (
                      <span className="text-red-600 font-medium">Unable to load properties from API</span>
                    )}
                  </p>
                </div>
                
                {!loading && !error && filteredProperties.length > 0 && (
                  <div className="mt-4 sm:mt-0 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label htmlFor="items-per-page" className="text-sm text-gray-600">Items per page:</label>
                      <select
                        id="items-per-page"
                        value={pagination.itemsPerPage}
                        onChange={(e) => pagination.setItemsPerPage(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F]"
                      >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={48}>48</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm xs:text-base text-gray-600">Loading international properties...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="text-center py-16">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg mx-auto">
                    <div className="text-6xl mb-4">&#x1F6AB;</div>
                    <div className="text-red-600 mb-2 text-lg xs:text-xl font-semibold">API Connection Failed</div>
                    <p className="text-sm xs:text-base text-gray-700 mb-4">Unable to fetch properties from the server.</p>
                    <p className="text-xs xs:text-sm text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => fetchProperties(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm xs:text-base"
                      >
                        &#x1F504; Retry Connection
                      </button>
                      <a
                        href="/contact"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm xs:text-base"
                      >
                        &#x1F4DE; Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Properties Grid */}
              {!loading && filteredProperties.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pagination.currentItems.map((property: Property, index: number) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      index={pagination.startIndex + index}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={filteredProperties.length}
                onPageChange={goToPage}
                onItemsPerPageChange={pagination.setItemsPerPage}
                showItemsPerPage={false}
                showQuickJump={true}
                className="mt-12"
                t={(key: string, fallback: string) => t(`international.${key}`, fallback)}
              />

              {/* No Properties Found */}
              {!loading && filteredProperties.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">&#x1F3E0;</div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                    No International Properties Match Your Search
                  </h3>
                  <p className="text-sm xs:text-base text-gray-600 mb-8 font-light">
                    We couldn&apos;t find any properties matching your current search criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-8 py-3 font-medium hover:from-[#C4903A] hover:to-[#D69F3F] transition-all duration-300 hover:scale-105 text-sm xs:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1920&h=1080&fit=crop')"
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6">
                Invest in International Properties - Contact Our Experts
              </h2>
              <p className="text-base xs:text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">
                Our expert team is here to help you navigate international property markets and find the perfect investment or home abroad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4 font-light hover:bg-white transition-all duration-300 text-sm xs:text-base"
                >
                  Contact Our Experts
                </a>
              </div>
            </div>
          </section>
        </div>
      </Layout>

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
    </>
  );
};

export default InternationalPropertiesPage;
