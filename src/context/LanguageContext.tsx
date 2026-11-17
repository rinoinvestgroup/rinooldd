import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translations: any;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState({});

  const isRTL = ['ar', 'ur', 'fa'].includes(language);

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language');
      const browserLanguage = navigator.language.split('-')[0];
      const supportedLanguages = ['en', 'ar', 'es', 'zh', 'de', 'hi', 'ur', 'fa'];
      
      const preferredLanguage = savedLanguage || 
        (supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en');
      
      setLanguageState(preferredLanguage);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  const loadTranslations = async (lang: string) => {
    try {
      // Load translations directly from public folder
      const response = await fetch(`/locales/${lang}/common.json`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
      } else {
        // Fallback to default English translations
        if (lang !== 'en') {
          const fallbackResponse = await fetch(`/locales/en/common.json`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
          } else {
            // Use inline fallback
            setTranslations(getInlineFallbackTranslations());
          }
        } else {
          setTranslations(getInlineFallbackTranslations());
        }
      }
    } catch (error) {
      setTranslations(getInlineFallbackTranslations());
    }
  };

  const getInlineFallbackTranslations = () => ({
    nav: {
      home: 'Home',
      about: 'About',
      properties: 'Properties',
      blog: 'Blog',
      contact: 'Contact',
      agents: 'Agents',
      sell: 'Sell',
      spainProperties: 'Spain Properties',
      dubaiProperties: 'Dubai Properties'
    },
    common: {
      searchProperties: 'Search Properties',
      findAgent: 'Find Agent',
      readMore: 'Read More',
      viewAll: 'View All',
      contactUs: 'Contact Us',
      getStarted: 'Get Started',
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try Again'
    },
    hero: {
      title: 'Find Your Dream Property',
      subtitle: 'Discover luxury real estate opportunities in Dubai and Spain',
      searchPlaceholder: 'Search properties...',
      searchButton: 'Search Properties'
    },
    footer: {
      description: 'Your trusted partner in luxury real estate investments',
      quickLinks: 'Quick Links',
      followUs: 'Follow Us',
      allRightsReserved: 'All rights reserved'
    }
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    // Store language preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    // Always return fallback during SSR to prevent hydration mismatches
    if (typeof window === 'undefined') {
      return fallback || key;
    }

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

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        translations, 
        t, 
        isRTL 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
