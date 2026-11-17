import { useState } from 'react';
import Link from 'next/link';

interface InvestmentTab {
  id: 'spain' | 'uae' | 'argentina';
  name: string;
  flag: string;
  description: string;
}

const WhyInvestSection = () => {
  const [activeTab, setActiveTab] = useState<'spain' | 'uae' | 'argentina'>('spain');
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  const investmentTabs: InvestmentTab[] = [
    {
      id: 'spain',
      name: 'Spain',
      flag: '🇪🇸',
      description: 'Discover the advantages of investing in one of Europe\'s most dynamic real estate markets'
    },
    {
      id: 'uae',
      name: 'UAE',
      flag: '🇦🇪',
      description: 'Explore opportunities in the Middle East\'s most prestigious and fastest-growing property market'
    },
    {
      id: 'argentina',
      name: 'Argentina',
      flag: '🇦🇷',
      description: 'Discover emerging investment opportunities in South America\'s most dynamic and culturally rich real estate market'
    }
  ];

  interface Benefit {
    icon: React.ReactElement;
    title: string;
    description: string;
    stats: string;
    color: string;
  }

  const benefitsData: Record<'spain' | 'uae' | 'argentina', Benefit[]> = {
    spain: [
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l1.09 3.26L16 8l-2.91 1.09L12 12l-1.09-3.26L8 8l2.91-1.09L12 3zM21 12l1.09 3.26L25 17l-2.91 1.09L21 21l-1.09-3.26L17 17l2.91-1.09L21 12z" />
          </svg>
        ),
        title: 'European Lifestyle',
        description: 'Mediterranean climate, rich culture, and world-class healthcare system make Spain an ideal destination.',
        stats: '300+ sunny days/year',
        color: 'from-gray-800 to-black'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        title: 'Strong ROI',
        description: 'Consistent rental yields and property appreciation with favorable tax benefits for international investors.',
        stats: '6-8% annual returns',
        color: 'from-[#D69F3F] to-[#C4903A]'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        title: 'Prime Locations',
        description: 'Access to coastal properties, historic cities, and modern developments in key Spanish markets.',
        stats: '5 major cities',
        color: 'from-[#D69F3F]-500 to-[#D69F3F]-500'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        ),
        title: 'EU Residency',
        description: 'Golden Visa program offering EU residency through property investment starting from €500K.',
        stats: 'EU Citizenship path',
        color: 'from-[#D69F3F]-600 to-[#D69F3F]-700'
      }
    ],
    uae: [
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        title: 'Tax-Free Investment',
        description: 'Zero capital gains tax, no rental income tax, and no property tax for maximum investment returns.',
        stats: '0% tax on profits',
        color: 'from-[#D69F3F]-500 to-[#D69F3F]-600'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        title: 'Rapid Growth',
        description: 'Fastest growing real estate market in the region with world-class infrastructure development.',
        stats: '15% annual growth',
        color: 'from-[#D69F3F]-500 to-[#D69F3F]-600'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        ),
        title: 'Global Hub',
        description: 'Strategic location connecting East and West with world-class business and tourism infrastructure.',
        stats: '200+ nationalities',
        color: 'from-[#D69F3F]-500 to-[#D69F3F]-500'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        title: 'Investor Protection',
        description: 'Strong legal framework, property ownership rights, and investor-friendly regulations.',
        stats: '100% foreign ownership',
        color: 'from-[#D69F3F]-600 to-[#D69F3F]-700'
      }
    ],
    argentina: [
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        title: 'Affordable Luxury',
        description: 'Premium properties at competitive prices compared to other global markets, with strong appreciation potential.',
        stats: 'USD-denominated deals',
        color: 'from-gray-800 to-black'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        title: 'Emerging Market',
        description: 'Rapidly growing real estate market with increasing foreign investment and urban development projects.',
        stats: '12% annual growth',
        color: 'from-[#D69F3F] to-[#C4903A]'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        title: 'Prime Destinations',
        description: 'Access to vibrant Buenos Aires neighborhoods, Mendoza wine country estates, and Patagonia retreats.',
        stats: '3 major regions',
        color: 'from-[#D69F3F]-500 to-[#D69F3F]-500'
      },
      {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        ),
        title: 'Cultural Richness',
        description: 'World-renowned culture, cuisine, and lifestyle with a welcoming environment for international investors.',
        stats: 'Top quality of life',
        color: 'from-[#D69F3F]-600 to-[#D69F3F]-700'
      }
    ]
  };

  interface MarketStat {
    label: string;
    value: string;
    icon: string;
  }

  interface MarketStats {
    spain: MarketStat[];
    uae: MarketStat[];
    argentina: MarketStat[];
  }

  const marketStats: MarketStats = {
    spain: [
      { label: 'Market Size', value: '€120B+', icon: '📊' },
      { label: 'Annual Growth', value: '8.5%', icon: '📈' },
      { label: 'Foreign Investment', value: '€15B', icon: '🌍' },
      { label: 'Rental Yield', value: '6-8%', icon: '💰' }
    ],
    uae: [
      { label: 'Market Size', value: 'AED 280B+', icon: '📊' },
      { label: 'Annual Growth', value: '15.2%', icon: '📈' },
      { label: 'Foreign Investment', value: 'AED 45B', icon: '🌍' },
      { label: 'Rental Yield', value: '7-12%', icon: '💰' }
    ],
    argentina: [
      { label: 'Market Size', value: 'USD 18B+', icon: '📊' },
      { label: 'Annual Growth', value: '12%', icon: '📈' },
      { label: 'Foreign Investment', value: 'USD 3B', icon: '🌍' },
      { label: 'Rental Yield', value: '5-9%', icon: '💰' }
    ]
  };

  const currentBenefits = benefitsData[activeTab];
  const currentStats = marketStats[activeTab];
  const currentTab = investmentTabs.find((tab: InvestmentTab) => tab.id === activeTab);

  return (
    <section className="relative py-14 overflow-hidden">
      {/* Background - Changed to light theme like FeaturedLocations */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#D69F3F]-50/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-[#D69F3F]-50/20 to-transparent"></div>

      {/* Decorative Elements */}
      {/* <div className="absolute top-20 left-20 w-64 h-64 bg-[#D69F3F]-500/5  blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#D69F3F]-500/5  blur-3xl"></div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-light text-black leading-tight tracking-wide mb-6">
            <span className="font-light text-gray-700">Why Invest with </span>
            <span className="font-light text-[#D69F3F]">RINO Properties?</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {currentTab?.description}
          </p>
        </div>

        {/* Country Tabs */}
        <div className="flex justify-center gap-4 mb-16">
          {investmentTabs.map((tab: InvestmentTab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#D69F3F]-600 to-[#D69F3F]-700 text-white  shadow-[#D69F3F]-500/25'
                  : 'bg-white hover:bg-[#D69F3F]-50 text-gray-700 hover:text-[#D69F3F]-600 border border-gray-200 hover:border-[#D69F3F]-300'
              }`}
            >
              <span className="text-2xl">{tab.flag}</span>
              <span>Invest in {tab.name}</span>
            </button>
          ))}
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {currentStats.map((stat: MarketStat, index: number) => (
            <div 
              key={index} 
              className="bg-white  p-6 text-center border border-gray-100 shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[#D69F3F]-600 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {currentBenefits.map((benefit: typeof currentBenefits[0], index: number) => (
            <div 
              key={index}
              className="group bg-white  p-8 border border-gray-100 shadow-lg hover: transition-all duration-500 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredBenefit(index)}
              onMouseLeave={() => setHoveredBenefit(null)}
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color}  flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white`}>
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#D69F3F]-600 transition-colors duration-300">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {benefit.description}
              </p>

              {/* Stats Badge */}
              <div className="inline-flex items-center bg-gradient-to-r from-[#D69F3F]-500/10 to-[#D69F3F]-500/10  px-4 py-2 border border-[#D69F3F]-200/50">
                <span className="text-[#D69F3F]-700 text-sm font-semibold">{benefit.stats}</span>
              </div>

              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-[#D69F3F]-500/5 to-[#D69F3F]-500/5  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="bg-white  p-8 lg:p-12 border border-gray-100 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Start Your Investment Journey?
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our expert team provides comprehensive support from property selection to final purchase, 
                ensuring your investment aligns with your financial goals and lifestyle preferences.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Personalized investment consultation',
                  'Market analysis and property recommendations',
                  'Legal and financial guidance',
                  'After-sales support and property management'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#D69F3F]-500 "></div>
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/consultation"
                  className="group relative bg-gradient-to-r from-[#D69F3F]-600 to-[#D69F3F]-700 hover:from-[#D69F3F]-700 hover:to-[#D69F3F]-800 text-white px-8 py-4  font-semibold text-lg transition-all duration-300  hover: transform hover:scale-105 overflow-hidden text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Book Free Consultation
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 "></span>
                </Link>
                
                <Link 
                  href="/properties/dubai"
                  className="group relative bg-white hover:bg-gray-50 text-[#D69F3F]-600 px-8 py-4  font-semibold text-lg transition-all duration-300 border-2 border-[#D69F3F]-600 hover:border-[#D69F3F]-700 transform hover:scale-105 text-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    Browse Properties
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#D69F3F]-50 to-[#D69F3F]-50  p-8 border border-[#D69F3F]-200/50">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Investment Calculator</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Investment Amount</label>
                    <div className="bg-white  p-3 border border-gray-200">
                      <span className="text-gray-900 font-semibold">€500,000 - €2,000,000</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">Expected Annual Return</label>
                    <div className="bg-white  p-3 border border-gray-200">
                      <span className="text-green-600 font-semibold">
                        {activeTab === 'spain' ? '6-8%' : activeTab === 'argentina' ? '5-9%' : '7-12%'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">5-Year Projection</label>
                    <div className="bg-gradient-to-r from-green-50 to-green-100  p-3 border border-green-200">
                      <span className="text-green-600 font-bold text-lg">
                        {activeTab === 'spain' ? '+40-60%' : activeTab === 'argentina' ? '+35-55%' : '+50-80%'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default WhyInvestSection;