import { useMemo } from 'react';
import { useBlogBySlug } from './useBlogs';
import { Blog, getLocalizedBlogTitle, getLocalizedBlogContent } from '../types/blog';
import { useContentProcessor } from './useContentProcessor';
import { 
  generateBlogStructuredData, 
  generateBlogKeywords, 
  generateCanonicalUrl,
  generateBlogOGImage,
  truncateDescription,
  validateMetaTitle,
  generateUniqueBlogDescription
} from '../utils/seoUtils';

export interface OptimizedBlogData {
  post: Blog | null;
  loading: boolean;
  error: string | null;
  localizedTitle: string;
  localizedContent: string;
  processedContent: string;
  hasContent: boolean;
  seoData: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    canonicalUrl: string;
    ogImage: string;
    structuredData: object;
  } | null;
}

/**
 * Optimized hook for managing blog data with memoization and SEO generation
 */
export const useOptimizedBlog = (
  slug: string, 
  language: string, 
  shouldFetch: boolean = true
): OptimizedBlogData => {
  // Fetch blog data
  const { blog: post, loading, error } = useBlogBySlug(shouldFetch ? slug : '');
  
  // Memoize localized content
  const { localizedTitle, localizedContent } = useMemo(() => {
    if (!post) return { localizedTitle: '', localizedContent: '' };
    
    return {
      localizedTitle: getLocalizedBlogTitle(post, language),
      localizedContent: getLocalizedBlogContent(post, language)
    };
  }, [post, language]);
  
  // Process content with optimized hook
  const { processedContent, hasContent } = useContentProcessor(localizedContent);

  // Memoize SEO data generation
  const seoData = useMemo(() => {
    if (!post || !localizedTitle) return null;

    // Strip any existing "| Rino Properties" suffix to prevent duplication
    const rawTitle = (post.meta_title || localizedTitle || '').replace(/\s*\|\s*Rino Properties\s*$/i, '');

    return {
      seoTitle: validateMetaTitle(rawTitle, 60),
      seoDescription: post.meta_description 
        ? truncateDescription(post.meta_description)
        : (post.excerpt 
          ? truncateDescription(post.excerpt)
          : generateUniqueBlogDescription(post, localizedTitle)),
      seoKeywords: post.keywords || generateBlogKeywords(post),
      canonicalUrl: generateCanonicalUrl(`/blog/${slug}`),
      ogImage: generateBlogOGImage(post),
      structuredData: generateBlogStructuredData(post)
    };
  }, [post, localizedTitle, slug]);

  return {
    post,
    loading,
    error,
    localizedTitle,
    localizedContent,
    processedContent,
    hasContent,
    seoData
  };
};
