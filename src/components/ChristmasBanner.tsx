import React, { useState, useEffect } from 'react';
import AutoTranslate from './AutoTranslate';

interface Snowflake {
  left: number;
  animationDelay: number;
  animationDuration: number;
  fontSize: number;
}

const ChristmasBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Add animation on mount
    setAnimate(true);
    // Generate snowflakes on client-side only
    setSnowflakes(
      Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: 5 + Math.random() * 5,
        fontSize: 10 + Math.random() * 10,
      }))
    );
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-3 px-4 relative overflow-hidden">
      {/* Animated snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowflakes.map((flake, i) => (
          <div
            key={i}
            className="absolute text-white opacity-70 animate-snowfall"
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.animationDelay}s`,
              animationDuration: `${flake.animationDuration}s`,
              fontSize: `${flake.fontSize}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative z-10">
        <span className={`text-2xl transform transition-transform duration-700 ${animate ? 'rotate-12' : ''}`}>
          🎄
        </span>
        <div className="text-center">
          <p className="text-sm md:text-lg font-bold tracking-wide">
            <AutoTranslate translationKey="christmas.greeting">
              🎅 Merry Christmas & Happy Holidays! 🎁
            </AutoTranslate>
          </p>
          <p className="text-xs md:text-sm opacity-90 hidden md:block">
            <AutoTranslate translationKey="christmas.message">
              Wishing you joy, peace, and prosperity this festive season
            </AutoTranslate>
          </p>
        </div>
        <span className={`text-2xl transform transition-transform duration-700 ${animate ? '-rotate-12' : ''}`}>
          ⭐
        </span>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
          aria-label="Close banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            top: -10%;
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ChristmasBanner;
