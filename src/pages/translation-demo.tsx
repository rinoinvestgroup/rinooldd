import React, { useState } from 'react';
import Head from 'next/head';
import { useAutoTranslation } from '../hooks/useAutoTranslation';
import { useLanguage } from '../context/LanguageContext';
import AutoTranslate from '../components/AutoTranslate';
import LanguageSwitcher from '../components/LanguageSwitcher';

const TranslationDemo: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { translateText, isTranslating } = useAutoTranslation();
  const [inputText, setInputText] = useState('Welcome to our luxury real estate platform');
  const [translatedText, setTranslatedText] = useState('');

  const handleManualTranslation = async () => {
    if (inputText.trim()) {
      const result = await translateText(inputText, language);
      setTranslatedText(result);
    }
  };

  const sampleContent = {
    title: "Luxury Real Estate in Dubai",
    description: "Discover premium properties with stunning views and world-class amenities. Our expert team provides personalized service to help you find the perfect investment opportunity.",
    features: [
      "Prime locations with excellent connectivity",
      "State-of-the-art facilities and amenities", 
      "High return on investment potential",
      "Professional property management services"
    ],
    callToAction: "Contact us today to schedule a viewing"
  };

  return (
    <>
      <Head>
        <title>Translation Demo | Rino Properties</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={`min-h-screen bg-gray-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <AutoTranslate>Auto-Translation Demo</AutoTranslate>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            <AutoTranslate>
              Experience real-time content translation powered by advanced AI translation services
            </AutoTranslate>
          </p>
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Current Language Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            <AutoTranslate>Current Language Settings</AutoTranslate>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700">
                <AutoTranslate>Active Language</AutoTranslate>
              </h3>
              <p className="text-2xl font-bold text-blue-900">{language.toUpperCase()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700">
                <AutoTranslate>Text Direction</AutoTranslate>
              </h3>
              <p className="text-2xl font-bold text-green-900">
                {isRTL ? 'RTL' : 'LTR'}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700">
                <AutoTranslate>Translation Status</AutoTranslate>
              </h3>
              <p className="text-2xl font-bold text-purple-900">
                {isTranslating ? '🔄' : '✅'}
              </p>
            </div>
          </div>
        </div>

        {/* Manual Translation Demo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            <AutoTranslate>Manual Translation</AutoTranslate>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AutoTranslate>Enter text to translate:</AutoTranslate>
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter your text here..."
              />
            </div>
            <button
              onClick={handleManualTranslation}
              disabled={isTranslating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {isTranslating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <AutoTranslate>Translating...</AutoTranslate>
                </>
              ) : (
                <AutoTranslate>Translate Text</AutoTranslate>
              )}
            </button>
            {translatedText && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">
                  <AutoTranslate>Translation Result:</AutoTranslate>
                </h3>
                <p className="text-gray-900">{translatedText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Auto-Translation Demo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">
            <AutoTranslate>Automatic Content Translation</AutoTranslate>
          </h2>
          
          {/* Sample Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <AutoTranslate>{sampleContent.title}</AutoTranslate>
              </h3>
              <p className="text-gray-700 mb-4">
                <AutoTranslate>{sampleContent.description}</AutoTranslate>
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                <AutoTranslate>Key Features:</AutoTranslate>
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {sampleContent.features.map((feature, index) => (
                  <li key={index}>
                    <AutoTranslate>{feature}</AutoTranslate>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 font-medium">
                <AutoTranslate>{sampleContent.callToAction}</AutoTranslate>
              </p>
            </div>
          </div>

          {/* Translation Info */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              <AutoTranslate>How it works:</AutoTranslate>
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <AutoTranslate>Content is automatically detected and translated</AutoTranslate></li>
              <li>• <AutoTranslate>Translations are cached for performance</AutoTranslate></li>
              <li>• <AutoTranslate>Fallback to original text if translation fails</AutoTranslate></li>
              <li>• <AutoTranslate>Supports RTL languages like Arabic</AutoTranslate></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TranslationDemo;
