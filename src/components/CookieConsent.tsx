/**
 * CookieConsent Component
 * 
 * A simple fixed bottom bar cookie consent with Accept/Decline buttons
 * 
 * @component
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  getCookieConsent,
  setCookieConsent,
  setCookiePreferences,
  getDefaultPreferences,
  type CookiePreferences,
} from '@/utils/cookies';

export default function CookieConsent() {
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted before checking cookies to prevent hydration mismatch
    setMounted(true);
    
    // Check if user has already consented
    const hasConsent = getCookieConsent();
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    

    setCookieConsent(true);
    setCookiePreferences(allAccepted);
    setShowBanner(false);
    
    // Reload to apply tracking scripts
    window.location.reload();
  };

  const handleDecline = () => {
    const necessaryOnly = getDefaultPreferences();
    
    setCookieConsent(true);
    setCookiePreferences(necessaryOnly);
    setShowBanner(false);
  };

  // Handle escape key
  useEffect(() => {
    if (!mounted) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBanner) {
        handleDecline();
      }
    };

    if (showBanner) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [mounted, showBanner]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted || !showBanner) return null;

  return (
    <div
      className="fixed bottom-0  left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-2xl animate-slideUp"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Cookie Message */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm sm:text-base text-gray-700">
              {router.locale === 'ar' 
                ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. من خلال الاستمرار، فإنك توافق على استخدامنا لملفات تعريف الارتباط.'
                : 'We use cookies to enhance your experience. By continuing, you consent to our use of cookies.'
              }
              {' '}
              <Link 
                href="/cookie-policy" 
                className="text-blue-600 hover:text-blue-700 underline font-medium"
                aria-label={router.locale === 'ar' ? 'اقرأ سياسة ملفات تعريف الارتباط الخاصة بنا' : 'Read our cookie policy'}
              >
                {router.locale === 'ar' ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}
              </Link>
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label={router.locale === 'ar' ? 'رفض' : 'Decline cookies'}
            >
              {router.locale === 'ar' ? 'رفض' : 'Decline'}
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={router.locale === 'ar' ? 'قبول' : 'Accept cookies'}
            >
              {router.locale === 'ar' ? 'قبول' : 'Accept'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
