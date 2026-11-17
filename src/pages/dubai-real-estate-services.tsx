import React, { useState, useCallback, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ContactApiService } from '@/services';
import { ContactFormData } from '@/types/contact';
import { useLanguage } from '@/context/LanguageContext';
import {
  trackPageView,
  trackLead,
  trackContact,
  trackViewContent,
  trackButtonClick,
  trackPhoneClick,
  trackEmailClick,
} from '@/utils/metaPixel';
import {
  Building2,
  TrendingUp,
  Shield,
  Users,
  CheckCircle,
  Home,
  DollarSign,
  Key,
  Phone,
  Mail,
  Send,
  Star,
  ArrowRight,
  ChevronDown,
  Search,
} from 'lucide-react';

const HERO_IMAGES = [
  '/images/property1.jpeg',
  '/images/property2.jpeg',
  '/images/property3.jpeg',
  '/images/property4.jpeg',
  '/images/property5.jpeg',
];

const COUNTRY_CODES = [
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+92', label: '🇵🇰 +92' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+86', label: '🇨🇳 +86' },
  { code: '+966', label: '🇸🇦 +966' },
  { code: '+974', label: '🇶🇦 +974' },
  { code: '+965', label: '🇰🇼 +965' },
  { code: '+973', label: '🇧🇭 +973' },
  { code: '+968', label: '🇴🇲 +968' },
  { code: '+20', label: '🇪🇬 +20' },
  { code: '+90', label: '🇹🇷 +90' },
  { code: '+34', label: '🇪🇸 +34' },
  { code: '+39', label: '🇮🇹 +39' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+81', label: '🇯🇵 +81' },
  { code: '+82', label: '🇰🇷 +82' },
];

const DubaiRealEstateServicesPage = () => {
  const { language, isRTL } = useLanguage();
  const [translations, setTranslations] = useState<any>({});

  // Load page-specific translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        let response = await fetch(`/locales/${language}/dubai-real-estate-services.json`);
        if (!response.ok) {
          response = await fetch(`/locales/${language}/dubai-property-services.json`);
        }
        if (!response.ok) return;
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        // fallback silently
      }
    };
    loadTranslations();
  }, [language]);

  // Translation helper
  const tp = (key: string, fallback: string = '') => {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+971',
    phone: '',
    subject: 'Dubai Property Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const [subInterest, setSubInterest] = useState('');
  const [subInterestDropdownOpen, setSubInterestDropdownOpen] = useState(false);
  const subInterestDropdownRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance hero slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track page view and view content on mount
  useEffect(() => {
    trackPageView();
    trackViewContent({
      content_name: 'Dubai Property Services',
      content_category: 'Real Estate Services',
      content_ids: ['dubai-real-estate-services'],
    });
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
        setCountrySearch('');
      }
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(e.target as Node)) {
        setSubjectDropdownOpen(false);
      }
      if (subInterestDropdownRef.current && !subInterestDropdownRef.current.contains(e.target as Node)) {
        setSubInterestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountryCodes = COUNTRY_CODES.filter(
    (c) =>
      c.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const submitData = {
        ...formData,
        subject: subInterest ? `${formData.subject} - ${subInterest}` : formData.subject,
      };
      const sanitizedData = ContactApiService.sanitizeFormData(submitData as ContactFormData);
      const response = await ContactApiService.submitContactForm(sanitizedData);

      if (response.success) {
        // Track Meta Pixel events on successful submission
        trackLead({
          content_name: 'Dubai Property Services Inquiry',
          content_category: formData.subject,
        });
        trackContact({ content_name: 'Dubai Property Services Form' });

        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          countryCode: '+971',
          phone: '',
          subject: 'Dubai Property Inquiry',
          message: '',
        });
        setSubInterest('');
      } else {
        setSubmitStatus('error');
        setErrorMessage(response.message);
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage(tp('form.errorMessage', 'Something went wrong. Please try again later.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const SUB_OPTIONS: Record<string, { value: string; label: string }[]> = {
    'Buying Property in Dubai': [
      { value: 'Apartment', label: tp('form.sub.apartment', 'Apartment') },
      { value: 'Villa', label: tp('form.sub.villa', 'Villa') },
      { value: 'Townhouse', label: tp('form.sub.townhouse', 'Townhouse') },
      { value: 'Penthouse', label: tp('form.sub.penthouse', 'Penthouse') },
      { value: 'Off-Plan', label: tp('form.sub.offPlan', 'Off-Plan') },
      { value: 'Commercial', label: tp('form.sub.commercial', 'Commercial') },
    ],
    'Selling Property in Dubai': [
      { value: 'Apartment', label: tp('form.sub.apartment', 'Apartment') },
      { value: 'Villa', label: tp('form.sub.villa', 'Villa') },
      { value: 'Townhouse', label: tp('form.sub.townhouse', 'Townhouse') },
      { value: 'Penthouse', label: tp('form.sub.penthouse', 'Penthouse') },
      { value: 'Land / Plot', label: tp('form.sub.landPlot', 'Land / Plot') },
      { value: 'Commercial', label: tp('form.sub.commercial', 'Commercial') },
    ],
    'Leasing Property in Dubai': [
      { value: 'Short-Term Rental', label: tp('form.sub.shortTerm', 'Short-Term Rental') },
      { value: 'Long-Term Rental', label: tp('form.sub.longTerm', 'Long-Term Rental') },
      { value: 'Holiday Home', label: tp('form.sub.holidayHome', 'Holiday Home') },
      { value: 'Commercial Lease', label: tp('form.sub.commercialLease', 'Commercial Lease') },
    ],
    'Investment Consultation': [
      { value: 'High ROI Properties', label: tp('form.sub.highROI', 'High ROI Properties') },
      { value: 'Off-Plan Investment', label: tp('form.sub.offPlanInvest', 'Off-Plan Investment') },
      { value: 'Portfolio Management', label: tp('form.sub.portfolio', 'Portfolio Management') },
      { value: 'Golden Visa Eligible', label: tp('form.sub.goldenVisa', 'Golden Visa Eligible') },
    ],
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Rino Invest Group',
    legalName: 'Rino Invest Group Real Estate LLC',
    description:
      'RERA-licensed Dubai real estate agency with 20+ years of experience. Expert property consultants for buying, selling, renting & investing in premium Dubai real estate. Specializing in Palm Jumeirah, Downtown Dubai, Dubai Marina, Business Bay & Dubai Hills.',
    url: 'https://rinoproperties.com/dubai-real-estate-services',
    logo: 'https://rinoproperties.com/images/logo_rino.png',
    telephone: '+971-4-321-2433',
    email: 'ask@rinoproperties.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.2048',
      longitude: '55.2708',
    },
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'Place', name: 'Palm Jumeirah' },
      { '@type': 'Place', name: 'Downtown Dubai' },
      { '@type': 'Place', name: 'Dubai Marina' },
      { '@type': 'Place', name: 'Business Bay' },
      { '@type': 'Place', name: 'Dubai Hills Estate' },
      { '@type': 'Place', name: 'Jumeirah Village Circle' },
      { '@type': 'Place', name: 'Dubai Creek Harbour' },
    ],
    knowsAbout: [
      'Dubai Real Estate',
      'Property Investment Dubai',
      'Buy Property in Dubai',
      'Sell Property in Dubai',
      'Dubai Rental Properties',
      'Off-Plan Properties Dubai',
      'Dubai Golden Visa Property',
      'Property Management Dubai',
      'Dubai Luxury Real Estate',
      'Commercial Real Estate Dubai',
      'Holiday Homes Dubai',
      'ROI Investment Dubai',
    ],
    sameAs: [
      'https://www.facebook.com/rinoproperties',
      'https://www.instagram.com/rinoproperties',
      'https://www.linkedin.com/company/rinoproperties',
    ],
    priceRange: '$$-$$$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
  };

  return (
    <Layout
      title={tp('meta.title', 'Dubai Real Estate Services | Buy, Sell, Rent & Invest in Property | Rino Invest Group')}
      description={tp('meta.description', 'Rino Invest Group — RERA-licensed Dubai real estate agency with 20+ years expertise. Buy apartments, villas & off-plan property. Sell with expert valuations. Rent luxury homes in Palm Jumeirah, Downtown Dubai, Dubai Marina & Business Bay. Free consultation. Golden Visa eligible properties. 50+ multilingual advisors.')}
      keywords={tp('meta.keywords', 'Dubai real estate, buy property Dubai, sell property Dubai, rent property Dubai, Dubai property for sale, apartments for sale in Dubai, villas for sale in Dubai, off-plan properties Dubai, Dubai Marina apartments, Palm Jumeirah villas, Downtown Dubai property, Business Bay real estate, Dubai Hills Estate, Jumeirah Village Circle, JVC apartments Dubai, Dubai Creek Harbour, property investment Dubai, Dubai real estate agent, RERA licensed broker Dubai, real estate consultant Dubai, property valuation Dubai, Dubai rental properties, luxury apartments Dubai, studio apartment Dubai, 1 bedroom apartment Dubai, 2 BHK Dubai, penthouse Dubai, townhouse Dubai, commercial property Dubai, Dubai property management, holiday homes Dubai, short term rental Dubai, Airbnb Dubai, Dubai Golden Visa property, high ROI property Dubai, best areas to invest Dubai, new projects Dubai, Emaar properties, DAMAC properties, Dubai real estate market 2025, property prices Dubai, freehold property Dubai, expatriate property Dubai, buy house Dubai foreigner, real estate agency Dubai, Rino Invest Group, Rino Properties Dubai')}
      url="https://rinoproperties.com/dubai-real-estate-services"
      structuredData={structuredData}
    >
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[auto] md:min-h-[70vh] lg:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0">
          {HERO_IMAGES?.map((src, idx) => (
            <div
              key={src}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url('${src}')`,
                opacity: idx === currentSlide ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
         
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 lg:pt-32 pb-10 sm:pb-14 md:pb-16 lg:pb-24 w-full" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-center">
            {/* Left Copy */}
            <div className="text-white space-y-4 sm:space-y-5 md:space-y-6">
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight font-heading">
                {tp('hero.welcomeTo', 'Welcome to')}{' '}
                <span className="text-[#D69F3F]">{tp('hero.companyName', 'Rino Invest Group')}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg">
                {tp('hero.description', 'Your Trusted Dubai Property Partner. We guide investors, homeowners, and tenants through every step of their real estate journey delivering')}{' '}
                <strong className="text-white">{tp('hero.lucrativeInvestments', 'lucrative investments')}</strong>,{' '}
                <strong className="text-white">{tp('hero.dreamHomes', 'dream homes')}</strong>, and{' '}
                <strong className="text-white">{tp('hero.highReturnRentals', 'high-return rental portfolios')}</strong>.
              </p>

              <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
                {[
                  { label: tp('hero.propertiesSold', 'Properties Sold'), value: '200+' },
                  { label: tp('hero.happyClients', 'Happy Clients'), value: '100+' },
                  { label: tp('hero.yearsInDubai', 'Years in Dubai'), value: '20+' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#D69F3F]">
                      {stat.value}
                    </div>
                    <div className="text-[11px] sm:text-xs md:text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scrollToSection('services')}
                className="hidden md:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D69F3F] transition-colors mt-4"
              >
                {tp('hero.exploreServices', 'Explore Our Services')} <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>

            {/* Right Contact Form */}
            <div className="bg-white/[.07] backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-8 shadow-2xl">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-heading">
                  {tp('form.title', 'Get a Free Consultation')}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {tp('form.subtitle', "Tell us about your property goals and we'll get back to you within 24 hours.")}
                </p>
              </div>

              {submitStatus === 'success' ? (
                <div className="text-center py-6 sm:py-8 md:py-10 space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{tp('form.successTitle', 'Thank You!')}</h3>
                  <p className="text-gray-400">
                    {tp('form.successMessage', 'Your inquiry has been received. Our team will contact you within 24 hours.')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      {tp('form.fullName', 'Full Name')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      style={{ color: '#ffffff' }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base placeholder-white focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/60 focus:border-[#D69F3F] transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      {tp('form.email', 'Email Address')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@gmail.com"
                      style={{ color: '#ffffff' }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base placeholder-white focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/60 focus:border-[#D69F3F] transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      {tp('form.phone', 'Phone Number')} <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      {/* Country Code Searchable Dropdown */}
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setCountryDropdownOpen(!countryDropdownOpen);
                            setCountrySearch('');
                          }}
                          className="w-[5.5rem] sm:w-28 flex items-center justify-between px-1.5 sm:px-2 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/60 focus:border-[#D69F3F] transition"
                          style={{ color: '#ffffff' }}
                        >
                          <span>{COUNTRY_CODES.find((c) => c.code === formData.countryCode)?.label || formData.countryCode}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {countryDropdownOpen && (
                          <div className="absolute z-50 top-full left-0 mt-1 w-48 sm:w-52 bg-gray-800 border border-white/20 rounded-lg shadow-xl overflow-hidden">
                            {/* Search */}
                            <div className="flex items-center  gap-2 px-3 py-2 border-b border-white/10">
                              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder={tp('form.searchCountry', 'Search country...')}
                                className="w-full bg-transparent  text-sm text-white placeholder-gray-400 focus:outline-none"
                                autoFocus
                              />
                            </div>
                            {/* Options */}
                            <ul className="max-h-48 overflow-y-auto">
                              {filteredCountryCodes.length > 0 ? (
                                filteredCountryCodes.map((c) => (
                                  <li key={c.code}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, countryCode: c.code }));
                                        setCountryDropdownOpen(false);
                                        setCountrySearch('');
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${
                                        formData.countryCode === c.code ? 'bg-[#D69F3F]/20 text-[#D69F3F]' : 'text-white'
                                      }`}
                                    >
                                      {c.label}
                                    </button>
                                  </li>
                                ))
                              ) : (
                                <li className="px-3 py-2 text-sm text-gray-400">{tp('form.noResults', 'No results')}</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="50 123 4567"
                        style={{ color: '#ffffff' }}
                        className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base placeholder-white focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/60 focus:border-[#D69F3F] transition"
                      />
                    </div>
                  </div>

                  {/* Interest */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {tp('form.interestedIn', "I'm Interested In")}
                    </label>
                    <div className="relative" ref={subjectDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/60 focus:border-[#D69F3F] transition"
                        style={{ color: '#ffffff' }}
                      >
                        <span>
                          {{
                            'Dubai Property Inquiry': tp('form.options.generalInquiry', 'General Inquiry'),
                            'Buying Property in Dubai': tp('form.options.buyingProperty', 'Buying Property'),
                            'Selling Property in Dubai': tp('form.options.sellingProperty', 'Selling Property'),
                            'Leasing Property in Dubai': tp('form.options.leasingRenting', 'Leasing / Renting'),
                            'Investment Consultation': tp('form.options.investmentConsultation', 'Investment Consultation'),
                          }[formData.subject] || formData.subject}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${subjectDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {subjectDropdownOpen && (
                        <div className="absolute z-50 top-full left-0 mt-1 w-full bg-gray-800 border border-white/20 rounded-lg shadow-xl overflow-hidden">
                          <ul>
                            {[
                              { value: 'Dubai Property Inquiry', label: tp('form.options.generalInquiry', 'General Inquiry') },
                              { value: 'Buying Property in Dubai', label: tp('form.options.buyingProperty', 'Buying Property') },
                              { value: 'Selling Property in Dubai', label: tp('form.options.sellingProperty', 'Selling Property') },
                              { value: 'Leasing Property in Dubai', label: tp('form.options.leasingRenting', 'Leasing / Renting') },
                              { value: 'Investment Consultation', label: tp('form.options.investmentConsultation', 'Investment Consultation') },
                            ].map((option) => (
                              <li key={option.value}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, subject: option.value }));
                                    setSubjectDropdownOpen(false);
                                    // Reset sub-interest and open sub-dropdown if sub-options exist
                                    if (SUB_OPTIONS[option.value]) {
                                      setSubInterest('');
                                      setSubInterestDropdownOpen(true);
                                    } else {
                                      setSubInterest('');
                                      setSubInterestDropdownOpen(false);
                                    }
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                                    formData.subject === option.value ? 'bg-[#D69F3F]/20 text-[#D69F3F]' : 'text-white'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sub-Interest / Property Type */}
                  {SUB_OPTIONS[formData.subject] && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {tp('form.propertyType', 'Property Type')}
                      </label>
                      <div className="relative" ref={subInterestDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setSubInterestDropdownOpen(!subInterestDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/60 focus:border-[#D69F3F] transition"
                          style={{ color: '#ffffff' }}
                        >
                          <span className={subInterest ? 'text-white' : 'text-gray-400'}>
                            {subInterest
                              ? SUB_OPTIONS[formData.subject]?.find((o) => o.value === subInterest)?.label || subInterest
                              : tp('form.selectType', 'Select an option…')}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${subInterestDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {subInterestDropdownOpen && (
                          <div className="absolute z-50 top-full left-0 mt-1 w-full bg-gray-800 border border-white/20 rounded-lg shadow-xl overflow-hidden">
                            <ul>
                              {SUB_OPTIONS[formData.subject]?.map((opt) => (
                                <li key={opt.value}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSubInterest(opt.value);
                                      setSubInterestDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                                      subInterest === opt.value ? 'bg-[#D69F3F]/20 text-[#D69F3F]' : 'text-white'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      {tp('form.message', 'Message')} <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={tp('form.messagePlaceholder', 'Tell us about your property goals...')}
                      style={{ color: '#ffffff' }}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base placeholder-white focus:outline-none focus:ring-2 focus:ring-[#D69F3F]/60 focus:border-[#D69F3F] transition resize-none"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center !rounded-md gap-2 py-2.5 sm:py-3 bg-[#D69F3F] hover:bg-[#c08f35] text-white text-sm sm:text-base font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {tp('form.sending', 'Sending…')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {tp('form.submit', 'Get Free Consultation')}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    {tp('form.consent', 'By submitting, you agree to be contacted by Rino Invest Group regarding your inquiry.')}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-12 sm:py-16 md:py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block text-xs sm:text-sm font-semibold text-[#D69F3F] tracking-wider uppercase mb-2 sm:mb-3">
              {tp('services.sectionLabel', 'Our Services')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading">
              {tp('services.sectionTitle', 'Buy, Sell & Lease with Confidence')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Buy */}
            <ServiceCard
              icon={<Home className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              title={tp('services.buy.title', 'Buy Your Dream Property')}
              description={tp('services.buy.description', "Discover Dubai's most desirable neighborhoods from Downtown Dubai and Palm Jumeirah to Dubai Marina.")}
              features={[
                tp('services.buy.feature1', 'Curated listings to match your lifestyle and goals'),
                tp('services.buy.feature2', 'Expert negotiation to secure the best deals'),
                tp('services.buy.feature3', 'Full guidance through legal and ownership processes'),
              ]}
              highlight={tp('services.buy.highlight', 'Invest in value, growth, and peace of mind.')}
              color="blue"
            />

            {/* Sell */}
            <ServiceCard
              icon={<DollarSign className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              title={tp('services.sell.title', 'Sell with Confidence')}
              description={tp('services.sell.description', 'Let our 20 years of market experience help you get the best possible price.')}
              features={[
                tp('services.sell.feature1', 'Accurate valuations based on current market trends'),
                tp('services.sell.feature2', 'Professional marketing, photography & listing management'),
                tp('services.sell.feature3', 'Access to qualified buyers and investors'),
              ]}
              highlight={tp('services.sell.highlight', 'Your property stands out and sells fast.')}
              color="green"
            />

            {/* Lease */}
            <ServiceCard
              icon={<Key className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              title={tp('services.lease.title', 'Lease with High ROI')}
              description={tp('services.lease.description', 'We specialize in rental management and high-return leasing opportunities.')}
              features={[
                tp('services.lease.feature1', 'End-to-end leasing: pricing, marketing, screening & contracts'),
                tp('services.lease.feature2', 'Data-driven insights to maximize rental yield'),
                tp('services.lease.feature3', 'Continuous management for a hassle-free experience'),
              ]}
              highlight={tp('services.lease.highlight', 'Your property works harder so you earn more.')}
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block text-xs sm:text-sm font-semibold text-[#D69F3F] tracking-wider uppercase mb-2 sm:mb-3">
              {tp('whyChoose.sectionLabel', 'Why Choose Us')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading">
              {tp('whyChoose.sectionTitle', 'Why Choose Rino Invest Group?')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
                title: tp('whyChoose.experience.title', '20+ Years of Experience'),
                desc: tp('whyChoose.experience.description', 'Trusted real estate expertise in Dubai\u2019s dynamic property market.'),
              },
              {
                icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
                title: tp('whyChoose.experts.title', 'Dedicated Experts'),
                desc: tp('whyChoose.experts.description', 'Property specialists with local and global market insights.'),
              },
              {
                icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
                title: tp('whyChoose.trackRecord.title', 'Proven Track Record'),
                desc: tp('whyChoose.trackRecord.description', 'Hundreds of successful sales, investments, and satisfied clients.'),
              },
              {
                icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
                title: tp('whyChoose.transparency.title', 'Transparency & Trust'),
                desc: tp('whyChoose.transparency.description', 'Client satisfaction at the core of everything we do.'),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 text-center group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#D69F3F]/10 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 text-[#D69F3F] group-hover:bg-[#D69F3F] group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT / INTRO ===== */}
      <section className="py-12 sm:py-16 md:py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="inline-block text-xs sm:text-sm font-semibold text-[#D69F3F] tracking-wider uppercase mb-2 sm:mb-3">
                {tp('about.sectionLabel', 'About Rino Invest Group')}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-4 sm:mb-6">
                {tp('about.sectionTitle', "More Than Real Estate Agents — We're Your Partners in Growth")}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                {tp('about.description', 'For over two decades, Rino Invest Group has been guiding investors, homeowners, and tenants through every step of their real estate journey in Dubai. Our deep knowledge of the local market and commitment to excellence have helped hundreds of clients find properties that truly deliver.')}
              </p>
              <div className="space-y-2 sm:space-y-3">
                {[
                  tp('about.point1', 'Lucrative investment opportunities across Dubai'),
                  tp('about.point2', 'Dream homes in premium neighborhoods'),
                  tp('about.point3', 'High-return rental portfolios with expert management'),
                  tp('about.point4', 'End-to-end support from consultation to handover'),
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-first md:order-last">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-gray-200">
                <img
                  src="/images/property1.jpeg"
                  alt={tp('about.imageAlt', 'Rino Invest Group — Dubai real estate team')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gray-900" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/images/cta-background.webp')",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-3 sm:mb-4">
            {tp('cta.title', 'Start Your Real Estate Journey Today')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {tp('cta.description', "Dubai's property market is thriving and opportunities are waiting. Whether you want to buy, sell, or lease, our experienced team is ready to help you make a smart move.")}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                trackButtonClick('Get Free Consultation', { source: 'dubai-real-estate-services-cta' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center !rounded-md gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#D69F3F] hover:bg-[#c08f35] text-white font-semibold transition-colors text-sm sm:text-base"
            >
              {tp('cta.consultation', 'Get Free Consultation')} <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+97143212433"
              onClick={() => trackPhoneClick('+97143212433', 'dubai-real-estate-services-cta')}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
            >
              <Phone className="w-4 h-4" /> {tp('cta.callUs', 'Call Us Now')}
            </a>
            <a
              href="mailto:ask@rinoproperties.com"
              onClick={() => trackEmailClick('dubai-real-estate-services-cta')}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
            >
              <Mail className="w-4 h-4" /> {tp('cta.emailUs', 'Email Us')}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

/* ===== Service Card Component ===== */
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  highlight: string;
  color: 'blue' | 'green' | 'amber';
}

const colorMap = {
   blue: {
    bg: 'bg-gray-100',
    icon: 'bg-white text-black-600 group-hover:bg-gray-600 group-hover:text-white',
    highlight: 'text-black-700',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white',
    highlight: 'text-green-700',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    highlight: 'text-amber-700',
  },
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  features,
  highlight,
  color,
}) => {
  const c = colorMap[color];

  return (
    <div
      className={`group rounded-xl sm:rounded-2xl ${c.bg} border border-gray-100 p-4 sm:p-5 md:p-6 lg:p-8 hover:shadow-xl transition-all duration-300`}
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl ${c.icon} flex items-center justify-center mb-3 sm:mb-4 md:mb-5 transition-colors`}
      >
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-heading">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-5">{description}</p>
      <ul className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-4 md:mb-5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D69F3F] mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <p className={`text-xs sm:text-sm font-semibold ${c.highlight}`}>{highlight}</p>
    </div>
  );
};

export default DubaiRealEstateServicesPage;
