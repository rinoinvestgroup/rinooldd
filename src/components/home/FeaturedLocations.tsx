import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

interface Location {
  id: number;
  name: string;
  country: string;
  image: string;
}

const FeaturedLocations = () => {
  const { t } = useLanguage();
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});
  const [retryCount, setRetryCount] = useState<{ [key: number]: number }>({});

  const handleImageError = (locationId: number) => {
    const currentRetryCount = retryCount[locationId] || 0;
    
    if (currentRetryCount < 2) {
      // Retry loading the image up to 2 times
      setRetryCount(prev => ({ ...prev, [locationId]: currentRetryCount + 1 }));
      // Force re-render to retry image loading
      setTimeout(() => {
        setLoadingImages(prev => ({ ...prev, [locationId]: true }));
      }, 1000);
    } else {
      setImageErrors(prev => ({ ...prev, [locationId]: true }));
      setLoadingImages(prev => ({ ...prev, [locationId]: false }));
    }
  };

  const handleImageLoad = (locationId: number) => {
    setLoadingImages(prev => ({ ...prev, [locationId]: false }));
  };

  const handleImageLoadStart = (locationId: number) => {
    setLoadingImages(prev => ({ ...prev, [locationId]: true }));
  };

  // Function to get the search URL for each location
  const getLocationSearchUrl = (location: Location) => {
    const basePath = location.country === 'Spain' ? '/properties/spain' : '/properties/dubai';
    const searchParams = new URLSearchParams();
    searchParams.set('city', location.name);
    
    return `${basePath}?${searchParams.toString()}`;
  };

  const locations: Location[] = [
    // 🇪🇸 Top 6 Spain cities (by property count)
    {
      id: 1,
      name: 'Marbella',
      country: 'Spain',
      image: '/images/cities/marbella.webp',
    },
    {
      id: 2,
      name: 'Malaga',
      country: 'Spain',
      image: '/images/cities/malaga.webp',
    },
    {
      id: 3,
      name: 'Estepona',
      country: 'Spain',
      image: '/images/cities/estepona.jpg',
    },
    {
      id: 4,
      name: 'Madrid',
      country: 'Spain',
      image: '/images/cities/madrid.webp',
    },
    {
      id: 5,
      name: 'Cádiz',
      country: 'Spain',
      image: '/images/cities/cadiz.jpg',
    },
    {
      id: 6,
      name: 'Benahavís',
      country: 'Spain',
      image: '/images/cities/benhavis.jpg',
    },
    // 🇦🇪 Top 6 Dubai/UAE cities (by property count)
    {
      id: 7,
      name: 'Jumeirah Village Circle',
      country: 'UAE',
      image: '/images/cities/jvc.webp',
    },
    {
      id: 8,
      name: 'Dubai Land',
      country: 'UAE',
      image: '/images/cities/duba-land.jpeg',
    },
    {
      id: 9,
      name: 'Majan',
      country: 'UAE',
      image: '/images/cities/majan.webp',
    },
    {
      id: 10,
      name: 'Al Barsha',
      country: 'UAE',
      image: '/images/cities/barsha.jpg',
    },
    {
      id: 11,
      name: 'Downtown Dubai',
      country: 'UAE',
      image: '/images/cities/downtown_duabi.webp',
    },
    {
      id: 12,
      name: 'Al Satwa',
      country: 'UAE',
      image: '/images/cities/satwa.webp',
    },
  ];

  const countries = [
    { key: 'All', label: t('locations.filterAll') },
    { key: 'Spain', label: t('locations.filterSpain') },
    { key: 'UAE', label: t('locations.filterUAE') },
  ];

  const filteredLocations = selectedCountry === 'All' 
    ? [
        // Top 3 Spain locations
        ...locations.filter(location => location.country === 'Spain').slice(0, 3),
        // Top 3 UAE locations
        ...locations.filter(location => location.country === 'UAE').slice(0, 3)
      ]
    : locations.filter(location => location.country === selectedCountry);

  return (
    <section className="relative py-8 overflow-hidden" aria-labelledby="premier-locations-heading">
     
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="text-center mb-6 sm:mb-8">
          <h2 id="premier-locations-heading" className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-light text-black tracking-wide mb-2 px-2">
            <span className="font-light text-gray-700">{t('locations.title')} </span>
            <span className="font-light text-[#D69F3F]">{t('locations.titleHighlight')}</span>
          </h2>
          
          <p className="text-sm xs:text-base sm:text-lg md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light px-4">
            {t('locations.subtitle')}
          </p>
        </header>

        {/* Country Filter */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 px-4" role="tablist" aria-label="Country filter">
          {countries.map((country) => (
            <button
              key={country.key}
              onClick={() => setSelectedCountry(country.key)}
              role="tab"
              aria-selected={selectedCountry === country.key}
              aria-controls="locations-grid"
              className={`flex items-center gap-2 sm:gap-3 px-3 xs:px-4 sm:px-8 py-2.5 xs:py-3 sm:py-4 font-medium text-xs xs:text-sm sm:text-sm transition-all duration-500 transform hover:scale-105 shadow-[5px] backdrop-blur-sm ${
                selectedCountry === country.key
                  ? 'bg-white/80 text-black shadow-lg border-[#D69F3F]'
                  : 'bg-white/80 hover:bg-gray-50 text-black hover:text-[#D69F3F] hover:border-[#D69F3F] shadow-lg'
              }`}
            >
              {country.key !== 'All' && (
                <div className="w-5 h-3 sm:w-6 sm:h-4 rounded-sm overflow-hidden shadow-sm flex flex-shrink-0">
                  {country.key === 'Spain' ? (
                    <Image src={'/images/spain_flag.svg'} alt="Spain Flag" width={30} height={16} className="flex-shrink-0"/>
                  ) : (
                    <>
                      <div className="w-1/4 bg-red-600 flex-shrink-0"></div>
                      <div className="w-3/4 flex flex-col">
                        <div className="h-1/3 bg-green-600"></div>
                        <div className="h-1/3 bg-white"></div>
                        <div className="h-1/3 bg-black"></div>
                      </div>
                    </>
                  )}
                </div>
              )}
              <span className="text-sm sm:text-base">{country.label}</span>
            </button>
          ))}
        </nav>

        {/* Locations Grid */}
        <div id="locations-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-20 px-4 sm:px-0" role="tabpanel">
          {filteredLocations.map((location, index) => (
            <Link
              key={location.id}
              href={getLocationSearchUrl(location)}
              className="group relative overflow-hidden hover: transition-all duration-700 transform hover:-translate-y-3 border border-slate-100/50 h-[380px] xs:h-[400px] sm:h-[420px] md:h-[450px] lg:h-[480px] flex flex-col justify-end cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`
              }}
              onMouseEnter={() => setActiveLocation(location.id)}
              onMouseLeave={() => setActiveLocation(null)}
              aria-label={`${t('locations.viewProperties')} ${location.name}`}
            >
              {/* Background Image using Next.js Image component */}
              <div className="absolute inset-0">
                {/* Loading placeholder */}
                {loadingImages[location.id] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-5">
                    <div className="text-gray-400">
                      <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                )}
                
                {!imageErrors[location.id] ? (
                  <Image
                    src={location.image}
                    alt={`${location.name}, ${location.country} - Premium real estate location`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                    quality={85}
                    onLoad={() => handleImageLoad(location.id)}
                    onLoadStart={() => handleImageLoadStart(location.id)}
                    onError={() => handleImageError(location.id)}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                ) : (
                  // Fallback background with city-specific gradient
                  <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${
                    location.country === 'Spain' 
                      ? 'bg-gradient-to-br from-red-800 via-yellow-700 to-red-900' 
                      : 'bg-gradient-to-br from-green-800 via-red-800 to-black'
                  } flex items-center justify-center`}>
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">
                        {location.country === 'Spain' ? '🏛️' : '🏙️'}
                      </div>
                      <h3 className="text-2xl font-light">{location.name}</h3>
                      <p className="text-sm opacity-70 mt-2">{t('locations.imageUnavailable')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              
              {/* Info and Button Row at Bottom */}
              <div className="absolute left-0 right-0 bottom-0 z-20 flex items-end justify-between p-3 xs:p-4 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                <div>
                  <h3 className="text-xl xs:text-2xl sm:text-3xl font-light text-white mb-1 xs:mb-2 tracking-wide text-left">{location.name}</h3>
                  <p className="text-white/90 text-xs xs:text-sm mb-2 xs:mb-3 font-light uppercase tracking-wider text-left">{location.country}</p>
                </div>
                <div className="group/btn p-1.5 xs:p-2 font-medium text-right transition-all duration-500 transform hover:scale-105 hover: flex items-center gap-3">
                  <svg className="w-5 h-5 xs:w-6 xs:h-6 text-white group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
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

export default FeaturedLocations;