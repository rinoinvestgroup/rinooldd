import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

const CookiePolicyPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>Cookie Policy | Rino Properties</title>
        <meta name="description" content="Cookie Policy for Rino Properties — learn how we use cookies and tracking technologies to improve your experience on our Dubai & Spain real estate website." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rinoproperties.com/cookie-policy" />
      </Head>

      <Layout 
        title="Cookie Policy | Rino Properties"
        description="Cookie Policy for Rino Properties — learn how we use cookies and tracking technologies to improve your experience on our Dubai & Spain real estate website."
        keywords="cookie policy, Rino Properties cookies, real estate website privacy, tracking technologies"
      >
        <div className="min-h-screen bg-white pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-[#D69F3F] transition-colors duration-300 group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4">
                Cookie <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent">Policy</span>
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-medium text-green-900 mb-2">What are Cookies?</h2>
                <p className="text-green-800 font-light">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience and enable certain features of our real estate platform.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">1. How We Use Cookies</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  Rino Properties uses cookies and similar tracking technologies to enhance your experience on our website. We use cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>To remember your preferences and settings</li>
                  <li>To analyze website traffic and user behavior</li>
                  <li>To provide personalized property recommendations</li>
                  <li>To improve website functionality and performance</li>
                  <li>To deliver relevant content and advertisements</li>
                  <li>To enable social media features and integrations</li>
                  <li>To prevent fraud and ensure website security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">2. Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-3">🔧 Strictly Necessary Cookies</h3>
                    <p className="text-gray-600 mb-3 font-light">
                      These cookies are essential for the website to function properly and cannot be disabled.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 font-light space-y-1">
                      <li>Session management and user authentication</li>
                      <li>Security and fraud prevention</li>
                      <li>Load balancing and performance optimization</li>
                      <li>Cookie consent preferences</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-3">📊 Analytics Cookies</h3>
                    <p className="text-gray-600 mb-3 font-light">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 font-light space-y-1">
                      <li>Google Analytics for website traffic analysis</li>
                      <li>Property search and inquiry tracking</li>
                      <li>User journey and conversion analysis</li>
                      <li>Blog engagement and content performance</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-3">🎯 Marketing Cookies</h3>
                    <p className="text-gray-600 mb-3 font-light">
                      These cookies are used to deliver relevant advertisements and marketing content.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 font-light space-y-1">
                      <li>Google Ads and conversion tracking</li>
                      <li>Facebook Pixel for social media advertising</li>
                      <li>Retargeting and remarketing campaigns</li>
                      <li>Newsletter subscription tracking</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-3">⚙️ Functional Cookies</h3>
                    <p className="text-gray-600 mb-3 font-light">
                      These cookies enable enhanced functionality and personalization.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 font-light space-y-1">
                      <li>Language and region preferences</li>
                      <li>Property search filters and saved searches</li>
                      <li>Contact form auto-fill features</li>
                      <li>Chat and customer support functions</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">3. Third-Party Cookies</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  Our website may contain cookies from third-party services that we use to enhance functionality:
                </p>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Google Services</h4>
                    <p className="text-gray-600 text-sm font-light">Google Analytics, Google Ads, Google Maps for tracking and mapping functionality</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Social Media Platforms</h4>
                    <p className="text-gray-600 text-sm font-light">Facebook, Instagram, LinkedIn, TikTok for social sharing and advertising</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Communication Tools</h4>
                    <p className="text-gray-600 text-sm font-light">WhatsApp Business, Email service providers, Live chat services</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Content Delivery</h4>
                    <p className="text-gray-600 text-sm font-light">CDNs, Image hosting services, Video hosting platforms</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">4. Cookie Duration</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We use both session cookies and persistent cookies:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
                  <li><strong>Analytics Cookies:</strong> Typically expire after 2 years</li>
                  <li><strong>Marketing Cookies:</strong> Usually expire after 30-90 days</li>
                  <li><strong>Functional Cookies:</strong> May persist for 1-2 years depending on the feature</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">5. Managing Your Cookie Preferences</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">Browser Settings</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  You can control and manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>View cookies stored on your device</li>
                  <li>Delete existing cookies</li>
                  <li>Block cookies from specific sites</li>
                  <li>Block third-party cookies</li>
                  <li>Delete cookies when you close your browser</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Browser-Specific Instructions</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Chrome</h4>
                    <p className="text-gray-600 text-sm font-light">Settings &gt; Privacy and security &gt; Cookies and other site data</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Firefox</h4>
                    <p className="text-gray-600 text-sm font-light">Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Safari</h4>
                    <p className="text-gray-600 text-sm font-light">Preferences &gt; Privacy &gt; Manage Website Data</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Edge</h4>
                    <p className="text-gray-600 text-sm font-light">Settings &gt; Cookies and site permissions &gt; Cookies and site data</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-medium text-yellow-900 mb-2">⚠️ Important Note</h4>
                  <p className="text-yellow-800 font-light">
                    Disabling certain cookies may affect the functionality of our website and your user experience. Some features may not work properly if essential cookies are blocked.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">6. Opt-Out Options</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  You can opt out of specific tracking services:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#D69F3F] hover:text-[#C4903A]" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                  <li><strong>Google Ads:</strong> <a href="https://www.google.com/settings/ads" className="text-[#D69F3F] hover:text-[#C4903A]" target="_blank" rel="noopener noreferrer" aria-label="Manage Google advertising preferences">Google Ad Settings</a></li>
                  <li><strong>Facebook:</strong> <a href="https://www.facebook.com/settings?tab=ads" className="text-[#D69F3F] hover:text-[#C4903A]" target="_blank" rel="noopener noreferrer" aria-label="Manage Facebook advertising preferences">Facebook Ad Preferences</a></li>
                  <li><strong>Industry Opt-out:</strong> <a href="http://www.aboutads.info/choices/" className="text-[#D69F3F] hover:text-[#C4903A]" target="_blank" rel="noopener noreferrer" aria-label="Opt out of targeted advertising through Digital Advertising Alliance">Digital Advertising Alliance Opt-Out</a></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">7. Mobile Devices</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  On mobile devices, you can manage tracking through device settings:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li><strong>iOS:</strong> Settings &gt; Privacy &amp; Security &gt; Tracking</li>
                  <li><strong>Android:</strong> Settings &gt; Privacy &gt; Ads &gt; Opt out of Ads Personalization</li>
                  <li>You can also reset your advertising ID to limit targeted advertising</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">8. Updates to This Policy</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">9. Contact Us</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-2"><strong>Rino Properties</strong></p>
                  <p className="text-gray-600 mb-1">General Contact: <a href="mailto:ask@rinoproperties.com" className="text-[#D69F3F] hover:text-[#C4903A]">ask@rinoproperties.com</a></p>
                  <p className="text-gray-600 mb-1">Spain Office: +34 635 955 137</p>
                  <p className="text-gray-600 mb-1">Dubai Office: +971 43 21 2433</p>
                  <p className="text-gray-600">Address: C/ Ancha del Carmen, 2 - 29002 Málaga, Spain</p>
                </div>
              </section>
            </div>

            {/* Related Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Policies</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy-policy" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CookiePolicyPage;
