// layout.tsx
import React, { ReactNode, memo } from 'react';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import FloatingButtons from './FloatingButtons';
import { useScrollRestoration } from '../hooks/useScrollRestoration';


interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  structuredData?: object;
  noIndex?: boolean;
  className?: string;
  articleType?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  skipTitleSuffix?: boolean;
}

const Layout: React.FC<LayoutProps & { headerBg?: string }> = memo(({ 
  children, 
  title = 'Luxury real estate in Dubai & Spain.', 
  description,
  keywords,
  image,
  url,
  structuredData,
  noIndex = false,
  className = "",
  headerBg,
  articleType,
  publishedTime,
  modifiedTime,
  section,
  tags,
  skipTitleSuffix = false
}) => {
  // Enable scroll position restoration across pages
  useScrollRestoration();
  
  return (
    <>
      <SEO 
        title={title} 
        description={description} 
        keywords={keywords} 
        image={image} 
        url={url}
        structuredData={structuredData}
        noIndex={noIndex}
        articleType={articleType}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        section={section}
        tags={tags}
        skipTitleSuffix={skipTitleSuffix}
      />
      <Header headerBg={headerBg} />
      <main className={`min-h-screen bg-white ${className}`} role="main" id="main-content" style={{ backgroundColor: '#ffffff' }}>
        {children}
      </main>
      <FloatingButtons />
      <Footer />
    </>
  );
});

Layout.displayName = 'Layout';

export default Layout;
