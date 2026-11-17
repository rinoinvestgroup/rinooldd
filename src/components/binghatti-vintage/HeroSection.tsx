import React, { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onOpenContactPopup?: (formType: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContactPopup }) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<any>({});

  // Load translations
  useEffect(() => {
    const loadBinghattiVintageTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}/binghatti-vintage.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        }
      } catch (error) {
      }
    };
    loadBinghattiVintageTranslations();
  }, [language]);

  // Helper function to get nested translation values
  const tBinghattiVintage = (key: string, fallback: string = '') => {
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
  const [state, handleFormspreeSubmit] = useForm("mgvrbzbr");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  // Custom submit handler that combines form data with Formspree
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   // Create FormData object for Formspree
  //   const formDataObj = new FormData(e.target as HTMLFormElement);
    
  //   // Call Formspree submit handler
  //   await handleFormspreeSubmit(formDataObj);
  // };

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
      <div className="absolute inset-0 w-full h-full bg-black/50">
        <img 
          src="/images/hero_bg.webp"
          alt={tBinghattiVintage('hero.imageAlt', 'Binghatti Vintage JVC Dubai - Modern luxury residential development with contemporary architecture')}
          className="w-full h-full min-h-screen object-cover"
          loading="eager"
          fetchPriority="high"
          width="1920"
          height="1080"
          decoding="async"
          style={{ contentVisibility: 'auto', objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container - Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 text-center">
          
          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}>
            {tBinghattiVintage('hero.title', 'Binghatti Vintage')}
          </h1>

          {/* Price Badge */}
          <div className="inline-flex flex-col items-center mb-8">
            <div className="text-white text-sm font-medium mb-2 uppercase tracking-wider drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              {tBinghattiVintage('hero.startingPrice', 'Starting Price')}
            </div>
            <div className="border-2 border-red-500 rounded-full px-8 py-4 bg-black/40 backdrop-blur-sm shadow-2xl">
              <div className="text-4xl sm:text-5xl font-bold text-white drop-shadow-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                674,999 AED
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed px-4 drop-shadow-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
            {tBinghattiVintage('hero.description', 'Premium development in Jumeirah Village Circle featuring studio to 2-bedroom apartments with modern architecture and world-class amenities in Dubai\'s most vibrant community.')}
          </p>

          {/* Info Icons Row */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mb-10">
            <div className="flex items-center gap-2 text-white drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              <svg className="w-10 h-10 text-red-500 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{tBinghattiVintage('hero.location', 'JVC, Dubai')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-white drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              <svg className="w-10 h-10 text-red-500 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium">{tBinghattiVintage('hero.units', 'Studio - 2 BR')}</span>
            </div>

            <div className="flex items-center gap-2 text-white drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              <svg className="w-10 h-10 text-red-500 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="font-medium">{tBinghattiVintage('hero.handover', 'Handover Q4 2027')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => onOpenContactPopup && onOpenContactPopup('register')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 radius text-white font-semibold !rounded-full transition-all duration-300 gap-3 shadow-xl drop-shadow-lg"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
            >
              <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {tBinghattiVintage('hero.registerNow', 'Register Now')}
            </button>

            <a
              href="https://wa.me/971547647485"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 text-white font-semibold rounded-full transition-all duration-300 gap-3 shadow-xl drop-shadow-lg"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
            >
              <svg className="w-5 h-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {tBinghattiVintage('hero.contactWhatsApp', ' WhatsApp')}
            </a>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
            <div className="flex flex-col items-center gap-2 animate-bounce drop-shadow-lg" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              <span className="text-sm font-medium">{tBinghattiVintage('hero.discover', 'Discover Binghatti Vintage')}</span>
              <svg className="w-6 h-6 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;