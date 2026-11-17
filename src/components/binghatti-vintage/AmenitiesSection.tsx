import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface AmenitiesSectionProps {}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<any>({});

  // Load translations from binghatti-vintage.json
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

  // Translation helper function
  const tBinghattiVintage = (key: string, fallback: string = '') => {
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

  const amenities = [
    {
      icon: (
        <img src={'/images/tasmeer/icons/swimming-pool.png'} alt="Swimming Pool" className="w-8 h-8" />
      ),
      title: tBinghattiVintage('amenities.swimmingPool', 'Swimming Pool'),
    },
    {
      icon: (
        <img src={'/images/vintage/icon/Isolation_Mode.svg'} alt="Basketball Court" className="w-8 h-8" />
      ),
      title: tBinghattiVintage('amenities.basketballCourt', 'Basketball Court'),
    },
    {
      icon: (
        <img src={'/images/vintage/icon/Isolation_Mode-1.svg'} alt="Indoor Gym" className="w-8 h-8" />
      ),
      title: tBinghattiVintage('amenities.indoorGym', 'Indoor Gym'),
    },
    {
      icon: (
        <img src={'/images/vintage/icon/Isolation_Mode-4.svg'} alt="Outdoor Cinema" className="w-8 h-8" />
      ),
      title: tBinghattiVintage('amenities.outdoorCinema', 'Outdoor Cinema'),
    },
    {
      icon: (
        <img src={'/images/vintage/icon/Isolation_Mode-2.svg'} alt="Padel Court" className="w-8 h-8" />
      ),
      title: tBinghattiVintage('amenities.padelCourt', 'Padel Court'),
    },
    {
      icon: (
        <img src={'/images/vintage/icon/Isolation_Mode-3.svg'} alt="Green Area" className="w-8 h-8" />
      ),
      title: tBinghattiVintage('amenities.greenArea', 'Green Area'),
    }
  ];

  return (
    <section id="amenities" className="py-16 md:py-20 lg:py-24 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            {tBinghattiVintage('amenities.sectionTitle', 'FEATURES & AMENITIES')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[#2C3E35] leading-tight" style={{fontFamily: 'Montserrat, sans-serif'}}>
            {tBinghattiVintage('amenities.mainTitle', 'World-Class Amenities')}
          </h2>
        
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-[#2C3E35] group-hover:text-[#B8883A] transition-colors duration-300">
                  {amenity.icon}
                </div>
                {/* Title */}
                <h3 className="text-sm font-medium text-[#2C3E35] leading-tight">
                  {amenity.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
