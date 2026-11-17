import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useValuation } from '@/context/ValuationContext';

const HowItWorksPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openValuationPopup } = useValuation();

  const steps = [
    {
      title: "Contact & Valuation",
      subtitle: "Professional Property Assessment",
      description: "Reach out to our expert team and get a professional property assessment to determine optimal market value",
      details: [
        "Free property inspection and condition assessment",
        "Comprehensive market analysis and competitive property review",
        "Discussion of your selling timeline and goals",
        "Professional valuation using advanced market tools",
        "Clear explanation of the entire selling process"
      ],
      timeframe: "1-2 days",
      icon: "📊"
    },
    {
      title: "Marketing & Promotion",
      subtitle: "Maximum Market Exposure",
      description: "Create compelling property documentation and strategic marketing across multiple channels and platforms",
      details: [
        "Professional photography and virtual tours",
        "Creation of detailed property brochures and floor plans",
        "Listing on 15+ major property portals (Bayut, Property Finder, etc.)",
        "Social media marketing campaigns across all platforms",
        "International marketing to overseas buyers"
      ],
      timeframe: "3-5 days",
      icon: "📱"
    },
    {
      title: "Viewings & Reports",
      subtitle: "Showcasing Your Property",
      description: "Organize property viewings with potential buyers and provide regular progress updates throughout the process",
      details: [
        "Screening and qualification of potential buyers",
        "Coordinated viewing appointments at convenient times",
        "Professional property presentations and showcasing",
        "Collection and analysis of detailed buyer feedback",
        "Regular progress reports and market updates"
      ],
      timeframe: "2-6 weeks",
      icon: "👥"
    },
    {
      title: "Sale & Handover",
      subtitle: "Closing the Sale",
      description: "Finalize legal documentation, secure the sale agreement, and complete handover with ongoing support",
      details: [
        "Professional offer evaluation and negotiation",
        "Coordination with DLD for title transfer",
        "Mortgage clearance and legal documentation",
        "Final property handover and key transfer",
        "Post-sale support and ongoing assistance"
      ],
      timeframe: "1-2 weeks",
      icon: "🤝"
    }
  ];

  return (
    <>
      <Head>
        <title>How Property Selling Works - Step by Step Process  Dubai</title>
        <meta name="description" content="Learn our proven 6-step property selling process in Dubai. From initial consultation to final completion, discover how we make selling your property simple and profitable." />
        <meta name="keywords" content="Dubai property selling process, how to sell property Dubai, real estate selling steps, property sale timeline Dubai" />
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
                <Link href="/how-it-works" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-[#D69F3F]">
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-100"></span>
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
                  className="px-3 py-2 text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Overview
                </Link>
                <Link 
                  href="/how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-[#D69F3F] bg-[#D69F3F]/10 rounded-lg transition-colors text-sm font-medium"
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
                How Our
                <span className="text-transparent text-white"> Selling Process</span> Works
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg text-gray-200 font-light leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto">
                Our proven 4-step process ensures a smooth, profitable, and stress-free property sale experience from start to finish.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <button 
                  onClick={openValuationPopup}
                  className="group relative bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-center transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                >
                  <span className="relative z-10">Start Your Property Sale</span>
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

        {/* Process Timeline */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                Our 4-Step Process
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                Follow our proven 4-step process designed to ensure a smooth and successful property sale
              </p>
            </div>
            
            <div className="relative">
              {/* Mobile vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D69F3F] to-[#D69F3F]/30 lg:hidden"></div>
              {/* Desktop center line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D69F3F] to-[#D69F3F]/30 hidden lg:block"></div>
              
              <div className="space-y-8 sm:space-y-12 lg:space-y-16">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`relative ${
                      // Mobile layout
                      'flex flex-col space-y-4 pl-16 lg:pl-0' +
                      // Desktop layout
                      ` lg:flex lg:items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`
                    }`}
                  >
                    {/* Mobile Step Number Circle - positioned on the left */}
                    <div className="absolute left-3 top-2 w-6 h-6 sm:w-8 sm:h-8 bg-[#D69F3F] rounded-full flex items-center justify-center shadow-lg z-10 lg:hidden">
                      <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                    </div>

                    {/* Step Content */}
                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right lg:pr-8' : 'lg:text-left lg:pl-8'}`}>
                      <div 
                        className={`bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                          activeStep === index ? 'ring-2 ring-[#D69F3F] bg-[#D69F3F]/5' : ''
                        }`}
                        onClick={() => setActiveStep(index)}
                      >
                        <div className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 ${
                          index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'
                        }`}>
                          <div className={`text-2xl sm:text-3xl ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                            {step.icon}
                          </div>
                          <div className={`${index % 2 === 0 ? 'lg:order-1 lg:text-right' : 'lg:order-2 lg:text-left'}`}>
                            <h3 className="text-lg sm:text-xl font-medium text-gray-900 leading-tight">
                              {step.title}
                            </h3>
                            <p className="text-[#D69F3F] font-medium text-sm sm:text-base">
                              {step.subtitle}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
                          {step.description}
                        </p>
                        <div className="inline-block bg-[#D69F3F] text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          {step.timeframe}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Step Number Circle - positioned in center */}
                    <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#D69F3F] rounded-full items-center justify-center shadow-lg z-10">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>

                    {/* Empty space for alternate layout - only on large screens */}
                    <div className="hidden lg:block lg:w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Step View */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                Step {activeStep + 1}: {steps[activeStep].title}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                {steps[activeStep].description}
              </p>
            </div>

            {/* Step Navigation */}
            <div className="py-3 sm:py-4 bg-gray-50 mb-6 sm:mb-8 lg:mb-4 rounded-xl">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
                  {steps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all ${
                        activeStep === index
                          ? 'bg-[#D69F3F] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="hidden sm:inline">Step </span>{index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
              <div className="order-2 lg:order-1">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-4 sm:mb-6">
                  What We Do In This Step:
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {steps[activeStep].details.map((detail, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#D69F3F] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2 bg-gradient-to-br from-[#D69F3F]/5 to-transparent p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl">
                <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-4 sm:mb-6">
                  Key Benefits:
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {activeStep === 0 && (
                    <>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Free professional property valuation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>No commitment until you're satisfied</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Clear understanding of the process</span>
                      </div>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Maximum market exposure across all platforms</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Professional presentation materials</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>International buyer reach</span>
                      </div>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Pre-qualified serious buyers only</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Professional property showcasing</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Regular feedback and progress updates</span>
                      </div>
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Expert negotiation on your behalf</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Smooth legal completion</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#D69F3F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className='text-black text-sm sm:text-base'>Post-sale support and assistance</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#D69F3F]/10 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Timeline:</h4>
                  <p className="text-gray-700 text-sm sm:text-base">{steps[activeStep].timeframe}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      
        {/* Why Our Process Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-6">
                Why Our Process Gets Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our systematic approach has been refined over years of experience in the Dubai property market
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-2xl">
                <div className="w-16 h-16 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Proven Success Rate</h3>
                <p className="text-gray-600">Our systematic approach has achieved a 95% success rate in property sales within the targeted timeframe.</p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-2xl">
                <div className="w-16 h-16 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Higher Sale Prices</h3>
                <p className="text-gray-600">Properties sold through our process typically achieve 5-8% higher prices than market average.</p>
              </div>

              <div className="text-center p-8 bg-gradient-to-br from-[#D69F3F]/5 to-transparent rounded-2xl">
                <div className="w-16 h-16 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Faster Sales</h3>
                <p className="text-gray-600">Average time to sale is 30% faster than industry standard due to our comprehensive marketing approach.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#D69F3F]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-normal text-white mb-6">
              Ready to Start the Process?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Begin with a free consultation and property valuation - no commitment required
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={openValuationPopup}
                className="bg-white text-[#D69F3F] px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Start Free Consultation
              </button>
              <a href="tel:+97143212433" className="border-2 border-white text-white px-8 py-4 rounded-xl font-medium hover:bg-white hover:text-[#D69F3F] transition-colors">
                Call Now: +971 50 953 2889
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white text-black py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
              
              {/* Company Info */}
              <div className="lg:col-span-2">
                <h4 className="text-black  lg:text-2xl font-normal tracking-wide mb-4">Rino Properties</h4>
                <p className="text-black-400 mb-6 font-light leading-relaxed">
                  Rino Properties is a part of RINO Invest Group that has been shaping the luxury real estate market since 2024, delivering iconic residential, commercial and leisure properties across the GCC and Europe.
                </p>
                
                {/* Social Media */}
                <div className="flex space-x-3">
                  <a href="https://www.facebook.com/p/Rino-Properties-61568133758317/" target='_blank' className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center  transition-all duration-300 group" aria-label="Facebook">
                    <svg className="w-4 h-4 text-white " fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/rinoinvest_properties?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target='_blank' className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center  transition-all duration-300 group" aria-label="Instagram">
                    <svg className="w-4 h-4 text-white " fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://ae.linkedin.com/company/rino-invest-properties" target='_blank' className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center  transition-all duration-300 group" aria-label="LinkedIn">
                    <svg className="w-4 h-4 text-white " fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                   <a href="https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc" target='_blank' className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center  transition-all duration-300 group" aria-label="TikTok">
                    <svg className="w-4 h-4 text-white " fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h5 className="text-base font-normel text-black mb-4">Quick Links</h5>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-black-400  transition-colors text-sm">Home</Link></li>
                  <li><Link href="/overview" className="text-black-400 transition-colors text-sm">Overview</Link></li>
                  <li><Link href="/how-it-works" className="text-black-400 transition-colors text-sm">How It Works</Link></li>
                  <li><Link href="/service-areas" className="text-black-400 transition-colors text-sm">Service Areas</Link></li>
                  <li><Link href="/faq" className="text-black-400 transition-colors text-sm">FAQ</Link></li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div>
                <h5 className="text-sm sm:text-base font-normal text-black mb-3 sm:mb-4">Contact</h5>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="text-black">tiary@rinoproperties.com</p>
                  <p className="text-black">+971 50 953 2889</p>
                  <p className="text-black">Rino Invest Group, Business Village Building – B, Office 330, Deira, Dubai, UAE</p>
                </div>
                
                {/* Rino Properties CTA */}
                <div className="mt-4 sm:mt-6">
                  <a 
                    href="https://rinoproperties.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[#D69F3F] hover:bg-[#D69F3F] hover:text-white text-black px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-normal transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-2 text-white">Visit Rino Properties</span>
                    <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
        {/* Footer bottom links */}
        <div className="flex flex-wrap justify-center space-x-2 xs:space-x-4 sm:space-x-6 text-xs sm:text-sm mt-6 sm:mt-8">
          <a href="https://rinoproperties.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#D69F3F] transition-colors">Privacy Policy</a>
          <a href="https://rinoproperties.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#D69F3F] transition-colors">Terms of Use</a>
        </div>
      </div>
    </footer>

      </div>
    </>
  );
};

export default HowItWorksPage;
