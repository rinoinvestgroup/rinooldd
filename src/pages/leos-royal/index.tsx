import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useForm, ValidationError } from '@formspree/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { countries } from '../../data/countries';
import { useLanguage } from '../../context/LanguageContext';
import AutoTranslate from '../../components/AutoTranslate';

const LeosRoyal = () => {
  const { language, isRTL } = useLanguage();
  const [state, handleFormspreeSubmit] = useForm("xojagqkk"); // Hero form
  const [contactState, handleContactFormspreeSubmit] = useForm("xojagqkk"); // Footer contact form


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    investment: ''
  });

  const [contactFormData, setContactFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+971',
    email: '',
    message: ''
  });

  // Gallery slider state
  const galleryImages = [
    {
      main: '/images/leos-royal/slider/GWR_-Living-room_-High-res_-02.jpg',
      alt: 'Leos Royal Main Villa'
    },
    {
      main: '/images/leos-royal/slider/GWR_-Master-Bedroom_-High-res.jpg',
      alt: 'Leos Royal View 1'
    },
    {
      main: '/images/leos-royal/slider/KG-7BED-Villa-B-LIVING-ROOM-1.jpg',
      alt: 'Leos Royal View 2'
    },
    {
      main: '/images/leos-royal/slider/KG_5BED-TH-Living-room-1.jpg',
      alt: 'Leos Royal View 3'
    },
    {
      main: '/images/leos-royal/slider/LR_AIR-TAXI-STATION-1.jpg',
      alt: 'Leos Royal View 4'
    },
    {
      main: '/images/leos-royal/slider/LR_Canal-birdsview-night-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_Canal-dusk-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_Community-centre-2-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_Community-Centre-3-2.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_Community-centre-birdsview-2.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_COMMUNITY_Street-view-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR-Development-Entrance-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_Master-District-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_Master-Plan-District-2.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_Masterplan-P1-P2-Birdsview.jpg',
      alt: 'Leos Royal View 5'
    },
    
    {
      main: '/images/leos-royal/slider/LR_SALE-CENTRE-CLUBHOUSE-FRONT-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_SIGNATURE-CANAL-VILLA-DUSK-2.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/LR_SIGNATURE-CANAL-VILLA-Night-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/TH-TYPE-D-Back-2.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/TH-TYPE-D-Front-View-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/TH-TYPE-E-Back-View-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/Villa-B-Front-1.jpg',
      alt: 'Leos Royal View 5'
    },
    {
      main: '/images/leos-royal/slider/villa-C-back-view-1.jpg',
      alt: 'Leos Royal View 5'
    },
     {
      main: '/images/leos-royal/slider/villa-D-back-view-1.jpg',
      alt: 'Leos Royal View 5'
    },
     {
      main: '/images/leos-royal/slider/villa-D-front-view-1.jpg',
      alt: 'Leos Royal View 5'
    },
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Country dropdown states
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to UAE
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    const searchLower = countrySearchTerm.toLowerCase();
    return countries.filter(country =>
      country.country.toLowerCase().includes(searchLower) ||
      country.code.includes(countrySearchTerm)
    );
  }, [countrySearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showCountryDropdown && target && typeof target.closest === 'function' && !target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
        setCountrySearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Track form field interaction with Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      // Track when user starts filling key fields
      if (name === 'email' && value.length === 1) {
        window.fbq('trackCustom', 'FormFieldInteraction', {
          field_name: 'email',
          form_name: 'Hero Registration Form'
        });
      }
      if (name === 'phone' && value.length === 1) {
        window.fbq('trackCustom', 'FormFieldInteraction', {
          field_name: 'phone',
          form_name: 'Hero Registration Form'
        });
      }
      if (name === 'investment' && value) {
        window.fbq('trackCustom', 'InvestmentBudgetSelected', {
          investment_range: value,
          form_name: 'Hero Registration Form'
        });
      }
    }
    
    // Track with GTM/Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      if (name === 'email' && value.length === 1) {
        window.gtag('event', 'form_interaction', {
          event_category: 'Leos Royal Form',
          event_label: 'Hero Registration - Email Field',
          form_name: 'Hero Registration Form',
          field_name: 'email'
        });
      }
      if (name === 'phone' && value.length === 1) {
        window.gtag('event', 'form_interaction', {
          event_category: 'Leos Royal Form',
          event_label: 'Hero Registration - Phone Field',
          form_name: 'Hero Registration Form',
          field_name: 'phone'
        });
      }
      if (name === 'investment' && value) {
        window.gtag('event', 'investment_selected', {
          event_category: 'Leos Royal Form',
          event_label: 'Hero Registration - Investment Budget',
          investment_range: value
        });
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Track contact form field interaction with Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      // Track when user starts filling key fields
      if (name === 'email' && value.length === 1) {
        window.fbq('trackCustom', 'ContactFormInteraction', {
          field_name: 'email',
          form_name: 'Contact Form'
        });
      }
      if (name === 'phone' && value.length === 1) {
        window.fbq('trackCustom', 'ContactFormInteraction', {
          field_name: 'phone',
          form_name: 'Contact Form'
        });
      }
    }
    
    // Track with GTM/Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      if (name === 'email' && value.length === 1) {
        window.gtag('event', 'form_interaction', {
          event_category: 'Leos Royal Contact',
          event_label: 'Contact Form - Email Field',
          form_name: 'Contact Form',
          field_name: 'email'
        });
      }
      if (name === 'phone' && value.length === 1) {
        window.gtag('event', 'form_interaction', {
          event_category: 'Leos Royal Contact',
          event_label: 'Contact Form - Phone Field',
          form_name: 'Contact Form',
          field_name: 'phone'
        });
      }
    }
    
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gallery navigation handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Track form submission start with Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Leos Royal Registration Form',
        content_category: 'Hero Section',
        value: formData.investment || 'Not specified',
        currency: 'AED'
      });
    }
    
    // Track with GTM/Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'generate_lead', {
        event_category: 'Leos Royal Form',
        event_label: 'Hero Registration Form Submit',
        value: formData.investment || 'Not specified',
        currency: 'AED'
      });
    }
    
    // Combine phone number with country code
    const fullPhoneNumber = `${selectedCountry.code} ${formData.phone}`;
    
    // Create form data for Formspree
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('firstName', formData.firstName);
    formDataToSubmit.append('lastName', formData.lastName);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('phone', fullPhoneNumber);
    formDataToSubmit.append('message', formData.message);
    formDataToSubmit.append('investment', formData.investment);
    formDataToSubmit.append('project', 'Leos Royal - Hero Registration');
    formDataToSubmit.append('form', 'Hero Section');
    
    try {
      await handleFormspreeSubmit(formDataToSubmit);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Track successful hero form completion
  useEffect(() => {
    if (state.succeeded) {
      // Track successful form completion
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'Leos Royal Registration',
          status: 'completed'
        });
      }
      
      // Track with GTM/Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submit_success', {
          event_category: 'Leos Royal Form',
          event_label: 'Hero Registration Form Success',
          form_name: 'Hero Registration'
        });
      }
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        investment: ''
      });
      setSelectedCountry(countries[0]);
    }
  }, [state.succeeded]);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Track contact form submission with Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'Leos Royal Contact Form',
        content_category: 'Strategic Location Section'
      });
    }
    
    // Track with GTM/Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_submit', {
        event_category: 'Leos Royal Contact',
        event_label: 'Contact Form Submit',
        form_location: 'Strategic Location Section'
      });
    }
    
    // Combine phone number with country code
    const fullPhoneNumber = `${contactFormData.countryCode} ${contactFormData.phone}`;
    
    // Create form data for Formspree
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('firstName', contactFormData.firstName);
    formDataToSubmit.append('lastName', contactFormData.lastName);
    formDataToSubmit.append('email', contactFormData.email);
    formDataToSubmit.append('phone', fullPhoneNumber);
    formDataToSubmit.append('message', contactFormData.message);
    formDataToSubmit.append('project', 'Leos Royal - Contact Form');
    formDataToSubmit.append('form', 'Strategic Location Section');
    
    try {
      await handleContactFormspreeSubmit(formDataToSubmit);
    } catch (error) {
      console.error('Contact form submission error:', error);
    }
  };

  // Track successful contact form completion
  useEffect(() => {
    if (contactState.succeeded) {
      // Track successful contact submission
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'SubmitApplication', {
          content_name: 'Leos Royal Contact',
          status: 'submitted'
        });
      }
      
      // Track with GTM/Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_success', {
          event_category: 'Leos Royal Contact',
          event_label: 'Contact Form Success',
          form_name: 'Contact Form'
        });
      }
      
      setContactFormData({
        firstName: '',
        lastName: '',
        phone: '',
        countryCode: '+971',
        email: '',
        message: ''
      });
    }
  }, [contactState.succeeded]);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Leos Royal Dubai | Ultra-Luxury Residences</title>
        <meta name="title" content="Leos Royal Dubai | Ultra-Luxury Residences" />
        <meta name="description" content="Leos Royal Dubai — ultra-luxury residences with premium amenities and exceptional ROI. Exclusive partnership with Rino Properties. Book a viewing today." />
        <meta name="keywords" content="Leos Royal Dubai, Leos Royal price, ultra-luxury residences Dubai, penthouse Dubai, branded residence Dubai, luxury tower Dubai, high-end apartment Dubai, Leos Royal payment plan, premium investment Dubai, exclusive Dubai residence" />
        <meta name="author" content="Rino Properties" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rinoproperties.com/leos-royal" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rinoproperties.com/leos-royal" />
        <meta property="og:title" content="Leos Royal Dubai - Ultra-Luxury Residences " />
        <meta property="og:description" content="Experience unparalleled luxury at Leos Royal Dubai. Exclusive partnership with Rino Properties offering world-class residences and premium amenities." />
        <meta property="og:image" content="https://rinoproperties.com/images/leos-royal/bg.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rino Properties" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://rinoproperties.com/leos-royal" />
        <meta name="twitter:title" content="Leos Royal Dubai - Ultra-Luxury Residences " />
        <meta name="twitter:description" content="Experience unparalleled luxury at Leos Royal Dubai. Exclusive residences with world-class amenities." />
        <meta name="twitter:image" content="https://rinoproperties.com/images/leos-royal/bg.webp" />
        
        {/* Additional Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />
        
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Leos Royal by Rino Properties",
              "description": "Ultra-luxury residential development in Dubai offering exclusive homes with world-class amenities and exceptional investment opportunities.",
              "url": "https://rinoproperties.com/leos-royal",
              "logo": "https://rinoproperties.com/images/leos_royal.svg",
              "image": "https://rinoproperties.com/images/leos-royal/bg.webp",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Dubai",
                "addressRegion": "Dubai",
                "addressCountry": "AE"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+971-43-21-2433",
                "contactType": "Sales",
                "email": "ask@rinoproperties.com",
                "availableLanguage": ["English", "Arabic", "Hindi", "Urdu", "Chinese", "Spanish", "German"]
              },
              "sameAs": [
                "https://www.facebook.com/rinoproperties",
                "https://www.instagram.com/rinoproperties"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "150"
              },
              "priceRange": "Premium"
            })
          }}
        />
        
        {/* Real Estate Listing Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Leos Royal Luxury Residences",
              "description": "Experience the pinnacle of luxury living at Leos Royal. Ultra-modern architecture, world-class amenities, and prestigious Dubai location.",
              "image": "https://rinoproperties.com/images/leos-royal/bg.webp",
              "brand": {
                "@type": "Brand",
                "name": "Leos Royal"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "AED",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Rino Properties"
                }
              },
              "category": "Luxury Residential Property"
            })
          }}
        />
        
        {/* Breadcrumb Structured Data */}
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
                  "name": "Leos Royal",
                  "item": "https://rinoproperties.com/leos-royal"
                }
              ]
            })
          }}
        />
        
        {/* FAQ Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What makes Leos Royal unique in Dubai's luxury real estate market?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Leos Royal is the world's first AI-powered residential community, seamlessly integrating cutting-edge technology with serene waterfront living. The architecture harmonizes with nature, creating a unique rhythm of stillness and movement that distinguishes it from other luxury developments in Dubai."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the available unit sizes at Leos Royal?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Leos Royal offers premium residences ranging from spacious 1-bedroom apartments to expansive penthouses. Each unit is meticulously designed with luxury finishes, smart home integration, and panoramic views, catering to diverse lifestyle preferences."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What amenities are included in the development?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Residents enjoy world-class amenities including infinity pools, state-of-the-art fitness centers, spa facilities, landscaped gardens, children's play areas, 24/7 concierge services, and AI-powered smart home features. The development also includes retail spaces, dining options, and waterfront promenades."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is the partnership between Rino Properties and Leos Royal?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Rino Properties has an exclusive partnership with Leos Royal, serving as the premier real estate agency for this exceptional development. Our partnership ensures clients receive expert guidance, exclusive access to units, and comprehensive after-sales support throughout their investment journey."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the payment plans and investment opportunities?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Leos Royal offers flexible payment plans designed for both end-users and investors. With competitive pricing, attractive ROI potential, and Dubai's strong rental market, it presents an excellent investment opportunity. Contact our team to discuss customized payment options tailored to your requirements."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Where is Leos Royal located in Dubai?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Leos Royal is strategically positioned in one of Dubai's most prestigious waterfront locations, offering exceptional connectivity to key business districts, entertainment hubs, and international airports. The prime location ensures residents enjoy both tranquility and accessibility to urban amenities."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Meta Pixel Code - Already loaded in _app.tsx, no need to duplicate */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2326254387772475&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </Head>

      <Header headerBg="bg-white text-white shadow-md logo-black" />

      <main className="min-h-screen">
        {/* Hero Section with Registration Form */}
        <section className="relative min-h-screen overflow-hidden bg-gray-900">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/images/leos-royal/slider/LR_Canal-dusk-1.jpg" 
              alt="Luxury Property Background" 
              className="w-full h-full min-h-screen object-cover"
              loading="eager"
              fetchPriority="high"
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"></div>
          </div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNENjlGM0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0wLTR2LTJoLTJ2Mmgyem0yIDJ2LTJoLTJ2Mmgyem0wIDR2LTJoLTJ2Mmgyem0yLTJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0tMiAydi0yaC0ydjJoMnptMC00di0yaC0ydjJoMnptMiAydi0yaC0ydjJoMnptMCA0di0yaC0ydjJoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          
          {/* Content Container */}
          <div className="relative z-10 min-h-screen flex items-center">
            <div className="w-full py-20 sm:py-24 md:py-28 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
              
              {/* Left Side - Logo and Description */}
              <div className="space-y-6 sm:space-y-8 flex flex-col items-center text-center">
                {/* Logo */}
                <div className="bg-black/80 p-6 sm:p-8 rounded w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] justify-center align-center flex shadow-2xl relative">
                    <img src={'/images/leos_royal.svg'}  alt="Leos Royal Dubai - Ultra Luxury Residences" />
                </div>

                {/* Description */}
                <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
                  {/* H1 for SEO */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
                    <AutoTranslate translationKey="leosRoyal.mainTitle">
                      Leos Royal Dubai: Ultra-Luxury Living Redefined
                    </AutoTranslate>
                  </h1>
                  
                  <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed drop-shadow-lg">
                    <AutoTranslate translationKey="leosRoyal.subtitle">
                    Discover the pinnacle of luxury living. Leos Royal offers luxurious homes with top-notch features, stunning architecture, and an unmatched way of life.
                    </AutoTranslate>
                  </p>

                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="relative">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]/5 to-[#C4903A]/5 rounded blur-3xl"></div>
                
                <div className="relative bg-white rounded shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      <AutoTranslate translationKey="leosRoyal.form.title">Register Your Interest</AutoTranslate>
                    </h2>
                    <p className="text-gray-600">
                      <AutoTranslate translationKey="leosRoyal.form.subtitle">Get exclusive access to Leos Royal</AutoTranslate>
                    </p>
                  </div>

                  {state.succeeded ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        <AutoTranslate translationKey="leosRoyal.form.successTitle">Thank You!</AutoTranslate>
                      </h3>
                      <p className="text-gray-600">
                        <AutoTranslate translationKey="leosRoyal.form.successMessage">
                          We've received your inquiry and will contact you shortly.
                        </AutoTranslate>
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            <AutoTranslate translationKey="leosRoyal.form.firstName">First Name</AutoTranslate>
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent transition-all duration-300"
                            placeholder="John"
                          />
                          <ValidationError prefix="First Name" field="firstName" errors={state.errors} />
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            <AutoTranslate translationKey="leosRoyal.form.lastName">Last Name</AutoTranslate>
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent transition-all duration-300"
                            placeholder="Doe"
                          />
                          <ValidationError prefix="Last Name" field="lastName" errors={state.errors} />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          <AutoTranslate translationKey="leosRoyal.form.email">Email Address</AutoTranslate>
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent transition-all duration-300"
                          placeholder="john.doe@example.com"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} />
                      </div>

                      {/* Phone Number with Country Code */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          <AutoTranslate translationKey="leosRoyal.form.phone">Phone Number</AutoTranslate>
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex gap-2">
                          {/* Country Dropdown */}
                          <div className="relative country-dropdown" style={{ minWidth: '100px' }}>
                            <button
                              type="button"
                              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                              className="w-full px-2 sm:px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-[#D69F3F] transition-all duration-300"
                            >
                              <span className="flex items-center">
                                <span className="mr-1 sm:mr-2">{selectedCountry.flag}</span>
                                <span className="text-xs sm:text-sm font-medium">{selectedCountry.code}</span>
                              </span>
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {showCountryDropdown && (
                              <div className="absolute z-50 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-80 overflow-hidden">
                                <div className="p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                                  <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={countrySearchTerm}
                                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent"
                                  />
                                </div>
                                <div className="overflow-y-auto max-h-64">
                                  {filteredCountries.map((country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => {
                                        setSelectedCountry(country);
                                        setShowCountryDropdown(false);
                                        setCountrySearchTerm('');
                                      }}
                                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200"
                                    >
                                      <span className="text-2xl">{country.flag}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{country.country}</div>
                                        <div className="text-xs text-gray-500">{country.code}</div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Phone Input */}
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent transition-all duration-300"
                            placeholder="123456789"
                          />
                        </div>
                        <ValidationError prefix="Phone" field="phone" errors={state.errors} />
                      </div>

                      {/* Investment Budget */}
                      <div>
                        <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-2">
                          <AutoTranslate translationKey="leosRoyal.form.investment">Investment Budget</AutoTranslate>
                        </label>
                        <select
                          id="investment"
                          name="investment"
                          value={formData.investment}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent transition-all duration-300"
                        >
                          <option value="">Select budget range</option>
                          <option value="Under AED 1M">Under AED 1M</option>
                          <option value="AED 1M - 2M">AED 1M - 2M</option>
                          <option value="AED 2M - 5M">AED 2M - 5M</option>
                          <option value="AED 5M - 10M">AED 5M - 10M</option>
                          <option value="Above AED 10M">Above AED 10M</option>
                        </select>
                        <ValidationError prefix="Investment" field="investment" errors={state.errors} />
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          <AutoTranslate translationKey="leosRoyal.form.message">Message</AutoTranslate>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent transition-all duration-300 resize-none"
                          placeholder="Tell us about your requirements..."
                        />
                        <ValidationError prefix="Message" field="message" errors={state.errors} />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={state.submitting}
                        className="w-full bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#B8852F] text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {state.submitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <AutoTranslate translationKey="leosRoyal.form.submitting">Submitting...</AutoTranslate>
                          </span>
                        ) : (
                          <AutoTranslate translationKey="leosRoyal.form.submit">Submit Inquiry</AutoTranslate>
                        )}
                      </button>

                      {/* Privacy Notice */}
                      <p className="text-xs text-gray-500 text-center">
                        <AutoTranslate translationKey="leosRoyal.form.privacy">
                          By submitting this form, you agree to our privacy policy and terms of service.
                        </AutoTranslate>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
            </div>
            </div>
            </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
              {/* Left Side - Text Content */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  <AutoTranslate translationKey="leosRoyal.about.title">
                    WELCOME TO LEOS ROYAL
                  </AutoTranslate>
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.about.description">
                 LEOS ROYAL is a place where architecture listens and water breathes, generating a natural rhythm that calms the mind and softens the senses while the environment responds gently to create a lifestyle that feels grounded and fluid. LEOS ROYAL is a community shaped by stillness and movement. Being the first AI-powered community in the world, innovation is smoothly integrated into this serene environment, enriching rather than disrupting it. Technology works silently in the background to form a future that develops gradually, like light across still water.
                  </AutoTranslate>
                </p>
              </div>

              {/* Right Side - Image Gallery */}
              <div className="relative">
                {/* Main Large Image */}
                <div className="relative rounded overflow-hidden shadow-lg">
                  <img 
                    src={galleryImages[currentImageIndex]?.main} 
                    alt={galleryImages[currentImageIndex]?.alt || 'Gallery Image'} 
                    className="w-full min-h-[400px] object-cover transition-all duration-500"
                    loading="eager"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null; // Prevent infinite loop
                      target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
                    }}
                  />
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {galleryImages.length}
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Thumbnail Gallery - Scrollable */}
                <div className="relative mt-4">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {galleryImages.map((image, index) => (
                      <button 
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden shadow-md hover:opacity-75 transition-all duration-300 ${
                          currentImageIndex === index ? 'ring-2 ring-[#C9A961] ring-offset-2 scale-105' : ''
                        }`}
                        aria-label={`View ${image.alt}`}
                      >
                        <img 
                          src={image.main} 
                          alt={image.alt} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="py-12 bg-gradient-to-r from-[#D69F3F]/10 to-[#C4903A]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              <div className="flex items-center gap-4">
                <span className="text-lg md:text-xl text-gray-700 font-medium">
                  <AutoTranslate translationKey="leosRoyal.partnership">
                    Exclusive Partnership:
                  </AutoTranslate>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl font-bold text-[#D69F3F]">Rino Properties</span>
                  <svg className="w-5 h-5 text-[#D69F3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xl md:text-2xl font-bold text-gray-800">Leos Royal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
          {/* Angled Background Shape */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a]" 
                 style={{ clipPath: 'polygon(0 0, 100% 8%, 100% 100%, 0% 100%)' }}>
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Image with Rounded Corners */}
              <div className="relative">
                <div className="relative rounded overflow-hidden shadow-2xl">
                  <img 
                    src="/images/leos-royal/bg.webp" 
                    alt="Leos Royal Pool View" 
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
                    }}
                  />
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className="space-y-4 sm:space-y-6 lg:pl-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  <AutoTranslate translationKey="leosRoyal.vision.title">
                    A VISION ROOTED IN REFLECTION
                  </AutoTranslate>
                </h2>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.vision.description">
                 In order to create a location where life slows down and becomes more purposeful, LEOS ROYAL is envisioned as a tranquil haven where water, light, and architecture all coexist together. Modern life feels softer and more human as it follows a balanced rhythm that promotes presence and introspection. Spaces are still open, flowing, and welcoming, meant to enrich everyday living without overpowering the senses. Here, progress happens slowly, like light floating over motionless water.
                  </AutoTranslate>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section - Full Width Banner */}
        <section className="relative py-18 sm:py-16 md:py-58 bg-gray-900 overflow-hidden">
          {/* Background Image with Overlay - Parallax Effect */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(/images/leos-royal/about.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 leading-tight">
              <AutoTranslate translationKey="leosRoyal.philosophy.title">
                THE PHILOSOPHY OF REFLECTION
              </AutoTranslate>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-5xl mx-auto">
              <AutoTranslate translationKey="leosRoyal.philosophy.description">
              Water and light come together to form LEOS ROYAL, an environment where motion and stillness coexist as canals, waterfalls, and reflective surfaces provide peaceful moments that reestablish equilibrium throughout the day. Through delicate design and smooth transitions, every element is created to express emotional ease and organic harmony, adhering to a philosophy that prioritizes depth above intensity. As a result, you are invited to re-establish a deeper, more meaningful connection with life in a timeless, grounded community.
              </AutoTranslate>
            </p>
          </div>
        </section>

        {/* Form Beyond Architecture Section */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
          {/* Diagonal Path Line Shapes */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-[#D4AF70] to-[#C9A961] transform origin-top-right" 
               style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
          </div>
          <div className="absolute bottom-0 right-1/4 w-1/4 h-1/3 bg-gradient-to-tl from-gray-100 to-white transform" 
               style={{ clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0% 100%)' }}>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Text Content on Gold Background */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#C9A961] to-[#B89850] p-6 sm:p-8 md:p-12 lg:p-16 rounded-lg">
                  <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-8 leading-tight">
                    <AutoTranslate translationKey="leosRoyal.architecture.title">
                      FORM BEYOND ARCHITECTURE
                    </AutoTranslate>
                  </h2>
                  <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                    <AutoTranslate translationKey="leosRoyal.architecture.description">
                   Curved shapes, soft materials, and light-filled surfaces all contribute to the serene sophistication of LEOS ROYAL's design, which is fashioned by intention and inspired by the natural world. As the building subtly changes with sunlight and daily cycles to create peaceful, seamless transitions, water plays a key function in cooling the air, setting the mood, and creating fluid movement over the landscape. It is a place that reacts to you, providing areas that are fluid, living, and thoughtfully designed for your comfort and well-being. </AutoTranslate>
                  </p>
                </div>
              </div>

              {/* Right Side - Image with Rounded Corners */}
              <div className="relative">
                <div className="relative rounded overflow-hidden">
                  <img 
                    src="/images/leos-royal/form-beyond-architecture.webp" 
                    alt="Leos Royal Aerial View" 
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
                    }}
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unit Sizes Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              {/* Left Side - Image with Gold Bar Extension */}
              <div className="relative">
                {/* Main Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/leos-royal/LR_SIGNATURE-CANAL-VILLA-Night.webp" 
                    alt="Leos Royal Night Villa" 
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
                    }}
                  />
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className="relative bg-white p-6 sm:p-8 lg:p-12 lg:pl-16 z-20">
                <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-6 leading-tight">
                  <AutoTranslate translationKey="leosRoyal.unitSizes.title">
                    UNIT SIZES
                  </AutoTranslate>
                </h2>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.unitSizes.subtitle">
                   A constellation of peace is formed by LEOS ROYAL. Each has a distinct form but a common spirit.


                  </AutoTranslate>
                </p>
                
                {/* Unit Details */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-[#C9A961] rounded-full"></div>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">
                      <AutoTranslate translationKey="leosRoyal.unitSizes.townhouses">
                     The anticipated sellable size range for townhouses with three or four bedrooms and a maid's room is 2,407 to 3,233 square feet.
                    </AutoTranslate>
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-[#C9A961] rounded-full"></div>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">
                      <AutoTranslate translationKey="leosRoyal.unitSizes.villas">
                      The anticipated sellable size range for villas with five to seven bedrooms, a maid's room, and a driver's room is 4,200 to 7,080 square feet.
                      </AutoTranslate>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* World Class Amenities Section */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-black overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl md:text-2xl font-bold text-white mb-6 leading-tight">
                <AutoTranslate translationKey="leosRoyal.amenities.title">
                  WORLD CLASS AMENITIES
                </AutoTranslate>
              </h2>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-5xl mx-auto">
                <AutoTranslate translationKey="leosRoyal.amenities.description">
               LEOS ROYAL, the first AI-powered community in the world, uses seamless, intuitive technology to improve daily life. From the intelligent Aurora Walk to the AI Wellness Arena led by Rio Ferdinand, innovation is seamlessly integrated into the surroundings. Every experience is designed to promote convenience, meaningful engagement, and wellness. </AutoTranslate>
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* AI Wellness Area */}
              <div className="group relative bg-transparent border border-gray-700 hover:border-[#C9A961] rounded-lg p-8 transition-all duration-300 hover:bg-gray-800/30">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img src={'/images/leos-royal/AI-Wellness-Arena.svg'} alt="AI Wellness Area Icon" className="w-full h-full object-contain"/>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wide">
                    <AutoTranslate translationKey="leosRoyal.amenities.wellness">
                      AI WELLNESS AREA
                    </AutoTranslate>
                  </h3>
                </div>
              </div>

              {/* AI Reflection Club */}
              <div className="group relative bg-transparent border border-gray-700 hover:border-[#C9A961] rounded-lg p-8 transition-all duration-300 hover:bg-gray-800/30">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img src={'/images/leos-royal/AI-Reflection-Club.svg'} alt="AI Reflection Club Icon" className="w-full h-full object-contain"/>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wide">
                    <AutoTranslate translationKey="leosRoyal.amenities.reflection">
                      AI REFLECTION CLUB
                    </AutoTranslate>
                  </h3>
                </div>
              </div>

              {/* AI Atelier Street */}
              <div className="group relative bg-transparent border border-gray-700 hover:border-[#C9A961] rounded-lg p-8 transition-all duration-300 hover:bg-gray-800/30">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                  
                    <img src={'/images/leos-royal/AI-Retalier-Street.svg'} alt="AI Retailer Street Icon" className="w-full h-full object-contain"/>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wide">
                    <AutoTranslate translationKey="leosRoyal.amenities.atelier">
                      AI ATELIER STREET
                    </AutoTranslate>
                  </h3>
                </div>
              </div>

              {/* AI Aurora Walk */}
              <div className="group relative bg-transparent border border-gray-700 hover:border-[#C9A961] rounded-lg p-8 transition-all duration-300 hover:bg-gray-800/30">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                    
                    <img src={'/images/leos-royal/AI-Aurora-Walk.svg'} alt="AI Aurora Walk Icon" className="w-full h-full object-contain"/>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wide">
                    <AutoTranslate translationKey="leosRoyal.amenities.aurora">
                      AI AURORA WALK
                    </AutoTranslate>
                  </h3>
                </div>
              </div>

              {/* AI Halo Port */}
              <div className="group relative bg-transparent border border-gray-700 hover:border-[#C9A961] rounded-lg p-8 transition-all duration-300 hover:bg-gray-800/30">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img src={'/images/leos-royal/AI-Halo-Port.svg'} alt="AI Halo Port Icon" className="w-full h-full object-contain"/>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wide">
                    <AutoTranslate translationKey="leosRoyal.amenities.halo">
                      AI HALO PORT
                    </AutoTranslate>
                  </h3>
                </div>
              </div>

              {/* AI Rhythm Lounge */}
              <div className="group relative bg-transparent border border-gray-700 hover:border-[#C9A961] rounded-lg p-8 transition-all duration-300 hover:bg-gray-800/30">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img src={'/images/leos-royal/AI-Rhythm-Lounge.svg'} alt="AI Rhythm Lounge Icon" className="w-full h-full object-contain"/>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wide">
                    <AutoTranslate translationKey="leosRoyal.amenities.rhythm">
                      AI RHYTHM LOUNGE
                    </AutoTranslate>
                  </h3>
                </div>
              </div>

              {/* AI Family Discovery */}
              <div className="group relative bg-transparent border border-gray-700 hover:border-[#C9A961] rounded-lg p-8 transition-all duration-300 hover:bg-gray-800/30">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img src={'/images/leos-royal/AI-Family-Discovery.svg'} alt="AI Family Discovery Icon" className="w-full h-full object-contain"/>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wide">
                    <AutoTranslate translationKey="leosRoyal.amenities.family">
                      AI FAMILY DISCOVERY
                    </AutoTranslate>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Location Section */}
        <section className="bg-gray-50 py-12 sm:py-16 md:py-20 overflow-hidden">
          <div className="max-w-full sm:max-w-[90%] lg:max-w-[80%] flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-2xl font-bold text-gray-900 mb-6 leading-tight">
                <AutoTranslate translationKey="leosRoyal.location.title">
                  STRATEGIC LOCATION
                </AutoTranslate>
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-5xl mx-auto">
                <AutoTranslate translationKey="leosRoyal.location.description">
               LEOS Royal is situated in one of Dubai's most strategic and linked locations, located across from Dubai Outlet Mall on Al Ain Road, about sixteen minutes from Downtown Dubai. Important locations are easily accessible from this ideal location, which provides easy access to Dubai International Airport and important metropolitan thoroughfares. The district is becoming a high-value center for families, professionals, and investors since it is surrounded by top schools, recreational opportunities, and rapidly expanding infrastructure. Convenience, connectivity, and long-term growth come together at LEOS Royal in an environment built for the future. </AutoTranslate>
              </p>
            </div>

            {/* Map and Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-4 items-start w-full">
                {/* Map Image */}
                 <img src={'/images/leos-royal/map.svg'} alt="Leos Royal Location Map" className="w-full max-w-full lg:max-w-[800px] h-auto lg:h-[500px] object-contain lg:object-cover mx-auto" />

              {/* Right Side - Contact Form */}
              <div className="relative w-full">
                <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                    <AutoTranslate translationKey="leosRoyal.contactForm.title">
                      Contact Form
                    </AutoTranslate>
                  </h3>
                  
                  {contactState.succeeded ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        <AutoTranslate translationKey="leosRoyal.form.successTitle">Thank You!</AutoTranslate>
                      </h3>
                      <p className="text-gray-600">
                        <AutoTranslate translationKey="leosRoyal.form.successMessage">
                          We've received your inquiry and will contact you shortly.
                        </AutoTranslate>
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 sm:space-y-5">
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <input
                            type="text"
                            name="firstName"
                            value={contactFormData.firstName}
                            onChange={handleContactInputChange}
                            placeholder="First Name"
                            required
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all duration-300"
                          />
                          <ValidationError prefix="First Name" field="firstName" errors={contactState.errors} />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="lastName"
                            value={contactFormData.lastName}
                            onChange={handleContactInputChange}
                            placeholder="Last Name"
                            required
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all duration-300"
                          />
                          <ValidationError prefix="Last Name" field="lastName" errors={contactState.errors} />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex gap-2">
                        <div className="relative" style={{ minWidth: '90px' }}>
                          <select 
                            name="countryCode"
                            value={contactFormData.countryCode}
                            onChange={handleContactInputChange}
                            className="w-full px-2 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all duration-300"
                          >
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+91">🇮🇳 +91</option>
                          </select>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={contactFormData.phone}
                          onChange={handleContactInputChange}
                          placeholder="Phone"
                          required
                          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all duration-300"
                        />
                      </div>
                      <ValidationError prefix="Phone" field="phone" errors={contactState.errors} />

                      {/* Email */}
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={contactFormData.email}
                          onChange={handleContactInputChange}
                          placeholder="Enter your email address"
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all duration-300"
                        />
                        <ValidationError prefix="Email" field="email" errors={contactState.errors} />
                      </div>

                      {/* Message */}
                      <div>
                        <textarea
                          name="message"
                          value={contactFormData.message}
                          onChange={handleContactInputChange}
                          rows={4}
                          placeholder="Your message"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A961] focus:border-transparent transition-all duration-300 resize-none"
                        />
                        <ValidationError prefix="Message" field="message" errors={contactState.errors} />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={contactState.submitting}
                        className="w-full bg-gradient-to-r from-[#C9A961] to-[#B89850] hover:from-[#B89850] hover:to-[#A78740] text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {contactState.submitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <AutoTranslate translationKey="leosRoyal.form.submitting">Submitting...</AutoTranslate>
                          </span>
                        ) : (
                          <AutoTranslate translationKey="leosRoyal.contactForm.submit">
                            Submit
                          </AutoTranslate>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <AutoTranslate translationKey="leosRoyal.faq.title">
                  Frequently Asked Questions
                </AutoTranslate>
              </h2>
              <p className="text-lg text-gray-600">
                <AutoTranslate translationKey="leosRoyal.faq.subtitle">
                  Everything you need to know about Leos Royal Dubai
                </AutoTranslate>
              </p>
            </div>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  <AutoTranslate translationKey="leosRoyal.faq.question1">
                    What makes Leos Royal unique in Dubai's luxury real estate market?
                  </AutoTranslate>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.faq.answer1">
                    Leos Royal is the world's first AI-powered residential community, seamlessly integrating cutting-edge technology with serene waterfront living. The architecture harmonizes with nature, creating a unique rhythm of stillness and movement that distinguishes it from other luxury developments in Dubai.
                  </AutoTranslate>
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  <AutoTranslate translationKey="leosRoyal.faq.question2">
                    What are the available unit sizes at Leos Royal?
                  </AutoTranslate>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.faq.answer2">
                    Leos Royal offers premium residences ranging from spacious 1-bedroom apartments to expansive penthouses. Each unit is meticulously designed with luxury finishes, smart home integration, and panoramic views, catering to diverse lifestyle preferences.
                  </AutoTranslate>
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  <AutoTranslate translationKey="leosRoyal.faq.question3">
                    What amenities are included in the development?
                  </AutoTranslate>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.faq.answer3">
                    Residents enjoy world-class amenities including infinity pools, state-of-the-art fitness centers, spa facilities, landscaped gardens, children's play areas, 24/7 concierge services, and AI-powered smart home features. The development also includes retail spaces, dining options, and waterfront promenades.
                  </AutoTranslate>
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  <AutoTranslate translationKey="leosRoyal.faq.question4">
                    What is the partnership between Rino Properties and Leos Royal?
                  </AutoTranslate>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.faq.answer4">
                    Rino Properties has an exclusive partnership with Leos Royal, serving as the premier real estate agency for this exceptional development. Our partnership ensures clients receive expert guidance, exclusive access to units, and comprehensive after-sales support throughout their investment journey.
                  </AutoTranslate>
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  <AutoTranslate translationKey="leosRoyal.faq.question5">
                    What are the payment plans and investment opportunities?
                  </AutoTranslate>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.faq.answer5">
                    Leos Royal offers flexible payment plans designed for both end-users and investors. With competitive pricing, attractive ROI potential, and Dubai's strong rental market, it presents an excellent investment opportunity. Contact our team to discuss customized payment options tailored to your requirements.
                  </AutoTranslate>
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  <AutoTranslate translationKey="leosRoyal.faq.question6">
                    Where is Leos Royal located in Dubai?
                  </AutoTranslate>
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <AutoTranslate translationKey="leosRoyal.faq.answer6">
                    Leos Royal is strategically positioned in one of Dubai's most prestigious waterfront locations, offering exceptional connectivity to key business districts, entertainment hubs, and international airports. The prime location ensures residents enjoy both tranquility and accessibility to urban amenities.
                  </AutoTranslate>
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                <AutoTranslate translationKey="leosRoyal.faq.contactText">
                  Have more questions? Our team is here to help!
                </AutoTranslate>
              </p>
              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#B8852F] text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <AutoTranslate translationKey="leosRoyal.faq.contactButton">
                  Contact Us Now
                </AutoTranslate>
              </a>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </>
  );
};

export default LeosRoyal;
