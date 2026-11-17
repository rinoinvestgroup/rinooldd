import React from 'react';
import { Property } from '../data/properties';
import { useLanguage } from '../context/LanguageContext';

interface PropertyStatsProps {
  property: Property;
}

const PropertyStats: React.FC<PropertyStatsProps> = ({ property }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 py-6 md:py-8 border-t border-gray-100">
      {property.beds > 0 && (
        <div className="text-center p-3 md:p-0">
          <div className="text-xl md:text-2xl font-light text-gray-900 mb-1">{property.beds}</div>
          <div className="text-xs md:text-sm text-gray-500 font-light tracking-wide">
            {t('propertyDetails.stats.bedrooms', 'BEDROOMS')}
          </div>
        </div>
      )}
      {property.baths > 0 && (
        <div className="text-center p-3 md:p-0">
          <div className="text-xl md:text-2xl font-light text-gray-900 mb-1">{property.baths}</div>
          <div className="text-xs md:text-sm text-gray-500 font-light tracking-wide">
            {t('propertyDetails.stats.bathrooms', 'BATHROOMS')}
          </div>
        </div>
      )}
      {property.area && property.area.trim() && (
        <div className="text-center p-3 md:p-0 col-span-2 md:col-span-1">
          <div className="text-xl md:text-2xl font-light text-gray-900 mb-1">
            {property.area}
          </div>
          <div className="text-xs md:text-sm text-gray-500 font-light tracking-wide">
            {t('propertyDetails.stats.area', 'AREA')}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyStats;
