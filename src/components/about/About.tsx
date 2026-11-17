import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CTASection from '../home/CTASection';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
    const teamMembers = [
    {
      name: "Ahamed Turk",
      role: "Head of Marketing & Sales",
      image: "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/04/24115932/resizecom_IMG_0997-modified-150x150.png",
      social: {
        // linkedin: "https://ae.linkedin.com/company/rino-invest-properties",
        // twitter: "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc",
        email: "info03@ecolexlegal.com",
        // instagram: "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
      }
    },
   {
      name: "Khaled",
      role: "Group Head Of Sales",
      image: "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/05/02090649/WhatsApp-Image-2025-05-02-at-12.49.10-modified-150x150.png",
      social: {
        // linkedin: "https://ae.linkedin.com/company/rino-invest-properties",
        // twitter: "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc",
        email: "khaled@rinoproperties.com",
        // instagram: "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
      }
    },
    {
      name: "Belen",
      role: "Administration Manager",
      image: "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/04/25101935/WhatsApp-Image-2025-04-25-at-12.55.20-modified-150x150.png",
      social: {
        // linkedin: "https://ae.linkedin.com/company/rino-invest-properties",
        // twitter: "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc",
        email: "info@riasset.es",
        // instagram: "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
      }
    },
    {
      name: "Billy Liu",
      role: "Sales Manager",
      // image: "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/04/24115932/resizecom_IMG_0997-modified-150x150.png",
      social: {
        // linkedin: "https://ae.linkedin.com/company/rino-invest-properties",
        // twitter: "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc",
        email: "liubin@ecolexlegal.com",
        // instagram: "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
      }
    },
     {
      name: "Beshoy",
      role: "Graphic Design Specialist",
      image: "https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/04/24115932/resizecom_IMG_0997-modified-150x150.png",
      social: {
        // linkedin: "https://ae.linkedin.com/company/rino-invest-properties",
        // twitter: "https://www.tiktok.com/@rino.properties?is_from_webapp=1&sender_device=pc",
        email: "designer01@rinoproperties.com",
        // instagram: "https://www.instagram.com/rinoinvest_properties/?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
      }
    },
  ];
  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop"
          alt="Modern Office Building"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-black/20"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8">
          
       
          {/* Main Heading */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {t('about.page.title')} <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent">Us</span>
          </h1>
          
          {/* Subtitle */}
          {/* <p className="text-xl sm:text-2xl text-gray-200 mb-10 leading-relaxed">
            Redefining luxury real estate across Spain and UAE with excellence and innovation
          </p> */}
          
          {/* Stats */}
          <div className="mb-10 max-w-lg mx-auto">
            <p className="text-sm xs:text-base sm:text-lg">{t('about.page.subtitle')}</p>
          </div>
          
          {/* CTA Button */}
          {/* <button className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#D69F3F] text-white px-10 py-4  font-semibold text-lg transition-all duration-300  hover: transform hover:scale-105">
            Discover Our Story
          </button> */}
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
          <div className="w-6 h-10 border-2 border-white/50  mx-auto mb-2 flex justify-center">
            <div className="w-1 h-3 bg-white/70  mt-2 animate-bounce"></div>
          </div>
          <p className="text-xs xs:text-sm text-white/70 uppercase tracking-wide">{t('about.page.scroll')}</p>
        </div>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D69F3F]-500 to-[#D69F3F]-500"></div>
      </section>

      {/* Add custom animations to your CSS or Tailwind config */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>

      {/* Welcome Section */}
      <section className="sm:mt-2 lg:mt-8 mb-8 relative overflow-hidden">
     
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="relative w-full lg:w-1/2">
             <video src="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/04/29071235/interview.mp4#t=0.5" controls className="w-full max-w-[600px] mx-auto lg:mx-0 h-[300px] xs:h-[350px] sm:h-[400px] rounded-lg transition-all duration-500"></video>
            </div>
            
            <div className="relative w-full lg:w-1/2">

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-light text-black leading-tight tracking-wide">
               <span className="font-light text-[#D69F3F]">{t('about.page.companyName')}</span>
              </h2>
              
              <div className="space-y-6 text-sm xs:text-base sm:text-lg text-gray-600 leading-relaxed">
                <p>
                  {t('about.page.companyDescription1')}
                  </p>
                  <p>
                  {t('about.page.companyDescription2')}
                  </p>
                  <p>
                  {t('about.page.companyDescription3')}
                  </p>
              </div>
              
              <div className="mt-4">
                <Link 
                  href="/contact"
                  className="group inline-flex items-center bg-[#D69F3F] hover:bg-[#C4903A] text-white px-4 py-2  font-normal text-base xs:text-lg transition-all duration-300  hover: transform hover:scale-105"
                >
                  {t('about.page.getInTouch')}
                  <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


     
      {/* Vision Section */}
      <section className="bg-white relative overflow-hidden">
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-light text-black leading-tight tracking-wide mb-4">
                <span className="font-light text-gray-700">{t('about.page.vision.title')} </span>
              <span className="font-light text-[#D69F3F]">{t('about.page.vision.titleHighlight')}</span>
            </h2>
            
            <div className=" space-y-2">
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 ">
                {t('about.page.vision.description1')}
               </p>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                {t('about.page.vision.description2')}
              </p>
            </div>
          </div>

        </div>
      </section>
       <section className="relative overflow-hidden">
       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="relative w-full lg:w-1/2">
             <video src="https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/04/29070427/Day-2-Highlight-Video.mp4" controls className="w-full max-w-[600px] mx-auto lg:mx-0 h-[300px] xs:h-[350px] sm:h-[400px] rounded-lg transition-all duration-500"></video>
            </div>
            
            <div className="relative w-full lg:w-1/2">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-light text-black leading-tight tracking-wide mb-2">
               <span className="font-light text-[#D69F3F]">{t('about.page.services.title')}</span>
              </h2>
              
              <div className="space-y-6 text-sm xs:text-base sm:text-lg text-gray-600 leading-relaxed">
               <ul className="space-y-1">
                <li>- {t('about.page.services.luxuryRealEstate')}</li>
                <li>- {t('about.page.services.legalConsultation')}</li>
                <li>- {t('about.page.services.investmentManagement')}</li>
                <li>- {t('about.page.services.propertiesRent')}</li>
                <li>- {t('about.page.services.companyFormation')}</li>
                <li>- {t('about.page.services.conciergeServices')}</li>
               </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

  <section className="mt-12 mb-12 relative overflow-hidden">
     
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
           
            <div className="relative w-full lg:w-1/2 order-2 lg:order-1">

              <h2 className="text-lg xs:text-xl sm:text-2xl font-light text-black leading-tight tracking-wide">
               <span className="font-light text-black">{t('about.page.ceo.meetTitle')}</span>
              </h2>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-4xl font-light text-black leading-tight tracking-wide mb-2">
               <span className="font-light text-[#D69F3F]">{t('about.page.ceo.name')}</span>
              </h2>

              <div className="space-y-6 text-sm xs:text-base sm:text-lg text-gray-600 leading-relaxed">
                <p>
                  {t('about.page.ceo.description1')}
                </p>
                <p>
                  {t('about.page.ceo.description2')}
                </p>
              </div>

            </div>
             <div className="relative w-full lg:w-1/2 order-1 lg:order-2">
              <Image src={'https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/04/17084543/resizecom_WhatsApp-Image-2025-04-17-at-09.27.56-1536x1023.webp'} alt="About Us Image" width={600} height={400} className="w-full max-w-[600px] mx-auto lg:mx-0 rounded-lg transition-all duration-500"/>
            </div>
            
          </div>
        </div>
      </section>       
       {/* Team Section */}
      {/* <section className="mt-12 mb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
           
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-light text-black mb-2 leading-tight tracking-wide">
              <span className="font-light text-gray-700">{t('about.page.team.title')} </span>
              <span className="font-light text-[#D69F3F]">{t('about.page.team.titleHighlight')}</span>
            </h2>
           
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white  overflow-hidden shadow-lg hover: transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-[#D69F3F]-200 h-full">
                  
                  <div className="relative h-60 xs:h-72 sm:h-80 overflow-hidden">
                 
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D69F3F]-500/10 to-[#D69F3F]-500/10"></div>
                 
                    <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-center space-x-2 xs:space-x-3">
                       
                        <a 
                          href={`mailto:${member.social.email}`}
                          className="w-8 h-8 xs:w-10 xs:h-10 bg-white/90 backdrop-blur-sm  flex items-center justify-center text-gray-600 hover:bg-[#D69F3F]-600 hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 xs:p-6 text-center">
                    
                    <div className="mb-4">
                      <h3 className="text-lg xs:text-xl sm:text-2xl font-light text-black mb-3 group-hover:text-[#D69F3F] transition-colors duration-300">
                        {member.name}
                      </h3>
                      <div className="inline-block">
                        <p className="text-[#D69F3F] font-normal text-xs xs:text-sm uppercase tracking-wide bg-[#D69F3F]/10 px-3 xs:px-4 py-2 ">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section> */}
      {/* Enhanced CSS */}
      <style jsx global>{`
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        
        @media (max-width: 475px) {
          .xs\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        /* Custom hover effects */
        .team-card:hover .social-icons {
          transform: translateY(0);
          opacity: 1;
        }
        
        .social-icons {
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
        }
      `}</style>
       <CTASection />
    </div>
  );
};