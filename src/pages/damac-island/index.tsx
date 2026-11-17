import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useForm, ValidationError } from '@formspree/react';
import Header from '../../components/damac-island/Header';
import HeroSection from '../../components/damac-island/HeroSection';
import AmenitiesSection from '../../components/damac-island/AmenitiesSection';
import { countries } from '../../data/countries';
import { galleryImages } from '../../data/galleryImages';
import { useLanguage } from '../../context/LanguageContext';


const DamacIsland = () => {
  const { t, language, isRTL } = useLanguage();
  
  // Load translations from damac-island.json
  const [translations, setTranslations] = useState<any>({});
  
  useEffect(() => {
    const loadDamacIslandTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}/damac-island.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
      }
    };
    
    loadDamacIslandTranslations();
  }, [language]);
  
  // Translation helper function
  const tDamacIsland = (key: string, fallback: string = '') => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  };
  
  // Formspree form hook
  const [state, handleFormspreeSubmit] = useForm("mnnlayar");
  
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    investment: '',
    visitDate: '',
    visitTime: ''
  });

  // Country dropdown states
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to UAE
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  // Filter countries based on search term - memoized for performance
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

  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');
  
  // Gallery modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Floorplan fullscreen modal states
  const [isFloorplanModalOpen, setIsFloorplanModalOpen] = useState(false);
  const [currentFloorplanImage, setCurrentFloorplanImage] = useState('');
  
  // Key Features slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Property Cards slider state  
  const [currentPropertySlide, setCurrentPropertySlide] = useState(0);
  
  // Luxury Residences slider states
  const [currentResidenceSlideStudio, setCurrentResidenceSlideStudio] = useState(0);
  const [currentResidenceSlide1BR, setCurrentResidenceSlide1BR] = useState(0);
  const [currentResidenceSlide2BR, setCurrentResidenceSlide2BR] = useState(0);
  const [currentResidenceSlide3BR, setCurrentResidenceSlide3BR] = useState(0);

  // Responsive slider state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Auto-slide pause state
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  // Schedule Visit Popup state
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  
  // Contact Form Popup state
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [popupFormType, setPopupFormType] = useState(''); // 'bookTour' or 'getDetails'
  
  // Success Popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    // Smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Show popup after 2 seconds on initial load
    const popupTimer = setTimeout(() => {
      // Check if user hasn't already dismissed it in this session
      const hasSeenPopup = sessionStorage.getItem('scheduleVisitPopupSeen');
      if (!hasSeenPopup) {
        setShowSchedulePopup(true);
      }
    }, 2000);

    // Responsive breakpoint detection with debounce for performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);
      }, 150);
    };

    // Initial check
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
    
    // Scroll effect for navbar with throttle
    let scrollTimer: NodeJS.Timeout;
    let lastScrollTop = 0;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollTop = window.scrollY;
        if (Math.abs(scrollTop - lastScrollTop) > 10) {
          setIsScrolled(scrollTop > 50);
          lastScrollTop = scrollTop;
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
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
            animationObserver.unobserve(entry.target); // Stop observing once animated
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
      clearTimeout(popupTimer);
      clearTimeout(resizeTimer);
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      animationObserver.disconnect();
    };
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      
      // Modal navigation
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex]);

  // Auto-slide functionality for key features slider
  useEffect(() => {
    if (isSliderPaused || isMobile) return; // Pause auto-slide on mobile
    
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide === 3 ? 0 : prevSlide + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isSliderPaused, isMobile]);

  // Auto-slide functionality for property cards slider
  useEffect(() => {
    if (isSliderPaused || isMobile) return; // Pause auto-slide on mobile
    
    const interval = setInterval(() => {
      setCurrentPropertySlide(prevSlide => (prevSlide === 2 ? 0 : prevSlide + 1));
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isSliderPaused, isMobile]);

  // Auto-slide functionality for luxury residence sliders (Studio, 1BR, 2BR, 3BR)
  useEffect(() => {
    if (isSliderPaused || isMobile) return; // Pause auto-slide on mobile

    // Studio: 4 images
    const intervalStudio = setInterval(() => {
      setCurrentResidenceSlideStudio(prevSlide => (prevSlide + 1) % 4);
    }, 4000);

    // 1BR: 2 images
    const interval1BR = setInterval(() => {
      setCurrentResidenceSlide1BR(prevSlide => (prevSlide + 1) % 2);
    }, 4500);

    // 2BR: 4 images
    const interval2BR = setInterval(() => {
      setCurrentResidenceSlide2BR(prevSlide => (prevSlide + 1) % 4);
    }, 5000);

    // 3BR: 4 images
    const interval3BR = setInterval(() => {
      setCurrentResidenceSlide3BR(prevSlide => (prevSlide + 1) % 4);
    }, 5500);

    return () => {
      clearInterval(intervalStudio);
      clearInterval(interval1BR);
      clearInterval(interval2BR);
      clearInterval(interval3BR);
    };
  }, [isSliderPaused, isMobile]);

 
  // Custom submit handler that combines form data with Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object for Formspree
    const formDataObj = new FormData(e.target as HTMLFormElement);
    
    // Call Formspree submit handler
    await handleFormspreeSubmit(formDataObj);

    // Close popup and show success popup if submission was successful
    if (state.succeeded) {
      closeContactPopup();
      setShowSuccessPopup(true);
    }

     setFormData({
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        investment: '',
        visitDate: '',
        visitTime: ''
      });
    
  };

  // Reset form when submission is successful
  useEffect(() => {
    if (state.succeeded) {
      setFormData({
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        investment: '',
        visitDate: '',
        visitTime: ''
      });
      // Show success popup
      setShowContactPopup(false);
      setShowSuccessPopup(true);
    }
  }, [state.succeeded]);

  // Gallery modal functions - memoized for better performance
  const openModal = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, []);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, []);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Floorplan fullscreen modal handlers
  const openFloorplanModal = useCallback((imageSrc: string) => {
    setCurrentFloorplanImage(imageSrc);
    setIsFloorplanModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeFloorplanModal = useCallback(() => {
    setIsFloorplanModalOpen(false);
    setCurrentFloorplanImage('');
    document.body.style.overflow = 'unset';
  }, []);

  // Schedule Visit Popup handlers
  const closeSchedulePopup = useCallback(() => {
    setShowSchedulePopup(false);
    sessionStorage.setItem('scheduleVisitPopupSeen', 'true');
  }, []);

  const scrollToContact = useCallback(() => {
    closeSchedulePopup();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [closeSchedulePopup]);

  // Contact Form Popup handlers
  const openContactPopup = useCallback((formType: string) => {
    setPopupFormType(formType);
    setShowContactPopup(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }, []);

  const closeContactPopup = useCallback(() => {
    setShowContactPopup(false);
    setPopupFormType('');
    document.body.style.overflow = 'unset'; // Restore scrolling
    // Reset form if needed
    setFormData({
      name: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      investment: '',
      visitDate: '',
      visitTime: ''
    });
  }, []);

  // Brochure Download Handler
  const handleBrochureDownload = useCallback(() => {
    const pdfUrl = 'https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/damac-island.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Damac-Island-Brochure.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Filter gallery images based on selected category - memoized
  const filteredGalleryImages = useMemo(() => 
    galleryFilter === 'all' 
      ? galleryImages 
      : galleryImages.filter(image => image.category === galleryFilter),
    [galleryFilter]
  );

  // Floorplan data - memoized to prevent recreating on every render
  const floorplanTypes = useMemo(() => [
    {
      id: '1-bedroom-apartment',
      label: tDamacIsland('floorplans.oneBed', '1 Bedroom Apartment'),
      image: '/images/tasmeer/1bed.png',
      active: true
    },
    {
      id: '2-bedroom-apartment',
      label: tDamacIsland('floorplans.twoBed', '2 Bedroom Apartment'),
      image: '/images/tasmeer/2bed.png',
      active: false
    },
    {
      id: 'Studio-apartment',
      label: tDamacIsland('floorplans.studio', 'Studio Apartment'),
      image: '/images/tasmeer/studio.png',
      active: false
    }
  ], [tDamacIsland]);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Damac Island Dubai | Luxury Apartments & Villas | Rino Properties</title>
        <meta name="title" content="Damac Island Dubai | Luxury Apartments & Villas | Rino Properties" />
        <meta name="description" content="Damac Island Dubai — exclusive island living with luxury apartments & villas, private beaches, pools and resort-style amenities. Easy payment plans by Rino Properties." />
        <meta name="keywords" content="Damac Island, Damac Island Dubai, Damac Islands price, DAMAC villas Dubai, island living Dubai, waterfront apartment Dubai, Damac developer, private beach residence Dubai, Damac payment plan, off-plan island Dubai, luxury resort Dubai residence" />
        <meta name="author" content="Rino Properties Real Estate" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Content-Language" content="en-US" />

        {/* Performance optimization - preconnects handled globally in _document.tsx */}
        <link rel="dns-prefetch" href="//wa.me" />
        
        {/* Favicon and Web App Manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="msapplication-TileColor" content="#ef4444" />
        
        {/* Performance and security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
        
        
        {/* Geographic Meta Tags */}
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Damac Island, Dubai, United Arab Emirates" />
        <meta name="geo.position" content="25.0553;55.2089" />
        <meta name="ICBM" content="25.0553, 55.2089" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rinoproperties.com/damac-island" />
        <meta property="og:title" content="Damac Island Dubai | Luxury Apartments & Villas" />
        <meta property="og:description" content="Damac Island Dubai — exclusive island living with luxury apartments & villas, private beaches, pools and resort-style amenities. Easy payment plans by Rino Properties." />
        <meta property="og:image" content="https://rinoproperties.com/images/hero_bg.webp" />
        <meta property="og:image:secure_url" content="https://rinoproperties.com/images/hero_bg.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Damac Island Dubai - Modern luxury apartments and villas with premium amenities" />
        <meta property="og:site_name" content="Rino Properties" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:publisher" content="https://www.facebook.com/p/Rino-Properties-61568133758317/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://rinoproperties.com/damac-island" />
        <meta name="twitter:title" content="Damac Island Dubai | Luxury Apartments & Villas" />
        <meta name="twitter:description" content="Damac Island Dubai — exclusive island living with luxury apartments & villas, private beaches and resort-style amenities. By Rino Properties." />
        <meta name="twitter:image" content="https://rinoproperties.com/images/hero_bg.webp" />
        <meta name="twitter:image:alt" content="Damac Island Dubai - Modern luxury apartments and villas with premium amenities and lifestyle" />
        <meta name="twitter:creator" content="@rinoproperties" />
        <meta name="twitter:site" content="@rinoproperties" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/images/tasmeer/logo.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Damac Island" />
        <meta name="application-name" content="Damac Island" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rinoproperties.com/damac-island" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Critical Performance Optimizations - Reduce latency by 150ms+ */}
        {/* Preconnects handled globally in _document.tsx */}
        
        {/* Preload Critical Font - Montserrat Light 300 for headings */}
        <link 
          rel="preload" 
          href="https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="" 
        />
        
        {/* Optimized Font Loading - display=swap for instant text visibility */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
          media="print" 
          onLoad={(e) => { (e.target as HTMLLinkElement).media = 'all'; }}
        />
        <noscript>
          <link 
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" 
            rel="stylesheet" 
          />
        </noscript>
        
        {/* Preload ONLY Hero/Critical Images - LCP optimization */}
        <link rel="preload" href="/images/tasmeer/bg.webp" as="image" type="image/webp" fetchPriority="high" />

        {/* DNS Prefetch for Third-party Resources - Load in parallel */}
        <link rel="dns-prefetch" href="//wa.me" />
        <link rel="dns-prefetch" href="//www.facebook.com" />
        <link rel="dns-prefetch" href="//www.instagram.com" />
        <link rel="dns-prefetch" href="//www.linkedin.com" />
        
        {/* Structured Data - Real Estate Listing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Residence",
              "name": "Damac Island",
              "description": "Premium residential development in Dubai featuring luxury apartments and villas with world-class amenities including fitness suites, swimming pools, private beaches, and resort-style living.",
              "url": "https://rinoproperties.com/damac-island",
              "image": [
                "https://rinoproperties.com/images/tasmeer/bg.webp",
                "https://rinoproperties.com/images/tasmeer/1bed.png",
                "https://rinoproperties.com/images/tasmeer/2bed.png",
                "https://rinoproperties.com/images/tasmeer/3bed.png",
                "https://rinoproperties.com/images/tasmeer/studio.png",
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jumeirah Village Circle",
                "addressLocality": "Dubai",
                "addressRegion": "Dubai",
                "addressCountry": "AE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "25.0553",
                "longitude": "55.2089"
              },
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Swimming Pool",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Kids Pool", 
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Indoor Gym",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Outdoor Gym",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Jogging Track",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Steam Room / Sauna",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Yoga Station",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Kids Play Area",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Business Lounge",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Co-Working Spaces",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Library",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "VR & Gaming Room",
                  "value": true
                }
              ],
              "numberOfRooms": "Studio, 1BR, 2BR, 3BR Apartments & Villas",
              "floorSize": {
                "@type": "QuantitativeValue",
                "minValue": 525,
                "maxValue": 2500,
                "unitCode": "SQF"
              },
              "occupancy": {
                "@type": "QuantitativeValue",
                "maxValue": 1000
              }
            })
          }}
        />
        
        {/* Structured Data - Real Estate Agent */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Rino Properties",
              "description": "Premium real estate agency specializing in luxury properties in Dubai and Spain. Official marketing partner for Damac Island in Dubai.",
              "url": "https://rinoproperties.com",
              "logo": "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png",
              "image": "https://rinoproperties.com/images/tasmeer/bg.webp",
              "telephone": "+971547647485",
              "email": "assem@rinoproperties.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rino Invest Group, Business Village Building – B, Office 330",
                "addressLocality": "Deira",
                "addressRegion": "Dubai",
                "addressCountry": "AE"
              },
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
              "serviceType": ["Luxury Real Estate", "Property Investment", "Apartment Sales", "Property Management"],
              "sameAs": [
                "https://www.facebook.com/p/Rino-Properties-61568133758317/",
                "https://www.instagram.com/rinoinvest_properties",
                "https://ae.linkedin.com/company/rino-invest-properties",
                "https://www.tiktok.com/@rino.properties"
              ]
            })
          }}
        />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Damac Properties",
              "description": "Leading real estate development company creating premium residential projects in Dubai including Damac Island luxury development.",
              "url": "https://rinoproperties.com",
              "logo": "https://rinoproperties.com/images/tasmeer/logo.png",
              "foundingLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Dubai",
                  "addressCountry": "AE"
                }
              },
              "areaServed": {
                "@type": "Country",
                "name": "United Arab Emirates"
              },
              "industry": "Real Estate Development"
            })
          }}
        />
        
        {/* Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Damac Island Sales Office",
              "description": "Sales office for Damac Island luxury apartments and villas in Dubai with world-class amenities and resort-style living",
              "image": "https://rinoproperties.com/images/tasmeer/bg.webp",
              "telephone": "+971547647485",
              "email": "assem@rinoproperties.com",
              "url": "https://rinoproperties.com/damac-island",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Damac Island",
                "addressLocality": "Dubai",
                "addressRegion": "Dubai",
                "addressCountry": "AE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "25.0553",
                "longitude": "55.2089"
              },
              "openingHours": "Mo-Su 09:00-18:00",
              "priceRange": "$$$$"
            })
          }}
        />
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
            background: #B8883A;
          }

          /* Mobile Performance Optimizations */
          * {
            -webkit-tap-highlight-color: transparent;
          }
          
          img {
            content-visibility: auto;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }

          /* Touch-friendly interactions */
          .touch-manipulation {
            touch-action: manipulation;
          }

          /* Optimize animations on mobile */
          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
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

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          .animate-scaleIn {
            animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .animate-slideDown {
            animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          @keyframes floating {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          /* Mobile Optimizations */
          @media (max-width: 640px) {
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            /* Prevent horizontal scroll */
            body {
              overflow-x: hidden;
            }
            
            /* Better touch targets */
            button, a {
              min-height: 44px;
            }
            
            /* Optimized text sizing */
            h1, h2, h3 {
              line-height: 1.2;
            }
          }

          /* Prevent zoom on input focus on iOS */
          @media screen and (max-width: 767px) {
            input[type="text"],
            input[type="email"],
            input[type="tel"],
            textarea {
              font-size: 16px !important;
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
      </Head>

      <div className="min-h-screen bg-gray-900 text-white" suppressHydrationWarning>
      
        {/* Header */}
        <Header onOpenContactPopup={openContactPopup} />

        {/* Hero Section */}
        <HeroSection onOpenContactPopup={openContactPopup} />
  
      {/* Main Content */}
      <main id="main-content" role="main">
     
        {/* Amenities Section */}
        <AmenitiesSection />

        {/* Starting Prices Section */}
        <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4">
                Starting <span className="text-[#000000] font-normal">Prices</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Invest in Damac Island's Future with exceptional pricing and flexible payment plans in Dubai's most exclusive island community
              </p>
            </div>

            
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Studio Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#000000]">
                <div className="p-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#000000]/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Studio</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">450 units</p>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-[#00B67A]">AED 674,999</p>
                    <p className="text-xs text-gray-400 mt-1">AED</p>
                  </div>

                  {/* Area */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Area:</span>
                      <span className="text-base font-semibold text-gray-900">525 sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1 Bedroom Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#000000]">
                <div className="p-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#000000]/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">1 Bedroom</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">320 units</p>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-[#00B67A]">AED 1,074,999</p>
                    <p className="text-xs text-gray-400 mt-1">AED</p>
                  </div>

                  {/* Area */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Area:</span>
                      <span className="text-base font-semibold text-gray-900">893 sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2 Bedroom Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-[#000000]">
                <div className="p-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#000000]/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#000000]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">2 Bedroom</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">180 units</p>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-[#00B67A]">AED 1,499,999</p>
                    <p className="text-xs text-gray-400 mt-1">AED</p>
                  </div>

                  {/* Area */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Area:</span>
                      <span className="text-base font-semibold text-gray-900">1,250 sq.ft</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <button
                onClick={() => openContactPopup('getDetails')}
                className="inline-flex items-center gap-2 bg-[#00B67A] hover:bg-[#00A066] text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Get More Information</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        
        {/* CTA Section */}
        {/* <CTASection tTasmeer={tDamacIsland} onOpenContactPopup={openContactPopup} /> */}

        {/* Available Residences Section */}
        <section id="floorplans" aria-labelledby="floorplans-heading" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-14">
              <h2 id="floorplans-heading" className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-4" style={{fontFamily:'Montserrat, sans-serif'}}>
                {tDamacIsland('floorplans.availableTitle', 'Available Residences')}
              </h2>
              {/* <p className="text-sm sm:text-base text-gray-600">
                {tDamacIsland('floorplans.subtitle', 'G + 5 Boutique Building • Balcony / Terrace in Every Home')}
              </p> */}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Studios Card */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => openFloorplanModal('/images/tasmeer/studio.png')}>
                  <img 
                    src="/images/tasmeer/studio.png"
                    alt="Studio Apartment Floor Plan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="600"
                    height="400"
                    decoding="async"
                  />
                  {/* Fullscreen Icon Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="bg-[#D69F3F] text-center py-2 px-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {tDamacIsland('floorplans.studio', 'Studios')}
                    </h3>
                  </div>
                  <div className="mb-4 text-[#D69F3F]">
                    <p className="text-xl font-bold">
                      {tDamacIsland('floorplans.studioPrice', 'From AED 744,000')}
                    </p>
                  </div>
                  <div className="mb-4 space-y-1">
                    <p className="text-xs text-gray-400">Internal: <span className="text-white">350 sq.ft</span></p>
                    <p className="text-xs text-gray-400">Outdoor: <span className="text-white">71-77 sq.ft</span></p>
                    <p className="text-xs font-semibold text-gray-300">Total: <span className="text-[#D69F3F]">421-427 sq.ft</span></p>
                  </div>
                
                  <button
                    onClick={() => openContactPopup('getDetails')}
                    className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-[#D69F3F] hover:bg-[#C4903A] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {tDamacIsland('floorplans.requestButton', 'Request Floor Plan')}
                  </button>
                </div>
              </div>

              {/* 1 Bedroom Card */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => openFloorplanModal('/images/tasmeer/1bed.png')}>
                  <img 
                    src="/images/tasmeer/1bed.png"
                    alt="1 Bedroom Apartment Floor Plan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="600"
                    height="400"
                    decoding="async"
                  />
                  {/* Fullscreen Icon Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="bg-[#D69F3F] text-center py-2 px-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {tDamacIsland('floorplans.oneBed', '1 Bedroom')}
                    </h3>
                  </div>
                  <div className="mb-4 text-[#D69F3F]">
                    <p className="text-xl font-bold">
                      {tDamacIsland('floorplans.oneBedPrice', 'AED 1.2M – 1.7M')}
                    </p>
                  </div>
                  <div className="mb-4 space-y-1">
                    <p className="text-xs text-gray-400">Internal: <span className="text-white">644-652 sq.ft</span></p>
                    <p className="text-xs text-gray-400">Outdoor: <span className="text-white">148-155 sq.ft</span></p>
                    <p className="text-xs font-semibold text-gray-300">Total: <span className="text-[#D69F3F]">798-804 sq.ft</span></p>
                  </div>
                
                  <button
                    onClick={() => openContactPopup('getDetails')}
                    className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-[#D69F3F] hover:bg-[#C4903A] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {tDamacIsland('floorplans.requestButton', 'Request Floor Plan')}
                  </button>
                </div>
              </div>

              {/* 2 Bedrooms Card */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => openFloorplanModal('/images/tasmeer/2bed.png')}>
                  <img 
                    src="/images/tasmeer/2bed.png"
                    alt="2 Bedroom Apartment Floor Plan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="600"
                    height="400"
                    decoding="async"
                  />
                  {/* Fullscreen Icon Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="bg-[#D69F3F] text-center py-2 px-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {tDamacIsland('floorplans.twoBed', '2 Bedrooms')}
                    </h3>
                  </div>
                  <div className="mb-4 text-[#D69F3F]">
                    <p className="text-xl font-bold">
                      {tDamacIsland('floorplans.twoBedPrice', 'AED 1.8M – 1.94M')}
                    </p>
                  </div>
                  <div className="mb-4 space-y-1">
                    <p className="text-xs text-gray-400">Internal: <span className="text-white">1,043 sq.ft</span></p>
                    <p className="text-xs text-gray-400">Outdoor: <span className="text-white">176-241 sq.ft</span></p>
                    <p className="text-xs font-semibold text-gray-300">Total: <span className="text-[#D69F3F]">1,219-1,284 sq.ft</span></p>
                  </div>
               
                  <button
                    onClick={() => openContactPopup('getDetails')}
                    className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-[#D69F3F] hover:bg-[#C4903A] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {tDamacIsland('floorplans.requestButton', 'Request Floor Plan')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Apartment Showcase Section - Exterior & Interior Gallery */}
        <section id='gallery' aria-labelledby="gallery-heading" className="bg-gray-50 pb-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-10">
            {/* Section Title */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
                {tDamacIsland('gallery.title', 'Discover Gallery')}
              </p>
              <h2 id="gallery-heading" className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900 leading-tight" style={{fontFamily:'Montserrat, sans-serif'}}>
                {tDamacIsland('gallery.subtitle', 'Exterior & Interior Gallery')}
              </h2>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredGalleryImages.map((image, index) => {
                // Find the original index in the full gallery array for modal
                const originalIndex = galleryImages.findIndex(img => img.src === image.src);
                
                return (
                  <div 
                    key={image.src}
                    className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    onClick={() => openModal(originalIndex)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width="800"
                        height="600"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

    
        {/* Why Choose Us Section */}
        <section id="why-choose-us" className="py-12 sm:py-16 lg:py-20 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex flex-col md:flex-row md:items-center gap-8 sm:gap-10 lg:gap-12">
            {/* Section Title */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start mb-4 sm:mb-6 md:mb-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900 leading-tight text-center md:text-left mb-4 sm:mb-6 tracking-wider uppercase" style={{fontFamily:'Montserrat, sans-serif'}}>
                <span className="block text-black">{tDamacIsland('whyChoose.title', 'WHY CHOOSE')}</span>
                <span className="block text-black">{tDamacIsland('whyChoose.subtitle', 'RINO PROPERTIES?')}</span>
              </h3>
              <div className="w-16 sm:w-20 lg:w-24 h-px bg-[#D69F3F] mx-auto md:mx-0"></div>
            </div>
            {/* Right Features Grid */}
            <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto md:mx-0">
              {/* Card 1 */}
              <div className="group rounded-tl-2xl sm:rounded-tl-3xl border-2 border-black bg-white p-4 sm:p-6 flex flex-col items-center text-center shadow transition-all duration-300 hover:shadow-lg hover:border-[#D69F3F]">
                <div className="mb-3 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="#D69F3F" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.77 20 8.64 20 12C20 14.08 19.2 15.97 17.9 17.39Z"/>
                  </svg>
                </div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-2">{tDamacIsland('whyChoose.globalReach.title', 'Global Reach')}</h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{tDamacIsland('whyChoose.globalReach.description', 'Our multilingual team offers seamless communication for a global clientele.')}</p>
              </div>
              
              {/* Card 2 */}
              <div className="group rounded-tr-2xl sm:rounded-tr-3xl border-2 border-black bg-white p-4 sm:p-6 flex flex-col items-center text-center shadow transition-all duration-300 hover:shadow-lg hover:border-[#D69F3F]">
                <div className="mb-3 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="#D69F3F" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 1Z"/>
                  </svg>
                </div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-2">{tDamacIsland('whyChoose.services247.title', '24/7 Services')}</h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{tDamacIsland('whyChoose.services247.description', 'We provide round-the-clock support for a completely stress-free experience.')}</p>
              </div>
              
              {/* Card 3 */}
              <div className="group rounded-bl-2xl sm:rounded-bl-3xl border-2 border-black bg-white p-4 sm:p-6 flex flex-col items-center text-center shadow transition-all duration-300 hover:shadow-lg hover:border-[#D69F3F]">
                <div className="mb-3 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="#D69F3F" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L11.92 12.25L15 9.17V11.5C15 12.61 15.84 13.54 16.94 13.86L19.5 14.75V21H21.5V14.75L22 14.62C22.81 14.35 23.38 13.59 23.38 12.69V7.31C23.38 6.41 22.81 5.65 22 5.38L21 5V9Z"/>
                  </svg>
                </div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-2">{tDamacIsland('whyChoose.clientFirst.title', 'Client-First Approach')}</h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{tDamacIsland('whyChoose.clientFirst.description', 'Your satisfaction is our top priority, built on trust and transparency.')}</p>
              </div>
              
              {/* Card 4 */}
              <div className="group rounded-br-2xl sm:rounded-br-3xl border-2 border-black bg-[#D69F3F] p-4 sm:p-6 flex flex-col items-center text-center shadow transition-all duration-300 hover:shadow-lg">
                <div className="mb-3 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/20">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 17h20v2H2zm1.15-4.05L4 11l.85 1.95L6.8 13l-1.95.85L4 15.8l-.85-1.95L1.2 13l1.95-.05zm6.4-6.4L12 2l2.45 4.55L19 9l-4.55 2.45L12 16l-2.45-4.55L5 9l4.55-2.45z"/>
                  </svg>
                </div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2">{tDamacIsland('whyChoose.luxurySpecialists.title', 'Luxury Property Specialists')}</h4>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed">{tDamacIsland('whyChoose.luxurySpecialists.description', 'We offer a tailored experience focused on the most exclusive properties.')}</p>
              </div>
            </div>
          </div>
        </section>

      
      
        {/* Location Section - Arjan Living with Citywide Reach */}
        <section id="location" aria-labelledby="location-heading" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F5F1E8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                <div className="space-y-4">
                  <p className="text-lg sm:text-xl text-gray-600 font-light">{tDamacIsland('location.title', 'Location')}</p>
                   <h2 id="location-heading" className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 leading-tight text-start" style={{fontFamily:'Montserrat, sans-serif'}}>
                   {tDamacIsland('location.subtitle', 'Transformed by')} {" "}
                    <span className=" italic font-normal text-gray-700">{tDamacIsland('location.perspective', 'Perspective')}</span>
                  </h2>
                </div>
                
               
                {/* Local Amenities */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">1 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.publicTransport', 'Public Transport')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">2 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.childrenNursery', 'Children Nursery')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">3 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.mosque', 'Mosque')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">5 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.alKhailRoad', 'Al Khail Road')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">5 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.globalVillage', 'Global Village')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">5 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.imgWorlds', 'IMG Worlds of Adventure')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">8 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.hotels', '4 & 5 Star Hotels')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">10-30 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.schools', 'Schools')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">12 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.circleMall', 'Circle Mall')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">15 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.dubaiMall', 'Dubai Mall')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">15 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.burjKhalifa', 'Burj Khalifa')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">15 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.downtownDubai', 'Downtown Dubai')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">15 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.dubaiHillsMall', 'Dubai Hills Mall')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">18 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.businessBay', 'Business Bay')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">20 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.dxbAirport', 'Dubai International Airport')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">20 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.dwcAirport', 'Al Maktoum International Airport')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">20 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.dubaiCreek', 'Dubai Creek')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">20 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.dubaiFrame', 'Dubai Frame')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">20 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.difc', 'DIFC')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">25 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.mallOfEmirates', 'Mall of the Emirates')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">30 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.dubaiMarina', 'Dubai Marina')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">30 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.jumeirahBeach', 'Jumeirah Beach')}</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border-2 border-black hover:border-[#D69F3F] transition-colors duration-300">
                      <div className="text-xl font-normal text-[#D69F3F] mb-1">35 Min</div>
                      <div className="text-xs text-gray-600">{tDamacIsland('location.amenities.palmJumeirah', 'Palm Jumeirah')}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Map */}
              <div className="order-1 lg:order-2 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d42080.73560577453!2d55.317645!3d25.089244!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDA1JzIxLjMiTiA1NcKwMTknMDMuNSJF!5e1!3m2!1sen!2sus!4v1762866775024!5m2!1sen!2sus" 
                  width="600" 
                  height="450" 
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:!h-[600px] rounded-lg"
                  title="Location map of Binghatti Vintage in Jumeirah Village Circle (JVC), Dubai"
                />
               </div>
            </div>
          </div>
        </section>

        {/* Schedule a Visit Section */}
        <section id="contact" aria-labelledby="contact-heading" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 sm:mb-4">
                {tDamacIsland('contact.title', 'Contact Us')}
              </p>
              <h2 id="contact-heading" className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900 leading-tight" style={{fontFamily:'Montserrat, sans-serif'}}>
                {tDamacIsland('contact.subtitle', 'Schedule a Visit')}
              </h2>
            </div>

            {/* Centered Form Container */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100 mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Error Messages only - Success will show in popup */}
                    {state.errors && Object.keys(state.errors).length > 0 && (
                      <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-800 text-center text-sm font-medium border border-red-200">
                        {tDamacIsland('contact.errorMessage', 'Please check your form and try again.')}
                      </div>
                    )}

                    {/* Name Fields Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          required
                          placeholder={tDamacIsland('contact.form.firstName', 'First Name')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200 placeholder-gray-500"
                          value={formData.firstName || ''}
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <ValidationError 
                          prefix="First Name" 
                          field="firstName"
                          errors={state.errors}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          required
                          placeholder={tDamacIsland('contact.form.lastName', 'Last Name')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200 placeholder-gray-500"
                          value={formData.lastName || ''}
                          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        />
                        <ValidationError 
                          prefix="Last Name" 
                          field="lastName"
                          errors={state.errors}
                        />
                      </div>
                    </div>

                    {/* Phone Number with Country Code Dropdown */}
                    <div>
                      <div className="flex">
                        {/* Country Code Dropdown */}
                        <div className="relative country-dropdown">
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="flex items-center justify-center px-3 py-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 min-w-[100px] hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          > 
                            <span className="mr-1 text-sm">{selectedCountry.flag}</span>
                            <span className="text-gray-700 text-sm mr-1">{selectedCountry.code}</span>
                            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-64 overflow-hidden">
                              {/* Search Input */}
                              <div className="p-3 border-b border-gray-200">
                                <input
                                  type="text"
                                  placeholder={tDamacIsland('contact.form.searchCountries', 'Search countries...')}
                                  value={countrySearchTerm}
                                  onChange={(e) => setCountrySearchTerm(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-black placeholder-gray-500"
                                />
                              </div>
                              
                              {/* Country List */}
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCountries.map((country, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setShowCountryDropdown(false);
                                      setCountrySearchTerm('');
                                    }}
                                    className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors duration-200 text-left"
                                  >
                                    <span className="mr-2 text-sm">{country.flag}</span>
                                    <span className="text-gray-700 text-sm mr-2 font-mono min-w-[50px]">{country.code}</span>
                                    <span className="text-gray-900 text-sm flex-1 truncate">{country.country}</span>
                                  </button>
                                ))}
                                {filteredCountries.length === 0 && (
                                  <div className="px-3 py-4 text-gray-500 text-sm text-center">
                                    No countries found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Phone Input */}
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder={tDamacIsland('contact.form.phone', 'Enter phone number')}
                          className="flex-1 ps-3 py-3 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-gray-50"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      {/* Hidden input for country code */}
                      <input type="hidden" name="countryCode" value={selectedCountry.code} />
                      <input type="hidden" name="countryName" value={selectedCountry.country} />

                      <ValidationError 
                        prefix="Phone" 
                        field="phone"
                        errors={state.errors}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Your Email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200 placeholder-gray-500"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                      <ValidationError 
                        prefix="Email" 
                        field="email"
                        errors={state.errors}
                      />
                    </div>

                    {/* Date and Time Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="date"
                          name="visitDate"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200"
                          value={formData.visitDate || '2025-01-10'}
                          onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="time"
                          name="visitTime"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200"
                          value={formData.visitTime || '08:23'}
                          onChange={e => setFormData({ ...formData, visitTime: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Choose time for call, Choose date for call"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 bg-gray-50 resize-none text-base transition-all duration-200 placeholder-gray-500"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    {/* Hidden field to identify this as the schedule visit form */}
                    <input type="hidden" name="formType" value="Schedule a Visit" />

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={state.submitting}
                        className="w-full text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#000000' }}
                      >
                        {state.submitting ? 'SENDING...' : 'SEND MESSAGE'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white text-black py-8 sm:py-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              
              {/* Company Info */}
              <div className="lg:col-span-2">
                <h4 className="text-black text-lg sm:text-xl lg:text-2xl font-normal tracking-wide mb-3 sm:mb-4">{tDamacIsland('footer.companyName', 'Rino Properties')}</h4>
                <p className="text-gray-600 mb-4 sm:mb-6 font-light leading-relaxed text-sm sm:text-base">
                  {tDamacIsland('footer.description', 'Rino Properties is a part of RINO Invest Group that has been shaping the luxury real estate market since 2024, delivering iconic residential, commercial and leisure properties across the GCC and Europe.')}
                </p>
                
                {/* Social Media */}
                <div className="flex space-x-2 sm:space-x-3">
                  <a href="https://www.facebook.com/p/Rino-Properties-61568133758317/" target='_blank' className="w-9 h-9 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 group" aria-label="Facebook">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/rinoinvest_properties?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target='_blank' className="w-9 h-9 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 group" aria-label="Instagram">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://ae.linkedin.com/company/rino-invest-properties" target='_blank' className="w-9 h-9 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 group" aria-label="LinkedIn">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                   <a href="https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc" target='_blank' className="w-9 h-9 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 group" aria-label="TikTok">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h5 className="text-sm sm:text-base font-medium text-black mb-3 sm:mb-4">{tDamacIsland('footer.quickLinks', 'Quick Links')}</h5>
                <ul className="space-y-1 sm:space-y-2">
                  <li><a href="#overview" className="text-gray-600 hover:text-black transition-colors text-xs sm:text-sm">{tDamacIsland('footer.overview', 'Overview')}</a></li>
                  <li><a href="#gallery" className="text-gray-600 hover:text-black transition-colors text-xs sm:text-sm">{tDamacIsland('footer.gallery', 'Gallery')}</a></li>
                  <li><a href="#floorplans" className="text-gray-600 hover:text-black transition-colors text-xs sm:text-sm">{tDamacIsland('footer.floorplans', 'Floorplans')}</a></li>
                  <li><a href="#location" className="text-gray-600 hover:text-black transition-colors text-xs sm:text-sm">{tDamacIsland('footer.location', 'Location')}</a></li>
                  <li><a href="#contact" className="text-gray-600 hover:text-black transition-colors text-xs sm:text-sm">{tDamacIsland('footer.contact', 'Contact')}</a></li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div>
                <h5 className="text-sm sm:text-base font-medium text-black mb-3 sm:mb-4">Contact</h5>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p className="text-gray-600">assem@rinoproperties.com</p>
                  <p className="text-gray-600">+971 54 764 7485</p>
                  <p className="text-gray-600">Rino Invest Group, Business Village Building – B, Office 330, Deira, Dubai, UAE</p>
                </div>
                
                {/* Rino Properties CTA */}
                <div className="mt-4 sm:mt-6">
                  <a 
                    href="https://rinoproperties.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-black hover:bg-gray-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-1 sm:mr-2">Visit Rino Properties</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
        {/* Footer bottom links */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mt-6 sm:mt-8 justify-center border-t border-gray-200 pt-6 sm:pt-8">
          <a href="https://rinoproperties.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">{tDamacIsland('footer.privacyPolicy', 'Privacy Policy')}</a>
          <a href="https://rinoproperties.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">{tDamacIsland('footer.termsOfUse', 'Terms of Use')}</a>
        </div>  
      </div>
    </footer>

        </main>
        {/* End Main Content */}

        {/* Gallery Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-3 sm:p-4"
            onClick={closeModal}
          >
            {/* Modal Content */}
            <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute -top-8 sm:-top-10 md:-top-12 right-0 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Image */}
              <div className="relative bg-black rounded-lg sm: md: overflow-hidden shadow-2xl">
                  <img
                    src={galleryImages[currentImageIndex].src}
                    alt={galleryImages[currentImageIndex].alt}
                    className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] object-contain"
                    loading="eager"
                    width="1200"
                    height="800"
                    decoding="async"
                    fetchPriority="high"
                  />
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-4 md:left-6 lg:left-8 xl:left-12 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group touch-manipulation"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group touch-manipulation"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex justify-center mt-3 sm:mt-4 md:mt-6 space-x-1 sm:space-x-2 max-w-full overflow-x-auto pb-2 px-2 sm:px-4 md:px-0">
                <div className="flex space-x-1 sm:space-x-2 min-w-max">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 transition-all duration-300 rounded-lg overflow-hidden border-2 ${
                        isMobile 
                          ? 'w-8 h-8' 
                          : isTablet 
                            ? 'w-12 h-12' 
                            : 'w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20'
                      } ${
                        index === currentImageIndex 
                          ? 'border-[#EDDDC5] shadow-lg shadow-[#EDDDC5]/30 scale-110' 
                          : 'border-transparent hover:border-white/50 hover:scale-105'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300"
                        loading="lazy"
                        width="100"
                        height="100"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floorplan Fullscreen Modal */}
        {isFloorplanModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-3 sm:p-4"
            onClick={closeFloorplanModal}
          >
            {/* Modal Content */}
            <div className="relative max-w-7xl max-h-[95vh] w-full" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={closeFloorplanModal}
                className="absolute -top-8 sm:-top-10 md:-top-12 right-0 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 group"
                aria-label="Close fullscreen"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Floor Plan Image */}
              <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={currentFloorplanImage}
                  alt="Floor Plan - Fullscreen View"
                  className="w-full h-auto max-h-[90vh] object-contain"
                  loading="eager"
                  width="1200"
                  height="800"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>
        )}

        {/* Schedule Visit Popup Modal */}
        {showSchedulePopup && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
            onClick={closeSchedulePopup}
          >
            <div 
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeSchedulePopup}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 group"
                aria-label="Close popup"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B8883A] to-[#A07632] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {tDamacIsland('popup.title', 'Schedule Your Visit')}
                </h3>
                <p className="text-gray-600 text-center mb-6 text-sm">
                  {tDamacIsland('popup.subtitle', 'Book a personalized tour of Damac Island and discover your dream home in Dubai.')}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-[#B8883A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{tDamacIsland('popup.benefit1', 'Exclusive property walkthrough')}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-[#B8883A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{tDamacIsland('popup.benefit2', 'Meet our expert property consultants')}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-[#B8883A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{tDamacIsland('popup.benefit3', 'Flexible payment plans & special offers')}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={scrollToContact}
                    className="w-full text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    style={{ backgroundColor: '#B8883A' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A07632'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B8883A'}
                  >
                    {tDamacIsland('popup.scheduleNow', 'Schedule Now')}
                  </button>
                  <button
                    onClick={closeSchedulePopup}
                    className="w-full text-gray-600 font-medium py-3.5 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    {tDamacIsland('popup.maybeLater', 'Maybe Later')}
                  </button>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    {tDamacIsland('popup.trustBadge', '🔒 Your information is secure and confidential')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form Popup Modal */}
        {showContactPopup && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
            onClick={closeContactPopup}
          >
            <div 
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeContactPopup}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 group"
                aria-label="Close popup"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Icon & Title */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#B8F27D] to-[#A5E06B] rounded-full flex items-center justify-center">
                      {popupFormType === 'bookTour' ? (
                        <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {popupFormType === 'bookTour' 
                      ? tDamacIsland('popupForm.bookTourTitle', 'Book a Tour')
                      : tDamacIsland('popupForm.getDetailsTitle', 'Get Full Details')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {popupFormType === 'bookTour'
                      ? tDamacIsland('popupForm.bookTourSubtitle', 'Schedule a personalized visit to Damac Island')
                      : tDamacIsland('popupForm.getDetailsSubtitle', 'Receive floor plans, pricing & current offers')}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Success/Error Messages - Only show errors now, success will use separate popup */}
                  {state.errors && Object.keys(state.errors).length > 0 && (
                    <div className="p-4 rounded-lg bg-red-50 text-red-800 text-center text-sm font-medium border border-red-200">
                      {tDamacIsland('popupForm.errorMessage', 'Please check your form and try again.')}
                    </div>
                  )}

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        required
                        placeholder={tDamacIsland('popupForm.firstName', 'First Name')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8F27D] focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200 placeholder-gray-500"
                        value={formData.firstName || ''}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      <ValidationError prefix="First Name" field="firstName" errors={state.errors} />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        required
                        placeholder={tDamacIsland('popupForm.lastName', 'Last Name')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8F27D] focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200 placeholder-gray-500"
                        value={formData.lastName || ''}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      />
                      <ValidationError prefix="Last Name" field="lastName" errors={state.errors} />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={tDamacIsland('popupForm.email', 'Email Address')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8F27D] focus:border-transparent text-gray-900 bg-gray-50 text-base transition-all duration-200 placeholder-gray-500"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <div className="flex">
                      <div className="relative country-dropdown">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center justify-center px-3 py-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 min-w-[100px] hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#B8F27D]"
                        > 
                          <span className="mr-1 text-sm">{selectedCountry.flag}</span>
                          <span className="text-gray-700 text-sm mr-1">{selectedCountry.code}</span>
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-64 overflow-hidden">
                            <div className="p-3 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder={tDamacIsland('popupForm.searchCountries', 'Search countries...')}
                                value={countrySearchTerm}
                                onChange={(e) => setCountrySearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B8F27D] focus:border-transparent text-sm text-black placeholder-gray-500"
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountries.map((country, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setShowCountryDropdown(false);
                                    setCountrySearchTerm('');
                                  }}
                                  className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors duration-200 text-left"
                                >
                                  <span className="mr-2 text-sm">{country.flag}</span>
                                  <span className="text-gray-700 text-sm mr-2 font-mono min-w-[50px]">{country.code}</span>
                                  <span className="text-gray-900 text-sm flex-1 truncate">{country.country}</span>
                                </button>
                              ))}
                              {filteredCountries.length === 0 && (
                                <div className="px-3 py-4 text-gray-500 text-sm text-center">
                                  {tDamacIsland('popupForm.noCountriesFound', 'No countries found')}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={tDamacIsland('popupForm.phone', 'Phone Number')}
                        className="flex-1 ps-3 py-3 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#B8F27D] focus:border-transparent text-gray-900 bg-gray-50"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <input type="hidden" name="countryCode" value={selectedCountry.code} />
                    <input type="hidden" name="countryName" value={selectedCountry.country} />
                    <ValidationError prefix="Phone" field="phone" errors={state.errors} />
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={tDamacIsland('popupForm.message', 'Any specific requirements or questions?')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8F27D] focus:border-transparent text-gray-900 bg-gray-50 resize-none text-base transition-all duration-200 placeholder-gray-500"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  {/* Hidden field for form type */}
                  <input type="hidden" name="formType" value={popupFormType === 'bookTour' ? 'Book a Tour' : 'Get Full Details'} />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full bg-[#B8F27D] hover:bg-[#A5E06B] text-gray-900 font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-base transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {tDamacIsland('popupForm.submitting', 'Submitting...')}
                      </>
                    ) : (
                      <>
                        {popupFormType === 'bookTour' 
                          ? tDamacIsland('popupForm.bookNow', 'Book Now')
                          : tDamacIsland('popupForm.sendDetails', 'Send Me Details')}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 {tDamacIsland('popupForm.privacyNote', 'Your information is secure and will never be shared with third parties.')}
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup Modal */}
        {showSuccessPopup && (
          <div 
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-8 sm:pt-12 md:pt-16 animate-fadeIn overflow-y-auto"
            onClick={() => setShowSuccessPopup(false)}
          >
            <div 
              className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slideDown"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 group"
                aria-label="Close popup"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Thank You Message */}
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {tDamacIsland('successPopup.title', 'Thank You!')}
                </h3>
                <p className="text-gray-600 mb-6 text-base">
                  {tDamacIsland('successPopup.message', 'Your request has been received successfully. Our team will contact you within 24 hours.')}
                </p>

                {/* Download Brochure Button */}
                <button
                  onClick={handleBrochureDownload}
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-[#B8883A] to-[#A07632] hover:from-[#A07632] hover:to-[#8B6428] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 mb-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {tDamacIsland('successPopup.downloadBrochure', 'Download Brochure')}
                </button>

                {/* Alternative actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    className="w-full text-gray-600 font-medium py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    {tDamacIsland('successPopup.close', 'Close')}
                  </button>
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    {tDamacIsland('successPopup.needHelp', 'Need immediate assistance?')}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="https://wa.me/971547647485" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86,0,01-1.51-5.26c.001-5.45,4.436-9.884,9.888-9.884,2.64,0,5.122,1.03,6.988,2.898a9.825,9.825,0,012.893,6.994c-.003,5.45-4.437,9.884-9.885,9.884m8.413-18.297A11.815,11.815,0,0012.05,0C5.495,0,.16,5.335.157,11.892c0,2.096.547,4.142,1.588,5.945L.057,24l6.305-1.654a11.882,11.882,0,005.683,1.448h.005c6.554,0,11.89-5.335,11.893-11.893A11.821,11.821,0,0020.885,3.488"/>
                      </svg>
                      {tDamacIsland('successPopup.whatsapp', 'WhatsApp')}
                    </a>
                    <a 
                      href="tel:+971547647485" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      {tDamacIsland('successPopup.call', 'Call Us')}
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

export default DamacIsland;
