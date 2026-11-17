import { Suspense, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AutoTranslate from '../AutoTranslate';

// Minimal loading placeholder matching exact filter dimensions to prevent layout shift
const SearchPlaceholder = () => (
  <div className="w-full max-w-6xl mx-auto">
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2 min-w-[140px]">
            <div className="w-full h-[42px] sm:h-[46px] bg-gray-100 border border-gray-300 rounded-lg animate-pulse" />
          </div>
        ))}
        <div className="min-w-[140px]">
          <div className="w-full h-[42px] sm:h-[46px] bg-[#D69F3F]/40 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);


// PropertySearchFilter with SSR enabled to prevent layout shift
const PropertySearchFilter = dynamic(() => import('./PropertySearchFilter'), {
  loading: SearchPlaceholder,
  ssr: true
});

// Utility to detect mobile devices
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const HeroSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Optimized video loading callback with better performance
  // const loadVideo = useCallback(() => {
  //   if (!videoLoaded && !isMobile) { // Never load video on mobile for better LCP
  //     // Use requestAnimationFrame for smoother updates
  //     requestAnimationFrame(() => {
  //       setVideoLoaded(true);
  //     });
  //   }
  // }, [videoLoaded, isMobile]);

  // Mobile-optimized performance
  // useEffect(() => {
  //   // Detect mobile immediately
  //   const mobile = isMobileDevice();
  //   setIsMobile(mobile);
  //   setIsMounted(true);
    
  //   // Mobile-specific optimizations
  //   if (mobile) {
  //     // On mobile: delay search component much longer to prioritize LCP
  //     const mobileSearchTimer = setTimeout(() => {
  //       setShowSearch(true);
  //     }, 3000); // Increased delay for mobile
      
  //     return () => clearTimeout(mobileSearchTimer);
  //   }
    
  //   // Desktop optimizations (existing logic)
  //   const searchTimer = setTimeout(() => {
  //     setShowSearch(true);
  //   }, 1500);

  //   // Lightweight resource preloading only on desktop
  //   const preloadedLinks: HTMLLinkElement[] = [];
    
  //   if ('requestIdleCallback' in window) {
  //     requestIdleCallback(() => {
  //       try {
  //         // Only preload Spain flag
  //         const flagLink = document.createElement('link');
  //         flagLink.rel = 'prefetch';
  //         flagLink.href = '/images/spain_flag.svg';
  //         document.head.appendChild(flagLink);
  //         preloadedLinks.push(flagLink);

  //         // DNS prefetch for video CDN (desktop only)
  //         const dnsPrefetch = document.createElement('link');
  //         dnsPrefetch.rel = 'dns-prefetch';
  //         dnsPrefetch.href = 'https://rino.s3.me-central-1.amazonaws.com';
  //         document.head.appendChild(dnsPrefetch);
  //         preloadedLinks.push(dnsPrefetch);
  //       } catch (error) {
  //       }
  //     });
  //   }

    // Video loading only on desktop
  //   const videoTimer = setTimeout(() => {
  //     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
  //     if (!prefersReducedMotion && !mobile) {
  //       if ('requestIdleCallback' in window) {
  //         requestIdleCallback(loadVideo, { timeout: 4000 });
  //       } else {
  //         loadVideo();
  //       }
  //     }
  //   }, 4000); // Increased delay for better LCP

  //   return () => {
  //     clearTimeout(searchTimer);
  //     clearTimeout(videoTimer);
      
  //     preloadedLinks.forEach(link => {
  //       if (link && document.head.contains(link)) {
  //         try {
  //           document.head.removeChild(link);
  //         } catch (error) {
  //           // Ignore cleanup errors
  //         }
  //       }
  //     });
  //   };
  // }, [loadVideo]);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-section bg-gray-900"
      style={{
        minHeight: '100vh',
        height: '100vh'
      }}
    >
      {/* Mobile-Optimized Background Layer */}
      <div className="absolute inset-0 z-0">
        
        {/* Video Overlay - Desktop Only (hidden for now) */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              controls={false}
              playsInline
              className="w-full h-full object-cover"
              style={{
                filter: 'brightness(1.1) contrast(1.05)',
                opacity: 0.85,
              }}
              preload="none"
            >
              <source 
                src="https://d2mtq6uknk7n3a.cloudfront.net/hero-video.mp4" 
                type="video/mp4" 
              />
            </video>
          </div>
        
        {/* Background Image - shown as fallback until video plays */}
        {/* {(!videoPlaying || isMobile) && (
          <>
            <div 
              className="absolute inset-0 block md:hidden" 
              style={{ zIndex: 1 }}
            >
              <Image
                src="/images/fall_hero_mobile.webp"
                alt="Luxury Properties in Dubai and Spain"
                fill
                style={{
                  filter: 'brightness(1.1) contrast(1.05)',
                  opacity: 0.85,
                  objectFit: 'cover',
                }}
                priority
                quality={75}
                sizes="100vw"
                loading="eager"
              />
            </div>
            <div 
              className="absolute inset-0 hidden md:block" 
              style={{ zIndex: 1 }}
            >
              <Image
                src="/images/fall_hero_desk.webp"
                alt="Luxury Properties Background"
                fill
                style={{
                  filter: 'brightness(1.1) contrast(1.05)',
                  opacity: 0.85,
                }}
                priority
                quality={75}
                sizes="100vw"
                loading="eager"
              />
            </div>
          </>
        )} */}

        {/* Optimized Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55"
          style={{ zIndex: 2 }}
        />
      </div>
      
      {/* Optimized Content Container */}
      <div 
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32"
        style={{ 
          zIndex: 20
        }}
      >
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12">
          
          {/* Hero Content - Optimized for LCP */}
          <div className="space-y-4 sm:space-y-6">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                lineHeight: '1.1'
              }}
            >
              <span className="block leading-tight">
                {isMounted ? (
                  <AutoTranslate translationKey="hero.title">
                    Luxury Real Estate in Dubai & Spain
                  </AutoTranslate>
                ) : (
                  'Luxury Real Estate in Dubai & Spain'
                )}
              </span>
            </h1>
            
            {/* <p 
              className="text-xl md:text-2xl text-white/95 font-medium max-w-3xl mx-auto"
              style={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                lineHeight: '1.4'
              }}
            >
              {isMounted ? (
                <AutoTranslate translationKey="hero.subtitle">
                  Realestate Agency | JVC, Dubai Marina & Marbella Properties
                </AutoTranslate>
              ) : (
                'Realestate Agency | JVC, Dubai Marina & Marbella Properties'
              )}
            </p> */}
          </div>

          {/* Simplified CTA Buttons - No animations */}
          <div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
            style={{ 
              minHeight: '56px'
            }}
          >
            <Link 
              href="/properties/spain"
              className="flex items-center gap-3 bg-[#D69F3F] hover:bg-[#C4903A] text-white px-6 sm:px-7 py-3 sm:py-3.5 font-semibold text-sm sm:text-base rounded-lg transition-colors duration-200 shadow-lg w-full sm:w-auto sm:min-w-[180px] justify-center"
              style={{ willChange: 'transform' }}
            >
             
                <Image 
                  src="/images/spain_flag.svg" 
                  alt="Spain Flag" 
                  width={28} 
                  height={18} 
                  className="flex-shrink-0"
                  quality={85}
                  sizes="28px"
                />
            
              <span className="font-semibold">
                {isMounted ? (
                  <AutoTranslate translationKey="hero.enterSpain">
                    Enter Spain
                  </AutoTranslate>
                ) : (
                  'Enter Spain'
                )}
              </span>
            </Link>
            
            <Link 
              href="/properties/dubai"
              className="flex items-center gap-3 bg-[#D69F3F] hover:bg-[#C4903A] text-white px-6 sm:px-7 py-3 sm:py-3.5 font-semibold text-sm sm:text-base rounded-lg transition-colors duration-200 shadow-lg w-full sm:w-auto sm:min-w-[180px] justify-center"
              style={{ willChange: 'transform' }}
            >
              <div className="w-7 h-5 overflow-hidden rounded border border-white/50 flex flex-shrink-0">
                <div className="w-1/4 bg-red-600 flex-shrink-0"></div>
                <div className="w-3/4 flex flex-col">
                  <div className="h-1/3 bg-green-600"></div>
                  <div className="h-1/3 bg-white"></div>
                  <div className="h-1/3 bg-black"></div>
                </div>
              </div>
              <span className="font-semibold">
                {isMounted ? (
                  <AutoTranslate translationKey="hero.enterUAE">
                    Enter Dubai
                  </AutoTranslate>
                ) : (
                  'Enter Dubai'
                )}
              </span>
            </Link>

            <Link 
              href="/properties/international"
              className="flex items-center gap-3 bg-[#D69F3F] hover:bg-[#C4903A] text-white px-6 sm:px-7 py-3 sm:py-3.5 font-semibold text-sm sm:text-base rounded-lg transition-colors duration-200 shadow-lg w-full sm:w-auto sm:min-w-[180px] justify-center"
              style={{ willChange: 'transform' }}
            >
              <Image 
                src="/images/int.png" 
                alt="International Icon" 
                width={28} 
                height={18} 
                className="flex-shrink-0"
                quality={85}
                sizes="28px"
              />
              <span className="font-semibold">
                {isMounted ? (
                  <AutoTranslate translationKey="hero.enterInternational">
                    Enter International
                  </AutoTranslate>
                ) : (
                  'Enter International'
                )}
              </span>
            </Link>
          </div>


          {/* Search Filter - Always visible to prevent layout shift */}
          <div 
            className="px-4 sm:px-6 lg:px-4 mt-8"
          >
            <Suspense fallback={<SearchPlaceholder />}>
              <PropertySearchFilter />
            </Suspense>
          </div>
          
        </div>
      </div>
      
    </section>
  );
};

// Add display name for debugging
HeroSection.displayName = 'HeroSection';

export default HeroSection;