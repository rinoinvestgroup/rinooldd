import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { trackSocialClick } from '../utils/metaPixel';
import { trackSocialInteraction } from '../utils/googleAnalytics';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer 
      className="relative bg-white text-gray-900 overflow-hidden"
      style={{
        contain: 'layout style'
      }}
    >

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Company Info - Takes more space */}
            <div className="sm:col-span-2 lg:col-span-4 space-y-6">
              <div>
                <div className="flex items-center mb-6">
                  {/* <div className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] p-2  mr-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div> */}
                  {/* <span className="text-2xl font-light bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent">
                    RINO Properties
                  </span> */}
                  <Image
                    src="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png"
                                    alt="Rino Properties"
                                    width={130}
                                    height={35}
                                    className={`transition-all duration-300 group-hover:scale-105 filter drop-shadow-sm`}
                                    priority
                                  />
                </div>
                <p className="text-gray-600 text-xs xs:text-sm sm:text-base lg:text-lg font-light leading-relaxed">
                  {t('footer.description')}
                </p>
              </div>

              {/* Stats */}
              {/* <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 backdrop-blur-sm p-3 sm:p-4 border border-gray-200">
                  <div className="text-xl sm:text-2xl font-light text-[#D69F3F]">1000+</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-light">Properties Sold</div>
                </div>
                <div className="bg-gray-50 backdrop-blur-sm p-3 sm:p-4 border border-gray-200">
                  <div className="text-xl sm:text-2xl font-light text-[#D69F3F]">15+</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-light">Years Experience</div>
                </div>
              </div> */}

              {/* Social Media */}
              <div>
                <h4 className="text-gray-900 font-light text-xs xs:text-sm sm:text-base lg:text-lg mb-4">{t('footer.followUs')}</h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[
                    { 
                      name: 'Facebook', 
                      url: 'https://www.facebook.com/p/Rino-Properties-61568133758317/',
                      icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' 
                    },
                    { 
                      name: 'Instagram', 
                      url: 'https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D',
                      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' 
                    },
                    { 
                      name: 'LinkedIn', 
                      url: 'https://ae.linkedin.com/company/rino-invest-properties',
                      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' 
                    },
                    { 
                      name: 'TikTok', 
                      url: 'https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc',
                      icon: 'M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' 
                    },
                    { 
                      name: 'YouTube', 
                      url: 'https://www.youtube.com/@Jordan60860',
                      icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' 
                    }
                  ].map((social) => (
                    <a 
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackSocialClick(social.name);
                        trackSocialInteraction(social.name, 'click', social.url);
                      }}
                      aria-label={`Visit Rino Properties on ${social.name}`}
                      className="group relative w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-sm border border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center transform hover:scale-110 hover:-translate-y-1"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={social.icon} />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D69F3F]/20 to-[#D69F3F]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-light text-gray-900 mb-2 sm:mb-3 lg:mb-4 flex items-center">
                <span className="w-1 h-4 sm:h-6 bg-gradient-to-b from-[#D69F3F] to-[#C4903A] mr-3"></span>
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
                {[
                  { name: t('footer.links.home'), href: '/' },
                  { name: t('footer.links.properties'), href: '/properties/dubai' },
                  { name: 'Dubai Real Estate Services', href: '/dubai-real-estate-services' },
                  { name: t('footer.links.about'), href: '/about' },
                  { name: t('footer.links.blog'), href: '/blog' },
                  { name: t('footer.links.contact'), href: '/contact' },
                  { name: 'YouTube Channel', href: '/youtube-channel.html' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex items-center text-gray-600 hover:text-gray-900 font-light transition-all duration-300 text-xs xs:text-sm sm:text-base"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] transition-all duration-300 mr-0 group-hover:mr-3"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-3">
              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-light text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="w-1 h-4 sm:h-6 bg-gradient-to-b from-[#D69F3F] to-[#C4903A] mr-3"></span>
                {t('footer.ourServices')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                {[
                  { name: t('footer.services.propertyInvestment'), desc: 'Expert guidance on ROI optimization' },
                  { name: t('footer.services.luxuryRentals'), desc: 'Premium rental property management' },
                  { name: t('footer.services.goldenVisaAssistance'), desc: 'UAE & Spain residency programs' },
                  { name: t('footer.services.propertyManagement'), desc: 'Full after-sales support' },
                  { name: t('footer.services.legalAdvisory'), desc: 'Complete documentation support' },
                  { name: t('footer.services.marketAnalysis'), desc: 'In-depth market research & trends' },
                  { name: 'Off-Plan Properties', desc: 'Exclusive pre-launch opportunities' },
                  { name: 'Property Valuation', desc: 'Free professional assessments' }
                ].map((service) => (
                  <div key={service.name} className="transition-all duration-300 group">
                    <span className="text-gray-600 font-light transition-colors duration-300 text-xs xs:text-sm sm:text-base block">{service.name}</span>
                    <span className="text-gray-500 text-xs font-light block mt-0.5">{service.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Newsletter */}
            <div className="lg:col-span-3">
              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-light text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="w-1 h-4 sm:h-6 bg-gradient-to-b from-[#D69F3F] to-[#C4903A] mr-3"></span>
                {t('footer.getInTouch')}
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  { 
                    icon: '🇪🇸', 
                    label: t('footer.spainOfficeLabel'), 
                    text: 'C/ Ancha del Carmen, 2 - 29002 Málaga.',
                    phone: '+34 635 955 137',
                    schema: true
                  },
                  { 
                    icon: '🇦🇪', 
                    label: t('footer.dubaiOfficeLabel'), 
                    text: 'Business Village Building – B, Office 330, Deira, Dubai, UAE',
                    phone: '+971 43 21 2433',
                    schema: true
                  },
                  { icon: '📧', label: t('footer.emailLabel'), text: 'ask@rinoproperties.com' },
                  { icon: '🌐', label: 'Languages', text: 'English, Arabic, Spanish, Chinese, Hindi, Urdu, German, Farsi' },
                  { icon: '⏰', label: 'Working Hours', text: 'Mon-Fri: 9:00 AM - 6:00 PM (GST) | Sat: By Appointment' },
                ].map((contact, index) => (
                  <div key={`contact-${index}`} className="flex items-start space-x-2 sm:space-x-3 text-gray-600" itemProp={contact.schema ? 'address' : undefined} itemScope={contact.schema} itemType={contact.schema ? 'https://schema.org/PostalAddress' : undefined}>
                    <div className="flex-1 min-w-0">
                      {contact.label && (
                        <div className="text-xs xs:text-xs sm:text-sm font-medium text-[#D69F3F] uppercase tracking-wide mb-1">
                          {contact.label}
                        </div>
                      )}
                      <span className="text-xs xs:text-xs sm:text-sm lg:text-base font-light leading-relaxed break-words" itemProp={contact.schema ? 'streetAddress' : undefined}>
                        {contact.text}
                      </span>
                      {contact.phone && (
                        <div className="mt-1">
                          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-xs xs:text-xs sm:text-sm lg:text-base font-light text-[#D69F3F] hover:text-[#C4903A] transition-colors" itemProp="telephone">
                            📞 {contact.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Newsletter */}
              {/* <div className="bg-gradient-to-r from-[#D69F3F]-500/10 to-[#D69F3F]-500/10  p-6 border border-[#D69F3F]-500/20">
                <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Subscribe for market insights and exclusive property listings.
                </p>
                
                <form onSubmit={handleSubscription} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400  border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D69F3F]-500/50 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubscribed}
                    className={`w-full py-3 font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isSubscribed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gradient-to-r from-[#D69F3F]-600 to-[#D69F3F]-700 hover:from-[#D69F3F]-700 hover:to-[#D69F3F]-800 text-white shadow-lg hover:'
                    }`}
                  >
                    {isSubscribed ? '✓ Subscribed!' : 'Subscribe Now'}
                  </button>
                </form>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-gray-500 text-xs xs:text-xs sm:text-sm lg:text-base font-light text-center sm:text-left">
                © {currentYear} <a href="http://www.rinoproperties.com" target='_blank'>{t('footer.rinoProperties')}</a>. {t('footer.allRightsReserved')}.
              </p>
              {/* <div className="flex items-center space-x-1 text-gray-400 text-sm font-light">
                <span>Made with</span>
                <span className="text-[#D69F3F] animate-pulse">❤️</span>
                <span>in Barcelona & Dubai</span>
              </div> */}
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms-of-service' },
                { name: 'Cookie Policy', href: '/cookie-policy' },
              ].map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-500 hover:text-gray-900 text-xs xs:text-xs sm:text-sm lg:text-base font-light transition-colors duration-300 relative group"
                  aria-label={`Navigate to ${link.name}`}
               >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
              <button
                onClick={() => {
                  // Delete cookie consent to show banner again
                  document.cookie = 'rino_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                  window.location.reload();
                }}
                className="text-gray-500 hover:text-gray-900 text-xs xs:text-xs sm:text-sm lg:text-base font-light transition-colors duration-300 relative group"
              >
                Cookie Settings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {/* <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#D69F3F]-600 to-[#D69F3F]-700 hover:from-[#D69F3F]-700 hover:to-[#D69F3F]-800 text-white   hover:shadow-[#D69F3F]-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group z-50"
        >
          <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button> */}
      </div>
    </footer>
  );
};

export default Footer;