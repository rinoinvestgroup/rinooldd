import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API route for blog-specific ISR revalidation
 * Usage: POST /api/revalidate-blog with { slug: 'blog-slug', secret: 'your-secret' }
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
    const { slug, paths, revalidateAll } = req.body;
    
    let pathsToRevalidate: string[] = [];
    
    if (revalidateAll) {
      // Revalidate common blog pages
      pathsToRevalidate = [
        '/blog',
        '/'
      ];
    } else if (paths && Array.isArray(paths)) {
      pathsToRevalidate = paths;
    } else if (slug) {
      pathsToRevalidate = [`/blog/${slug}`];
    } else {
      return res.status(400).json({ message: 'Missing slug, paths, or revalidateAll parameter' });
    }

    // Trigger revalidation for all paths
    const results = await Promise.allSettled(
      pathsToRevalidate.map(path => res.revalidate(path))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - successful;
    
    return res.json({ 
      revalidated: true, 
      paths: pathsToRevalidate,
      successful,
      failed,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    
    // If there was an error, Next.js will continue to show
    // the last successfully generated page
    return res.status(500).json({ 
      revalidated: false, 
      error: err.message || 'Error revalidating blog pages',
      timestamp: new Date().toISOString()
    });
  }
}
