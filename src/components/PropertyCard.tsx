import React, { useState, memo, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property, getLocalizedTitle, getLocalizedDescription } from '../data/properties';
import { createPropertySlug } from '../utils/slugUtils';
import { useLanguage } from '../context/LanguageContext';
import { trackButtonClick } from '../utils/metaPixel';
import { gtmTrackEvent } from '../utils/gtm';
import { trackPropertyView } from '../utils/googleAnalytics';

interface PropertyCardProps {
  property: Property;
  index?: number;
  priority?: boolean;
  lazy?: boolean;
}

// Utility function to format price in M and K - Optimized for cross-browser compatibility
const formatPrice = (price: string, t?: (key: string, fallback?: string) => string): string => {
  if (!price) return t ? t('propertyCard.priceOnRequest', 'Price on request') : 'Price on request';
  
  const originalPrice = price;
  
  // Check if price contains text-based units (millones, millions, mil, thousand)
  const textFormatMatch = price.match(/([0-9]+[,\.]?[0-9]*)\s*(millones?|millions?|mil|thousand|k|m)(?:\s+de)?\s*(euros?|dollars?|pounds?|dirhams?)?/i);
  
  if (textFormatMatch) {
    // Extract the number and unit from text format
    let numberStr = textFormatMatch[1].replace(',', '.'); // Convert European decimal comma to period
    const unit = textFormatMatch[2].toLowerCase();
    let number = parseFloat(numberStr);
    
    // Validate parsed number
    if (isNaN(number) || number <= 0) return originalPrice;
    
    // Convert to base number based on unit
    if (unit.includes('millon')) {
      number = number * 1000000;
    } else if (unit === 'mil' || unit.includes('thousand')) {
      number = number * 1000;
    } else if (unit === 'k') {
      number = number * 1000;
    } else if (unit === 'm') {
      number = number * 1000000;
    }
    
    // Extract currency from original price
    const currencyMatch = originalPrice.match(/([€$£¥₹])|([A-Z]{3})/i);
    let currency = '';
    
    if (currencyMatch) {
      currency = (currencyMatch[1] || currencyMatch[2] || '').trim();
    } else if (textFormatMatch[3]) {
      // Map word-based currency to symbol
      const currencyWord = textFormatMatch[3].toLowerCase();
      if (currencyWord.includes('euro')) currency = '€';
      else if (currencyWord.includes('dollar')) currency = '$';
      else if (currencyWord.includes('pound')) currency = '£';
      else if (currencyWord.includes('dirham')) currency = 'AED';
    }
    
    // Format the number with M/K suffix
    let formattedNumber: string;
    if (number >= 1000000) {
      const millions = number / 1000000;
      formattedNumber = millions.toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (number >= 1000) {
      const thousands = number / 1000;
      formattedNumber = thousands.toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      formattedNumber = new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      }).format(number);
    }
    
    // Return with currency in appropriate position
    if (currency) {
      const currencyUpper = currency.toUpperCase();
      const needsSpace = currencyUpper.length > 2;
      const currencyFirst = currency === '$' || currency === '£';
      
      return currencyFirst 
        ? `${currencyUpper}${needsSpace ? ' ' : ''}${formattedNumber}`
        : `${formattedNumber} ${currencyUpper}`;
    }
    
    return formattedNumber;
  }
  
  // Standard numeric format handling (no text units)
  const cleanPrice = price.replace(/\s+/g, ' ').trim();
  const match = cleanPrice.match(/([€$£¥₹]|[A-Z]{3})?\s*([0-9]+(?:[,\.][0-9]+)*)\s*([€$£¥₹]|[A-Z]{3})?/i);
  
  if (!match) return originalPrice;
  
  // Extract currency (before or after number)
  const currencyBefore = match[1] || '';
  const numberStr = match[2];
  const currencyAfter = match[3] || '';
  const currency = (currencyBefore || currencyAfter).trim();
  
  // Clean the number string by removing separators
  let cleanNumber = numberStr;
  
  // Count periods and commas to determine format
  const periodCount = (cleanNumber.match(/\./g) || []).length;
  const commaCount = (cleanNumber.match(/,/g) || []).length;
  
  if (periodCount > 0 && commaCount > 0) {
    const lastPeriodIndex = cleanNumber.lastIndexOf('.');
    const lastCommaIndex = cleanNumber.lastIndexOf(',');
    
    if (lastCommaIndex > lastPeriodIndex) {
      // European: periods=thousands, comma=decimal (e.g., "1.000.000,50")
      cleanNumber = cleanNumber.replace(/\./g, '').replace(',', '.');
    } else {
      // US: commas=thousands, period=decimal (e.g., "1,000,000.50")
      cleanNumber = cleanNumber.replace(/,/g, '');
    }
  } else if (periodCount > 1) {
    // Multiple periods = European thousand separators (e.g., "3.000.000")
    cleanNumber = cleanNumber.replace(/\./g, '');
  } else if (commaCount > 1) {
    // Multiple commas = remove all
    cleanNumber = cleanNumber.replace(/,/g, '');
  } else if (periodCount === 1) {
    // Single period: check if thousand separator or decimal
    const parts = cleanNumber.split('.');
    if (parts[1] && parts[1].length === 3 && !commaCount) {
      // Likely thousand separator (e.g., "1.000")
      cleanNumber = cleanNumber.replace('.', '');
    }
  } else if (commaCount === 1) {
    // Single comma: likely European decimal
    const parts = cleanNumber.split(',');
    if (parts[1] && parts[1].length <= 2) {
      cleanNumber = cleanNumber.replace(',', '.');
    } else {
      // Comma with 3 digits = thousand separator
      cleanNumber = cleanNumber.replace(',', '');
    }
  }
  
  const number = parseFloat(cleanNumber);
  
  if (isNaN(number) || number <= 0) return originalPrice;
  
  // Determine currency position
  const currencyFirst = !!currencyBefore || currency === '$' || currency === '£';
  
  // Format with appropriate suffix
  let formattedNumber: string;
  
  if (number >= 1000000) {
    const millions = number / 1000000;
    formattedNumber = millions.toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (number >= 1000) {
    const thousands = number / 1000;
    formattedNumber = thousands.toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    formattedNumber = new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(number);
  }
  
  // Return with currency
  if (currency) {
    const needsSpace = currency.length > 2;
    return currencyFirst 
      ? `${currency}${needsSpace ? ' ' : ''}${formattedNumber}`
      : `${formattedNumber} ${currency}`;
  }
  
  return formattedNumber;
};

// Utility function to clean HTML tags and decode entities from text
const cleanText = (text: string): string => {
  if (!text) return '';
  
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
  };
  
  // Replace entities
  Object.entries(entities).forEach(([entity, replacement]) => {
    cleaned = cleaned.replace(new RegExp(entity, 'g'), replacement);
  });
  
  // Decode numeric entities (&#123; format)
  cleaned = cleaned.replace(/&#(\d+);/g, (match, num) => {
    return String.fromCharCode(parseInt(num));
  });
  
  // Trim whitespace and normalize spaces
  return cleaned.replace(/\s+/g, ' ').trim();
};

const PropertyCard: React.FC<PropertyCardProps> = memo(({ 
  property, 
  index = 0, 
  priority = false,
  lazy = true 
}) => {
  const { language, t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());

  // Filter out broken images - only show working ones
  const workingImages = useMemo(() => {
    const images = property.images
      .map((src, idx) => ({ src, originalIndex: idx }))
      .filter(({ originalIndex }) => !brokenImages.has(originalIndex));
    // If all images are broken, use a placeholder
    if (images.length === 0) {
      return [{ src: '/images/logo.jpeg', originalIndex: -1 }];
    }
    return images;
  }, [property.images, brokenImages]);

  // Clamp currentImageIndex if it goes out of bounds after filtering
  const safeImageIndex = useMemo(() => {
    if (currentImageIndex >= workingImages.length) return 0;
    return currentImageIndex;
  }, [currentImageIndex, workingImages.length]);
  
  // Touch tracking for card to differentiate tap from scroll
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  // Track last navigation time to prevent rapid clicks
  const lastNavTimeRef = useRef(0);
  const NAV_DEBOUNCE_MS = 50;

  // Get localized content
  const localizedTitle = useMemo(() => getLocalizedTitle(property, language), [property, language]);
  const localizedDescription = useMemo(() => getLocalizedDescription(property, language), [property, language]);

  const nextImage = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < NAV_DEBOUNCE_MS) return;
    lastNavTimeRef.current = now;
    setCurrentImageIndex((prev) => 
      prev >= workingImages.length - 1 ? 0 : prev + 1
    );
  }, [workingImages.length]);

  const prevImage = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < NAV_DEBOUNCE_MS) return;
    lastNavTimeRef.current = now;
    setCurrentImageIndex((prev) => 
      prev === 0 ? workingImages.length - 1 : prev - 1
    );
  }, [workingImages.length]);

  // Handle image load error - mark as broken and move to next working image
  const handleImageError = useCallback((originalIndex: number) => {
    setBrokenImages((prev) => {
      const next = new Set(prev);
      next.add(originalIndex);
      return next;
    });
    setImageLoaded(true);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoized badge and status colors for better performance
  const badgeColor = useMemo(() => {
    const colors = {
      'Villa': 'bg-gradient-to-r from-emerald-200 to-emerald-300 text-emerald-800 border border-emerald-300',
      'Apartment': 'bg-gradient-to-r from-sky-100 to-sky-200 text-sky-800 border border-sky-300',
      'Penthouse': 'bg-gradient-to-r from-[#D69F3F]/20 to-[#C4903A]/30 text-[#8B6914] border border-[#D69F3F]/40',
      'Townhouse': 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
      'Studio': 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300',
      'Commercial': 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300',
      'Land': 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300',
      'Farm': 'bg-gradient-to-r from-lime-100 to-lime-200 text-lime-800 border border-lime-300',
      'Factory': 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300',
      'default': 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border border-slate-300'
    };
    return colors[property.type as keyof typeof colors] || colors.default;
  }, [property.type]);

 
  // Generate location link based on country
  const locationLink = useMemo(() => {
    return property.country === 'Spain' ? '/properties/spain' : property.country === 'UAE' ? '/properties/dubai' : '/properties/international';
  }, [property.country]);

  const isInternationalProperty = useMemo(() => {
    return property.country !== 'Spain' && property.country !== 'UAE';
  }, [property.country]);

  const displayLocation = useMemo(() => {
    if (!isInternationalProperty || !property.country) return property.location;

    const normalizedLocation = property.location.toLowerCase();
    const normalizedCountry = property.country.toLowerCase();

    if (normalizedLocation.includes(normalizedCountry)) {
      return property.location;
    }

    return `${property.location}, ${property.country}`;
  }, [isInternationalProperty, property.country, property.location]);

  // Generate property slug for SEO-friendly URLs
  const propertySlug = useMemo(() => {
    return property.slug || createPropertySlug(property.title, property.id);
  }, [property.slug, property.title, property.id]);

  // Handle card click to navigate to property page
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('svg')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/properties/${propertySlug}`;
  }, [propertySlug]);
  
  // Handle touch start for scroll detection
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
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
  }, []);
  
  // Handle touch end - only navigate if it's a tap, not a scroll
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('svg') || !touchStartRef.current) {
      touchStartRef.current = null;
      return;
    }
    
    const touch = e.changedTouches[0];
    if (touch) {
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      // Consider it a tap if movement is less than 10px and duration less than 300ms
      if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/properties/${propertySlug}`;
      }
    }
    touchStartRef.current = null;
  }, [propertySlug]);


  return (
    <article 
      className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 focus-within:ring-2 focus-within:ring-[#D69F3F] focus-within:ring-opacity-50 w-[100%] max-w-full mx-auto cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {/* Image Container - Fixed aspect ratio for CLS prevention */}
      <div 
        className="relative h-48 xs:h-56 sm:h-64 overflow-hidden bg-gray-200"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Link href={`/properties/${propertySlug}`} className="block w-full h-full cursor-pointer group-image" aria-label={`${t('propertyCard.viewDetailsFor', 'View details for')} ${localizedTitle}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          
          <Image
            src={workingImages[safeImageIndex]?.src || '/images/logo.jpeg'}
            alt={`${localizedTitle} - ${property.location}`}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-150 cursor-pointer ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            loading={lazy ? 'lazy' : 'eager'}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              const origIdx = workingImages[safeImageIndex]?.originalIndex;
              if (origIdx !== undefined && origIdx >= 0) {
                handleImageError(origIdx);
              } else {
                // Placeholder itself failed, just show loaded state
                setImageLoaded(true);
              }
            }}
            unoptimized
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyuLdGV6XEAYI+kV8tqKnkk+V2s8fOEZ+jMRrL8xQ+SAAUAV6hsNLIxrN6/aKKKAEOj/9k="
          />
        </Link>
        
        {/* Image Navigation */}
        {workingImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white touch-manipulation"
              style={{ borderRadius: 0, zIndex: 20, pointerEvents: 'auto', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
              aria-label={t('propertyCard.previousImage', 'Previous image')}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white touch-manipulation"
              style={{ borderRadius: 0, zIndex: 20, pointerEvents: 'auto', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
              aria-label={t('propertyCard.nextImage', 'Next image')}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            
          </>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
        
        {/* Badges */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex gap-1 sm:gap-2 flex-wrap max-w-[calc(100%-80px)]">
          <span className="px-2 sm:px-3 py-1 text-xs font-bold shadow-lg bg-white/90 text-gray-800 border border-gray-200">
            {property.type}
          </span>
        </div>

        {/* Country Flag */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <div className="w-6 h-4 sm:w-8 sm:h-6 rounded-sm overflow-hidden border border-white/30 shadow-lg flex">
            {property.country === 'Spain' ? (
               <Image src={'/images/spain_flag.svg'} alt="Spain Flag" width={30} height={16} className="flex-shrink-0"/>
            ) : property.country === 'UAE' ? (
              <>
                <div className="w-1/4 bg-red-600 flex-shrink-0"></div>
                <div className="w-3/4 flex flex-col">
                  <div className="h-1/3 bg-green-600"></div>
                  <div className="h-1/3 bg-white"></div>
                  <div className="h-1/3 bg-black"></div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Hover Details */}
        <div className={`absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 transform transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <p className="text-white text-xs sm:text-sm leading-relaxed line-clamp-2">
            {cleanText(Array.isArray(localizedDescription) ? localizedDescription.join(' ') : localizedDescription)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 xs:p-4 sm:p-6">
        <div className="flex flex-row items-start justify-between gap-2 mb-1 xs:mb-2">
          <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#D69F3F]-600 transition-colors duration-300 line-clamp-2 flex-1">
            {cleanText(localizedTitle)}
          </h3>
          <div className="flex-shrink-0 ml-2">
            {property?.logo &&<Image 
              src={property?.logo || ""} 
              alt="Property Logo" 
              width={80} 
              height={80} 
              className='rounded object-contain'
              onError={(e) => {
                // Fallback to default logo if the property logo fails
                const img = e.target as HTMLImageElement;
                if (img.src !== "/images/logo.jpeg") {
                  img.src = "/images/logo.jpeg";
                }
              }}
            />}
          </div>
        </div>
        {/* Location Row */}
        <div className="flex items-center justify-between text-gray-600 mb-2 xs:mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-[#D69F3F]-500 flex-shrink-0 self-center" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <Link 
              href={locationLink}
              className="text-xs xs:text-sm truncate hover:text-[#D69F3F] transition-colors duration-300 hover:underline align-middle flex items-center"
              aria-label={`${t('propertyCard.viewAllPropertiesIn', 'View all properties in')} ${property.country}`}
            >
              {displayLocation}
            </Link>
          </div>
         
        </div>


        {/* Status and Listing Type */}
        <div className="flex items-center gap-2 mb-2 xs:mb-4 flex-wrap">
          {/* Buy/Rent Badge */}
          <span className={`px-2 py-1 text-xs font-medium shadow-sm ${
            property.property_type === 'buy' ? 'bg-green-50 text-green-700 border border-green-200' :
            property.property_type === 'rent' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-700 border border-slate-200'
          }`}>
            {property.property_type === 'buy' ? t('propertyCard.propertyType.buy', 'Buy') :
             property.property_type === 'rent' ? t('propertyCard.propertyType.rent', 'Rent') : property.property_type}
          </span>
          <span className={`px-2 py-1 text-xs font-medium shadow-sm ${
            property.status === 'sold' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
            property.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            property.status === 'negotiable' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-700 border border-slate-200'
          }`}>
            {property.status === 'sold' ? t('propertyCard.status.sold', 'Sold') :
             property.status === 'approved' ? t('propertyCard.status.available', 'Available') :
             property.status === 'negotiable' ? t('propertyCard.status.negotiable', 'Negotiable') : property.status}
          </span>
          {/* Only show listing type badge for buy properties */}
          {property.property_type === 'buy' && property.listing_type && (
            <span className={`px-2 py-1 text-xs font-medium shadow-sm ${
              property.listing_type === 'off-plan' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}>
              {property.listing_type === 'off-plan' ? t('propertyCard.listingType.offPlan', 'Off-Plan') : t('propertyCard.listingType.readyToMove', 'Ready to Move')}
            </span>
          )}
           <div className="flex items-center gap-1 flex-shrink-0 ml-3">
            <span className="text-[10px] xs:text-xs uppercase tracking-wide text-gray-400">{t('propertyCard.propertyId', 'Property ID')}:</span>
            <span className="text-xs xs:text-sm font-medium text-gray-700">{property.property_id}</span>
          </div>
        </div>
        {/* Property Features */}
        <div className="grid grid-cols-3 gap-1 xs:gap-2 sm:flex sm:items-center sm:justify-between text-[11px] xs:text-xs sm:text-sm text-gray-500 mb-3 xs:mb-4 sm:mb-6 border-t border-gray-100 pt-4 xs:pt-3 sm:pt-4 mt-4 sm:mt-0">
          {(() => {
            const beds = (property.beds as any) ?? 0;
            const shouldShowBeds = (typeof beds === 'string' && beds.trim() !== '' && beds.trim() !== '0') || (typeof beds === 'number' && beds > 0);
            return shouldShowBeds && (
              <div className="flex items-center text-center flex-col sm:flex-row" title={`${beds} ${t('propertyCard.bedrooms', 'Bedrooms')}`}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-1 text-gray-400 mb-1 sm:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-[11px] xs:text-xs sm:text-sm">{beds} {t('propertyCard.beds', 'Beds')}</span>
              </div>
            );
          })()}
          {(() => {
            const baths = (property.baths as any) ?? 0;
            const shouldShowBaths = (typeof baths === 'string' && baths.trim() !== '' && baths.trim() !== '0') || (typeof baths === 'number' && baths > 0);
            return shouldShowBaths && (
              <div className="flex items-center text-center flex-col sm:flex-row" title={`${baths} ${t('propertyCard.bathrooms', 'Bathrooms')}`}>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-1 text-gray-400 mb-1 sm:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] xs:text-xs sm:text-sm">{baths} {t('propertyCard.baths', 'Baths')}</span>
              </div>
            );
          })()}
          {property.area && property.area.toLocaleString() && (
            <div className="flex items-center text-center flex-col sm:flex-row" title={`${property.area} ${t('propertyCard.area', 'Area')}`}>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-1 text-gray-400 mb-1 sm:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="text-[11px] xs:text-xs sm:text-sm">{property.area.toLocaleString()} {t('propertyCard.area', 'Area')}</span>
            </div>
          )}
        </div>
        {/* Price and CTA - mobile stack, desktop row */}
        <div className="flex flex-col-reverse gap-2 xs:gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between mt-2">
          <Link 
            href={`/properties/${propertySlug}`}
            data-gtm-manual="true"
            onClick={() => {
              // Meta Pixel tracking
              trackButtonClick('View Details', { property_id: property.property_id || property.id, property_name: localizedTitle });
              
              // GA4 + dataLayer dual tracking
              trackPropertyView(
                property.id,
                localizedTitle,
                property.type,
                parseFloat(property.price?.replace(/[^\d.]/g, '') || '0'),
                property.location
              );

              // GTM tracking
              gtmTrackEvent('view_item', {
                event_category: 'property_engagement',
                event_label: localizedTitle,
                value: parseFloat(property.price?.replace(/[^\d.]/g, '') || '0'),
                custom_parameters: {
                  property_id: property.id,
                  property_title: localizedTitle,
                  property_type: property.type,
                  property_price: property.price,
                  property_location: property.location,
                  property_city: property.city,
                  property_country: property.country,
                  content_type: 'property',
                  currency: property.price?.includes('€') ? 'EUR' : 'AED',
                  interaction_type: 'view_details_click',
                  property_beds: property.beds,
                  property_baths: property.baths,
                  property_area: property.area
                }
              });
            }}
            className="group/btn relative bg-gradient-to-r from-gray-900 to-gray-800 hover:from-[#D69F3F] hover:to-[#C4903A] text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 font-semibold text-xs xs:text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover: overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:ring-opacity-50 text-center w-full sm:w-auto flex justify-center items-center"
            aria-label={`${t('propertyCard.viewDetailsFor', 'View details for')} ${localizedTitle}`}
          >
            <span className="relative z-10 flex w-full justify-center items-center">
              {t('propertyCard.viewDetails', 'View Details')}
              <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 ml-1 xs:ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 "></span>
          </Link>
          <div className="flex flex-col items-center sm:items-end w-full sm:w-auto mb-1 sm:mb-0 text-center sm:text-right">
            {property.status === 'sold' ? (
              <span className="text-xl xs:text-2xl sm:text-2xl font-bold text-rose-600 block">
                {t('propertyCard.sold', 'SOLD')}
              </span>
            ) : property.status === 'negotiable' ? (
              <span className="text-xl xs:text-2xl sm:text-2xl font-bold text-amber-600 block">
                {t('propertyCard.negotiable', 'NEGOTIABLE')}
              </span>
            ) : (
              <>
                {property.priceStarting ? (
                  <span className="text-xs font-medium text-yellow-600 mb-1">
                    {t('propertyCard.startingFrom', 'Starting from')}
                  </span>
                ) : null}
                <span 
                  className="text-xl xs:text-2xl sm:text-2xl font-extrabold block"
                  style={{ 
                    color: '#D69F3F',
                    WebkitTextFillColor: '#D69F3F',
                    textShadow: 'none'
                  }}
                >
                  {formatPrice(property.price, t)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
