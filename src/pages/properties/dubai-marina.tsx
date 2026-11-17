import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../data/properties';
import { PropertiesApiService } from '../../services/propertiesApiService';
import { generateLocationTitle, generateLocationDescription, generateLocationKeywords } from '../../utils/competitorKeywords';

const DubaiMarinaPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const allProperties = await PropertiesApiService.getPropertiesByCategory('uae');
        
        // Filter for Dubai Marina properties
        const marinaProperties = allProperties.filter(property => 
          property.location?.toLowerCase().includes('dubai marina') ||
          property.location?.toLowerCase().includes('marina') ||
          property.city?.toLowerCase().includes('marina')
        );
        
        setProperties(marinaProperties);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const title = generateLocationTitle('dubai-marina');
  const description = generateLocationDescription('dubai-marina');
  const keywords = generateLocationKeywords('dubai-marina');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": "https://rinoproperties.com/properties/dubai-marina",
    "about": {
      "@type": "Place",
      "name": "Dubai Marina",
      "description": "Luxury waterfront community with world-class amenities and stunning skyline views"
    }
  };

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href="https://rinoproperties.com/properties/dubai-marina" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920')] bg-cover bg-center opacity-40" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Dubai Marina Apartments for Sale
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              Luxury Waterfront Living | Stunning Views | World-Class Amenities
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Dubai Marina Properties
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">
                Contact us for exclusive Dubai Marina listings
              </p>
              <a
                href="/contact"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
              >
                Get in Touch
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Why Dubai Marina */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Dubai Marina?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌊</div>
              <h3 className="text-xl font-bold mb-3">Waterfront Living</h3>
              <p className="text-gray-600">
                Stunning marina views and beachfront lifestyle at your doorstep
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">🏙️</div>
              <h3 className="text-xl font-bold mb-3">Urban Lifestyle</h3>
              <p className="text-gray-600">
                World-class dining, shopping, and entertainment options
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3">Investment Value</h3>
              <p className="text-gray-600">
                High rental yields and strong capital appreciation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Find Your Dream Home in Dubai Marina
          </h2>
          <p className="text-xl mb-8">
            Expert guidance for buying luxury apartments in Dubai Marina
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100"
          >
            Contact Our Experts
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default DubaiMarinaPropertiesPage;
