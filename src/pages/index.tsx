import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import HeroSection from '../components/home/HeroSection';


// Lightweight placeholder
const SectionPlaceholder = () => <div className="h-48 bg-gray-50 animate-pulse" />;

// Aggressive code splitting - load all non-critical sections lazily
// const AboutSection = dynamic(() => import('@/components/home/AboutSection'), {
//   loading: SectionPlaceholder,
//   ssr: true
// });

// const ValutionSection = dynamic(() => import('@/components/home/ValutionSection'), {
//   loading: SectionPlaceholder,
//   ssr: true
// });

const FeaturedPropertiesDubai = dynamic(() => import('@/components/home/FeaturedPropertiesDubai'), {
  loading: () => <div className="h-96 bg-gray-50" />,
  ssr: false
});

const FeaturedPropertiesSpain = dynamic(() => import('@/components/home/FeaturedPropertiesSpain'), {
  loading: () => <div className="h-96 bg-gray-50" />,
  ssr: false
});


const FeaturedPropertiesInternational = dynamic(() => import('@/components/home/FeaturedPropertiesInternational'), {
  loading: () => <div className="h-96 bg-gray-50" />,
  ssr: false
});

const FeaturedLocations = dynamic(() => import('@/components/home/FeaturedLocations'), {
  loading: () => <div className="h-96 bg-gray-50" />,
  ssr: false
});

const BlogSection = dynamic(() => import('@/components/home/BlogSection'), {
  loading: SectionPlaceholder,
  ssr: false
});

const CTASection = dynamic(() => import('@/components/home/CTASection'), {
  loading: SectionPlaceholder,
  ssr: false
});



const HomePage = () => {


  // Enhanced structured data for better SEO
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Rino Properties",
      "alternateName": "Rino Real Estate",
      "description": "Premium luxury real estate agency specializing in high-end properties in Spain and Dubai. Expert guidance for property investment, luxury villas, and exclusive apartments.",
      "url": "https://rinoproperties.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://rinoproperties.com/properties?search={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Rino Properties",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
          "width": 600,
          "height": 200
        },
        "sameAs": [
          "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D",
          "https://www.facebook.com/p/Rino-Properties-61568133758317/",
          "https://ae.linkedin.com/company/rino-invest-properties",
          "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc"
        ]
      },

    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Rino Properties",
      "alternateName": ["Rino Real Estate", "Rino Properties Agency"],
      "description": "Leading luxury real estate agency specializing in premium properties in Spain and Dubai with expert investment guidance.",
      "url": "https://rinoproperties.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
        "width": 600,
        "height": 200
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+971-43-21-2433",
          "contactType": "customer service",
          "areaServed": ["AE", "ES"],
          "availableLanguage": ["en", "ar", "es"]
        }
      ],
      "address": [
        {
          "@type": "PostalAddress",
          "addressCountry": "AE",
          "addressRegion": "Dubai",
          "addressLocality": "Dubai"
        },
        {
          "@type": "PostalAddress", 
          "addressCountry": "ES",
          "addressRegion": "Madrid",
          "addressLocality": "Madrid"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D",
        "https://www.facebook.com/p/Rino-Properties-61568133758317/", 
        "https://ae.linkedin.com/company/rino-invest-properties",
        "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "156"
      },
      "priceRange": "€€€€"
    },
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Rino Properties",
      "description": "Premium real estate agency offering luxury properties and investment opportunities in Spain and Dubai",
      "url": "https://rinoproperties.com",
      "telephone": "+971-43-21-2433",
      "email": "ask@rinoproperties.com",
      "areaServed": [
        {
          "@type": "Country",
          "name": "Spain"
        },
        {
          "@type": "Country", 
          "name": "United Arab Emirates"
        }
      ],
      "serviceArea": [
        {
          "@type": "City",
          "name": "Madrid",
          "containedIn": "Spain"
        },
        {
          "@type": "City",
          "name": "Barcelona", 
          "containedIn": "Spain"
        },
        {
          "@type": "City",
          "name": "Dubai",
          "containedIn": "United Arab Emirates"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the best areas to buy property in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best areas to buy property in Dubai include JVC (Jumeirah Village Circle) for family-friendly communities with 8-10% ROI, Dubai Marina for waterfront luxury apartments, Palm Jumeirah for exclusive beachfront villas, Downtown Dubai for iconic skyscraper living, and Dubai Hills Estate for villa communities. Rino Properties specializes in all these premium locations with both off-plan and ready-to-move options."
          }
        },
        {
          "@type": "Question", 
          "name": "How much does it cost to buy an apartment in JVC Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Property prices in JVC (Jumeirah Village Circle) start from competitive rates for studio apartments, with 1-bedroom apartments in developments like South Residence JVC and City Apartments offering excellent value for investors. JVC is known for affordable luxury with amenities, family-friendly environment, and strong rental yields of 8-10%. Contact Rino Properties for current pricing and available units."
          }
        },
        {
          "@type": "Question",
          "name": "Does Rino Properties offer off-plan properties in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Rino Properties specializes in off-plan properties in Dubai with flexible payment plans. We offer exclusive off-plan apartments and villas from reputable developers like Binghatti, DAMAC, and Emaar in prime locations including JVC, Dubai Marina, and Business Bay. Off-plan properties offer attractive payment plans, lower prices compared to ready properties, and high capital appreciation potential."
          }
        },
        {
          "@type": "Question",
          "name": "What services does Rino Properties provide for property buyers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rino Properties offers comprehensive real estate services including: Free property valuation, Property sales (off-plan & ready-to-move), Investment consulting and ROI analysis, Legal advisory and documentation support, Property management services, After-sales concierge services, Market analysis and property tours, Multilingual support in 8+ languages including Arabic, English, Spanish, and Chinese."
          }
        },
        {
          "@type": "Question",
          "name": "Why choose Rino Properties for Dubai real estate investment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rino Properties is an award-winning real estate agency since 2020 with satisfied clients, 50+ expert advisors, offices in Deira, Dubai and Málaga, Spain, multilingual support in 8+ languages, exclusive access to off-plan and pre-launch properties, comprehensive investment advisory including ROI projections, full legal and documentation support, and dedicated after-sales property management. We are recognized as one of the best real estate companies in Dubai."
          }
        },
        {
          "@type": "Question",
          "name": "What is the average ROI on Dubai properties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dubai offers attractive rental yields typically ranging from 5-10% annually depending on location and property type. Areas like JVC offer 8-10% ROI, Dubai Marina provides 6-8% returns, and Downtown Dubai averages 5-7%. Off-plan properties can offer additional capital appreciation of 10-30% during construction. Rino Properties provides detailed ROI analysis and investment projections for all properties."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://rinoproperties.com"
        }
      ]
    }
  ];

  return (
    <>
      <Layout 
        title="Buy Property in Dubai & Spain | Luxury Real Estate Agency | Rino Properties"
        description="Rino Properties — #1 luxury real estate agency in Dubai & Spain. Buy off-plan & ready villas, apartments in JVC, Dubai Marina, Palm Jumeirah, Marbella, Madrid. 8-10% ROI. Free valuation."
        keywords="buy property Dubai, Dubai real estate, properties for sale Dubai, off-plan properties Dubai, JVC apartments for sale, Dubai Marina apartments, Palm Jumeirah villas, luxury real estate Dubai, properties in Spain, Marbella luxury villas, Madrid apartments for sale, real estate investment Dubai, Dubai property market 2026, best real estate company Dubai, buy apartment Dubai, villa for sale Dubai, rent property Dubai, commercial property Dubai, new developments Dubai, Emaar properties, DAMAC properties, Binghatti apartments, property valuation Dubai, Dubai freehold property, ROI Dubai real estate, property management Dubai, Rino Properties, apartment for sale JVC, off-plan payment plan Dubai, Dubai Hills Estate, Downtown Dubai property, Business Bay apartments"
        image="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png"
        url="https://rinoproperties.com"
        structuredData={structuredData}
        skipTitleSuffix={true}
      >
        
        <section id="main-content" className="overflow-hidden bg-white" aria-label="Main content">
          {/* Critical above-the-fold content */}
          <HeroSection />
          
          {/* Non-critical below-the-fold content with Suspense boundaries */}
          {/* <section aria-labelledby="about-section">
            <Suspense fallback={<div className="h-48 bg-gray-50 animate-pulse" aria-label="Loading about section" />}>
              <AboutSection />
            </Suspense>
          </section> */}
          
          {/* <section aria-labelledby="valuation-section">
            <Suspense fallback={<div className="h-48 bg-gray-50 animate-pulse" aria-label="Loading valuation section" />}>
              <ValutionSection />
            </Suspense>
          </section> */}
         
          
          <section aria-labelledby="properties-spain-section">
            <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" aria-label="Loading featured properties Spain" />}>
              <FeaturedPropertiesSpain />
            </Suspense>
          </section>

          <section aria-labelledby="properties-international-section">
            <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" aria-label="Loading featured properties International" />}>
              <FeaturedPropertiesInternational />
            </Suspense>
          </section>
          <section aria-labelledby="properties-dubai-section">
            <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" aria-label="Loading featured properties Dubai" />}>
              <FeaturedPropertiesDubai />
            </Suspense>
          </section>


          
          <section aria-labelledby="locations-section">
            <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" aria-label="Loading featured locations" />}>
              <FeaturedLocations />
            </Suspense>
          </section>
          
          <section aria-labelledby="blog-section">
            <Suspense fallback={<div className="h-48 bg-gray-50 animate-pulse" aria-label="Loading blog section" />}>
              <BlogSection />
            </Suspense>
          </section>
          
          <section aria-labelledby="cta-section">
            <Suspense fallback={<div className="h-48 bg-gray-50 animate-pulse" aria-label="Loading call to action" />}>
              <CTASection />
            </Suspense>
          </section>
        </section>
        

      </Layout>
    </>
  );
};

export default HomePage;