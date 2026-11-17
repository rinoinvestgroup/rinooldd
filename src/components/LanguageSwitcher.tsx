import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'en', name: 'English', countryCode: 'us' },
  { code: 'ar', name: 'العربية', countryCode: 'ae' },
  { code: 'es', name: 'Español', countryCode: 'es' },
  { code: 'zh', name: '中文', countryCode: 'cn' },
  { code: 'de', name: 'Deutsch', countryCode: 'de' },
  { code: 'hi', name: 'हिन्दी', countryCode: 'in' },
  { code: 'ur', name: 'اردو', countryCode: 'pk' },
  { code: 'fa', name: 'فارسی', countryCode: 'ir' },
];

const FlagIcon: React.FC<{ countryCode: string; size?: number; className?: string }> = ({ countryCode, size = 20, className = '' }) => (
  <Image
    src={`https://flagcdn.com/w40/${countryCode}.png`}
    alt={countryCode.toUpperCase()}
    width={size}
    height={Math.round(size * 0.75)}
    className={`inline-block rounded-sm object-cover ${className}`}
    unoptimized
  />
);

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2 lg:px-3 py-2 text-sm font-medium text-gray-900 lg:text-gray-700 bg-white/90 backdrop-blur-sm  rounded-lg hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D69F3F] transition-all duration-300"
      >
        <FlagIcon countryCode={currentLanguage.countryCode} size={20} className="lg:w-[24px] lg:h-[18px] w-[20px] h-[15px]" />
        {/* Show language name only on desktop */}
        {/* <span className="hidden lg:inline">{currentLanguage.name}</span> */}
        <svg 
          className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor"   
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-40 lg:w-48 mt-2 origin-top-right bg-white/98 backdrop-blur-xl  rounded-xl shadow-xl">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center w-full px-3 lg:px-4 py-2.5 lg:py-2 text-sm text-left transition-all duration-200 ${
                  language === lang.code 
                    ? 'bg-gradient-to-r from-[#D69F3F]/10 to-transparent text-[#D69F3F]' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#D69F3F]'
                }`}
              >
                <FlagIcon countryCode={lang.countryCode} size={20} className="mr-2 lg:mr-3" />
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <svg className="w-4 h-4 ml-auto text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
