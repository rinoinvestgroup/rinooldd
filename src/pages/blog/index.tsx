import BlogPage from '@/components/blog/BlogPage';
import Layout from '@/components/Layout';

export default function Blog() {
  return (
    <>
      <Layout 
        title="Dubai & Spain Real Estate Blog | Market Insights & Investment Tips"
        description="Expert real estate blog — Dubai & Spain property market analysis, investment strategies, off-plan guides, ROI comparisons. Rino Properties insights."
        keywords="real estate blog Dubai, property investment tips, Dubai market analysis 2026, Spain property guide, off-plan investment guide, rental yield analysis Dubai, property buying guide Spain, real estate trends UAE, luxury property insights, Dubai vs Spain investment, ROI comparison real estate, property tax guide"
        url="https://rinoproperties.com/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Blog",
              "@id": "https://rinoproperties.com/blog#blog",
              "url": "https://rinoproperties.com/blog",
              "name": "Rino Properties Real Estate Blog",
              "description": "Expert insights on luxury real estate in Spain and Dubai. Stay informed with market trends, investment strategies, property guides, and industry news.",
              "inLanguage": "en",
              "publisher": {
                "@id": "https://rinoproperties.com/#organization"
              },
              "isPartOf": {
                "@id": "https://rinoproperties.com/#website"
              },
              "about": {
                "@type": "Thing",
                "name": "Real Estate",
                "description": "Luxury real estate market insights, property investment advice, and market analysis for Spain and Dubai"
              },
              "keywords": "real estate blog, property investment, market trends, luxury properties, Spain real estate, Dubai properties, investment tips, property news, real estate analysis",
              "blogPost": {
                "@type": "BlogPosting",
                "headline": "Expert Real Estate Insights and Market Analysis"
              }
            },
            {
              "@type": "CollectionPage",
              "@id": "https://rinoproperties.com/blog#webpage",
              "url": "https://rinoproperties.com/blog",
              "name": "Real Estate Blog - Expert Insights ",
              "description": "Stay informed with the latest real estate trends, investment strategies, market analysis, and expert insights from Rino Properties.",
              "inLanguage": "en",
              "isPartOf": {
                "@id": "https://rinoproperties.com/#website"
              },
              "breadcrumb": {
                "@id": "https://rinoproperties.com/blog#breadcrumb"
              },
              "about": {
                "@id": "https://rinoproperties.com/blog#blog"
              },
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "url": "https://rinoproperties.com/images/blog_bg.webp",
                "width": 1920,
                "height": 1080
              }
            },
            {
              "@type": "RealEstateAgent",
              "@id": "https://rinoproperties.com/#organization",
              "name": "Rino Properties",
              "alternateName": "Rino Invest Asset S.L.",
              "url": "https://rinoproperties.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://rinoproperties.com/images/logo.jpeg",
                "width": 600,
                "height": 60
              },
              "description": "Premium real estate services in Spain and Dubai, specializing in luxury properties, investment opportunities, and expert market guidance.",
              "sameAs": [
                "https://www.facebook.com/p/Rino-Properties-61568133758317/",
                "https://www.instagram.com/rinoinvest_properties/",
                "https://ae.linkedin.com/company/rino-invest-properties",
                "https://www.tiktok.com/@rino.properties"
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+34-635-955-137",
                  "contactType": "customer service",
                  "areaServed": "ES",
                  "availableLanguage": ["English", "Spanish", "Arabic"],
                  "email": "ask@rinoproperties.com"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+971-43-21-2433",
                  "contactType": "customer service",
                  "areaServed": "AE",
                  "availableLanguage": ["English", "Arabic"],
                  "email": "ask@rinoproperties.com"
                }
              ]
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://rinoproperties.com/blog#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://rinoproperties.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://rinoproperties.com/blog"
                }
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://rinoproperties.com/#website",
              "url": "https://rinoproperties.com",
              "name": "Rino Properties",
              "description": "Premium Real Estate in Spain and Dubai",
              "publisher": {
                "@id": "https://rinoproperties.com/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://rinoproperties.com/properties?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }
          ]
        }}
      >
        <BlogPage />
      </Layout>
    </>
  );
}