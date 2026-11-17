import React from 'react';

interface CTASectionProps {
  tTasmeer: (key: string, fallback: string) => string;
  onOpenContactPopup: (formType: string) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ tTasmeer, onOpenContactPopup }) => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#2C4A43] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight mb-4" style={{fontFamily: 'Montserrat, sans-serif'}}>
          {tTasmeer('cta.title', "Don't Miss This Limited Opportunity")}
        </h2>
        
        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 md:mb-10 font-light">
          {tTasmeer('cta.subtitle', 'Over 50% sold. Secure your preferred unit today.')}
        </p>
        
        {/* CTA Button */}
        <button
          onClick={() => onOpenContactPopup('getDetails')}
          className="inline-block px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-semibold !rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          style={{ backgroundColor: 'rgba(198,244,180,.92)', color: '#2C3E35' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(198,244,180,1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(198,244,180,.92)'}
        >
          {tTasmeer('cta.button', 'Download Brochure & See Floor Plans')}
        </button>
      </div>
    </section>
  );
};

export default CTASection;
