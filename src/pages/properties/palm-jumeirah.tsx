import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import PropertyCard from '../../components/PropertyCard';
import { Property } from '../../data/properties';
import { PropertiesApiService } from '../../services/propertiesApiService';
import { generateLocationTitle, generateLocationDescription, generateLocationKeywords } from '../../utils/competitorKeywords';

const PalmJumeirahPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const allProperties = await PropertiesApiService.getPropertiesByCategory('uae');
        
        // Filter for Palm Jumeirah properties
        const palmProperties = allProperties.filter(property => 
          property.location?.toLowerCase().includes('palm jumeirah') ||
          property.location?.toLowerCase().includes('palm') ||
          property.title?.toLowerCase().includes('palm jumeirah')
        );
        
        setProperties(palmProperties);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const title = generateLocationTitle('palm-jumeirah');
  const description = generateLocationDescription('palm-jumeirah');
  const keywords = generateLocationKeywords('palm-jumeirah');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": "https://rinoproperties.com/properties/palm-jumeirah",
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What types of properties are available in Palm Jumeirah?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Palm Jumeirah offers luxury apartments, penthouses, beachfront villas, and exclusive resort residences with private beach access."
          }
        },
        {
          "@type": "Question",
          "name": "Is Palm Jumeirah a good investment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Palm Jumeirah is one of Dubai's most prestigious addresses with strong capital appreciation and rental yields of 5-7% annually."
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
        <link rel="canonical" href="https://rinoproperties.com/properties/palm-jumeirah" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      {/* Hero */}
      <section className="relative h-[70vh] bg-gradient-to-br from-amber-900 to-amber-700">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920')] bg-cover bg-center opacity-40" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Palm Jumeirah Real Estate
            </h1>
            <p className="text-2xl mb-8">
              Luxury Apartments & Villas on Dubai\'s Iconic Island
            </p>
            <div className="flex gap-4 text-lg">
              <div>🏖️ Private Beaches</div>
              <div>🌴 Resort Living</div>
              <div>⭐ Exclusive Properties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Palm Jumeirah Properties for Sale</h2>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">
                Exclusive Palm Jumeirah properties available by request
              </p>
              <a href="/contact" className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700">
                Contact Us
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Palm Jumeirah Lifestyle</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🏖️', title: 'Private Beaches', desc: 'Exclusive beach access' },
              { icon: '🏨', title: '5-Star Hotels', desc: 'Atlantis, Waldorf Astoria' },
              { icon: '🍽️', title: 'Fine Dining', desc: 'World-class restaurants' },
              { icon: '🎯', title: 'Premium Amenities', desc: 'Luxury facilities' }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-amber-50 rounded-lg">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Buy Your Dream Property in Palm Jumeirah</h2>
          <p className="text-xl mb-8">Expert guidance for luxury real estate investment</p>
          <a href="/contact" className="inline-block bg-white text-amber-700 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100">
            Schedule a Viewing
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default PalmJumeirahPropertiesPage;
