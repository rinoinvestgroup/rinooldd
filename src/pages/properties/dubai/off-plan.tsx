import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import PropertyCard from '../../../components/PropertyCard';
import PropertyFilters from '../../../components/PropertyFilters';
import Pagination from '../../../components/Pagination';
import { Property } from '../../../data/properties';
import Image from 'next/image';
import { PropertiesApiService } from '../../../services/propertiesApiService';
import { parseSearchParams } from '../../../utils/searchUtils';
import { useLanguage } from '../../../context/LanguageContext';
import { usePagination } from '../../../hooks/usePagination';
import { useScrollRestoration } from '../../../hooks/useScrollRestoration';
import { getCachedProperties, setCachedProperties } from '../../../utils/propertiesCache';

const OffPlanPropertiesPage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  // Enable scroll restoration tracking for navigation
  useScrollRestoration();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeCityFilter, setActiveCityFilter] = useState('All Areas');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeListingTypeFilter, setActiveListingTypeFilter] = useState('Off-Plan');
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
  
  // Track previous language to only reset filters on actual language changes
  const prevLanguageRef = useRef(language);
  const prevFiltersRef = useRef<string>('');
  
  // Keep a ref to the latest t() function so the URL-update effect
  // can use it without having t in its dependency array
  const tRef = useRef(t);
  tRef.current = t;
  
  // Track if data has been loaded (either from cache or API)
  const dataLoadedRef = useRef(false);

  // Restore scroll position after content loads - read directly from storage
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

  // Initialize filters from URL on mount
  useEffect(() => {
    if (!router.isReady || filtersInitialized) return;
    
    const { filter, city, status, sort } = router.query;
    
    if (filter && typeof filter === 'string') {
      setActiveFilter(filter);
    }
    if (city && typeof city === 'string') {
      setActiveCityFilter(city);
    }
    if (status && typeof status === 'string') {
      setActiveStatusFilter(status);
    }
    if (sort && typeof sort === 'string') {
      setSortBy(sort);
    }
    
    // Handle propertyType from URL
    const { propertyType } = router.query;
    if (propertyType && typeof propertyType === 'string') {
      const propertyTypeMap: Record<string, string> = {
        'buy': 'Buy',
        'rent': 'Rent',
        'Buy': 'Buy',
        'Rent': 'Rent',
      };
      setActivePropertyTypeFilter(propertyTypeMap[propertyType] || propertyType);
    }
    
    setFiltersInitialized(true);
  }, [router.isReady, router.query, filtersInitialized]);

  // Update URL when filters change (after initialization)
  useEffect(() => {
    if (!router.isReady || !filtersInitialized) return;
    
    const currentT = tRef.current;
    const allValues = new Set(['All', currentT('properties.page.all', 'All'), currentT('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', currentT('properties.page.allCities', 'All Areas'), currentT('propertyFilters.allCities', 'All Areas')]);
    
    const query: Record<string, string> = {};
    
    if (activeFilter && !allValues.has(activeFilter)) {
      query.filter = activeFilter;
    }
    if (activeCityFilter && !allCitiesValues.has(activeCityFilter)) {
      query.city = activeCityFilter;
    }
    if (activeStatusFilter && !allValues.has(activeStatusFilter)) {
      query.status = activeStatusFilter;
    }
    if (activePropertyTypeFilter && !allValues.has(activePropertyTypeFilter)) {
      const propertyTypeMap: Record<string, string> = {
        'Buy': 'buy',
        'Rent': 'rent',
      };
      query.propertyType = propertyTypeMap[activePropertyTypeFilter] || activePropertyTypeFilter.toLowerCase();
    }
    if (sortBy && sortBy !== 'featured') {
      query.sort = sortBy;
    }
    
    const currentPage = router.query.page;
    if (currentPage && typeof currentPage === 'string') {
      query.page = currentPage;
    }
    
    const newQueryString = JSON.stringify(query);
    if (prevFiltersRef.current === newQueryString) return;
    prevFiltersRef.current = newQueryString;
    
    router.replace(
      { pathname: router.pathname, query },
      undefined,
      { shallow: true, scroll: false }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, filtersInitialized, activeFilter, activeCityFilter, activeStatusFilter, activePropertyTypeFilter, sortBy]);

  const prevAllValueRef = useRef(t('propertyFilters.all', 'All'));

  useEffect(() => {
    const allValue = t('propertyFilters.all', 'All');
    const allCitiesValue = t('propertyFilters.allCities', 'All Areas');
    
    const languageChanged = prevLanguageRef.current !== language;
    const translationsChanged = prevAllValueRef.current !== allValue;
    
    if (languageChanged || translationsChanged) {
      prevLanguageRef.current = language;
      prevAllValueRef.current = allValue;
      
      setActiveFilter(allValue);
      setActiveTypeFilter(allValue);
      setActiveCityFilter(allCitiesValue);
      setActiveStatusFilter(allValue);
      // Keep listing type locked to Off-Plan
      setActiveListingTypeFilter('Off-Plan');
      setActivePropertyTypeFilter(allValue);
    }
  }, [language, t]);

  // Fetch properties from API with caching
  const fetchProperties = useCallback(async (forceRefresh = false) => {
    const searchFilters = parseSearchParams(router.query);
    const hasSearchFilters = !!(searchFilters.query);
    
    // Try to use cached data if no search filters and not forcing refresh
    if (!hasSearchFilters && !forceRefresh) {
      const cachedData = getCachedProperties('uae');
      if (cachedData && cachedData.length > 0) {
        // Filter cached data for off-plan only, exclude commercial
        const offPlanProperties = cachedData.filter(p => p.listing_type === 'off-plan' && p.type !== 'Commercial');
        setProperties(offPlanProperties);
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
          category: 'uae',
          listing_type: 'off-plan',
          page: 1,
          limit: 200
        };
        
        transformedProperties = await PropertiesApiService.searchProperties(searchParams);
        // Exclude commercial from search results
        transformedProperties = transformedProperties.filter(p => p.type !== 'Commercial');
        
        if (searchFilters.query) {
          setSearchQuery(searchFilters.query);
        }
      } else {
        // Get all UAE properties and filter for off-plan
        const allProperties = await PropertiesApiService.getPropertiesByCategory('uae');
        transformedProperties = allProperties.filter(p => p.listing_type === 'off-plan' && p.type !== 'Commercial');
        setSearchQuery('');
        
        // Cache all properties for faster navigation
        if (allProperties.length > 0) {
          setCachedProperties('uae', allProperties);
        }
      }
      
      setProperties(transformedProperties);
      setError(null);
    } catch (err: any) {
      setProperties([]);
      setError(err.message || 'Failed to load off-plan properties from API');
    } finally {
      setLoading(false);
    }
  }, [router.query]);

  // Load properties when router is ready or query changes
  useEffect(() => {
    if (router.isReady) {
      fetchProperties();
    }
  }, [router.isReady, fetchProperties]);

  // Memoize expensive computations
  const availableCities = useMemo(() => {
    if (properties.length > 0) {
      return Array.from(new Set(properties.map(p => p.city).filter(Boolean))).sort();
    }
    return [];
  }, [properties]);

  const cityCounts = useMemo(() => {
    return properties.reduce((acc, p) => {
      if (p.city) {
        acc[p.city] = (acc[p.city] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [properties]);

  const availableTypes = useMemo(() => {
    const allTypes: Property['type'][] = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio', 'Land', 'Farm', 'Factory'];
    
    if (properties.length > 0) {
      const existingTypes = new Set(properties.map(p => p.type));
      return allTypes.filter(type => existingTypes.has(type));
    }
    return allTypes;
  }, [properties]);

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    const allValues = new Set(['All', t('properties.page.all', 'All'), t('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', t('properties.page.allCities', 'All Areas'), t('propertyFilters.allCities', 'All Areas')]);

    const isAllFilter = (val: string) => allValues.has(val);
    const isAllCities = (val: string) => allCitiesValues.has(val);

    // Filter by main filter (type or featured)
    if (activeFilter === 'Featured') {
      filtered = filtered.filter(property => property.featured);
    } else if (!isAllFilter(activeFilter) && availableTypes.includes(activeFilter as Property['type'])) {
      filtered = filtered.filter(property => property.type === activeFilter);
    }

    // Filter by city
    if (!isAllCities(activeCityFilter)) {
      const normalizedCity = activeCityFilter.trim().toLowerCase();
      filtered = filtered.filter(property =>
        property.city && property.city.trim().toLowerCase() === normalizedCity
      );
    }

    // Filter by property type (buy/rent)
    if (!isAllFilter(activePropertyTypeFilter)) {
      const buyLabels = new Set(['Buy', 'buy', t('propertyFilters.propertyTypeOptions.buy', 'Buy')]);
      const rentLabels = new Set(['Rent', 'rent', t('propertyFilters.propertyTypeOptions.rent', 'Rent')]);
      
      let propertyTypeToFilter: string | null = null;
      if (buyLabels.has(activePropertyTypeFilter)) {
        propertyTypeToFilter = 'buy';
      } else if (rentLabels.has(activePropertyTypeFilter)) {
        propertyTypeToFilter = 'rent';
      }
      
      if (propertyTypeToFilter) {
        filtered = filtered.filter(property => property.property_type === propertyTypeToFilter);
      }
    }

    // Filter by status
    if (!isAllFilter(activeStatusFilter)) {
      let statusToFilter: string = activeStatusFilter;
      
      const soldLabels = new Set(['Sold', 'sold', t('propertyFilters.status.sold', 'Sold'), t('properties.page.statusOptions.sold', 'Sold')]);
      const approvedLabels = new Set(['Available', 'Approved', 'approved', t('propertyFilters.status.approved', 'Approved'), t('properties.page.statusOptions.approved', 'Available')]);
      const negotiableLabels = new Set(['Negotiable', 'negotiable', t('propertyFilters.status.negotiable', 'Negotiable'), t('properties.page.statusOptions.negotiable', 'Negotiable')]);
      
      if (soldLabels.has(activeStatusFilter)) {
        statusToFilter = 'sold';
      } else if (approvedLabels.has(activeStatusFilter)) {
        statusToFilter = 'approved';
      } else if (negotiableLabels.has(activeStatusFilter)) {
        statusToFilter = 'negotiable';
      }
      
      filtered = filtered.filter(property => property.status === statusToFilter);
    }

    // Filter by price range
    if (priceRange[0] > 0 || priceRange[1] > 0) {
      filtered = filtered.filter(property => {
        const price = parseInt(property.price.replace(/[€,AED]/g, '').replace(/[^0-9]/g, '')) || 0;
        const min = priceRange[0] || 0;
        const max = priceRange[1] || Infinity;
        return price >= min && price <= max;
      });
    }

    // Sort properties
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[€,AED]/g, '').replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[€,AED]/g, '').replace(/[^0-9]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[€,AED]/g, '').replace(/[^0-9]/g, '')) || 0;
          const priceB = parseInt(b.price.replace(/[€,AED]/g, '').replace(/[^0-9]/g, '')) || 0;
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
  }, [properties, activeFilter, activeCityFilter, activeStatusFilter, activePropertyTypeFilter, priceRange, sortBy, availableTypes, t]);

  // Use pagination hook
  const pagination = usePagination({
    items: filteredProperties,
    initialItemsPerPage: 12,
    dependencies: [activeFilter, activeCityFilter, activeStatusFilter, activePropertyTypeFilter, priceRange, sortBy, searchQuery]
  });

  const goToPage = useCallback((page: number) => {
    pagination.goToPage(page);
    document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pagination]);

  const clearFilters = useCallback(() => {
    setActiveFilter(t('propertyFilters.all', 'All'));
    setActiveTypeFilter(t('propertyFilters.all', 'All'));
    setActiveCityFilter(t('propertyFilters.allCities', 'All Areas'));
    setActiveStatusFilter(t('propertyFilters.all', 'All'));
    // Keep listing type locked to Off-Plan
    setActiveListingTypeFilter('Off-Plan');
    setActivePropertyTypeFilter(t('propertyFilters.all', 'All'));
    setPriceRange([0, 0]);
    setSortBy('featured');
    setSearchQuery('');
    router.push('/properties/off-plan', undefined, { shallow: true });
    pagination.resetToFirstPage();
  }, [pagination, t]);

  // Structured data for Off-Plan properties page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Off-Plan Properties in Dubai",
      "description": "Discover exclusive off-plan properties in Dubai from top developers. Flexible payment plans, early-bird pricing, and high capital appreciation potential.",
      "url": "https://rinoproperties.com/properties/off-plan",
      "inLanguage": "en",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://rinoproperties.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Properties",
            "item": "https://rinoproperties.com/properties"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Off-Plan",
            "item": "https://rinoproperties.com/properties/off-plan"
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Off-Plan Property Collection",
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
            "addressRegion": "Dubai",
            "addressCountry": "AE"
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
          "name": "What are off-plan properties in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Off-plan properties are real estate projects that are sold before construction is completed. Buyers purchase based on architectural plans and renderings, often at prices 10-30% lower than ready properties, with flexible payment plans spread over the construction period."
          }
        },
        {
          "@type": "Question",
          "name": "What are the benefits of buying off-plan in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Off-plan properties in Dubai offer lower entry prices (10-30% below market), flexible payment plans during construction, high capital appreciation potential, brand-new modern finishes, and developer incentives like post-handover payment plans and DLD fee waivers."
          }
        },
        {
          "@type": "Question",
          "name": "Which developers offer the best off-plan projects in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Top developers for off-plan projects in Dubai include Emaar Properties, DAMAC Properties, Binghatti Developers, Nakheel, Meraas, Sobha Realty, and Azizi Developments. Rino Properties has exclusive partnerships with many of these developers."
          }
        },
        {
          "@type": "Question",
          "name": "What payment plans are available for off-plan properties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Off-plan payment plans in Dubai typically include 60/40, 70/30, or 80/20 structures. Some developers offer post-handover payment plans of up to 3-5 years. Initial deposits usually range from 5-20% of the property value."
          }
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{t('offplan.head.title', 'Off-Plan Properties in Dubai 2026 | New Launches & Payment Plans')}</title>
        <meta name="description" content={t('offplan.head.description', 'Off-plan properties in Dubai 2026 — new project launches from Emaar, DAMAC, Binghatti, Sobha. 1% monthly payment plans, 10-30% below market price. Pre-launch access. Rino Properties — off-plan specialists.')} />
        <meta name="keywords" content="off-plan properties Dubai, off-plan projects Dubai 2026, new launch Dubai, off-plan apartments Dubai, off-plan villas Dubai, Dubai off-plan investment, off-plan payment plan Dubai, pre-launch properties Dubai, under construction Dubai, Emaar off-plan, DAMAC off-plan, Binghatti off-plan, Sobha properties, 1 percent payment plan Dubai, post-handover payment plan, off-plan ROI Dubai, best off-plan projects Dubai 2026, off-plan JVC, off-plan Dubai Marina, off-plan Downtown Dubai" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Off-Plan Properties in Dubai | New Developments & Projects" />
        <meta property="og:description" content="Exclusive off-plan properties in Dubai. 10-30% below market price. Flexible payment plans. Top developers." />
        <meta property="og:url" content="https://rinoproperties.com/properties/dubai/off-plan" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop" />
        <meta property="og:site_name" content="Rino Properties" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Off-Plan Properties in Dubai | Rino Properties" />
        <meta name="twitter:description" content="Exclusive off-plan properties in Dubai from top developers. Flexible payment plans." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rinoproperties.com/properties/dubai/off-plan" />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="en" href="https://rinoproperties.com/properties/dubai/off-plan" />
        <link rel="alternate" hrefLang="ar" href="https://rinoproperties.com/ar/properties/dubai/off-plan" />
        <link rel="alternate" hrefLang="x-default" href="https://rinoproperties.com/properties/dubai/off-plan" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai, United Arab Emirates" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />
        
        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
        
        {/* Enhanced Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Rino Properties - Dubai Off-Plan Specialist",
              "description": "Premier real estate agency specializing in off-plan properties in Dubai. Expert guidance for investing in new developments from top Dubai developers.",
              "url": "https://rinoproperties.com/properties/off-plan",
              "logo": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
              "image": "/images/dubai.webp",
              "areaServed": {
                "@type": "City",
                "name": "Dubai",
                "addressCountry": "AE"
              },
              "knowsAbout": [
                "Off-Plan Properties Dubai",
                "New Developments Dubai",
                "Pre-Launch Projects",
                "Flexible Payment Plans",
                "Dubai Real Estate Investment",
                "Emaar Properties",
                "DAMAC Properties",
                "Binghatti Developers"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dubai",
                "addressCountry": "AE"
              },
              "telephone": "+971 54 401 2269",
              "email": "khaled@rinoproperties.com"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://rinoproperties.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Properties",
                  "item": "https://rinoproperties.com/properties"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Off-Plan Properties",
                  "item": "https://rinoproperties.com/properties/off-plan"
                }
              ]
            })
          }}
        />
      </Head>

      <Layout 
        title={t('offplan.head.title', 'Off-Plan Properties in Dubai 2026 | New Launches & Payment Plans')}
        description={t('offplan.head.description', 'Off-plan properties in Dubai 2026 — new project launches from Emaar, DAMAC, Binghatti, Sobha. 1% monthly payment plans, 10-30% below market price. Pre-launch access. Rino Properties — off-plan specialists.')}
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
                availableCities={availableCities}
                cityCounts={cityCounts}
                country="UAE"
                sortBy={sortBy}
                setSortBy={setSortBy}
                hideListingType={true}
                hidePropertyType={true}
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
                    <h4 className="text-xs xs:text-sm font-medium text-blue-800">{t('offplan.searchResults.title', 'Search Results for:')}</h4>
                    <p className="text-sm xs:text-base text-blue-600">"{searchQuery}" {t('offplan.searchResults.inOffPlan', 'in Off-Plan Properties')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      router.push('/properties/off-plan', undefined, { shallow: true });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs xs:text-sm font-medium"
                  >
                    {t('offplan.searchResults.clearSearch', 'Clear Search')}
                  </button>
                </div>
              </div>
            )}
          

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                  {loading ? t('offplan.results.loading', 'Loading...') : `${filteredProperties.length} ${t('offplan.results.propertiesFound', 'Off-Plan Properties Found')}`}
                </h2>
                <p className="text-sm xs:text-base text-gray-600 font-light">
                  {!loading && (
                    <>
                      {searchQuery && `${t('offplan.results.searchResultsFor', 'Search results for')} "${searchQuery}" ${t('offplan.results.inOffPlan', 'in Off-Plan')}`}
                      {activeFilter !== 'All' && `${searchQuery ? ' • ' : ''}${t('offplan.results.filteredBy', 'Filtered by')}: ${activeFilter}`}
                      {activeCityFilter !== 'All Areas' && ` ${t('offplan.results.in', 'in')} ${activeCityFilter}`}
                      {usingFallback && (
                        <span className="ml-2 text-amber-600 font-medium">({t('offplan.results.demoData', 'Demo Data')})</span>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              {!loading && filteredProperties.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0">
                  <div className="text-xs xs:text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {t('offplan.results.showing', 'Showing')} {pagination.startIndex + 1}-{Math.min(pagination.endIndex, filteredProperties.length)} {t('offplan.results.of', 'of')} {filteredProperties.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs xs:text-sm">
                    <label htmlFor="itemsPerPage" className="text-gray-600 font-medium">
                      {t('offplan.pagination.itemsPerPage', 'Items per page:')}
                    </label>
                    <select
                      id="itemsPerPage"
                      className="border border-gray-300 rounded-md px-3 py-2 text-xs xs:text-sm bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F]"
                      value={pagination.itemsPerPage}
                      onChange={(e) => {
                        pagination.setItemsPerPage(Number(e.target.value));
                      }}
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
                  <p className="text-sm xs:text-base text-gray-600">{t('offplan.loading.message', 'Loading off-plan properties...')}</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="text-red-600 mb-2 text-lg xs:text-xl">⚠️ {t('offplan.error.connectionError', 'Connection Error')}</div>
                  <p className="text-sm xs:text-base text-gray-700 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProperties(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm xs:text-base"
                  >
                    {t('offplan.error.tryAgain', 'Try Again')}
                  </button>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {!loading && filteredProperties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pagination.currentItems.map((property, index) => (
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
              t={(key, fallback) => t(`offplan.${key}`, fallback)}
            />

            {/* No Properties Found */}
            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🏗️</div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-light text-gray-900 mb-4">{t('offplan.noProperties.title', 'No Off-Plan Properties Found')}</h3>
                <p className="text-sm xs:text-base text-gray-600 mb-8 font-light">
                  {t('offplan.noProperties.message', 'We couldn\'t find any off-plan properties matching your current search criteria. Try adjusting your filters.')}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-8 py-3 font-medium hover:from-[#C4903A] hover:to-[#D69F3F] transition-all duration-300 hover:scale-105 text-sm xs:text-base"
                >
                  {t('offplan.noProperties.clearFilters', 'Clear All Filters')}
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
                backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop')"
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
              {t('offplan.cta.title', 'Invest Early in Dubai\'s Finest Developments')}
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">
              {t('offplan.cta.description', 'Get exclusive access to off-plan projects with flexible payment plans and below-market pricing. Our specialists will help you find the perfect investment opportunity.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4  font-light hover:bg-white transition-all duration-300 text-sm xs:text-base"
              >
                {t('offplan.cta.contactTeam', 'Contact Our Team')}
              </a>
              <a
                href="tel:+97143212433"
                className="border-2 border-white/80 text-white px-8 py-4  font-light hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-sm xs:text-base"
              >
                {t('offplan.cta.callPhone', 'Call: +971 43 21 2433')}
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

export default OffPlanPropertiesPage;

// Ensure router is fully initialized during SSR to prevent hydration mismatches
export const getServerSideProps = async () => {
  return { props: {} };
};
