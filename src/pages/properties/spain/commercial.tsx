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

const CommercialPropertiesPage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  useScrollRestoration();
  
  const [activeFilter, setActiveFilter] = useState('Commercial');
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
    
    const { city, status, listingType, sort } = router.query;
    
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

  // Update URL when filters change
  useEffect(() => {
    if (!router.isReady || !filtersInitialized) return;
    
    const currentT = tRef.current;
    const allValues = new Set(['All', currentT('properties.page.all', 'All'), currentT('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', currentT('properties.page.allCities', 'All Areas'), currentT('propertyFilters.allCities', 'All Areas')]);
    const allTypesValues = new Set(['All Types', currentT('properties.page.allTypes', 'All Types'), currentT('propertyFilters.allTypes', 'All Types')]);
    
    const query: Record<string, string> = {};
    
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
  }, [router.isReady, filtersInitialized, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, sortBy]);

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
      
      // Keep filter locked to Commercial type
      setActiveFilter('Commercial');
      setActiveTypeFilter(allValue);
      setActiveCityFilter(allCitiesValue);
      setActiveStatusFilter(allValue);
      setActiveListingTypeFilter(allTypesValue);
      setActivePropertyTypeFilter(allValue);
    }
  }, [language, t]);

  // Fetch properties from API with caching
  const fetchProperties = useCallback(async (forceRefresh = false) => {
    const searchFilters = parseSearchParams(router.query);
    const hasSearchFilters = !!(searchFilters.query);
    
    if (!hasSearchFilters && !forceRefresh) {
      const cachedData = getCachedProperties('spain');
      if (cachedData && cachedData.length > 0) {
        // Filter cached data for commercial properties only
        const commercialProperties = cachedData.filter(p => p.type === 'Commercial');
        setProperties(commercialProperties);
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
        // Filter for commercial only
        transformedProperties = transformedProperties.filter(p => p.type === 'Commercial');
        
        if (searchFilters.query) {
          setSearchQuery(searchFilters.query);
        }
        
        if (searchFilters.listing_type === 'ready-to-move') {
          setActiveListingTypeFilter('Ready to Move');
        } else if (searchFilters.listing_type === 'off-plan') {
          setActiveListingTypeFilter('Off-Plan');
        }
      } else {
        // Get all Spain properties and filter for commercial
        const allProperties = await PropertiesApiService.getPropertiesByCategory('spain');
        transformedProperties = allProperties.filter(p => p.type === 'Commercial');
        setSearchQuery('');
        
        if (allProperties.length > 0) {
          setCachedProperties('spain', allProperties);
        }
      }
      
      setProperties(transformedProperties);
      setError(null);
    } catch (err: any) {
      setProperties([]);
      setError(err.message || 'Failed to load Spain commercial properties from API');
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
    // For commercial page, the main type is Commercial but show all available sub-types
    const allTypes: Property['type'][] = ['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Studio', 'Commercial', 'Land', 'Farm', 'Factory'];
    
    if (properties.length > 0) {
      const existingTypes = new Set(properties.map(p => p.type));
      return allTypes.filter(type => existingTypes.has(type));
    }
    return ['Commercial'] as Property['type'][];
  }, [properties]);

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    const allValues = new Set(['All', t('properties.page.all', 'All'), t('propertyFilters.all', 'All')]);
    const allCitiesValues = new Set(['All Areas', t('properties.page.allCities', 'All Areas'), t('propertyFilters.allCities', 'All Areas')]);
    const allTypesValues = new Set(['All Types', t('properties.page.allTypes', 'All Types'), t('propertyFilters.allTypes', 'All Types')]);

    const isAllFilter = (val: string) => allValues.has(val);
    const isAllCities = (val: string) => allCitiesValues.has(val);
    const isAllTypes = (val: string) => allTypesValues.has(val);

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
  }, [properties, activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, priceRange, sortBy, t]);

  const pagination = usePagination({
    items: filteredProperties,
    initialItemsPerPage: 12,
    dependencies: [activeCityFilter, activeStatusFilter, activeListingTypeFilter, activePropertyTypeFilter, priceRange, sortBy, searchQuery]
  });

  const goToPage = useCallback((page: number) => {
    pagination.goToPage(page);
    document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pagination]);

  const clearFilters = useCallback(() => {
    // Keep filter locked to Commercial
    setActiveFilter('Commercial');
    setActiveTypeFilter(t('propertyFilters.all', 'All'));
    setActiveCityFilter(t('propertyFilters.allCities', 'All Areas'));
    setActiveStatusFilter(t('propertyFilters.all', 'All'));
    setActiveListingTypeFilter(t('propertyFilters.allTypes', 'All Types'));
    setActivePropertyTypeFilter(t('propertyFilters.all', 'All'));
    setPriceRange([0, 0]);
    setSortBy('featured');
    setSearchQuery('');
    router.push('/properties/spain/commercial', undefined, { shallow: true });
    pagination.resetToFirstPage();
  }, [pagination, t]);

  // Structured data for Commercial properties page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Commercial Properties in Spain",
      "description": "Find commercial properties in Spain for sale and rent. Offices, retail spaces, warehouses, and commercial buildings in prime business locations.",
      "url": "https://rinoproperties.com/properties/spain/commercial",
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
            "name": "Spain Commercial",
            "item": "https://rinoproperties.com/properties/spain/commercial"
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Commercial Property Collection",
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
          "name": "What types of commercial properties are available in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spain offers a wide range of commercial properties including office spaces, retail shops, showrooms, warehouses, industrial units, commercial buildings, co-working spaces, and mixed-use developments. Prime locations include Madrid, Barcelona, Marbella, Malaga, and the Costa del Sol."
          }
        },
        {
          "@type": "Question",
          "name": "What is the average ROI for commercial properties in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Commercial properties in Spain typically offer competitive ROI, ranging from 5-10%. Office spaces in Madrid and Barcelona yield 5-7%, retail spaces in popular tourist areas can yield 6-10%, and logistics properties in industrial zones offer solid returns."
          }
        },
        {
          "@type": "Question",
          "name": "Can foreigners buy commercial property in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, foreigners can buy commercial property in Spain with no restrictions. The process involves obtaining an NIE (Foreigner Identification Number). Rino Properties can guide you through the entire purchase process."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best areas for commercial property in Spain?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best areas for commercial properties in Spain include Madrid (business hub), Barcelona (retail & tourism), Marbella & Costa del Sol (hospitality & tourism), Malaga (tech hub), and Valencia (emerging business center)."
          }
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{t('commercial.spain.head.title', 'Commercial Property Spain | Offices, Retail & Industrial for Sale')}</title>
        <meta name="description" content={t('commercial.spain.head.description', 'Commercial properties in Spain for sale & rent — offices in Madrid, Barcelona; retail in Marbella, Costa del Sol. Industrial & warehouse units. 5-9% ROI. Legal & tax advisory. Rino Properties.')} />
        <meta name="keywords" content="commercial property Spain, office space Madrid, office for rent Barcelona, retail space Marbella, warehouse Spain, commercial investment Spain, shop for sale Spain, local comercial Spain, industrial unit Spain, coworking Madrid, office Barcelona, commercial lease Spain, business premises Spain, Costa del Sol commercial, commercial real estate agent Spain, commercial property ROI Spain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Commercial Properties in Spain | Offices, Retail & Warehouses" />
        <meta property="og:description" content="Commercial properties in Spain for sale and rent. Madrid, Barcelona, Marbella, Costa del Sol. Expert guidance from Rino Properties." />
        <meta property="og:url" content="https://rinoproperties.com/properties/spain/commercial" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&h=630&fit=crop" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rinoproperties.com/properties/spain/commercial" />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="en" href="https://rinoproperties.com/properties/spain/commercial" />
        <link rel="alternate" hrefLang="es" href="https://rinoproperties.com/es/properties/spain/commercial" />
        <link rel="alternate" hrefLang="x-default" href="https://rinoproperties.com/properties/spain/commercial" />
        
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
              "name": "Rino Properties - Spain Commercial Real Estate",
              "description": "Premier real estate agency specializing in commercial properties in Spain. Offices, retail spaces, warehouses and commercial buildings for sale and rent.",
              "url": "https://rinoproperties.com/properties/spain/commercial",
              "logo": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
              "image": "/images/spain.webp",
              "areaServed": {
                "@type": "Country",
                "name": "Spain",
                "addressCountry": "ES"
              },
              "knowsAbout": [
                "Commercial Properties Spain",
                "Office Space Madrid",
                "Retail Space Barcelona",
                "Commercial Property Marbella",
                "Costa del Sol Commercial",
                "Spain Commercial Real Estate",
                "Commercial Investment Spain"
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
                  "name": "Spain Commercial Properties",
                  "item": "https://rinoproperties.com/properties/spain/commercial"
                }
              ]
            })
          }}
        />
      </Head>

      <Layout 
        title={t('commercial.spain.head.title', 'Commercial Property Spain | Offices, Retail & Industrial for Sale')}
        description={t('commercial.spain.head.description', 'Commercial properties in Spain for sale & rent — offices in Madrid, Barcelona; retail in Marbella, Costa del Sol. Industrial & warehouse units. 5-9% ROI. Legal & tax advisory. Rino Properties.')}
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
                    <h4 className="text-xs xs:text-sm font-medium text-blue-800">{t('commercial.searchResults.title', 'Search Results for:')}</h4>
                    <p className="text-sm xs:text-base text-blue-600">"{searchQuery}" {t('commercial.searchResults.inCommercial', 'in Commercial Properties')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      router.push('/properties/spain/commercial', undefined, { shallow: true });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs xs:text-sm font-medium"
                  >
                    {t('commercial.searchResults.clearSearch', 'Clear Search')}
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-light text-gray-900 mb-2">
                  {loading ? t('commercial.results.loading', 'Loading...') : `${filteredProperties.length} ${t('commercial.results.propertiesFound', 'Commercial Properties Found')}`}
                </h2>
                <p className="text-sm xs:text-base text-gray-600 font-light">
                  {!loading && (
                    <>
                      {searchQuery && `${t('commercial.results.searchResultsFor', 'Search results for')} "${searchQuery}" ${t('commercial.results.inCommercial', 'in Commercial')}`}
                      {activeCityFilter !== 'All Areas' && ` ${t('commercial.results.in', 'in')} ${activeCityFilter}`}
                      {usingFallback && (
                        <span className="ml-2 text-amber-600 font-medium">({t('commercial.results.demoData', 'Demo Data')})</span>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              {!loading && filteredProperties.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0">
                  <div className="text-xs xs:text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {t('commercial.results.showing', 'Showing')} {pagination.startIndex + 1}-{Math.min(pagination.endIndex, filteredProperties.length)} {t('commercial.results.of', 'of')} {filteredProperties.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs xs:text-sm">
                    <label htmlFor="itemsPerPage" className="text-gray-600 font-medium">
                      {t('commercial.pagination.itemsPerPage', 'Items per page:')}
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
                  <p className="text-sm xs:text-base text-gray-600">{t('commercial.loading.message', 'Loading commercial properties...')}</p>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <div className="text-red-600 mb-2 text-lg xs:text-xl">⚠️ {t('commercial.error.connectionError', 'Connection Error')}</div>
                  <p className="text-sm xs:text-base text-gray-700 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProperties(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm xs:text-base"
                  >
                    {t('commercial.error.tryAgain', 'Try Again')}
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
              t={(key, fallback) => t(`commercial.${key}`, fallback)}
            />

            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-light text-gray-900 mb-4">{t('commercial.noProperties.title', 'No Commercial Properties Found')}</h3>
                <p className="text-sm xs:text-base text-gray-600 mb-8 font-light">
                  {t('commercial.noProperties.message', 'We couldn\'t find any commercial properties matching your current search criteria. Try adjusting your filters.')}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-8 py-3 font-medium hover:from-[#C4903A] hover:to-[#D69F3F] transition-all duration-300 hover:scale-105 text-sm xs:text-base"
                >
                  {t('commercial.noProperties.clearFilters', 'Clear All Filters')}
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
              {t('commercial.spain.cta.title', 'Find Your Ideal Commercial Space in Spain')}
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto font-light">
              {t('commercial.cta.description', 'Whether you need an office, retail space, or warehouse, our commercial real estate specialists will find the perfect property for your business needs.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4  font-light hover:bg-white transition-all duration-300 text-sm xs:text-base"
              >
                {t('commercial.cta.contactTeam', 'Contact Commercial Team')}
              </a>
              <a
                href="tel:+34635955137"
                className="border-2 border-white/80 text-white px-8 py-4  font-light hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-sm xs:text-base"
              >
                {t('commercial.spain.cta.callPhone', 'Call: +34 635 955 137')}
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

export default CommercialPropertiesPage;

// Ensure router is fully initialized during SSR to prevent hydration mismatches
export const getServerSideProps = async () => {
  return { props: {} };
};
