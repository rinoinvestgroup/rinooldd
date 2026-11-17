import React, { useState } from 'react';
import ScheduleMeetingPopup from './ScheduleMeetingPopup';
import { trackContact, trackWhatsApp, trackButtonClick, trackMeetingSchedule } from '../utils/googleAnalytics';

const FloatingButtons: React.FC = () => {
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);


  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 sm:gap-4">
        {/* Schedule Meeting Button */}
        <button
          data-gtm-manual="true"
          onClick={() => {
            setIsMeetingOpen(true);
            trackMeetingSchedule('opened', 'floating_button');
            trackButtonClick('Schedule Meeting', 'floating_buttons');
            // Meta Pixel
            if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
              window.fbq('track', 'Schedule', { content_name: 'Meeting', content_category: 'floating_button' });
            }
          }}
          className="group bg-[#2563EB] hover:bg-[#1D4ED8] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Schedule a meeting"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Schedule a Meeting
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/97143212433?text=Hello%2C%20I%27m%20interested%20in%20your%20properties.%20Could%20you%20provide%20more%20information%3F"
          target="_blank"
          rel="noopener noreferrer"
          data-gtm-manual="true"
          onClick={() => {
            trackWhatsApp('+971 43 21 2433', 'floating_button', 'Property inquiry');
            // Meta Pixel
            if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
              window.fbq('track', 'Contact', { content_name: 'WhatsApp', content_category: 'floating_button' });
            }
          }}
          className="group bg-[#25D366] hover:bg-[#1DA851] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Contact us on WhatsApp"
        >
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488" />
          </svg>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Contact us on WhatsApp
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </a>

        {/* Phone Call Button */}
        <a
          href="tel:+97143212433"
          data-gtm-manual="true"
          onClick={() => {
            trackContact('phone', 'floating_button', {
              phone_number: '+971 43 21 2433',
            });
            // Meta Pixel
            if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
              window.fbq('track', 'Contact', { content_name: 'Phone', content_category: 'floating_button' });
            }
          }}
          className="group bg-[#D69F3F] hover:bg-[#C4903A] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Call us"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Call us
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </a>

        {/* Email Button */}
        <a
          href="mailto:ask@rinoproperties.com?subject=Property%20Inquiry&body=Hello%2C%0A%0AI%20am%20interested%20in%20learning%20more%20about%20your%20properties.%20Please%20provide%20me%20with%20additional%20information.%0A%0AThank%20you."
          data-gtm-manual="true"
          onClick={() => {
            trackContact('email', 'floating_button', {
              email_address: 'ask@rinoproperties.com',
            });
            // Meta Pixel
            if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
              window.fbq('track', 'Contact', { content_name: 'Email', content_category: 'floating_button' });
            }
          }}
          className="group bg-[#D69F3F] hover:bg-[#C4903A] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Send us an email"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Send us an email
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </a>
      </div>

      {/* Schedule Meeting Popup */}
      <ScheduleMeetingPopup
        isOpen={isMeetingOpen}
        onClose={() => setIsMeetingOpen(false)}
      />
    </>
  );
};

export default FloatingButtons;
