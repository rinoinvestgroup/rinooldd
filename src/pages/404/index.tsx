import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';

const NotFoundPage: React.FC = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Auto-redirect countdown timer
    if (!isRedirecting) return;

    if (countdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router, isRedirecting]);

  const translations = {
    en: {
      title: '404 - Page Not Found',
      heading: 'Oops! Page Not Found',
      description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      homeButton: 'Go to Homepage',
      propertiesButton: 'Browse Properties',
      contactButton: 'Contact Us',
      searchPlaceholder: 'Search our site...',
      redirectMessage: 'Redirecting to homepage in',
      seconds: 'seconds',
      cancelRedirect: 'Cancel Auto-Redirect',
    },
    ar: {
      title: '404 - الصفحة غير موجودة',
      heading: 'عذراً! الصفحة غير موجودة',
      description: 'الصفحة التي تبحث عنها قد تكون قد أزيلت أو تغير اسمها أو غير متاحة مؤقتاً.',
      homeButton: 'الذهاب للصفحة الرئيسية',
      propertiesButton: 'تصفح العقارات',
      contactButton: 'اتصل بنا',
      searchPlaceholder: 'ابحث في موقعنا...',
      redirectMessage: 'إعادة التوجيه إلى الصفحة الرئيسية في',
      seconds: 'ثواني',
      cancelRedirect: 'إلغاء إعادة التوجيه التلقائي',
    },
    es: {
      title: '404 - Página No Encontrada',
      heading: '¡Vaya! Página No Encontrada',
      description: 'La página que buscas puede haber sido eliminada, cambiado de nombre o no está disponible temporalmente.',
      homeButton: 'Ir a la Página Principal',
      propertiesButton: 'Ver Propiedades',
      contactButton: 'Contáctenos',
      searchPlaceholder: 'Buscar en nuestro sitio...',
      redirectMessage: 'Redirigiendo a la página principal en',
      seconds: 'segundos',
      cancelRedirect: 'Cancelar Redirección Automática',
    },
    zh: {
      title: '404 - 页面未找到',
      heading: '哎呀！页面未找到',
      description: '您正在寻找的页面可能已被删除、更名或暂时不可用。',
      homeButton: '返回首页',
      propertiesButton: '浏览房产',
      contactButton: '联系我们',
      searchPlaceholder: '搜索我们的网站...',
      redirectMessage: '将在',
      seconds: '秒后重定向到主页',
      cancelRedirect: '取消自动重定向',
    },
    de: {
      title: '404 - Seite Nicht Gefunden',
      heading: 'Hoppla! Seite Nicht Gefunden',
      description: 'Die gesuchte Seite wurde möglicherweise entfernt, umbenannt oder ist vorübergehend nicht verfügbar.',
      homeButton: 'Zur Startseite',
      propertiesButton: 'Immobilien Durchsuchen',
      contactButton: 'Kontaktieren Sie Uns',
      searchPlaceholder: 'Durchsuchen Sie unsere Website...',
      redirectMessage: 'Weiterleitung zur Startseite in',
      seconds: 'Sekunden',
      cancelRedirect: 'Automatische Umleitung Abbrechen',
    },
    fa: {
      title: '404 - صفحه یافت نشد',
      heading: 'اوه! صفحه یافت نشد',
      description: 'صفحه‌ای که به دنبال آن هستید ممکن است حذف شده، تغییر نام داده یا موقتاً در دسترس نباشد.',
      homeButton: 'برو به صفحه اصلی',
      propertiesButton: 'مشاهده املاک',
      contactButton: 'تماس با ما',
      searchPlaceholder: 'جستجو در سایت ما...',
      redirectMessage: 'هدایت به صفحه اصلی در',
      seconds: 'ثانیه',
      cancelRedirect: 'لغو هدایت خودکار',
    },
    hi: {
      title: '404 - पृष्ठ नहीं मिला',
      heading: 'उफ़! पृष्ठ नहीं मिला',
      description: 'आप जिस पृष्ठ की तलाश कर रहे हैं वह हटाया गया हो सकता है, उसका नाम बदला गया हो सकता है, या अस्थायी रूप से अनुपलब्ध हो सकता है।',
      homeButton: 'होमपेज पर जाएं',
      propertiesButton: 'संपत्तियां ब्राउज़ करें',
      contactButton: 'संपर्क करें',
      searchPlaceholder: 'हमारी साइट खोजें...',
      redirectMessage: 'होमपेज पर पुनर्निर्देशित करना',
      seconds: 'सेकंड में',
      cancelRedirect: 'स्वचालित पुनर्निर्देशन रद्द करें',
    },
    ur: {
      title: '404 - صفحہ نہیںملا',
      heading: 'افسوس! صفحہ نہیں ملا',
      description: 'جس صفحے کی آپ تلاش کر رہے ہیں وہ ہٹایا گیا ہو سکتا ہے، اس کا نام تبدیل کیا گیا ہو سکتا ہے، یا عارضی طور پر دستیاب نہیں ہے۔',
      homeButton: 'ہوم پیج پر جائیں',
      propertiesButton: 'پراپرٹیز دیکھیں',
      contactButton: 'ہم سے رابطہ کریں',
      searchPlaceholder: 'ہماری سائٹ تلاش کریں...',
      redirectMessage: 'ہوم پیج پر ری ڈائریکٹ کر رہے ہیں',
      seconds: 'سیکنڈ میں',
      cancelRedirect: 'خودکار ری ڈائریکشن منسوخ کریں',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <Layout>
      <Head>
        <title>{t.title} </title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content={t.description} />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
              404
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.heading}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
            {t.description}
          </p>

          {/* Auto-Redirect Countdown */}
          {isRedirecting && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg 
                  className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-blue-700 dark:text-blue-300 font-medium">
                  {t.redirectMessage} <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{countdown}</span> {t.seconds}
                </p>
              </div>
              <button
                onClick={() => setIsRedirecting(false)}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                {t.cancelRedirect}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {t.homeButton}
            </Link>
            
            <Link
              href="/properties/dubai"
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg shadow-lg border-2 border-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              {t.propertiesButton}
            </Link>
            
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {t.contactButton}
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Popular pages you might be looking for:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/about" className="text-blue-600 hover:text-blue-800 underline">
                About Us
              </Link>
              <Link href="/properties/dubai" className="text-blue-600 hover:text-blue-800 underline">
                Properties
              </Link>
              <Link href="/blog" className="text-blue-600 hover:text-blue-800 underline">
                Blog
              </Link>
              <Link href="/agents" className="text-blue-600 hover:text-blue-800 underline">
                Our Agents
              </Link>
              <Link href="/sell" className="text-blue-600 hover:text-blue-800 underline">
                Sell Property
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
