import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Decorative Elements */}
      {/* <div className="absolute top-20 right-20 w-64 h-64 bg-gray-100  blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#D69F3F]/20  blur-3xl"></div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-20 items-center">
          
          {/* Content Side */}
          <div className="space-y-8 lg:pr-8">
           
            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-light text-black leading-tight tracking-normal">
               <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-600">
                  {t('about.heading')}
                </span>
                {/* <span className="block text-sm font-light text-gray-600">
                  {isMounted ? t('about.subheading') : 'Where exceptional properties meet discerning clientele'}
                </span> */}
              </h2>
           
            </div>

            {/* Description */}
            <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-600 leading-relaxed">
              
              <p className="leading-relaxed">
                {t('about.description1')}
              </p>
              <p className="leading-relaxed">
                {t('about.description2')}
              </p>
              <p className="leading-relaxed">
                {t('about.description3')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/about"
                className="bg-[#D69F3F] hover:bg-[#C4903A] text-white px-6 sm:px-8 py-3  font-normal transition-all duration-300 text-center text-sm sm:text-base"
              >
                {t('about.ctaButton')}
              </Link>
              
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[400px]  overflow-hidden transform transition-transform duration-700 group">
            
               <Image
                src="/images/about.webp"
                alt="rino properties real estate"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

          </div>
        </div>

        {/* Feature Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="group text-center p-10 bg-white/90 backdrop-blur-sm   hover: transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50">
            <div className="w-20 h-20 bg-[#D69F3F]  flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-black mb-4">Exceptional Properties</h3>
            <p className="text-gray-600 leading-relaxed">Meticulously curated collection of ultra-luxury properties in the world's most prestigious locations.</p>
          </div>

          <div className="group text-center p-10 bg-white/90 backdrop-blur-sm   hover: transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50">
            <div className="w-20 h-20 bg-black  flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-black mb-4">Bespoke Advisory</h3>
            <p className="text-gray-600 leading-relaxed">Elite consultants with unparalleled market intelligence and white-glove personalized service.</p>
          </div>

          <div className="group text-center p-10 bg-white/90 backdrop-blur-sm   hover: transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50">
            <div className="w-20 h-20 bg-[#D69F3F]  flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-black mb-4">Legacy Excellence</h3>
            <p className="text-gray-600 leading-relaxed">Distinguished reputation with discerning clientele and flawlessly executed transactions worldwide.</p>
          </div>
        </div> */}

        {/* Additional Visual Content */}
        {/* <div className="mt-20 sm:mt-24 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-black tracking-wide px-4">
              Explore Our <span className="text-[#D69F3F] font-medium">Distinguished Portfolio</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-0">
            <div className="group relative h-48 sm:h-56 lg:h-64  overflow-hidden shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1">
              <Image
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center"
                alt="Marbella Villa"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <h4 className="font-light text-base sm:text-lg lg:text-xl tracking-wide">Marbella</h4>
                <p className="text-xs sm:text-sm opacity-90 font-light uppercase tracking-wider">Exclusive Villas</p>
              </div>
            </div>

            <div className="group relative h-48 sm:h-56 lg:h-64  overflow-hidden shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop&crop=center"
                alt="Barcelona Penthouse"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <h4 className="font-light text-base sm:text-lg lg:text-xl tracking-wide">Barcelona</h4>
                <p className="text-xs sm:text-sm opacity-90 font-light uppercase tracking-wider">Urban Penthouses</p>
              </div>
            </div>

            <div className="group relative h-48 sm:h-56 lg:h-64  overflow-hidden shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&crop=center"
                alt="Dubai Marina"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <h4 className="font-light text-base sm:text-lg lg:text-xl tracking-wide">Dubai Marina</h4>
                <p className="text-xs sm:text-sm opacity-90 font-light uppercase tracking-wider">Sky Residences</p>
              </div>
            </div>

            <div className="group relative h-48 sm:h-56 lg:h-64  overflow-hidden shadow-lg hover: transition-all duration-300 transform hover:-translate-y-1">
              <Image
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop&crop=center"
                alt="Abu Dhabi Waterfront"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <h4 className="font-light text-base sm:text-lg lg:text-xl tracking-wide">Abu Dhabi</h4>
                <p className="text-xs sm:text-sm opacity-90 font-light uppercase tracking-wider">Waterfront Estates</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;