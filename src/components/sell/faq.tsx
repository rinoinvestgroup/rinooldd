import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useValuation } from '@/context/ValuationContext';

const FAQPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openValuationPopup } = useValuation();

  const faqCategories = ['All', 'Selling Process', 'Valuation', 'Legal & Documentation', 'Costs & Fees', 'Timeline', 'Marketing', 'After Sale'];

  const faqs = [
    {
      question: "How do you determine my property's market value?",
      answer: "Our valuation process combines multiple factors including recent comparable sales in your building and area, current market conditions, property condition and unique features, location advantages, and amenities. We use advanced market analysis tools and have access to comprehensive MLS data. Our certified valuers also consider factors like floor level, view, parking spaces, and any recent renovations. We provide a detailed report explaining how we arrived at the valuation figure.",
      category: "Valuation",
      icon: "💰",
      popular: true
    },
    {
      question: "What documents do I need to sell my property in Dubai?",
      answer: "Essential documents include: Original Title Deed (Pink Slip), Emirates ID and Passport copies, No Objection Certificate (NOC) from developer if applicable, Mortgage clearance letter if property is financed, DEWA clearance certificate, Internet/Cable disconnection certificates, Building completion certificate, Property passport (if available), and Power of Attorney if selling through representative. We'll help you obtain any missing documents and guide you through the entire documentation process.",
      category: "Legal & Documentation",
      icon: "📋",
      popular: true
    },
    {
      question: "How long does it typically take to sell a property in Dubai?",
      answer: "Timeline varies based on several factors: Well-priced properties in prime locations (Downtown, Marina, JLT) typically sell within 2-6 weeks. Luxury properties in premium areas may take 3-6 months. Unique or high-value properties can take longer but often achieve better prices. Market conditions, seasonality, and pricing strategy significantly impact timeline. Our comprehensive marketing approach and buyer network help accelerate the process. We provide regular market feedback and can adjust strategy if needed.",
      category: "Timeline",
      icon: "⏰",
      popular: true
    },
    {
      question: "What are all the costs involved in selling my property?",
      answer: "Main costs include: DLD transfer fee (4% of property value + AED 580 admin fee), Real estate commission (typically 2% + 5% VAT), Mortgage settlement (if applicable), DEWA final bill and disconnection, Internet/cable disconnection fees, NOC fees (varies by developer), Legal fees for document preparation (if required). We provide a detailed cost breakdown upfront with no hidden charges. Some costs can be negotiated with the buyer depending on market conditions.",
      category: "Costs & Fees",
      icon: "💳",
      popular: true
    },
    {
      question: "Can I sell my property if I still have an outstanding mortgage?",
      answer: "Yes, absolutely! We regularly handle properties with existing mortgages. The process involves: Obtaining liability letter from your bank, Coordinating with bank for clearance, Ensuring sale proceeds first go to mortgage settlement, Transferring remaining funds to you after clearance. We handle all coordination with your bank and ensure a smooth process. The buyer and their bank will typically require mortgage clearance before completion.",
      category: "Legal & Documentation",
      icon: "🏦",
      popular: true
    },
    {
      question: "Do you provide professional photography and virtual tours?",
      answer: "Yes, we provide comprehensive visual marketing including: Professional real estate photography with proper lighting and staging advice, 360-degree virtual tours for premium properties, Drone photography for villas and unique properties, Floor plans and measurement drawings, High-quality marketing brochures, Social media optimized images. Professional visuals significantly impact buyer interest and can increase sale price by 5-10%. All photography and marketing materials are included in our service at no extra cost.",
      category: "Marketing",
      icon: "📸",
      popular: false
    },
    {
      question: "How do you market my property to potential buyers?",
      answer: "Our comprehensive marketing strategy includes: Listing on 15+ major portals (Bayut, Property Finder, Dubizzle, etc.), International MLS networks for overseas buyers, Social media campaigns (Facebook, Instagram, LinkedIn), Email marketing to our buyer database, Print advertising in luxury magazines, Open houses and private viewings, Networking through our agent partnerships, WhatsApp and direct messaging campaigns. We track all marketing performance and adjust strategies based on response rates.",
      category: "Marketing",
      icon: "📱",
      popular: false
    },
    {
      question: "What makes Rino Properties different from other real estate agents?",
      answer: "Our unique advantages include: Multilingual team serving international clientele, Transparent communication with regular updates, Technology-driven marketing approach, In-house legal and documentation support, 24/7 client service availability, Extensive buyer network and database, Proven track record with 95% client satisfaction, No hidden fees or surprise charges, Post-sale support and relationship management, Deep local market knowledge across all Dubai areas.",
      category: "Selling Process",
      icon: "⭐",
      popular: false
    },
    {
      question: "Can you help me stage my property for better presentation?",
      answer: "Yes, we provide comprehensive staging support including: Professional staging consultation, Furniture arrangement advice, Decluttering and depersonalization guidance, Minor repair and maintenance recommendations, Lighting optimization tips, Seasonal decoration suggestions. For luxury properties, we can arrange full staging services with furniture rental. Proper staging can increase sale price by 3-7% and reduce time on market significantly.",
      category: "Marketing",
      icon: "🏠",
      popular: false
    },
    {
      question: "What happens if my property doesn't sell within the expected timeframe?",
      answer: "If your property doesn't sell within our projected timeline, we: Conduct a comprehensive market review, Analyze viewing feedback and buyer responses, Reassess pricing strategy with current market data, Enhance marketing approach and channels, Provide updated market analysis and recommendations, Consider seasonal market adjustments, Offer flexible commission structures for extended periods. We're committed to achieving a successful sale and will work tirelessly until we find the right buyer.",
      category: "Timeline",
      icon: "🔄",
      popular: false
    },
    {
      question: "Do you handle the legal transfer process and DLD registration?",
      answer: "Yes, we provide complete support for the legal transfer including: DLD appointment booking and coordination, Document preparation and verification, Translation services if required, Mortgage clearance coordination, Title transfer assistance, Payment coordination between all parties, Final handover arrangements. We have partnerships with legal consultants and can arrange full legal representation if needed. Our team guides you through every step of the process.",
      category: "Legal & Documentation",
      icon: "⚖️",
      popular: false
    },
    {
      question: "How do you screen potential buyers?",
      answer: "Our buyer qualification process includes: Financial pre-qualification and bank letter verification, Identity and Emirates ID verification, Serious buyer assessment through detailed discussions, Purchase timeline and requirements confirmation, Previous property transaction history review, Reference checks when necessary. We only arrange viewings with qualified, serious buyers to save your time and ensure productive property visits.",
      category: "Selling Process",
      icon: "🔍",
      popular: false
    },
    {
      question: "What support do you provide after the sale is completed?",
      answer: "Our post-sale support includes: Final utility transfer assistance, Address change notifications to relevant authorities, Property handover checklist completion, Warranty and maintenance contact information, Future market updates and investment advice, Priority service for future property transactions, Referral services for other property-related needs, Annual market valuation updates if requested. We maintain long-term relationships with our clients beyond the transaction.",
      category: "After Sale",
      icon: "🤝",
      popular: false
    },
    {
      question: "Can you help me buy another property while selling my current one?",
      answer: "Absolutely! We offer comprehensive buy-and-sell coordination including: Portfolio transition planning, Bridge financing options and connections, Simultaneous transaction coordination, Timing optimization to avoid double payments, Capital gains planning and advice, 1031 exchange equivalent strategies, New property search while marketing current property, Negotiation of contingent offers. Our team can handle both transactions seamlessly.",
      category: "Selling Process",
      icon: "🔄",
      popular: false
    },
    {
      question: "What if I need to sell urgently due to relocation or other circumstances?",
      answer: "For urgent sales, we offer: Expedited valuation and market analysis, Intensive marketing campaign launch, Investor buyer network activation, Realistic pricing strategy for quick sale, Daily market feedback and adjustments, Multiple viewing schedule coordination, Fast-track negotiation and closing process, Legal process acceleration where possible. While urgent sales may involve some price compromise, we work to minimize this while achieving your timeline.",
      category: "Timeline",
      icon: "⚡",
      popular: false
    },
    {
      question: "How do you handle offers and negotiations?",
      answer: "Our negotiation process includes: Professional offer evaluation and comparison, Market value assessment of each offer, Buyer qualification verification, Terms and conditions analysis, Counter-offer strategy development, Multiple offer situation management, Deal structure optimization, Closing timeline coordination. We negotiate professionally on your behalf to secure the best possible terms while maintaining deal integrity.",
      category: "Selling Process",
      icon: "🤝",
      popular: false
    },
    {
      question: "What are your commission rates and payment terms?",
      answer: "Our commission structure is competitive and transparent: Standard rate: 2% + 5% VAT on the sale price, No upfront fees or marketing costs, Commission paid only upon successful completion, Flexible payment arrangements available, No hidden charges or surprise fees, All marketing and professional services included. We believe in earning our commission through results, which is why we're committed to achieving the best possible outcome for your sale.",
      category: "Costs & Fees",
      icon: "💰",
      popular: false
    },
    {
      question: "Do you work with international buyers?",
      answer: "Yes, we have extensive international reach including: Partnerships with overseas real estate networks, Multilingual marketing materials and websites, International MLS listing distribution, Social media campaigns targeting overseas markets, Relationships with relocation companies, Embassy and consulate connections, Virtual viewing capabilities for remote buyers, International payment and financing coordination. About 40% of our buyers are international clients.",
      category: "Marketing",
      icon: "🌍",
      popular: false
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFaqs = faqs.filter(faq => faq.popular);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>Frequently Asked Questions - Property Selling FAQ  Dubai</title>
        <meta name="description" content="Get answers to common questions about selling property in Dubai. Learn about our process, costs, timeline, and legal requirements from Rino Properties experts." />
        <meta name="keywords" content="Dubai property selling FAQ, real estate questions Dubai, property sale process, selling costs Dubai, property valuation questions" />
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
                <Link href="/service-areas" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-black hover:text-[#D69F3F]">
                  Service Areas
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-0 group-hover:scale-x-100"></span>
                </Link>
                <Link href="/faq" className="text-xs xl:text-sm 2xl:text-base transition-colors uppercase tracking-wide relative group font-medium text-[#D69F3F]">
                  FAQ
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#EDDDC5] transform transition-transform duration-200 scale-x-100"></span>
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
                  className="px-3 py-2 text-gray-700 hover:text-[#D69F3F] hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  Service Areas
                </Link>
                <Link 
                  href="/faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-[#D69F3F] bg-[#D69F3F]/10 rounded-lg transition-colors text-sm font-medium"
                >
                  FAQ
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white min-h-screen flex items-center overflow-hidden">
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
            <div className="text-center mb-12">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl 2xl:text-6xl font-normal mb-4 sm:mb-6 leading-tight">
                Frequently Asked
                <span className="text-transparent text-white"> Questions</span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg text-gray-200 font-light leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto">
                Get instant answers to common questions about selling your property in Dubai. Can't find what you're looking for? Contact our experts directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <a 
                  href="/#hero" 
                  className="group relative bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 text-center transform hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base"
                >
                  <span className="relative z-10">Get Your Questions Answered</span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
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

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
              <div className="bg-white/95 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-lg border border-white/20">
                {/* Search Bar */}
                <div className="relative mb-4 sm:mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search questions..."
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 text-sm sm:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-[#D69F3F] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Questions */}
        {selectedCategory === 'All' && searchTerm === '' && (
          <section className="py-6 sm:py-8 lg:py-12 bg-[#D69F3F]/5">
            <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-white mb-2 sm:mb-4">Most Popular Questions</h2>
                <p className="text-sm sm:text-base text-white">Quick answers to the questions we hear most often</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {popularFaqs.slice(0, 4).map((faq, index) => (
                  <div key={index} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="text-xl sm:text-2xl flex-shrink-0">{faq.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base leading-tight">{faq.question}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">{faq.answer.substring(0, 120)}...</p>
                        <button
                          onClick={() => {
                            const mainIndex = faqs.findIndex(f => f.question === faq.question);
                            toggleFaq(mainIndex);
                            document.getElementById(`faq-${mainIndex}`)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-[#D69F3F] text-xs sm:text-sm font-medium mt-2 hover:underline"
                        >
                          Read full answer →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ List */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-2 sm:mb-4">
                {selectedCategory === 'All' ? 'All Questions' : selectedCategory} 
                <span className="text-gray-500 text-base sm:text-lg ml-2">({filteredFaqs.length})</span>
              </h2>
              {searchTerm && (
                <p className="text-sm sm:text-base text-gray-600">Showing results for "{searchTerm}"</p>
              )}
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">No results found</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Try adjusting your search terms or browse different categories</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="bg-[#D69F3F] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#D69F3F]/90 transition-colors text-sm sm:text-base"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">{
                filteredFaqs.map((faq, index) => (
                  <div 
                    key={index} 
                    id={`faq-${faqs.findIndex(f => f.question === faq.question)}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    <button 
                      className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors duration-200 flex items-start justify-between group"
                      onClick={() => toggleFaq(faqs.findIndex(f => f.question === faq.question))}
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                        <div className="text-lg sm:text-2xl flex-shrink-0">{faq.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs bg-[#D69F3F]/10 text-[#D69F3F] px-2 py-1 rounded-full font-medium">
                              {faq.category}
                            </span>
                            {faq.popular && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                                Popular
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 group-hover:text-[#D69F3F] transition-colors leading-relaxed pr-2">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-3 sm:ml-4">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#D69F3F]/10 flex items-center justify-center transform transition-all duration-300 ${
                          openFaq === faqs.findIndex(f => f.question === faq.question) ? 'rotate-180 bg-[#D69F3F]' : 'group-hover:bg-[#D69F3F]/20'
                        }`}>
                          <svg 
                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-300 ${
                              openFaq === faqs.findIndex(f => f.question === faq.question) ? 'text-white' : 'text-[#D69F3F]'
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-500 ease-out ${
                      openFaq === faqs.findIndex(f => f.question === faq.question) 
                        ? 'max-h-screen opacity-100' 
                        : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="h-px bg-gradient-to-r from-[#D69F3F]/20 to-transparent mb-3 sm:mb-4"></div>
                        <div className="prose prose-gray max-w-none">
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }</div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#D69F3F]/5 to-transparent">
          <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="text-2xl sm:text-4xl mb-3 sm:mb-4">🤔</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-gray-900 mb-3 sm:mb-4">
                Still Have Questions?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
                Our property experts are here to help with personalized answers to your specific situation
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D69F3F] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Call Us</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">+971 50 953 2889</p>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86,0,01-1.51-5.26c.001-5.45,4.436-9.884,9.888-9.884,2.64,0,5.122,1.03,6.988,2.898a9.825,9.825,0,012.893,6.994c-.003,5.45-4.437,9.884-9.885,9.884m8.413-18.297A11.815,11.815,0,0012.05,0C5.495,0,.16,5.335.157,11.892c0,2.096.547,4.142,1.588,5.945L.057,24l6.305-1.654a11.882,11.882,0,005.683,1.448h.005c6.554,0,11.89-5.335,11.893-11.893A11.821,11.821,0,0020.885,3.488"/>
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">WhatsApp</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">Instant support</p>
                </div>
                
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Email</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">tiary@rinoproperties.com</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                <a 
                  href="tel:+97143212433" 
                  className="bg-[#D69F3F] text-white px-6 sm:px-8 py-3 rounded-xl font-medium hover:bg-[#D69F3F]/90 transition-colors text-sm sm:text-base transform hover:scale-105"
                >
                  Speak to Expert Now
                </a>
                <button 
                  onClick={openValuationPopup}
                  className="border-2 border-[#D69F3F] text-[#D69F3F] px-6 sm:px-8 py-3 rounded-xl font-medium hover:bg-[#D69F3F] hover:text-white transition-colors text-sm sm:text-base transform hover:scale-105"
                >
                  Get Free Consultation
                </button>
              </div>
            </div>
          </div>
        </section>


            
      </div>
    </>
  );
};

export default FAQPage;
