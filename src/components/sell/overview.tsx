import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useValuation } from '@/context/ValuationContext';

const OverviewPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openValuationPopup } = useValuation();
  return (
    <>
      <Head>
        <title>Property Selling Overview - Dubai Real Estate Services </title>
        <meta name="description" content="Comprehensive overview of our Dubai property selling services. Learn about our proven process, expert team, and why thousands choose Rino Properties to sell their homes." />
        <meta name="keywords" content="Dubai property selling, real estate overview, property sale process, Dubai property market, luxury real estate Dubai" />
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
                <Link href="/overview" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-[#D69F3F]">
                  Overview
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-100"></span>
                </Link>
                <Link href="/how-it-works" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-black hover:text-[#D69F3F]">
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></span>
                </Link>
                <Link href="/service-areas" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-black hover:text-[#D69F3F]">
                  Service Areas
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></span>
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
                  className="px-3 py-2 text-[#D69F3F] bg-[#D69F3F]/10 rounded-lg transition-colors text-sm font-medium"
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
                  className="px-3 py-2 text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
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
                Selling Your  Property
                <span className="text-transparent text-white"> Made Simple</span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg text-gray-200 font-light leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto">
                With over a decade of experience in the Dubai real estate market, Rino Properties has established itself as the premier choice for property sellers across the emirate.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <button 
                  onClick={openValuationPopup}
                  className="group relative bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-center transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                >
                  <span className="relative z-10">Get Free Valuation</span>
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

        {/* Why Choose Us Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#EDDDC5] to-[#F5F0E8] relative overflow-hidden">
          
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/20 rounded-full blur-3xl -translate-x-24 sm:-translate-x-32 -translate-y-24 sm:-translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#D69F3F]/10 rounded-full blur-3xl translate-x-32 sm:translate-x-48 translate-y-32 sm:translate-y-48"></div>
          
          <div className="relative max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
                Why Choose Rino
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D69F3F] to-[#D69F3F]"> Properties?</span>
              </h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-gray-700 max-w-3xl mx-auto px-4">
                With years of experience and a proven track record, we're the trusted choice for Dubai property sales
              </p>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Card 1: Proven Track Record */}
              <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-gray-900 mb-2 sm:mb-3 text-center">Proven Track Record</h3>
                  <p className="text-gray-600 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">Successfully sold over 2,000+ properties in Dubai with 95% client satisfaction rate.</p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D69F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 2: Expert Valuation */}
              <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-gray-900 mb-2 sm:mb-3 text-center">Expert Valuation</h3>
                  <p className="text-gray-600 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">Accurate pricing based on comprehensive market analysis and local expertise.</p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D69F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 3: Global Network */}
              <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.77 20 8.64 20 12C20 14.08 19.2 15.97 17.9 17.39Z"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-gray-900 mb-2 sm:mb-3 text-center">Global Network</h3>
                  <p className="text-gray-600 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">International reach with local expertise to connect with buyers worldwide.</p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D69F3F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Card 4: Fast Results */}
              <div className="group relative bg-gradient-to-br from-[#D69F3F] to-[#D69F3F] rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:hover:-translate-y-4 hover:scale-105">
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-lg 2xl:text-xl font-normal text-white mb-2 sm:mb-3 text-center">Fast Results</h3>
                  <p className="text-white/90 text-center text-xs xs:text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed">Average sale time of 4-6 weeks for well-priced properties in prime locations.</p>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

            </div>
          </div>
        </section>

        {/* Property Types We Handle */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 mb-3 sm:mb-6">Property Types We Specialize In</h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                From luxury penthouses to family villas, we have expertise across all property segments
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[
                { type: "Luxury Apartments", icon: "🏢" },
                { type: "Premium Villas", icon: "🏡" },
                { type: "Penthouses", icon: "🏙️" },
                { type: "Townhouses", icon: "🏘️" },
                { type: "Studios", icon: "🏠" },
                { type: "Commercial", icon: "🏢" },
                { type: "Investment Units", icon: "💼" },
                { type: "Off-Plan", icon: "🏗️" }
              ].map((property, index) => (
                <div key={index} className="flex flex-col items-center justify-center bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 hover:scale-105 duration-300">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">{property.icon}</div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-1 sm:mb-2 text-center leading-tight">{property.type}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Competitive Advantages */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-gray-900 mb-3 sm:mb-6">What Sets Us Apart</h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Our unique approach combines technology, expertise, and personalized service
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D69F3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Professional Photography & Virtual Tours</h3>
                    <p className="text-sm sm:text-base text-gray-600">High-quality visuals that showcase your property's best features and attract serious buyers online.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D69F3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Multi-Platform Marketing Strategy</h3>
                    <p className="text-sm sm:text-base text-gray-600">Your property is marketed across 15+ platforms including Bayut, Property Finder, and international networks.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D69F3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-1 sm:mb-2">24/7 Client Support & Updates</h3>
                    <p className="text-sm sm:text-base text-gray-600">Regular communication with progress reports, viewing feedback, and market updates throughout the selling process.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D69F3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Legal & Documentation Support</h3>
                    <p className="text-sm sm:text-base text-gray-600">Complete assistance with title transfers, NOCs, mortgage clearances, and all legal requirements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D69F3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Flexible Payment Terms</h3>
                    <p className="text-sm sm:text-base text-gray-600">We work with buyers to arrange suitable payment plans and financing options to close deals faster.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D69F3F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Post-Sale Support</h3>
                    <p className="text-sm sm:text-base text-gray-600">Continued support even after the sale, including assistance with future property investments and market insights.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

    

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#D69F3F]">
          <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-3xl 2xl:text-4xl font-normal text-white mb-3 sm:mb-6">
              Ready to Sell Your Dubai Property?
            </h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed px-4">
              Get your free property valuation and discover how much your property is worth in today's market
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
              <button 
                onClick={openValuationPopup}
                className="bg-white text-[#D69F3F] px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Free Valuation
              </button>
              <a href="tel:+97143212433" className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:bg-white hover:text-[#D69F3F] transition-colors text-sm sm:text-base transform hover:scale-105">
                Call Now: +971 50 953 2889
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default OverviewPage;
