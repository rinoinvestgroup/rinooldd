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

const ReadyToMovePropertiesPage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  useScrollRestoration();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeCityFilter, setActiveCityFilter] = useState('All Areas');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeListingTypeFilter, setActiveListingTypeFilter] = useState('All Types');
  const [activePropertyTypeFilter, setActivePropertyTypeFilter] = useState('Buy');
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

  // Initialize filters from URL on mount
  useEffect(() => {
    if (!router.isReady || filtersInitialized) return;
    
    const { filter, city, status, listingType, sort } = router.query;
    
    if (filter && typeof filter === 'string') {
      setActiveFilter(filter);
    }
    if (city && typeof city === 'string') {
      setActiveCityFilter(city);
    }
    if (status && typeof status === 'string') {
      setActiveStatusFilter(status);
    }
    if (listingType && typeof listingType === 'string') {
      const listingTypeMap: Record<string, string> = {
        'Ready': 'Ready to Move',
        'ready': 'Ready to Move',
        'Off-Plan': 'Off-Plan',
        'off-plan': 'Off-Plan',
        'OffPlan': 'Off-Plan',
        'offplan': 'Off-Plan',
      };
      setActiveListingTypeFilter(listingTypeMap[listingType] || listingType);
    }
    if (sort && typeof sort === 'string') {
      setSortBy(sort);
    }
    
    setFiltersInitialized(true);
  }, [router.isReady, router.query, filtersInitialized]);

  // Update URL when filters change
  useEffect(() => {
    if (!router.isReady || !filtersInitialized) return;
    
    const currentT = tRef.current;
    const allValues = new Set(['All', currentT('properties.page.all', 'All'), currentT('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', currentT('properties.page.allCities', 'All Areas'), currentT('propertyFilters.allCities', 'All Areas')]);
    const allTypesValues = new Set(['All Types', currentT('properties.page.allTypes', 'All Types'), currentT('propertyFilters.allTypes', 'All Types')]);
    
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
    if (activeListingTypeFilter && !allTypesValues.has(activeListingTypeFilter)) {
      query.listingType = activeListingTypeFilter;
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
  }, [router.isReady, filtersInitialized, activeFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, sortBy]);

  const prevAllValueRef = useRef(t('propertyFilters.all', 'All'));

  useEffect(() => {
    const allValue = t('propertyFilters.all', 'All');
    const allCitiesValue = t('propertyFilters.allCities', 'All Areas');
    const allTypesValue = t('propertyFilters.allTypes', 'All Types');
    
    const languageChanged = prevLanguageRef.current !== language;
    const translationsChanged = prevAllValueRef.current !== allValue;
    
    if (languageChanged || translationsChanged) {
      prevLanguageRef.current = language;
      prevAllValueRef.current = allValue;
      
      setActiveFilter(allValue);
      setActiveTypeFilter(allValue);
      setActiveCityFilter(allCitiesValue);
      setActiveStatusFilter(allValue);
      setActiveListingTypeFilter(allTypesValue);
      // Keep property type locked to Buy
      setActivePropertyTypeFilter('Buy');
    }
  }, [language, t]);

  // Fetch properties from API with caching
  const fetchProperties = useCallback(async (forceRefresh = false) => {
    const searchFilters = parseSearchParams(router.query);
    const hasSearchFilters = !!(searchFilters.query);
    
    if (!hasSearchFilters && !forceRefresh) {
      const cachedData = getCachedProperties('spain');
      if (cachedData && cachedData.length > 0) {
        // Filter cached data for ready-to-move only (exclude commercial)
        const buyProperties = cachedData.filter(p => p.listing_type === 'ready-to-move' && p.type !== 'Commercial');
        setProperties(buyProperties);
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
          category: 'spain',
          page: 1,
          limit: 200
        };
        
        transformedProperties = await PropertiesApiService.searchProperties(searchParams);
        // Filter for ready-to-move only (exclude commercial)
        transformedProperties = transformedProperties.filter(p => p.listing_type === 'ready-to-move' && p.type !== 'Commercial');
        
        if (searchFilters.query) {
          setSearchQuery(searchFilters.query);
        }
        
        if (searchFilters.listing_type === 'ready-to-move') {
          setActiveListingTypeFilter('Ready to Move');
        } else if (searchFilters.listing_type === 'off-plan') {
          setActiveListingTypeFilter('Off-Plan');
        }
      } else {
        // Get all Spain properties and filter for ready-to-move
        const allProperties = await PropertiesApiService.getPropertiesByCategory('spain');
        transformedProperties = allProperties.filter(p => p.listing_type === 'ready-to-move' && p.type !== 'Commercial');
        setSearchQuery('');
        
        if (allProperties.length > 0) {
          setCachedProperties('spain', allProperties);
        }
      }
      
      setProperties(transformedProperties);
      setError(null);
    } catch (err: any) {
      setProperties([]);
      setError(err.message || 'Failed to load Spain ready to move properties from API');
    } finally {
      setLoading(false);
    }
  }, [router.query]);

  useEffect(() => {
    if (router.isReady) {
      fetchProperties();
    }
  }, [router.isReady, fetchProperties]);

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
    const allTypesValues = new Set(['All Types', t('properties.page.allTypes', 'All Types'), t('propertyFilters.allTypes', 'All Types')]);

    const isAllFilter = (val: string) => allValues.has(val);
    const isAllCities = (val: string) => allCitiesValues.has(val);
    const isAllTypes = (val: string) => allTypesValues.has(val);

    if (activeFilter === 'Featured') {
      filtered = filtered.filter(property => property.featured);
    } else if (!isAllFilter(activeFilter) && availableTypes.includes(activeFilter as Property['type'])) {
      filtered = filtered.filter(property => property.type === activeFilter);
    }

    if (!isAllCities(activeCityFilter)) {
      const normalizedCity = activeCityFilter.trim().toLowerCase();
      filtered = filtered.filter(property =>
        property.city && property.city.trim().toLowerCase() === normalizedCity
      );
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

    // Filter by listing type
    if (!isAllTypes(activeListingTypeFilter)) {
      const offPlanLabels = new Set([
        'Off-Plan', 'Off Plan', 'off-plan', 'OffPlan', 'Offplan', 'offplan',
        t('propertyFilters.listingType.offPlan', 'Off-Plan'),
        t('properties.page.listingTypeOptions.offPlan', 'Off Plan')
      ]);
      const readyLabels = new Set([
        'Ready to Move', 'ready-to-move', 'Ready', 'ready',
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
  }, [properties, activeFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, priceRange, sortBy, availableTypes, t]);

  const pagination = usePagination({
    items: filteredProperties,
    initialItemsPerPage: 12,
    dependencies: [activeFilter, activeCityFilter, activeStatusFilter, activeListingTypeFilter, priceRange, sortBy, searchQuery]
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
    setActiveListingTypeFilter(t('propertyFilters.allTypes', 'All Types'));
    // Keep property type locked to Buy
    setActivePropertyTypeFilter('Buy');
    setPriceRange([0, 0]);
    setSortBy('featured');
    setSearchQuery('');
    router.push('/properties/spain/ready-to-move', undefined, { shallow: true });
    pagination.resetToFirstPage();
  }, [pagination, t]);

  // Structured data for Ready to Move properties page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Ready to Move Properties in Spain",
      "description": "Browse ready to move properties in Spain. Apartments, villas, penthouses & townhouses for sale in Marbella, Madrid, Barcelona and more.",
      "url": "https://rinoproperties.com/properties/spain/ready-to-move",
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
            "name": "Ready to Move",
            "item": "https://rinoproperties.com/properties/spain/ready-to-move"
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Ready to Move Property Collection",
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
            "addressRegion": "Spain",
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
          "name": "What are ready to move properties in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ready to move properties in Spain are completed residential units that are available for immediate occupancy. Unlike off-plan properties, these homes are fully constructed, inspected, and ready for handover. You can move in right after completing the purchase process."
          }
        },
        {
          "@type": "Question",
          "name": "What are the advantages of buying ready to move properties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ready to move properties offer immediate occupancy, no construction delays, ability to physically inspect the property before purchase, immediate rental income potential, established communities with existing amenities, and clear title deeds for faster transactions."
          }
        },
        {
          "@type": "Question",
          "name": "Can foreigners buy ready to move property in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, foreigners can buy property in Spain. Popular areas include Marbella, Madrid, Barcelona, Malaga, and the Costa del Sol. Rino Properties can guide you through the entire purchase process including NIE and legal requirements."
          }
        },
        {
          "@type": "Question",
          "name": "How long does the handover process take for ready properties in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For ready to move properties in Spain, the handover process typically takes 4-8 weeks. This includes document verification, notary procedures, and registration at the Spanish Property Registry. Rino Properties will guide you through the entire process."
          }
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{t('readyToMove.spain.head.title', 'Ready to Move Properties in Spain | Buy & Move In Today')}</title>
        <meta name="description" content={t('readyToMove.spain.head.description', 'Ready-to-move properties in Spain — key-ready apartments, villas & penthouses in Marbella, Madrid, Barcelona, Costa del Sol. Immediate occupancy. Legal support included. Rino Properties.')} />
        <meta name="keywords" content="ready to move properties Spain, key ready homes Spain, completed properties Spain, resale property Spain, move-in ready apartment Spain, furnished villa Spain, immediate occupancy Spain, Marbella resale property, Madrid apartments for sale, Barcelona home for sale, Costa del Sol villa, second-hand property Spain, renovated property Spain, buy house Spain immediately, existing property Spain, turnkey property Spain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Ready to Move Properties in Spain | Rino Properties" />
        <meta property="og:description" content="Ready to move properties in Spain. Apartments, villas & penthouses in Marbella, Madrid, Barcelona. Expert guidance from Rino Properties." />
        <meta property="og:url" content="https://rinoproperties.com/properties/spain/ready-to-move" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=630&fit=crop" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rinoproperties.com/properties/spain/ready-to-move" />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="en" href="https://rinoproperties.com/properties/spain/ready-to-move" />
        <link rel="alternate" hrefLang="es" href="https://rinoproperties.com/es/properties/spain/ready-to-move" />
        <link rel="alternate" hrefLang="x-default" href="https://rinoproperties.com/properties/spain/ready-to-move" />
        
        {/* Geo Tags */}
        <meta name="geo.region" content="ES" />
        <meta name="geo.placename" content="Spain" />
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
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Rino Properties - Ready to Move Properties Spain",
              "description": "Premier real estate agency helping buyers find ready to move properties in Spain. Expert guidance through the entire buying process.",
              "url": "https://rinoproperties.com/properties/spain/ready-to-move",
              "logo": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
              "image": "/images/spain.webp",
              "areaServed": {
                "@type": "Country",
                "name": "Spain",
                "addressCountry": "ES"
              },
              "knowsAbout": [
                "Ready to Move Properties Spain",
                "Properties in Marbella",
                "Apartments in Madrid",
                "Villas in Barcelona",
                "Spain Real Estate Investment",
                "Spain Property Investment"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Malaga",
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
                  "name": "Ready to Move Properties Spain",
                  "item": "https://rinoproperties.com/properties/spain/ready-to-move"
                }
              ]
            })
          }}
        />
      </Head>

      <Layout 
        title={t('readyToMove.spain.head.title', 'Ready to Move Properties in Spain | Buy & Move In Today')}
        description={t('readyToMove.spain.head.description', 'Ready-to-move properties in Spain — key-ready apartments, villas & penthouses in Marbella, Madrid, Barcelona, Costa del Sol. Immediate occupancy. Legal support included. Rino Properties.')}
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
                country="Spain"
                sortBy={sortBy}
                setSortBy={setSortBy}
                hideListingType={true}
                hidePropertyType={false}
              />
              </div>
            </div>
          </section>
        {/* Properties Section */}
        <section id="properties-section" className="relative py-8 overflow-hidden bg-white min-h-screen">
          <div className="absolute inset-0 bg-white z-0"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
            {searchQuery && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs xs:text-sm font-medium text-blue-800">{t('readyToMove.searchResults.title', 'Search Results for:')}</h4>
                    <p className="text-sm xs:text-base text-blue-600">"{searchQuery}" {t('readyToMove.searchResults.inReadyToMove', 'in Ready to Move Properties')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      router.push('/properties/spain/ready-to-move', undefined, { shallow: true });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs xs:text-sm font-medium"
                  >
                    {t('readyToMove.searchResults.clearSearch', 'Clear Search')}
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                  {loading ? t('readyToMove.results.loading', 'Loading...') : `${filteredProperties.length} ${t('readyToMove.results.propertiesFound', 'Ready to Move Properties')}`}
                </h2>
                <p className="text-sm xs:text-base text-gray-600 font-light">
                  {!loading && (
                    <>
                      {searchQuery && `${t('readyToMove.results.searchResultsFor', 'Search results for')} "${searchQuery}" ${t('readyToMove.results.inReadyToMove', 'in Ready to Move')}`}
                      {activeFilter !== 'All' && `${searchQuery ? ' • ' : ''}${t('readyToMove.results.filteredBy', 'Filtered by')}: ${activeFilter}`}
                      {activeCityFilter !== 'All Areas' && ` ${t('readyToMove.results.in', 'in')} ${activeCityFilter}`}
                      {usingFallback && (
                        <span className="ml-2 text-amber-600 font-medium">({t('readyToMove.results.demoData', 'Demo Data')})</span>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              {!loading && filteredProperties.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0">
                  <div className="text-xs xs:text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {t('readyToMove.results.showing', 'Showing')} {pagination.startIndex + 1}-{Math.min(pagination.endIndex, filteredProperties.length)} {t('readyToMove.results.of', 'of')} {filteredProperties.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs xs:text-sm">
                    <label htmlFor="itemsPerPage" className="text-gray-600 font-medium">
                      {t('readyToMove.pagination.itemsPerPage', 'Items per page:')}
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

            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-sm xs:text-base text-gray-600">{t('readyToMove.loading.message', 'Loading ready to move properties...')}</p>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="text-red-600 mb-2 text-lg xs:text-xl">⚠️ {t('readyToMove.error.connectionError', 'Connection Error')}</div>
                  <p className="text-sm xs:text-base text-gray-700 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProperties(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm xs:text-base"
                  >
                    {t('readyToMove.error.tryAgain', 'Try Again')}
                  </button>
                </div>
              </div>
            )}

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
              t={(key, fallback) => t(`readyToMove.${key}`, fallback)}
            />

            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-light text-gray-900 mb-4">{t('readyToMove.noProperties.title', 'No Ready to Move Properties Found')}</h3>
                <p className="text-sm xs:text-base text-gray-600 mb-8 font-light">
                  {t('readyToMove.noProperties.message', 'We couldn\'t find any ready to move properties matching your current search criteria. Try adjusting your filters.')}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-8 py-3 font-medium hover:from-[#C4903A] hover:to-[#D69F3F] transition-all duration-300 hover:scale-105 text-sm xs:text-base"
                >
                  {t('readyToMove.noProperties.clearFilters', 'Clear All Filters')}
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
              {t('readyToMove.cta.title', 'Move Into Your Dream Home Today')}
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">
              {t('readyToMove.spain.cta.description', 'Our expert advisors will help you find the perfect ready to move property in Spain. Immediate handover, no waiting — start living your Spanish dream today.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4  font-light hover:bg-white transition-all duration-300 text-sm xs:text-base"
              >
                {t('readyToMove.cta.contactTeam', 'Speak to a Property Expert')}
              </a>
              <a
                href="tel:+34635955137"
                className="border-2 border-white/80 text-white px-8 py-4  font-light hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-sm xs:text-base"
              >
                {t('readyToMove.spain.cta.callPhone', 'Call: +34 635 955 137')}
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

export default ReadyToMovePropertiesPage;

// Ensure router is fully initialized during SSR to prevent hydration mismatches
export const getServerSideProps = async () => {
  return { props: {} };
};
