import { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { useLanguage } from '../../context/LanguageContext';
import agentsData from './agents.json';
import { transformAgentData, Agent } from '../../utils/agentUtils';

// Transform and use the JSON data
const agents: Agent[] = agentsData.map(transformAgentData);

// Get unique values for filters
const getUniqueLanguages = (agents: Agent[]) => {
  const languages = agents.flatMap(agent => agent.languages);
  return [...new Set(languages)].sort();
};

const getUniqueNationalities = (agents: Agent[]) => {
  const nationalities = agents.map(agent => agent.nationality);
  return [...new Set(nationalities)].sort();
};

const AgentsPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');

  const uniqueLanguages = useMemo(() => getUniqueLanguages(agents), []);
  const uniqueNationalities = useMemo(() => getUniqueNationalities(agents), []);

  // Filter agents based on search criteria
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = !selectedLanguage || agent.languages.includes(selectedLanguage);
      const matchesNationality = !selectedNationality || agent.nationality === selectedNationality;
      
      return matchesSearch && matchesLanguage && matchesNationality;
    });
  }, [searchTerm, selectedLanguage, selectedNationality]);

  const handleWhatsAppClick = useCallback((whatsapp: string, name: string) => {
    const message = encodeURIComponent(`Hello ${name}, I'm interested in your real estate services. Could you please help me?`);
    window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": "https://rinoproperties.com/#organization",
        "name": "Rino Properties",
        "alternateName": "Rino Invest Asset S.L.",
        "url": "https://rinoproperties.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://rinoproperties.com/images/logo.jpeg",
          "width": 600,
          "height": 60
        },
        "description": "Top real estate agents in Dubai and Spain offering expert property consultation and investment advisory services.",
        "address": [
          {
            "@type": "PostalAddress",
            "streetAddress": "C/ Ancha del Carmen, 2",
            "addressLocality": "Málaga",
            "postalCode": "29002",
            "addressCountry": "ES",
            "addressRegion": "Andalusia"
          },
          {
            "@type": "PostalAddress",
            "streetAddress": "Business Village Building - B, Office 330",
            "addressLocality": "Deira",
            "addressRegion": "Dubai",
            "addressCountry": "AE"
          }
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+34-635-955-137",
            "contactType": "customer service",
            "areaServed": "ES",
            "availableLanguage": ["English", "Spanish", "Arabic"],
            "email": "ask@rinoproperties.com"
          },
          {
            "@type": "ContactPoint",
            "telephone": "+971-43-21-2433",
            "contactType": "customer service",
            "areaServed": "AE",
            "availableLanguage": ["English", "Arabic"],
            "email": "ask@rinoproperties.com"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/p/Rino-Properties-61568133758317/",
          "https://www.instagram.com/rinoinvest_properties/",
          "https://ae.linkedin.com/company/rino-invest-properties",
          "https://www.tiktok.com/@rino.properties"
        ],
        "areaServed": [
          {
            "@type": "City",
            "name": "Dubai",
            "containedIn": {
              "@type": "Country",
              "name": "United Arab Emirates"
            }
          },
          {
            "@type": "Country",
            "name": "Spain"
          }
        ],
        "serviceType": ["Real Estate Sales", "Property Investment", "Property Management", "Property Consultation"],
        "employee": agents.map(agent => ({
          "@type": "Person",
          "@id": `https://rinoproperties.com/agents#${agent.name.toLowerCase().replace(/\s+/g, '-')}`,
          "name": agent.name,
          "jobTitle": agent.position,
          "knowsLanguage": agent.languages,
          "nationality": {
            "@type": "Country",
            "name": agent.nationality
          },
          "email": agent.email,
          "worksFor": {
            "@id": "https://rinoproperties.com/#organization"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": agent.languages
          },
          "image": agent.image
        })),
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": agents.length
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://rinoproperties.com/agents#webpage",
        "url": "https://rinoproperties.com/agents",
        "name": "Top Real Estate Agents in Dubai & Spain ",
        "description": "Meet our experienced team of real estate agents in Dubai and Spain. Expert property consultants offering personalized service for buying, selling, and investing in luxury properties.",
        "inLanguage": "en",
        "isPartOf": {
          "@id": "https://rinoproperties.com/#website"
        },
        "about": {
          "@id": "https://rinoproperties.com/#organization"
        },
        "breadcrumb": {
          "@id": "https://rinoproperties.com/agents#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://rinoproperties.com/images/team/team-hero.webp",
          "width": 1200,
          "height": 630
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://rinoproperties.com/agents?search={search_term_string}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://rinoproperties.com/agents#breadcrumb",
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
            "name": "Our Agents",
            "item": "https://rinoproperties.com/agents"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://rinoproperties.com/#website",
        "url": "https://rinoproperties.com",
        "name": "Rino Properties",
        "description": "Premium Real Estate in Spain and Dubai",
        "publisher": {
          "@id": "https://rinoproperties.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://rinoproperties.com/properties?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://rinoproperties.com/agents#agentlist",
        "name": "Real Estate Agents",
        "description": "List of professional real estate agents at Rino Properties",
        "numberOfItems": agents.length,
        "itemListElement": agents.map((agent, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Person",
            "@id": `https://rinoproperties.com/agents#${agent.name.toLowerCase().replace(/\s+/g, '-')}`,
            "name": agent.name,
            "jobTitle": agent.position,
            "knowsLanguage": agent.languages,
            "image": agent.image
          }
        }))
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://rinoproperties.com/agents#service",
        "name": "Real Estate Agent Services",
        "description": "Professional real estate consultation and property services in Dubai and Spain",
        "provider": {
          "@id": "https://rinoproperties.com/#organization"
        },
        "areaServed": [
          {
            "@type": "City",
            "name": "Dubai"
          },
          {
            "@type": "Country",
            "name": "Spain"
          }
        ],
        "serviceType": "Real Estate Consultation",
        "availableLanguage": [...new Set(agents.flatMap(agent => agent.languages))],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Real Estate Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Property Buying Consultation",
                "description": "Expert guidance for purchasing properties in Dubai and Spain"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Property Selling Services",
                "description": "Professional property selling and marketing services"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Investment Advisory",
                "description": "Real estate investment consultation and portfolio management"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Top Real Estate Agents in Dubai & Spain | Rino Properties Team</title>
        <meta name="description" content="Meet Rino Properties' expert team — 50+ RERA-licensed real estate agents in Dubai & Spain. Multilingual property consultants for buying, selling & investing. Book a free consultation." />
        <meta name="keywords" content="real estate agents Dubai, property consultants Spain, RERA licensed agents, best property advisor Dubai, multilingual real estate team, luxury property agents Dubai, investment advisor real estate, property broker Dubai, real estate consultant Málaga, off-plan specialist agent, buy property consultant, Dubai real estate team, book property viewing Dubai" />
        <meta property="og:title" content="Top Real Estate Agents in Dubai & Spain | Rino Properties Team" />
        <meta property="og:description" content="Connect with our expert real estate agents specializing in Dubai and Spain properties. Multilingual team with years of experience in luxury real estate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rinoproperties.com/agents" />
        <link rel="canonical" href="https://rinoproperties.com/agents" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <Layout 
        title="Top Real Estate Agents in Dubai & Spain | Rino Properties Team"
        description="Meet Rino Properties' expert team — 50+ RERA-licensed real estate agents in Dubai & Spain. Multilingual property consultants for buying, selling & investing. Book a free consultation."
        structuredData={structuredData}
        headerBg="text-black text-white bg-white logo-black"
      >
        <main className="min-h-screen bg-white to-gray-100 pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-[#D69F3F] transition-colors duration-300 group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">{t('agents.back', 'Back')}</span>
              </Link>
            </div>

            {/* Header Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-light text-gray-900 mb-6">
                {t('agents.title', 'Top Real Estate Agents in')} <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent">{t('agents.titleHighlight', 'Dubai')}</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
                {t('agents.description', 'If you are looking for top real estate agents in Dubai or Spain, you are in the right place. At Rino Properties, we bring together a team of experienced and trusted brokers dedicated to helping you buy, sell, or invest with confidence. Whether you are exploring luxury properties in Dubai or seeking your dream home in Spain, our experts offer tailored guidance, market insight, and a client-focused approach to ensure seamless transactions from start to finish.')}
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm   border border-gray-100 p-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search by Name */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('agents.search.title', 'Search by Agent Name')}
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder={t('agents.search.placeholder', 'Enter agent name...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm font-light"
                  />
                </div>

                {/* Language Filter */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('agents.search.language', 'Language')}
                  </label>
                  <select
                    id="language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm font-light"
                  >
                    <option value="">{t('agents.search.allLanguages', 'All Languages')}</option>
                    {uniqueLanguages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>

                {/* Nationality Filter */}
                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('agents.search.nationality', 'Nationality')}
                  </label>
                  <select
                    id="nationality"
                    value={selectedNationality}
                    onChange={(e) => setSelectedNationality(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D69F3F]/20 focus:border-[#D69F3F] transition-all duration-200 bg-white text-gray-900 shadow-sm font-light"
                  >
                    <option value="">{t('agents.search.allNationalities', 'All Nationalities')}</option>
                    {uniqueNationalities.map(nationality => (
                      <option key={nationality} value={nationality}>{nationality}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-600 text-lg font-light">
                {t('agents.results.showing', 'Showing')} <span className="font-medium text-[#D69F3F]">{filteredAgents.length}</span> {filteredAgents.length !== 1 ? t('agents.results.agents', 'agents') : t('agents.results.agent', 'agent')}
                {(searchTerm || selectedLanguage || selectedNationality) && (
                  <span className="ml-2">
                    {t('agents.results.matchingCriteria', 'matching your criteria')}
                  </span>
                )}
              </p>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="bg-white/80 backdrop-blur-sm  shadow-lg hover: transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group">
                  {/* Position Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1.5  text-xs font-medium text-white backdrop-blur-sm ${
                      agent.position.includes('Head') ? 'bg-gradient-to-r from-[#D69F3F]/90 to-[#C4903A]/90' : 'bg-gradient-to-r from-blue-500/90 to-blue-600/90'
                    }`}>
                      {agent.position}
                    </span>
                  </div>

                  {/* Agent Image */}
                  <div className="relative h-100 overflow-hidden">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Agent Details */}
                  <div className="p-6">
                    <h3 className="text-2xl font-light text-gray-900 mb-2">{agent.name}</h3>
                    
                    {/* Languages */}
                    <div className="mb-3">
                      <span className="text-sm font-light text-gray-500">{t('agents.card.speaks', 'Speaks: ')}</span>
                      <span className="text-sm font-medium text-blue-600">
                        {agent.languages.join(', ')}
                      </span>
                    </div>

                    {/* Experience */}
                    {/* <div className="mb-3">
                      <span className="text-lg font-medium text-[#D69F3F]">{agent.experience} {t('agents.card.yearsExperience', 'years')}</span>
                      <span className="text-gray-600 ml-1 font-light">{t('agents.card.ofExperience', 'of experience')}</span>
                    </div> */}

                    {/* Nationality */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 font-light">{t('agents.card.nationality', 'Nationality: ')}</span>
                      <span className="text-sm font-medium text-gray-700">{agent.nationality}</span>
                    </div>

                  
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                    
                      <button
                        onClick={() => handleWhatsAppClick(agent.whatsapp, agent.name)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4  font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover: flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        {t('agents.card.whatsapp', 'WhatsApp')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredAgents.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200  flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">{t('agents.noResults.title', 'No agents found')}</h3>
                <p className="text-gray-600 mb-6 font-light">{t('agents.noResults.message', 'Try adjusting your search criteria to find more agents.')}</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLanguage('');
                    setSelectedNationality('');
                   
                  }}
                  className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#D69F3F] text-white px-6 py-3  font-medium transition-all duration-300"
                >
                  {t('agents.noResults.clearFilters', 'Clear all filters')}
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-20 text-center bg-gradient-to-r from-[#D69F3F] to-[#C4903A]  p-12 text-white">
              <h2 className="text-3xl font-light mb-4">{t('agents.cta.title', 'Ready to Find Your Dream Property?')}</h2>
              <p className="text-xl mb-8 opacity-90 font-light">
                {t('agents.cta.description', 'Connect with our expert agents today and discover the perfect property in Dubai or Spain.')}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center bg-white text-[#D69F3F] px-8 py-4  font-medium text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t('agents.cta.getStarted', 'Get Started Today')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default AgentsPage;
