import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { CheckCircle, Calendar, MapPin, Clock, Phone, Mail, ArrowLeft, Download, Share2 } from 'lucide-react';

const MadridRoadshowThankYou = () => {
  const eventDetails = {
    venue: "Wellington Hotel & Spa, Madrid",
    dates: "November 20–22, 2025",
    timing: "11:00 AM – 9:00 PM daily",
    contact: "ask@rinoproperties.com",
    phone: "+34 911 234 567"
  };

  const nextSteps = [
    {
      icon: <Mail className="w-6 h-6 text-rino-red-500" />,
      title: "Confirmation Email",
      description: "You'll receive a confirmation email within 24 hours with your appointment details and event information."
    },
    {
      icon: <Phone className="w-6 h-6 text-rino-yellow-500" />,
      title: "Personal Contact",
      description: "Our team will contact you within 2 business days to confirm your preferred time slot and answer any questions."
    },
    {
      icon: <Calendar className="w-6 h-6 text-rino-red-500" />,
      title: "Event Reminder",
      description: "We'll send you event reminders and additional information about featured properties and investment opportunities."
    }
  ];

  const eventHighlights = [
    "Exclusive property showcases and private viewings",
    "One-on-one consultations with our expert advisors",
    "Investment strategy sessions and market insights",
    "Golden Visa and residency program consultations",
    "Networking opportunities with fellow investors",
    "Refreshments and luxury hospitality"
  ];

  return (
    <>
      <Head>
        <title>Registration Confirmed - Madrid Roadshow | RINO</title>
        <meta name="description" content="Thank you for registering! Your Madrid Roadshow 2025 appointment is confirmed. We'll contact you soon with event details and exclusive opportunities." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <Layout 
        title="Registration Confirmed - Madrid Roadshow 2025"
        description="Thank you for registering for the Madrid Roadshow 2025."
        noIndex={true}
        className="bg-gradient-to-br from-gray-50 to-white"
      >
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Registration Confirmed
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                Welcome to the
                <br />
                <span className="bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 bg-clip-text text-transparent">
                  Madrid Roadshow 2025
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Thank you for registering! We&apos;re excited to meet you and help you discover 
                <br className="hidden md:block" />
                <span className="text-rino-red-500 font-semibold"> exclusive investment opportunities</span> in Dubai and Spain.
              </p>

              {/* Event Details Card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                    <MapPin className="w-8 h-8 text-rino-red-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Venue</h3>
                    <p className="text-gray-600 text-sm">{eventDetails.venue}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                    <Calendar className="w-8 h-8 text-rino-yellow-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Dates</h3>
                    <p className="text-gray-600 text-sm">{eventDetails.dates}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl">
                    <Clock className="w-8 h-8 text-rino-red-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Timing</h3>
                    <p className="text-gray-600 text-sm">{eventDetails.timing}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  href="/madrid-roadshow-2025"
                  className="inline-flex items-center bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 hover:from-rino-red-600 hover:to-rino-yellow-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Event Details
                </Link>
                <button className="inline-flex items-center border-2 border-rino-yellow-500 text-rino-yellow-600 hover:bg-rino-yellow-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {nextSteps.map((step, index) => (
                  <div key={index} className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-rino-red-50 to-rino-yellow-50 p-8 rounded-2xl border border-rino-red-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h3>
                  <p className="text-gray-600 mb-6">Our team is here to help with any questions about your registration or the event.</p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <a 
                      href={`mailto:${eventDetails.contact}`}
                      className="inline-flex items-center text-rino-red-600 hover:text-rino-red-800 font-semibold transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      {eventDetails.contact}
                    </a>
                    <a 
                      href={`tel:${eventDetails.phone}`}
                      className="inline-flex items-center text-rino-yellow-600 hover:text-rino-yellow-800 font-semibold transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      {eventDetails.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Highlights Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">What to Expect at the Event</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 mx-auto rounded-full mb-6"></div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get ready for an exclusive experience designed to maximize your investment opportunities.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {eventHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-200">{highlight}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-rino-red-500/20 to-rino-yellow-500/20 p-8 rounded-2xl border border-rino-red-500/30">
                  <h3 className="text-2xl font-bold mb-4 text-rino-yellow-500">Exclusive Pre-Event Resources</h3>
                  <p className="text-gray-300 mb-6">
                    Download our investment guide and property brochures to prepare for the event.
                  </p>
                  <button className="inline-flex items-center bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 hover:from-rino-red-600 hover:to-rino-yellow-600 text-white px-8 py-3 rounded-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    Download Event Materials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Discover Your Next 
                <span className="bg-gradient-to-r from-rino-red-500 to-rino-yellow-500 bg-clip-text text-transparent"> Investment Opportunity?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We look forward to welcoming you to Madrid and helping you explore the finest properties in Dubai and Spain.
              </p>
              
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Save the Date</h3>
                <div className="text-lg text-gray-700 space-y-2">
                  <p><strong>Event:</strong> RINO Properties Madrid Roadshow 2025</p>
                  <p><strong>Dates:</strong> {eventDetails.dates}</p>
                  <p><strong>Venue:</strong> {eventDetails.venue}</p>
                  <p><strong>Time:</strong> {eventDetails.timing}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 italic">
                    &ldquo;Discover. Connect. Grow with Confidence.&rdquo;
                  </p>
                  <p className="text-sm text-gray-400 mt-2">- RINO Properties Team</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default MadridRoadshowThankYou;