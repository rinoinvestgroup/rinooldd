// pages/property-sitemap.xml.tsx
import { GetServerSideProps } from 'next';
import { PropertiesApiService } from '../services/propertiesApiService';
import { Property } from '../data/properties';
import { createPropertySlug } from '../utils/slugUtils';

const PropertySitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://rinoproperties.com';
  const currentDate = new Date().toISOString();
  
  try {
    // Fetch dynamic properties from API
    let propertyRoutes: Array<{url: string, changefreq: string, priority: number, lastmod: string}> = [];
    
    try {
      const properties: Property[] = await PropertiesApiService.getAllProperties();
      
      propertyRoutes = properties.map((property: Property) => {
        // Use existing slug or generate one from title
        const slug = property.slug || createPropertySlug(property.title, property.id || property.property_id);
        
        // Determine priority based on property characteristics
        let priority = 0.7;
        if (property.featured) {
          priority = 0.85;
        } else if (property.status === 'approved') {
          priority = 0.75;
        } else if (property.status === 'sold') {
          priority = 0.5;
        }
        
        // Determine change frequency based on listing type
        let changefreq = 'daily';
        if (property.status === 'sold') {
          changefreq = 'daily';
        }
        
        return {
          url: `/properties/${slug}`,
          changefreq,
          priority,
          lastmod: currentDate,
        };
      });
      
      console.log(`Property Sitemap: Successfully fetched ${propertyRoutes.length} properties`);
    } catch (error) {
      console.error('Error fetching properties for property-sitemap:', error);
    }

    // Generate XML sitemap for properties
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${propertyRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Set the response headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating property sitemap:', error);
    
    // Fallback empty sitemap
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(fallbackSitemap);
    res.end();

    return {
      props: {},
    };
  }
};

export default PropertySitemap;
