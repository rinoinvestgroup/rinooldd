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

const SpainPropertiesPage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  // Enable scroll restoration tracking for navigation
  useScrollRestoration();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
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
    // Only try to restore scroll if we have data and not loading
    const hasData = properties.length > 0 || error;
    if (!loading && !scrollRestored && router.isReady && hasData) {
      // Mark that data has been loaded
      dataLoadedRef.current = true;
      
      // Content is loaded, try to restore scroll position
      const currentPath = router.asPath;
      const scrollKey = `scroll_position_${currentPath}`;
      
      const attemptRestore = (attempts: number, delay: number) => {
        if (attempts <= 0) {
          setScrollRestored(true);
          return;
        }
        
        try {
          // Try sessionStorage first, then localStorage for persistence across refresh
          let saved = sessionStorage.getItem(scrollKey);
          if (!saved) {
            saved = localStorage.getItem(scrollKey);
          }
          
          if (saved) {
            const { y, timestamp } = JSON.parse(saved);
            const twoHours = 2 * 60 * 60 * 1000;
            
            if (Date.now() - timestamp < twoHours && y > 0) {
              window.scrollTo({ top: y, left: 0, behavior: 'instant' });
              
              // Verify scroll worked, retry with increasing delay if not
              setTimeout(() => {
                const diff = Math.abs(window.scrollY - y);
                if (diff > 50 && attempts > 1) {
                  // Content may still be loading, retry with longer delay
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
      
      // Start immediately with more attempts and progressive delays
      const timer = setTimeout(() => attemptRestore(15, 50), 10);
      return () => clearTimeout(timer);
    }
  }, [loading, scrollRestored, router.isReady, router.asPath, properties.length, error]);

  // Track whether filters were set from URL (to prevent language effect from resetting them)
  const filtersFromUrlRef = useRef(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (!router.isReady || filtersInitialized) return;
    
    const { filter, city, status, listingType, sort } = router.query;
    // Also handle listing_type (snake_case) from SearchPopup URLs
    const listingTypeSnake = router.query.listing_type;
    
    if (filter && typeof filter === 'string') {
      setActiveFilter(filter);
    }
    if (city && typeof city === 'string') {
      setActiveCityFilter(city);
    }
    if (status && typeof status === 'string') {
      setActiveStatusFilter(status);
    }
    
    // Handle listingType (camelCase from filter URL) or listing_type (snake_case from search)
    const rawListingType = (listingType && typeof listingType === 'string') ? listingType
      : (listingTypeSnake && typeof listingTypeSnake === 'string') ? listingTypeSnake
      : null;
    if (rawListingType) {
      const listingTypeMap: Record<string, string> = {
        'Ready': 'Ready to Move',
        'ready': 'Ready to Move',
        'Ready to Move': 'Ready to Move',
        'ready-to-move': 'Ready to Move',
        'Off-Plan': 'Off-Plan',
        'off-plan': 'Off-Plan',
        'Off Plan': 'Off-Plan',
        'OffPlan': 'Off-Plan',
        'offplan': 'Off-Plan',
      };
      setActiveListingTypeFilter(listingTypeMap[rawListingType] || rawListingType);
    }
    if (sort && typeof sort === 'string') {
      setSortBy(sort);
    }
    
    // Handle propertyType from URL
    const { propertyType } = router.query;
    if (propertyType && typeof propertyType === 'string') {
      const propertyTypeMap: Record<string, string> = {
        'buy': 'buy',
        'rent': 'rent',
        'Buy': 'buy',
        'Rent': 'rent',
      };
      setActivePropertyTypeFilter(propertyTypeMap[propertyType] || propertyType);
    }
    
    // Mark if any URL filters were applied (to prevent language effect from resetting them)
    const hasUrlFilters = !!(filter || city || status || rawListingType || sort || propertyType);
    if (hasUrlFilters) {
      filtersFromUrlRef.current = true;
    }
    
    setFiltersInitialized(true);
  }, [router.isReady, router.query, filtersInitialized]);

  // Update URL when filters change (after initialization)
  useEffect(() => {
    if (!router.isReady || !filtersInitialized) return;
    
    // Use tRef to get latest translations without t in the dependency array.
    // This prevents the URL from being updated with translated default values
    // during language switches.
    const currentT = tRef.current;
    // Check both namespaces since filter values could come from either
    const allValues = new Set(['All', currentT('properties.page.all', 'All'), currentT('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', currentT('properties.page.allCities', 'All Areas'), currentT('propertyFilters.allCities', 'All Areas')]);
    const allTypesValues = new Set(['All Types', currentT('properties.page.allTypes', 'All Types'), currentT('propertyFilters.allTypes', 'All Types')]);
    
    const query: Record<string, string> = {};
    
    // Only add non-default values to URL
    if (activeFilter && !allValues.has(activeFilter)) {
      query.filter = activeFilter;
    }
    if (activeCityFilter && !allCitiesValues.has(activeCityFilter)) {
      query.city = activeCityFilter;
    }
    if (activeStatusFilter && !allValues.has(activeStatusFilter)) {
      query.status = activeStatusFilter;
    }
    if (activeListingTypeFilter && !allTypesValues.has(activeListingTypeFilter)) {
      query.listingType = activeListingTypeFilter;
    }
    if (activePropertyTypeFilter && !allValues.has(activePropertyTypeFilter)) {
      query.propertyType = activePropertyTypeFilter.toLowerCase();
    }
    if (sortBy && sortBy !== 'featured') {
      query.sort = sortBy;
    }
    
    // Preserve page from pagination hook
    const currentPage = router.query.page;
    if (currentPage && typeof currentPage === 'string') {
      query.page = currentPage;
    }
    
    // Check if query actually changed to avoid unnecessary updates
    const newQueryString = JSON.stringify(query);
    if (prevFiltersRef.current === newQueryString) return;
    prevFiltersRef.current = newQueryString;
    
    router.replace(
      { pathname: router.pathname, query },
      undefined,
      { shallow: true, scroll: false }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, filtersInitialized, activeFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, sortBy]);

  // Track previous translated defaults to detect when translations actually load
  const prevAllValueRef = useRef(t('propertyFilters.all', 'All'));

  // Update filter states when language changes or translations load
  // This handles the race condition where language changes before translations are fetched,
  // and works for ALL language switch directions (EN→ES, ES→EN, ES→AR, etc.)
  useEffect(() => {
    // Use propertyFilters.* namespace to match what PropertyFilters component emits
    const allValue = t('propertyFilters.all', 'All');
    const allCitiesValue = t('propertyFilters.allCities', 'All Areas');
    const allTypesValue = t('propertyFilters.allTypes', 'All Types');
    
    const languageChanged = prevLanguageRef.current !== language;
    // Detect when translations actually load (the translated "all" value changes)
    const translationsChanged = prevAllValueRef.current !== allValue;
    
    if (languageChanged) {
      // User explicitly changed the language — always reset filters
      prevLanguageRef.current = language;
      prevAllValueRef.current = allValue;
      filtersFromUrlRef.current = false;
      
      setActiveFilter(allValue);
      setActiveTypeFilter(allValue);
      setActiveCityFilter(allCitiesValue);
      setActiveStatusFilter(allValue);
      setActiveListingTypeFilter(allTypesValue);
      setActivePropertyTypeFilter('All');
    } else if (translationsChanged) {
      // Translations loaded asynchronously
      prevAllValueRef.current = allValue;
      
      if (!filtersFromUrlRef.current) {
        // No URL-derived filters — safe to reset to translated defaults
        setActiveFilter(allValue);
        setActiveTypeFilter(allValue);
        setActiveCityFilter(allCitiesValue);
        setActiveStatusFilter(allValue);
        setActiveListingTypeFilter(allTypesValue);
        setActivePropertyTypeFilter('All');
      }
      // If filters came from URL, preserve them (don't reset)
    }
  }, [language, t]);

  // Fetch properties from API with caching
  const fetchProperties = useCallback(async (forceRefresh = false) => {
    // Check for search parameters in URL
    const searchFilters = parseSearchParams(router.query);
    const hasSearchFilters = !!(searchFilters.query || searchFilters.listing_type);
    
    // Try to use cached data if no search filters and not forcing refresh
    if (!hasSearchFilters && !forceRefresh) {
      const cachedData = getCachedProperties('spain');
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
        // Use search endpoint if there are search parameters
        const searchParams = {
          ...searchFilters,
          category: 'spain', // Always filter by Spain for this page
          page: 1,
          limit: 200
        };
        
        transformedProperties = await PropertiesApiService.searchProperties(searchParams);
        
        // Set search query for display
        if (searchFilters.query) {
          setSearchQuery(searchFilters.query);
        }
        
        // Set filters based on URL params
        if (searchFilters.listing_type === 'ready-to-move') {
          setActiveListingTypeFilter(tRef.current('propertyFilters.listingType.readyToMove', 'Ready to Move'));
        } else if (searchFilters.listing_type === 'off-plan') {
          setActiveListingTypeFilter(tRef.current('propertyFilters.listingType.offPlan', 'Off-Plan'));
        }
        
      } else {
        // Get all Spain properties if no search parameters
        transformedProperties = await PropertiesApiService.getPropertiesByCategory('spain');
        setSearchQuery('');
        
        // Cache the properties for faster back navigation
        if (transformedProperties.length > 0) {
          setCachedProperties('spain', transformedProperties);
        }
      }
      
      setProperties(transformedProperties);
      setError(null);
    } catch (err: any) {
      setProperties([]); // Set empty array to show no properties
      setError(err.message || 'Failed to load Spain properties from API');
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
    return []; // No fallback - return empty array when no API data
  }, [properties]);

  // Calculate property counts per city for sorting
  const cityCounts = useMemo(() => {
    return properties.reduce((acc, p) => {
      if (p.city) {
        acc[p.city] = (acc[p.city] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [properties]);

  const availableTypes = useMemo(() => {
    // All possible property types (excluding Penthouse, Townhouse, Studio)
    const allTypes: Property['type'][] = ['Villa', 'Apartment', 'Commercial', 'Land', 'Farm', 'Factory'];
    
    if (properties.length > 0) {
      // Only show types that actually exist in current properties
      const existingTypes = new Set(properties.map(p => p.type));
      return allTypes.filter(type => existingTypes.has(type));
    }
    return allTypes;
  }, [properties]);

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Create mappings for translated values from both namespaces
    // PropertyFilters uses propertyFilters.* namespace, pages use properties.page.* namespace
    const allValues = new Set(['All', t('properties.page.all', 'All'), t('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', t('properties.page.allCities', 'All Areas'), t('propertyFilters.allCities', 'All Areas')]);
    const allTypesValues = new Set(['All Types', t('properties.page.allTypes', 'All Types'), t('propertyFilters.allTypes', 'All Types')]);

    // Helper to check if a value means "all" (matches any translated or English default)
    const isAllFilter = (val: string) => allValues.has(val);
    const isAllCities = (val: string) => allCitiesValues.has(val);
    const isAllTypes = (val: string) => allTypesValues.has(val);

    // Filter by main filter (type or featured)
    if (activeFilter === 'Featured') {
      filtered = filtered.filter(property => property.featured);
    } else if (!isAllFilter(activeFilter) && availableTypes.includes(activeFilter as Property['type'])) {
      filtered = filtered.filter(property => property.type === activeFilter);
    }

    // Filter by city
    if (!isAllCities(activeCityFilter)) {
      filtered = filtered.filter(property => property.city === activeCityFilter);
    }

    // Filter by status - map translated labels back to enum values
    if (!isAllFilter(activeStatusFilter)) {
      let statusToFilter: string = activeStatusFilter;
      
      // Check against both namespaces (propertyFilters.status.* and properties.page.statusOptions.*)
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

    // Filter by listing type - map translated labels back to enum values
    if (!isAllTypes(activeListingTypeFilter)) {
      
      // Build mapping from both namespaces (propertyFilters.listingType.* and properties.page.listingTypeOptions.*)
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
      if (offPlanLabels.has(activeListingTypeFilter)) {
        mappedListingType = 'off-plan';
      } else if (readyLabels.has(activeListingTypeFilter)) {
        mappedListingType = 'ready-to-move';
      }
    
      if (mappedListingType) {
        filtered = filtered.filter(property => property.listing_type === mappedListingType);
      }
    }

    // Filter by property type (buy/rent)
    if (activePropertyTypeFilter && !isAllFilter(activePropertyTypeFilter)) {
      const buyLabels = new Set(['Buy', 'buy', t('propertyFilters.propertyType.buy', 'Buy')]);
      const rentLabels = new Set(['Rent', 'rent', t('propertyFilters.propertyType.rent', 'Rent')]);

      let mappedPropertyType: string | null = null;
      if (buyLabels.has(activePropertyTypeFilter)) {
        mappedPropertyType = 'buy';
      } else if (rentLabels.has(activePropertyTypeFilter)) {
        mappedPropertyType = 'rent';
      }

      if (mappedPropertyType) {
        filtered = filtered.filter(property => property.property_type === mappedPropertyType);
      }
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
  }, [properties, activeFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, priceRange, sortBy, availableTypes, t]);

  // Use pagination hook
  const pagination = usePagination({
    items: filteredProperties,
    initialItemsPerPage: 12,
    dependencies: [activeFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, priceRange, sortBy, searchQuery]
  });

  // Pagination handlers with scroll
  const goToPage = useCallback((page: number) => {
    pagination.goToPage(page);
    // Scroll to properties section when changing pages
    document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pagination]);

  // Memoized clear filters function for better performance
  const clearFilters = useCallback(() => {
    setActiveFilter(t('propertyFilters.all', 'All'));
    setActiveTypeFilter(t('propertyFilters.all', 'All'));
    setActiveCityFilter(t('propertyFilters.allCities', 'All Areas'));
    setActiveStatusFilter(t('propertyFilters.all', 'All'));
    setActiveListingTypeFilter(t('propertyFilters.allTypes', 'All Types'));
    setActivePropertyTypeFilter('All');
    setPriceRange([0, 0]);
    setSortBy('featured');
    setSearchQuery('');
    router.push('/properties/spain', undefined, { shallow: true });
    pagination.resetToFirstPage(); // Reset pagination when clearing filters
  }, [pagination, t]);

  // Structured data for Spain properties page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Premium Spain Properties for Sale & Rent",
      "description": "Discover luxury properties in Spain: Madrid, Barcelona, Marbella, Valencia. Expert real estate guidance from Rino Properties.",
      "url": "https://rinoproperties.com/properties/spain",
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
            "name": "Spain",
            "item": "https://rinoproperties.com/properties/spain"
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Spain Property Collection",
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
            "addressRegion": property.city,
            "addressCountry": "ES"
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
          "name": "What are the best cities to buy property in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best cities for Spain property investment include Madrid (capital city opportunities), Barcelona (Mediterranean lifestyle), Marbella (luxury Costa del Sol), Valencia (affordable coastal living), and Malaga (growing market). Each offers unique investment opportunities and lifestyle benefits."
          }
        },
        {
          "@type": "Question",
          "name": "How much does property cost in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spain property prices vary by location. Madrid apartments start from €200K, Barcelona from €250K, Marbella luxury villas from €500K+, Valencia from €150K. Coastal properties and city centers command premium prices, while inland areas offer excellent value."
          }
        },
        {
          "@type": "Question",
          "name": "Can foreigners buy property in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, foreigners can freely buy property in Spain with no restrictions. The process involves obtaining a NIE (foreigner identification number), opening a Spanish bank account, and completing the purchase through a notary. Rino Properties provides full legal support throughout the process."
          }
        },
        {
          "@type": "Question",
          "name": "What are the rental yields in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spain offers attractive rental yields: Madrid 4-6%, Barcelona 3-5%, Marbella 4-7%, Valencia 5-7%. Tourist areas and major cities provide strong rental demand, especially for short-term vacation rentals with potential yields up to 8-10%."
          }
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{t('spain.head.title', 'Properties in Spain for Sale | Madrid, Marbella, Barcelona, Costa del Sol')}</title>
        <meta name="description" content={t('spain.head.description', 'Buy property in Spain — 200+ villas, apartments & penthouses in Madrid, Marbella, Barcelona, Costa del Sol, Valencia. 4-7% ROI. NIE & legal support. Rino Properties — licensed Spanish real estate agency.')} />
        <meta name="keywords" content="properties in Spain, buy property Spain, apartments for sale Spain, villas for sale Spain, Madrid properties, Barcelona apartments, Marbella luxury villas, Costa del Sol property, Valencia real estate, Spain property investment, buy house Spain, Spanish real estate 2026, property prices Spain, best areas to buy Spain, beachfront property Spain, new build Spain, off-plan Spain, resale property Spain, NIE Spain property, property tax Spain, rental yield Spain, retirement property Spain, holiday home Spain, Costa Blanca property, Malaga property, Rino Properties Spain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Properties in Spain for Sale | Madrid, Barcelona, Marbella, Valencia" />
        <meta property="og:description" content="200+ luxury Spain properties. 4-7% ROI. Madrid, Barcelona, Marbella, Valencia. NIE & legal support. Expert guidance." />
        <meta property="og:url" content="https://rinoproperties.com/properties/spain" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=630&fit=crop" />
        <meta property="og:site_name" content="Rino Properties" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spain Properties for Sale | Madrid, Barcelona, Marbella" />
        <meta name="twitter:description" content="200+ luxury properties in Spain's best locations. 4-7% ROI. NIE & legal support. Expert guidance." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=630&fit=crop" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rinoproperties.com/properties/spain" />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="en" href="https://rinoproperties.com/properties/spain" />
        <link rel="alternate" hrefLang="es" href="https://rinoproperties.com/es/properties/spain" />
        <link rel="alternate" hrefLang="x-default" href="https://rinoproperties.com/properties/spain" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="ES" />
        <meta name="geo.placename" content="Madrid, Barcelona, Marbella, Valencia, Spain" />
        <meta name="geo.position" content="40.4168;-3.7038" />
        <meta name="ICBM" content="40.4168, -3.7038" />
        
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
              "name": "Rino Properties - Spain Real Estate",
              "description": "Premier real estate agency specializing in properties in Spain. Expert guidance for buying, selling and renting properties in Madrid, Barcelona, Marbella, and Valencia.",
              "url": "https://rinoproperties.com/properties/spain",
              "logo": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
              "image": "https://images.unsplash.com/photo-1613977257363-707ba9348227",
              "areaServed": {
                "@type": "Country",
                "name": "Spain",
                "addressCountry": "ES"
              },
              "knowsAbout": [
                "Properties in Spain",
                "Spanish Real Estate",
                "Madrid Properties",
                "Barcelona Properties",
                "Marbella Properties",
                "Valencia Properties",
                "Luxury Villas Spain",
                "Apartments in Spain"
              ],
              "offers": {
                "@type": "Offer",
                "category": "Real Estate Services",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Spain Property Search and Purchase Assistance",
                  "description": "Comprehensive property search, buying, selling and rental services in Spain"
                }
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ES"
              },
              "telephone": "+34 635 955 137",
              "email": "ask@rinoproperties.com"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Properties in Spain for Sale and Rent",
              "description": "Browse luxury properties in Spain including villas and apartments in Madrid, Barcelona, Marbella, Valencia and other prime Spanish locations.",
              "url": "https://rinoproperties.com/properties/spain",
              "isPartOf": {
                "@type": "WebSite",
                "name": "Rino Properties",
                "url": "https://rinoproperties.com"
              },
              "about": {
                "@type": "Place",
                "name": "Spain",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "ES"
                }
              }
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
                  "name": "Properties in Spain",
                  "item": "https://rinoproperties.com/properties/spain"
                }
              ]
            })
          }}
        />
      </Head>

      <Layout 
        title={t('spain.head.title', 'Properties in Spain for Sale | Madrid, Marbella, Barcelona, Costa del Sol')}
        description={t('spain.head.description', 'Buy property in Spain — 200+ villas, apartments & penthouses in Madrid, Marbella, Barcelona, Costa del Sol, Valencia. 4-7% ROI. NIE & legal support. Rino Properties — licensed Spanish real estate agency.')}
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
                hideListingType={false}
                hidePropertyType={false}
              />
              </div>
            </div>
          </section>
          
        {/* Properties Section */}
        <section id="properties-section" className="relative py-8 overflow-hidden bg-white min-h-screen">
          {/* Ensure white background */}
          <div className="absolute inset-0 bg-white z-0"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
            {/* Page Introduction with Keywords */}
           
            {/* Search Results Info */}
            {searchQuery && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs xs:text-sm font-medium text-blue-800">{t('spain.searchResults.title', 'Search Results for:')}</h3>
                    <p className="text-sm xs:text-base text-blue-600">"{searchQuery}" {t('spain.searchResults.inSpain', 'in Spain')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      router.push('/properties/spain', undefined, { shallow: true });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs xs:text-sm font-medium"
                  >
                    {t('spain.searchResults.clearSearch', 'Clear Search')}
                  </button>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                  {loading ? t('spain.results.loading', 'Loading Spain Properties...') : `${filteredProperties.length} Spain ${t('spain.results.propertiesFound', 'Properties Found')}`}
                </h2>
                <p className="text-sm xs:text-base text-gray-600 font-light">
                  {!loading && !error && (
                    <>
                      {searchQuery && `${t('spain.results.searchResultsFor', 'Search results for')} "${searchQuery}" ${t('spain.results.inSpain', 'in Spain')}`}
                      {activeFilter !== 'All' && `${searchQuery ? ' • ' : ''}${t('spain.results.filteredBy', 'Filtered by')}: ${activeFilter}`}
                      {activeCityFilter !== 'All Areas' && ` ${t('spain.results.in', 'in')} ${activeCityFilter}`}
                      {filteredProperties.length > 0 && (
                        <span className="block mt-1">
                          {t('spain.results.showing', 'Showing')} {pagination.startIndex + 1}-{Math.min(pagination.endIndex, filteredProperties.length)} {t('spain.results.of', 'of')} {filteredProperties.length}
                        </span>
                      )}
                    </>
                  )}
                  {error && !loading && (
                    <span className="text-red-600 font-medium">{t('spain.results.errorMessage', 'Unable to load properties from API')}</span>
                  )}
                </p>
              </div>
              
              {/* Items per page selector */}
              {!loading && !error && filteredProperties.length > 0 && (
                <div className="mt-4 sm:mt-0 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="items-per-page" className="text-sm text-gray-600">
                      {t('spain.pagination.itemsPerPage', 'Items per page:')}
                    </label>
                    <select
                      id="items-per-page"
                      value={pagination.itemsPerPage}
                      onChange={(e) => {
                        pagination.setItemsPerPage(Number(e.target.value));
                      }}
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
                  <p className="text-sm xs:text-base text-gray-600">{t('spain.loading.message', 'Loading Spain properties...')}</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg mx-auto">
                  <div className="text-6xl mb-4">🚫</div>
                  <div className="text-red-600 mb-2 text-lg xs:text-xl font-semibold">{t('spain.error.connectionFailed', 'API Connection Failed')}</div>
                  <p className="text-sm xs:text-base text-gray-700 mb-4">{t('spain.error.unableToFetch', 'Unable to fetch properties from the server.')}</p>
                  <p className="text-xs xs:text-sm text-gray-600 mb-6">{error}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => fetchProperties(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm xs:text-base"
                    >
                      🔄 {t('spain.error.retryConnection', 'Retry Connection')}
                    </button>
                    <a
                      href="/contact"
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm xs:text-base"
                    >
                      📞 {t('spain.error.contactSupport', 'Contact Support')}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Properties Grid Section */}
            {!loading && filteredProperties.length > 0 && (
              <>
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pagination.currentItems.map((property: Property, index: number) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      index={pagination.startIndex + index} // Adjust index for pagination
                    />
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={filteredProperties.length}
              onPageChange={goToPage}
              onItemsPerPageChange={pagination.setItemsPerPage}
              showItemsPerPage={false} // Already shown in header
              showQuickJump={true}
              className="mt-12"
              t={(key: string, fallback: string) => t(`spain.${key}`, fallback)}
            />

            {/* No Properties Found */}
            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                  {t('spain.noProperties.title', 'No Spain Properties Match Your Search')}
                </h3>
                <p className="text-sm xs:text-base text-gray-600 mb-8 font-light">
                  {t('spain.noProperties.message', 'We couldn\'t find any properties matching your current search criteria. Try adjusting your filters.')}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-8 py-3 font-medium hover:from-[#C4903A] hover:to-[#D69F3F] transition-all duration-300 hover:scale-105 hover: text-sm xs:text-base"
                >
                  {t('spain.noProperties.clearFilters', 'Clear All Filters')}
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
                backgroundImage: "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&h=1080&fit=crop')"
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6">
              {t('spain.cta.title', 'Buy Properties in Spain - Contact Our Experts')}
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">
              {t('spain.cta.description', 'Our expert team is here to help you navigate the Spanish property market and find the perfect investment or home.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4 font-light hover:bg-white transition-all duration-300 text-sm xs:text-base"
              >
                {t('spain.cta.contactExperts', 'Contact Our Experts')}
              </a>
              <a
                href="tel:+34635955137"
                className="border-2 border-white/80 text-white px-8 py-4 font-light hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-sm xs:text-base"
              >
                {t('spain.cta.callPhone', 'Call: +34 635 955 137')}
              </a>
            </div>
          </div>
        </section>

        </div>
      </Layout>

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
    </>
  );
};

export default SpainPropertiesPage;
