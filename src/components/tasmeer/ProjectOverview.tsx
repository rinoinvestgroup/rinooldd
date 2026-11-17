import React, { useState } from 'react';

const ProjectOverview: React.FC = () => {

  // Modal states for amenities
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [currentAmenitiesIndex, setCurrentAmenitiesIndex] = useState(0);

  // Amenities modal functions
  const openAmenitiesModal = (index: number) => {
    setCurrentAmenitiesIndex(index);
    setIsAmenitiesModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

   // Amenities data organized by categories
      const amenitiesData = [
        {
          category: "The Aquatic Experience",
          icon: "🏊‍♂️",
          color: "bg-blue-500",
          amenities: [
            "Swimming Pool",
            "Sunbathing Area", 
            "Sunken Seating",
            "Water Aerobics Area",
            "Splash Park"
          ]
        },
        {
          category: "Wellness & Restoration",
          icon: "🧘‍♀️", 
          color: "bg-green-500",
          amenities: [
            "Outdoor Yoga Station",
            "Zen Garden",
            "Indoor Aerobic Studio", 
            "Steam Room / Sauna",
            "Male & Female Restrooms"
          ]
        },
        {
          category: "The Elite Fitness Suite",
          icon: "💪",
          color: "bg-red-500", 
          amenities: [
            "Indoor Gym",
            "Outdoor Gym",
            "Jogging Track"
          ]
        },
        {
          category: "Business & Social Hubs", 
          icon: "🤝",
          color: "bg-purple-500",
          amenities: [
            "Business Lounge",
            "Co-Working Spaces",
            "Library",
            "Meeting Area",
            "Club House",
            "Barbecue Area (Social)",
            "Outdoor Seating Spaces (Social)"
          ]
        },
        {
          category: "Family & Recreation",
          icon: "👨‍👩‍👧‍👦",
          color: "bg-orange-500",
          amenities: [
            "Kids Pool",
            "Kids Play Area", 
            "Kids Wall Climbing",
            "Little Explorers Lounge",
            "Table Tennis",
            "VR & Gaming Room",
            "Football (Recreational Area)"
          ]
        }
      ];
    
  return (
    <section id="overview" className="py-16 lg:py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Images */}
          <div className="relative">
            {/* Main building image */}
            <div className="relative">
              <img 
                src="/images/tasmeer/img1.png"
                alt="Fahid Beach Residences - Luxury waterfront building exterior"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
              
            </div>
            
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="space-y-2">
             
              <h2 className="text-xl font-light text-gray-900 leading-tight text-start" style={{fontFamily:'Montserrat, sans-serif'}}>
                Project Overview
              </h2>
            </div>

           
            <p className="text-gray-600 text-lg leading-relaxed mt-6">
              Rino Properties, in collaboration with Tasmeer Indigo Properties, is introducing SquareX One, an architectural beacon of sophistication and class. Our commitment is to deliver quality that defines luxury.
            </p>

          </div>
        </div>
      </div>

        {/* Amenities Section */}
        <section id="amenities" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <p className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-3 sm:mb-4">
                Discover Lifestyle
              </p>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-light text-white leading-tight text-center" style={{fontFamily:'Montserrat, sans-serif'}}>
                World-Class Amenities
              </h2>
            </div>

            {/* Amenities Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
              {amenitiesData.map((category, index) => (
                <div 
                  key={category.category}
                  className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 hover:transform hover:-translate-y-2"
                  onClick={() => openAmenitiesModal(index * 5)} // Open modal with first image of category
                >
                  {/* Category Header */}
                  <div className="flex items-center mb-6">
                   
                    <h3 className="text-white font-medium text-xm leading-tight">
                      {category.category}
                    </h3>
                  </div>

                  {/* Amenities List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {category.amenities.map((amenity, amenityIndex) => (
                      <div 
                        key={amenityIndex}
                        className="flex items-center text-gray-300 group-hover:text-white transition-colors duration-300"
                      >
                        <div className="w-1 h-1 bg-amber-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-[14px]">{amenity}</span>
                      </div>
                    ))}
                  </div>

                
                </div>
              ))}
            </div>
          </div>
        </section>

    </section>
  );
};

export default ProjectOverview;
