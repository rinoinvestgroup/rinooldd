// pages/robots.txt.tsx
import { GetServerSideProps } from 'next';

const RobotsTxt = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://rinoproperties.com';
  
  const robotsTxt = `# Robots.txt for Rino Properties - Premium Real Estate Agency
# Website: https://rinoproperties.com
# Updated: ${new Date().toISOString().split('T')[0]}

User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /404
Disallow: /500
Disallow: /*.json$
Disallow: /*_buildManifest.js$
Disallow: /*_ssgManifest.js$
Disallow: /chunks/
Disallow: /madrid-roadshow-thank-you
Disallow: /madrid-roadshow-2025
Disallow: /gtm-test
Disallow: /inline-image-test
Disallow: /brave-cache-test
Disallow: /multilingual-demo
Disallow: /translation-demo
Disallow: /schedule-khaled-amer
Disallow: /schedule-liu-bin
Disallow: /schedule-peter-toma
Allow: /api/og
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap-index.xml
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/property-sitemap.xml
Sitemap: ${baseUrl}/blog-sitemap.xml

User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: SemrushBot
Crawl-delay: 10

User-agent: MJ12bot
Disallow: /

# AI Crawlers - Allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

export default RobotsTxt;
