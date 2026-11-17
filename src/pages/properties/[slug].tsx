import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import PropertyStats from '../../components/PropertyStats';
import { useLanguage } from '../../context/LanguageContext';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { Property, getLocalizedTitle, getLocalizedDescription, getLocalizedAmenities, getLocalizedFeatures } from '../../data/properties';
import { PropertiesApiService } from '../../services/propertiesApiService';
import { sendInquire, PropertyInquiryData } from '../../services/inquireApiService';
import { createPropertySlug, isSimilarSlug } from '../../utils/slugUtils';
import { 
  generatePropertyStructuredData, 
  generatePropertyKeywords, 
  generateCanonicalUrl,
  generatePropertyOGImage,
  truncateDescription,
  validateMetaTitle,
  generateUniquePropertyDescription 
} from '../../utils/seoUtils';
import { validateInquiryForm, sanitizeInquiryData } from '../../utils/inquiryValidation';
import { getRevalidationInterval } from '../../utils/isrUtils';
import { trackFormSubmission, trackPropertyInquiry, trackLead, trackConversion } from '../../utils/googleAnalytics';
import { countries } from '../../data/countries';

// Lazy load PropertyLoader for better initial load
const PropertyLoader = dynamic(() => import('../../components/PropertyLoader'), {
  ssr: false
});

// Lazy load FeaturedPropertiesInternational for international (non-Spain/non-UAE) property pages
const FeaturedPropertiesInternational = dynamic(() => import('../../components/home/FeaturedPropertiesInternational'), {
  ssr: false
});

// Form data interface
interface FormData {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  message: string;
}

// Form errors interface
interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

interface PropertySlugPageProps {
  property: Property | null;
  lastUpdated?: string;
}

// Custom hook for image gallery management
const useImageGallery = (images?: string[]) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const isMountedRef = useRef(true);
  // Track last navigation time to prevent rapid clicks
  const lastNavTimeRef = useRef(0);
  const NAV_DEBOUNCE_MS = 50;

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset indices when images change
  useEffect(() => {
    if (images?.length && images.length > 0) {
      setCurrentImageIndex(prev => Math.min(prev, images.length - 1));
      setLightboxImageIndex(prev => Math.min(prev, images.length - 1));
    } else {
      setCurrentImageIndex(0);
      setLightboxImageIndex(0);
    }
  }, [images?.length]);

  const nextImage = useCallback(() => {
    const now = Date.now();
    if (!images?.length || !isMountedRef.current || now - lastNavTimeRef.current < NAV_DEBOUNCE_MS) return;
    lastNavTimeRef.current = now;
    
    setCurrentImageIndex((prev) => {
      if (!images?.length) return prev;
      return prev >= images.length - 1 ? 0 : prev + 1;
    });
  }, [images?.length]);

  const prevImage = useCallback(() => {
    const now = Date.now();
    if (!images?.length || !isMountedRef.current || now - lastNavTimeRef.current < NAV_DEBOUNCE_MS) return;
    lastNavTimeRef.current = now;
    
    setCurrentImageIndex((prev) => {
      if (!images?.length) return prev;
      return prev <= 0 ? images.length - 1 : prev - 1;
    });
  }, [images?.length]);

  const nextLightboxImage = useCallback(() => {
    const now = Date.now();
    if (!images?.length || !isMountedRef.current || now - lastNavTimeRef.current < NAV_DEBOUNCE_MS) return;
    lastNavTimeRef.current = now;
    
    setLightboxImageIndex((prev) => {
      if (!images?.length) return prev;
      return prev >= images.length - 1 ? 0 : prev + 1;
    });
  }, [images?.length]);

  const prevLightboxImage = useCallback(() => {
    const now = Date.now();
    if (!images?.length || !isMountedRef.current || now - lastNavTimeRef.current < NAV_DEBOUNCE_MS) return;
    lastNavTimeRef.current = now;
    
    setLightboxImageIndex((prev) => {
      if (!images?.length) return prev;
      return prev <= 0 ? images.length - 1 : prev - 1;
    });
  }, [images?.length]);

  return {
    currentImageIndex,
    lightboxImageIndex,
    setCurrentImageIndex,
    setLightboxImageIndex,
    nextImage,
    prevImage,
    nextLightboxImage,
    prevLightboxImage
  };
};

// Custom hook for form management
const usePropertyInquiryForm = (property: Property | null, localizedTitle?: string) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    countryCode: '+971',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const search = countrySearch.toLowerCase();
    return countries.filter(c => 
      c.country.toLowerCase().includes(search) || 
      c.code.includes(search)
    );
  }, [countrySearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = useCallback((code: string) => {
    setFormData(prev => ({ ...prev, countryCode: code }));
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
  }, []);

  const validateForm = useCallback((): boolean => {
    const validationResult = validateInquiryForm(formData);
    setFormErrors(validationResult.errors);
    return validationResult.isValid;
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing (debounced)
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [formErrors]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      // Sanitize form data before submission
      const sanitizedData = sanitizeInquiryData(formData);
      
      const inquirePayload: PropertyInquiryData = {
        name: sanitizedData.fullName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        property_id: property?.property_id || property?.id || '',
        property_link: `https://rinoproperties.com/properties/${property?.slug || ''}`,
        message: sanitizedData.message,
      };
      await sendInquire(inquirePayload);

      // --- Google Analytics / Google Ads tracking on successful submit ---
      const propertyId = property?.property_id || property?.id || '';
      const propertyTitle = property?.title || localizedTitle || 'Property';
      const propertyType = property?.type || 'Property';
      const priceValue = property?.price
        ? parseFloat(property.price.replace(/[^0-9.]/g, ''))
        : undefined;
      const currencyCode = property?.price?.includes('€') ? 'EUR'
        : property?.price?.includes('AED') ? 'AED'
        : 'AED';

      // 1. Form-submit event (GA4 + dataLayer)
      trackFormSubmission('property_inquiry', 'inquiry', {
        property_id: propertyId,
        property_title: propertyTitle,
        property_type: propertyType,
      });

      // 2. Property inquiry event
      trackPropertyInquiry(
        propertyId,
        propertyTitle,
        'inquiry_form',
        sanitizedData.email
      );

      // 3. Lead-generation event (GA4 generate_lead)
      trackLead(
        'property_inquiry',
        priceValue,
        'property_detail_page',
        {
          property_id: propertyId,
          property_title: propertyTitle,
          property_type: propertyType,
          currency: currencyCode,
        }
      );

      // 4. Google Ads conversion
      trackConversion(
        'property_inquiry_lead',
        priceValue,
        currencyCode,
        `inquiry_${propertyId}_${Date.now()}`
      );

      // Track lead event with Meta Pixel - lazy load
      if (property) {
        const { trackLead: trackMetaLead } = await import('../../utils/metaPixel');
        trackMetaLead({
          content_name: propertyTitle,
          content_category: propertyType,
          value: priceValue,
          currency: currencyCode !== 'AED' ? currencyCode : undefined
        });
      }
      
      setFormData({
        fullName: '',
        email: '',
        countryCode: '+971',
        phone: '',
        message: ''
      });
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (err) {
      console.error('Form submission error:', err);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, property, localizedTitle]);

  return {
    formData,
    formErrors,
    isSubmitting,
    submitStatus,
    handleInputChange,
    handleFormSubmit,
    countrySearch,
    setCountrySearch,
    isCountryDropdownOpen,
    setIsCountryDropdownOpen,
    filteredCountries,
    handleCountrySelect,
    countryDropdownRef
  };
};

const PropertySlugPage: React.FC<PropertySlugPageProps> = ({ property, lastUpdated }) => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { getSavedPathForBase, markForScrollRestore, getNavigationStack } = useScrollRestoration();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Track broken images and hide them
  const handleImageError = useCallback((imageSrc: string) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(imageSrc);
      return next;
    });
  }, []);
  
  // Touch tracking for main image to differentiate tap from scroll
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  
  // Memoize localized content to prevent recalculation on each render
  // Must be called before any conditional returns (Rules of Hooks)
  const localizedContent = useMemo(() => {
    if (!property) {
      return {
        title: '',
        description: '',
        amenities: [],
        features: []
      };
    }
    return {
      title: getLocalizedTitle(property, language),
      description: getLocalizedDescription(property, language),
      amenities: getLocalizedAmenities(property, language),
      features: getLocalizedFeatures(property, language)
    };
  }, [property, language]);
  
  const { title: localizedTitle, description: localizedDescription, features: localizedFeatures } = localizedContent;
  
  // Filter out broken/failed images early so the gallery hook uses the correct count
  const validImages = useMemo(() => {
    const imgs = property?.images;
    if (!imgs || !Array.isArray(imgs) || imgs.length === 0) return [];
    return imgs.filter(img => !failedImages.has(img));
  }, [property?.images, failedImages]);

  // Use custom hooks for better organization
  const imageGallery = useImageGallery(validImages);
  const inquiryForm = usePropertyInquiryForm(property, localizedTitle);

  // Navigation functions - the hook already has debouncing built-in
  const { nextImage, prevImage, nextLightboxImage, prevLightboxImage } = imageGallery;

  const openLightbox = useCallback((index?: number) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const targetIndex = index !== undefined ? index : imageGallery.currentImageIndex;
    if (targetIndex === undefined || targetIndex < 0) return;
    
    try {
      setHasInteracted(true);
      imageGallery.setLightboxImageIndex(targetIndex);
      setIsLightboxOpen(true);
      
      const scrollY = window.scrollY;
      document.body.classList.add('modal-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } catch (err) {
      console.error('Error opening lightbox:', err);
    }
  }, [imageGallery]);

  // Create throttled version of openLightbox to prevent rapid clicks
  const lastLightboxOpenRef = useRef<number>(0);
  const throttledOpenLightbox = useCallback((index: number) => {
    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastLightboxOpenRef.current;
    
    if (timeSinceLastCall >= 300) {
      lastLightboxOpenRef.current = currentTime;
      openLightbox(index);
    }
  }, [openLightbox]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setHasInteracted(false);
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      try {
        const scrollY = document.body.style.top;
        document.body.classList.remove('modal-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        if (scrollY) {
          const scrollPosition = parseInt(scrollY || '0') * -1;
          window.scrollTo({ top: scrollPosition, behavior: 'auto' });
        }
      } catch (err) {
        console.error('Error closing lightbox:', err);
      }
    }
  }, []);

  // Add keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevLightboxImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextLightboxImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, closeLightbox, prevLightboxImage, nextLightboxImage]);

  // Cleanup on unmount and refresh
  useEffect(() => {
    // Cleanup any existing modal state on mount (in case of refresh)
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    }
    
    return () => {
      // Ensure body styles are restored on unmount
      if (typeof document !== 'undefined') {
        document.body.classList.remove('modal-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
      }
    };
  }, []);

  // Track page view with Meta Pixel - deferred to after initial render
  useEffect(() => {
    if (!property || typeof window === 'undefined') return;
    
    // Defer tracking to avoid blocking initial render
    const timeoutId = setTimeout(async () => {
      try {
        const { trackViewContent } = await import('../../utils/metaPixel');
        trackViewContent({
          content_name: property.title || localizedTitle || 'Property',
          content_ids: [property.property_id || property.id || ''],
          content_category: property.type || 'Property',
          value: property.price ? parseFloat(property.price.replace(/[^0-9.]/g, '')) : undefined,
          currency: property.price?.includes('€') ? 'EUR' : property.price?.includes('AED') ? 'AED' : undefined
        });
      } catch (err) {
        console.error('Error tracking view content:', err);
      }
    }, 1000); // Delay by 1 second
    
    return () => clearTimeout(timeoutId);
  }, [property, localizedTitle]);

  // Preload adjacent images in lightbox for smoother navigation - only when lightbox is opened
  useEffect(() => {
    if (!isLightboxOpen || !property?.images?.length || typeof window === 'undefined' || !hasInteracted) return;

    // Defer preloading slightly to prioritize visible image
    const timeoutId = setTimeout(() => {
      const preloadImage = (index: number) => {
        try {
          if (property.images && index >= 0 && index < property.images.length) {
            const img = new window.Image();
            img.src = property.images[index];
          }
        } catch (err) {
          console.error('Error preloading image:', err);
        }
      };

      // Preload previous and next images
      const currentIndex = imageGallery.lightboxImageIndex;
      if (currentIndex >= 0 && currentIndex < property.images.length) {
        const prevIndex = currentIndex === 0 ? property.images.length - 1 : currentIndex - 1;
        const nextIndex = currentIndex === property.images.length - 1 ? 0 : currentIndex + 1;

        preloadImage(prevIndex);
        preloadImage(nextIndex);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [isLightboxOpen, imageGallery.lightboxImageIndex, property?.images, property, hasInteracted]);

  // List of exclusive properties that require location privacy
  const exclusiveProperties = ['24S158V', '24S142V', '24S090V', '24S138V', '24S137V', '24S114LP'];
  const isExclusiveProperty = exclusiveProperties.includes(property?.property_id || property?.id || '');

  // Generate consistent approximate coordinates for exclusive properties
  const approximateCoordinates = useMemo(() => {
    if (!property) return null;
    if (isExclusiveProperty && property.lat && property.lng) {
      // Use property ID as seed for consistent offset
      const seed = (property.property_id || property.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const latOffset = ((seed % 100) / 100 - 0.5) * 0.008; // ~400m offset
      const lngOffset = (((seed * 7) % 100) / 100 - 0.5) * 0.008; // Different offset for lng
      const approxLat = (typeof property.lat === 'string' ? parseFloat(property.lat) : property.lat) + latOffset;
      const approxLng = (typeof property.lng === 'string' ? parseFloat(property.lng) : property.lng) + lngOffset;
      return { lat: approxLat, lng: approxLng };
    }
    return null;
  }, [isExclusiveProperty, property]);

  // Memoize map URL generation for performance
  const mapUrl = useMemo(() => {
    if (!property) return '';
    if (property.lat && property.lng) {
      if (isExclusiveProperty && approximateCoordinates) {
        // For exclusive properties: Use approximate coordinates
        return `https://maps.google.com/maps?q=${approximateCoordinates.lat},${approximateCoordinates.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      } else {
        // For regular properties: Show exact location
        return `https://maps.google.com/maps?q=${property.lat},${property.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
    } else if (property.city && property.country) {
      const cityCountryQuery = encodeURIComponent(`${property.city}, ${property.country}`);
      // Use zoom level 12-13 to show city area
      const zoomLevel = isExclusiveProperty ? 12 : 13;
      return `https://maps.google.com/maps?q=${cityCountryQuery}&t=&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
    } else if (property.location) {
      // Use zoom level based on exclusivity
      const zoomLevel = isExclusiveProperty ? 13 : 15;
      return `https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
    }
    return '';
  }, [property, isExclusiveProperty, approximateCoordinates]);

  // Memoize Google Maps link for performance
  const googleMapsLink = useMemo(() => {
    if (!property) return '#';
    if (property.lat && property.lng) {
      if (isExclusiveProperty && approximateCoordinates) {
        // For exclusive properties: Use same approximate coordinates as map
        return `https://maps.google.com/maps?q=${approximateCoordinates.lat},${approximateCoordinates.lng}&z=14`;
      } else {
        // For regular properties: Show exact location
        return `https://maps.google.com/maps?q=${property.lat},${property.lng}&z=15`;
      }
    } else if (property.city && property.country) {
      const zoomLevel = isExclusiveProperty ? 12 : 13;
      return `https://maps.google.com/maps?q=${encodeURIComponent(`${property.city}, ${property.country}`)}&z=${zoomLevel}`;
    } else if (property.location) {
      const zoomLevel = isExclusiveProperty ? 13 : 15;
      return `https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&z=${zoomLevel}`;
    }
    return '#';
  }, [property, isExclusiveProperty, approximateCoordinates]);

  // Memoize SEO data generation
  const seoData = useMemo(() => {
    if (!property) return null;
    const propertySlug = createPropertySlug(localizedTitle || property.title);
    // Strip any existing " " suffix to prevent duplication (SEO component will add it)
    const rawTitle = (property.meta_title || localizedTitle || property.title || '').replace(/\s*\|\s*Rino Properties\s*$/i, '');
    const seoTitle = validateMetaTitle(rawTitle, 60);
    // Use property.meta_description if available, otherwise generate a unique description
    // This prevents duplicate descriptions across similar properties
    const seoDescription = property.meta_description 
      ? truncateDescription(property.meta_description)
      : generateUniquePropertyDescription(property, localizedTitle || property.title);
    const seoKeywords = property.keywords || generatePropertyKeywords(property);
    const canonicalUrl = generateCanonicalUrl(`/properties/${propertySlug}`);
    // Ensure og:image is a full absolute URL for Pinterest Rich Pins
    const ogImage = property?.images?.[0] 
      ? (property.images[0].startsWith('http') ? property.images[0] : `https://rinoproperties.com${property.images[0]}`)
      : generatePropertyOGImage(property);
    const structuredData = generatePropertyStructuredData(property);
    
    // Pinterest Rich Pins require article type and timestamps
    const articleType = "article";
    // Use static date to avoid hydration issues (properties don't have createdAt/updatedAt)
    const publishedTime = new Date('2024-01-01').toISOString();
    const modifiedTime = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z'; // Today at midnight
    const section = `${property.country} Real Estate`;
    const tags = [property.type, property.city, property.country, 'Luxury Real Estate'];
    
    return {
      propertySlug,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogImage,
      structuredData,
      articleType,
      publishedTime,
      modifiedTime,
      section,
      tags
    };
  }, [property, localizedTitle, localizedDescription]);
  
  // Handle router fallback state
  if (router.isFallback) {
    return <PropertyLoader />;
  }

  // Early return if no property
  if (!property) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-4">{t('propertyDetails.notFound.title', 'Property Not Found')}</h1>
            <p className="text-gray-600 mb-8 font-light">{t('propertyDetails.notFound.message', "The property you're looking for doesn't exist.")}</p>
            <button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-6 py-3 hover:from-[#C4903A] hover:to-[#D69F3F] transition-all duration-300 hover:scale-105 font-medium rounded cursor-pointer"
            >
              {t('propertyDetails.notFound.goBack', 'Go Back')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Current image for display
  const currentImage = validImages[imageGallery?.currentImageIndex] || validImages[0] || null;
    return (
    <>
      <Layout 
        title={seoData?.seoTitle}
        description={seoData?.seoDescription}
        keywords={seoData?.seoKeywords}
        image={seoData?.ogImage}
        url={seoData?.canonicalUrl}
        structuredData={seoData?.structuredData}
        articleType={seoData?.articleType}
        publishedTime={seoData?.publishedTime}
        modifiedTime={seoData?.modifiedTime}
        section={seoData?.section}
        tags={seoData?.tags}
        headerBg="bg-white text-black hover:text-[#D69F3F] logo-black"
        skipTitleSuffix={true}
      >
        {/* ISR Debug Banner - Only visible in development */}
        {process.env.NODE_ENV === 'development' && lastUpdated && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white text-xs px-4 py-1 text-center">
            <strong>ISR Debug:</strong> Cache ID: {lastUpdated}
          </div>
        )}
        {/* Breadcrumb */}
        <section className="pt-24 pb-4 bg-white relative z-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 font-light">
              <Link href="/" className="hover:text-[#D69F3F] transition-colors flex-shrink-0">{t('nav.home', 'Home')}</Link>
              <span className="flex-shrink-0">/</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  const basePath = property.country === 'Spain' ? '/properties/spain' : property.country === 'UAE' ? '/properties/dubai' : '/properties/international';
                  const navigationStack = getNavigationStack();
                  
                  // Check if the user came from the properties list (exists in navigation stack)
                  const cameFromPropertiesList = navigationStack.some(
                    (path: string) => path.split('?')[0] === basePath
                  );
                  
                  if (cameFromPropertiesList) {
                    // Use native browser back for proper scroll restoration
                    // This triggers popstate which handles scroll restoration correctly
                    window.history.back();
                  } else {
                    // User navigated directly to this page, use normal navigation with scroll restore
                    const savedPath = getSavedPathForBase(basePath);
                    markForScrollRestore(savedPath);
                    router.push(savedPath);
                  }
                }}
                className="hover:text-[#D69F3F] transition-colors flex-shrink-0 cursor-pointer"
              >
                {property.country === 'Spain' ? t('nav.spainProperties', 'Spain Properties') : property.country === 'UAE' ? t('nav.dubaiProperties', 'Dubai Properties') : t('nav.internationalProperties', 'International Properties')}
              </button>
              <span className="flex-shrink-0">/</span>
              <span className="text-gray-900 font-medium truncate min-w-0">{localizedTitle}</span>
            </nav>
          </div>
        </section>

        {/* Property Hero Section */}
        <section className="relative z-10">
          {/* Main Image Slider */}
          <div 
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100" 
            style={{ 
              minHeight: '400px'
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full py-4 lg:py-6">
              
                {/* Main Large Image - Left Side */}
                <div 
                  className="lg:col-span-2 relative overflow-hidden bg-gray-200 group cursor-pointer"
                  onClick={(e) => {
                    // Only open lightbox if not clicking on buttons or links
                    const target = e.target as HTMLElement;
                    if (!target.closest('button') && !target.closest('a') && !target.closest('svg')) {
                      e.preventDefault();
                      e.stopPropagation();
                      const index = imageGallery?.currentImageIndex;
                      if (index !== undefined) {
                        throttledOpenLightbox(index);
                      }
                    }
                  }}
                  onTouchStart={(e) => {
                    // Record touch start position and time
                    const target = e.target as HTMLElement;
                    // Don't track if touching a button or link
                    if (target.closest('button') || target.closest('a') || target.closest('svg')) {
                      touchStartRef.current = null;
                      return;
                    }
                    const touch = e.touches[0];
                    if (touch) {
                      touchStartRef.current = {
                        x: touch.clientX,
                        y: touch.clientY,
                        time: Date.now()
                      };
                    }
                  }}
                  onTouchEnd={(e) => {
                    // Only open lightbox if it's a tap, not a scroll
                    const target = e.target as HTMLElement;
                    if (!target.closest('button') && !target.closest('a') && !target.closest('svg') && touchStartRef.current) {
                      const touch = e.changedTouches[0];
                      if (touch) {
                        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
                        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
                        const deltaTime = Date.now() - touchStartRef.current.time;
                        
                        // Consider it a tap if movement is less than 10px and duration less than 300ms
                        if (deltaX < 10 && deltaY < 10 && deltaTime < 300 && imageGallery?.currentImageIndex !== undefined) {
                          e.preventDefault();
                          e.stopPropagation();
                          openLightbox(imageGallery?.currentImageIndex);
                        }
                      }
                    }
                    touchStartRef.current = null;
                  }}
                  style={{
                    minHeight: '350px',
                    height: '100%',
                    position: 'relative'
                  }}
                   >
                  
                  {validImages[imageGallery?.currentImageIndex] && (
                    <Image
                      src={validImages[imageGallery.currentImageIndex]}
                      alt={localizedTitle || 'Property'}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-150 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                      priority
                      quality={85}
                      loading="eager"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                      onError={() => {
                        handleImageError(validImages[imageGallery.currentImageIndex]);
                      }}
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-100"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Photo Gallery Icon with Count */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      e.nativeEvent.stopImmediatePropagation();
                      const index = imageGallery?.currentImageIndex;
                      if (index !== undefined) {
                        throttledOpenLightbox(index);
                      }
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      e.nativeEvent.stopImmediatePropagation();
                      const index = imageGallery?.currentImageIndex;
                      if (index !== undefined) {
                        throttledOpenLightbox(index);
                      }
                    }}
                    className="absolute bottom-4 right-4 bg-white rounded-lg flex items-center justify-center z-20 shadow-lg active:scale-95 px-3 py-2 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    aria-label={`View all ${validImages.length} images`}
                  >
                    <svg className="w-5 h-5 text-gray-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-800 font-medium text-sm">{validImages.length}</span>
                  </button>
                  
                  {/* Navigation Arrows */}
                  {validImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          e.nativeEvent.stopImmediatePropagation();
                          if (validImages.length > 0) {
                            prevImage();
                          }
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          if (validImages.length > 0) {
                            prevImage();
                          }
                        }}
                        className="absolute left-2 sm:left-4 top-1/3 lg:top-1/2  transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 text-gray-800 rounded-full flex items-center justify-center z-20 shadow-xl active:scale-95 border border-white/20 touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto', cursor: 'pointer' }}
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          e.nativeEvent.stopImmediatePropagation();
                          if (validImages.length > 0) {
                            nextImage();
                          }
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          if (validImages.length > 0) {
                            nextImage();
                          }
                        }}
                        className="absolute right-2 sm:right-4 top-1/3 lg:top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 text-gray-800 rounded-full flex items-center justify-center z-20 shadow-xl active:scale-95 border border-white/20 touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto', cursor: 'pointer' }}
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-4 left-4 text-white z-10">
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs font-medium uppercase tracking-wider">
                        {property?.type || 'Property'}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 leading-tight text-white">
                      {localizedTitle}
                    </h1>
                    <div className="text-lg sm:text-xl font-bold mb-4">
                      {property?.status === 'sold' ? (
                        <span className="text-rose-400">
                          {t('propertyDetails.soldOut', 'SOLD OUT')}
                        </span>
                      ) : property?.status === 'negotiable' ? (
                        <span className="text-amber-400">
                          {t('propertyDetails.negotiable', 'NEGOTIABLE')}
                        </span>
                      ) : (
                        <span className="text-[#D69F3F]">
                          {property?.price || 'Price on Request'}
                        </span>
                      )}
                    </div>
                    
                    {/* Quick Contact Icons */}
                    <div className="flex items-center gap-2">
                      {/* Email */}
                      <a
                        href={`mailto:${property?.country === 'Spain' ? 'ask@rinoproperties.com' : 'khaled@rinoproperties.com'}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        title={`Email: ${property?.country === 'Spain' ? 'ask@rinoproperties.com' : 'khaled@rinoproperties.com'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                      
                      {/* Phone */}
                      <a
                        href={`tel:${property?.country === 'Spain' ? ' +34635955137 ' : '+971544012269'}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/20 hover:bg-blue-600/80 backdrop-blur-sm text-white hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        title={`Call: ${property?.country === 'Spain' ? '+34 635 955 137' : '+971 54 401 2269'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                      
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/${property?.country === 'Spain' ? ' +34635955137 ' : '+971544012269'}?text=${encodeURIComponent(`Hi! I'm interested in this property: ${localizedTitle || 'this property'}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/20 hover:bg-green-600/80 backdrop-blur-sm text-white hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                        title={`WhatsApp: ${property?.country === 'Spain' ? ' +34635955137 ' : '+971544012269'}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                        </svg>
                      </a>

                      {/* Divider */}
                      <div className="w-px h-6 bg-white/30 mx-1"></div>

                      {/* Social Share Button */}
                      <div className="relative z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const shareButton = document.querySelector('[data-share-dropdown]');
                            shareButton?.classList.toggle('hidden');
                          }}
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                          title="Share this property"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div 
                          data-share-dropdown
                          onClick={(e) => e.stopPropagation()}
                          className="hidden absolute right-0 sm:left-0 sm:right-auto bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-30"
                          style={{ maxHeight: '60vh', overflowY: 'auto' }}
                        >
                          <div className="py-2">
                            {/* Facebook Share */}
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              Facebook
                            </a>
                            
                            {/* Twitter Share */}
                            <a
                              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(`🏠 Check out this amazing property: ${localizedTitle || 'Property'}\n\n💰 ${property?.price || 'Contact for price'}\n📍 ${property?.location || `${property?.city || ''}, ${property?.country || ''}` || ''}\n\n#RealEstate #Property #Investment`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-400 transition-colors"
                            >
                              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                              Twitter
                            </a>
                            
                            {/* LinkedIn Share */}
                            <a
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(`${localizedTitle || 'Property'} - Premium Property`)}&summary=${encodeURIComponent(`Discover this exceptional property: ${localizedTitle || 'this property'}. Located in ${property?.location || `${property?.city || ''}, ${property?.country || ''}` || 'prime location'}. Price: ${property?.price || 'Contact for price'}. Contact us for more details.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              LinkedIn
                            </a>
                            
                            {/* WhatsApp Share */}
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(`🏠 *${localizedTitle || 'Property'}*\n\n💰 Price: ${property?.price || 'Contact for price'}\n📍 Location: ${property?.location || `${property?.city || ''}, ${property?.country || ''}` || 'Prime Location'}\n\n${property?.longDescription ? property.longDescription.substring(0, 100) + '...' : 'Exceptional property opportunity!'}\n\n🔗 View Details: ${typeof window !== 'undefined' ? window.location.href : ''}\n\n#RealEstate #Property #Investment`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                              </svg>
                              WhatsApp
                            </a>
                            
                            {/* TikTok Share */}
                            <a
                              href={`https://www.tiktok.com/upload?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&description=${encodeURIComponent(`🏠 ${localizedTitle || 'Amazing Property'} - Amazing Property! 💰 ${property?.price || 'Contact for price'} 📍 ${property?.location || `${property?.city || ''}, ${property?.country || ''}` || 'Prime Location'} #RealEstate #Property #Investment #TikTok`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-black hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                              </svg>
                              TikTok
                            </a>

                            {/* Email Share */}
                            <a
                              href={`mailto:?subject=${encodeURIComponent(`${localizedTitle || 'Property'} - Premium Property Opportunity`)}&body=${encodeURIComponent(`Hi,\n\nI wanted to share this amazing property with you:\n\n🏠 ${localizedTitle || 'Property'}\n💰 Price: ${property?.price || 'Contact for price'}\n📍 Location: ${property?.location || `${property?.city || ''}, ${property?.country || ''}` || 'Prime Location'}\n\n${property?.longDescription ? property.longDescription.substring(0, 200) + '...' : 'This is an exceptional property opportunity that I think you might be interested in.'}\n\nYou can view all the details, photos, and more information at:\n${typeof window !== 'undefined' ? window.location.href : ''}\n\nBest regards`)}`}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Email
                            </a>
                            
                            {/* Copy Link */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                // Show a brief success message
                                const button = document.querySelector('[data-copy-feedback]');
                                if (button) {
                                  button.textContent = 'Link Copied!';
                                  setTimeout(() => {
                                    button.textContent = 'Copy Link';
                                  }, 2000);
                                }
                              }}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span data-copy-feedback>Copy Link</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Images Grid - Right Side */}
                <div className="hidden lg:flex flex-col gap-2">
                  {validImages.slice(1, 3).map((image, index) => (
                    <button
                      key={index + 1}
                      onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        throttledOpenLightbox(index + 1); 
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        throttledOpenLightbox(index + 1);
                      }}
                      className={`relative flex-1 overflow-hidden rounded-lg group cursor-pointer touch-manipulation ${
                        index + 1 === imageGallery.currentImageIndex 
                          ? 'ring-3 ring-[#D69F3F] ring-offset-2 scale-105' 
                          : 'hover:ring-2 hover:ring-gray-300 hover:scale-105'
                      }`}
                      style={{ position: 'relative', WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Image
                        src={image}
                        alt={`${localizedTitle} - Gallery view ${index + 2}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-110 transition-transform duration-100"
                        sizes="(max-width: 1024px) 0vw, 300px"
                        loading="eager"
                        quality={75}
                        onError={() => handleImageError(image)}
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-100"></div>
                      {index + 1 === imageGallery.currentImageIndex && (
                        <div className="absolute inset-0 bg-[#D69F3F]/15"></div>
                      )}
                      {/* Play Icon Overlay for Active Image */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                        <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Thumbnail Slider */}
          {validImages.length > 1 && (
            <div className="lg:hidden bg-white border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-3 sm:py-4 flex items-center gap-3">
                  {/* Scrollable Thumbnail Container */}
                  <div 
                    className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-1 scroll-smooth items-center"
                    style={{ 
                      scrollSnapType: 'x mandatory',
                      WebkitOverflowScrolling: 'touch',
                      touchAction: 'pan-x'
                    }}
                  >
                    {validImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          throttledOpenLightbox(index);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          throttledOpenLightbox(index);
                        }}
                        className={`relative flex-shrink-0 w-16 h-14 sm:w-20 sm:h-16 rounded-lg overflow-hidden cursor-pointer touch-manipulation ${
                          index === imageGallery.currentImageIndex 
                            ? 'ring-2 ring-[#D69F3F] ring-offset-2 scale-105 shadow-lg' 
                            : 'opacity-60 active:opacity-100'
                        }`}
                        style={{ 
                          position: 'relative',
                          scrollSnapAlign: 'start',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${localizedTitle} - View ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 640px) 64px, 80px"
                          quality={75}
                          loading={index < 5 ? 'eager' : 'lazy'}
                          onError={() => handleImageError(image)}
                        />
                        {/* Active Indicator */}
                        {index === imageGallery.currentImageIndex && (
                          <div className="absolute inset-0 bg-[#D69F3F]/20"></div>
                        )}
                        {/* Image Number Badge */}
                        <div className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                          index === imageGallery.currentImageIndex 
                            ? 'bg-[#D69F3F] text-white' 
                            : 'bg-black/40 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Mobile Gallery Button - Improved Touch Target */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      const index = imageGallery?.currentImageIndex;
                      if (index !== undefined) {
                        throttledOpenLightbox(index);
                      }
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      const index = imageGallery?.currentImageIndex;
                      if (index !== undefined) {
                        throttledOpenLightbox(index);
                      }
                    }}
                    className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D69F3F] to-[#C4903A] text-white rounded-lg flex flex-col items-center justify-center shadow-md self-center touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    aria-label={`Open gallery (${property?.images?.length || 0} images)`}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[9px] sm:text-[10px] font-medium mt-0.5">{property?.images?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
        {/* Property Details */}
        <section className="py-6 lg:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Property Info */}
                <div className="bg-white p-6 lg:p-8 shadow-sm border border-gray-50" style={{ contain: 'layout style paint' }}>
                  <div className="mb-4 lg:mb-6">
                   
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 leading-tight">
                          {localizedTitle || 'Property Details'}
                        </h2>
                      </div>

                       {
                        property?.brochure && <button
                          onClick={async () => {
                            try {
                              if (property?.brochure) {
                                const brochurePath = property.brochure;
                                const isAbsolute = /^https?:\/\//i.test(brochurePath);
                                // Ensure we use API root (without trailing /api) for relative brochure paths
                                const apiRoot = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
                                const href = isAbsolute
                                  ? brochurePath
                                  : `${apiRoot.replace(/\/$/, '')}/${brochurePath.replace(/^\//, '')}`;
                                const link = document.createElement('a');
                                link.href = href;
                                link.download = `${localizedTitle || property?.title || 'property'}-brochure.pdf`;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              } else {
                                alert(t('propertyDetails.brochureNotAvailable', 'Brochure is currently not available for this property. Please contact us for more information.'));
                              }
                            } catch (err) {
                              console.error('Brochure download error:', err);
                              alert(t('propertyDetails.brochureError', 'Error downloading brochure. Please try again later.'));
                            }
                          }}
                          className={`inline-flex items-center gap-2 px-4 py-2 ${property?.brochure ? 'bg-[#D69F3F] hover:bg-[#C4903A] hover:scale-105 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium text-sm rounded-lg transition-all duration-300 whitespace-nowrap`}
                          aria-label={`Download brochure for ${localizedTitle}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {t('propertyDetails.downloadBrochure', 'Download Brochure')}
                        </button>
                      }
                    </div>
                    
                    {(property?.location || property?.city) && (
                      <a 
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base lg:text-lg text-gray-600 font-light mb-4 lg:mb-6 flex items-start gap-2 hover:text-[#D69F3F] transition-colors duration-300"
                        aria-label={`View ${property?.location || `${property?.city || ''}, ${property?.country || ''}` || 'location'} on Google Maps`}
                      >
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-[#D69F3F] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="break-words">
                          {property?.location || (property?.city && property?.country ? `${property.city}, ${property.country}` : '')}
                        </span>
                      </a>
                    )}
                    
                    {/* Price Display */}
                    <div className="text-xl md:text-2xl lg:text-3xl font-light mb-2">
                      {property?.status === 'sold' ? (
                        <span className="text-rose-600 font-bold">
                          {t('propertyDetails.soldOut', 'SOLD OUT')}
                        </span>
                      ) : property?.status === 'negotiable' ? (
                        <span className="text-amber-600 font-bold">
                          {t('propertyDetails.negotiable', 'NEGOTIABLE')}
                        </span>
                      ) : (
                        <span className="text-[#D69F3F]">
                          {property?.price || 'Price on Request'}
                          {/* {property.priceStarting && (
                            <span className="text-sm md:text-base text-gray-500 ml-2 font-normal">
                              starting from
                            </span>
                          )} */}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Property Stats */}
                  <PropertyStats property={property} />

                  {/* Description */}
                  {(property?.longDescription || localizedDescription) && (
                    <div className="pt-6 lg:pt-8 border-t border-gray-100">
                      <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-4 tracking-wide">{t('propertyDetails.description.title', 'DESCRIPTION')}</h3>
                      <div className="text-sm md:text-base lg:text-lg text-gray-600 font-light leading-relaxed space-y-4">
                        {(() => {
                          const description = property?.longDescription || localizedDescription || '';
                          
                          // Convert description to string if it's an array
                          const descriptionString = Array.isArray(description) ? description.join(' ') : String(description);
                          
                          // Check if the description contains HTML tags
                          const hasHtmlTags = /<[^>]*>/g.test(descriptionString);
                          
                          if (hasHtmlTags) {
                            // Render as HTML with proper prose styling and spacing
                            return (
                              <div 
                                className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-medium prose-p:text-gray-600 prose-p:mb-4 prose-li:text-gray-600 prose-strong:text-gray-800 prose-a:text-[#D69F3F] hover:prose-a:text-[#C4903A] [&>p]:mb-4 [&>div]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-4 [&>h4]:mb-4 [&>h5]:mb-4 [&>h6]:mb-4 [&>blockquote]:mb-4"
                                dangerouslySetInnerHTML={{
                                  __html: descriptionString
                                }}
                              />
                            );
                          } else {
                            // Handle plain text - split by double line breaks first, then single line breaks
                            const paragraphs = descriptionString
                              .split(/\n\s*\n/) // Split by double line breaks (paragraph breaks)
                              .map(para => para.replace(/\n/g, ' ')) // Replace single line breaks with spaces
                              .filter(para => para.trim().length > 0); // Remove empty paragraphs
                            
                            return paragraphs.map((paragraph, index) => (
                              <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                                {paragraph.trim()}
                              </p>
                            ));
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>

            
                  {/* Property Features */}
                  {localizedFeatures && localizedFeatures.length > 0 && (
                    <div className="bg-white w-full p-6 lg:p-8 shadow-sm border border-gray-50" style={{ contain: 'layout style paint' }}>
                      <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-lg lg:text-xl font-medium text-gray-900 tracking-wide">{t('propertyDetails.features.title', 'FEATURES')}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:gap-3">
                        {localizedFeatures.map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200"
                          >
                            <span className="w-1.5 h-1.5 bg-[#D69F3F] rounded-full" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                 {/* </div> */}
               {/* )} */}

                {/* Google Map Location */}
                <div className="bg-white p-6 lg:p-8 shadow-sm border border-gray-50" style={{ contain: 'layout style paint' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-lg lg:text-xl font-medium text-gray-900 tracking-wide">{t('propertyDetails.location.title', 'LOCATION')}</h3>
                  </div>
                  {mapUrl ? (
                    <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9', containIntrinsicSize: '640px 360px' }}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={mapUrl}
                        title={`Map showing ${property.type} location in ${property.city}, ${property.country}`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 rounded-lg flex items-center justify-center" style={{ aspectRatio: '16/9', containIntrinsicSize: '640px 360px' }}>
                      <p className="text-gray-500">{t('propertyDetails.location.mapNotAvailable', 'Map not available')}</p>
                    </div>
                  )}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-[#D69F3F] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium mb-1 text-sm lg:text-base">{localizedTitle}</p>
                        <p className="text-gray-600 font-light text-xs lg:text-sm break-words">
                          {property.location || (property.city && property.country ? `${property.city}, ${property.country}` : '')}
                        </p>
                        {googleMapsLink !== '#' && (
                          <a
                            href={googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#D69F3F] hover:text-[#C4903A] font-medium text-xs lg:text-sm mt-2 transition-colors duration-300"
                          >
                            {t('propertyDetails.location.viewOnGoogleMaps', 'View on Google Maps')}
                            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <div className="lg:sticky lg:top-8 space-y-6">
                  {/* Contact Form */}
                  <div className="bg-white p-6 lg:p-8 shadow-sm border border-gray-50" style={{ contain: 'layout style paint' }}>
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-lg lg:text-xl font-medium text-gray-900 tracking-wide">{t('propertyDetails.inquiry.title', 'INQUIRE NOW')}</h3>
                    </div>
                    
                    {/* Success Message */}
                    {inquiryForm.submitStatus === 'success' && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="text-green-700 text-sm font-medium block">{t('propertyDetails.inquiry.successMessage', 'Thank you! Your inquiry has been sent successfully.')}</span>
                            <span className="text-green-600 text-xs">{t('propertyDetails.inquiry.successSubMessage', 'We will contact you within 24 hours.')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {inquiryForm.submitStatus === 'error' && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <div>
                            <span className="text-red-700 text-sm font-medium block">{t('propertyDetails.inquiry.errorMessage', 'Sorry, there was an error sending your inquiry.')}</span>
                            <span className="text-red-600 text-xs">{t('propertyDetails.inquiry.errorSubMessage', 'Please try again or contact us directly.')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={inquiryForm.handleFormSubmit} className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="fullName"
                          value={inquiryForm.formData.fullName}
                          onChange={inquiryForm.handleInputChange}
                          placeholder={t('propertyDetails.inquiry.form.fullName', 'Full Name')}
                          className={`w-full px-0 py-3 lg:py-4 border-0 border-b-2 ${
                            inquiryForm.formErrors.fullName ? 'border-red-300' : 'border-gray-200'
                          } focus:border-[#D69F3F] focus:ring-0 outline-none transition-colors font-light text-gray-900 placeholder-gray-400 bg-transparent text-sm lg:text-base`}
                          disabled={inquiryForm.isSubmitting}
                        />
                        {inquiryForm.formErrors.fullName && (
                          <p className="mt-1 text-red-500 text-xs lg:text-sm">{inquiryForm.formErrors.fullName}</p>
                        )}
                      </div>
                      
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={inquiryForm.formData.email}
                          onChange={inquiryForm.handleInputChange}
                          placeholder={t('propertyDetails.inquiry.form.email', 'Email Address')}
                          className={`w-full px-0 py-3 lg:py-4 border-0 border-b-2 ${
                            inquiryForm.formErrors.email ? 'border-red-300' : 'border-gray-200'
                          } focus:border-[#D69F3F] focus:ring-0 outline-none transition-colors font-light text-gray-900 placeholder-gray-400 bg-transparent text-sm lg:text-base`}
                          disabled={inquiryForm.isSubmitting}
                        />
                        {inquiryForm.formErrors.email && (
                          <p className="mt-1 text-red-500 text-xs lg:text-sm">{inquiryForm.formErrors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="relative" ref={inquiryForm.countryDropdownRef}>
                            <button
                              type="button"
                              onClick={() => inquiryForm.setIsCountryDropdownOpen(!inquiryForm.isCountryDropdownOpen)}
                              className="w-28 px-2 py-3 lg:py-4 border-0 border-b-2 border-gray-200 focus:border-[#D69F3F] focus:ring-0 outline-none transition-colors font-light text-gray-900 bg-transparent text-sm lg:text-base flex items-center justify-between"
                              disabled={inquiryForm.isSubmitting}
                            >
                              <span>{countries.find(c => c.code === inquiryForm.formData.countryCode)?.flag} {inquiryForm.formData.countryCode}</span>
                              <svg className={`w-4 h-4 transition-transform ${inquiryForm.isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {inquiryForm.isCountryDropdownOpen && (
                              <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                                <div className="p-2 border-b border-gray-100">
                                  <input
                                    type="text"
                                    value={inquiryForm.countrySearch}
                                    onChange={(e) => inquiryForm.setCountrySearch(e.target.value)}
                                    placeholder="Search country..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#D69F3F]"
                                    autoFocus
                                  />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {inquiryForm.filteredCountries.map((country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => inquiryForm.handleCountrySelect(country.code)}
                                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                                        inquiryForm.formData.countryCode === country.code ? 'bg-[#D69F3F]/10 text-[#D69F3F]' : 'text-gray-700'
                                      }`}
                                    >
                                      <span>{country.flag}</span>
                                      <span className="flex-1">{country.country}</span>
                                      <span className="text-gray-400">{country.code}</span>
                                    </button>
                                  ))}
                                  {inquiryForm.filteredCountries.length === 0 && (
                                    <div className="px-3 py-4 text-sm text-gray-500 text-center">No countries found</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={inquiryForm.formData.phone}
                            onChange={inquiryForm.handleInputChange}
                            placeholder={t('propertyDetails.inquiry.form.phone', 'Phone Number')}
                            className={`flex-1 px-0 py-3 lg:py-4 border-0 border-b-2 ${
                              inquiryForm.formErrors.phone ? 'border-red-300' : 'border-gray-200'
                            } focus:border-[#D69F3F] focus:ring-0 outline-none transition-colors font-light text-gray-900 placeholder-gray-400 bg-transparent text-sm lg:text-base`}
                            disabled={inquiryForm.isSubmitting}
                          />
                        </div>
                        {inquiryForm.formErrors.phone && (
                          <p className="mt-1 text-red-500 text-xs lg:text-sm">{inquiryForm.formErrors.phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <textarea
                          rows={3}
                          name="message"
                          value={inquiryForm.formData.message}
                          onChange={inquiryForm.handleInputChange}
                          placeholder={t('propertyDetails.inquiry.form.message', 'Message (Tell us about your interest in this property)')}
                          className={`w-full px-0 py-3 lg:py-4 border-0 border-b-2 ${
                            inquiryForm.formErrors.message ? 'border-red-300' : 'border-gray-200'
                          } focus:border-[#D69F3F] focus:ring-0 outline-none transition-colors font-light text-gray-900 placeholder-gray-400 bg-transparent resize-none text-sm lg:text-base`}
                          disabled={inquiryForm.isSubmitting}
                        />
                        {inquiryForm.formErrors.message && (
                          <p className="mt-1 text-red-500 text-xs lg:text-sm">{inquiryForm.formErrors.message}</p>
                        )}
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={inquiryForm.isSubmitting}
                        className={`w-full py-3 lg:py-4 mt-6 lg:mt-8 font-light tracking-wider text-xs lg:text-sm uppercase transition-all duration-300 ${
                          inquiryForm.isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-[#D69F3F] hover:bg-[#C4903A] hover:shadow-lg transform hover:scale-105'
                        } text-white rounded-lg`}
                      >
                        {inquiryForm.isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('propertyDetails.inquiry.form.sending', 'Sending...')}
                          </div>
                        ) : (
                          t('propertyDetails.inquiry.form.sendInquiry', 'Send Inquiry')
                        )}
                      </button>
                    </form>

                    {/* Contact Options */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-center text-xs lg:text-sm text-gray-500 font-light mb-4">
                        {t('propertyDetails.inquiry.contactDirectly', 'Or contact us directly')}
                      </p>
                      <div className="flex flex-col gap-3">
                        {/* Email Contact */}
                        <a
                          href={`mailto:${property?.country === 'Spain' ? 'ask@rinoproperties.com' : 'khaled@rinoproperties.com'}`}
                          className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-300 group"
                        >
                          <svg className="w-5 h-5 text-[#D69F3F] group-hover:text-[#C4903A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-[#D69F3F] transition-colors">
                              {t('propertyDetails.inquiry.email', 'Email Us')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {property?.country === 'Spain' ? 'ask@rinoproperties.com' : 'khaled@rinoproperties.com'}
                            </div>
                          </div>
                        </a>

                        {/* WhatsApp Contact */}
                        <a
                          href={`https://wa.me/${property?.country === 'Spain' ? '34635955137' : '971544012269'}?text=${encodeURIComponent(`Hi! I'm interested in this property: ${localizedTitle || 'this property'}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 group"
                        >
                          <svg className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                          </svg>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                              {t('propertyDetails.inquiry.whatsapp', 'WhatsApp')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {property?.country === 'Spain' ? ' +34635955137 ' : '+971544012269'}
                            </div>
                          </div>
                        </a>

                        {/* Phone Contact */}
                        <a
                          href={`tel:${property?.country === 'Spain' ? ' +34635955137 ' : '+971544012269'}`}
                          className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 group"
                        >
                          <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                              {t('propertyDetails.inquiry.call', 'Call Us')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {property?.country === 'Spain' ? '+34 635 955 137' : '+971 54 401 2269'}
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Property Details Card */}
                  <div className="bg-white p-6 lg:p-8 shadow-sm border border-gray-50" style={{ contain: 'layout style paint' }}>
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-lg lg:text-xl font-medium text-gray-900 tracking-wide">{t('propertyDetails.details.title', 'DETAILS')}</h3>
                    </div>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 lg:py-3 border-b border-gray-100">
                        <span className="text-gray-500 font-light text-xs lg:text-sm tracking-wide mb-1 sm:mb-0">{t('propertyDetails.details.propertyId', 'PROPERTY ID')}</span>
                        <span className="font-light text-gray-900 text-sm lg:text-base break-all">
                          {property.property_id || property.id || t('propertyDetails.details.notAvailable', 'Not Available')}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 lg:py-3 border-b border-gray-100">
                        <span className="text-gray-500 font-light text-xs lg:text-sm tracking-wide mb-1 sm:mb-0">{t('propertyDetails.details.type', 'TYPE')}</span>
                        <div className="flex justify-start sm:justify-end">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize bg-gray-100 text-gray-800 border border-gray-200">
                            <svg className="w-3 h-3 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {property.type === 'Villa' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              ) : property.type === 'Apartment' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              ) : property.type === 'Commercial' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              )}
                            </svg>
                            {property.type || t('propertyDetails.details.notSpecified', 'Not specified')}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 lg:py-3 border-b border-gray-100">
                        <span className="text-gray-500 font-light text-xs lg:text-sm tracking-wide mb-1 sm:mb-0">{t('propertyDetails.details.status', 'STATUS')}</span>
                        <div className="flex justify-start sm:justify-end">
                          <span className={`
                            inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize
                            ${property.status === 'sold' 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : property.status === 'negotiable'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                            }
                          `}>
                            <div className={`
                              w-2 h-2 rounded-full mr-2
                              ${property?.status === 'sold' 
                                ? 'bg-red-500' 
                                : property?.status === 'negotiable'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              }
                            `}></div>
                            {property?.status === 'sold' ? t('propertyDetails.details.sold', 'Sold')
                             : property?.status === 'negotiable' ? t('propertyDetails.details.negotiable', 'Negotiable')
                             : property?.status === 'approved' ? t('propertyDetails.details.available', 'Available')
                             : t('propertyDetails.details.available', 'Available')}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 lg:py-3 border-b border-gray-100">
                        <span className="text-gray-500 font-light text-xs lg:text-sm tracking-wide mb-1 sm:mb-0">{t('propertyDetails.details.listingType', 'LISTING TYPE')}</span>
                        <div className="flex justify-start sm:justify-end">
                          <span className={`
                            inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium capitalize
                            ${property?.listing_type === 'off-plan' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                            }
                          `}>
                            <svg className={`
                              w-3 h-3 mr-2
                              ${property?.listing_type === 'off-plan' ? 'text-blue-500' : 'text-purple-500'}
                            `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {property?.listing_type === 'off-plan' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              )}
                            </svg>
                            {property?.listing_type === 'off-plan' ? t('propertyDetails.details.offPlan', 'Off Plan')
                             : property?.listing_type === 'ready-to-move' ? t('propertyDetails.details.readyToMove', 'Ready to Move')
                             : t('propertyDetails.details.notSpecified', 'Not specified')}
                          </span>
                        </div>
                      </div>
                      {property?.yearBuilt && (
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 lg:py-3 border-b border-gray-100">
                          <span className="text-gray-500 font-light text-xs lg:text-sm tracking-wide mb-1 sm:mb-0">{t('propertyDetails.details.yearBuilt', 'YEAR BUILT')}</span>
                          <span className="font-light text-gray-900 text-sm lg:text-base">{property.yearBuilt}</span>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 lg:py-3">
                        <span className="text-gray-500 font-light text-xs lg:text-sm tracking-wide mb-1 sm:mb-0">{t('propertyDetails.details.country', 'COUNTRY')}</span>
                        <div className="flex justify-start sm:justify-end">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-gradient-to-r from-[#D69F3F]/10 to-[#C4903A]/10 text-gray-800 border border-[#D69F3F]/20">
                             {property?.country || 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* International Properties Section - Show for non-Spain/non-UAE properties */}
        {property?.country && property.country !== 'Spain' && property.country !== 'UAE' && (
          <FeaturedPropertiesInternational />
        )}

        {/* Contact CTA */}
        <section className="py-12 lg:py-20 bg-gradient-to-r from-[#D69F3F] via-[#C4903A] to-[#D69F3F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
              {t('propertyDetails.cta.title', 'Ready to Schedule a Viewing?')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 lg:mb-8 max-w-2xl mx-auto">
              {t('propertyDetails.cta.description', 'Contact our expert team today to arrange a private viewing of this exceptional property.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <a
                href={`tel:${property?.country === 'Spain' ? ' +34635955137 ' : '+971544012269'}`}
                className="bg-white text-[#D69F3F] hover:bg-gray-100 px-6 lg:px-8 py-3 lg:py-4 font-semibold text-base lg:text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 rounded-md lg:rounded-none"
              >
                {t('propertyDetails.cta.callNow', 'Call Now')}
              </a>
              <Link
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-[#D69F3F] px-6 lg:px-8 py-3 lg:py-4 font-semibold text-base lg:text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 rounded-md lg:rounded-none"
              >
                {t('contact.title', 'Contact Us')}
              </Link>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {isLightboxOpen && hasInteracted && (
          <div 
            className="fixed inset-0 bg-black/95 z-[9990] flex items-center justify-center overflow-hidden"
            style={{ 
              touchAction: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
            onTouchStart={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
              }
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg flex items-center justify-center transition-all duration-300 z-[70] touch-manipulation"
              aria-label="Close gallery"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm z-[70] pointer-events-none">
              {imageGallery.lightboxImageIndex + 1} / {validImages.length}
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4 flex items-center justify-center">
              <div className="relative w-full h-full" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                {validImages[imageGallery.lightboxImageIndex] && (
                  <Image
                    src={validImages[imageGallery.lightboxImageIndex]}
                    alt={`${localizedTitle || 'Property'} - Image ${imageGallery.lightboxImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 90vw"
                    quality={85}
                    loading="eager"
                    onError={() => {
                      handleImageError(validImages[imageGallery.lightboxImageIndex]);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    prevLightboxImage();
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevLightboxImage();
                  }}
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/15 active:bg-white/35 text-white rounded-xl flex items-center justify-center z-[70] backdrop-blur-sm border border-white/20 active:scale-95 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto', cursor: 'pointer' }}
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    nextLightboxImage();
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextLightboxImage();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/15 active:bg-white/35 text-white rounded-xl flex items-center justify-center z-[70] backdrop-blur-sm border border-white/20 active:scale-95 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto', cursor: 'pointer' }}
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-6xl w-full px-4 z-[70] hidden md:block">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide justify-center items-center" style={{ WebkitOverflowScrolling: 'touch' }}>
                {validImages.slice(0, 10).map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (index >= 0 && index < validImages.length) {
                        imageGallery.setLightboxImageIndex(index);
                      }
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    className={`relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden touch-manipulation ${
                      index === imageGallery.lightboxImageIndex 
                        ? 'ring-2 ring-white scale-110 shadow-lg' 
                        : 'opacity-60 active:opacity-100 active:scale-105'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      loading="lazy"
                      quality={60}
                      onError={() => handleImageError(image)}
                    />
                    {index === imageGallery.lightboxImageIndex && (
                      <div className="absolute inset-0 bg-white/20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

// Generate static paths for all properties at build time with optimized ISR strategy
export const getStaticPaths: GetStaticPaths = async () => {
  try {
     const properties = await PropertiesApiService.getFeaturedProperties({ limit: 30 });
    
    // If no featured properties, fallback to first 20 properties
    let pathProperties = properties;
    if (pathProperties.length === 0) {
      const allProperties = await PropertiesApiService.getAllProperties();
      pathProperties = allProperties.slice(0, 20);
    }
    
    const paths = pathProperties.map((property) => ({
      params: { 
        slug: property?.slug || createPropertySlug(property?.title || 'property', property?.id || property?.property_id || 'unknown') 
      },
    }));

    return {
      paths,
      // Use 'blocking' for ISR - pages not in paths will be generated on-demand
      fallback: 'blocking',
    };
  } catch (err) {
    console.error('Error generating static paths:', err);
    // Return empty paths but keep fallback enabled for runtime generation
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

// ISR with optimized data fetching and caching strategy
export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const isPreview = context.preview || false;
  
  try {
    // Use different data fetching strategy based on build vs runtime
    const property = await PropertiesApiService.getPropertyBySlugWithFallback(slug);

    // If property doesn't exist, return 404
    if (!property) {
      return {
        notFound: true,
        // Cache 404 pages for 5 minutes to avoid repeated API calls
        revalidate: 300,
      };
    }

    // Use the property's actual slug if it exists, otherwise generate one
    const propertySlug = property.slug || createPropertySlug(property?.title || 'property', property?.id || property?.property_id || 'unknown');
    
    // Only redirect if the slugs are significantly different (not just minor variations)
    if (slug !== propertySlug && !isSimilarSlug(slug, propertySlug)) {
      return {
        redirect: {
          destination: `/properties/${propertySlug}`,
          permanent: true,
        },
      };
    }

    // Determine revalidation interval based on property characteristics
    let revalidateInterval: number;
    
    if (isPreview) {
      // Preview mode: very short cache for immediate updates
      revalidateInterval = 60; // 1 minute
    } else {
      // Use the utility function for consistent interval calculation
      revalidateInterval = getRevalidationInterval(property);
    }

    return {
      props: {
        property,
        // Use a consistent timestamp to avoid hydration mismatches
        lastUpdated: `${property?.id || property?.property_id || 'unknown'}-${revalidateInterval}`,
      },
      // Dynamic revalidation based on property type and status
      revalidate: revalidateInterval,
    };
  } catch (err) {
    console.error('Error in getStaticProps:', err);
    // Return 404 for API errors to avoid showing broken pages
    return {
      notFound: true,
      // Short revalidation for temporary API issues
      revalidate: 300, // 5 minutes
    };
  }
};

export default PropertySlugPage;
