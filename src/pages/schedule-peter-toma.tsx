import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import ScheduleMeetingPopup from '../components/ScheduleMeetingPopup';

const ScheduleMeetingPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Automatically open popup when page loads
  useEffect(() => {
    setIsPopupOpen(true);
  }, []);

  // Handle popup close - redirect to home page
  const handleClose = () => {
    setIsPopupOpen(false);
    // Optional: redirect to home page after closing
    // router.push('/');
  };

  return (
    <>
      <Head>
        <title>Schedule a Meeting with Peter Toma | Rino Properties</title>
        <meta name="description" content="Book a consultation with Peter Toma, expert property advisor at Rino Properties. Discuss Dubai real estate investment opportunities." />
        <meta name="keywords" content="schedule meeting Peter Toma, property consultation Dubai, Dubai real estate advisor" />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Schedule a Meeting with Peter Toma | Rino Properties" />
        <meta property="og:description" content="Book a consultation with Peter Toma - expert property advisor at Rino Properties" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rinoproperties.com/schedule-peter-toma" />
        <link rel="canonical" href="https://rinoproperties.com/schedule-peter-toma" />
      </Head>

      <Layout 
        title="Schedule a Meeting with Peter Toma | Rino Properties"
        description="Book a consultation with Peter Toma, expert property advisor at Rino Properties. Discuss Dubai real estate investment opportunities."
        noIndex={true}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Schedule Your Meeting
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Book a consultation with Peter Toma, our expert property advisor, to discuss your investment goals
            </p>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-4 text-gray-700">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-lg">Flexible Scheduling</span>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-gray-700">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">15-45 Minute Sessions</span>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-gray-700">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-lg">Meet with Peter Toma</span>
                </div>
              </div>

              <button
                onClick={() => setIsPopupOpen(true)}
                className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Open Scheduler
              </button>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-3 text-gray-900">Strategy Session with Peter</h3>
                <p className="text-gray-600">15-minute focused session with Peter Toma on investment strategies and exclusive opportunities</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-3 text-gray-900">Property Viewing with Peter</h3>
                <p className="text-gray-600">30-minute personalized property viewing with Peter Toma, our expert property advisor</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-xl mb-3 text-gray-900">Full Consultation with Peter</h3>
                <p className="text-gray-600">45-minute comprehensive consultation with Peter Toma about market trends and ROI analysis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Meeting Popup - Opens automatically */}
        <ScheduleMeetingPopup
          isOpen={isPopupOpen}
          onClose={handleClose}
          attendeeEmail="peter.toma@rinoproperties.com"
          imageSrc="/images/team/peter.png"
        />
      </Layout>
    </>
  );
};

export default ScheduleMeetingPage;
