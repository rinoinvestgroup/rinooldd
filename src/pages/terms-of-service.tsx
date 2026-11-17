import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

const TermsOfServicePage = () => {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>Terms of Service | Rino Properties</title>
        <meta name="description" content="Terms of Service for Rino Properties — legal terms and conditions for using our Dubai & Spain real estate services, property listings and website." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rinoproperties.com/terms-of-service" />
      </Head>

      <Layout 
        title="Terms of Service | Rino Properties"
        description="Terms of Service for Rino Properties — legal terms and conditions for using our Dubai & Spain real estate services, property listings and website."
        keywords="terms of service, Rino Properties terms, real estate terms and conditions, property listing terms"
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
                Terms of <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent">Service</span>
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-medium text-amber-900 mb-2">Agreement to Terms</h2>
                <p className="text-amber-800 font-light">
                  By accessing and using the Rino Properties website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">1. Definitions</h2>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li><strong>"Company"</strong> refers to Rino Properties, Rino invest Asset S.L.</li>
                  <li><strong>"Service"</strong> refers to the real estate services, website, and related platforms provided by the Company</li>
                  <li><strong>"User"</strong> refers to any individual or entity using our services</li>
                  <li><strong>"Content"</strong> refers to property listings, blog posts, images, and other materials on our platform</li>
                  <li><strong>"Personal Data"</strong> has the meaning set forth in our Privacy Policy</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">2. Use of Our Services</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">Permitted Use</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  You may use our services for legitimate real estate purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>Browsing property listings and market information</li>
                  <li>Contacting us for property inquiries and consultations</li>
                  <li>Reading and sharing our blog content</li>
                  <li>Subscribing to newsletters and updates</li>
                  <li>Requesting property valuations and market analysis</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Prohibited Use</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  You agree not to use our services for:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>Any unlawful purpose or in violation of applicable laws</li>
                  <li>Transmitting spam, viruses, or malicious code</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Scraping or harvesting data without permission</li>
                  <li>Impersonating another person or entity</li>
                  <li>Interfering with the proper functioning of our services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">3. Property Listings and Information</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">Information Accuracy</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  While we strive to provide accurate and up-to-date property information, we cannot guarantee the completeness or accuracy of all listings. Property details, prices, and availability are subject to change without notice.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Third-Party Properties</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  Many properties listed on our platform are owned by third parties. We act as intermediaries and are not responsible for the condition, legal status, or ownership of these properties.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">No Guarantee of Sale</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  Listing a property on our platform does not guarantee a sale or rental. We provide marketing and consultation services but cannot promise specific outcomes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">4. User Content and Data</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">User-Generated Content</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  When you submit information, reviews, or other content, you grant us a non-exclusive, worldwide license to use, modify, and display such content for business purposes.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Data Collection</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We collect and process personal data as described in our <Link href="/privacy-policy" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">Privacy Policy</Link>. By using our services, you consent to such collection and processing.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">5. Intellectual Property Rights</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  All content on our website, including text, graphics, logos, images, and software, is the property of Rino Properties or its licensors and is protected by copyright and other intellectual property laws.
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>You may not reproduce, distribute, or create derivative works without permission</li>
                  <li>Property photos and descriptions may be subject to third-party copyrights</li>
                  <li>Our trademarks and service marks may not be used without authorization</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">6. Real Estate Services</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">Professional Services</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We provide real estate consultation, property search, and related services. Our agents are licensed professionals, but we recommend obtaining independent legal and financial advice for any property transactions.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Commission and Fees</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  Our service fees and commission structures will be clearly disclosed before any agreement. Fees may vary based on property type, location, and services required.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Market Conditions</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  Real estate markets are subject to fluctuations. We provide market analysis based on available data, but cannot predict future market conditions or guarantee investment returns.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">7. Disclaimers and Limitations</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">Service Availability</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We strive to maintain continuous service availability but do not guarantee uninterrupted access. Services may be temporarily unavailable due to maintenance, technical issues, or other factors.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Limitation of Liability</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  To the maximum extent permitted by law, Rino Properties shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">8. Privacy and Data Protection</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We are committed to protecting your privacy and complying with applicable data protection laws, including GDPR and local privacy regulations. Please review our <Link href="/privacy-policy" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">Privacy Policy</Link> for detailed information about our data practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">9. Termination</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We reserve the right to terminate or suspend your access to our services at our sole discretion, without prior notice, for any violation of these terms or for any other reason we deem appropriate.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">10. Governing Law</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of Spain and the United Arab Emirates, depending on the jurisdiction of the service provided. Any disputes shall be resolved in the competent courts of the respective jurisdiction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">12. Contact Information</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
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
                <Link href="/cookie-policy" className="text-[#D69F3F] hover:text-[#C4903A] font-medium" aria-label="Read our Cookie Policy">
                  Cookie Policy
                </Link>
                <Link href="/contact" className="text-[#D69F3F] hover:text-[#C4903A] font-medium" aria-label="Contact Us">
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

export default TermsOfServicePage;
