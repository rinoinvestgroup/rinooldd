import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import agentsData from './agents.json';
import { findAgentBySlug, transformAgentData, Agent } from '../../utils/agentUtils';

// Extended Agent interface for profile pages
interface ExtendedAgent extends Agent {
  achievements: string[];
  education: string[];
  certifications: string[];
}

// Transform JSON data to match interface with extended fields
const transformExtendedAgentData = (jsonAgent: any, index: number): ExtendedAgent => {
  const baseAgent = transformAgentData(jsonAgent, index);
  return {
    ...baseAgent,
    // Add default values for missing fields
    achievements: [
      `${jsonAgent.experience || 0}+ Years Experience`,
      'Professional Real Estate Agent',
      'Client Satisfaction Excellence',
      'Market Knowledge Expert'
    ],
    education: [
      'Real Estate Professional Training',
      'Sales and Marketing Certification'
    ],
    certifications: [
      'RERA Licensed Agent',
      'Real Estate Sales Professional',
      'Property Consultant'
    ]
  };
};

// Data now comes from agents.json file

const AgentProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Find agent by slug or ID
  let agent: ExtendedAgent | null = null;
  
  if (id) {
    const slug = id as string;
    const result = findAgentBySlug(agentsData, slug);
    
    if (result) {
      agent = transformExtendedAgentData(result.agent, result.index);
    } else {
      // Fallback: try to find by ID if it's a number
      const numericId = parseInt(slug);
      if (!isNaN(numericId) && numericId > 0 && numericId <= agentsData.length) {
        agent = transformExtendedAgentData(agentsData[numericId - 1], numericId - 1);
      }
    }
  }

  if (!agent) {
    return (
      <Layout title="Agent Not Found">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-gray-900 mb-4">Agent Not Found</h1>
            <Link href="/agents" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">
              Back to Agents
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hello ${agent.name}, I'm interested in your real estate services. Could you please help me?`);
    window.open(`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Real Estate Inquiry');
    const body = encodeURIComponent(`Hello ${agent.name},\n\nI'm interested in your real estate services and would like to discuss my property needs.\n\nBest regards`);
    window.open(`mailto:${agent.email}?subject=${subject}&body=${body}`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": agent.name,
    "jobTitle": agent.position,
    "worksFor": {
      "@type": "RealEstateAgent",
      "name": "Rino Properties"
    },
    "knowsLanguage": agent.languages,
    "nationality": agent.nationality,
    "email": agent.email,
    "description": agent.bio,
    "image": agent.image
  };

  return (
    <>
      <Head>
        <title>{agent.name} | {agent.position} | Rino Properties</title>
        <meta name="description" content={`${agent.name}, ${agent.position} at Rino Properties Dubai. ${agent.bio.substring(0, 120)}`} />
        <meta name="keywords" content={`${agent.name}, real estate agent Dubai, ${agent.specialties.join(', ')}, property consultant Dubai, Rino Properties agent`} />
        <meta property="og:title" content={`${agent.name} | ${agent.position} | Rino Properties`} />
        <meta property="og:description" content={agent.bio} />
        <meta property="og:image" content={agent.image} />
        <meta property="og:type" content="profile" />
        <link rel="canonical" href={`https://rinoproperties.com/agents/${id}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <Layout 
        title={`${agent.name} | ${agent.position} | Rino Properties`}
        description={`${agent.name}, ${agent.position} at Rino Properties Dubai. Specializing in ${agent.specialties.slice(0, 3).join(', ')}.`}
        keywords={`${agent.name}, real estate agent Dubai, property consultant Dubai`}
        structuredData={structuredData}
        headerBg="text-black text-white bg-white logo-black"
      >
        <main className="min-h-screen bg-white pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/agents"
                className="inline-flex items-center text-gray-600 hover:text-[#D69F3F] transition-colors duration-300 group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Agents</span>
              </Link>
            </div>

            {/* Agent Profile Header */}
            <div className="bg-white/80 backdrop-blur-sm   border border-gray-100 overflow-hidden mb-8">
              <div className="md:flex">
                {/* Agent Image */}
                <div className="md:w-1/3">
                  <div className="relative h-96 md:h-full">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                    {/* Position Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-2  text-sm font-medium text-white backdrop-blur-sm ${
                        agent.position.includes('Head') ? 'bg-gradient-to-r from-[#D69F3F]/90 to-[#C4903A]/90' : 'bg-gradient-to-r from-blue-500/90 to-blue-600/90'
                      }`}>
                        {agent.position}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Agent Details */}
                <div className="md:w-2/3 p-8">
                  <h1 className="text-4xl font-light text-gray-900 mb-4">{agent.name}</h1>
                  
                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.languages.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800  text-sm font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Experience</h3>
                      <p className="text-2xl font-medium text-[#D69F3F]">{agent.experience} years</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Nationality</h3>
                      <p className="text-lg font-light text-gray-900">{agent.nationality}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-gradient-to-r from-[#D69F3F]/10 to-[#C4903A]/10 text-[#D69F3F]  text-sm font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleWhatsAppClick}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover: flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      onClick={handleEmailClick}
                      className="flex-1 bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#D69F3F] text-white py-4 px-6 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover: flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bio and Achievements */}
              <div className="space-y-8">
                {/* Bio */}
                <div className="bg-white/80 backdrop-blur-sm  shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-4">About {agent.name}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg font-light">{agent.bio}</p>
                </div>

                {/* Achievements */}
                <div className="bg-white/80 backdrop-blur-sm  shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Key Achievements</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {agent.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50/80 to-green-100/60 backdrop-blur-sm ">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600  mr-4"></div>
                        <span className="text-gray-800 font-light">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education and Certifications */}
              <div className="space-y-8">
                {/* Education */}
                <div className="bg-white/80 backdrop-blur-sm  shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Education</h2>
                  <div className="space-y-4">
                    {agent.education.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600  mt-3 mr-4"></div>
                        <span className="text-gray-700 font-light">{edu}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white/80 backdrop-blur-sm  shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Certifications</h2>
                  <div className="space-y-4">
                    {agent.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center p-4 bg-gradient-to-r from-[#D69F3F]/10 to-[#C4903A]/10 backdrop-blur-sm ">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#D69F3F]/20 to-[#C4903A]/20  flex items-center justify-center mr-4">
                          <svg className="w-4 h-4 text-[#D69F3F]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-800 font-light">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center bg-gradient-to-r from-[#D69F3F] to-[#C4903A]  p-12 text-white">
              <h2 className="text-3xl font-light mb-4">Ready to Work with {agent.name}?</h2>
              <p className="text-xl mb-8 opacity-90 font-light">
                Get in touch today to discuss your property needs and investment goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Message on WhatsApp
                </button>
                <button
                  onClick={handleEmailClick}
                  className="bg-white text-[#D69F3F] hover:bg-gray-100 px-8 py-4 font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default AgentProfilePage;
