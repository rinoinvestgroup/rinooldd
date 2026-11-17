// pages/blog-sitemap.xml.tsx
import { GetServerSideProps } from 'next';
import { BlogApiService } from '../services/blogApiService';
import { Blog } from '../types/blog';
import { createBlogSlug } from '../utils/slugUtils';

const BlogSitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://rinoproperties.com';
  const currentDate = new Date().toISOString();
  
  try {
    // Fetch dynamic blog posts from API
    let blogRoutes: Array<{url: string, changefreq: string, priority: number, lastmod: string}> = [];
    
    try {
      const blogs: Blog[] = await BlogApiService.getAllBlogs({ limit: 500 });
      
      blogRoutes = blogs.map((blog: Blog) => {
        // Use existing slug or generate one from title
        const slug = blog.slug || createBlogSlug(blog.title);
        
        // Determine priority based on blog characteristics
        let priority = 0.6;
        if (blog.featured) {
          priority = 0.75;
        }
        
        // Get last modified date
        const lastmod = blog.updatedAt || blog.publishedAt || blog.createdAt || currentDate;
        
        return {
          url: `/blog/${slug}`,
          changefreq: 'monthly',
          priority,
          lastmod: typeof lastmod === 'string' ? lastmod : currentDate,
        };
      });
      
      console.log(`Blog Sitemap: Successfully fetched ${blogRoutes.length} blog posts`);
    } catch (error) {
      console.error('Error fetching blogs for blog-sitemap:', error);
    }

    // Generate XML sitemap for blogs
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${blogRoutes.map(route => `  <url>
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
    console.error('Error generating blog sitemap:', error);
    
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

export default BlogSitemap;
