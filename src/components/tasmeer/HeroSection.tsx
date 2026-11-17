import React, { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onOpenContactPopup?: (formType: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContactPopup }) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<any>({});

  // Load translations
  useEffect(() => {
    const loadTasmeerTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}/tasmeer.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
      }
    };
    loadTasmeerTranslations();
  }, [language]);

  // Helper function to get nested translation values
  const tTasmeer = (key: string, fallback: string = '') => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return fallback;
      }
    }
    return value || fallback;
  };

  // Formspree form hook
  const [state, handleFormspreeSubmit] = useForm("xanpvjyz");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  // Custom submit handler that combines form data with Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object for Formspree
    const formDataObj = new FormData(e.target as HTMLFormElement);
    
    // Call Formspree submit handler
    await handleFormspreeSubmit(formDataObj);
  };

  // Reset form when submission is successful
  useEffect(() => {
    if (state.succeeded) {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
      });
    }
  }, [state.succeeded]);

  // Sticky bottom bar scroll handling
  const [stickyInfoBar, setStickyInfoBar] = useState(false);
  useEffect(() => {
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Batch all layout reads together
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Check if user has scrolled near the bottom (within 100px of bottom)
          const isNearBottom = scrollY + windowHeight >= documentHeight - 100;
          
          if (scrollY > 40 && !isNearBottom) {
            setStickyInfoBar(true);
          } else {
            setStickyInfoBar(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="/images/tasmeer/bg.webp"
          alt={tTasmeer('hero.imageAlt', 'SquareX One JVC Dubai - Modern luxury residential development with contemporary architecture')}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          width="1920"
          height="1080"
          decoding="async"
          style={{ contentVisibility: 'auto' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-white space-y-8">
              <h1 className="text-xl sm:text-2xl lg:text-2xl xl:text-2xl font-light leading-tight">
                <span >{tTasmeer('hero.title', 'Discover Luxury Apartment')}</span>
                {/* <span className="block mt-2">{tTasmeer('hero.subtitle', '& In JVC')}</span> */}
              </h1>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onOpenContactPopup?.('getDetails')}
                  className="inline-flex items-center justify-center px-8 py-4 hover:bg-[#A5E06B] text-gray-900 font-semibold !rounded-lg transition-all duration-300 text-center"
                  style={{ backgroundColor: 'rgba(198,244,180,.92)' }}
                >
                  {tTasmeer('hero.getPricesBrochure', 'Get Prices & Brochure')}
                </button>
                <a 
                  href="https://wa.me/971547647485?text=Hello, I'm interested in SquareX One properties"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  {tTasmeer('hero.whatsappNow', 'WhatsApp Now')}
                </a>
              </div>

              {/* Additional Buttons Row */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href="tel:971547647485"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-lg transition-all duration-300 gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {tTasmeer('hero.callSales', 'Call Sales')}
                </a>
                <button 
                  onClick={() => onOpenContactPopup?.('bookTour')}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 hover:border-white/50 text-white font-medium !rounded-lg transition-all duration-300 gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {tTasmeer('hero.bookTour', 'Book a Tour')}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(198,244,180,.92)' }}>
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-white/90">{tTasmeer('hero.officialPartner', 'Official Developer Partner')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(198,244,180,.92)' }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-white/90">{tTasmeer('hero.instantCallback', 'Instant Callback (5-10 min)')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(198,244,180,.92)' }}>
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-white/90">{tTasmeer('hero.floorPlans', 'Floor Plans • Payment Plan • Offers')}</span>
                </div>
              </div>
            </div>

            {/* Right Info Card */}
            <div className="lg:ml-auto w-full lg:max-w-md">
              <div className="bg-[rgba(198,244,180,.92)] rounded-3xl p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  {/* Price */}
                  <div>
                    <div className="text-5xl font-bold text-gray-900">AED 742K</div>
                    <div className="text-gray-700 font-medium mt-2 uppercase tracking-wide text-sm">
                      {tTasmeer('hero.startingPrice', 'Starting Price')}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {tTasmeer('hero.bookingFrom', 'Booking from AED 148.4K (USD 40.4K)')}
                    </div>
                  </div>

                  <div className="h-px bg-gray-900/20"></div>

                  {/* Payment Plan */}
                  <div>
                    <div className="text-4xl font-bold text-gray-900">60/40</div>
                    <div className="text-gray-700 font-medium mt-2 uppercase tracking-wide text-sm">
                      {tTasmeer('hero.paymentPlan', 'Payment Plan')}
                    </div>
                  </div>

                  <div className="h-px bg-gray-900/20"></div>

                  {/* Availability */}
                  <div>
                    <div className="text-gray-900 font-semibold text-lg">
                      {tTasmeer('hero.availability', 'Studios, 1 & 2 Bedrooms Available')}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onOpenContactPopup?.('getDetails')}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 !rounded-xl transition-all duration-300 text-base shadow-lg"
                  >
                    {tTasmeer('hero.getFullDetails', 'Get Full Details')}
                  </button>

                  <p className="text-gray-700 text-sm">
                    {tTasmeer('hero.receiveDetails', 'You\'ll receive floor plans, pricing & current offers by email/WhatsApp.')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;