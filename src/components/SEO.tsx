// components/SEO.tsx
import React, { memo } from 'react';
import Head from 'next/head';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  structuredData?: object | object[];
  noIndex?: boolean;
  articleType?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  skipTitleSuffix?: boolean;
}

const SEO: React.FC<SEOProps> = memo(({ 
  title, 
  description = "Rino Properties — trusted luxury real estate agency in Dubai & Spain. Off-plan & ready apartments, villas, penthouses in JVC, Dubai Marina, Palm Jumeirah, Marbella & Madrid. Free valuation, 8-10% ROI.", 
  keywords = "luxury real estate Dubai, buy property Dubai, Dubai properties for sale, off-plan properties Dubai, JVC apartments, Dubai Marina apartments, Palm Jumeirah villas, properties in Spain, Marbella villas, Madrid real estate, real estate investment Dubai, property valuation Dubai, best real estate agency Dubai, Rino Properties", 
  image = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop", 
  url,
  structuredData,
  noIndex = false,
  articleType,
  publishedTime,
  modifiedTime,
  section,
  tags,
  skipTitleSuffix = false
}) => {
  const siteName = "Rino Properties";
  
  // Ensure we always have valid values (never undefined/null)
  const safeTitle = title || "Luxury Real Estate in Spain & Dubai";
  const safeDescription = description || "Rino Properties — trusted luxury real estate agency in Dubai & Spain. Off-plan & ready apartments, villas, penthouses in JVC, Dubai Marina, Palm Jumeirah, Marbella & Madrid. Free valuation, 8-10% ROI.";
  const safeKeywords = keywords || "luxury real estate Dubai, buy property Dubai, off-plan properties Dubai, properties in Spain, real estate investment, Rino Properties";
  
  const fullTitle = skipTitleSuffix ? safeTitle : (safeTitle.includes(siteName) ? safeTitle : `${safeTitle} | ${siteName}`);
  
  // Ensure absolute URL and optimal OG image dimensions
  let ogImage = image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop";
  
  // Convert relative URLs to absolute
  if (ogImage.startsWith('/')) {
    ogImage = `https://rinoproperties.com${ogImage}`;
  } else if (!ogImage.startsWith('http')) {
    ogImage = `https://rinoproperties.com/${ogImage}`;
  }
  
  // Add dimensions for Unsplash images if not already present
  if (ogImage.includes('unsplash.com') && !ogImage.includes('w=')) {
    ogImage = ogImage.includes('?') 
      ? `${ogImage}&w=1200&h=630&fit=crop`
      : `${ogImage}?w=1200&h=630&fit=crop`;
  }
  
  return (
    <>
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="keywords" content={safeKeywords} />
      
      {/* Google Site Verification */}
      <meta name="google-site-verification" content="Bbt8RfzqbKSnhT9uJfVkqg_OkLSbmKqJP9E-JfCPfUo" />
      
      {/* Enhanced Robot Directives */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="bingbot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Core Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="language" content="English" />
      <meta name="author" content="Rino Properties Real Estate Agency" />
      <meta name="publisher" content="Rino Properties" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Rino Properties. All rights reserved.`} />
      <meta name="revisit-after" content="1 day" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* App Configuration */}
      <meta name="theme-color" content="#D69F3F" />
      <meta name="msapplication-TileColor" content="#D69F3F" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Rino Properties" />
      <meta name="application-name" content="Rino Properties" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Performance Optimization - preconnects handled globally in _document.tsx */}
      <link rel="dns-prefetch" href="//embed.tawk.to" />
      
      {/* Enhanced Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#D69F3F" />

      {/* Enhanced Open Graph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:alt" content={`${siteName} - Luxury Real Estate Agency`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:type" content={articleType || "website"} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="es_ES" />
      <meta property="og:locale:alternate" content="ar_AE" />
      {url && <meta property="og:url" content={url} />}
      <meta property="article:author" content="Rino Properties" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Pinterest Rich Pins Meta Tags */}
      <meta property="og:see_also" content="https://rinoproperties.com" />
      <meta property="og:updated_time" content={modifiedTime || publishedTime || new Date().toISOString()} />
      {articleType === 'article' && (
        <>
          <meta property="article:publisher" content="https://rinoproperties.com" />
          <meta name="author" content="Rino Properties" />
        </>
      )}

      {/* Enhanced Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rinoproperties" />
      <meta name="twitter:creator" content="@rinoproperties" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={safeDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${siteName} - Luxury Real Estate Agency`} />
      <meta name="twitter:domain" content="rinoproperties.com" />
      {url && <meta name="twitter:url" content={url} />}

      {/* Canonical URL - always set for proper indexing */}
      <link rel="canonical" href={url || "https://rinoproperties.com"} />
      
      {/* Hreflang - x-default only since all languages serve from the same URL */}
      <link rel="alternate" hrefLang="x-default" href={url || "https://rinoproperties.com"} />
      <link rel="alternate" hrefLang="en" href={url || "https://rinoproperties.com"} />

      {/* Enhanced Structured Data */}
      {structuredData && (
        Array.isArray(structuredData) ? (
          structuredData.map((data, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
            />
          ))
        ) : (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )
      )}

      {/* Critical CSS - Add inline for above-the-fold content */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hero-section { contain: layout; }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
          }
          .loading-placeholder { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); }
        `
      }} />

    </Head>
  </>
  );
});

SEO.displayName = 'SEO';

export default SEO;
