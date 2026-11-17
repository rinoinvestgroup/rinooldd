import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from '@formspree/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { trackPageView, trackEvent, trackFormSubmission, trackLead, trackConversion, trackButtonClick, trackContact, GOOGLE_ADS_ID } from '@/utils/googleAnalytics';


const PropertySellingLanding = () => {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Formspree form hook
  const [state, handleFormspreeSubmit] = useForm("xqadwgwb");
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    investment: '',
    propertyArea: '',
    currentValue: ''
  });

  const [activeSection, setActiveSection] = useState('');
  
  // Gallery modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Success popup modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedLocation, setSubmittedLocation] = useState('');
  
  // Key Features slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Property Cards slider state  
  const [currentPropertySlide, setCurrentPropertySlide] = useState(0);
  
 
  // Responsive slider state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Auto-slide pause state
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Valuation popup function
  const openValuationPopup = () => {
    // Scroll to the form section
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle client-side hydration
  useEffect(() => {
    // Track page view via shared utility (fires to Google Ads + GTM dataLayer)
    trackPageView('/sell', 'Dubai Property Selling Landing Page');
    trackEvent('page_view', {
      event_category: 'Engagement',
      event_label: 'Property Selling Landing Page',
    });
    
    // Smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Responsive breakpoint detection
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    // Initial check
    handleResize();
    

    window.addEventListener('resize', handleResize);
    
    // Intersection Observer for active section tracking
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));

    // Intersection Observer for animated elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach((element) => animationObserver.observe(element));
    
    return () => {
      // Cleanup function
      document.documentElement.style.scrollBehavior = '';

      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      animationObserver.disconnect();
    };
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSuccessModal && e.key === 'Escape') {
        setShowSuccessModal(false);
        return;
      }
      
      if (!isModalOpen) {
        // Global keyboard navigation for sliders when modal is not open
        switch (e.key) {
          case 'ArrowLeft':
            if (e.ctrlKey) {
              setCurrentSlide(prev => prev === 0 ? 3 : prev - 1);
            }
            break;
          case 'ArrowRight':
            if (e.ctrlKey) {
              setCurrentSlide(prev => prev === 3 ? 0 : prev + 1);
            }
            break;
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex, showSuccessModal]);

  // Handle body scroll when success modal is open
  useEffect(() => {
    if (showSuccessModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showSuccessModal]);

  // Auto-slide functionality for key features slider
  useEffect(() => {
    if (isSliderPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide === 3 ? 0 : prevSlide + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isSliderPaused]);

  // Auto-slide functionality for property cards slider
  useEffect(() => {
    if (isSliderPaused) return;
    
    const interval = setInterval(() => {
      setCurrentPropertySlide(prevSlide => (prevSlide === 2 ? 0 : prevSlide + 1));
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isSliderPaused]);

 
  // Custom submit handler that combines form data with Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track form submission start via shared utility
    trackEvent('form_submit_start', {
      event_category: 'Lead Generation',
      event_label: 'Property Valuation Form',
    });
    
    // Create FormData object for Formspree
    const formDataObj = new FormData(e.target as HTMLFormElement);
    
    // Call Formspree submit handler
    await handleFormspreeSubmit(formDataObj);

     setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        investment: '',
        propertyArea: '',
        currentValue: ''
      });
    
  };

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
    
    // Track FAQ interactions via shared utility
    trackEvent('faq_toggle', {
      event_category: 'User Engagement',
      event_label: `FAQ Item ${index + 1}`,
      value: openFaq === index ? 0 : 1,
    });
  };

  // Reset form when submission is successful
  useEffect(() => {
    if (state.succeeded) {
      // Store the submitted location before resetting form
      setSubmittedLocation(formData.message || 'Dubai');
      
      // Track successful form submission via shared utility
      trackFormSubmission('Property Valuation Form', 'sell_valuation', {
        property_location: formData.message || 'Dubai',
        property_type: formData.investment || 'Not specified',
      });

      // Track lead generation
      trackLead('property_valuation', 10, 'sell_landing_page', {
        property_location: formData.message || 'Dubai',
        property_type: formData.investment || 'Not specified',
      });

      // Track conversion for Google Ads
      trackConversion('sell_valuation_lead', 1, 'AED', `lead_${Date.now()}`);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        investment: '',
        propertyArea: '',
        currentValue: ''
      });
      // Show success modal
      setShowSuccessModal(true);
    }
  }, [state.succeeded]);


  return (
    <>
      <Head>
        <title>{t('sell.head.title', 'Sell Your Dubai Property Fast | FREE Valuation | Rino Properties')}</title>
        
        <meta name="description" content={t('sell.head.description', 'Sell your Dubai property fast with Rino Properties. FREE market valuation, professional photography, 24/7 marketing on Bayut, Property Finder & Dubizzle. RERA-licensed agents. Dubai Marina, Downtown, Palm Jumeirah specialists.')} />
        <meta name="keywords" content="sell property Dubai, sell apartment Dubai, sell villa Dubai, Dubai property valuation free, real estate agent sell Dubai, RERA licensed broker Dubai, sell house Dubai Marina, sell property Downtown Dubai, sell villa Palm Jumeirah, property listing Dubai, sell penthouse Dubai, Dubai property market price, sell off-plan Dubai, property resale Dubai, quick sale Dubai property, sell luxury property Dubai, Dubai real estate commission, sell house Dubai Hills, DLD fees Dubai, property handover Dubai" />
        
        {/* Enhanced Open Graph tags */}
        <meta property="og:title" content={t('sell.head.ogTitle', 'Sell Your Dubai Property Fast - Free Valuation & Expert Service ')} />
        <meta property="og:description" content={t('sell.head.ogDescription', 'Professional Dubai property selling services. FREE valuation, expert marketing, 24/7 support. Specializing in premium locations: Downtown, Marina, JLT, Business Bay, Palm Jumeirah. Contact us today!')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://rinoproperties.com/sell/images/hero.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Luxury Dubai property with city skyline - Rino Properties real estate services" />
        <meta property="og:url" content="/sell" />
        <meta property="og:site_name" content="Rino Properties - Dubai Real Estate" />
        <meta property="og:locale" content="en_AE" />
        
        {/* Enhanced Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rinoproperties" />
        <meta name="twitter:creator" content="@rinoproperties" />
        <meta name="twitter:title" content={t('sell.head.twitterTitle', 'Sell Your Dubai Property Fast - Free Valuation ')} />
        <meta name="twitter:description" content={t('sell.head.twitterDescription', 'Professional Dubai property selling services. FREE valuation, expert marketing, 24/7 support. Specializing in Downtown, Marina, JLT, Business Bay, Palm Jumeirah.')} />
        <meta name="twitter:image" content="/sell/images/hero.webp" />
        <meta name="twitter:image:alt" content="Dubai luxury property selling services by Rino Properties" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="Rino Properties Real Estate" />
        <meta name="publisher" content="Rino Properties" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        
        {/* Geo and Location tags */}
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai, United Arab Emirates" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />
        <meta name="DC.title" content="Sell Your Dubai Property Fast - Rino Properties" />
        
        {/* Business/Contact Information */}
        <meta name="contact" content="tiary@rinoproperties.com" />
        <meta name="email" content="tiary@rinoproperties.com" />
        <meta name="phone" content="+971 50 953 2889" />
        <meta name="address" content="Business Village Building B, Office 330, Deira, Dubai, UAE" />
        
        {/* Mobile and accessibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Rino Properties Dubai" />
        
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Canonical and alternate links */}
        <link rel="canonical" href="https://rinoproperties.com/sell" />
        <link rel="alternate" hrefLang="en-ae" href="https://rinoproperties.com/sell" />
        <link rel="alternate" hrefLang="en" href="https://rinoproperties.com/sell" />
        <link rel="alternate" hrefLang="x-default" href="https://rinoproperties.com/sell" />
        <style jsx global>{`
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          /* Smooth transitions for modal */
          body.modal-open {
            overflow: hidden;
          }
          /* Custom scrollbar for webkit browsers */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          ::-webkit-scrollbar-thumb {
            background: #EDDDC5;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #D69F3F;
          }

          /* Custom Keyframe Animations */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3) translateY(50px);
            }
            50% {
              opacity: 1;
              transform: scale(1.1) translateY(-10px);
            }
            70% {
              transform: scale(0.9) translateY(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: 200px 0;
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }

          @keyframes floating {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          /* Intersection Observer Animation Classes */
          .animate-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.6s ease-out;
          }

          .animate-on-scroll.in-view {
            opacity: 1;
            transform: translateY(0);
          }

          /* Enhanced hover effects */
          .card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }

          .price-highlight {
            background: linear-gradient(45deg, #EDDDC5, #e7dfcf);
            -webkit-background-clip: text;
            background-clip: text;
            animation: pulse 2s infinite;
          }
        `}</style>
        
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "RealEstateAgent",
                  "@id": "https://rinoproperties.com/#organization",
                  "name": "Rino Properties",
                  "alternateName": "Rino Invest Group",
                  "url": "https://rinoproperties.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://rinoproperties.com/images/logo.jpeg",
                    "width": 600,
                    "height": 60
                  },
                  "description": "Professional property selling services in Dubai. We offer free valuations, expert marketing, and comprehensive support for selling luxury properties in Dubai.",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Business Village Building - B, Office 330",
                    "addressLocality": "Deira",
                    "addressRegion": "Dubai",
                    "addressCountry": "AE"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "25.2571945",
                    "longitude": "55.3266669"
                  },
                  "contactPoint": [
                    {
                      "@type": "ContactPoint",
                      "telephone": "+971-50-953-2889",
                      "contactType": "customer service",
                      "areaServed": "AE",
                      "availableLanguage": ["English", "Arabic"],
                      "email": "tiary@rinoproperties.com",
                      "contactOption": "TollFree"
                    },
                    {
                      "@type": "ContactPoint",
                      "telephone": "+971-43-21-2433",
                      "contactType": "customer service",
                      "areaServed": "AE",
                      "availableLanguage": ["English", "Arabic"],
                      "email": "ask@rinoproperties.com"
                    }
                  ],
                  "sameAs": [
                    "https://www.facebook.com/p/Rino-Properties-61568133758317/",
                    "https://www.instagram.com/rinoinvest_properties/",
                    "https://ae.linkedin.com/company/rino-invest-properties",
                    "https://www.tiktok.com/@rino.properties",
                    "https://www.propertyfinder.ae/en/broker/rino-invest-group-ltd-dubai-branch-11009",
                    "https://www.bayut.com/companies/rino-invest-group-107075/",
                    "https://dubai.dubizzle.com/property-agencies/rino-invest-group-100885/"
                  ],
                  "priceRange": "$$$$",
                  "areaServed": [
                    {
                      "@type": "City",
                      "name": "Dubai",
                      "containedIn": {
                        "@type": "Country",
                        "name": "United Arab Emirates"
                      }
                    }
                  ],
                  "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                    "opens": "09:00",
                    "closes": "18:00"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "150",
                    "bestRating": "5",
                    "worstRating": "1"
                  }
                },
                {
                  "@type": "Service",
                  "@id": "https://rinoproperties.com/sell#service",
                  "name": "Property Selling & Valuation Services",
                  "description": "Comprehensive property selling services in Dubai including free professional valuation, expert marketing, legal support, and complete transaction management.",
                  "provider": {
                    "@id": "https://rinoproperties.com/#organization"
                  },
                  "areaServed": {
                    "@type": "City",
                    "name": "Dubai",
                    "containedIn": {
                      "@type": "Country",
                      "name": "United Arab Emirates"
                    }
                  },
                  "serviceType": "Real Estate Property Selling",
                  "availableChannel": {
                    "@type": "ServiceChannel",
                    "serviceUrl": "https://rinoproperties.com/sell",
                    "servicePhone": {
                      "@type": "ContactPoint",
                      "telephone": "+971-50-953-2889",
                      "contactType": "customer service"
                    }
                  },
                  "offers": [
                    {
                      "@type": "Offer",
                      "name": "Free Property Valuation",
                      "description": "Professional property valuation service at no cost",
                      "price": "0",
                      "priceCurrency": "AED",
                      "availability": "https://schema.org/InStock",
                      "validFrom": "2024-01-01"
                    },
                    {
                      "@type": "Offer",
                      "name": "Property Marketing Services",
                      "description": "Comprehensive marketing across multiple platforms including Bayut, Property Finder, and Dubizzle",
                      "availability": "https://schema.org/InStock"
                    },
                    {
                      "@type": "Offer",
                      "name": "24/7 Customer Support",
                      "description": "Round-the-clock support for all property selling needs",
                      "availability": "https://schema.org/InStock"
                    }
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Dubai Property Selling Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Apartment Selling",
                          "description": "Professional services for selling apartments in Dubai"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Villa Selling",
                          "description": "Luxury villa selling services in premium Dubai locations"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Townhouse Selling",
                          "description": "Expert townhouse selling services"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Penthouse Selling",
                          "description": "Premium penthouse selling services"
                        }
                      }
                    ]
                  }
                },
                {
                  "@type": "WebPage",
                  "@id": "https://rinoproperties.com/sell#webpage",
                  "url": "https://rinoproperties.com/sell",
                  "name": "Sell Dubai Property Fast - FREE Valuation ",
                  "description": "Sell your Dubai property fast with Rino Properties. FREE valuation, expert marketing & 24/7 support. Specializing in Dubai Marina, Downtown & more.",
                  "inLanguage": "en",
                  "isPartOf": {
                    "@id": "https://rinoproperties.com/#website"
                  },
                  "about": {
                    "@id": "https://rinoproperties.com/sell#service"
                  },
                  "breadcrumb": {
                    "@id": "https://rinoproperties.com/sell#breadcrumb"
                  },
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://rinoproperties.com/sell/images/hero.webp",
                    "width": 1200,
                    "height": 630
                  },
                  "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": ["#hero", "#overview", "#why-choose-us"]
                  },
                  "potentialAction": {
                    "@type": "TradeAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://rinoproperties.com/sell",
                      "actionPlatform": [
                        "http://schema.org/DesktopWebPlatform",
                        "http://schema.org/MobileWebPlatform"
                      ]
                    },
                    "object": {
                      "@type": "Product",
                      "name": "Real Estate Property"
                    }
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://rinoproperties.com/sell#breadcrumb",
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
                      "name": "Sell Property",
                      "item": "https://rinoproperties.com/sell"
                    }
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://rinoproperties.com/#website",
                  "url": "https://rinoproperties.com",
                  "name": "Rino Properties",
                  "description": "Premium Real Estate Services in Dubai",
                  "publisher": {
                    "@id": "https://rinoproperties.com/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://rinoproperties.com/properties?search={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "FAQPage",
                  "@id": "https://rinoproperties.com/sell#faq",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "How long does it take to sell a property in Dubai?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "With Rino Properties' expert marketing and extensive buyer network, properties typically sell within 30-90 days depending on location, pricing, and market conditions. Our fast-track service can accelerate this timeline significantly."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Is the property valuation really free?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, we provide a completely free professional property valuation with no obligations. Our certified experts will assess your property's current market value based on location, condition, and recent comparable sales."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What areas in Dubai do you cover?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We cover all major Dubai areas including Dubai Marina, Downtown Dubai, JLT, Business Bay, Palm Jumeirah, Dubai Hills Estate, Emirates Hills, JBR, DIFC, and many more premium locations across the emirate."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What are the costs involved in selling a property?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our transparent pricing includes professional photography, marketing across multiple platforms, legal support, and transaction management. There are no hidden fees, and we only succeed when you do. Contact us for a detailed cost breakdown specific to your property."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Do you help with the paperwork and legal process?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Absolutely! We handle all aspects of the selling process including RERA documentation, DLD transfer, NOC processing, DEWA clearance, and mortgage settlements. Our team ensures a smooth, compliant transaction from start to finish."
                      }
                    }
                  ]
                },
                {
                  "@type": "Organization",
                  "name": "Rino Properties",
                  "brand": {
                    "@type": "Brand",
                    "name": "Rino Properties",
                    "logo": "https://rinoproperties.com/images/logo.jpeg"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "150",
                    "bestRating": "5",
                    "worstRating": "1"
                  }
                }
              ]
            })
          }}
        />
      </Head>

      {/* Common Header */}
      <Header />
      
      <div className="min-h-screen bg-gray-900 text-white" suppressHydrationWarning>

        {/* Hero Section - Sell Your Property */}
        <section id="hero" className="relative bg-gray-900 text-white min-h-screen flex items-center overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat lg:bg-fixed"
            style={{
              backgroundImage: "url('/sell/images/bg.webp')",
              filter: "brightness(0.3)"
            }}
          />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-[#D69F3F]/30 z-5"></div>
          
          {/* Floating Elements - Hidden on very small screens */}
          <div className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-[#EDDDC5]/10 rounded-full blur-xl animate-pulse hidden sm:block"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 sm:w-32 sm:h-32 bg-[#D69F3F]/20 rounded-full blur-2xl animate-pulse delay-1000 hidden sm:block"></div>
          
          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16">
              
              {/* Left Side - Enhanced Content */}
              <div className="flex-1 text-center xl:text-left animate-on-scroll max-w-2xl xl:max-w-none">
                
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal mb-4 sm:mb-6 leading-tight ">
                  {t('sell.hero.title', 'Sell Your')}{' '}
                  <span className="text-transparent text-white">
                    {t('sell.hero.titleHighlight', 'Property Fast')}
                  </span>
                </h1>
                
                <div className="mb-6 sm:mb-8 max-w-xl mx-auto xl:mx-0">
                  <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg text-gray-200 font-light leading-relaxed mb-3 sm:mb-4">
                    {t('sell.hero.subtitle', 'Stress-free selling with guaranteed results. We handle everything from valuation to closing.')}
                  </p>
                  
                  {/* Key Features */}
                  <div className="flex flex-col space-y-2 sm:grid sm:grid-cols-1 sm:gap-3 text-xs xs:text-sm sm:text-base text-gray-300">
                    <div className="flex items-center space-x-2 justify-center xl:justify-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#EDDDC5] rounded-full flex-shrink-0"></div>
                      <span>{t('sell.hero.features.freeValuation', 'FREE Professional Valuation')}</span>
                    </div>
                   
                    <div className="flex items-center space-x-2 justify-center xl:justify-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#EDDDC5] rounded-full flex-shrink-0"></div>
                      <span>{t('sell.hero.features.noHiddenFees', 'No Hidden Fees')}</span>
                    </div>
                    <div className="flex items-center space-x-2 justify-center xl:justify-start sm:col-span-2 sm:justify-center xl:col-span-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#EDDDC5] rounded-full flex-shrink-0"></div>
                      <span>{t('sell.hero.features.fastSale', 'Fast Sale Guarantee')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center  xl:justify-start max-w-md mx-auto xl:max-w-none">
                  <button 
                    onClick={() => {
                      openValuationPopup();
                      trackEvent('cta_click', {
                        event_category: 'Lead Generation',
                        event_label: 'Hero Get Free Valuation Button',
                        value: 8,
                      });
                    }}
                    className="group relative !rounded-xl bg-gradient-to-r from-[#D69F3F] to-[#D69F3F]  text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-center transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                  >
                    <span className="relative z-10">{t('sell.hero.buttons.getFreeValuation', 'Get Free Valuation')}</span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  <a 
                    href="tel:97143212433" 
                    onClick={() => trackEvent('phone_call', {
                      event_category: 'Contact',
                      event_label: 'Hero Section Call Button',
                      value: 5,
                    })}
                    className="group border-2 border-white hover:bg-white hover:text-gray-900 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-center transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                      <span>{t('sell.hero.buttons.callNow', 'Call Now')}</span>
                    </span>
                  </a>
                </div>
              
              </div>

              {/* Right Side - Enhanced Contact Form */}
              <div className="flex-shrink-0 w-full max-w-md lg:max-w-lg xl:max-w-md 2xl:max-w-lg animate-on-scroll mt-8 xl:mt-0">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
                  {/* Form Header */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-normal text-gray-900 mb-2">
                      {t('sell.form.title', 'Free Property Valuation')}
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-xs xl:text-sm">
                      {t('sell.form.subtitle', 'Get your property valued by certified experts - No cost, no obligation')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Success/Error Messages */}
                    {state.succeeded && (
                      <div className="p-3 sm:p-4 rounded-xl bg-green-50 text-green-700 text-center text-xs sm:text-sm border border-green-200 flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span>{t('sell.form.successMessage', 'Thank you! We will contact you shortly.')}</span>
                      </div>
                    )}
                    
                    {/* Full Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder={t('sell.form.fields.fullName', 'Full Name')}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300 text-sm sm:text-base"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder={t('sell.form.fields.email', 'Email Address')}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300 text-sm sm:text-base"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={t('sell.form.fields.phone', 'Phone Number')}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300 text-sm sm:text-base"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    {/* Property Type */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <select
                        name="investment"
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white transition-all hover:border-gray-300 appearance-none text-sm sm:text-base"
                        value={formData.investment}
                        onChange={e => setFormData({ ...formData, investment: e.target.value })}
                      >
                        <option value="">{t('sell.form.propertyTypes.select', 'Select Property Type')}</option>
                        <option value="studio">{t('sell.form.propertyTypes.studio', 'Studio')}</option>
                        <option value="1-bedroom">{t('sell.form.propertyTypes.oneBedroom', '1 Bedroom')}</option>
                        <option value="2-bedroom">{t('sell.form.propertyTypes.twoBedroom', '2 Bedroom')}</option>
                        <option value="3-bedroom">{t('sell.form.propertyTypes.threeBedroom', '3 Bedroom')}</option>
                        <option value="4-bedroom">{t('sell.form.propertyTypes.fourPlusBedroom', '4+ Bedroom')}</option>
                        <option value="villa">{t('sell.form.propertyTypes.villa', 'Villa')}</option>
                        <option value="townhouse">{t('sell.form.propertyTypes.townhouse', 'Townhouse')}</option>
                        <option value="penthouse">{t('sell.form.propertyTypes.penthouse', 'Penthouse')}</option>
                        <option value="commercial">{t('sell.form.propertyTypes.commercial', 'Commercial')}</option>
                        <option value="other">{t('sell.form.propertyTypes.other', 'Other')}</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="message"
                        placeholder={t('sell.form.fields.location', 'Property Location (e.g. Downtown Dubai, Marina)')}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300 text-sm sm:text-base"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="w-full bg-gradient-to-r from-[#D69F3F] to-[#D69F3F]  text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      {state.submitting ? (
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>{t('sell.form.submitting', 'Submitting...')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{t('sell.form.submit', 'Get Free Property Valuation')}</span>
                        </span>
                      )}
                    </button>
                  </form>

                  {/* Disclaimer */}
                  <p className="text-xs text-gray-500 mt-3 sm:mt-4 text-center leading-relaxed">
                    {t('sell.form.disclaimer', '*Free valuation subject to property inspection. All information treated confidentially.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Project Section */}
        <section id="overview" className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-200 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          
            <div className="flex flex-col xl:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
              
              {/* Left: Enhanced Image Section */}
              <div className="xl:w-1/2 w-full">
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative rounded-3xl overflow-hidden">
                    <img 
                      src="/sell/images/contruct.webp" 
                      alt="Dubai Property Selling Services" 
                      className="w-full h-64 sm:h-80 md:h-96 object-cover"
                    />
                  </div>
                  
                  {/* Floating Card */}
                  <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{t('sell.overview.floatingCard.title', 'FREE Valuation')}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{t('sell.overview.floatingCard.subtitle', 'No obligation')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Enhanced Content */}
              <div className="xl:w-1/2 w-full mt-8 xl:mt-0">
                <div className="space-y-4 sm:space-y-6">
                  {/* Main Title */}
                  <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 leading-tight">
                    {t('sell.overview.title', 'Ready to Sell Your')} 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D69F3F] to-[#D69F3F]">{t('sell.overview.titleHighlight', ' Property')}</span>?
                  </h2>
                  
                  {/* Description */}
                  <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-gray-600 leading-relaxed">
                    {t('sell.overview.description', 'Ready to sell your property in Dubai with Rino Properties? We have a simple, proven process that makes selling your property easier and more profitable than ever before.')}
                  </p>
                  
                  {/* Process Steps */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#D69F3F] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-normal flex-shrink-0">1</div>
                      <div>
                        <h4 className="text-base sm:text-lg lg:text-xl font-normal text-gray-900 mb-1">{t('sell.overview.process.step1Title', 'Submit Property Details')}</h4>
                        <p className="text-gray-600 text-xs xs:text-sm">{t('sell.overview.process.step1Description', 'Fill out our simple form with your property information')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#D69F3F] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-normal flex-shrink-0">2</div>
                      <div>
                        <h4 className="text-base sm:text-lg lg:text-xl font-normal text-gray-900 mb-1">{t('sell.overview.process.step2Title', 'Professional Valuation')}</h4>
                        <p className="text-gray-600 text-xs xs:text-sm">{t('sell.overview.process.step2Description', 'Our experts provide accurate market value assessment')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#D69F3F] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-normal flex-shrink-0">3</div>
                      <div>
                        <h4 className="text-base sm:text-lg lg:text-xl font-normal text-gray-900 mb-1">{t('sell.overview.process.step3Title', 'Strategic Marketing')}</h4>
                        <p className="text-gray-600 text-xs xs:text-sm">{t('sell.overview.process.step3Description', 'Multi-platform marketing reaching thousands of buyers')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#D69F3F] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-normal flex-shrink-0">4</div>
                      <div>
                        <h4 className="text-base sm:text-lg lg:text-xl font-normal text-gray-900 mb-1">{t('sell.overview.process.step4Title', 'Successful Closure')}</h4>
                        <p className="text-gray-600 text-xs xs:text-sm">{t('sell.overview.process.step4Description', 'Our expertise ensures successful sales from start to finish')}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="pt-2 sm:pt-4">
                    <a href="#hero" className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#D69F3F] to-[#D69F3F]  text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                      <span>{t('sell.overview.ctaButton', 'Start Your Free Valuation')}</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Why Choose Us Section */}
        <section id="why-choose-us" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#EDDDC5] to-[#F5F0E8] relative overflow-hidden">
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/20 rounded-full blur-3xl -translate-x-24 sm:-translate-x-32 -translate-y-24 sm:-translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#D69F3F]/10 rounded-full blur-3xl translate-x-32 sm:translate-x-48 translate-y-32 sm:translate-y-48"></div>
          
          <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t('sell.whyChooseUs.title', 'Your Success is Our')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D69F3F] to-[#D69F3F]">{t('sell.whyChooseUs.titleHighlight', ' Priority')}</span>
              </h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-gray-700 max-w-3xl mx-auto px-4">
                {t('sell.whyChooseUs.subtitle', 'With years of experience and a proven track record, we\'re the trusted choice for Dubai property sales')}
              </p>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Card 1: Global Reach */}
              <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.77 20 8.64 20 12C20 14.08 19.2 15.97 17.9 17.39Z"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-gray-900 mb-2 sm:mb-3 text-center">
                    {t('sell.whyChooseUs.features.globalReach.title', 'Global Reach')}
                  </h3>
                  <p className="text-gray-600 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">
                    {t('sell.whyChooseUs.features.globalReach.description', 'Our multilingual team offers seamless communication for a global clientele, ensuring your property reaches international buyers.')}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D69F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 2: 24/7 Services */}
              <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-gray-900 mb-2 sm:mb-3 text-center">
                    {t('sell.whyChooseUs.features.support247.title', '24/7 Services')}
                  </h3>
                  <p className="text-gray-600 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">
                    {t('sell.whyChooseUs.features.support247.description', 'We provide round-the-clock support for a completely stress-free experience, whenever you need assistance.')}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D69F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 3: Client-First Approach */}
              <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-gray-900 mb-2 sm:mb-3 text-center">
                    {t('sell.whyChooseUs.features.clientFirst.title', 'Client-First Approach')}
                  </h3>
                  <p className="text-gray-600 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">
                    {t('sell.whyChooseUs.features.clientFirst.description', 'Your satisfaction is our top priority, built on trust, transparency, and delivering exceptional results.')}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D69F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 4: Luxury Property Specialists */}
              <div className="group relative bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <img src="/sell/images/icons/1.svg" alt="Luxury Properties" className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-white mb-2 sm:mb-3 text-center">
                    {t('sell.whyChooseUs.features.luxurySpecialists.title', 'Luxury Property Specialists')}
                  </h3>
                  <p className="text-white/90 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">
                    {t('sell.whyChooseUs.features.luxurySpecialists.description', 'We offer a tailored experience focused on the most exclusive properties with premium service standards.')}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

            </div>
          </div>
        </section>

        {/* Trusted Partners & Clients Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-4">{t('sell.trustedPartners.title', 'Trusted by Leading Organizations')}</h2>
              <p className="text-sm text-gray-600">{t('sell.trustedPartners.subtitle', 'Click to view our profiles on these platforms')}</p>
            </div>
            
            {/* Enhanced Interactive Cards Container */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-4xl mx-auto">
              
              {/* Property Finder Card */}
              <div className="group relative cursor-pointer">
                <div 
                  onClick={() => window.open('https://www.propertyfinder.ae/en/broker/rino-invest-group-ltd-dubai-branch-11009?properties%5Bfilter%5Bcategory_id%5D%5D=2')}
                  className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  role="button"
                  tabIndex={0}
                  aria-label="View Rino Properties profile on Property Finder"
                >
                  <img 
                    src="/sell/images/property.png" 
                    className="w-full h-full object-contain p-2 transition-transform duration-300" 
                    alt="Property Finder" 
                  />
                  
                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-blue-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <span className="text-white text-xs font-medium">{t('sell.trustedPartners.explore', 'Explore')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300 font-medium">{t('sell.trustedPartners.propertyFinder', 'Property Finder')}</span>
                </div>
              </div>

              {/* Bayut Card */}
              <div className="group relative cursor-pointer">
                <div 
                  onClick={() => window.open('https://www.bayut.com/companies/rino-invest-group-107075/')}
                  className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  role="button"
                  tabIndex={0}
                  aria-label="View Rino Properties profile on Bayut"
                >
                  <img 
                    src="/sell/images/bayut.png" 
                    className="w-full h-full object-contain p-2 transition-transform duration-300" 
                    alt="Bayut" 
                  />
                  
                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-green-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <span className="text-white text-xs font-medium">{t('sell.trustedPartners.explore', 'Explore')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300 font-medium">{t('sell.trustedPartners.bayut', 'Bayut')}</span>
                </div>
              </div>

              {/* Dubizzle Card */}
              <div className="group relative cursor-pointer">
                <div 
                  onClick={() => window.open('https://dubai.dubizzle.com/property-agencies/rino-invest-group-100885/?page=3')}
                  className="relative w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  role="button"
                  tabIndex={0}
                  aria-label="View Rino Properties profile on Dubizzle"
                >
                  <img 
                    src="/sell/images/dubizzle.png" 
                    className="w-full h-full object-contain p-2 transition-transform duration-300" 
                    alt="Dubizzle" 
                  />
                  
                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-purple-600/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-1 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <span className="text-white text-xs font-medium">{t('sell.trustedPartners.explore', 'Explore')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300 font-medium">{t('sell.trustedPartners.dubizzle', 'Dubizzle')}</span>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Our Property Portfolio Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t('sell.propertyPortfolio.title', 'Explore Our')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D69F3F] to-[#D69F3F]">{t('sell.propertyPortfolio.titleHighlight', ' Property Portfolio')}</span>
              </h2>
            </div>

            {/* Property Portfolio Cards - Simplified */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12 max-w-4xl mx-auto">
              
              {/* Secondary Market Card - Yellow Brand Color */}
              <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative h-30 sm:h-64 bg-[#F9FAFB] flex items-center justify-center">
                  <div className="relative z-10 text-center text-gray-900">
                    <h3 className="text-2xl font-medium mb-3 text-gray-900">{t('sell.propertyPortfolio.secondary.title', 'Secondary Projects')}</h3>
                    <p className="text-gray-800 text-base px-4">{t('sell.propertyPortfolio.secondary.description', 'Ready-to-move properties & investment opportunities')}</p>
                  </div>
                </div>
                <div className="p-8 sm:p-10">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-gray-700 text-base">{t('sell.propertyPortfolio.secondary.features.readyProperties', 'Ready Properties Available')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-gray-700 text-base">{t('sell.propertyPortfolio.secondary.features.specialDeals', 'Investor Special Deals')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-gray-700 text-base">{t('sell.propertyPortfolio.secondary.features.quickSettlement', 'Quick Settlement Process')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-gray-700 text-base">{t('sell.propertyPortfolio.secondary.features.premiumLocations', 'Premium Dubai Locations')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://rinoproperties.com/properties/dubai', '_blank')}
                    className="w-full bg-[#D69F3F] hover:from-[#D69F3F] hover:to-[#722F22] text-white hover:text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
                  >
                    {t('sell.propertyPortfolio.secondary.ctaButton', 'Explore Secondary Projects')}
                  </button>
                </div>
              </div>

              {/* Off-Plan Projects Card */}
              <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
               <div className="relative h-30 sm:h-64 bg-[#F9FAFB] flex items-center justify-center">
                  <div className="relative z-10 text-center text-gray-900">
                    <h3 className="text-2xl font-medium mb-3">{t('sell.propertyPortfolio.offPlan.title', 'Off-Plan Projects')}</h3>
                    <p className="text-black text-base px-4">{t('sell.propertyPortfolio.offPlan.description', 'New developments & future investments')}</p>
                  </div>
                </div>
                <div className="p-8 sm:p-10">
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-black text-base">{t('sell.propertyPortfolio.offPlan.features.preConstruction', 'Pre-construction Pricing')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-black text-base">{t('sell.propertyPortfolio.offPlan.features.flexiblePayment', 'Flexible Payment Plans')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-black text-base">{t('sell.propertyPortfolio.offPlan.features.highROI', 'High ROI Potential')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#D69F3F] rounded-full"></div>
                      <span className="text-black text-base">{t('sell.propertyPortfolio.offPlan.features.futureValue', 'Future Value Growth')}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open('https://rinoproperties.com/properties/dubai', '_blank')}
                    className="w-full bg-[#D69F3F] hover:from-[#D69F3F] hover:to-[#722F22] text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
                  >
                    {t('sell.propertyPortfolio.offPlan.ctaButton', 'Explore Off-Plan Projects')}
                  </button>
                </div>
              </div>
            </div>

            {/* Visit Our Team CTA */}
            <div className="text-center bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] rounded-2xl p-8 sm:p-12 text-white">
              <div className="max-w-3xl mx-auto">
               
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal mb-4 sm:mb-6">{t('sell.propertyPortfolio.teamCTA.title', 'Meet Our Expert Team')}</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg mx-auto">
                  <button 
                    onClick={() => window.open('https://www.rinoproperties.com/agents/', '_blank')}
                    className="bg-white text-[#D69F3F] hover:bg-gray-100 font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                    </svg>
                    <span>{t('sell.propertyPortfolio.teamCTA.visitTeam', 'Visit Our Team')}</span>
                  </button>
                  <button 
                    onClick={() => window.open('https://rinoproperties.com/contact', '_blank')}
                    className="border-2 border-white text-white hover:bg-white hover:text-[#D69F3F] font-medium py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span>{t('sell.propertyPortfolio.teamCTA.contactUs', 'Contact Us')}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

       
        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 mb-3 sm:mb-4">{t('sell.howItWorks.title', 'How It Works')}</h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-gray-600 max-w-2xl mx-auto px-4">{t('sell.howItWorks.subtitle', 'Simple 4-step process to sell your property with Rino Properties - from contact to completion')}</p>
            </div>
            
            {/* Steps Container */}
            <div className="relative">
              
              {/* Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
                
                {/* Step 1 */}
                <div className="relative group h-full">
                  <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#D69F3F]/30 transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative flex-1 flex flex-col">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-medium">1</span>
                      </div>
                      <div className="bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 48 48"><path fillRule="evenodd" clipRule="evenodd" d="M23.99 5c-3.307 0-5.987 2.687-5.987 6.002 0 3.314 2.68 6.001 5.987 6.001s5.987-2.687 5.987-6.001C29.977 7.687 27.297 5 23.99 5Zm-6.985 6.002C17.005 7.135 20.132 4 23.99 4c3.858 0 6.985 3.135 6.985 7.002s-3.127 7.001-6.985 7.001c-3.858 0-6.985-3.134-6.985-7.001Zm8.947 10.992h-3.839l.305 1.62h3.177l.357-1.62Zm-4.849.03c-3.084.218-5.517 1.67-7.226 3.871-1.866 2.404-2.88 5.72-2.88 9.323V44H10v-8.782c0-3.78 1.062-7.325 3.09-9.937 2.037-2.624 5.036-4.287 8.834-4.287h4.152c3.793 0 6.792 1.663 8.83 4.287C36.936 27.893 38 31.438 38 35.218V44h-.998v-8.782c0-3.603-1.016-6.919-2.883-9.323-1.697-2.184-4.106-3.63-7.153-3.866l-.57 2.585h-4.805l-.488-2.59Zm5.348 3.471H21.55L20.483 37.25 24 39.6l3.517-2.35-1.066-11.754Zm-4.92 11.252.929-10.251h3.08l.93 10.251-2.47 1.65-2.47-1.65Z"/></svg>
                      </div>
                      <h3 className="text-lg font-normal text-gray-900 mb-2 text-center">{t('sell.howItWorks.steps.step1.title', 'Contact & Valuation')}</h3>
                      <p className="text-sm text-gray-600 text-center leading-relaxed flex-1">{t('sell.howItWorks.steps.step1.description', 'Reach out to our expert team and get a professional property assessment to determine optimal market value')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative group h-full">
                  <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#D69F3F]/30 transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative flex-1 flex flex-col">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-medium">2</span>
                      </div>
                      <div className="bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 48 48"><path d="M40 19H28v-1h12v1Zm-12 4h12v-1H28v1Zm12 4H28v-1h12v1Zm-12 4h12v-1H28v1Z"/><path fillRule="evenodd" clipRule="evenodd" d="M11.34 17.42a3.62 3.62 0 1 1 7.24 0 3.62 3.62 0 0 1-7.24 0Zm3.62-2.62a2.62 2.62 0 1 0 0 5.24 2.62 2.62 0 0 0 0-5.24Z"/><path d="M9 29.06c0-1.687.446-3.223 1.302-4.325.848-1.09 2.08-1.775 3.668-1.775h2c1.588 0 2.82.685 3.668 1.775C20.494 25.837 21 27.373 21 29.06V33h1v-3.94c0-1.863-.554-3.628-1.573-4.938C19.4 22.8 17.882 21.96 15.97 21.96h-2c-1.912 0-3.43.84-4.457 2.162C8.494 25.432 8 27.197 8 29.06V33h1v-3.94Z"/><path fillRule="evenodd" clipRule="evenodd" d="M4 10h40v28H4V10Zm1 1v26h38V11H5Z"/></svg>
                      </div>
                      <h3 className="text-lg font-normal text-gray-900 mb-2 text-center">{t('sell.howItWorks.steps.step2.title', 'Marketing & Promotion')}</h3>
                      <p className="text-sm text-gray-600 text-center leading-relaxed flex-1">{t('sell.howItWorks.steps.step2.description', 'Create compelling property documentation and strategic marketing across multiple channels and platforms')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative group h-full">
                  <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#D69F3F]/30 transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative flex-1 flex flex-col">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-medium">3</span>
                      </div>
                      <div className="bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 48 48"><path fillRule="evenodd" clipRule="evenodd" d="M25.272 7.532c.427-.368.698-.915.698-1.524a2.004 2.004 0 0 0-2-2.008c-1.105 0-2 .899-2 2.008 0 .614.275 1.164.708 1.532l-10.875 9.49H4V40.2h27.97v-1.004H5V18.035h38V29.85h1V17.03h-7.862L25.272 7.533ZM22.97 6.008c0-.555.448-1.004 1-1.004s1 .45 1 1.004-.448 1.004-1 1.004-1-.45-1-1.004Zm.687 2.008-10.25 8.944h21.128L24.303 8.016h-.646Z"/><path d="M43.773 34.321 37.121 41l-3.294-3.295.706-.711 2.586 2.587 5.947-5.97.707.71Z"/><path fillRule="evenodd" clipRule="evenodd" d="M8.95 22.99h6.03v10.02H8.95V22.99Zm1 1v8.02h4.03v-8.02H9.95Z"/><path d="M31.03 22.99h-6.06v10.02h5.95v-1h-4.95V28.5h4v-1h-4v-3.51h5.06v-1Z"/><path fillRule="evenodd" clipRule="evenodd" d="M22.98 23h-6v10.01h1v-3.99h5V23Zm-1 5.02h-4V24h4v4.02Z"/><path d="M34.305 22.99H32.98V33h1v-8.278L37.655 33h1.325V23h-1v8.268l-3.675-8.278Z"/></svg>
                      </div>
                      <h3 className="text-lg font-normal text-gray-900 mb-2 text-center">{t('sell.howItWorks.steps.step3.title', 'Viewings & Reports')}</h3>
                      <p className="text-sm text-gray-600 text-center leading-relaxed flex-1">{t('sell.howItWorks.steps.step3.description', 'Organize property viewings with potential buyers and provide regular progress updates throughout the process')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative group h-full">
                  <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#D69F3F]/30 transform hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative flex-1 flex flex-col">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-medium">4</span>
                      </div>
                      <div className="bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 48 48"><path d="M20 12h8v2h-8v-2Zm0 4h12v2H20v-2Zm0 4h10v2H20v-2Zm0 4h14v2H20v-2Zm0 4h8v2h-8v-2Z"/><path fillRule="evenodd" clipRule="evenodd" d="M12 8h24c1.1 0 2 .9 2 2v28c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2Zm0 2v28h24V10H12Z"/><path d="M16 36h16v2H16v-2Z"/></svg>
                      </div>
                      <h3 className="text-lg font-normal text-gray-900 mb-2 text-center">{t('sell.howItWorks.steps.step4.title', 'Sale & Handover')}</h3>
                      <p className="text-sm text-gray-600 text-center leading-relaxed flex-1">{t('sell.howItWorks.steps.step4.description', 'Finalize legal documentation, secure the sale agreement, and complete handover with ongoing support')}</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-12 sm:mt-16">
               <a href="#hero" className="bg-[#D69F3F] hover:bg-gray-100 hover:text-[#D69F3F] text-white font-normal py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
                  <span>{t('sell.howItWorks.ctaButton', 'Start Selling Now')}</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
            </div>
          </div>
        </section>

   
        {/* Service Areas Section */}
        <section id="service-areas" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-2 sm:mb-4">{t('sell.serviceAreas.title', 'Dubai Service Areas')}</h2>
            </div>
            
        
            {/* All Areas Grid */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {[
                  'Downtown Dubai',
                  'Dubai Marina',
                  'Palm Jumeirah',
                  'Business Bay',
                  'Jumeirah Lake Towers',
                  'Dubai Hills Estate',
                  'Emirates Hills',
                  'Jumeirah Beach Residence',
                  'DIFC',
                  'City Walk',
                  'Dubai South',
                  'Meydan',
                  'Arabian Ranches',
                  'The Springs',
                  'Dubai Investment Park',
                  'Al Barsha',
                  'Jumeirah',
                  'Bur Dubai',
                  'Deira',
                  'Sheikh Zayed Road',
                  'Motor City',
                  'Dubai Sports City',
                  'International City'
                ].map((area, index) => (
                  <div key={index} className="group bg-gray-50 hover:bg-[#D69F3F]/10 p-2 sm:p-3 rounded-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D69F3F] rounded-full transition-colors flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700 font-normal transition-colors leading-tight">{area}</span>
                </div>
                </div>
                ))}
                </div>
              </div>

            {/* Dubai Service Areas Map Section */}
            <div className="mt-8 sm:mt-12 text-center">
                <div className="relative z-10">
                    <img src={"/sell/images/location.webp"} alt="Dubai Map" className="mx-auto w-full max-w-lg h-auto" />
                  </div>
            </div>
              
        
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-12 sm:py-16 lg:py-12 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-3 sm:mb-4 tracking-wide">
                {t('sell.faq.title', 'Frequently Asked')} <span className="text-[#D69F3F]">{t('sell.faq.titleHighlight', 'Questions')}</span>
              </h2>
            </div>

            {/* FAQ Grid */}
            <div className="grid gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  key: 'valuation',
                  question: t('sell.faq.items.valuation.question', "How do you determine my property's value?"),
                  answer: t('sell.faq.items.valuation.answer', "We conduct a comprehensive market analysis considering factors like location, property condition, recent comparable sales, current market trends, and unique features of your property. Our experienced valuers provide accurate assessments based on current Dubai real estate market conditions."),
                  icon: "📊",
                  category: "Valuation"
                },
                {
                  key: 'documents',
                  question: t('sell.faq.items.documents.question', "What documents do I need to sell my property?"),
                  answer: t('sell.faq.items.documents.answer', "You'll need your original title deed, Emirates ID, passport copy, No Objection Certificate (if applicable), clearance certificates from utilities (DEWA, internet, etc.), and mortgage clearance letter if the property is financed. We'll guide you through obtaining any missing documents."),
                  icon: "📋",
                  category: "Documentation"
                },
                {
                  key: 'timeline',
                  question: t('sell.faq.items.timeline.question', "How long does it take to sell a property in Dubai?"),
                  answer: t('sell.faq.items.timeline.answer', "The timeline varies depending on property type, location, and market conditions. Typically, well-priced properties in prime locations sell within 2-8 weeks. Luxury properties may take 3-6 months. Our marketing strategies and extensive network help accelerate the process significantly."),
                  icon: "⏱️",
                  category: "Timeline"
                },
                {
                  key: 'fees',
                  question: t('sell.faq.items.fees.question', "What are the fees involved in selling?"),
                  answer: t('sell.faq.items.fees.answer', "Typical costs include: DLD transfer fee (4% + AED 580), real estate agent commission (usually 2% + VAT), mortgage settlement (if applicable), and obtaining clearance certificates. We provide a detailed breakdown of all costs upfront with no hidden fees."),
                  icon: "💰",
                  category: "Costs"
                },
                {
                  key: 'staging',
                  question: t('sell.faq.items.staging.question', "Do you provide staging and photography services?"),
                  answer: t('sell.faq.items.staging.answer', "Yes, we offer professional staging advice and high-quality photography services. Our team includes professional photographers who specialize in real estate. We also provide virtual tours and 3D walkthroughs for premium properties to maximize online engagement."),
                  icon: "📸",
                  category: "Marketing"
                },
                {
                  key: 'mortgage',
                  question: t('sell.faq.items.mortgage.question', "Can I sell if I still have a mortgage?"),
                  answer: t('sell.faq.items.mortgage.answer', "Absolutely! We handle properties with existing mortgages regularly. We coordinate with your bank to obtain the settlement figure and ensure the mortgage is cleared during the sale process. The remaining funds after mortgage clearance are transferred to you."),
                  icon: "🏦",
                  category: "Finance"
                },
                {
                  key: 'difference',
                  question: t('sell.faq.items.difference.question', "What makes Rino Properties different from other agents?"),
                  answer: t('sell.faq.items.difference.answer', "We offer multilingual service, transparent communication, and a client-first approach. Our extensive network, professional marketing, and deep market knowledge ensure faster sales at optimal prices. We handle all paperwork and coordinate with all parties involved."),
                  icon: "⭐",
                  category: "Service"
                }
              ].map((faq, index) => (
                <div key={index} className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#D69F3F]/20 overflow-hidden">
                  <button 
                    className="w-full p-3 sm:p-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-start justify-between group"
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                      <div className="flex-1">
                        <h3 className="text-sm xs:text-base sm:text-lg lg:text-xm font-normal text-gray-900 group-hover:text-[#D69F3F] transition-colors leading-relaxed">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3 sm:ml-4">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#D69F3F]/10 flex items-center justify-center transform transition-all duration-300 ${openFaq === index ? 'rotate-180 bg-[#D69F3F]' : 'group-hover:bg-[#D69F3F]/20'}`}>
                        <svg 
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300 ${openFaq === index ? 'text-white' : 'text-[#D69F3F]'}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-500 ease-out ${openFaq === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="h-px bg-gradient-to-r from-[#D69F3F]/20 to-transparent mb-3 sm:mb-4"></div>
                        <p className="text-gray-600 leading-relaxed text-sm xs:text-base">
                          {faq.answer}
                        </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

           <Footer />
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 xs:p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl p-0 max-w-sm xs:max-w-md sm:max-w-lg w-full mx-4 shadow-2xl transform transition-all overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] px-6 sm:px-8 py-4 sm:py-6 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full mb-3 sm:mb-4 backdrop-blur-sm">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-normal text-white mb-2">
                Request Received!
              </h3>
              
              <p className="text-white/90 text-sm">
                Thank you for choosing Rino Properties
              </p>
            </div>
            
            {/* Content */}
            <div className="px-8 py-6">
              {/* Message */}
              <div className="text-center mb-6">
                <h4 className="text-xl font-medium text-gray-800 mb-3 leading-relaxed">
                  Your valuation request for{' '}
                  <span className="text-[#D69F3F] font-normal">{submittedLocation}</span>{' '}
                  has been received!
                </h4>
                
                <div className="bg-[#EDDDC5]/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Our expert team will contact you shortly to schedule your free property valuation appointment.
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-[#D69F3F] text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Professional • Confidential • No Obligation</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-[#D69F3F] hover:bg-[#722F22] text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Got it, thanks!
                </button>
                
                <div className="flex space-x-3">
                  <a
                    href="tel:+97143212433"
                    className="flex-1 bg-white border-2 border-[#D69F3F] text-[#D69F3F] hover:bg-[#D69F3F] hover:text-white font-normal py-3 px-4 rounded-xl transition-all duration-300 text-center text-sm"
                  >
                    Call Now
                  </a>
                  <a
                    href="https://wa.me/97143212433?text=Hello, I just submitted a valuation request"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-normal py-3 px-4 rounded-xl transition-all duration-300 text-center text-sm"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
};

export default PropertySellingLanding;
