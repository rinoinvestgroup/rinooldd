/**
 * Demo utility to test multilingual property content
 * This can be used to verify that the localized content functions work correctly
 */

import { Property, getLocalizedTitle, getLocalizedDescription, getLocalizedAmenities, getLocalizedFeatures } from '../data/properties';

// Sample multilingual property for demo purposes
export const sampleMultilingualProperty: Property = {
  id: 'demo-1',
  title: 'Luxury Waterfront Villa',
  title_ar: 'فيلا فاخرة على الواجهة المائية',
  title_zh: '豪华海滨别墅',
  title_es: 'Villa de Lujo Frente al Agua',
  title_de: 'Luxuriöse Wasserfront-Villa',
  slug: 'luxury-waterfront-villa-demo',
  location: 'Dubai Marina, UAE',
  city: 'Dubai',
  country: 'UAE',
  price: 'AED 15,000,000',
  priceStarting: false,
  beds: 5,
  baths: 6,
  area: '8500',
  images: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&q=80'
  ],
  type: 'Villa',
  featured: true,
  description: 'An exceptional waterfront villa offering unparalleled luxury and stunning views of Dubai Marina.',
  description_ar: 'فيلا استثنائية على الواجهة المائية تقدم رفاهية لا مثيل لها ومناظر خلابة لمرسى دبي.',
  description_zh: '一座卓越的海滨别墅，提供无与伦比的奢华体验和迪拜码头的壮丽景色。',
  description_es: 'Una villa excepcional frente al agua que ofrece lujo incomparable y vistas impresionantes de Dubai Marina.',
  description_de: 'Eine außergewöhnliche Wasserfront-Villa mit unvergleichlichem Luxus und atemberaubendem Blick auf Dubai Marina.',
  longDescription: 'This magnificent villa represents the pinnacle of luxury living in Dubai Marina.',
  amenities: ['Private Pool', 'Beach Access', 'Gym', 'Concierge Service'],
  amenities_ar: 'مسبح خاص، الوصول إلى الشاطئ، صالة رياضية، خدمة الكونسيرج',
  amenities_zh: '私人游泳池，海滩通道，健身房，礼宾服务',
  amenities_es: 'Piscina Privada, Acceso a la Playa, Gimnasio, Servicio de Conserjería',
  amenities_de: 'Privater Pool, Strandzugang, Fitnessstudio, Concierge-Service',
  features: ['Smart Home Technology', 'Floor-to-Ceiling Windows', 'Private Elevator', 'Rooftop Terrace'],
  features_ar: 'تقنية المنزل الذكي، نوافذ من الأرض إلى السقف، مصعد خاص، تراس على السطح',
  features_zh: '智能家居技术，落地窗，私人电梯，屋顶露台',
  features_es: 'Tecnología de Casa Inteligente, Ventanas de Piso a Techo, Ascensor Privado, Terraza en la Azotea',
  features_de: 'Smart-Home-Technologie, Bodentiefe Fenster, Privater Aufzug, Dachterrasse',
  yearBuilt: 2023,
  status: 'approved',
  listing_type: 'ready-to-move',
  property_type: 'buy',
  lat: 25.0657,
  lng: 55.1713
};

// Test function to demonstrate multilingual content
export const testMultilingualContent = (language: string) => {
  const title = getLocalizedTitle(sampleMultilingualProperty, language);
  const description = getLocalizedDescription(sampleMultilingualProperty, language);
  const amenities = getLocalizedAmenities(sampleMultilingualProperty, language);
  const features = getLocalizedFeatures(sampleMultilingualProperty, language);
  
  return {
    language,
    title,
    description,
    amenities,
    features,
    isValid: validateMultilingualProperty(sampleMultilingualProperty, language)
  };
};

// Validate that multilingual fields are properly handled
export const validateMultilingualProperty = (property: Property, language: string): boolean => {
  try {
    // Test that functions don't throw errors
    const title = getLocalizedTitle(property, language);
    const description = getLocalizedDescription(property, language);
    const amenities = getLocalizedAmenities(property, language);
    const features = getLocalizedFeatures(property, language);
    
    // Basic validation
    const isValid = (
      typeof title === 'string' && title.length > 0 &&
      (typeof description === 'string' || Array.isArray(description)) &&
      Array.isArray(amenities) &&
      Array.isArray(features)
    );
    
    return isValid;
  } catch (error) {
    return false;
  }
};
