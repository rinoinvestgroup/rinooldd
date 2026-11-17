import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useLanguage } from '../../context/LanguageContext';
import {
  initializeGFSTracking,
  trackVirtualTour,
  trackGFSButtonClick,
  trackTimeOnPage
} from '../../utils/gfsAnalytics';

const DubaiMaritimeCityPage = () => {
  const { t, language, isRTL } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  // Initialize analytics tracking
  useEffect(() => {
    const cleanup = initializeGFSTracking();
    trackTimeOnPage();
    
    return cleanup;
  }, []);

  // Slider data with different content and background images
  const slides = [
    {
      id: 1,
      backgroundImage: '/images/bg_1.jpeg',
      badge: t('gfs.hero.slides.slide1.badge', 'Flexible 0.5% Payment Plan'),
      title: t('gfs.hero.slides.slide1.title', 'Own Your Home in the Heart of Dubai'),
      subtitle: t('gfs.hero.slides.slide1.subtitle', 'From Just AED 999/Month'),
      description: t('gfs.hero.slides.slide1.description', 'Flexible 0.5% payment plan • Only 5% down payment • Prime connectivity to Dubai Marina, Downtown & Al Maktoum Airport'),
      infoCards: [
        { icon: 'location', text: t('gfs.hero.slides.slide1.infoCards.location', 'Heart of Dubai') },
        { icon: 'building', text: t('gfs.hero.slides.slide1.infoCards.propertyTypes', 'Studios, 1 & 2 BR') },
        { icon: 'calendar', text: t('gfs.hero.slides.slide1.infoCards.monthlyPayment', 'From AED 999/month') }
      ]
    },
    {
      id: 2,
      backgroundImage: '/images/bg_2.webp',
      badge: t('gfs.hero.slides.slide2.badge', 'GFS Developments'),
      title: t('gfs.hero.slides.slide2.title', 'Trusted Developer'),
      subtitle: t('gfs.hero.slides.slide2.subtitle', 'Premium Quality'),
      description: t('gfs.hero.slides.slide2.description', 'Developed by GFS Developments with proven track record. Quality construction, sustainable development, and community-focused living.'),
      infoCards: [
        { icon: 'location', text: t('gfs.hero.slides.slide2.infoCards.location', 'Prime Locations') },
        { icon: 'building', text: t('gfs.hero.slides.slide2.infoCards.quality', 'Quality Construction') },
        { icon: 'calendar', text: t('gfs.hero.slides.slide2.infoCards.track', 'Proven Track Record') }
      ]
    },
    {
      id: 3,
      backgroundImage: '/images/bg_3.jpg',
      badge: t('gfs.hero.slides.slide3.badge', 'Strategic Investment'),
      title: t('gfs.hero.slides.slide3.title', 'Modern Community'),
      subtitle: t('gfs.hero.slides.slide3.subtitle', 'Living Excellence'),
      description: t('gfs.hero.slides.slide3.description', 'Thoughtfully planned green spaces, infinity pool, business center, and social spaces. Perfect for modern urban living.'),
      infoCards: [
        { icon: 'location', text: t('gfs.hero.slides.slide3.infoCards.area', 'High-Growth Area') },
        { icon: 'building', text: t('gfs.hero.slides.slide3.infoCards.amenities', 'Premium Amenities') },
        { icon: 'calendar', text: t('gfs.hero.slides.slide3.infoCards.investment', 'Investment Potential') }
      ]
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'location':
        return (
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        );
      case 'building':
        return (
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
        );
      case 'calendar':
        return (
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
      <title>
        {t('gfs.head.title', 'Dubai Home from AED 999/month | GFS 0.5% Payment Plan | Rino Properties')}
      </title>

      <meta 
        name="description" 
        content={t(
          'gfs.head.description', 
          'Own a Dubai home from AED 999/month with GFS 0.5% flexible payment plan. Only 5% down payment. Limited units available. Marketed by Rino Properties.'
        )} 
      />

      <meta 
        name="keywords" 
        content={t(
          'gfs.head.keywords',
          'GFS Developments Dubai, AED 999 per month Dubai, 0.5 percent payment plan, GFS Dubai homes, affordable property Dubai, 5% down payment Dubai, cheap apartment Dubai, Dubai monthly installment, GFS real estate, flexible payment Dubai property'
        )} 
      />

      {/* Open Graph */}
      <meta 
        property="og:title" 
        content={t('gfs.head.title', 'Dubai Home from AED 999/month | GFS 0.5% Payment Plan')} 
      />

      <meta 
        property="og:description" 
        content={t(
          'gfs.head.description', 
          'Own a Dubai home from AED 999/month with GFS 0.5% flexible payment plan. Only 5% down payment. Limited units available. Marketed by Rino Properties.'
        )} 
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://rinoproperties.com/gfs-development" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://rinoproperties.com/gfs-development" />
    </Head>

      <Layout 
        title={t('gfs.head.title', 'Dubai Home from AED 999/month | GFS 0.5% Payment Plan | Rino Properties')}
        description="Own a Dubai home from AED 999/month with GFS 0.5% flexible payment plan. Only 5% down payment. Limited units available. Marketed by Rino Properties."
        keywords="GFS Developments Dubai, AED 999 per month, 0.5 percent payment plan, affordable property Dubai"
      >
        {/* Hero Slider Section */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Slider Container */}
          <div className="relative w-full min-h-screen">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('${slide.backgroundImage}')`,
                    backgroundPosition: 'center center',
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                      {/* Badge */}
                      <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-2 animate-fade-in-up">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{slide.badge}</span>
                      </div>

                      {/* Main Title */}
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up delay-200">
                         <span className="text-white block text-2xl lg:text-4xl">{slide.title}</span>
                         <div className="inline-flex items-center bg-red-700 mt-4 backdrop-blur-sm rounded-xl px-4 py-2 animate-fade-in-up">
                            <span className="text-2xl lg:text-6xl font-extrabold uppercase text-white-600 ">{slide.subtitle}</span>
                         </div>
                      </h1>

                      {/* Description */}
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-300">
                        {slide.description}
                      </p>

                      {/* Info Cards */}
                      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 animate-fade-in-up delay-400">
                        {slide.infoCards.map((card, cardIndex) => (
                          <div key={cardIndex} className="flex items-center border bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 min-w-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-white-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              {renderIcon(card.icon)}
                            </svg>
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{card.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
                        <button
                          onClick={() => {
                            setShowVirtualTour(true);
                            trackVirtualTour('open');
                            trackGFSButtonClick('Virtual Tour', 'cta', 'hero_section');
                          }}
                          className="w-full !rounded-xl sm:w-auto inline-flex items-center justify-center bg-red-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200 shadow-lg"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M15 10a1 1 0 01-1 1H9a1 1 0 110-2h5a1 1 0 011 1z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" />
                          </svg>
                          {t('gfs.hero.buttons.virtualTour', 'Virtual Tour')}
                        </button>
                        
                        <button 
                          onClick={() => {
                            setShowRegistrationPopup(true);
                            trackGFSButtonClick('Book Now', 'cta', 'hero_section');
                          }}
                          className="w-full sm:w-auto inline-flex items-center !rounded-xl justify-center bg-red-600 hover:bg-[#B8892F] text-white  border border-white/30 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {t('gfs.hero.buttons.bookNow', 'Book Now')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label={t('gfs.ui.previousSlide', 'Previous slide')}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label={t('gfs.ui.nextSlide', 'Next slide')}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

 

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">{t('gfs.ui.discoverMore', 'Discover More')}</p>
              <div className="animate-bounce">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Custom CSS for animations */}
          <style jsx>{`
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out forwards;
            }
            
            .delay-200 {
              animation-delay: 0.2s;
              opacity: 0;
            }
            
            .delay-300 {
              animation-delay: 0.3s;
              opacity: 0;
            }
            
            .delay-400 {
              animation-delay: 0.4s;
              opacity: 0;
            }
            
            .delay-500 {
              animation-delay: 0.5s;
              opacity: 0;
            }
          `}</style>
        </section>


        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('gfs.contact.title', 'Ready to Own Your Dubai Home?')}</h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('gfs.contact.description', 'Contact our expert team to learn more about our flexible 0.5% payment plan and secure your property with just AED 25,000.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => {
                  setShowVirtualTour(true);
                  trackVirtualTour('open');
                  trackGFSButtonClick('Book a Virtual Tour', 'cta', 'contact_section');
                }}
                className="inline-flex items-center bg-[#D69F3F] hover:bg-[#B8892F] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M15 10a1 1 0 01-1 1H9a1 1 0 110-2h5a1 1 0 011 1z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" />
                </svg>
                {t('gfs.contact.buttons.virtualTour', 'Book a Virtual Tour')}
              </button>
              
              <button 
                onClick={() => {
                  setShowRegistrationPopup(true);
                  trackGFSButtonClick('Book Now', 'cta', 'contact_section');
                }}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                {t('gfs.contact.buttons.bookNow', 'Book Now')}
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">{t('gfs.contact.contactDetails.email.title', 'Email Us')}</h3>
                <p className="text-gray-600">{t('gfs.contact.contactDetails.email.value', 'khaled@rinoproperties.com')}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">{t('gfs.contact.contactDetails.phone.title', 'Call Us')}</h3>
                <p className="text-gray-600">{t('gfs.contact.contactDetails.phone.value', '+971 54 401 2269')}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">{t('gfs.contact.contactDetails.location.title', 'Visit Us')}</h3>
                <p className="text-gray-600">{t('gfs.contact.contactDetails.location.value', 'Dubai, UAE')}</p>
              </div>
            </div>
          </div>
        </section>
    {/* Projects Section */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{t('gfs.projects.title', 'PROJECTS')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Coventry Gardens 2 */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/bg_1.jpeg" 
                    alt={t('gfs.projects.coventryGardens2.alt', 'Coventry Gardens 2 - Modern luxury development')}
                    className="w-full !h-55 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('gfs.projects.coventryGardens2.title', 'Coventry Gardens 2')}</h3>
                  <p className="text-[#D69F3F] font-semibold text-lg mb-4">
                    {t('gfs.projects.coventryGardens2.price', 'STARTING FROM 622,000 AED *')}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {t('gfs.projects.coventryGardens2.location', 'Dubai Land Residence Complex')}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                      </svg>
                      {t('gfs.projects.coventryGardens2.propertyTypes', 'Studios, 1 & 2 BR Apartments')}
                    </div>
                  </div>
                
                </div>
              </div>

              {/* Coventry Gardens */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/bg_2.webp" 
                    alt={t('gfs.projects.coventryGardens.alt', 'Coventry Gardens - Premium residential complex')}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('gfs.projects.coventryGardens.title', 'Coventry Gardens')}</h3>
                  <p className="text-[#D69F3F] font-semibold text-lg mb-4">
                    {t('gfs.projects.coventryGardens.price', 'STARTING FROM 576,000 AED *')}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {t('gfs.projects.coventryGardens.location', 'Dubai Land Residence Complex')}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                      </svg>
                      {t('gfs.projects.coventryGardens.propertyTypes', 'Studios, 1 & 2 BR Apartments')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coventry 66 */}
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/bg_3.jpg" 
                    alt={t('gfs.projects.coventry66.alt', 'Coventry 66 - Contemporary living spaces')}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('gfs.projects.coventry66.title', 'Coventry 66')}</h3>
                  <p className="text-[#D69F3F] font-semibold text-lg mb-4">
                    {t('gfs.projects.coventry66.price', 'STARTING FROM 525,000 AED *')}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {t('gfs.projects.coventry66.location', 'Dubai Land Residence Complex')}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                      </svg>
                      {t('gfs.projects.coventry66.propertyTypes', 'Studios, 1 & 2 BR Apartments')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <div className="bg-red-600  rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">{t('gfs.projects.cta.title', 'Interested in Our Projects?')}</h3>
                <p className="text-lg mb-6 opacity-90">
                  {t('gfs.projects.cta.description', 'Discover more about our premium developments and flexible payment plans')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setShowRegistrationPopup(true);
                      trackGFSButtonClick('Get More Information', 'info', 'projects_section');
                    }}
                    className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                  >
                    {t('gfs.projects.cta.getInfo', 'Get More Information')}
                  </button>
                  <button
                    onClick={() => {
                      setShowVirtualTour(true);
                      trackVirtualTour('open');
                      trackGFSButtonClick('Virtual Tours', 'cta', 'projects_section');
                    }}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#D69F3F] transition-colors duration-200"
                  >
                    {t('gfs.projects.cta.virtualTours', 'Virtual Tours')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Key Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('gfs.benefits.title', 'Why Choose This Offer')}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('gfs.benefits.description', 'Experience premium Dubai living with unprecedented accessibility and flexibility')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Flexible Payment Plan */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.benefits.flexiblePayment.title', 'Flexible Payment Plan')}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="font-semibold">{t('gfs.benefits.flexiblePayment.bookingAmount', 'Pay AED 25,000 and book now')}</p>
                    <p>{t('gfs.benefits.flexiblePayment.monthlyInstallment', 'Installments from just AED 999/month')}</p>
                    <p>{t('gfs.benefits.flexiblePayment.downPayment', 'Only 5% down payment')}</p>
                  </div>
                </div>
              </div>

              {/* Strategic Location */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.benefits.strategicLocation.title', 'Strategic Location')}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>{t('gfs.benefits.strategicLocation.heartOfDubai', 'In the heart of Dubai')}</p>
                    <p>{t('gfs.benefits.strategicLocation.metroStation', 'Close to Metro Station')}</p>
                    <p>{t('gfs.benefits.strategicLocation.dubaiMarina', '15 min to Dubai Marina')}</p>
                    <p>{t('gfs.benefits.strategicLocation.mallOfEmirates', '20 min to Mall of Emirates')}</p>
                  </div>
                </div>
              </div>

              {/* Trusted Developer */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.benefits.trustedDeveloper.title', 'Trusted Developer')}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>{t('gfs.benefits.trustedDeveloper.developer', 'GFS Developments')}</p>
                    <p>{t('gfs.benefits.trustedDeveloper.track', 'Proven track record')}</p>
                    <p>{t('gfs.benefits.trustedDeveloper.projects', 'Premium projects like Coventry Gardens')}</p>
                    <p>{t('gfs.benefits.trustedDeveloper.development', 'Quality & sustainable development')}</p>
                  </div>
                </div>
              </div>

              {/* Modern Living */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.benefits.modernLiving.title', 'Modern Community Living')}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>{t('gfs.benefits.modernLiving.propertyTypes', 'Studios, 1 & 2-bedroom apartments')}</p>
                    <p>{t('gfs.benefits.modernLiving.amenities', 'Infinity pool & business center')}</p>
                    <p>{t('gfs.benefits.modernLiving.greenSpaces', 'Green spaces & landscaped gardens')}</p>
                    <p>{t('gfs.benefits.modernLiving.virtualTours', 'Virtual apartment tours available')}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Investment Potential & Accessibility Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Blue Header Section */}
            <div className="bg-red-600 rounded-2xl p-8 mb-12 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('gfs.investment.headerTitle', 'Investment Potential & Accessibility')}</h2>
                <button 
                  onClick={() => {
                    setShowRegistrationPopup(true);
                    trackGFSButtonClick('Learn More', 'info', 'investment_section');
                  }}
                  className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {t('gfs.investment.learnMore', 'Learn More')}
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Text Content */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('gfs.investment.whyThisOffer', 'Why This Offer Makes Sense')}</h3>
                
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.investment.accessibility.title', '✓ Accessibility')}</h4>
                    <p>
                      {t('gfs.investment.accessibility.description', 'The 0.5% payment plan and AED 999/month make real estate more accessible for a broad range of buyers. No longer do you need massive upfront capital to own property in Dubai\'s prime locations.')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.investment.lowEntry.title', '✓ Low Entry Cost')}</h4>
                    <p>
                      {t('gfs.investment.lowEntry.description', 'With just 5% down payment, you don\'t need huge upfront capital to start. This revolutionary payment structure opens doors to property ownership that were previously out of reach.')}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.investment.primeLocation.title', '✓ Prime Location Benefits')}</h4>
                    <p>
                      {t('gfs.investment.primeLocation.description', 'Strategic connectivity to major Dubai landmarks and transport hubs enhances both living experience and investment value. Located in high-growth areas with strong long-term potential.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Features */}
              <div className="space-y-6">
                {/* Investment Highlights */}
                <div className="bg-gradient-to-br from-[#D69F3F] to-[#B8892F] rounded-2xl p-8 text-white">
                  <h4 className="text-2xl font-bold mb-6">{t('gfs.investment.highlights.title', 'Investment Highlights')}</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold">{t('gfs.investment.highlights.offPlan.title', 'Off-plan opportunities')}</p>
                        <p className="text-sm opacity-90">{t('gfs.investment.highlights.offPlan.description', 'Get in early with flexible payment plans')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold">{t('gfs.investment.highlights.highGrowth.title', 'High-growth location')}</p>
                        <p className="text-sm opacity-90">{t('gfs.investment.highlights.highGrowth.description', 'Dubai Land Residence Complex, Dubai South')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold">{t('gfs.investment.highlights.longTerm.title', 'Long-term appreciation')}</p>
                        <p className="text-sm opacity-90">{t('gfs.investment.highlights.longTerm.description', 'Strong rental yields and capital growth potential')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Location Benefits */}
                <div className="bg-white border-2 border-gray-100 rounded-lg p-6 shadow-lg">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">{t('gfs.investment.connectivity.title', 'Strategic Connectivity')}</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('gfs.investment.connectivity.airport.location', 'Near Al Maktoum Airport')}</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{t('gfs.investment.connectivity.airport.benefit', 'Great for travelers')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('gfs.investment.connectivity.marina.location', '15 min to Dubai Marina')}</span>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{t('gfs.investment.connectivity.marina.benefit', 'Waterfront lifestyle')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('gfs.investment.connectivity.downtown.location', '30 min to Downtown Dubai')}</span>
                      <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">{t('gfs.investment.connectivity.downtown.benefit', 'Burj Khalifa area')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

    

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('gfs.faq.title', 'Frequently Asked Questions')}</h2>
              <p className="text-xl text-gray-600">
                {t('gfs.faq.description', 'Get answers to the most common questions about our flexible payment plan')}
              </p>
            </div>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.faq.items.paymentPlan.question', 'What exactly is the 0.5% payment plan?')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('gfs.faq.items.paymentPlan.answer', 'It means you pay just 0.5% of the total apartment price each month, making the installments very manageable. For example, on a property worth AED 500,000, your monthly payment would be just AED 2,500.')}
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.faq.items.downPayment.question', 'Do I really only need 5% down payment?')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('gfs.faq.items.downPayment.answer', 'Yes — with our plan, you only pay 5% upfront to reserve your property, then continue with low monthly payments. This revolutionary approach makes Dubai property ownership accessible to more people.')}
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.faq.items.monthlyPayment.question', 'Is AED 999/month guaranteed?')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('gfs.faq.items.monthlyPayment.answer', 'Yes, AED 999/month is the starting point for our most affordable units. The exact monthly payment depends on the property size and total price, but we ensure all payments remain manageable through our 0.5% monthly plan.')}
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.faq.items.connectivity.question', 'How is the location so well-connected?')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('gfs.faq.items.connectivity.answer', 'Our development is strategically located in the heart of Dubai with close proximity to Metro stations, 15 minutes to Dubai Marina, 20 minutes to Mall of the Emirates, and 30 minutes to Downtown Dubai. Plus, it\'s near Al Maktoum Airport for excellent connectivity.')}
                </p>
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.faq.items.handover.question', 'When is handover?')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('gfs.faq.items.handover.answer', 'The estimated handover date is Q2 2027. We provide regular construction updates and maintain transparency throughout the development process to keep you informed of progress.')}
                </p>
              </div>

              {/* FAQ Item 6 */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t('gfs.faq.items.developer.question', 'Is GFS a trustworthy developer?')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('gfs.faq.items.developer.answer', 'Yes — GFS Developments has decades of experience, ISO certifications, and a reputation for quality and community-focused design. They have successfully delivered premium residential projects such as Coventry Gardens, demonstrating their commitment to excellence.')}
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* Virtual Tour Popup */}
        {showVirtualTour && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl h-[80vh] relative">
              {/* Header */}
              <div className="bg-[#D69F3F] text-white p-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('gfs.virtualTour.title', 'Virtual Property Tour')}</h2>
                <button 
                  onClick={() => setShowVirtualTour(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Virtual Tour Content */}
              <div className="h-full pb-16">
                <iframe
                  src="https://my.matterport.com/show/?m=8p18oEii5Tf&play=1&qs=1"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="xr-spatial-tracking"
                  className="rounded-b-2xl"
                  title={t('gfs.ui.iframeTitle', 'Virtual Property Tour')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Registration Popup */}
        {showRegistrationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full">
              {/* Header */}
              <div className="bg-[#D69F3F] text-white p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">{t('gfs.forms.registration.title', 'Reserve Your Home')}</h2>
                  <button 
                    onClick={() => setShowRegistrationPopup(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-4">
                <form 
                  action="https://formspree.io/f/mqaoakwv" 
                  method="POST"
                  className="space-y-3"
                >
                  {/* Hidden fields for tracking */}
                  <input type="hidden" name="project" value="GFS Development - Dubai Property" />
                  <input type="hidden" name="source" value="GFS Development Page" />
                  <input type="hidden" name="lead_type" value="Property Reservation" />
                  
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-sm"
                      placeholder={t('gfs.forms.registration.fields.fullName', 'Full Name *')}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-sm"
                      placeholder={t('gfs.forms.registration.fields.email', 'Email Address *')}
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-sm"
                      placeholder={t('gfs.forms.registration.fields.phone', 'Phone Number *')}
                    />
                  </div>

                  <div>
                    <select 
                      name="nationality"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-sm"
                    >
                      <option value="">{t('gfs.forms.registration.fields.nationality', 'Nationality (Optional)')}</option>
                      <option value="UAE">{t('gfs.forms.registration.nationalities.uae', 'UAE')}</option>
                      <option value="India">{t('gfs.forms.registration.nationalities.india', 'India')}</option>
                      <option value="UK">{t('gfs.forms.registration.nationalities.uk', 'United Kingdom')}</option>
                      <option value="ES">{t('gfs.forms.registration.nationalities.spain', 'Spain')}</option>
                      <option value="DE">{t('gfs.forms.registration.nationalities.germany', 'Germany')}</option>
                      <option value="USA">{t('gfs.forms.registration.nationalities.usa', 'United States')}</option>
                      <option value="other">{t('gfs.forms.registration.nationalities.other', 'Other')}</option>
                    </select>
                  </div>

                  <div className="flex items-start mt-3">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-0.5 mr-2"
                    />
                    <label className="text-xs text-gray-600">
                      {t('gfs.forms.registration.consent', 'I agree to be contacted by Rino Properties.')}
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#D69F3F] hover:bg-[#B8892F] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mt-4 text-sm"
                  >
                    {t('gfs.forms.registration.submit', 'Book Now - AED 25,000')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default DubaiMaritimeCityPage;