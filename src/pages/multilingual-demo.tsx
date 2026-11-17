import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';
import { useLanguage } from '../context/LanguageContext';
import { sampleMultilingualProperty, testMultilingualContent } from '../utils/multilingualDemo';
import { getLocalizedTitle, getLocalizedDescription, getLocalizedAmenities, getLocalizedFeatures } from '../data/properties';

const MultilingualDemo = () => {
  const { language, setLanguage, t } = useLanguage();
  const [testResults, setTestResults] = useState<any>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const runTest = () => {
    const result = testMultilingualContent(language);
    setTestResults(result);
  };

  // Get current localized content
  const localizedTitle = getLocalizedTitle(sampleMultilingualProperty, language);
  const localizedDescription = getLocalizedDescription(sampleMultilingualProperty, language);
  const localizedAmenities = getLocalizedAmenities(sampleMultilingualProperty, language);
  const localizedFeatures = getLocalizedFeatures(sampleMultilingualProperty, language);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout
        title="Multilingual Demo - Rino Properties"
        description="Demo page showing multilingual property content functionality"
        noIndex={true}
      >
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Multilingual Property Content Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This demo page shows how property content changes based on the selected language. 
              The property card and details will display in the language you select.
            </p>
          </div>

          {/* Language Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Language</h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    language === lang.code
                      ? 'bg-[#D69F3F] text-white border-[#D69F3F]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#D69F3F] hover:text-[#D69F3F]'
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Current Language: <span className="font-semibold">{language.toUpperCase()}</span>
            </div>
          </div>

          {/* Property Card Demo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Property Card (Localized)</h2>
            <div className="max-w-md mx-auto">
              <PropertyCard property={sampleMultilingualProperty} priority={true} lazy={false} />
            </div>
          </div>

          {/* Localized Content Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Localized Content Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Title</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded border">
                  {localizedTitle}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded border">
                  {localizedDescription}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Amenities</h3>
                <div className="bg-gray-50 p-3 rounded border">
                  {localizedAmenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600 mb-1">
                      <span className="w-2 h-2 bg-[#D69F3F] rounded-full mr-2"></span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
                <div className="bg-gray-50 p-3 rounded border">
                  {localizedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-600 mb-1">
                      <span className="w-2 h-2 bg-[#D69F3F] rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Test Console */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Test Console</h2>
              <button
                onClick={runTest}
                className="bg-[#D69F3F] text-white px-4 py-2 rounded hover:bg-[#C4903A] transition-colors"
              >
                Run Test
              </button>
            </div>
            
            {testResults && (
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="font-semibold mb-2">Test Results for {language.toUpperCase()}:</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Click "Run Test" to see the localized content in the console format.</p>
              <p>Switch languages and run the test again to see how content changes.</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">How to Test</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Select different languages using the buttons above</li>
              <li>Observe how the property card content changes</li>
              <li>Check the "Localized Content Details" section to see raw localized data</li>
              <li>Use the "Run Test" button to see console output</li>
              <li>Navigate to actual property pages to see the multilingual functionality in action</li>
            </ol>
          </div>

          {/* API Data Structure Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">API Data Structure</h2>
            <p className="text-yellow-700 mb-4">
              For the multilingual functionality to work with your API, ensure your property objects include these fields:
            </p>
            <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
{`{
  "title": "Default English title",
  "title_ar": "Arabic title",
  "title_zh": "Chinese title", 
  "title_es": "Spanish title",
  "title_de": "German title",
  
  "description": "Default English description",
  "description_ar": "Arabic description",
  "description_zh": "Chinese description",
  "description_es": "Spanish description", 
  "description_de": "German description",
  
  "amenities": ["English amenity 1", "English amenity 2"],
  "amenities_ar": "Arabic amenity 1, Arabic amenity 2",
  "amenities_zh": "Chinese amenity 1, Chinese amenity 2",
  "amenities_es": "Spanish amenity 1, Spanish amenity 2",
  "amenities_de": "German amenity 1, German amenity 2",
  
  "features": ["English feature 1", "English feature 2"],
  "features_ar": "Arabic feature 1, Arabic feature 2",
  "features_zh": "Chinese feature 1, Chinese feature 2", 
  "features_es": "Spanish feature 1, Spanish feature 2",
  "features_de": "German feature 1, German feature 2"
}`}
            </pre>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
};

export default MultilingualDemo;
