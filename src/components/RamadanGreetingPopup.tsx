import React, { useState, useEffect } from 'react';
import AutoTranslate from './AutoTranslate';

const RamadanGreetingPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('ramadanGreetingSeen');
    
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
      sessionStorage.setItem('ramadanGreetingSeen', 'true');
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
        <div className="relative w-[90vw] max-w-lg bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-500/30">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>
          
          {/* Stars decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-300 opacity-50 animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  fontSize: `${10 + Math.random() * 10}px`,
                }}
              >
                ⭐
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
              className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Card content */}
          <div className="relative p-8 text-center">
            {/* Ramadan icons */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-5xl animate-swing">🌙</span>
              <span className="text-6xl animate-bounce-slow">🕌</span>
              <span className="text-5xl animate-swing" style={{ animationDelay: '0.5s' }}>⭐</span>
            </div>

            {/* Main greeting */}
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 mb-4 animate-pulse">
              <AutoTranslate translationKey="ramadan.popup.title">
                Ramadan Kareem!
              </AutoTranslate>
            </h2>

            {/* Message */}
            <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
              <AutoTranslate translationKey="ramadan.popup.message">
                May this blessed month bring you peace, prosperity, and countless blessings. Ramadan Mubarak from the Rino Properties family!
              </AutoTranslate>
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl">✨</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              <span className="text-2xl">🌙</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
              <span className="text-2xl">✨</span>
            </div>

            {/* Company branding */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <AutoTranslate translationKey="ramadan.popup.from">
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
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <AutoTranslate translationKey="ramadan.popup.explore">
                Explore Our Properties 🏡
              </AutoTranslate>
            </button>

            {/* Bottom decoration */}
            <div className="mt-6 flex justify-center gap-3 text-3xl">
              <span className="animate-pulse" style={{ animationDelay: '0s' }}>🌙</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>⭐</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>🕌</span>
              <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>✨</span>
              <span className="animate-pulse" style={{ animationDelay: '0.8s' }}>🌙</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes swing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .animate-swing {
          animation: swing 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default RamadanGreetingPopup;
