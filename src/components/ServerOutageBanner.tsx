import React, { useState, useEffect, useRef } from 'react';

interface ServerOutageBannerProps {
  headerHeight: string;
}

const ServerOutageBanner: React.FC<ServerOutageBannerProps> = ({ headerHeight }) => {
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      document.documentElement.style.setProperty('--outage-banner-height', '0px');
      return;
    }
    const updateHeight = () => {
      if (bannerRef.current) {
        document.documentElement.style.setProperty('--outage-banner-height', `${bannerRef.current.offsetHeight}px`);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-red-700 text-white py-2 px-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 relative">
        <span className="text-sm flex-shrink-0">⚠️</span>
        <p className="text-xs md:text-sm text-center">
          Some Property images are temporarily unavailable due current aws server issue. For details, contact us: 
          <a href="mailto:ask@rinoproperties.com" className="underline font-medium ml-1">ask@rinoproperties.com</a>
          <span className="mx-1">|</span>
          <a href="tel:+97143212433" className="underline font-medium">+971 43 21 2433</a>
        </p>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 text-white/80 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServerOutageBanner;
