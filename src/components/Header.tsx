import  { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LanguageSwitcher from './LanguageSwitcher';
import AutoTranslate from './AutoTranslate';
import { useSearch } from '../context/SearchContext';
import ServerOutageBanner from './ServerOutageBanner';


// Helper component for a desktop nav link
const DesktopNavLink = ({ href, navKey, label, isActive, textClass, hoverClass, fontClass, isWhiteHeaderPage, isScrolled, target }: {
  href: string; navKey: string; label: string; isActive: boolean;
  textClass: string; hoverClass: string; fontClass: string;
  isWhiteHeaderPage: boolean; isScrolled: boolean; target?: string;
}) => (
  <Link
    href={href}
    target={target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    className={`relative px-2 lg:px-3 xl:px-6 py-3 text-[10px] lg:text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 group whitespace-nowrap ${
      isActive ? 'text-[#D69F3F]' : `${textClass} ${hoverClass} ${fontClass}`
    }`}
    style={isWhiteHeaderPage && !isScrolled && !isActive ? { textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)' } : {}}
  >
    <AutoTranslate
      as="span"
      className="relative z-10 uppercase tracking-wider text-[10px] lg:text-xs font-semibold"
      translationKey={`nav.${navKey}`}
    >
      {label}
    </AutoTranslate>
    {isActive && (
      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] rounded-full"></span>
    )}
  </Link>
);

// Helper component for a mobile nav link
const MobileNavLink = ({ href, navKey, label, isActive, onClick, target }: {
  href: string; navKey: string; label: string; isActive: boolean; onClick: () => void; target?: string;
}) => (
  <Link
    href={href}
    target={target}
    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    className={`flex items-center px-3 xs:px-4 py-3 xs:py-4 text-xs xs:text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
      isActive
        ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent'
        : 'text-gray-800 hover:text-[#D69F3F] hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    {isActive && (
      <span className="w-1 h-4 bg-gradient-to-b from-[#D69F3F] to-[#C4903A] mr-3 rounded-full"></span>
    )}
    <AutoTranslate
      as="span"
      className="uppercase tracking-wider text-xs font-semibold"
      translationKey={`nav.${navKey}`}
    >
      {label}
    </AutoTranslate>
  </Link>
);


// Interactive header with full functionality
const InteractiveHeader = memo(({ headerBg }: { headerBg?: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const { openSearch, closeSearch } = useSearch();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Extract text, hover, font, and logo color classes from headerBg if present
  const textColorMatch = headerBg?.match(/text-[^ ]+/);
  const hoverColorMatch = headerBg?.match(/hover:text-[^ ]+/);
  const fontWeightMatch = headerBg?.match(/font-[^ ]+/);
  const whiteHeaderPages = ['/', '/about', '/sell', '/blog', '/contact', '/dubai-real-estate-services'];
  const isWhiteHeaderPage = whiteHeaderPages.includes(router.pathname);
  // Dynamic text color: white header pages: white default, black on scroll. All other pages: always black
  const textClass = isWhiteHeaderPage
    ? (isScrolled ? 'text-gray-900' : 'text-white')
    : (textColorMatch ? textColorMatch[0] : 'text-gray-900');
  const hoverClass = hoverColorMatch ? hoverColorMatch[0] : 'hover:text-[#D69F3F]';
  const fontClass = fontWeightMatch ? fontWeightMatch[0] : '';

  // Shared props for desktop nav links
  const navProps = { textClass, hoverClass, fontClass, isWhiteHeaderPage, isScrolled };

  // Close mobile menu helper
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileActiveDropdown(null);
  };

  // Handle scroll effect with throttling for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Use passive listeners for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside using ref-based detection
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setIsMenuOpen(false);
        setActiveDropdown(null);
        setMobileActiveDropdown(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change with null check
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
      setActiveDropdown(null);
      setMobileActiveDropdown(null);
      closeSearch();
    };
    
    if (router.events) {
      router.events.on('routeChangeStart', handleRouteChange);
      return () => router.events.off('routeChangeStart', handleRouteChange);
    }
  }, [router.events, closeSearch]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  // Active state helpers
  const isActivePath = (path: string) => router.pathname === path;
  const isPropertiesActive = router.pathname.startsWith('/properties');
  const isOffPlanActive = router.pathname === '/properties/dubai/off-plan' || router.pathname === '/properties/spain/off-plan' || router.pathname === '/properties/off-plan' || router.pathname === '/properties/international/off-plan';
  const isBuyActive = router.pathname === '/properties/dubai/buy' || router.pathname === '/properties/spain/ready-to-move' || router.pathname === '/properties/ready-to-move' || router.pathname === '/properties/international/buy';
  const isCommercialActive = router.pathname === '/properties/dubai/commercial' || router.pathname === '/properties/spain/commercial' || router.pathname === '/properties/commercial' || router.pathname === '/properties/international/commercial';

  return (
    <>
    <ServerOutageBanner headerHeight={isScrolled ? '5rem' : '6rem'} />

      <header 
        ref={headerRef}
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? `h-20 ${headerBg || 'bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200/50'}`
            : `h-24 ${headerBg || 'bg-transparent'}`
        }`}
        role="banner"
        style={{
          top: 'var(--outage-banner-height, 0px)',
          minHeight: '5rem',
          willChange: 'background-color, height',
        }}
      >
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex justify-between items-center h-full transition-all duration-500">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-full">
            <Link href="/" className="flex items-center group" aria-label="Rino Properties Home">
              <div className="relative overflow-visible p-2">
                <Image
                  src={isWhiteHeaderPage && !isScrolled
                    ? "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043206/RINO-PROPERTIES-WHITE.webp"
                    : "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png"
                  }
                  alt="Rino Properties"
                  width={125}
                  height={30}
                  className="transition-all duration-500 h-15 w-40 group-hover:scale-105"
                
                  loading="eager"
                  fetchPriority="high"
                  quality={85}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center h-full">

            {/* Home */}
            <DesktopNavLink href="/" navKey="home" label="Home" isActive={isActivePath('/')} {...navProps} />

              <>
                {/* Off-Plan Dropdown */}
                <div className="relative group">
                  <div 
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeoutRef.current) {
                        clearTimeout(dropdownTimeoutRef.current);
                        dropdownTimeoutRef.current = null;
                      }
                      setActiveDropdown('offPlan');
                    }}
                    onMouseLeave={() => {
                      dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'offPlan' ? null : 'offPlan');
                      }}
                      className={`flex items-center px-2 lg:px-3 xl:px-6 py-3 text-[10px] lg:text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 group relative whitespace-nowrap ${
                        isOffPlanActive ? 'text-[#D69F3F]' : `${textClass} ${hoverClass} ${fontClass}`
                      }`}
                      style={isWhiteHeaderPage && !isScrolled && !isOffPlanActive ? { textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)' } : {}}
                    >
                      <AutoTranslate 
                        as="span" 
                        className="relative z-10 uppercase tracking-wider text-[10px] lg:text-xs font-semibold"
                        translationKey="nav.offPlan"
                      >
                        Off-Plan
                      </AutoTranslate>
                      <svg 
                        className={`ml-2 h-3 w-3 transition-transform duration-300 relative z-10 ${activeDropdown === 'offPlan' ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      {isOffPlanActive && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] rounded-full"></span>
                      )}
                    </button>
                    <div className="absolute top-full left-0 w-full h-2" />
                    <div className={`absolute top-full left-0 pt-2 w-56 transition-all duration-300 ${
                      activeDropdown === 'offPlan' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="bg-white/98 backdrop-blur-xl border border-gray-200/30 overflow-hidden shadow-lg">
                        <div className="py-2">
                          <Link
                            href="/properties/spain/off-plan"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group ${
                              isActivePath('/properties/spain/off-plan') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🇪🇸</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.spainProperties">Spain Properties</AutoTranslate>
                          </Link>
                          <Link
                            href="/properties/dubai/off-plan"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group border-t border-gray-100/60 ${
                              isActivePath('/properties/dubai/off-plan') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🇦🇪</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.dubaiProperties">Dubai Properties</AutoTranslate>
                          </Link>
                          <Link
                            href="/properties/international/off-plan"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group border-t border-gray-100/60 ${
                              isActivePath('/properties/international/off-plan') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🌍</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.internationalProperties">International Properties</AutoTranslate>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy Dropdown */}
                <div className="relative group">
                  <div 
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeoutRef.current) {
                        clearTimeout(dropdownTimeoutRef.current);
                        dropdownTimeoutRef.current = null;
                      }
                      setActiveDropdown('buy');
                    }}
                    onMouseLeave={() => {
                      dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'buy' ? null : 'buy');
                      }}
                      className={`flex items-center px-2 lg:px-3 xl:px-6 py-3 text-[10px] lg:text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 group relative whitespace-nowrap ${
                        isBuyActive ? 'text-[#D69F3F]' : `${textClass} ${hoverClass} ${fontClass}`
                      }`}
                      style={isWhiteHeaderPage && !isScrolled && !isBuyActive ? { textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)' } : {}}
                    >
                      <AutoTranslate 
                        as="span" 
                        className="relative z-10 uppercase tracking-wider text-[10px] lg:text-xs font-semibold"
                        translationKey="nav.buy"
                      >
                        Buy
                      </AutoTranslate>
                      <svg 
                        className={`ml-2 h-3 w-3 transition-transform duration-300 relative z-10 ${activeDropdown === 'buy' ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      {isBuyActive && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] rounded-full"></span>
                      )}
                    </button>
                    <div className="absolute top-full left-0 w-full h-2" />
                    <div className={`absolute top-full left-0 pt-2 w-56 transition-all duration-300 ${
                      activeDropdown === 'buy' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="bg-white/98 backdrop-blur-xl border border-gray-200/30 overflow-hidden shadow-lg">
                        <div className="py-2">
                          <Link
                            href="/properties/spain/ready-to-move"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group ${
                              isActivePath('/properties/spain/ready-to-move') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🇪🇸</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.spainProperties">Spain Properties</AutoTranslate>
                          </Link>
                          <Link
                            href="/properties/dubai/buy"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group border-t border-gray-100/60 ${
                              isActivePath('/properties/dubai/buy') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🇦🇪</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.dubaiProperties">Dubai Properties</AutoTranslate>
                          </Link>
                          <Link
                            href="/properties/international/buy"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group border-t border-gray-100/60 ${
                              isActivePath('/properties/international/buy') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🌍</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.internationalProperties">International Properties</AutoTranslate>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commercial Dropdown */}
                <div className="relative group">
                  <div 
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeoutRef.current) {
                        clearTimeout(dropdownTimeoutRef.current);
                        dropdownTimeoutRef.current = null;
                      }
                      setActiveDropdown('commercial');
                    }}
                    onMouseLeave={() => {
                      dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 300);
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'commercial' ? null : 'commercial');
                      }}
                      className={`flex items-center px-2 lg:px-3 xl:px-6 py-3 text-[10px] lg:text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 group relative whitespace-nowrap ${
                        isCommercialActive ? 'text-[#D69F3F]' : `${textClass} ${hoverClass} ${fontClass}`
                      }`}
                      style={isWhiteHeaderPage && !isScrolled && !isCommercialActive ? { textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)' } : {}}
                    >
                      <AutoTranslate 
                        as="span" 
                        className="relative z-10 uppercase tracking-wider text-[10px] lg:text-xs font-semibold"
                        translationKey="nav.commercial"
                      >
                        Commercial
                      </AutoTranslate>
                      <svg 
                        className={`ml-2 h-3 w-3 transition-transform duration-300 relative z-10 ${activeDropdown === 'commercial' ? 'rotate-180' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      {isCommercialActive && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] rounded-full"></span>
                      )}
                    </button>
                    <div className="absolute top-full left-0 w-full h-2" />
                    <div className={`absolute top-full left-0 pt-2 w-56 transition-all duration-300 ${
                      activeDropdown === 'commercial' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="bg-white/98 backdrop-blur-xl border border-gray-200/30 overflow-hidden shadow-lg">
                        <div className="py-2">
                          <Link
                            href="/properties/spain/commercial"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group ${
                              isActivePath('/properties/spain/commercial') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🇪🇸</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.spainProperties">Spain Properties</AutoTranslate>
                          </Link>
                          <Link
                            href="/properties/dubai/commercial"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group border-t border-gray-100/60 ${
                              isActivePath('/properties/dubai/commercial') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🇦🇪</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.dubaiProperties">Dubai Properties</AutoTranslate>
                          </Link>
                          <Link
                            href="/properties/international/commercial"
                            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-300 relative group border-t border-gray-100/60 ${
                              isActivePath('/properties/international/commercial') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50/80'
                            }`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span className="text-base mr-4 opacity-80">🌍</span>
                            <AutoTranslate as="span" className="relative z-10 tracking-wide font-medium" translationKey="nav.internationalProperties">International Properties</AutoTranslate>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DesktopNavLink href="/sell" navKey="sell" label="Sell" isActive={isActivePath('/sell')} {...navProps} target="_blank" />
                <DesktopNavLink href="/about" navKey="about" label="About" isActive={isActivePath('/about')} {...navProps} />
                <DesktopNavLink href="/blog" navKey="blog" label="Insights" isActive={isActivePath('/blog')} {...navProps} />
                <DesktopNavLink href="/contact" navKey="contact" label="Contact" isActive={isActivePath('/contact')} {...navProps} />
              </>

          </nav>

          {/* Search & CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 h-full">
            {/* Language Switcher */}
            <div className="mr-2">
              <LanguageSwitcher />
            </div>
            
            {/* Search Button */}
            <button
              onClick={() => openSearch()}
              className={`relative group p-3 rounded-lg transition-all duration-300 ${
                isWhiteHeaderPage && !isScrolled
                  ? 'hover:bg-white/20 text-white hover:text-[#D69F3F]'
                  : 'hover:bg-gray-100 text-gray-900 hover:text-[#D69F3F]'
              }`}
              style={isWhiteHeaderPage && !isScrolled ? { textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)' } : {}}
              aria-label="Search properties (Ctrl+K)"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Agents Button */}
            <Link
              href="/agents"
              className="relative group bg-red-600 hover:bg-red-700 text-white px-3 lg:px-4 xl:px-6 py-2 lg:py-2.5 xl:py-3 text-[10px] lg:text-xs xl:text-sm font-semibold tracking-wider uppercase transition-all duration-500 shadow-lg hover:scale-105 overflow-hidden whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center">
                <AutoTranslate translationKey="common.findAgent">Agents</AutoTranslate>
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute top-0 left-0 w-0 h-full bg-white/10 group-hover:w-full transition-all duration-700 ease-out"></span>
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="lg:hidden flex items-center space-x-2 h-full">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Mobile Search Button */}
            <button
              onClick={() => openSearch()}
              className={`relative p-3 rounded-lg transition-all duration-300 ${
                isWhiteHeaderPage && !isScrolled
                  ? 'text-white hover:text-gray-200 hover:bg-white/20'
                  : 'text-gray-900 hover:text-[#D69F3F] hover:bg-gray-100/50'
              }`}
              style={isWhiteHeaderPage && !isScrolled ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' } : {}}
              aria-label="Search properties"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`relative p-3 rounded-lg transition-all duration-300 ${
                isWhiteHeaderPage && !isScrolled
                  ? 'text-white hover:text-gray-200 hover:bg-white/20'
                  : 'text-gray-900 hover:text-[#D69F3F] hover:bg-gray-100/50'
              }`}
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute block w-6 h-1 rounded-full transform transition-all duration-300 ${
                  isWhiteHeaderPage && !isScrolled ? 'bg-white' : 'bg-gray-900'
                } ${
                  isMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
                }`} style={isWhiteHeaderPage && !isScrolled ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' } : {}}></span>
                <span className={`absolute block w-6 h-1 rounded-full transform transition-all duration-300 top-2.5 ${
                  isWhiteHeaderPage && !isScrolled ? 'bg-white' : 'bg-gray-900'
                } ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`} style={isWhiteHeaderPage && !isScrolled ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' } : {}}></span>
                <span className={`absolute block w-6 h-1 rounded-full transform transition-all duration-300 ${
                  isWhiteHeaderPage && !isScrolled ? 'bg-white' : 'bg-gray-900'
                } ${
                  isMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                }`} style={isWhiteHeaderPage && !isScrolled ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' } : {}}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-6 pb-8 space-y-1 bg-white backdrop-blur-xl border-t border-gray-200/50 shadow-lg">

            {/* Home */}
            <MobileNavLink href="/" navKey="home" label="Home" isActive={isActivePath('/')} onClick={closeMobileMenu} />

              <>
                {/* Off-Plan dropdown (mobile) */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileActiveDropdown(mobileActiveDropdown === 'offPlan' ? null : 'offPlan');
                    }}
                    className={`w-full flex items-center justify-between px-3 xs:px-4 py-3 xs:py-4 text-xs xs:text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
                      isOffPlanActive
                        ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent'
                        : 'text-gray-800 hover:text-[#D69F3F] hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center uppercase tracking-wider text-xs font-semibold">
                      {isOffPlanActive && (
                        <span className="w-1 h-4 bg-gradient-to-b from-[#D69F3F] to-[#C4903A] mr-3 rounded-full"></span>
                      )}
                      <AutoTranslate translationKey="nav.offPlan">Off-Plan</AutoTranslate>
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${mobileActiveDropdown === 'offPlan' ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${mobileActiveDropdown === 'offPlan' ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-6 space-y-1">
                      <Link href="/properties/spain/off-plan" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/spain/off-plan') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🇪🇸</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.spainProperties">Spain Properties</AutoTranslate>
                      </Link>
                      <Link href="/properties/dubai/off-plan" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/dubai/off-plan') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🇦🇪</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.dubaiProperties">Dubai Properties</AutoTranslate>
                      </Link>
                      <Link href="/properties/international/off-plan" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/international/off-plan') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🌍</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.internationalProperties">International Properties</AutoTranslate>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Buy dropdown (mobile) */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileActiveDropdown(mobileActiveDropdown === 'buy' ? null : 'buy');
                    }}
                    className={`w-full flex items-center justify-between px-3 xs:px-4 py-3 xs:py-4 text-xs xs:text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
                      isBuyActive
                        ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent'
                        : 'text-gray-800 hover:text-[#D69F3F] hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center uppercase tracking-wider text-xs font-semibold">
                      {isBuyActive && (
                        <span className="w-1 h-4 bg-gradient-to-b from-[#D69F3F] to-[#C4903A] mr-3 rounded-full"></span>
                      )}
                      <AutoTranslate translationKey="nav.buy">Buy</AutoTranslate>
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${mobileActiveDropdown === 'buy' ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${mobileActiveDropdown === 'buy' ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-6 space-y-1">
                      <Link href="/properties/spain/ready-to-move" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/spain/ready-to-move') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🇪🇸</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.spainProperties">Spain Properties</AutoTranslate>
                      </Link>
                      <Link href="/properties/dubai/buy" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/dubai/buy') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🇦🇪</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.dubaiProperties">Dubai Properties</AutoTranslate>
                      </Link>
                      <Link href="/properties/international/buy" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/international/buy') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🌍</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.internationalProperties">International Properties</AutoTranslate>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Commercial dropdown (mobile) */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileActiveDropdown(mobileActiveDropdown === 'commercial' ? null : 'commercial');
                    }}
                    className={`w-full flex items-center justify-between px-3 xs:px-4 py-3 xs:py-4 text-xs xs:text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
                      isCommercialActive
                        ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent'
                        : 'text-gray-800 hover:text-[#D69F3F] hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center uppercase tracking-wider text-xs font-semibold">
                      {isCommercialActive && (
                        <span className="w-1 h-4 bg-gradient-to-b from-[#D69F3F] to-[#C4903A] mr-3 rounded-full"></span>
                      )}
                      <AutoTranslate translationKey="nav.commercial">Commercial</AutoTranslate>
                    </span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${mobileActiveDropdown === 'commercial' ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${mobileActiveDropdown === 'commercial' ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-6 space-y-1">
                      <Link href="/properties/spain/commercial" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/spain/commercial') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🇪🇸</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.spainProperties">Spain Properties</AutoTranslate>
                      </Link>
                      <Link href="/properties/dubai/commercial" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/dubai/commercial') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🇦🇪</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.dubaiProperties">Dubai Properties</AutoTranslate>
                      </Link>
                      <Link href="/properties/international/commercial" className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActivePath('/properties/international/commercial') ? 'text-[#D69F3F] bg-gradient-to-r from-[#D69F3F]/8 to-transparent' : 'text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50'
                      }`} onClick={closeMobileMenu}>
                        <span className="text-sm mr-3 opacity-80">🌍</span>
                        <AutoTranslate as="span" className="tracking-wide" translationKey="nav.internationalProperties">International Properties</AutoTranslate>
                      </Link>
                    </div>
                  </div>
                </div>

                <MobileNavLink href="/sell" navKey="sell" label="Sell" isActive={isActivePath('/sell')} onClick={closeMobileMenu} target="_blank" />
                <MobileNavLink href="/about" navKey="about" label="About" isActive={isActivePath('/about')} onClick={closeMobileMenu} />
                <MobileNavLink href="/blog" navKey="blog" label="Insights" isActive={isActivePath('/blog')} onClick={closeMobileMenu} />
                <MobileNavLink href="/contact" navKey="contact" label="Contact" isActive={isActivePath('/contact')} onClick={closeMobileMenu} />
              </>

            {/* Mobile CTA buttons */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => {
                  openSearch();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 xs:px-6 py-3 xs:py-4 text-xs xs:text-sm font-semibold tracking-wider uppercase bg-white border-2 border-[#D69F3F] text-[#D69F3F] hover:bg-[#D69F3F] hover:text-white text-center shadow-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <AutoTranslate as="span" translationKey="common.searchProperties">Search Properties</AutoTranslate>
              </button>
              <Link
                href="/agents"
                className="block px-4 xs:px-6 py-3 xs:py-4 text-xs xs:text-sm font-semibold tracking-wider uppercase bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#B8852F] text-white text-center shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <AutoTranslate translationKey="common.findAgent">Agents</AutoTranslate>
              </Link>
            </div>
          </div>
        </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-[-1]"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      </div>
    </header>
    </>
  );
});

InteractiveHeader.displayName = 'Header';

export default InteractiveHeader;