import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../data/properties';
import { PropertiesApiService } from '../../services/propertiesApiService';
import { generateLocationTitle, generateLocationDescription, generateLocationKeywords } from '../../utils/competitorKeywords';

const JVCPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJVCProperties = async () => {
      try {
        setLoading(true);
        const allProperties = await PropertiesApiService.getPropertiesByCategory('uae');
        
        // Filter for JVC properties
        const jvcProperties = allProperties.filter(property => 
          property.location?.toLowerCase().includes('jvc') ||
          property.location?.toLowerCase().includes('jumeirah village circle') ||
          property.title?.toLowerCase().includes('jvc') ||
          property.title?.toLowerCase().includes('south residence') ||
          property.title?.toLowerCase().includes('city apartments')
        );
        
        setProperties(jvcProperties);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJVCProperties();
  }, []);

  const title = generateLocationTitle('jvc');
  const description = generateLocationDescription('jvc');
  const keywords = generateLocationKeywords('jvc');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": "https://rinoproperties.com/properties/jvc",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://rinoproperties.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Properties",
          "item": "https://rinoproperties.com/properties"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "JVC Properties",
          "item": "https://rinoproperties.com/properties/jvc"
        }
      ]
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What properties are available in JVC Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JVC (Jumeirah Village Circle) offers South Residence apartments, City Apartments, hotel apartments, studios, and luxury residential units. Properties range from affordable studios to spacious family apartments."
          }
        },
        {
          "@type": "Question",
          "name": "Why invest in JVC Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JVC offers excellent ROI, family-friendly community, modern amenities, easy access to Sheikh Zayed Road, and more affordable prices compared to Dubai Marina or Downtown Dubai."
          }
        },
        {
          "@type": "Question",
          "name": "What amenities are available in JVC?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "JVC features parks, schools, supermarkets, restaurants, gyms, swimming pools, children's play areas, and The Perfect Blend café. Most properties include parking, security, and maintenance services."
          }
        }
      ]
    }
  };

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href="https://rinoproperties.com/properties/jvc" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920')] bg-cover bg-center opacity-30" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              JVC Properties for Sale
              <span className="block text-2xl md:text-3xl mt-4 text-blue-200">
                Jumeirah Village Circle Dubai
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              Discover South Residence, City Apartments & Premium Hotel Apartments
            </p>
            <div className="flex flex-wrap gap-4 text-white">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>{properties.length}+ Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Prime Location</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span>Best ROI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About JVC Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Jumeirah Village Circle (JVC)
              </h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  <strong>Jumeirah Village Circle (JVC)</strong> is one of Dubai's most sought-after residential communities, offering a perfect blend of modern living and family-friendly amenities.
                </p>
                <p>
                  Located strategically near Sheikh Zayed Road, JVC provides easy access to key Dubai landmarks while maintaining a peaceful, suburban atmosphere with parks, schools, and recreational facilities.
                </p>
                <p>
                  Popular developments include <strong>South Residence JVC</strong>, <strong>City Apartments</strong>, and various hotel apartment complexes offering excellent investment opportunities with strong rental yields.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">8-10%</div>
                  <div className="text-gray-700">Annual ROI</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15 min</div>
                  <div className="text-gray-700">to Dubai Marina</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Key Features</h3>
              <ul className="space-y-3">
                {[
                  'Family-friendly community with parks and playgrounds',
                  'Modern apartments and hotel apartments',
                  'Excellent connectivity to Sheikh Zayed Road',
                  'Schools, supermarkets, and retail outlets',
                  'Gyms, swimming pools, and sports facilities',
                  'Affordable property prices with high ROI',
                  'Pet-friendly developments',
                  'Secure gated communities',
                  'The Perfect Blend café and dining options',
                  'Easy access to Dubai\'s major business districts'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Listing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Properties in JVC
            </h2>
            <p className="text-xl text-gray-600">
              South Residence, City Apartments & More
            </p>
          </div>

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
                No properties currently available in JVC. New listings coming soon!
              </p>
              <a
                href="/properties/dubai"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Dubai Properties
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Invest in JVC Properties?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-4">High ROI</h3>
              <p className="text-blue-100">
                JVC offers one of the best rental yields in Dubai, with annual returns ranging from 8-10%, making it ideal for property investors.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold mb-4">Family Living</h3>
              <p className="text-blue-100">
                Perfect for families with numerous parks, schools, nurseries, and child-friendly amenities throughout the community.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-4">Strategic Location</h3>
              <p className="text-blue-100">
                Close to Dubai Marina, JBR, and Downtown Dubai. Easy access to Sheikh Zayed Road and major business districts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Invest in JVC?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact our expert team for personalized property recommendations in Jumeirah Village Circle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us Today
            </a>
            <a
              href="/properties/dubai"
              className="inline-block bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View All Dubai Properties
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JVCPropertiesPage;
