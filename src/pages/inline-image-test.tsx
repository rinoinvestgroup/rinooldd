import React, { useState, memo } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useContentProcessor } from '../hooks/useContentProcessor';
import parse from 'html-react-parser';

// Memoized component for rendering processed content
const ProcessedContentRenderer = memo<{ content: string }>(({ content }) => {
  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
        </svg>
        <p className="italic">Enter content above to see the processed result</p>
      </div>
    );
  }

  try {
    return <div>{parse(content)}</div>;
  } catch (error) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
});

ProcessedContentRenderer.displayName = 'ProcessedContentRenderer';

const InlineImageTest = () => {
  const [testContent, setTestContent] = useState('');

  // Use the optimized content processor hook with stable parameter
  const { processedContent, imageCount, hasContent } = useContentProcessor(testContent || '');

  // Example content for demonstration
  const exampleContent = `Welcome to our luxury property showcase!

Check out this beautiful property: https://rinoproperties-prodsite-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2025/05/21111559/pexels-jose-d-alessandro-100704432-9510769-1-scaled.jpg

This stunning villa features modern architecture and breathtaking views.

Another amazing property: https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop

Our properties offer the finest amenities and locations.

For more information, visit our website at https://rinoproperties.com`;

  const handleClearContent = () => setTestContent('');
  const handleLoadExample = () => setTestContent(exampleContent);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout title="Inline Image Test" noIndex={true}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Inline Image Processing Test
          </h1>
          
          <div className="grid gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Original Content:</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadExample}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Load Example
                  </button>
                  <button
                    onClick={handleClearContent}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                value={testContent}
                onChange={(e) => setTestContent(e.target.value)}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent"
                placeholder="Enter content with image URLs here... URLs will be automatically converted to inline images."
              />
              
              {/* Content Stats */}
              {hasContent && (
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <span>Characters: {testContent.length}</span>
                  <span>•</span>
                  <span>Images detected: {imageCount}</span>
                </div>
              )}
            </div>

            {/* Output Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Processed Content (Images Inline):</h2>
              <div className="prose prose-lg max-w-none border border-gray-200 rounded-lg p-6 min-h-64">
                <style jsx>{`
                  .inline-image-container {
                    margin: 1.5rem 0;
                  }
                  .inline-blog-image {
                    width: 100%;
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    object-fit: cover;
                    max-height: 400px;
                    transition: all 0.3s ease;
                  }
                  .inline-blog-image:hover {
                    transform: scale(1.02);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
                  }
                  .image-error-fallback {
                    display: none !important;
                  }
                `}</style>
                <ProcessedContentRenderer content={processedContent} />
              </div>
            </div>

            {/* Raw HTML Section - Only show if there's content */}
            {processedContent && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated HTML:</h2>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {processedContent}
                </pre>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">How It Works:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Image Processing:</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Detects image URLs automatically</li>
                  <li>• Replaces URLs with &lt;img&gt; tags inline</li>
                  <li>• Maintains original text flow position</li>
                  <li>• Includes hover effects and error handling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Supported Formats:</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Standard image extensions (jpg, png, webp, etc.)</li>
                  <li>• AWS S3, Google Cloud, Azure URLs</li>
                  <li>• CDN and cloud storage services</li>
                  <li>• Non-image URLs remain as links</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
};

export default InlineImageTest;
