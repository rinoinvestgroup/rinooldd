import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const ValutionSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-30 lg:py-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/valution.jpg"
          alt="cta background"
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

     
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold text-white mb-4">{t('valuation.heading')}</h2>
          <p className="text-base sm:text-lg lg:text-xl text-white font-normal leading-relaxed mb-12 max-w-3xl mx-auto">
            {t('valuation.description')}
          </p>

          {/* Decorative line */}
          {/* <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-0.5 bg-[#D69F3F] "></div>
            <div className="w-3 h-3 bg-[#D69F3F]  animate-pulse"></div>
            <div className="w-24 h-0.5 bg-[#D69F3F] "></div>
          </div> */}
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <Link 
              href="/sell"
              target='_blank'
              className="group relative bg-white  text-black px-4 sm:px-4 py-4 sm:py-4 font-medium text-base sm:text-lg transition-all duration-500  hover: transform hover:scale-105 overflow-hidden border border-[#D69F3F]/20 w-full sm:w-auto sm:min-w-[220px]"
            >
              <span className="relative z-10 flex items-center justify-center">
                                  {t('valuation.ctaButton')}
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#D69F3F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 "></span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Link>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValutionSection;