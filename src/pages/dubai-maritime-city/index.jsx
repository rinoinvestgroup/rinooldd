import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useLanguage } from '../../context/LanguageContext';
import {
  initializeDubaiMaritimeTracking,
  trackProjectClick,
  trackProjectEnquiry,
  trackMaritimeCityContact,
  trackHeroSliderInteraction,
  trackHeroCTA,
  trackAdvantageEngagement,
  trackLocationInteraction,
  trackMaritimeCityScrollDepth,
  trackEconomicSectionEngagement,
  trackPageTimeSpent,
  trackExitIntent
} from '../../utils/dubaiMaritimeAnalytics';

// Dubai Maritime City specific modal component
const DubaiMaritimeModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyInterest: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'success', 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send enquiry to Formspree
      const response = await fetch('https://formspree.io/f/xdkvpleg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _to: 'ask@rinoproperties.com',
          _cc: 'mehdi@rinoproperties.com',
          _subject: `🏢 Dubai Maritime City Property Enquiry - ${formData.firstName} ${formData.lastName}`,
          _replyto: formData.email,
          
          // Customer information
          'Full Name': formData.name,
          'Email': formData.email,
          'Phone': formData.phone,
          'Property Interest': formData.propertyInterest || 'Not specified',
          'Message': formData.message || 'No additional message',
          
          // Enquiry metadata
          'Source': 'Dubai Maritime City Page',
          'Enquiry Date': new Date().toLocaleString('en-GB', { 
            dateStyle: 'full', 
            timeStyle: 'short',
            timeZone: 'Asia/Dubai'
          }),
          'Location Interest': 'Dubai Maritime City',
          
          // Spam protection
          _gotcha: '',
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        
        // Track successful enquiry
        trackProjectEnquiry('Dubai Maritime City', 'form_submission', 'enquiry_modal');
        trackMaritimeCityContact('form', formData.email, 'enquiry_modal');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            propertyInterest: '',
            message: ''
          });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D69F3F] to-[#B8892F] p-6 rounded-t-xl text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white hover:text-gray-200 transition-all hover:scale-110 transform duration-200"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center pr-10">
           
            <h2 className="text-2xl font-bold mb-2">{t('dubaiMaritime.modal.title', 'Dubai Maritime City')}</h2>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {submitStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('dubaiMaritime.modal.success.title', 'Enquiry Sent Successfully!')}</h3>
              <p className="text-gray-600 mb-4">{t('dubaiMaritime.modal.success.description', 'Our Dubai property experts will contact you within 24 hours.')}</p>
              <div className="text-sm text-gray-500">
                <p>📧 ask@rinoproperties.com</p>
                <p>📱 +971 43 21 2433</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  {t('dubaiMaritime.modal.form.fullName', 'Full Name *')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-[#D69F3F] transition-colors text-gray-900 bg-white placeholder-gray-500"
                  placeholder={t('dubaiMaritime.modal.form.placeholders.name', 'John Doe')}
                />
              </div>

              {/* Contact Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    {t('dubaiMaritime.modal.form.email', 'Email Address *')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-[#D69F3F] transition-colors text-gray-900 bg-white placeholder-gray-500"
                    placeholder={t('dubaiMaritime.modal.form.placeholders.email', 'john.doe@example.com')}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-[#D69F3F] transition-colors text-gray-900 bg-white placeholder-gray-500"
                    placeholder="+971 43 21 2433"
                  />
                </div>
              </div>

              {/* Property Interest */}
              <div>
                <label htmlFor="propertyInterest" className="block text-sm font-medium text-gray-900 mb-2">
                  Property Interest
                </label>
                <select
                  id="propertyInterest"
                  name="propertyInterest"
                  value={formData.propertyInterest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-[#D69F3F] transition-colors text-gray-900 bg-white"
                >
                  <option value="">Select property type</option>
                  <option value="Breez by Danube">Breez by Danube</option>
                  <option value="Il Vento Premium Residences">Il Vento Premium Residences</option>
                  <option value="31 Above">31 Above</option>
                  <option value="Studio Apartments">Studio Apartments</option>
                  <option value="1-Bedroom Apartments">1-Bedroom Apartments</option>
                  <option value="2-Bedroom Apartments">2-Bedroom Apartments</option>
                  <option value="3-Bedroom Apartments">3-Bedroom Apartments</option>
                  <option value="Penthouses">Penthouses</option>
                  <option value="Commercial Properties">Commercial Properties</option>
                  <option value="Investment Opportunities">Investment Opportunities</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D69F3F] focus:border-[#D69F3F] transition-colors resize-none text-gray-900 bg-white placeholder-gray-500"
                  placeholder="Tell us about your specific requirements, preferred floor plans, payment plans, or any questions you have..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D69F3F] hover:bg-[#B8892F] disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Sending Enquiry...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Enquiry
                    </div>
                  )}
                </button>
              </div>

              {submitStatus === 'error' && (
                <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  Error sending enquiry. Please try again or contact us directly.
                </div>
              )}

              <div className="text-xs text-gray-500 text-center pt-2">
                {t('dubaiMaritime.modal.disclaimer', 'By submitting this form, you agree to be contacted by our property consultants regarding Dubai Maritime City properties.')}
              </div>
            </form>
          )}
        </div>

        {/* Add animation styles */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.4s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

const DubaiMaritimeCityPage = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pageStartTime] = useState(Date.now());
  const [scrollDepth, setScrollDepth] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const advantagesObserverRef = useRef(null);

  // Slider data with different content and background images
  const slides = [
    {
      id: 1,
      backgroundImage: '/images/dubai.webp',
      badge: t('dubaiMaritime.hero.slides.slide1.badge', 'Tallest Waterfront Tower in Maritime City'),
      title: t('dubaiMaritime.hero.slides.slide1.title', 'Breez'),
      subtitle: t('dubaiMaritime.hero.slides.slide1.subtitle', 'by Danube'),
      description: t('dubaiMaritime.hero.slides.slide1.description', 'Dubai\'s tallest residential tower on the waterfront. 60 floors of fully furnished luxury with 40+ resort-style amenities.'),
      infoCards: [
        { icon: 'location', text: t('dubaiMaritime.hero.slides.slide1.infoCards.location', 'Dubai Maritime City') },
        { icon: 'building', text: t('dubaiMaritime.hero.slides.slide1.infoCards.building', '60-Floor Tower') },
        { icon: 'calendar', text: t('dubaiMaritime.hero.slides.slide1.infoCards.completion', 'Completion: March 2029') }
      ]
    },
    {
      id: 2,
      backgroundImage: '/images/hero_bg.webp',
      badge: t('dubaiMaritime.hero.slides.slide2.badge', 'Premium Waterfront Living'),
      title: t('dubaiMaritime.hero.slides.slide2.title', 'Marina'),
      subtitle: t('dubaiMaritime.hero.slides.slide2.subtitle', 'Luxury Residences'),
      description: t('dubaiMaritime.hero.slides.slide2.description', 'Experience unparalleled luxury living with panoramic marina views. Premium amenities and world-class facilities await.'),
      infoCards: [
        { icon: 'location', text: t('dubaiMaritime.hero.slides.slide2.infoCards.location', 'Prime Waterfront') },
        { icon: 'building', text: t('dubaiMaritime.hero.slides.slide2.infoCards.building', 'Luxury Apartments') },
        { icon: 'calendar', text: t('dubaiMaritime.hero.slides.slide2.infoCards.status', 'Ready to Move') }
      ]
    },
    {
      id: 3,
      backgroundImage: '/images/fall_hero_desk.webp',
      badge: t('dubaiMaritime.hero.slides.slide3.badge', 'Exclusive Development'),
      title: t('dubaiMaritime.hero.slides.slide3.title', 'Seashore'),
      subtitle: t('dubaiMaritime.hero.slides.slide3.subtitle', 'Elite Collection'),
      description: t('dubaiMaritime.hero.slides.slide3.description', 'Discover the epitome of coastal luxury living. Exclusive waterfront properties with private beach access and premium amenities.'),
      infoCards: [
        { icon: 'location', text: t('dubaiMaritime.hero.slides.slide3.infoCards.location', 'Beachfront Access') },
        { icon: 'building', text: t('dubaiMaritime.hero.slides.slide3.infoCards.building', 'Elite Villas') },
        { icon: 'calendar', text: t('dubaiMaritime.hero.slides.slide3.infoCards.status', 'Limited Edition') }
      ]
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const newSlide = (prev + 1) % slides.length;
        // Track auto slide change
        trackHeroSliderInteraction(
          'auto_advance',
          newSlide,
          slides[newSlide].title,
          'automatic'
        );
        return newSlide;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Initialize tracking on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      initializeDubaiMaritimeTracking('en');
      
      // Make pageStartTime available globally for debugging
      window.pageStartTime = pageStartTime;
      
      // Dynamically load debug utilities in development
      if (process.env.NODE_ENV === 'development') {
        import('../../utils/dubaiMaritimeDebug').catch(console.error);
      }
    }
  }, [pageStartTime]);

  // Scroll depth tracking
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Batch all layout reads together
          const windowHeight = window.innerHeight;
          const scrollTop = window.scrollY;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollableHeight = documentHeight - windowHeight;
          const scrollPercent = Math.round((scrollTop / scrollableHeight) * 100);
          
          // Update current scroll depth
          setScrollDepth(scrollPercent);
          
          // Clear previous timeout
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          
          // Set new timeout to track scroll depth after user stops scrolling
          scrollTimeoutRef.current = setTimeout(() => {
            // Track significant scroll milestones
            const milestones = [25, 50, 75, 90, 100];
            const currentMilestone = milestones.find(
              milestone => scrollPercent >= milestone && scrollPercent < milestone + 5
            );
            
            if (currentMilestone) {
              trackMaritimeCityScrollDepth(currentMilestone);
            }
          }, 1000);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Track page time spent on unmount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handlePageHide = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
      trackPageTimeSpent(timeSpent);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
        trackPageTimeSpent(timeSpent);
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pageStartTime]);

  // Exit intent tracking
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
        trackExitIntent('mouse_leave', timeSpent, scrollDepth);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [pageStartTime, scrollDepth]);

  // Define handleAdvantageView callback before using it
  const handleAdvantageView = useCallback((advantageTitle, index) => {
    trackAdvantageEngagement(advantageTitle, index, 'view');
  }, []);

  // Intersection observer for advantages section
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const advantageElements = document.querySelectorAll('.advantage-item');
    
    if (advantageElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(advantageElements).indexOf(entry.target);
            const title = entry.target.querySelector('h3')?.textContent || `Advantage ${index + 1}`;
            handleAdvantageView(title, index);
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }
    );

    advantageElements.forEach(element => observer.observe(element));

    return () => {
      advantageElements.forEach(element => observer.unobserve(element));
    };
  }, [handleAdvantageView]);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = (prev + 1) % slides.length;
      trackHeroSliderInteraction(
        'navigation_click',
        newSlide,
        slides[newSlide].title,
        'manual'
      );
      return newSlide;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = (prev - 1 + slides.length) % slides.length;
      trackHeroSliderInteraction(
        'navigation_click',
        newSlide,
        slides[newSlide].title,
        'manual'
      );
      return newSlide;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    trackHeroSliderInteraction(
      'navigation_click',
      index,
      slides[index].title,
      'manual'
    );
  };

  // Event handlers for tracking
  const handleProjectEnquiry = (projectName) => {
    trackProjectEnquiry(projectName, 'enquire_now', 'project_card');
    // Open the registration modal
    setIsModalOpen(true);
  };

  const handleContactClick = (method, value, source) => {
    trackMaritimeCityContact(method, value, source);
  };

  const handleHeroCTAClick = (ctaText, ctaType, slideContext) => {
    trackHeroCTA(ctaText, ctaType, slideContext);
  };

  const handleLocationInteraction = (type, target) => {
    trackLocationInteraction(type, target);
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
        <title>{t('dubaiMaritime.head.title', 'Dubai Maritime City Properties | Waterfront Apartments & Towers | Rino Properties')}</title>
        <meta name="description" content={t('dubaiMaritime.head.description', 'Buy waterfront property in Dubai Maritime City. Luxury towers, marina views, world-class amenities. Breez by Danube & more. Expert guidance from Rino Properties.')} />
        <meta name="keywords" content={t('dubaiMaritime.head.keywords', 'Dubai Maritime City, waterfront property Dubai, Dubai Maritime City apartments, Breez by Danube, maritime city tower, marina view apartment Dubai, off-plan Maritime City, Dubai waterfront investment, port property Dubai, Rino Properties Maritime City')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('dubaiMaritime.head.title', 'Dubai Maritime City Properties | Waterfront Apartments & Towers')} />
        <meta property="og:description" content={t('dubaiMaritime.head.description', 'Buy waterfront property in Dubai Maritime City. Luxury towers, marina views, world-class amenities. Expert guidance from Rino Properties.')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rinoproperties.com/dubai-maritime-city" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://rinoproperties.com/dubai-maritime-city" />
      </Head>

      <Layout 
        title="Dubai Maritime City Properties | Waterfront Apartments & Towers | Rino Properties"
        description="Buy waterfront property in Dubai Maritime City. Luxury towers, marina views, world-class amenities. Breez by Danube & more. Expert guidance from Rino Properties."
        keywords="Dubai Maritime City, waterfront property Dubai, maritime city apartments, Breez by Danube, marina view apartment"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-900/40 to-teal-600/40"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                      {/* Badge */}
                      <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in-up">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">{slide.badge}</span>
                      </div>

                      {/* Main Title */}
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up delay-200">
                        <span className="text-white block">{slide.title}</span>
                        <span className="text-[#D69F3F] block">{slide.subtitle}</span>
                      </h1>

                      {/* Description */}
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-300">
                        {slide.description}
                      </p>

                      {/* Info Cards */}
                      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 animate-fade-in-up delay-400">
                        {slide.infoCards.map((card, cardIndex) => (
                          <div key={cardIndex} className="flex items-center border bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 min-w-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                            handleHeroCTAClick('Registration Now', 'primary', slide.title);
                            handleProjectEnquiry(slide.title);
                          }}
                          className="w-full sm:w-auto inline-flex items-center justify-center bg-[#D69F3F] hover:bg-[#B8892F] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200 shadow-lg"
                        >
                          {t('dubaiMaritime.hero.buttons.enquiryNow', 'Enquiry Now')}
                        </button>
                        
                        <button 
                          onClick={() => {
                            handleHeroCTAClick('Contact on WhatsApp', 'secondary', slide.title);
                            handleContactClick('whatsapp', '+97143212433', 'hero_cta');
                            window.open('https://wa.me/97143212433', '_blank');
                          }}
                          className="w-full sm:w-auto inline-flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {t('dubaiMaritime.hero.buttons.contactWhatsapp', 'Contact on WhatsApp')}
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
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">{t('dubaiMaritime.hero.discoverMore', 'Discover More')}</p>
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

        {/* 5 Key Advantages Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {t('dubaiMaritime.advantages.title', '5 KEY ADVANTAGES OF LIVING &')}
                <span className="block text-[#D69F3F]">{t('dubaiMaritime.advantages.titleHighlight', 'INVESTING IN MARITIME CITY')}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Advantage 1 - Modern Seaside Community */}
              <div className="group advantage-item">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square">
                  <img
                    src="/images/img_1.webp"
                    alt="Modern Seaside Community"
                    className="w-full !h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {t('dubaiMaritime.advantages.modernSeaside.title', 'Modern Seaside Community')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('dubaiMaritime.advantages.modernSeaside.description', 'Outdated areas like Dubai Marina can\'t compare – each project in Maritime City offers a modern amenities for a truly upgraded lifestyle.')}
                  </p>
                </div>
              </div>

              {/* Advantage 2 - Well-Planned Master Project */}
              <div className="group advantage-item">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square">
                  <img
                    src="/images/img_2.webp"
                    alt="Well-Planned Master Project"
                    className="w-full !h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {t('dubaiMaritime.advantages.wellPlanned.title', 'Well-Planned Master Project')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('dubaiMaritime.advantages.wellPlanned.description', 'The master plan includes yacht clubs, marinas, watersports facilities, promenades, lush landscapes, and seamlessly integrated leisure and recreational zones.')}
                  </p>
                </div>
              </div>

              {/* Advantage 3 - Integrated Maritime Ecosystem */}
              <div className="group advantage-item">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square">
                  <img
                    src="/images/img_3.webp"
                    alt="Integrated Maritime Ecosystem"
                    className="w-full !h-[300px]  object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {t('dubaiMaritime.advantages.integratedEcosystem.title', 'Integrated Maritime Ecosystem & Business Hub')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('dubaiMaritime.advantages.integratedEcosystem.description', 'Named among the best private beaches in the UAE – transient and pristine.')}
                  </p>
                </div>
              </div>

              {/* Advantage 4 - Fast Growth & High Rental Returns */}
              <div className="group advantage-item">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square">
                  <img
                    src="/images/img_4.webp"
                    alt="Fast Growth & High Rental Returns"
                    className="w-full !h-[300px]  object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {t('dubaiMaritime.advantages.fastGrowth.title', 'Fast Growth & High Rental Returns')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('dubaiMaritime.advantages.fastGrowth.description', 'Seafront areas grow 15-18% yearly, boosting both property value and rent. Early investors in Maritime City can earn 9-10% ROI vs. 5-7% on the secondary market.')}
                  </p>
                </div>
              </div>

              {/* Advantage 5 - Surrounded by Premium Emaar Communities */}
              <div className="group advantage-item">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square">
                  <img
                    src="/images/img_5.webp"
                    alt="Surrounded by Premium Emaar Communities"
                    className="w-full !h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {t('dubaiMaritime.advantages.premiumCommunities.title', 'Surrounded by Premium Emaar Communities')}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('dubaiMaritime.advantages.premiumCommunities.description', 'Government-backed developer Emaar is building nearby, ensuring the island is surrounded by high-end projects – adding value, prestige, and long-term appeal to Maritime City.')}
                  </p>
                </div>
              </div>
            </div>

           
          </div>
        </section>

        {/* Central & Connected Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  {t('dubaiMaritime.centralConnected.title', 'CENTRAL & CONNECTED')}
                </h2>
                
                <div className="space-y-6 text-gray-700 leading-relaxed mb-8">
                  <p className="text-lg">
                    {t('dubaiMaritime.centralConnected.description', 'Just 10 minutes from Down town, Dubai Maritime City is one of the closest seaside locations to the city center. The island\'s master plan includes modern high-rise buildings with beautiful sea views, and in some cases, views of Downtown Dubai. Top developers are building mainly in the northeast part of the island. While the area was once focused on marine industry, the plan is changing to create a private and peaceful seaside community. With full development expected by 2028-2029, strong price growth is expected.')}
                  </p>
                </div>

                {/* Travel Times */}
                <div className="space-y-4">
                  <div 
                    className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => handleLocationInteraction('travel_time_view', 'Dubai International Airport')}
                  >
                    <span className="text-gray-900 font-medium">{t('dubaiMaritime.centralConnected.travelTimes.dubaiAirport', 'Dubai International Airport (DXB)')}</span>
                    <span className="text-gray-700 font-semibold">{t('dubaiMaritime.centralConnected.travelTimes.times.airport', '13 min')}</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => handleLocationInteraction('travel_time_view', 'Burj Khalifa')}
                  >
                    <span className="text-gray-900 font-medium">{t('dubaiMaritime.centralConnected.travelTimes.burjKhalifa', 'Burj Khalifa')}</span>
                    <span className="text-gray-700 font-semibold">{t('dubaiMaritime.centralConnected.travelTimes.times.burj', '10 min')}</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => handleLocationInteraction('travel_time_view', 'The Dubai Mall')}
                  >
                    <span className="text-gray-900 font-medium">{t('dubaiMaritime.centralConnected.travelTimes.dubaiMall', 'The Dubai Mall')}</span>
                    <span className="text-gray-700 font-semibold">{t('dubaiMaritime.centralConnected.travelTimes.times.mall', '10 min')}</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => handleLocationInteraction('travel_time_view', 'Mall of the Emirates')}
                  >
                    <span className="text-gray-900 font-medium">{t('dubaiMaritime.centralConnected.travelTimes.mallEmirates', 'Mall of the Emirates')}</span>
                    <span className="text-gray-700 font-semibold">{t('dubaiMaritime.centralConnected.travelTimes.times.emirates', '20 min')}</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => handleLocationInteraction('travel_time_view', 'Palm Jumeirah')}
                  >
                    <span className="text-gray-900 font-medium">{t('dubaiMaritime.centralConnected.travelTimes.palmJumeirah', 'Palm Jumeirah')}</span>
                    <span className="text-gray-700 font-semibold">{t('dubaiMaritime.centralConnected.travelTimes.times.palm', '25 min')}</span>
                  </div>
                  
                  <div 
                    className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50 px-2 rounded"
                    onClick={() => handleLocationInteraction('travel_time_view', 'Dubai Marina')}
                  >
                    <span className="text-gray-900 font-medium">{t('dubaiMaritime.centralConnected.travelTimes.dubaiMarina', 'Dubai Marina')}</span>
                    <span className="text-gray-700 font-semibold">{t('dubaiMaritime.centralConnected.travelTimes.times.marina', '20 min')}</span>
                  </div>
                </div>
              </div>

              {/* Right Map */}
              <div className="relative">
               <img 
                 src="/images/dubai_maritime_city_map.webp" 
                 alt="Dubai Maritime City Map" 
                 className="w-full h-auto rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300" 
                 onClick={() => handleLocationInteraction('map_view', 'dubai_maritime_city_map')}
               />  
              </div>
            </div>
          </div>
        </section>

        {/* Projects in Dubai Maritime City Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('dubaiMaritime.projects.title', 'Projects in Dubai Maritime City')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project 1 - Il Vento Premium Residences */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="/images/maritime/Il-Vento-3.webp"
                    alt="Il Vento Premium Residences"
                    className="w-full h-64 object-cover"
                  />
                  {/* Progress Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-sm font-semibold text-gray-900">40/60</div>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 bg-white text-black text-xs font-medium px-3 py-1 rounded-full">
                    Ready to Move In
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('dubaiMaritime.projects.ilVento.title', 'Il Vento Premium Residences')}</h3>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{t('dubaiMaritime.projects.ilVento.location', 'Dubai Maritime City')}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D69F3F] text-white">
                      APARTMENTS
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D69F3F] text-white">
                      PENTHOUSES
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      trackProjectClick('Il Vento Premium Residences', 'apartment', 'Il Vento Developer', 'Ready to Move In', 'project_card');
                      handleProjectEnquiry('Il Vento Premium Residences');
                    }}
                    className="w-full bg-[#D69F3F] hover:bg-[#B8892F] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {t('dubaiMaritime.projects.enquireNow', 'Enquire Now')}
                  </button>
                </div>
              </div>

              {/* Project 2 - Breez by Danube */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="/images/maritime/breez.jpeg"
                    alt="Breez by Danube"
                    className="w-full h-64 object-cover"
                  />
                  {/* Progress Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-sm font-semibold text-gray-900">70/30</div>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 bg-white text-black text-xs font-medium px-3 py-1 rounded-full">
                    Handover 2029 Q2
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('dubaiMaritime.projects.breez.title', 'Breez by Danube')}</h3>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{t('dubaiMaritime.projects.breez.location', 'Dubai Maritime City')}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D69F3F] text-white">
                      APARTMENTS
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D69F3F] text-white">
                      STUDIOS
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      trackProjectClick('Breez by Danube', 'apartment', 'Danube', 'Handover 2029 Q2', 'project_card');
                      handleProjectEnquiry('Breez by Danube');
                    }}
                    className="w-full bg-[#D69F3F] hover:bg-[#B8892F] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {t('dubaiMaritime.projects.enquireNow', 'Enquire Now')}
                  </button>
                </div>
              </div>

              {/* Project 3 - 31 Above */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="/images/maritime/31-Above.jpg"
                    alt="31 Above"
                    className="w-full !h-53 object-cover"
                  />
                  {/* Progress Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="text-sm font-semibold text-gray-900">50/50</div>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 bg-white text-black text-xs font-medium px-3 py-1 rounded-full">
                        Handover 2029 Q1
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t('dubaiMaritime.projects.above31.title', '31 Above')}</h3>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{t('dubaiMaritime.projects.above31.location', 'Dubai Maritime City')}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D69F3F] text-white">
                      OFFICES
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      trackProjectClick('31 Above', 'office', '31 Above Developer', 'Handover 2029 Q1', 'project_card');
                      handleProjectEnquiry('31 Above');
                    }}
                    className="w-full bg-[#D69F3F] hover:bg-[#B8892F] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {t('dubaiMaritime.projects.enquireNow', 'Enquire Now')}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* About Dubai Maritime City Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Blue Header Section */}
            <div className="bg-red-500 rounded-2xl p-8 mb-12 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('dubaiMaritime.expertHelp.title', 'Our Expert Will Help You')}</h2>
                <button 
                  onClick={() => {
                    handleContactClick('form', 'contact_form', 'expert_help_section');
                    trackEconomicSectionEngagement('contact_expert', 0);
                    handleProjectEnquiry('Dubai Maritime City Expert Consultation');
                  }}
                  className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  {t('dubaiMaritime.expertHelp.contactUs', 'Contact Us')}
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Text Content */}
              <div>
                <h3 
                  className="text-3xl font-bold text-gray-900 mb-6"
                  onMouseEnter={() => trackEconomicSectionEngagement('about_area')}
                >
                  {t('dubaiMaritime.about.title', 'About Dubai Maritime City area')}
                </h3>
                
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    {t('dubaiMaritime.about.content1', 'Dubai Maritime City (DMC) is a landmark area which is dedicated to the maritime, commercial and cruise industry. The area is situated between the Dubai Creek and Dubai\'s historic ports which provide office, commercial and retail space, waterfront district, as well as the Maritime District, dedicated to country owned maritime facility.')}
                  </p>
                  
                  <p>
                    {t('dubaiMaritime.about.content2', 'The master developer of this neighborhood is DP World, which is working with architecture consultants from Europe & Asia to regenerate this area. The Dubai Maritime City project is expected to be completed by the end of 2030. It would cater the requirements of the elite-class semi-professional of development world from the maritime, commercial, and cruise industries. The project will encompass around 227 hectares, which is directly owned and operated.')}
                  </p>
                  
                  <p>
                    {t('dubaiMaritime.about.content3', 'According to the master plan, DMC is being developed to create a cluster of five nautical companies with no stage and diverse owners, including maritime and cruise, hospitality, marina, educational and the area should be developed close to the International cruise terminal. There are a fully funded to integrated to the expected in the DMC.')}
                  </p>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-6">
                {/* Large panoramic image */}
                <div className="w-full">
                  <img
                    src="/images/maritime/Il-Vento-3.webp"
                    alt="Dubai Maritime City panoramic view"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
                
               
              </div>
            </div>
          </div>
        </section>

        {/* Economic Attractiveness Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Text Content */}
              <div>
                <h3 
                  className="text-3xl font-bold text-gray-900 mb-6"
                  onMouseEnter={() => trackEconomicSectionEngagement('economic_attractiveness')}
                >
                  {t('dubaiMaritime.economic.title', 'Economic Attractiveness')}
                </h3>
                
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    {t('dubaiMaritime.economic.content1', 'This district can offer effective and attractive partnerships with relevant government agencies, private sector businesses and stakeholders in the aim to create a safe and dynamic maritime sector, and ensuring the economic sustainability and growth in the emirate. The Office strives to exceed its work and elevate effective policies to provide a comprehensive basis of maritime safety and implement the best maritime services for public, in accordance with local and international laws. By doing so, it will provide a comprehensive review system.')}
                  </p>
                  
                  <p>
                    {t('dubaiMaritime.economic.content2', 'The main part of Dubai Maritime City will be the Maritime Center, which will feature key projects such as apartment and interior plans for maritime issues, as well as luxurious hotels, restaurants, retail residential apartments and offices.')}
                  </p>

                  <h4 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t('dubaiMaritime.economic.businessProperties', 'Business properties')}</h4>
                  
                  <p>
                    {t('dubaiMaritime.economic.content3', 'Almost all areas in Dubai Maritime City Phase 1 including road works, plot registrations, greatly added networks and public spaces network have been completed. This area is going to attract Dubai Maritime facilities that is the biggest.')}
                  </p>
                  
                  <p>
                    <strong>{t('dubaiMaritime.economic.residences', 'Residences:')}</strong> {t('dubaiMaritime.economic.content4', 'The center of the area is called the Maritime Center, where there will be 8 waterfronts and 3 interior grounds. It area included amenity work facilities such hotels, restaurants, retail and office services.')}
                  </p>
                </div>
              </div>

              {/* Aerial Image Section */}
              <div className="space-y-6">
                {/* Large aerial image of Dubai Maritime City */}
                <div className="w-full">
                  <img
                    src="/images/bg_1.jpeg"
                    alt="Dubai Maritime City aerial view showing the comprehensive development"
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                    {t('dubaiMaritime.economic.imageCaption', 'The Industries District will be dedicated to ship fittings, facilities, and yacht repair and construction, as well as over one hundred warehouses that will be located in the zone. Marine District and Harbour Development will be dedicated to activity areas for yacht centers, including restaurants, hotels and other facilities. There is also an opportunity to add 15 towers which are located at the front of the gateway, where there will a cruise terminal and office construction.')}
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">{t('dubaiMaritime.economic.keyFeatures.title', 'Key Development Features')}</h5>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#D69F3F] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600">
                        {t('dubaiMaritime.economic.keyFeatures.feature1', 'The Industries District dedicated to ship fittings and yacht repair facilities')}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#D69F3F] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600">
                        {t('dubaiMaritime.economic.keyFeatures.feature2', 'Academic Quarter for marine engineering and transportation education')}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#D69F3F] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600">
                        {t('dubaiMaritime.economic.keyFeatures.feature3', 'Over 100 office buildings and 130+ warehouses planned')}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#D69F3F] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600">
                        {t('dubaiMaritime.economic.keyFeatures.feature4', 'Cruise Tower and office facilities at strategic locations')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{t('dubaiMaritime.economic.development.title', 'Development Timeline & Completion')}</h4>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  {t('dubaiMaritime.economic.development.description', 'Once the Dubai Maritime City is completed, the area will house around fifteen towers. Landmark Tower which will be located at the head of the area with a 5-Star hotel, as well as 15 towers which are located at different areas of the development including both around the port.')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="bg-[#D69F3F] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">{t('dubaiMaritime.economic.development.completion.title', 'Project Completion')}</h5>
                  <p className="text-gray-600">{t('dubaiMaritime.economic.development.completion.description', 'Expected completion by end of 2030')}</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-[#D69F3F] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">{t('dubaiMaritime.economic.development.area.title', 'Total Area')}</h5>
                  <p className="text-gray-600">{t('dubaiMaritime.economic.development.area.description', '227 hectares of integrated development')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('dubaiMaritime.contact.title', 'Ready to Invest?')}</h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('dubaiMaritime.contact.description', 'Contact our expert team to learn more about Breez by Danube and secure your waterfront luxury home.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:ask@rinoproperties.com"
                onClick={() => handleContactClick('email', 'ask@rinoproperties.com', 'contact_section')}
                className="inline-flex items-center bg-[#D69F3F] hover:bg-[#B8892F] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {t('dubaiMaritime.contact.emailUs', 'Email Us')}
              </a>
              
              <a
                href="https://wa.me/97143212433"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleContactClick('whatsapp', '+97143212433', 'contact_section')}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                {t('dubaiMaritime.contact.whatsapp', 'WhatsApp')}
              </a>
            </div>
          </div>
        </section>

        {/* Registration Modal */}
        <DubaiMaritimeModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Layout>
    </>
  );
};

export default DubaiMaritimeCityPage;