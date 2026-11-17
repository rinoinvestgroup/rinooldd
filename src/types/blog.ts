/**
 * Blog type definitions
 */

export interface Blog {
  id: string;
  title: string;
  title_ar?: string | null;
  title_zh?: string | null;
  title_es?: string | null;
  title_de?: string | null;
  slug: string;
  excerpt?: string;
  content: string;
  content_ar?: string | null;
  content_zh?: string | null;
  content_es?: string | null;
  content_de?: string | null;
  bannerImage?: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  tags?: string | string[]; // Allow both string and array formats for flexibility
  publishedAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
}

export interface BlogSearchParams {
  query?: string;
  category?: string;
  author?: string;
  status?: 'published' | 'draft' | 'archived';
  page?: number;
  limit?: number;
  tags?: string | string[]; // Allow both formats for search params too
}

export interface BlogApiResponse {
  data: Blog[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalViews: number;
  categoryCounts: Record<string, number>;
}

// Localization utility functions for blogs
export const getLocalizedBlogTitle = (blog: Blog, language: string = 'en'): string => {
  if (language === 'ar' && blog.title_ar) return blog.title_ar;
  if (language === 'zh' && blog.title_zh) return blog.title_zh;
  if (language === 'es' && blog.title_es) return blog.title_es;
  if (language === 'de' && blog.title_de) return blog.title_de;
  return blog.title; // Fallback to English
};

export const getLocalizedBlogContent = (blog: Blog, language: string = 'en'): string => {
  if (language === 'ar' && blog.content_ar) return blog.content_ar;
  if (language === 'zh' && blog.content_zh) return blog.content_zh;
  if (language === 'es' && blog.content_es) return blog.content_es;
  if (language === 'de' && blog.content_de) return blog.content_de;
  return blog.content; // Fallback to English
};