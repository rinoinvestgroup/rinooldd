import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePublishedBlogs, useBlogCategories, useBlogSearch, useBlogFilter } from '../../hooks/useBlogs';
import { BlogSearchParams, getLocalizedBlogTitle, getLocalizedBlogContent } from '../../types/blog';
import { createBlogSlug } from '../../utils/slugUtils';
import { extractCategoryName } from '../../utils/categoryUtils';
import { tagsInclude } from '../../utils/tagUtils';
import { useLanguage } from '../../context/LanguageContext';
import Alert from '../Alert';

const POSTS_PER_PAGE = 9;
const ALL_BLOGS_LIMIT = 200;

const BlogPage = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const allCategoryText = t('blog.filters.all', 'All');

  // ──────────────────────────────────────────────
  // State — single source of truth
  // ──────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFallbackAlert, setShowFallbackAlert] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Guard to prevent URL-sync effect from running during init
  const skipUrlSyncRef = useRef(false);

  // ──────────────────────────────────────────────
  // Categories from API
  // ──────────────────────────────────────────────
  const { categories: apiCategories } = useBlogCategories();

  const categories = useMemo(() => {
    const valid = Array.isArray(apiCategories)
      ? apiCategories.filter((c): c is string => typeof c === 'string' && c.length > 0)
      : [];
    return [allCategoryText, ...valid];
  }, [allCategoryText, apiCategories]);

  // ──────────────────────────────────────────────
  // URL → State (runs once when router is ready)
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!router.isReady || isInitialized) return;

    const { category, search, page } = router.query;

    // Batch all state updates, then mark initialized
    skipUrlSyncRef.current = true; // prevent URL-sync from firing for these

    setActiveCategory(
      typeof category === 'string' && category ? category : allCategoryText
    );
    setSearchTerm(typeof search === 'string' ? search : '');

    const pageNum = typeof page === 'string' ? parseInt(page, 10) : 1;
    setCurrentPage(!isNaN(pageNum) && pageNum > 0 ? pageNum : 1);

    setIsInitialized(true);

    // Allow URL sync again after this render cycle completes
    requestAnimationFrame(() => { skipUrlSyncRef.current = false; });
  }, [router.isReady, router.query, isInitialized, allCategoryText]);

  // ──────────────────────────────────────────────
  // State → URL (shallow replace, no scroll)
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!isInitialized || skipUrlSyncRef.current || !router.isReady) return;

    const query: Record<string, string> = {};

    if (activeCategory && activeCategory !== allCategoryText) {
      query.category = activeCategory;
    }
    if (searchTerm.trim()) {
      query.search = searchTerm.trim();
    }
    if (currentPage > 1) {
      query.page = String(currentPage);
    }

    // Only push if URL actually needs changing
    const currentQuery = router.query;
    const needsUpdate =
      (query.category || '') !== (currentQuery.category || '') ||
      (query.search || '') !== (currentQuery.search || '') ||
      (query.page || '') !== (currentQuery.page || '');

    if (needsUpdate) {
      router.replace({ pathname: router.pathname, query }, undefined, {
        shallow: true,
        scroll: false,
      });
    }
  }, [activeCategory, searchTerm, currentPage, isInitialized, allCategoryText, router]);

  // ──────────────────────────────────────────────
  // Language change — keep "All" text in sync
  // ──────────────────────────────────────────────
  const prevAllTextRef = useRef(allCategoryText);
  useEffect(() => {
    if (!isInitialized) return;
    if (prevAllTextRef.current !== allCategoryText) {
      // If user was on "All", move to the new translation
      if (activeCategory === prevAllTextRef.current) {
        setActiveCategory(allCategoryText);
      }
      prevAllTextRef.current = allCategoryText;
    }
  }, [allCategoryText, activeCategory, isInitialized]);

  // ──────────────────────────────────────────────
  // Reset page to 1 when filters change
  // Simple & correct: track previous values, reset only on actual change
  // ──────────────────────────────────────────────
  const prevCategoryRef = useRef(activeCategory);
  const prevSearchRef = useRef(searchTerm);

  useEffect(() => {
    if (!isInitialized) return;
    const catChanged = prevCategoryRef.current !== activeCategory;
    const searchChanged = prevSearchRef.current !== searchTerm;

    if (catChanged || searchChanged) {
      setCurrentPage(1);
      prevCategoryRef.current = activeCategory;
      prevSearchRef.current = searchTerm;
    }
  }, [activeCategory, searchTerm, isInitialized]);

  // ──────────────────────────────────────────────
  // Derived flags — which data source to use
  // ──────────────────────────────────────────────
  const isAllCategory = !activeCategory || activeCategory === allCategoryText;
  const isValidApiCategory =
    !isAllCategory &&
    Boolean(apiCategories?.includes(activeCategory));
  const trimmedSearch = searchTerm.trim();
  const hasValidSearch = trimmedSearch.length > 2;

  const shouldUseSearch = hasValidSearch;
  const shouldUseFilter = isValidApiCategory && !hasValidSearch;
  const shouldUseAll = !shouldUseSearch && !shouldUseFilter;

  // ──────────────────────────────────────────────
  // Search parameters (only when searching)
  // ──────────────────────────────────────────────
  const searchParams: BlogSearchParams = useMemo(() => {
    if (!shouldUseSearch) return {} as BlogSearchParams;
    const params: BlogSearchParams = {
      status: 'published',
      page: currentPage,
      limit: POSTS_PER_PAGE,
    };
    if (trimmedSearch.length > 2) params.query = trimmedSearch;
    if (isValidApiCategory) params.category = activeCategory.trim();
    return params;
  }, [shouldUseSearch, currentPage, trimmedSearch, isValidApiCategory, activeCategory]);

  // ──────────────────────────────────────────────
  // Data hooks — only one fires at a time
  // ──────────────────────────────────────────────
  const {
    blogs: filteredResults,
    loading: filterLoading,
    error: filterError,
  } = useBlogFilter(
    shouldUseFilter
      ? { category: activeCategory, status: 'published', page: currentPage, limit: POSTS_PER_PAGE }
      : {}
  );

  const {
    blogs: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useBlogSearch(shouldUseSearch ? searchParams : ({} as BlogSearchParams));

  const {
    blogs: allBlogs,
    loading: blogsLoading,
    error: blogsError,
  } = usePublishedBlogs(ALL_BLOGS_LIMIT);

  // ──────────────────────────────────────────────
  // Resolve data source + fallback (pure derivation, NO setState)
  // ──────────────────────────────────────────────
  const { resolvedBlogs, isFallback } = useMemo(() => {
    if (shouldUseSearch) {
      // API search failed → fall back to client-side filtering
      if (searchError && allBlogs.length > 0) {
        const lowerSearch = searchTerm.toLowerCase();
        const lowerCategory = activeCategory.toLowerCase();
        const filtered = allBlogs.filter((post) => {
          const catMatch =
            isAllCategory || (post.category?.toLowerCase() || '') === lowerCategory;
          const title = getLocalizedBlogTitle(post, language).toLowerCase();
          const content = getLocalizedBlogContent(post, language)?.toLowerCase() || '';
          const excerpt = post.excerpt?.toLowerCase() || '';
          const searchMatch =
            !searchTerm ||
            title.includes(lowerSearch) ||
            excerpt.includes(lowerSearch) ||
            content.includes(lowerSearch) ||
            tagsInclude(post.tags, searchTerm);
          return catMatch && searchMatch;
        });
        return { resolvedBlogs: filtered, isFallback: true };
      }
      return { resolvedBlogs: searchResults, isFallback: false };
    }

    if (shouldUseFilter) {
      if (filterError && allBlogs.length > 0) {
        const lowerCategory = activeCategory.toLowerCase();
        const filtered = allBlogs.filter(
          (post) => (post.category?.toLowerCase() || '') === lowerCategory
        );
        return { resolvedBlogs: filtered, isFallback: true };
      }
      return { resolvedBlogs: filteredResults, isFallback: false };
    }

    return { resolvedBlogs: allBlogs, isFallback: false };
  }, [
    shouldUseSearch, shouldUseFilter, searchResults, searchError,
    filteredResults, filterError, allBlogs, activeCategory, searchTerm,
    isAllCategory, language,
  ]);

  // Sync fallback alert via effect (side-effect belongs in useEffect, not useMemo)
  useEffect(() => {
    setShowFallbackAlert(isFallback);
  }, [isFallback]);

  // ──────────────────────────────────────────────
  // Loading & error derivation
  // ──────────────────────────────────────────────
  const loading = shouldUseSearch
    ? searchLoading
    : shouldUseFilter
      ? filterLoading
      : blogsLoading;

  const error = shouldUseSearch
    ? (searchError && allBlogs.length === 0 ? searchError : null)
    : shouldUseFilter
      ? (filterError && allBlogs.length === 0 ? filterError : null)
      : blogsError;

  // ──────────────────────────────────────────────
  // Client-side filtering for "All" tab (no API filters active)
  // ──────────────────────────────────────────────
  const filteredPosts = useMemo(() => {
    if (shouldUseSearch || shouldUseFilter) return resolvedBlogs;

    // "All" mode — filter locally if needed
    if (isAllCategory && !searchTerm) return resolvedBlogs;

    const lowerSearch = searchTerm.toLowerCase();
    return resolvedBlogs.filter((post) => {
      const catMatch = isAllCategory || post.category === activeCategory;
      const title = getLocalizedBlogTitle(post, language).toLowerCase();
      const content = getLocalizedBlogContent(post, language)?.toLowerCase() || '';
      const excerpt = post.excerpt?.toLowerCase() || '';
      const searchMatch =
        !searchTerm ||
        title.includes(lowerSearch) ||
        excerpt.includes(lowerSearch) ||
        content.includes(lowerSearch) ||
        tagsInclude(post.tags, searchTerm);
      return catMatch && searchMatch;
    });
  }, [resolvedBlogs, activeCategory, searchTerm, shouldUseSearch, shouldUseFilter, isAllCategory, language]);

  // ──────────────────────────────────────────────
  // Pagination
  // ──────────────────────────────────────────────
  const isApiPaginated = shouldUseSearch || shouldUseFilter;
  const totalPages = isApiPaginated ? 1 : Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = useMemo(() => {
    if (isApiPaginated) return filteredPosts;
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage, isApiPaginated]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/blog_bg.webp"
          alt={t('blog.page.heroAlt', 'Real Estate Blog')}
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-black/20"></div>
        
        {/* Content */}
        <div className="relative z-[1] text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8">
        
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-6">
            {t('blog.page.title', 'Real Estate')} <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] bg-clip-text text-transparent">{t('blog.page.titleHighlight', 'Blog')}</span>
          </h1>
          
          {/* Subtitle */}
          {/* <p className="text-xl sm:text-2xl text-gray-200 mb-10 leading-relaxed">
            Redefining luxury real estate across Spain and UAE with excellence and innovation
          </p> */}
          
          {/* Stats */}
        
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder={t('blog.page.searchPlaceholder', 'Search articles...')}
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  // Sanitize input to prevent API issues
                  const sanitizedValue = value.replace(/[<>{}[\]\\]/g, '');
                  setSearchTerm(sanitizedValue);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className="w-full px-6 py-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D69F3F] focus:border-transparent text-white placeholder-gray-300 font-light"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
          <div className="w-6 h-10 border-2 border-white/50 mx-auto mb-2 flex justify-center">
            <div className="w-1 h-3 bg-white/70 mt-2 animate-bounce"></div>
          </div>
          <p className="text-xs text-white/70 uppercase tracking-wide">{t('common.scroll', 'Scroll')}</p>
        </div>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D69F3F] to-[#C4903A]"></div>
      </section>

      {/* Filter Section */}
      <section className="relative py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const categoryName = extractCategoryName(category);
              
              // Skip invalid categories
              if (!categoryName || typeof categoryName !== 'string') {
                return null;
              }
              
              return (
                <button
                  key={categoryName}
                  onClick={() => {
                    setActiveCategory(categoryName);
                  }}
                  className={`px-6 py-3 font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === categoryName
                      ? 'bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white shadow-lg shadow-[#D69F3F]/25'
                      : 'bg-white/80 backdrop-blur-sm hover:bg-[#D69F3F]/10 text-gray-700 hover:text-[#D69F3F] border border-gray-200 hover:border-[#D69F3F]'
                  }`}
                >
                  {/* Display translated "All" or keep API category names as-is */}
                  {categoryName === allCategoryText ? allCategoryText : categoryName}
                </button>
              );
            }).filter(Boolean)}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 font-light">
            {t('blog.page.showing', 'Showing')} <span className="font-medium text-[#D69F3F]">{currentPosts.length}</span> {t('blog.page.of', 'of')} <span className="font-medium text-[#D69F3F]">{filteredPosts.length}</span> {t('blog.page.articles', 'articles')}
          </p>
        </div>
      </section>

      {/* Fallback Alert */}
      {showFallbackAlert && (
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert
              type="warning"
              title={t('blog.page.offlineSearchTitle', 'Using Offline Search')}
              message={t('blog.page.offlineSearchMessage', "We're experiencing connectivity issues with our search service. Results are being filtered locally and may be limited.")}
              onClose={() => setShowFallbackAlert(false)}
            />
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-[#D69F3F] border-t-transparent rounded-full animate-spin"></div>
              <h3 className="text-xl font-light text-gray-900 mb-2">{t('blog.page.loadingTitle', 'Loading articles...')}</h3>
              <p className="text-gray-600 font-light">{t('blog.page.loadingMessage', 'Please wait while we fetch the latest content')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-2">{t('blog.page.errorTitle', 'Error loading articles')}</h3>
              <p className="text-gray-600 font-light mb-4">
                {error.includes('400') ? 'Invalid request parameters. Please try refreshing the page.' : error}
              </p>
              {activeCategory !== allCategoryText && (
                <p className="text-sm text-gray-500 mb-4">
                  {t('blog.page.errorCategoryMessage', 'Having trouble loading articles for')} "{activeCategory}". {t('blog.page.errorSuggestion', 'You can try viewing all articles or a different category.')}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => {
                    setActiveCategory(allCategoryText);
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  {t('blog.page.viewAllArticles', 'View All Articles')}
                </button>
                <button 
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  {t('common.retry', 'Try Again')}
                </button>
              </div>
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-2">{t('blog.page.noArticlesTitle', 'No articles found')}</h3>
              <p className="text-gray-600 font-light">{t('blog.page.noArticlesMessage', 'Try adjusting your search or filter criteria')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post, index) => {
                // Get localized content for each post
                const localizedTitle = getLocalizedBlogTitle(post, language);
                const localizedContent = getLocalizedBlogContent(post, language);
                
                return (
                  <article 
                    key={post.id}
                    className="group bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.bannerImage || '/images/luxury-villa-placeholder.svg'}
                        alt={localizedTitle}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* <div className="absolute top-4 right-4">
                        <span className={`text-white text-xs font-medium px-3 py-1.5 shadow-lg backdrop-blur-sm ${
                          post.category === 'Market trends' ? 'bg-gradient-to-r from-blue-500/90 to-blue-600/90' :
                          post.category === 'Investment' ? 'bg-gradient-to-r from-green-500/90 to-green-600/90' :
                          post.category === 'Legal' ? 'bg-gradient-to-r from-purple-500/90 to-purple-600/90' :
                          post.category === 'Lifestyle' ? 'bg-gradient-to-r from-pink-500/90 to-pink-600/90' :
                          post.category === 'Tips & Advice' ? 'bg-gradient-to-r from-orange-500/90 to-orange-600/90' :
                          post.category === 'Properties' ? 'bg-gradient-to-r from-[#D69F3F]/90 to-[#C4903A]/90' :
                          'bg-gradient-to-r from-gray-500/90 to-gray-600/90'
                        }`}>
                          {post.category}
                        </span>
                      </div> */}

                      {/* {post.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-[#D69F3F]/90 to-[#C4903A]/90 text-white text-xs font-medium px-3 py-1.5 shadow-lg backdrop-blur-sm">
                            Featured
                          </span>
                        </div>
                      )} */}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3 font-light">
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{t('blog.page.byAuthor', 'By')} {post.author}</span>
                      </div>
                      
                      <h3 className="text-xl font-light text-gray-900 mb-3 group-hover:text-[#D69F3F] transition-colors duration-300 line-clamp-2">
                        {localizedTitle}
                      </h3>
  {/*                     
                      <p className="text-gray-600 mb-4 line-clamp-3 font-light">
                        {post.excerpt}
                      </p> */}

                      {/* Tags section - uncomment and fix when needed
                      {post.tags && post.tags.trim() !== '' && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 font-light">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      */}

                      <div className="flex items-center justify-between">
                        {/* <span className="text-sm text-gray-500 font-light">{post.author}</span> */}
                        <Link 
                          href={`/blog/${post.slug || createBlogSlug(localizedTitle)}`}
                          className="text-[#D69F3F] hover:text-[#C4903A] font-medium text-sm flex items-center group/link"
                        >
                          {t('blog.readMore', 'Read More')}
                          <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-light"
              >
                {t('common.previous', 'Previous')}
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 font-medium ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-light"
              >
                {t('common.next', 'Next')}
              </button>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;