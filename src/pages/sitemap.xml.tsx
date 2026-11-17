// pages/sitemap.xml.tsx
import { GetServerSideProps } from 'next';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://rinoproperties.com';
  const currentDate = new Date().toISOString();
  
  try {
    // Static routes with priority and change frequency
    // NOTE: Only include pages that should be indexed (no noIndex pages)
    const staticRoutes = [
      // Homepage
      { url: '', changefreq: 'daily', priority: 1.0, lastmod: currentDate },
      
      // Main Pages
      { url: '/about', changefreq: 'weekly', priority: 0.8, lastmod: currentDate },
      { url: '/contact', changefreq: 'weekly', priority: 0.8, lastmod: currentDate },
      { url: '/agents', changefreq: 'weekly', priority: 0.7, lastmod: currentDate },
      
      // Property Selling
      { url: '/sell', changefreq: 'weekly', priority: 0.9, lastmod: currentDate },
      
      // Property Services
      { url: '/dubai-real-estate-services', changefreq: 'weekly', priority: 0.9, lastmod: currentDate },
      
      // Property Listings - Spain
      { url: '/properties/spain', changefreq: 'daily', priority: 0.9, lastmod: currentDate },
      { url: '/properties/spain/off-plan', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/spain/ready-to-move', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/spain/commercial', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      
      // Property Listings - Dubai
      { url: '/properties/dubai', changefreq: 'daily', priority: 0.9, lastmod: currentDate },
      { url: '/properties/dubai/buy', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/dubai/rent', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/dubai/off-plan', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/dubai/commercial', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/dubai-marina', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/palm-jumeirah', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/jvc', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      
      // Property Listings - International
      { url: '/properties/international', changefreq: 'daily', priority: 0.9, lastmod: currentDate },
      { url: '/properties/international/buy', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/international/rent', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/international/off-plan', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      { url: '/properties/international/commercial', changefreq: 'daily', priority: 0.85, lastmod: currentDate },
      
      // Featured Projects
      { url: '/binghatti-vintage', changefreq: 'weekly', priority: 0.85, lastmod: currentDate },
      { url: '/damac-island', changefreq: 'weekly', priority: 0.85, lastmod: currentDate },
      { url: '/dubai-maritime-city', changefreq: 'weekly', priority: 0.85, lastmod: currentDate },
      { url: '/squarex-residence', changefreq: 'weekly', priority: 0.85, lastmod: currentDate },
      { url: '/leos-royal', changefreq: 'weekly', priority: 0.85, lastmod: currentDate },
      { url: '/GFS-development', changefreq: 'weekly', priority: 0.85, lastmod: currentDate },
      { url: '/lanplot-spain', changefreq: 'weekly', priority: 0.85, lastmod: currentDate },
      
      // Blog
      { url: '/blog', changefreq: 'daily', priority: 0.75, lastmod: currentDate },
      
      // Legal Pages
      { url: '/terms-of-service', changefreq: 'monthly', priority: 0.3, lastmod: currentDate },
      { url: '/privacy-policy', changefreq: 'monthly', priority: 0.3, lastmod: currentDate },
      { url: '/cookie-policy', changefreq: 'monthly', priority: 0.3, lastmod: currentDate },
    ];

    // Generate XML sitemap index that references other sitemaps
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/property-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/blog-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    // Also include static pages in the main sitemap for backwards compatibility
    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Set the response headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(staticSitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap with minimal content
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${currentDate}</lastmod>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(fallbackSitemap);
    res.end();

    return {
      props: {},
    };
  }
};

export default Sitemap;
