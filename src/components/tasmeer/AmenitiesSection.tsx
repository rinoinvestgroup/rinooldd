import React from 'react';

interface AmenitiesSectionProps {
  tTasmeer: (key: string, fallback: string) => string;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ tTasmeer }) => {
  const amenities = [
    {
      icon: (
        <img src={'/images/tasmeer/icons/swimming-pool.png'} alt="Swimming Pool" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.swimmingPool', 'Swimming Pool'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/Sunken-qhgomcueu4tb3fcz71uvh76tfo8g3fjojg3fc7t7k0-qtyi4pc50tslug7r6gn8co7qoxb9j1j8yysbcxsps0.png'} alt="Indoor Gym" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.indoorGym', 'Indoor Gym'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/playground.png'} alt="Kids Play Area" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.kidsPlayArea', 'Kids Play Area'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/barbecue.png'} alt="Barbecue Area" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.barbecueRooftop', 'Barbecue Area Rooftop'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/yoga.png'} alt="Yoga Station" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.outdoorYogaStation', 'Outdoor Yoga Station'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/smart-home.png'} alt="Jogging Track" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.joggingTrack', 'Jogging Track'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/transport.png'} alt="Business Lounge" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.businessLounge', 'Business Lounge'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/co-working.png'} alt="Co Working Space" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.coWorkingSpace', 'Co Working Space'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/bath.png'} alt="Sauna Bath" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.saunaBath', 'Sauna Bath'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/steam-room-1.png'} alt="Steam Room" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.steamRoom', 'Steam Room'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/clubhouse.png'} alt="Club House" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.clubHouse', 'Club House'),
    },
    {
      icon: (
        <img src={'/images/tasmeer/icons/growth.png'} alt="Green Area" className="w-8 h-8" />
      ),
      title: tTasmeer('amenities.greenArea', 'Green Area'),
    }
  ];

  return (
    <section id="amenities" className="py-16 md:py-20 lg:py-24 bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            {tTasmeer('amenities.sectionTitle', 'FEATURES & AMENITIES')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[#2C3E35] leading-tight" style={{fontFamily: 'Montserrat, sans-serif'}}>
            {tTasmeer('amenities.mainTitle', 'World-Class Amenities')}
          </h2>
        
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-[#2C3E35] group-hover:text-[#B8883A] transition-colors duration-300">
                  {amenity.icon}
                </div>
                {/* Title */}
                <h3 className="text-sm font-medium text-[#2C3E35] leading-tight">
                  {amenity.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
