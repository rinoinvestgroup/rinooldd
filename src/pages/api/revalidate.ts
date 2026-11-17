import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API route for on-demand ISR revalidation
 * Usage: POST /api/revalidate with { path: '/properties/property-slug', secret: 'your-secret' }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  const secret = process.env.REVALIDATION_SECRET || 'fallback-secret-change-in-production';
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (req.body.secret !== secret) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const { path, slug } = req.body;
    
    // Determine the path to revalidate
    let pathToRevalidate: string;
    
    if (path) {
      pathToRevalidate = path;
    } else if (slug) {
      pathToRevalidate = `/properties/${slug}`;
    } else {
      return res.status(400).json({ message: 'Missing path or slug parameter' });
    }

    // Trigger revalidation
    await res.revalidate(pathToRevalidate);
    
    return res.json({ 
      revalidated: true, 
      path: pathToRevalidate,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    
    // If there was an error, Next.js will continue to show
    // the last successfully generated page
    return res.status(500).json({ 
      revalidated: false, 
      error: err.message || 'Error revalidating',
      timestamp: new Date().toISOString()
    });
  }
}
