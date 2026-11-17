import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-20 xs:py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-background.webp"
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
          {/* Main Heading */}
          <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-medium text-black leading-tight tracking-wide mb-6 xs:mb-8">
            <span className="font-light text-white">{t('cta.heading')} </span>
          </h2>

          <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-white font-normal leading-relaxed mb-8 xs:mb-10 sm:mb-12 max-w-4xl mx-auto">
            {t('cta.description')}
          </p>

          {/* Decorative line */}
          {/* <div className="flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-0.5 bg-[#D69F3F] "></div>
            <div className="w-3 h-3 bg-[#D69F3F]  animate-pulse"></div>
            <div className="w-24 h-0.5 bg-[#D69F3F] "></div>
          </div> */}
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-2 xs:px-4">
            <Link 
              href="/contact"
              className="group relative bg-black hover:bg-gray-900 text-white px-6 xs:px-8 sm:px-4 py-3 xs:py-4 sm:py-4 font-medium text-sm xs:text-base sm:text-lg transition-all duration-500  hover: transform hover:scale-105 overflow-hidden border border-[#D69F3F]/20 w-full sm:w-auto sm:min-w-[220px]"
            >
              <span className="relative z-10 flex items-center justify-center">
                {t('cta.contactExperts')}
                <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#D69F3F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 "></span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Link>
            <Link 
              href="/dubai-real-estate-services"
              className="group relative bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#D69F3F] text-white px-6 xs:px-8 sm:px-4 py-3 xs:py-4 sm:py-4 font-medium text-sm xs:text-base sm:text-lg transition-all duration-500 transform hover:scale-105 overflow-hidden w-full sm:w-auto sm:min-w-[220px]"
            >
              <span className="relative z-10 flex items-center justify-center">
                Our Services
                <svg className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            </Link>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;