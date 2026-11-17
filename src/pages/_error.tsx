import React from 'react';
import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface ErrorProps {
  statusCode?: number;
  message?: string;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, message }) => {
  const getErrorMessage = () => {
    if (message) return message;
    
    switch (statusCode) {
      case 404:
        return 'The page you are looking for could not be found.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 403:
        return 'Access forbidden. You do not have permission to view this page.';
      case 400:
        return 'Bad request. The request could not be understood by the server.';
      default:
        return 'An unexpected error has occurred.';
    }
  };

  const getErrorTitle = () => {
    switch (statusCode) {
      case 404:
        return 'Page Not Found';
      case 500:
        return 'Server Error';
      case 403:
        return 'Access Forbidden';
      case 400:
        return 'Bad Request';
      default:
        return 'Error';
    }
  };

  return (
    <Layout>
      <Head>
        <title>{statusCode ? `${statusCode} - ${getErrorTitle()}` : 'Error'} </title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 animate-pulse">
              {statusCode || 'Error'}
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {getErrorTitle()}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            {getErrorMessage()}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg shadow-lg border-2 border-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
            
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Contact Support
            </Link>
          </div>

          {/* Helpful Info */}
          {statusCode === 500 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                What can you do?
              </h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>Refresh the page</li>
                <li>Clear your browser cache</li>
                <li>Try again in a few minutes</li>
                <li>Contact our support team if the problem persists</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err?.message;
  
  return { statusCode, message };
};

export default ErrorPage;
