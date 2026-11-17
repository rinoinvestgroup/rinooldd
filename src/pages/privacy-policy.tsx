import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>Privacy Policy | Rino Properties</title>
        <meta name="description" content="Privacy Policy for Rino Properties — how we collect, use and protect your data when using our Dubai & Spain real estate services and property listings." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rinoproperties.com/privacy-policy" />
      </Head>

      <Layout 
        title="Privacy Policy | Rino Properties"
        description="Privacy Policy for Rino Properties — how we collect, use and protect your data when using our Dubai & Spain real estate services and property listings."
        keywords="privacy policy, Rino Properties privacy, real estate data protection, personal information policy"
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
                Privacy <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent">Policy</span>
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-medium text-blue-900 mb-2">Important Notice</h2>
                <p className="text-blue-800 font-light">
                  This Privacy Policy explains how Rino Properties ("we," "our," or "us") collects, uses, and protects your personal information when you use our website and services for property listings, blog content, and real estate consultations.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>Contact us through our contact forms or inquiry forms</li>
                  <li>Subscribe to our newsletter or blog updates</li>
                  <li>Request property information or schedule viewings</li>
                  <li>Create an account on our website</li>
                  <li>Interact with our customer service team</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">Types of Personal Data</h3>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Property preferences and search criteria</li>
                  <li>Financial information (for qualified inquiries)</li>
                  <li>Communication history and preferences</li>
                  <li>IP address and browser information</li>
                  <li>Website usage data and analytics</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>To provide and improve our real estate services</li>
                  <li>To respond to your inquiries and property requests</li>
                  <li>To send you property listings that match your criteria</li>
                  <li>To communicate about our services and market updates</li>
                  <li>To personalize your website experience</li>
                  <li>To analyze website usage and improve our platform</li>
                  <li>To comply with legal obligations and regulations</li>
                  <li>To send newsletters and blog updates (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>With property owners or developers when you inquire about their properties</li>
                  <li>With trusted service providers who assist in our operations</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Secure hosting and data storage facilities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience on our website. For detailed information about our cookie practices, please review our <Link href="/cookie-policy" className="text-[#D69F3F] hover:text-[#C4903A] font-medium" aria-label="Read our Cookie Policy">Cookie Policy</Link>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">6. Your Rights and Choices</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 font-light space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
                </ul>
                <p className="text-gray-600 mb-4 font-light">
                  To exercise these rights, please contact us at <a href="mailto:ask@rinoproperties.com" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">ask@rinoproperties.com</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Specific retention periods depend on the type of information and the purpose for which it was collected.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">8. International Data Transfers</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  As we operate in both Spain and Dubai, your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers are conducted in accordance with applicable data protection laws and implement appropriate safeguards.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-600 mb-4 font-light leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
                <Link href="/terms-of-service" className="text-[#D69F3F] hover:text-[#C4903A] font-medium">
                  Terms of Service
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

export default PrivacyPolicyPage;
