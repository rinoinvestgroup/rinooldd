import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Layout from '../../components/Layout';
import { ContactApiService } from '../../services/contactApiService';
import { useLanguage } from '../../context/LanguageContext';
import { trackContact, trackButtonClick, trackPhoneClick, trackEmailClick, trackSocialClick } from '../../utils/metaPixel';
import { countries } from '../../data/countries';
import Image from 'next/image';
import type { GetStaticProps } from 'next';

// Simple client-only wrapper component
const ClientOnlyAnimations = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
};

// Lazy-loaded Google Maps iframe component
const LazyMap = ({ src, title }: { src: string; title: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-lg overflow-hidden shadow-lg border border-gray-200" style={{ minHeight: 300 }}>
      {isVisible ? (
        <iframe
          src={src}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
        />
      ) : (
        <div className="w-full h-[300px] bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading map...</span>
        </div>
      )}
    </div>
  );
};

interface ContactFormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    countryCode: '+971',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countries;
    const search = countrySearch.toLowerCase();
    return countries.filter(c => 
      c.country.toLowerCase().includes(search) || 
      c.code.includes(search)
    );
  }, [countrySearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = useCallback((code: string) => {
    setFormData(prev => ({ ...prev, countryCode: code }));
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);


  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.validation.nameRequired', 'Name is required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.validation.emailRequired', 'Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.validation.emailInvalid', 'Please enter a valid email address');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('contact.form.validation.phoneRequired', 'Phone number is required');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.form.validation.subjectRequired', 'Subject is required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.validation.messageRequired', 'Message is required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.form.validation.messageMinLength', 'Message must be at least 10 characters long');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize form data before submission
      const sanitizedData = ContactApiService.sanitizeFormData(formData);
      
      // Submit form using the API service
      const response = await ContactApiService.submitContactForm(sanitizedData);

      if (response.success) {
        // Track contact event with Meta Pixel
        trackContact({
          content_name: sanitizedData.subject || 'Contact Form Submission'
        });
        
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          countryCode: '+971',
          phone: '',
          subject: '',
          message: '',
        });
        
        // Clear any previous errors
        setErrors({});
        
      } else {
        throw new Error(response.message);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('contact.form.validation.submitError', 'Failed to send message. Please try again or contact us directly.');
      setErrors({
        submit: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  if (isSubmitted) {
    return (
      <Layout title={`${t('contact.thankYou', 'Thank You')} | ${t('nav.contact', 'Contact Rino Properties')}`} description={t('contact.thankYou', 'Thank you for contacting Rino Real Estate. We\'ll get back to you within 24 hours.')}>

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">{t('contact.messageSent', 'Message Sent!')}</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('contact.thankYou', 'Thank you for reaching out. We\'ll respond within 24 hours.')}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
              
                <a
                  href="/properties/dubai"
                  onClick={() => trackButtonClick('Explore Properties - Contact Success')}
                  className="bg-[#D69F3F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#C4903A] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/20 text-center inline-block"
                >
                  {t('contact.exploreProperties', 'Explore Our Properties')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={t('nav.contact', 'Contact Rino Properties | Dubai & Spain Real Estate Enquiry')}
      description={t('contact.subtitle', 'Contact Rino Properties for buying, selling or renting property in Dubai & Spain. Call +971-43-21-2433, email ask@rinoproperties.com, or visit our Dubai & M\u00e1laga offices.')}
      keywords="contact Rino Properties, real estate enquiry Dubai, property consultation Dubai, contact real estate agent Spain, schedule property viewing Dubai, Dubai property hotline, real estate office Dubai, Rino Properties phone number, free property consultation"
      url="https://rinoproperties.com/contact"
      structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ContactPage",
              "@id": "https://rinoproperties.com/contact#webpage",
              "url": "https://rinoproperties.com/contact",
              "name": "Contact Rino Properties - Real Estate Experts in Spain & Dubai",
              "description": "Contact Rino Properties for premium real estate services in Spain and Dubai. Expert team available to assist with buying, selling, and investing in luxury properties.",
              "inLanguage": "en",
              "isPartOf": {
                "@id": "https://rinoproperties.com/#website"
              },
              "breadcrumb": {
                "@id": "https://rinoproperties.com/contact#breadcrumb"
              },
              "potentialAction": {
                "@type": "CommunicateAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://rinoproperties.com/contact",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                  ]
                }
              }
            },
            {
              "@type": "RealEstateAgent",
              "@id": "https://rinoproperties.com/#organization",
              "name": "Rino Properties",
              "alternateName": "Rino Invest Asset S.L.",
              "url": "https://rinoproperties.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://rinoproperties.com/images/logo.jpeg",
                "width": 600,
                "height": 60
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+34-635-955-137",
                  "contactType": "customer service",
                  "areaServed": "ES",
                  "availableLanguage": ["English", "Spanish", "Arabic"],
                  "contactOption": "TollFree",
                  "email": "ask@rinoproperties.com"
                },
                {
                  "@type": "ContactPoint", 
                  "telephone": "+971-43-21-2433",
                  "contactType": "customer service",
                  "areaServed": "AE",
                  "availableLanguage": ["English", "Arabic"],
                  "contactOption": "TollFree",
                  "email": "ask@rinoproperties.com"
                }
              ],
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "C/ Ancha del Carmen, 2",
                  "addressLocality": "Málaga",
                  "postalCode": "29002",
                  "addressCountry": "ES",
                  "addressRegion": "Andalusia"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Business Village Building - B, Office 330",
                  "addressLocality": "Deira",
                  "addressRegion": "Dubai",
                  "addressCountry": "AE"
                }
              ],
              "geo": [
                {
                  "@type": "GeoCoordinates",
                  "latitude": "36.7153175",
                  "longitude": "-4.4281424"
                },
                {
                  "@type": "GeoCoordinates",
                  "latitude": "25.2571945",
                  "longitude": "55.3266669"
                }
              ],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "18:00",
                  "validFrom": "2024-01-01",
                  "validThrough": "2025-12-31"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/p/Rino-Properties-61568133758317/",
                "https://www.instagram.com/rinoinvest_properties/",
                "https://ae.linkedin.com/company/rino-invest-properties",
                "https://www.tiktok.com/@rino.properties"
              ],
              "email": "ask@rinoproperties.com",
              "priceRange": "$$$$",
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "Spain"
                },
                {
                  "@type": "Country",
                  "name": "United Arab Emirates"
                }
              ]
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://rinoproperties.com/contact#breadcrumb",
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
                  "name": "Contact",
                  "item": "https://rinoproperties.com/contact"
                }
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://rinoproperties.com/#website",
              "url": "https://rinoproperties.com",
              "name": "Rino Properties",
              "description": "Premium Real Estate in Spain and Dubai",
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
            }
          ]
        }}
      >

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop"
          alt="Luxury real estate contact"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={75}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-black/20"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8">
          
       
          
          {/* Main Heading */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('contact.title', 'Let\'s Find Your')} <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent"></span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base xs:text-lg sm:text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed">
            {t('contact.subtitle', 'Connect with our expert team for personalized assistance with premium properties in Spain and Dubai')}
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <ClientOnlyAnimations>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
            <div className="w-6 h-10 border border-white/50  mx-auto mb-2 flex justify-center">
              <div className="w-1 h-3 bg-white/70  mt-2 animate-bounce"></div>
            </div>
            <p className="text-xs text-white/70 uppercase tracking-wide">{t('contact.scroll', 'Scroll')}</p>
          </div>
        </ClientOnlyAnimations>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D69F3F] to-[#C4903A]"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gray-50"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/2 bg-gradient-to-tl from-[#D69F3F]/10 to-transparent"></div>
        
        {/* Decorative Elements */}
        {/* <div className="absolute top-20 right-20 w-64 h-64 bg-white/60  blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#D69F3F]/10  blur-3xl"></div> */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-2">
              {t('contact.readyToConnect', 'Ready to')} <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent font-light">{t('contact.readyToConnect', 'Connect?')}</span>
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              {t('contact.subtitle', 'Choose your preferred way to reach out to our expert team')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm  p-8  border border-gray-100/50">
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-light text-gray-900 mb-6">{t('contact.getInTouch', 'Get in Touch')}</h3>
                <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-8 leading-relaxed font-light">
                  {t('contact.description', 'Whether you\'re looking to buy, sell, or invest in properties in Spain or Dubai, our experienced team is here to guide you through every step of your real estate journey.')}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-[#D69F3F]/10 ">
                    <div className="text-xl xs:text-2xl font-medium text-[#D69F3F] mb-1">24h</div>
                    <div className="text-xs xs:text-sm text-gray-600 font-light">{t('contact.responseTime', 'Response Time')}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-100 ">
                    <div className="text-xl xs:text-2xl font-medium text-gray-700 mb-1">100%</div>
                    <div className="text-xs xs:text-sm text-gray-600 font-light">{t('contact.satisfaction', 'Satisfaction')}</div>
                  </div>
                </div>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm  shadow-lg hover: transition-all duration-300 border border-gray-100/50 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D69F3F] to-[#C4903A]  flex items-center justify-center flex-shrink-0 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg xs:text-xl font-medium text-gray-900 mb-2">{t('contact.info.officeLocations', 'Office Locations')}</h4>
                    <p className="text-sm xs:text-base text-gray-600 mb-1 font-light"> 🇪🇸  {t('contact.info.spainOffice', 'C/ Ancha del Carmen, 2 - 29002 Málaga.')} </p>
                    <p className="text-sm xs:text-base text-gray-600 font-light"> 🇦🇪  {t('contact.info.dubaiOffice', 'Business Village Building – B, Office 330, Deira, Dubai.')} </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm  shadow-lg hover: transition-all duration-300 border border-gray-100/50 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D69F3F] to-[#C4903A]  flex items-center justify-center flex-shrink-0 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg xs:text-xl font-medium text-gray-900 mb-2">{t('contact.info.phone', 'Phone')}</h4>
                    <a href="tel:+34600123456" className="text-sm xs:text-base text-gray-600 hover:text-[#D69F3F] transition-colors mb-1 block font-light" onClick={() => trackPhoneClick('+34600123456', 'Contact Page - Spain')}>
                      🇪🇸 {t('contact.spain', 'Spain')}: +34 635 955 137
                    </a>
                    <a href="tel:+97143212433" className="text-sm xs:text-base text-gray-600 hover:text-[#D69F3F] transition-colors block font-light" onClick={() => trackPhoneClick('+97143212433', 'Contact Page - Dubai')}>
                      🇦🇪 {t('contact.dubai', 'Dubai')}: +971 43 21 2433
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm  shadow-lg hover: transition-all duration-300 border border-gray-100/50 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D69F3F] to-[#C4903A]  flex items-center justify-center flex-shrink-0 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg xs:text-xl font-medium text-gray-900 mb-2">{t('contact.info.email', 'Email')}</h4>
                    <a href="mailto:ask@rinoproperties.com" className="text-sm xs:text-base text-gray-600 hover:text-[#D69F3F] transition-colors mb-1 block font-light" onClick={() => trackEmailClick('Contact Page')}>
                      📧  ask@rinoproperties.com
                    </a>
                   
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm  shadow-lg hover: transition-all duration-300 border border-gray-100/50 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D69F3F] to-[#C4903A]  flex items-center justify-center flex-shrink-0 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg xs:text-xl font-medium text-gray-900 mb-2">{t('contact.info.businessHours', 'Business Hours')}</h4>
                    <p className="text-sm xs:text-base text-gray-600 mb-1 font-light">🗓️ {t('contact.info.mondayFriday', 'Monday - Friday: 9:00 AM - 6:00 PM')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white/60 backdrop-blur-sm  shadow-lg hover: transition-all duration-300 border border-gray-100/50 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D69F3F] to-[#C4903A]  flex items-center justify-center flex-shrink-0 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 00-1-1H4a1 1 0 00-1 1v2M7 4H3m4 0v5M3 4v5m0 0v4a2 2 0 002 2h10a2 2 0 002-2V9M3 9h14M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg xs:text-xl font-medium text-gray-900 mb-4">{t('contact.info.followUs', 'Follow Us')}</h4>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { 
                          name: 'Facebook', 
                          url: 'https://www.facebook.com/p/Rino-Properties-61568133758317/',
                          icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                          color: 'text-blue-600 hover:bg-blue-600'
                        },
                        { 
                          name: 'Instagram', 
                          url: 'https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D',
                          icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                          color: 'text-pink-600 hover:bg-pink-600'
                        },
                        { 
                          name: 'LinkedIn', 
                          url: 'https://ae.linkedin.com/company/rino-invest-properties',
                          icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                          color: 'text-blue-600 hover:bg-blue-600'
                        },
                        { 
                          name: 'TikTok', 
                          url: 'https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc',
                          icon: 'M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.288-1.943-1.288-3.338C16.453.447 16.006 0 15.453 0h-3.306c-.553 0-1 .447-1 1s.447 1 1 1h2.306c.553 0 1 .447 1 1 0 .915.235 1.793.681 2.547.446.754 1.086 1.394 1.84 1.84.754.446 1.632.681 2.547.681.553 0 1-.447 1-1s-.447-1-1-1c-.915 0-1.793-.235-2.547-.681zm-6.668 6.896v8.396c0 2.206-1.794 4-4 4s-4-1.794-4-4 1.794-4 4-4c.553 0 1-.447 1-1s-.447-1-1-1c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6v-8.396l3.866 1.933c.494.247 1.095.047 1.342-.447.247-.494.047-1.095-.447-1.342l-5-2.5c-.318-.159-.697-.111-.97.122s-.424.601-.375.953z',
                          color: 'text-gray-800 hover:bg-gray-800'
                        }
                      ].map((social) => (
                        <a 
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackSocialClick(social.name)}
                          className={`w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center ${social.color} hover:text-white transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-lg`}
                          title={`Follow us on ${social.name}`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d={social.icon} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm   p-8 lg:p-10 border border-gray-100/50 relative">
            
              
              {/* Form Header */}
              <div className="text-center mb-8">
               
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-light text-gray-900 mb-2">{t('contact.sendMessageTitle', 'Send us a Message')}</h3>
                <p className="text-sm xs:text-base text-gray-600 font-light">{t('contact.sendMessageSubtitle', 'Fill out the form below and we\'ll get back to you within 24 hours')}</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-xs xs:text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.name', 'Name')} {t('contact.form.required', '*')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={t('contact.form.placeholders.name', 'Your name')}
                      />
                      {errors.name && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center font-light">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>}
                  </div>
                </div>

                {/* Contact Fields */}
              
                  <div className="group">
                    <label htmlFor="email" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-3">
                      {t('contact.form.email', 'Email Address')} {t('contact.form.required', '*')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-4 border rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={t('contact.form.placeholders.email', 'your.email@example.com')}
                      />
                      {errors.email && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.email && <p className="mt-2 text-sm text-red-600 flex items-center font-light">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>}
                  </div>
           
                  <div className="group">
                    <label htmlFor="phone" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-3">
                      {t('contact.form.phone', 'Phone Number')} {t('contact.form.required', '*')}
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className="relative flex-shrink-0" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className={`w-[120px] pl-3 pr-8 py-4 border rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm text-sm flex items-center justify-between ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          disabled={isSubmitting}
                        >
                          <span>{countries.find(c => c.code === formData.countryCode)?.flag} {formData.countryCode}</span>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isCountryDropdownOpen && (
                          <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden">
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Search country..."
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#D69F3F]"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-56 overflow-y-auto">
                              {filteredCountries.map((country) => (
                                <button
                                  key={`${country.code}-${country.country}`}
                                  type="button"
                                  onClick={() => handleCountrySelect(country.code)}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                                    formData.countryCode === country.code ? 'bg-[#D69F3F]/10 text-[#D69F3F]' : 'text-gray-700'
                                  }`}
                                >
                                  <span>{country.flag}</span>
                                  <span className="flex-1">{country.country}</span>
                                  <span className="text-gray-400">{country.code}</span>
                                </button>
                              ))}
                              {filteredCountries.length === 0 && (
                                <div className="px-3 py-4 text-sm text-gray-500 text-center">No countries found</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Phone Input */}
                      <div className="relative flex-grow">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData?.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-4 border rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm ${
                            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder={t('contact.form.placeholders.phone', '55 555 5555')}
                        />
                        {errors.phone && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.phone && <p className="mt-2 text-sm text-red-600 flex items-center font-light">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.phone}
                    </p>}
                  </div>

                {/* Subject */}
                <div className="group">
                  <label htmlFor="subject" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-3">
                    {t('contact.form.subject', 'Subject')} {t('contact.form.required', '*')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm ${
                        errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.placeholders.subject', 'What can we help you with?')}
                    />
                    {errors.subject && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.subject && <p className="mt-2 text-sm text-red-600 flex items-center font-light">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.subject}
                  </p>}
                </div>

                {/* Message */}
                <div className="group">
                  <label htmlFor="message" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-3">
                    {t('contact.form.message', 'Message')} {t('contact.form.required', '*')}
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 resize-none bg-white text-gray-900 shadow-sm ${
                        errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder={t('contact.form.placeholders.message', 'Tell us more about your property requirements...')}
                    ></textarea>
                    {errors.message && (
                      <div className="absolute right-3 top-4">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.message && <p className="mt-2 text-sm text-red-600 flex items-center font-light">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.message}
                  </p>}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  {errors.submit && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 ">
                      <p className="text-sm text-red-600 flex items-center font-light">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.submit}
                      </p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 xs:py-4 px-6 xs:px-8 font-medium text-white text-sm xs:text-base transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#D69F3F] hover: hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('contact.form.sending', 'Sending Your Message...')}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        
                        {t('contact.form.sendMessage', 'Send Message')}
                      </span>
                    )}
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              {t('contact.visitOffices', 'Visit Our')} <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent font-light">{t('contact.visitOffices', 'Offices')}</span>
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              {t('contact.visitOfficesSubtitle', 'Find us at our convenient locations in Spain and Dubai')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Spain Office */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D69F3F] to-[#C4903A] rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">🇪🇸</span>
                  </div>
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-medium text-gray-900">{t('contact.spainOfficeTitle', 'Spain Office')}</h3>
                    <p className="text-sm xs:text-base text-gray-600">{t('contact.spainOfficeSubtitle', 'Málaga Headquarters')}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-[#D69F3F] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>C/ Ancha del Carmen, 2 - 29002 Málaga.</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-[#D69F3F] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+34635955137" className="text-sm xs:text-base hover:text-[#D69F3F] transition-colors">+34 635 955 137</a>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-[#D69F3F] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm xs:text-base">{t('contact.mondayFridaySpain', 'Mon - Fri: 9:00 AM - 6:00 PM CET')}</span>
                  </div>
                </div>
              </div>

              {/* Spain Google Map */}
              <LazyMap
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.3015894184236!2d-4.43031842393146!3d36.715317472271515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f790ba82b623%3A0xe20d3d7aa47e5df6!2sC.%20Ancha%20del%20Carmen%2C%202%2C%20Distrito%20Centro%2C%2029002%20M%C3%A1laga%2C%20Spain!5e0!3m2!1sen!2sae!4v1757590405840!5m2!1sen!2sae"
                title="Rino Properties Spain Office - C/ Ancha del Carmen, 2, 29002 Málaga"
              />
            </div>

            {/* Dubai Office */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D69F3F] to-[#C4903A] rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">🇦🇪</span>
                  </div>
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-medium text-gray-900">{t('contact.dubaiOfficeTitle', 'Dubai Office')}</h3>
                    <p className="text-sm xs:text-base text-gray-600">{t('contact.dubaiOfficeSubtitle', 'UAE Headquarters')}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-[#D69F3F] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Business Village Building – B, Office 330, Deira, Dubai. </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-[#D69F3F] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+97143212433" className="text-sm xs:text-base hover:text-[#D69F3F] transition-colors">+971 43 21 2433</a>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-[#D69F3F] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm xs:text-base">{t('contact.sundayThursdayDubai', 'Sun - Thu: 9:00 AM - 6:00 PM GST')}</span>
                  </div>
                </div>
              </div>

              {/* Dubai Google Map */}
              <LazyMap
                src="https://maps.google.com/maps?q=Business+Village+Building+B,+Deira,+Dubai&t=&z=16&ie=UTF8&iwloc=&output=embed"
                title="Rino Properties Dubai Office - Business Village Building B, Office 330, Deira"
              />
            </div>
          </div>

        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default ContactPage;
