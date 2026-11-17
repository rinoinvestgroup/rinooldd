import { GetServerSideProps } from 'next';
import blogPosts from '../data/blogPosts.json';
import { createBlogSlug } from '../utils/slugUtils';

const generateRSSFeed = () => {
  const siteUrl = 'https://rinoproperties.com';
  const currentDate = new Date().toUTCString();

  const rssItems = blogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => {
      // Use slug-based URLs consistent with blog-sitemap and blog pages
      const slug = createBlogSlug(post.title);
      const postUrl = `${siteUrl}/blog/${slug}`;
      const pubDate = new Date(post.date).toUTCString();
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>ask@rinoproperties.com (${post.author})</author>
      <category>${post.category}</category>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
      ${post.image ? `<enclosure url="${post.image}" type="image/jpeg"/>` : ''}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Rino Properties Blog</title>
    <description>Expert insights on real estate in Dubai, Spain, and international property markets. Get the latest market trends, investment tips, and property news.</description>
    <link>${siteUrl}/blog</link>
    <language>en</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>ask@rinoproperties.com (Rino Properties)</managingEditor>
    <webMaster>ask@rinoproperties.com (Rino Properties)</webMaster>
    <image>
      <url>${siteUrl}/images/logo.png</url>
      <title>Rino Properties</title>
      <link>${siteUrl}</link>
    </image>
    <ttl>60</ttl>${rssItems}
  </channel>
</rss>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const rss = generateRSSFeed();

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(rss);
  res.end();

  return {
    props: {},
  };
};

const FeedXML = () => null;
export default FeedXML;
