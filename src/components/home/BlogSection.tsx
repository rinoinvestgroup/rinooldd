import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecentBlogs } from '../../hooks/useBlogs';
import { getLocalizedBlogTitle, getLocalizedBlogContent } from '../../types/blog';
import { createBlogSlug } from '../../utils/slugUtils';
import { useLanguage } from '../../context/LanguageContext';

const BlogSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const { t, language } = useLanguage();

  // Fetch recent blogs using the API hook
  const { blogs: recentBlogs, loading, error } = useRecentBlogs(6);

  const filteredPosts = activeCategory === 'All' 
    ? recentBlogs 
    : recentBlogs.filter(post => post.category === activeCategory);

  // const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <section className="relative py-8 overflow-hidden">
     
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
       
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-light text-black leading-tight tracking-wide mb-2">
            <span className="font-light text-gray-700">{t('blog.section.title')} </span>
            <span className="font-light text-[#D69F3F]">{t('blog.section.titleHighlight')}</span>
          </h2>
          
       
        </div>
      
        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 px-4 sm:px-0">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white overflow-hidden shadow-lg border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">{t('blog.section.loadingError')}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            // No posts state
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">{t('blog.section.noPosts')}</p>
            </div>
          ) : (
            filteredPosts.slice(0,3).map((post, index) => {
              // Get localized content for each post
              const localizedTitle = getLocalizedBlogTitle(post, language);
              const localizedContent = getLocalizedBlogContent(post, language);
              
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug || createBlogSlug(localizedTitle)}`}
                  className="group bg-white overflow-hidden shadow-lg hover: transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 cursor-pointer block"
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`
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
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                {/* <div className="absolute top-4 right-4">
                  <span className={`text-white text-xs font-bold px-3 py-1  shadow-lg ${
                    post.category === 'Market trends' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    post.category === 'Investment' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    post.category === 'Legal' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                    post.category === 'Lifestyle' ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                    post.category === 'Tips & Advice' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                    post.category === 'Properties' ? 'bg-gradient-to-r from-[#D69F3F] to-[#C4903A]' :
                    'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}>
                    {post.category}
                  </span>
                </div> */}

                {/* {post.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-[#D69F3F] to-[#C4903A] text-white text-xs font-bold px-3 py-1  shadow-lg">
                      Featured
                    </span>
                  </div>
                )} */}
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{t('blog.section.byAuthor')} {post.author}</span>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#D69F3F] transition-colors duration-300 line-clamp-2">
                  {localizedTitle}
                </h3>
                
                {/* <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p> */}

                <div className="flex items-center justify-between">
                  {/* <span className="text-sm text-gray-500">{post.author}</span> */}
                  <div className="text-[#D69F3F] hover:text-[#C4903A] font-semibold text-sm flex items-center group/link">
                    {t('blog.readMore')}
                    <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
              );
            })
          )}
        </div>

       

        {/* CTA Section */}
        <div className="text-center">
          <Link 
            href="/blog"
            className="group relative inline-flex items-center bg-gradient-to-r from-[#D69F3F] to-[#C4903A] hover:from-[#C4903A] hover:to-[#D69F3F] text-white px-10 py-4  font-bold text-lg transition-all duration-300  hover: transform hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              {t('blog.section.exploreAll')}
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 "></span>
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
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
    </section>
  );
};

export default BlogSection;