import React, { useState, useEffect } from 'react';
import { useForm } from '@formspree/react';
import { trackEvent, trackFormSubmission, trackLead, trackConversion } from '../utils/googleAnalytics';

interface ValuationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}



const ValuationPopup: React.FC<ValuationPopupProps> = ({ isOpen, onClose }) => {
  // Formspree form hook
  const [state, handleFormspreeSubmit] = useForm("xqadwgwb");
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    investment: '',
    propertyArea: '',
    currentValue: ''
  });

  // Custom submit handler that combines form data with Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track form submission start
    trackEvent('form_submit_start', {
      event_category: 'Lead Generation',
      event_label: 'Property Valuation Popup Form',
      custom_parameters: {
        form_name: 'valuation_popup',
      },
    });
    
    // Create FormData object for Formspree
    const formDataObj = new FormData(e.target as HTMLFormElement);
    
    // Call Formspree submit handler
    await handleFormspreeSubmit(formDataObj);
  };

  // Track & reset on successful submission (fire only once per succeeded flip)
  const hasTrackedRef = React.useRef(false);

  // Reset tracking guard when popup reopens or a new submission starts
  useEffect(() => {
    if (isOpen) hasTrackedRef.current = false;
  }, [isOpen]);

  useEffect(() => {
    if (state.succeeded && !hasTrackedRef.current) {
      hasTrackedRef.current = true;

      // Capture current form values before reset
      const location = formData.message || 'Dubai';
      const propertyType = formData.investment || 'Not specified';

      // Track successful form submission
      trackFormSubmission('Property Valuation Popup', 'valuation', {
        property_location: location,
        property_type: propertyType,
      });

      // Track lead generation
      trackLead('property_valuation', 10, 'valuation_popup', {
        property_location: location,
        property_type: propertyType,
      });

      // Track conversion for Google Ads
      trackConversion('valuation_lead', 10, 'AED', `lead_popup_${Date.now()}`);

      // Meta Pixel lead tracking
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: 'Property Valuation', content_category: 'valuation_popup' });
      }
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        investment: '',
        propertyArea: '',
        currentValue: ''
      });
      
      // Auto-close popup after successful submission (with delay for user to see success message)
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [state.succeeded, onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-normal text-gray-900">
                Free Property Valuation
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Get your property valued by certified experts
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Success/Error Messages */}
              {state.succeeded && (
                <div className="p-4 rounded-xl bg-green-50 text-green-700 text-center text-sm border border-green-200 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Thank you! We will contact you shortly for your free valuation.</span>
                </div>
              )}

              {state.errors && Object.keys(state.errors).length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-center text-sm border border-red-200">
                  Please check your information and try again.
                </div>
              )}
              
              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Phone Number */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Property Type */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <select
                  name="investment"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white transition-all hover:border-gray-300 appearance-none"
                  value={formData.investment}
                  onChange={e => setFormData({ ...formData, investment: e.target.value })}
                >
                  <option value="">Select Property Type</option>
                  <option value="studio">Studio</option>
                  <option value="1-bedroom">1 Bedroom</option>
                  <option value="2-bedroom">2 Bedroom</option>
                  <option value="3-bedroom">3 Bedroom</option>
                  <option value="4-bedroom">4+ Bedroom</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Location */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="message"
                  placeholder="Property Location (e.g. Downtown Dubai, Marina)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-300"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={state.submitting}
                className="w-full bg-gradient-to-r from-[#D69F3F] to-[#D69F3F] text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {state.submitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Get Free Property Valuation</span>
                  </span>
                )}
              </button>
            </form>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
              *Free valuation subject to property inspection. All information treated confidentially.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValuationPopup;
