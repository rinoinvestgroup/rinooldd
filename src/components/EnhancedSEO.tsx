import React from 'react';
import Head from 'next/head';
import { Property } from '../data/properties';
import { Blog } from '../types/blog';
import { 
  generatePropertyStructuredData, 
  generateBlogStructuredData,
  generateCanonicalUrl,
  validateMetaTitle,
  truncateDescription
} from '../utils/seoUtils';
import { getDescriptionAsString } from '../utils/propertyUtils';

interface EnhancedSEOProps {
  // Basic SEO props
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  
  // Entity-specific props
  property?: Property;
  blog?: Blog;
  
  // Page type for auto-generation
  pageType?: 'property' | 'blog' | 'listing' | 'generic';
  
  // Additional structured data
  customStructuredData?: object;
}

const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  noIndex = false,
  property,
  blog,
  pageType = 'generic',
  customStructuredData
}) => {
  const siteName = "Rino Properties";
  const baseUrl = "https://rinoproperties.com";
  
  // Auto-generate SEO data based on entity type
  let finalTitle = title;
  let finalDescription = description;
  let finalKeywords = keywords;
  let finalImage = image;
  let finalUrl = url;
  let structuredData = customStructuredData;

  // Property-specific SEO
  if (property && pageType === 'property') {
    finalTitle = finalTitle || validateMetaTitle(
      property.meta_title || `${property.title} - Luxury Properties | ${siteName}`
    );
    finalDescription = finalDescription || truncateDescription(
      property.meta_description || property.longDescription || getDescriptionAsString(property.description)
    );
    finalKeywords = finalKeywords || property.keywords || 
      `${property.type}, ${property.city}, ${property.country}, luxury real estate, ${property.beds} bedroom property, ${property.area} property`;
    finalImage = finalImage || (property.images && property.images[0]) || 
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop';
    finalUrl = finalUrl || generateCanonicalUrl(`/properties/${property.slug || property.id}`);
    structuredData = structuredData || generatePropertyStructuredData(property);
  }
  
  // Blog-specific SEO
  if (blog && pageType === 'blog') {
    finalTitle = finalTitle || validateMetaTitle(
      blog.meta_title || `${blog.title} | ${siteName} Blog`
    );
    finalDescription = finalDescription || truncateDescription(
      blog.meta_description || blog.excerpt || `Read about ${blog.title} and discover expert insights on luxury real estate.`
    );
    finalKeywords = finalKeywords || blog.keywords || 
      `real estate blog, property insights, ${blog.category.toLowerCase()}, luxury properties, investment tips`;
    finalImage = finalImage || blog.bannerImage || 
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop';
    finalUrl = finalUrl || generateCanonicalUrl(`/blog/${blog.slug}`);
    structuredData = structuredData || generateBlogStructuredData(blog);
  }

  // Fallback defaults
  finalTitle = finalTitle || `${siteName} - Luxury Real Estate`;
  finalDescription = finalDescription || "Discover luxury properties in Spain, Dubai with Rino Properties. Your trusted partner in premium real estate investments.";
  finalKeywords = finalKeywords || "luxury real estate, properties Spain, properties Dubai, real estate investment, luxury villas, apartments";
  finalImage = finalImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop";
  finalUrl = finalUrl || baseUrl;

  // Ensure title includes site name
  const fullTitle = finalTitle.includes(siteName) ? finalTitle : `${finalTitle} | ${siteName}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={pageType === 'blog' ? 'article' : 'website'} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:locale" content="en_US" />
     
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rinoproperties" />
      <meta name="twitter:creator" content="@rinoproperties" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalTitle} />
      
      {/* Hreflang for International SEO */}
      <link rel="alternate" hrefLang="en" href={finalUrl} />
      <link rel="alternate" hrefLang="x-default" href={finalUrl} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content={siteName} />
      <meta name="publisher" content={siteName} />
      <meta name="language" content="English" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Blog-specific meta */}
      {pageType === 'blog' && blog && (
        <>
          <meta property="article:published_time" content={new Date(blog.publishedAt || blog.createdAt).toISOString()} />
          <meta property="article:modified_time" content={new Date(blog.updatedAt).toISOString()} />
          <meta property="article:author" content={blog.author} />
          <meta property="article:section" content={blog.category} />
          {blog.tags && (
            <meta property="article:tag" content={Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags} />
          )}
        </>
      )}
      
      {/* Property-specific meta */}
      {pageType === 'property' && property && (
        <>
          <meta property="product:price:amount" content={property.price.replace(/[^0-9]/g, '')} />
          <meta property="product:price:currency" content={property.country === 'Spain' ? 'EUR' : 'AED'} />
          <meta property="product:availability" content={property.status === 'sold' ? 'out of stock' : 'in stock'} />
          <meta property="product:condition" content="new" />
          <meta name="geo.region" content={property.country === 'Spain' ? 'ES' : 'AE'} />
          <meta name="geo.placename" content={property.city} />

              <meta name="geo.position" content={`${property.lat};${property.lng}`} />
              <meta name="ICBM" content={`${property.lat}, ${property.lng}`} />

        </>
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
};

export default EnhancedSEO;
