/**
 * API endpoint validator utility
 */

export const validateApiEndpoints = async () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  const endpoints = [
    '/blogs',
    '/blogs/search',
    '/blogs/categories',
    '/blogs/category/Business', // Correct category endpoint
    '/blogs/category/Technology',   // Example category endpoint
    '/blogs/category/Lifestyle',  // Example category endpoint
    '/items', // Properties endpoint
    '/contact', // Contact endpoint
    '/property-inquiry', // Property inquiry endpoint (for POST testing)
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      results.push({
        endpoint,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 0,
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
};

export const logApiHealth = async () => {
  if (process.env.NODE_ENV === 'development') {
    const results = await validateApiEndpoints();
    results.forEach(result => {
      const status = result.ok ? '✅' : '❌';
    });
  }
};
