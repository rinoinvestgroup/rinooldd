import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useValuation } from '@/context/ValuationContext';

const ServiceAreasPage = () => {
  const [selectedArea, setSelectedArea] = useState('Downtown Dubai');
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openValuationPopup } = useValuation();

  const premiumAreas = [
    {
      name: 'Downtown Dubai',
      description: 'The heart of modern Dubai, featuring iconic landmarks like Burj Khalifa and Dubai Mall.',
      averagePrice: 'AED 1,200 - 2,500 per sq ft',
      propertyTypes: ['Luxury Apartments', 'Penthouses', 'Studio Apartments'],
      highlights: ['Burj Khalifa Views', 'Premium Amenities', 'Central Location', 'High ROI'],
      image: '/images/location.webp',
      marketTrends: '+12% YoY growth',
      popularDevelopments: ['Burj Khalifa', 'The Address Downtown', 'Boulevard Heights', 'Standpoint Towers']
    },
    {
      name: 'Dubai Marina',
      description: 'Waterfront living with stunning marina views and a vibrant nightlife scene.',
      averagePrice: 'AED 1,000 - 2,200 per sq ft',
      propertyTypes: ['Marina Apartments', 'Penthouses', 'Townhouses'],
      highlights: ['Marina Views', 'Beach Access', 'Dining & Entertainment', 'Yacht Club'],
      image: '/images/location.webp',
      marketTrends: '+15% YoY growth',
      popularDevelopments: ['Marina Gate', 'Cayan Tower', 'Princess Tower', 'Elite Residence']
    },
    {
      name: 'Palm Jumeirah',
      description: 'Exclusive island living with private beaches and luxury resorts.',
      averagePrice: 'AED 1,500 - 4,000 per sq ft',
      propertyTypes: ['Luxury Villas', 'Beachfront Apartments', 'Penthouses'],
      highlights: ['Private Beach', 'Exclusive Community', 'Resort Lifestyle', 'Investment Potential'],
      image: '/images/location.webp',
      marketTrends: '+18% YoY growth',
      popularDevelopments: ['Atlantis Residences', 'One Palm', 'Golden Mile', 'Tiara Residences']
    },
    {
      name: 'Business Bay',
      description: 'Dubai\'s business district with modern skyscrapers and canal views.',
      averagePrice: 'AED 900 - 1,800 per sq ft',
      propertyTypes: ['Business Apartments', 'Office Spaces', 'Mixed-Use Properties'],
      highlights: ['Business Hub', 'Canal Views', 'Modern Architecture', 'Connectivity'],
      image: '/images/location.webp',
      marketTrends: '+10% YoY growth',
      popularDevelopments: ['Executive Towers', 'Bay Square', 'Burj Vista', 'The Opus']
    },
    {
      name: 'Jumeirah Lake Towers',
      description: 'Integrated free zone community with lakes, parks, and modern towers.',
      averagePrice: 'AED 800 - 1,500 per sq ft',
      propertyTypes: ['Tower Apartments', 'Studio Units', 'Commercial Spaces'],
      highlights: ['Lake Views', 'Community Living', 'Metro Access', 'Affordable Luxury'],
      image: '/images/location.webp',
      marketTrends: '+8% YoY growth',
      popularDevelopments: ['Jumeirah Bay X1', 'Al Seef Tower', 'Saba Tower', 'Icon Tower']
    },
    {
      name: 'Emirates Hills',
      description: 'Ultra-luxury gated community known as the "Beverly Hills of Dubai".',
      averagePrice: 'AED 800 - 2,000 per sq ft',
      propertyTypes: ['Luxury Villas', 'Mansions', 'Golf Course Properties'],
      highlights: ['Golf Course Views', 'Gated Community', 'Ultra Luxury', 'Privacy & Security'],
      image: '/images/location.webp',
      marketTrends: '+20% YoY growth',
      popularDevelopments: ['Emirates Hills Villas', 'The Lakes', 'Montgomerie Golf Course']
    }
  ];

  const allAreas = [
    'Al Barsha', 'Al Furjan', 'Al Khail Gate', 'Al Mizhar', 'Al Qusais', 'Al Warqaa',
    'Arabian Ranches', 'Arabian Ranches 2', 'Arjan', 'Bur Dubai', 'City Walk',
    'Damac Hills', 'Deira', 'DIFC', 'Discovery Gardens', 'Dubai Festival City',
    'Dubai Healthcare City', 'Dubai Hills Estate', 'Dubai Investments Park',
    'Dubai Land', 'Dubai Marina', 'Dubai South', 'Dubai Sports City', 'Dubai World Central',
    'Green Community', 'International City', 'Jabal Ali', 'Jumeirah', 'Jumeirah Beach Residence',
    'Jumeirah Golf Estates', 'Jumeirah Islands', 'Jumeirah Park', 'Jumeirah Village Circle',
    'Jumeirah Village Triangle', 'Karama', 'Meydan City', 'Motor City', 'Mudon',
    'Nad Al Sheba', 'Palm Jebel Ali', 'Ras Al Khor', 'Satwa', 'Sheikh Zayed Road',
    'Silicon Oasis', 'The Gardens', 'The Greens', 'The Lakes', 'The Meadows',
    'The Springs', 'The Views', 'Town Square', 'Trade Centre', 'WADI AL SAFA'
  ];

  const currentArea = premiumAreas.find(area => area.name === selectedArea);

  return (
    <>
      <Head>
        <title>Dubai Service Areas - Property Selling Locations </title>
        <meta name="description" content="Discover our comprehensive Dubai property selling services across all major areas. From Downtown Dubai to Palm Jumeirah, we serve every neighborhood with expert local knowledge." />
        <meta name="keywords" content="Dubai property areas, Dubai neighborhoods, property selling locations, Dubai real estate areas, luxury property areas Dubai" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center py-2 sm:py-3 md:py-4 lg:py-6">
              <div className="flex items-center">
                <Link href="/">
                  <img 
                    src="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png"
                    alt="Rino Properties Logo" 
                    className="w-20 h-5 xs:w-22 xs:h-5 sm:w-28 sm:h-7 md:w-32 md:h-8 lg:w-36 lg:h-9 transition-all duration-300"
                  />
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
              
              <nav className="hidden md:flex space-x-6 xl:space-x-10">
                <Link href="/" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-black hover:text-[#D69F3F]">
                  Home
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></span>
                </Link>
                <Link href="/overview" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-black hover:text-[#D69F3F]">
                  Overview
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></span>
                </Link>
                <Link href="/how-it-works" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-black hover:text-[#D69F3F]">
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></span>
                </Link>
                <Link href="/service-areas" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-[#D69F3F]">
                  Service Areas
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-100"></span>
                </Link>
                <Link href="/faq" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-black hover:text-[#D69F3F]">
                  FAQ
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></span>
                </Link>
              </nav>
            </div>
            
            {/* Mobile navigation menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen 
                ? 'max-h-96 opacity-100 pb-3 sm:pb-4' 
                : 'max-h-0 opacity-0 overflow-hidden'
            } bg-white shadow-lg rounded-lg mt-2 mx-2`}>
              <nav className="flex flex-col space-y-1 p-2">
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Home
                </Link>
                <Link 
                  href="/overview" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Overview
                </Link>
                <Link 
                  href="/how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  How It Works
                </Link>
                <Link 
                  href="/service-areas" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-[#D69F3F] bg-[#D69F3F]/10 rounded-lg transition-colors text-sm font-medium"
                >
                  Service Areas
                </Link>
                <Link 
                  href="/faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  FAQ
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-8 relative bg-gray-900 text-white min-h-[600px] flex items-center overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat lg:bg-fixed"
            style={{
              backgroundImage: "url('/images/bg.webp')",
              filter: "brightness(0.3)"
            }}
          />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-[#D69F3F]/30 z-5"></div>
          
          {/* Floating Elements - Hidden on very small screens */}
          <div className="absolute top-20 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-[#EDDDC5]/10 rounded-full blur-xl animate-pulse hidden sm:block"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 sm:w-32 sm:h-32 bg-[#D69F3F]/20 rounded-full blur-2xl animate-pulse delay-1000 hidden sm:block"></div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="text-center">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl 2xl:text-6xl font-normal mb-4 sm:mb-6 leading-tight">
                Dubai
                <span className="text-transparent text-white"> Service Areas</span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg text-gray-200 font-light leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto">
                We serve all major areas across Dubai with expert local knowledge and comprehensive market insights for each neighborhood.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <button 
                  onClick={openValuationPopup}
                  className="group relative bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-center transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                >
                  <span className="relative z-10">Get Area Valuation</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <a 
                  href="tel:97143212433" 
                  className="group border-2 border-white hover:bg-white hover:text-gray-900 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-center transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span>Call Now</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dubai Map */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-12 sm:mb-16">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 mb-2 sm:mb-4">Interactive Dubai Areas Map</h2>
                <p className="text-sm sm:text-base text-gray-600">Explore our coverage across Dubai's most sought-after locations</p>
              </div>
              <div className="relative mx-auto max-w-4xl">
                <img 
                  src="/images/location.webp" 
                  alt="Dubai Service Areas Map" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#D69F3F] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg">
                    <p className="text-xs sm:text-sm font-medium">Serving 50+ Areas Across Dubai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

       
        {/* All Areas Grid */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 mb-3 sm:mb-6">
                Complete Coverage Across Dubai
              </h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                We provide expert property selling services in all major Dubai neighborhoods
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {(showAllAreas ? allAreas : allAreas.slice(0, 20)).map((area, index) => (
                  <div key={index} className="group bg-gray-50 hover:bg-[#D69F3F]/10 p-2 sm:p-3 rounded-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#D69F3F] rounded-full group-hover:scale-125 transition-transform flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-700 group-hover:text-[#D69F3F] font-medium transition-colors leading-tight">{area}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {!showAllAreas && (
                <div className="text-center mt-6 sm:mt-8">
                  <button 
                    onClick={() => setShowAllAreas(true)}
                    className="bg-[#D69F3F] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#D69F3F]/90 transition-colors text-sm sm:text-base transform hover:scale-105"
                  >
                    View All {allAreas.length} Areas
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#D69F3F]">
          <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-white mb-3 sm:mb-6">
              Ready to Sell in Your Area?
            </h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed px-4">
              Get area-specific insights and a free valuation for your property
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-lg mx-auto">
              <button 
                onClick={openValuationPopup}
                className="bg-white text-[#D69F3F] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Area-Specific Valuation
              </button>
              <a href="tel:+97143212433" className="border-2 border-white text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-white hover:text-[#D69F3F] transition-colors text-sm sm:text-base transform hover:scale-105">
                Speak to Local Expert
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default ServiceAreasPage;
