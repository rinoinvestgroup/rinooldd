import React, { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';

interface HeaderProps {
  isScrolled?: boolean;
  onOpenContactPopup?: (formType: string) => void;
}

const Header: React.FC<HeaderProps> = ({ isScrolled: isScrolledProp = false, onOpenContactPopup }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Formspree form hook
  const [state, handleFormspreeSubmit] = useForm("xanpvjyz");
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBrochureDownload = () => {
    const pdfUrl = 'https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/binghatti-vintage.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Binghatti-Vintage-Brochure.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShowBrochureModal = () => {
    setShowContactModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object for Formspree
    const formDataObj = new FormData(e.target as HTMLFormElement);
    
    // Call Formspree submit handler
    await handleFormspreeSubmit(formDataObj);
  };

  // Handle successful form submission
  useEffect(() => {
    if (state.succeeded) {
      // Download the brochure
      handleBrochureDownload();
      
      // Close modal and reset form
      setShowContactModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
      });
    }
  }, [state.succeeded]);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white backdrop-blur-md shadow-lg' 
        : ''
    }`}>
      <div className="max-w-7xl  mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4 md:py-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              {/* Rino Logo */}
              <div className="flex items-center space-x-2">
                 <img 
                    src={"https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/08/13043344/Logo-6-01-new.png"} 
                    alt={"Rino Properties colored logo"} 
                    className={`w-20 h-5 xs:w-24 xs:h-6 sm:w-28 sm:h-7 md:w-32 md:h-8 lg:w-36 lg:h-9 transition-all duration-300 ${
                      isScrolled ? 'filter-none' : 'filter'
                    }`} 
                    onClick={() => window.location.href = '#'}
                  />
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`relative p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 group ${
                isScrolled 
                  ? 'text-white hover:text-gray-600 hover:bg-gray-100/80' 
                  : 'text-white hover:text-gray-600 hover:bg-white/20'
              }`}
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4 lg:mx-8">
            <nav className="flex items-center space-x-4 lg:space-x-8">  
              {['Home', 'Amenities', 'Gallery', 'Floor Plans', 'Location'].map((section) => (
                <a 
                  key={section}
                  href={`#${section.toLowerCase().replace(' ', '')}`} 
                  className={`relative px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-all duration-300 uppercase tracking-wider rounded-lg group ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-gray-900' 
                      : 'text-white hover:text-gray-900'
                  }`}
                >
                  <span className="relative z-10">{section}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-3/4 rounded-full"></div>
                </a>
              ))}
            </nav>
          </div>
            
          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Get Brochure Button */}
            {/* <button 
              onClick={() => {
                if (onOpenContactPopup) {
                  onOpenContactPopup('getDetails');
                } else {
                  handleShowBrochureModal();
                }
              }}
              className="relative px-4 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold !rounded-lg transition-all duration-300 whitespace-nowrap hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#FFFFFF', color: '#2C3E35' }}
            >
              Get Brochure
            </button> */}

            {/* Call Button */}
            <a 
              href="tel:+971547647485"
              className={`relative px-4 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold rounded-lg transition-all duration-300 whitespace-nowrap hover:scale-105 border-2 flex items-center space-x-2 ${
                isScrolled 
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                  : 'border-white/50 text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call</span>
            </a>
          </div>
        </div>
        
        {/* Mobile navigation menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-3 sm:pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        } bg-white shadow-lg rounded-lg mt-2 mx-1 sm:mx-2`}>
          <nav className="flex flex-col space-y-1 p-1 sm:p-2">
            {['Home', 'Amenities', 'Gallery', 'Floor Plans', 'Location'].map((section) => (
              <a 
                key={section}
                href={`#${section.toLowerCase().replace(' ', '')}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium transition-colors uppercase tracking-wide py-2.5 sm:py-3 px-3 sm:px-4 rounded-md text-center text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {section}
              </a>
            ))}
            
           {/* Call Button */}
              <a 
                href="tel:+971547647485"
                className="text-xs font-semibold transition-all py-2.5 px-3 rounded-lg text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call</span>
              </a>
          </nav>
        </div>
      </div>

      {/* Contact Modal for Brochure Download */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 min-h-screen">
          <div className="bg-white rounded-lg max-w-md w-full mx-auto my-auto max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="p-6 text-center">
              {/* Modal Header */}
              <div className="relative mb-6">
                <h3 className="text-xl font-semibold text-gray-900 text-center">
                  Download Brochure
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {state.succeeded && (
                  <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-800 text-center text-sm font-medium border border-green-200">
                    Thank you! Your brochure download will start shortly.
                  </div>
                )}
                
                {state.errors && Object.keys(state.errors).length > 0 && (
                  <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-800 text-center text-sm font-medium border border-red-200">
                    Please check your form and try again.
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                  <ValidationError 
                    prefix="First Name" 
                    field="firstName"
                    errors={state.errors}
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                  <ValidationError 
                    prefix="Last Name" 
                    field="lastName"
                    errors={state.errors}
                  />
                </div>
                
                <div className="flex">
                  <div className="flex items-center justify-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 min-w-[80px]">
                    <span className="mr-1 text-sm">🇦🇪</span>
                    <span className="text-gray-700 text-sm">+971</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 ps-1 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <ValidationError 
                  prefix="Phone" 
                  field="phone"
                  errors={state.errors}
                />
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                  />
                </div>

                <input type="hidden" name="formType" value="Brochure Download Request" />
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="flex-1 px-4 py-3 bg-[#B8883A] text-white rounded-lg font-medium hover:bg-[#A07632] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.submitting ? 'Submitting...' : 'Download Brochure'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;