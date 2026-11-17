/**
 * SEO utility functions for generating structured data and meta information
 */

import { Property } from '../data/properties';
import { Blog } from '../types/blog';

/**
 * Generate structured data for a property
 */
export const generatePropertyStructuredData = (property: Property): object => {
  const baseUrl = 'https://rinoproperties.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${baseUrl}/properties/${property.slug || property.id}`,
    name: property.title,
    description: property.longDescription || property.description,
    image: property.images,
    url: `${baseUrl}/properties/${property.slug || property.id}`,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.country === 'Spain' ? 'EUR' : 'AED',
      availability: property.status === 'sold' ? 'Sold Out' : 'Available'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressCountry: property.country === 'Spain' ? 'ES' : 'AE',
      streetAddress: property.location
    },
    geo: property ? {
      '@type': 'GeoCoordinates',
      latitude: property.lat,
      longitude: property.lng
    } : undefined,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitText: 'SQFT'
    },
    numberOfRooms: property.beds > 0 ? property.beds : undefined,
    numberOfBathroomsTotal: property.baths > 0 ? property.baths : undefined,
    propertyType: property.type,
    yearBuilt: property.yearBuilt,
    amenityFeature: property.amenities ? (() => {
      const amenitiesArray: string[] = Array.isArray(property.amenities) 
        ? property.amenities 
        : (property.amenities as string).split(',').map((item: string) => item.trim());
      return amenitiesArray.map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity
      }));
    })() : undefined,
    provider: {
      '@type': 'RealEstateAgent',
      name: 'Rino Properties',
      url: baseUrl,
      logo: `${baseUrl}/images/logo.jpeg`
    }
  };
};

/**
 * Generate structured data for a blog post
 */
export const generateBlogStructuredData = (blog: Blog): object => {
  const baseUrl = 'https://rinoproperties.com';
  const blogUrl = `${baseUrl}/blog/${blog.slug}`;
  
  // Calculate reading time (average 200 words per minute)
  const wordCount = blog.content?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${blogUrl}#article`,
        headline: blog.title,
        description: blog.excerpt || blog.meta_description,
        image: blog.bannerImage ? {
          '@type': 'ImageObject',
          url: blog.bannerImage,
          width: 1200,
          height: 630
        } : undefined,
        url: blogUrl,
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
        author: {
          '@type': 'Person',
          name: blog.author || 'Rino Properties',
          url: `${baseUrl}/#organization`
        },
        publisher: {
          '@id': `${baseUrl}/#organization`
        },
        mainEntityOfPage: {
          '@id': `${blogUrl}#webpage`
        },
        keywords: blog.tags ? (Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags) : '',
        articleSection: blog.category,
        wordCount: wordCount,
        timeRequired: `PT${readingTime}M`,
        inLanguage: 'en',
        isPartOf: {
          '@id': `${baseUrl}/blog#blog`
        },
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/ReadAction',
          userInteractionCount: blog.views || 0
        },
        about: {
          '@type': 'Thing',
          name: 'Real Estate',
          description: 'Luxury real estate market insights and property investment information'
        },
        articleBody: blog.excerpt || blog.meta_description,
        backstory: blog.excerpt,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.blog-content']
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${blogUrl}#webpage`,
        url: blogUrl,
        name: blog.title,
        description: blog.excerpt || blog.meta_description,
        inLanguage: 'en',
        isPartOf: {
          '@id': `${baseUrl}/#website`
        },
        breadcrumb: {
          '@id': `${blogUrl}#breadcrumb`
        },
        primaryImageOfPage: blog.bannerImage ? {
          '@type': 'ImageObject',
          url: blog.bannerImage,
          width: 1200,
          height: 630
        } : undefined,
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
        about: {
          '@id': `${blogUrl}#article`
        },
        potentialAction: {
          '@type': 'ReadAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: blogUrl,
            actionPlatform: [
              'http://schema.org/DesktopWebPlatform',
              'http://schema.org/MobileWebPlatform'
            ]
          }
        }
      },
      {
        '@type': 'RealEstateAgent',
        '@id': `${baseUrl}/#organization`,
        name: 'Rino Properties',
        alternateName: 'Rino Invest Asset S.L.',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo.jpeg`,
          width: 600,
          height: 60
        },
        description: 'Premium real estate services in Spain and Dubai, specializing in luxury properties, investment opportunities, and expert market guidance.',
        sameAs: [
          'https://www.facebook.com/p/Rino-Properties-61568133758317/',
          'https://www.instagram.com/rinoinvest_properties/',
          'https://ae.linkedin.com/company/rino-invest-properties',
          'https://www.tiktok.com/@rino.properties'
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+34-635-955-137',
            contactType: 'customer service',
            areaServed: 'ES',
            availableLanguage: ['English', 'Spanish', 'Arabic'],
            email: 'ask@rinoproperties.com'
          },
          {
            '@type': 'ContactPoint',
            telephone: '+971-43-21-2433',
            contactType: 'customer service',
            areaServed: 'AE',
            availableLanguage: ['English', 'Arabic'],
            email: 'ask@rinoproperties.com'
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${blogUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${baseUrl}/blog`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: blogUrl
          }
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Rino Properties',
        description: 'Premium Real Estate in Spain and Dubai',
        publisher: {
          '@id': `${baseUrl}/#organization`
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/properties?search={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };
};

/**
 * Generate SEO-friendly keywords from property data
 */
export const generatePropertyKeywords = (property: Property): string => {
  const city = property.city.toLowerCase();
  const country = property.country.toLowerCase();
  const location = property.location ? property.location.toLowerCase() : '';
  const type = property.type.toLowerCase();
  
  const keywords = [
    // Primary location-based keywords (for topical authority)
    `${type} for sale in ${city}`,
    `buy ${type} ${city}`,
    `${city} ${type} for sale`,
    `${city} real estate`,
    `${city} property market`,
    
    // Specific location within city
    location ? `${type} for sale in ${location}` : '',
    location ? `${location} real estate` : '',
    location ? `buy property in ${location}` : '',
    
    // Property specifications with location
    property.beds > 0 ? `${property.beds} bedroom ${type} in ${city}` : '',
    property.baths > 0 ? `${property.baths} bathroom ${type} ${city}` : '',
    property.area ? `${type} for sale ${property.area} ${city}` : '',
    
    // Listing type and status - location focused
    property.listing_type === 'off-plan' ? `off plan ${type} ${city}` : `ready ${type} ${city}`,
    property.listing_type === 'off-plan' ? `new ${type} projects ${city}` : '',
    
    // Investment keywords - location focused
    `${city} property investment`,
    `invest in ${city} real estate`,
    `${city} ${country} property`,
    `${country} real estate ${city}`,
    
    // Neighborhood and area keywords
    `${city} neighborhoods`,
    `best areas in ${city}`,
    `${city} property guide`
  ].filter(Boolean);

  // Add amenities as keywords
  if (property.amenities && property.amenities.length > 0) {
    const amenitiesArray: string[] = Array.isArray(property.amenities) 
      ? property.amenities 
      : (property.amenities as string).split(',').map((item: string) => item.trim());
    keywords.push(...amenitiesArray.slice(0, 3).map((a: string) => a.toLowerCase()));
  }

  // Add features as keywords
  if (property.features && property.features.length > 0) {
    const featuresArray: string[] = Array.isArray(property.features) 
      ? property.features 
      : (property.features as string).split(',').map((item: string) => item.trim());
    keywords.push(...featuresArray.slice(0, 3).map((f: string) => f.toLowerCase()));
  }

  return keywords.filter(Boolean).join(', ');
};

/**
 * Generate SEO-friendly keywords from blog data
 */
export const generateBlogKeywords = (blog: Blog): string => {
  const keywords = [
    'real estate blog',
    'property insights',
    blog.category.toLowerCase(),
    'luxury properties',
    'investment tips',
    'property news'
  ];

  // Add tags as keywords
  if (blog.tags) {
    const tags = Array.isArray(blog.tags) ? blog.tags : [blog.tags];
    keywords.push(...tags.map(tag => tag.toLowerCase()));
  }

  return keywords.filter(Boolean).join(', ');
};

/**
 * Generate a unique meta description for a blog post
 * Ensures no duplicate descriptions by using blog-specific details
 */
export const generateUniqueBlogDescription = (blog: Blog, localizedTitle?: string): string => {
  const title = localizedTitle || blog.title;
  const category = blog.category || 'Real Estate';
  const author = blog.author || 'Rino Properties';
  
  // Get tags for additional context
  let tagContext = '';
  if (blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0) {
    tagContext = ` covering ${blog.tags.slice(0, 2).join(', ')}`;
  }
  
  // Create a unique description combining blog-specific details
  let description = `${title} - Expert ${category.toLowerCase()} insights`;
  
  if (tagContext) {
    description += tagContext;
  }
  
  description += `. Written by ${author}. Read on Rino Properties Blog.`;
  
  return truncateDescription(description, 160);
};

/**
 * Generate canonical URL for a page
 * Ensures homepage has no trailing slash and follows Google's canonical guidelines
 */
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://rinoproperties.com';
  
  // Handle homepage - no trailing slash
  if (!path || path === '/' || path === '') {
    return baseUrl;
  }
  
  // Normalize path - remove trailing slash, ensure leading slash
  const normalizedPath = path
    .replace(/\/+$/, '') // Remove trailing slashes
    .replace(/^([^/])/, '/$1'); // Ensure leading slash
  
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Generate Open Graph image URL for property
 * Ensures absolute URL with optimal dimensions (1200x630 = 1.905:1) for social media
 */
export const generatePropertyOGImage = (property: Property): string => {
  if (property.images && property.images.length > 0) {
    let imageUrl = property.images[0];
    
    // Convert relative URLs to absolute
    if (imageUrl.startsWith('/')) {
      imageUrl = `https://rinoproperties.com${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      imageUrl = `https://rinoproperties.com/${imageUrl}`;
    }
    
    // Ensure exact 1200x630 dimensions for optimal social sharing
    // Pinterest, Facebook, LinkedIn, Twitter all require 1.91:1 aspect ratio
    if (imageUrl.includes('s3.') || imageUrl.includes('amazonaws.com')) {
      // For S3 images, they should already be optimized
      // If using AWS Lambda or CloudFront Functions, add ?w=1200&h=630&fit=cover
      return imageUrl;
    } else if (imageUrl.includes('unsplash.com')) {
      // Unsplash supports exact dimensions with smart cropping
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}w=1200&h=630&fit=crop&crop=entropy&q=85`;
    } else if (imageUrl.includes('cloudinary.com')) {
      // Cloudinary transformation for exact 1200x630 with fill mode
      return imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,g_auto,q_85/');
    } else if (imageUrl.includes('imgix.net')) {
      // Imgix supports exact dimensions
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}w=1200&h=630&fit=crop&crop=entropy&auto=format,compress`;
    }
    
    // For other images, return as-is (ideally they should be pre-optimized)
    return imageUrl;
  }
  
  // Fallback image with exact 1200x630 dimensions
  return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop&crop=entropy&q=85';
};

/**
 * Generate Open Graph image URL for blog
 * Ensures absolute URL with optimal dimensions (1200x630 = 1.905:1) for social media
 */
export const generateBlogOGImage = (blog: Blog): string => {
  if (blog.bannerImage) {
    let imageUrl = blog.bannerImage;
    
    // Convert relative URLs to absolute
    if (imageUrl.startsWith('/')) {
      imageUrl = `https://rinoproperties.com${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      imageUrl = `https://rinoproperties.com/${imageUrl}`;
    }
    
    // Apply same transformations as property images
    if (imageUrl.includes('unsplash.com')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}w=1200&h=630&fit=crop&crop=entropy&q=85`;
    } else if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill,g_auto,q_85/');
    } else if (imageUrl.includes('imgix.net')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      return `${imageUrl}${separator}w=1200&h=630&fit=crop&crop=entropy&auto=format,compress`;
    }
    
    return imageUrl;
  }
  
  return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&crop=entropy&q=85';
};

/**
 * Truncate text for meta descriptions
 */
export const truncateDescription = (text: string, maxLength: number = 160): string => {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

/**
 * Generate a unique meta description for a property
 * Ensures no duplicate descriptions by using property-specific details
 */
export const generateUniquePropertyDescription = (property: Property, localizedTitle?: string): string => {
  // Always generate a unique description using property-specific data
  const title = localizedTitle || property.title;
  const location = property.location || property.city;
  const beds = property.beds;
  const baths = property.baths;
  const area = property.area;
  const type = property.type.toLowerCase();
  const country = property.country;
  const price = property.price;
  const listingType = property.listing_type === 'off-plan' ? 'off-plan' : 'ready to move';
  
  // Create a unique description combining all property-specific details
  // Build bed/bath string, omitting if value is 0
  const bedBathParts: string[] = [];
  if (beds && beds > 0) bedBathParts.push(`${beds} bed`);
  if (baths && baths > 0) bedBathParts.push(`${baths} bath`);
  const bedBathStr = bedBathParts.length > 0 ? `${bedBathParts.join(', ')} ` : '';
  let description = `${title} - ${bedBathStr}${type} for sale in ${location}, ${country}. `;
  
  if (area) {
    description += `${area} property. `;
  }
  
  if (price && price !== 'Contact for price') {
    description += `Price: ${price}. `;
  }
  
  description += `${listingType.charAt(0).toUpperCase() + listingType.slice(1)} property. `;
  description += `Contact Rino Properties for details.`;
  
  return truncateDescription(description, 160);
};

/**
 * Clean and validate meta title
 */
export const validateMetaTitle = (title: string, maxLength: number = 60): string => {
  if (title.length <= maxLength) return title;
  
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};
