import React, { useState, useEffect } from 'react';
import AutoTranslate from './AutoTranslate';

const ChristmasGreetingPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('christmasGreetingSeen');
    
    if (!hasSeenPopup) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('christmasGreetingSeen', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Popup Card */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <div className="relative w-[90vw] max-w-lg bg-gradient-to-br from-red-50 via-white to-green-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-red-500/30">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-green-600 to-red-600"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 via-red-600 to-green-600"></div>
          
          {/* Snowflakes decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-blue-200 opacity-40 animate-snowfall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                  fontSize: `${8 + Math.random() * 8}px`,
                }}
              >
                ❄
              </div>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 group"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Card content */}
          <div className="relative p-8 text-center">
            {/* Christmas icons */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-5xl animate-swing">🎄</span>
              <span className="text-6xl animate-bounce-slow">🎅</span>
              <span className="text-5xl animate-swing" style={{ animationDelay: '0.5s' }}>⭐</span>
            </div>

            {/* Main greeting */}
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-red-600 mb-4 animate-pulse">
              <AutoTranslate translationKey="christmas.popup.title">
                Merry Christmas!
              </AutoTranslate>
            </h2>

            {/* Message */}
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              <AutoTranslate translationKey="christmas.popup.message">
                May this festive season bring you joy, peace, and prosperity. Thank you for being part of the Rino Properties family!
              </AutoTranslate>
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl">✨</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
              <span className="text-2xl">🎁</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
              <span className="text-2xl">✨</span>
            </div>

            {/* Company branding */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <AutoTranslate translationKey="christmas.popup.from">
                  From all of us at
                </AutoTranslate>
              </p>
              <p className="text-2xl font-bold text-[#D69F3F]">
                Rino Properties
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <AutoTranslate translationKey="christmas.popup.explore">
                Explore Our Properties 🏡
              </AutoTranslate>
            </button>

            {/* Bottom decoration */}
            <div className="mt-6 flex justify-center gap-3 text-3xl">
              <span className="animate-pulse" style={{ animationDelay: '0s' }}>🎄</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>🎁</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>⭐</span>
              <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>🔔</span>
              <span className="animate-pulse" style={{ animationDelay: '0.8s' }}>🎄</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            top: -10%;
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }
        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </>
  );
};

export default ChristmasGreetingPopup;
