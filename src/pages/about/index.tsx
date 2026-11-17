import Head from 'next/head';
import Layout from '@/components/Layout';
import AboutPage from '@/components/about/About';

const Index = () => {
  // Structured data for About page
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Rino Properties",
      "description": "Learn about Rino Properties, a leading luxury real estate agency specializing in premium properties in Spain and Dubai with expert investment guidance.",
      "url": "https://rinoproperties.com/about",
      "mainEntity": {
        "@type": "Organization",
        "@id": "https://rinoproperties.com/#organization",
        "name": "Rino Properties",
        "alternateName": ["Rino Real Estate", "Rino Properties Agency", "Rino Invest Properties"],
        "description": "Premier luxury real estate agency offering exclusive properties and investment opportunities in Spain and Dubai. Trusted by clients worldwide for expert real estate services.",
        "url": "https://rinoproperties.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
          "width": 600,
          "height": 200
        },
        "image": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
        "telephone": "+971-43-21-2433",
        "email": "ask@rinoproperties.com",
        "address": [
          {
            "@type": "PostalAddress",
            "streetAddress": "Business Village Building – B, Office 330",
            "addressLocality": "Deira, Dubai",
            "addressRegion": "Dubai",
            "addressCountry": "AE"
          },
          {
            "@type": "PostalAddress",
            "streetAddress": "C/ Ancha del Carmen, 2",
            "addressLocality": "Málaga",
            "addressRegion": "Málaga",
            "addressCountry": "ES"
          }
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+971-43-21-2433",
            "contactType": "customer service",
            "email": "ask@rinoproperties.com",
            "areaServed": ["AE", "ES"],
            "availableLanguage": ["English", "Arabic", "Spanish", "French", "German", "Hindi", "Urdu", "Chinese"]
          },
          {
            "@type": "ContactPoint",
            "contactType": "sales",
            "telephone": "+34-635-955-137",
            "email": "ask@rinoproperties.com",
            "areaServed": ["AE", "ES"]
          }
        ],
        "sameAs": [
          "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D",
          "https://www.facebook.com/p/Rino-Properties-61568133758317/",
          "https://ae.linkedin.com/company/rino-invest-properties",
          "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc"
        ],
        "founder": {
          "@type": "Person",
          "name": "Mr Ferdinand Jordan"
        },
        "foundingDate": "2020",
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": "50"
        },
        "slogan": "Your Trusted Partner in Luxury Real Estate",
        "knowsAbout": [
          "Luxury Real Estate",
          "Property Investment",
          "Dubai Properties",
          "Spain Properties",
          "Real Estate Consulting",
          "Property Management",
          "JVC Properties",
          "Dubai Marina Properties",
          "Palm Jumeirah Real Estate",
          "Binghatti Apartments"
        ],
        "areaServed": [
          {
            "@type": "City",
            "name": "Dubai",
            "containedIn": {
              "@type": "Country",
              "name": "United Arab Emirates"
            }
          },
          {
            "@type": "City",
            "name": "Madrid",
            "containedIn": {
              "@type": "Country",
              "name": "Spain"
            }
          },
          {
            "@type": "City",
            "name": "Barcelona",
            "containedIn": {
              "@type": "Country",
              "name": "Spain"
            }
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "156",
          "bestRating": "5",
          "worstRating": "1"
        },
        "priceRange": "€€€€"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Rino Properties",
      "description": "Best real estate companies in Dubai and Spain. Premium real estate agency offering luxury properties, investment opportunities, and expert consultation services.",
      "url": "https://rinoproperties.com/about",
      "telephone": "+971-43-21-2433",
      "email": "ask@rinoproperties.com",
      "image": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
      "priceRange": "€€€€",
      "areaServed": [
        {
          "@type": "Country",
          "name": "United Arab Emirates"
        },
        {
          "@type": "Country",
          "name": "Spain"
        }
      ],
      "serviceArea": [
        {
          "@type": "City",
          "name": "Dubai",
          "description": "Specializing in JVC, Dubai Marina, Palm Jumeirah, Downtown Dubai, and Dubai Hills"
        },
        {
          "@type": "City",
          "name": "Madrid"
        },
        {
          "@type": "City",
          "name": "Barcelona"
        },
        {
          "@type": "City",
          "name": "Valencia"
        },
        {
          "@type": "City",
          "name": "Marbella"
        }
      ],
      "knowsLanguage": ["en", "ar", "es", "fr", "de", "hi", "ur", "zh"],
      "makesOffer": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Luxury Property Sales",
            "description": "Expert guidance in buying and selling luxury properties in Dubai and Spain"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Investment Consulting",
            "description": "Professional investment advice and market analysis for real estate investors"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Valuation",
            "description": "Free property valuation services for properties in Dubai and Spain"
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What makes Rino Properties one of the best real estate companies in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rino Properties stands out as one of the best real estate companies in Dubai due to our expertise in luxury properties, personalized service, multilingual support in 8 languages, and deep market knowledge of prime areas like JVC, Dubai Marina, and Palm Jumeirah. We've successfully served clients worldwide with a 4.8-star rating."
          }
        },
        {
          "@type": "Question",
          "name": "How long has Rino Properties been in business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rino Properties was founded in 2020 and has quickly established itself as a trusted luxury real estate agency in Spain and Dubai. Our experienced team brings decades of combined real estate expertise to serve our clients."
          }
        },
        {
          "@type": "Question",
          "name": "What languages does Rino Properties support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer multilingual support in 8 languages: English, Arabic, Spanish, French, German, Hindi, Urdu, and Chinese. This ensures we can serve our diverse international clientele effectively."
          }
        },
        {
          "@type": "Question",
          "name": "Does Rino Properties offer property investment consultation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide expert property investment consultation services including market analysis, ROI projections, and investment strategy development. Our team helps clients make informed decisions for both residential and commercial real estate investments in Dubai and Spain."
          }
        },
        {
          "@type": "Question",
          "name": "What areas in Dubai does Rino Properties specialize in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We specialize in Dubai's premium locations including JVC (Jumeirah Village Circle), Dubai Marina, Palm Jumeirah, Downtown Dubai, Dubai Hills Estate, Al Barsha, and International City. We offer expertise in both luxury and investment-grade properties across these areas."
          }
        },
        {
          "@type": "Question",
          "name": "How can I contact Rino Properties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can reach us at +971-43-21-2433 by phone or WhatsApp, email us at ask@rinoproperties.com, or use our website contact form. We also have offices in Deira, Dubai and Málaga, Spain to serve you better."
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
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About Us",
          "item": "https://rinoproperties.com/about"
        }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>About Rino Properties | Award-Winning Real Estate Agency Dubai & Spain</title>
        <meta name="description" content="Rino Properties — award-winning real estate agency since 2020. 50+ multilingual advisors, offices in Dubai & Málaga. RERA-licensed. Specializing in off-plan, luxury & investment properties." />
        <meta name="keywords" content="about Rino Properties, best real estate company Dubai, luxury real estate agency Dubai, RERA licensed broker Dubai, Ferdinand Jordan real estate, Rino Invest, property consultants Dubai Spain, multilingual real estate agents, off-plan specialists Dubai, JVC property experts, Dubai Marina brokers, Palm Jumeirah agents, Marbella real estate agency, real estate company Málaga, property management Dubai, investment advisory Dubai, licensed brokers Spain, free property consultation Dubai, Dubai real estate careers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Enhanced Open Graph */}
        <meta property="og:title" content="About Rino Properties | Leading Luxury Real Estate Agency" />
        <meta property="og:description" content="Award-winning agency since 2020. 50+ expert advisors, 8+ languages, satisfied clients. Offices in Deira, Dubai & Málaga, Spain. Founded by Ferdinand Jordan. Specializing in luxury properties, off-plan investments & property management." />
        <meta property="og:image" content="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png" />
        <meta property="og:url" content="https://rinoproperties.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rino Properties" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Rino Properties | Best Real Estate Companies in Dubai" />
        <meta name="twitter:description" content="Leading luxury real estate agency in Dubai and Spain. Expert services, satisfied clients." />
        <meta name="twitter:image" content="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://rinoproperties.com/about" />
        
        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </Head>

      <Layout 
        title="About Rino Properties | Award-Winning Real Estate Agency Dubai & Spain"
        description="Rino Properties — award-winning real estate agency since 2020. 50+ multilingual advisors, offices in Dubai & Málaga. RERA-licensed. Specializing in off-plan, luxury & investment properties."
      >
        <AboutPage />
      </Layout>
    </>
  );
};

export default Index;