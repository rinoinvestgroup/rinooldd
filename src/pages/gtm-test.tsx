import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { 
  generateGTMHealthReport, 
  monitorGTMEventsFiltered, 
  exportDataLayerAsCSV,
  analyzeGTMPerformance,
  validateRoadshowTracking
} from '../utils/gtmTest';
import { 
  gtmTrackEvent, 
  gtmTrackFormSubmit, 
  gtmTrackExternalLink,
  gtmTrackRoadshowRegistration,
  gtmTrackLead
} from '../utils/gtm';

const GTMTestPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [testResults, setTestResults] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Run initial health check
    const results = generateGTMHealthReport();
    setTestResults(results);
  }, []);

  const runHealthCheck = () => {
    const results = generateGTMHealthReport();
    setTestResults(results);
  };

  const testFormSubmission = () => {
    gtmTrackFormSubmit('Test Contact Form');
    alert('Test form submission event sent! Check console for details.');
  };

  const testRoadshowRegistration = () => {
    gtmTrackRoadshowRegistration({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+97143212433',
      country: 'UAE',
      propertyType: 'Villa',
      language: 'en',
      stage: 'completed'
    });
    alert('Test roadshow registration event sent! Check console for details.');
  };

  const testLeadGeneration = () => {
    gtmTrackLead({
      lead_source: 'GTM Test Page',
      lead_type: 'contact_form',
      content_name: 'Test Lead Generation',
      value: 2000,
      custom_parameters: {
        campaign_name: 'GTM Testing',
        test_user: true
      }
    });
    alert('Test lead generation event sent! Check console for details.');
  };

  const testExternalLink = () => {
    gtmTrackExternalLink('https://wa.me/97143212433', 'WhatsApp', 'GTM Test Page');
    alert('Test external link event sent! Check console for details.');
  };

  const testCustomEvent = () => {
    gtmTrackEvent('custom_test_event', {
      event_category: 'testing',
      event_label: 'manual_test',
      value: 100,
      custom_parameters: {
        test_type: 'manual',
        timestamp: new Date().toISOString(),
        page: 'GTM Test Page'
      }
    });
    alert('Test custom event sent! Check console for details.');
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    monitorGTMEventsFiltered('', 30000); // Monitor all events for 30 seconds
    setTimeout(() => setIsMonitoring(false), 30000);
  };

  const exportDataLayer = () => {
    const csv = exportDataLayerAsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gtm-datalayer-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const analyzePerformance = () => {
    analyzeGTMPerformance();
  };

  const validateRoadshow = () => {
    const results = validateRoadshowTracking();
    alert('Roadshow validation complete! Check console for details.');
  };

  return (
    <Layout noIndex={true}>
      <SEO
        title="GTM Testing & Validation"
        description="Comprehensive GTM implementation testing and validation tools"
        noIndex={true}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              GTM Testing & Validation Dashboard
            </h1>

            {/* Health Status */}
            {testResults && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">GTM Health Status</h2>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{testResults.warnings}</div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{testResults.healthScore}%</div>
                    <div className="text-sm text-gray-600">Health Score</div>
                  </div>
                </div>
                <button
                  onClick={runHealthCheck}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh Health Check
                </button>
              </div>
            )}

            {/* Event Testing */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Event Testing</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  onClick={testFormSubmission}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Test Form Submit
                </button>
                <button
                  onClick={testRoadshowRegistration}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Test Roadshow Registration
                </button>
                <button
                  onClick={testLeadGeneration}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                >
                  Test Lead Generation
                </button>
                <button
                  onClick={testExternalLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  Test External Link
                </button>
                <button
                  onClick={testCustomEvent}
                  className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
                >
                  Test Custom Event
                </button>
                <button
                  onClick={validateRoadshow}
                  className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
                >
                  Validate Roadshow
                </button>
              </div>
            </div>

            {/* Monitoring & Analysis */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Monitoring & Analysis</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={startMonitoring}
                  disabled={isMonitoring}
                  className={`px-4 py-2 text-white rounded transition-colors ${
                    isMonitoring 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {isMonitoring ? 'Monitoring...' : 'Monitor Events (30s)'}
                </button>
                <button
                  onClick={analyzePerformance}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                >
                  Analyze Performance
                </button>
                <button
                  onClick={exportDataLayer}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Export DataLayer
                </button>
                <button
                  onClick={() => window.open('https://tagassistant.google.com/', '_blank')}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  GTM Preview Mode
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Testing Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open browser console (F12) to see detailed GTM event logs</li>
                <li>Use "Monitor Events" to track real-time GTM activity</li>
                <li>Test individual events and verify they appear in console</li>
                <li>Use GTM Preview Mode for advanced debugging</li>
                <li>Export DataLayer to analyze historical events</li>
                <li>Run health checks regularly to ensure GTM is working properly</li>
              </ol>
            </div>

            {/* Console Output Info */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-800">
                <strong>💡 Tip:</strong> All GTM events and debugging information are logged to the browser console. 
                Open Developer Tools (F12) → Console tab to see detailed output.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default GTMTestPage;
