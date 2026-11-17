import React, { memo, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import Link from 'next/link';
import parse from 'html-react-parser';
import { normalizeTagsToArray } from '../../utils/tagUtils';
import { useOptimizedBlog } from '../../hooks/useOptimizedBlog';
import { useLanguage } from '../../context/LanguageContext';
import BlogApiService from '../../services/blogApiService';
import { createBlogSlug } from '../../utils/slugUtils';
import { Blog } from '../../types/blog';

// Memoized component for rendering blog content
const BlogContentRenderer = memo<{ 
  processedContent: string; 
  hasContent: boolean; 
  t: (key: string, fallback: string) => string;
}>(({ processedContent, hasContent, t }) => {
  if (!hasContent) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p className="text-lg italic">{t('blog.detail.noContent', 'No content available for this article.')}</p>
      </div>
    );
  }

  try {
    return (
      <div className="mb-6 text-lg blog-content">
        <style jsx>{`
          .blog-content .inline-image-container {
            margin: 1.5rem 0;
          }
          .blog-content .inline-blog-image {
            width: 100%;
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            object-fit: cover;
            max-height: 400px;
            transition: all 0.3s ease;
          }
          .blog-content .inline-blog-image:hover {
            transform: scale(1.02);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
          }
          .blog-content .image-error-fallback {
            display: none;
          }
        `}</style>
        {parse(processedContent)}
      </div>
    );
  } catch (error) {
    return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
  }
});

BlogContentRenderer.displayName = 'BlogContentRenderer';

// Optimized loading skeleton component
const BlogLoadingSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50">
    {/* Hero skeleton */}
    <div className="relative h-84 sm:h-80 md:h-96 lg:h-120 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse mt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-4xl w-full px-4">
          <div className="h-4 bg-white/30 rounded w-24 mx-auto mb-4"></div>
          <div className="h-8 bg-white/40 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-white/30 rounded w-48 mx-auto"></div>
        </div>
      </div>
    </div>
    
    {/* Content skeleton */}
    <div className="max-w-4xl mx-auto px-4 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="space-y-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/5 animate-pulse"></div>
          <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
));

BlogLoadingSkeleton.displayName = 'BlogLoadingSkeleton';

// Optimized image component with lazy loading and error handling
const OptimizedHeroImage = memo<{
  src: string;
  alt: string;
  localizedTitle: string;
}>(({ src, alt, localizedTitle }) => {
  return (
    <div className="relative h-84 sm:h-80 md:h-96 lg:h-120 overflow-hidden">
      <img 
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center mt-20"
        loading="eager" // Hero images should load immediately
        decoding="async"
        onError={(e) => {
          // Fallback to placeholder on error
          const target = e.target as HTMLImageElement;
          target.src = '/images/luxury-villa-placeholder.svg';
        }}
      />
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
    </div>
  );
});

OptimizedHeroImage.displayName = 'OptimizedHeroImage';

interface BlogSlugPageProps {
  blogData?: Blog | null;
  lastUpdated?: string;
}

const BlogSlugPage: React.FC<BlogSlugPageProps> = ({ blogData, lastUpdated }) => {
  const router = useRouter();
  const { slug } = router.query;
  const { t, language } = useLanguage();

  const slugStr = useMemo(() => {
    return Array.isArray(slug) ? slug[0] : slug || '';
  }, [slug]);

  // Use pre-fetched data from ISR when available, otherwise use hook for client-side fetching
  const shouldUseFallbackFetch = !blogData && router.isReady && Boolean(slugStr);
  
  // Use optimized blog hook only when we don't have pre-fetched data
  const {
    post: fallbackPost,
    loading: fallbackLoading,
    error: fallbackError,
    localizedTitle: fallbackLocalizedTitle,
    localizedContent: fallbackLocalizedContent,
    processedContent: fallbackProcessedContent,
    hasContent: fallbackHasContent,
    seoData: fallbackSeoData
  } = useOptimizedBlog(slugStr, language, shouldUseFallbackFetch);

  // Use pre-fetched data when available, otherwise use fallback data
  const post = blogData || fallbackPost;
  const loading = blogData ? false : fallbackLoading;
  const error = blogData ? null : fallbackError;

  // Process localized content for the current blog data
  const { localizedTitle, localizedContent, processedContent, hasContent, seoData } = useMemo(() => {
    if (!post) {
      return {
        localizedTitle: '',
        localizedContent: '',
        processedContent: '',
        hasContent: false,
        seoData: null
      };
    }

    // If we have pre-fetched data, process it here
    if (blogData) {
      const { getLocalizedBlogTitle, getLocalizedBlogContent } = require('../../types/blog');
      const { processContentForRendering } = require('../../utils/htmlUtils');
      const { 
        generateBlogStructuredData, 
        generateBlogKeywords, 
        generateCanonicalUrl,
        generateBlogOGImage,
        truncateDescription,
        validateMetaTitle,
        generateUniqueBlogDescription
      } = require('../../utils/seoUtils');

      const title = getLocalizedBlogTitle(post, language);
      const content = getLocalizedBlogContent(post, language);
      
      // Process content for inline images and formatting
      const processedContent = content ? processContentForRendering(content) : '';
      const hasContent = Boolean(content && content.trim().length > 0);

      // Strip any existing "| Rino Properties" suffix to prevent duplication
      const rawTitle = (post.meta_title || title || '').replace(/\s*\|\s*Rino Properties\s*$/i, '');
      
      // Generate SEO data with unique description
      const seoData = {
        seoTitle: validateMetaTitle(rawTitle, 60),
        seoDescription: post.meta_description 
          ? truncateDescription(post.meta_description)
          : (post.excerpt 
            ? truncateDescription(post.excerpt)
            : generateUniqueBlogDescription(post, title)),
        seoKeywords: post.keywords || generateBlogKeywords(post),
        canonicalUrl: generateCanonicalUrl(`/blog/${slugStr}`),
        ogImage: generateBlogOGImage(post),
        structuredData: generateBlogStructuredData(post)
      };

      return {
        localizedTitle: title,
        localizedContent: content,
        processedContent,
        hasContent,
        seoData
      };
    }

    // Use fallback data
    return {
      localizedTitle: fallbackLocalizedTitle,
      localizedContent: fallbackLocalizedContent,
      processedContent: fallbackProcessedContent,
      hasContent: fallbackHasContent,
      seoData: fallbackSeoData
    };
  }, [post, language, slugStr, blogData, fallbackLocalizedTitle, fallbackLocalizedContent, fallbackProcessedContent, fallbackHasContent, fallbackSeoData]);

  // Prefetch related data when component mounts
  useEffect(() => {
    if (post && typeof window !== 'undefined') {
      // Prefetch the blog list page for better navigation experience
      router.prefetch('/blog');
      // Prefetch contact page since CTA leads there
      router.prefetch('/contact');
    }
  }, [post, router]);

  if (loading || !router.isReady) {
    return (
      <Layout title={`${t('blog.detail.loading', 'Loading...')} `}>
        <BlogLoadingSkeleton />
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout title={`${t('blog.detail.notFound', 'Article Not Found')} `}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2">{t('blog.detail.notFound', 'Article not found')}</h3>
            <p className="text-gray-600 font-light mb-6">{error || t('blog.detail.notFoundMessage', 'The requested article could not be found')}</p>
            <Link 
              href="/blog"
              className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              {t('blog.detail.backToBlog', 'Back to Blog')}
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      
      <Layout 
        title={seoData?.seoTitle || `${t('blog.detail.loading', 'Loading...')}`}
        description={seoData?.seoDescription || ''}
        keywords={seoData?.seoKeywords || ''}
        image={seoData?.ogImage || ''}
        url={seoData?.canonicalUrl || ''}
        structuredData={seoData?.structuredData}
        headerBg="bg-white text-black logo-black"
        skipTitleSuffix={true}
      >
       
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Image and Title Overlay */}
        <div className="relative">
          <OptimizedHeroImage 
            src={post.bannerImage || '/images/luxury-villa-placeholder.svg'}
            alt={localizedTitle}
            localizedTitle={localizedTitle}
          />
           
          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-4 py-6 z-10">
            <div className="text-center text-white max-w-4xl w-full">
              <div className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 opacity-90 bg-black/20 px-3 py-1 rounded-full inline-block">{post.category}</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight px-2 drop-shadow-lg">
                {localizedTitle}
              </h1>
              <div className="flex items-center justify-center text-xs sm:text-sm space-x-2 sm:space-x-4 opacity-90 flex-wrap bg-black/20 px-4 py-2 rounded-full inline-flex">
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                <span className="hidden xs:inline">•</span>
                <span>{post.views} {t('blog.detail.views', 'views')}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{t('blog.detail.by', 'By')} {post.author}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 -mt-12 sm:-mt-16 md:-mt-20 relative z-20">
          {/* Article Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100">
            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <BlogContentRenderer 
                processedContent={processedContent}
                hasContent={hasContent}
                t={t}
              />

              {/* Tags */}
              {(() => {
                const tagArray = normalizeTagsToArray(post?.tags);
                return tagArray?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tagArray?.map((tag, index) => (
                      <span key={index} className="bg-[#D69F3F]/10 text-[#D69F3F] px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Back to Blog Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link 
                href="/blog"
                className="inline-flex items-center text-[#D69F3F] hover:text-[#C4903A] font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('blog.detail.backToBlog', 'Back to Blog')}
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] rounded-xl shadow-xl p-8 text-white text-center relative overflow-hidden">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-white/5" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold mb-4">
                {t('blog.detail.interestedInMore', 'Interested in Learning More?')}
              </h3>
              <p className="text-lg mb-6 opacity-90">
                {t('blog.detail.expertConsultation', 'Connect with our experts for exclusive investment opportunities and detailed property insights.')}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center bg-white text-[#D69F3F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t('blog.detail.getConsultation', 'Get Expert Consultation')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
};

// ISR: Generate static paths for featured blogs at build time
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    
    // Get blogs optimized for ISR pre-generation
    const priorityBlogs = await BlogApiService.getBlogsForISRGeneration(25);

    // Generate paths from blog slugs
    const paths = priorityBlogs
      .filter((blog: Blog) => blog.slug || blog.title) // Ensure we have slug or title
      .map((blog: Blog) => ({
        params: { 
          slug: blog.slug || createBlogSlug(blog.title)
        },
      }));


    return {
      paths,
      // Enable ISR - pages not in paths will be generated on-demand
      fallback: 'blocking',
    };
  } catch (error) {
    // Return empty paths but keep fallback enabled for runtime generation
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

// ISR: Fetch blog data with optimized caching strategy
export const getStaticProps: GetStaticProps<{
  blogData: Blog | null;
  lastUpdated: string;
}> = async (context) => {
  const { slug } = context.params as { slug: string };
  const isPreview = context.preview || false;
  
  try {
    
    if (!slug) {
      return {
        notFound: true,
        revalidate: 300, // Cache 404 for 5 minutes
      };
    }

    // Fetch blog data at build/runtime
    const blogData = await BlogApiService.getBlogBySlug(slug);

    if (!blogData) {
      return {
        notFound: true,
        // Cache 404 pages for 5 minutes to avoid repeated API calls
        revalidate: 300,
      };
    }

    // Determine revalidation interval based on blog characteristics
    let revalidateInterval: number;
    
    if (isPreview) {
      // Preview mode: very short cache for immediate updates
      revalidateInterval = 60; // 1 minute
    } else {
      // Use the utility function for consistent interval calculation
      const { getBlogRevalidationInterval } = await import('../../utils/isrUtils');
      revalidateInterval = getBlogRevalidationInterval(blogData);
    }


    return {
      props: {
        blogData,
        lastUpdated: new Date().toISOString(),
      },
      // Dynamic revalidation based on blog characteristics
      revalidate: revalidateInterval,
    };
  } catch (error) {
    
    // Return 404 for API errors to avoid showing broken pages
    return {
      notFound: true,
      // Short revalidation for temporary API issues
      revalidate: 300, // 5 minutes
    };
  }
};

export default BlogSlugPage;