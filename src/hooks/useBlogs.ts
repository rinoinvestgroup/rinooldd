import { useState, useEffect, useCallback } from 'react';
import { Blog, BlogSearchParams } from '../types/blog';
import BlogApiService from '../services/blogApiService';
import { getCachedBlogs, setCachedBlogs } from '../utils/blogsCache';

interface UseBlogsResult {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  totalBlogs: number;
}

/**
 * Hook to fetch all blogs
 */
export const useBlogs = (params?: { page?: number; limit?: number }): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    try {
      // Try to use cached data first (only for default params)
      const cacheKey = `all_${params?.page || 1}_${params?.limit || 100}`;
      if (!forceRefresh) {
        const cachedData = getCachedBlogs(cacheKey);
        if (cachedData && cachedData.length > 0) {
          setBlogs(cachedData);
          setLoading(false);
          setError(null);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getAllBlogs(params);
      
      // Cache the blogs
      if (data.length > 0) {
        setCachedBlogs(cacheKey, data);
      }
      
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [params?.page, params?.limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: () => fetchBlogs(true),
    totalBlogs: blogs.length
  };
};

/**
 * Hook to fetch published blogs only
 */
export const usePublishedBlogs = (limit?: number): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    try {
      // Try to use cached data first
      const cacheKey = `published_${limit || 'all'}`;
      if (!forceRefresh) {
        const cachedData = getCachedBlogs(cacheKey);
        if (cachedData && cachedData.length > 0) {
          setBlogs(cachedData);
          setLoading(false);
          setError(null);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getPublishedBlogs(limit);
      
      // Cache the blogs
      if (data.length > 0) {
        setCachedBlogs(cacheKey, data);
      }
      
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch published blogs');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: () => fetchBlogs(true),
    totalBlogs: blogs.length
  };
};

/**
 * Hook to search blogs
 */
export const useBlogSearch = (searchParams: BlogSearchParams): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await BlogApiService.searchBlogs(searchParams);
      setBlogs(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search blogs';
      setError(errorMessage);
      
      // Set empty array on error instead of keeping previous results
      setBlogs([]);
    } finally {
      setLoading(false);
    } 
  }, [
    searchParams.query,
    searchParams.category,
    searchParams.author,
    searchParams.status,
    searchParams.page,
    searchParams.limit
  ]);

  useEffect(() => {
    if (Object.keys(searchParams).length > 0) {
      search();
    }
  }, [search]);

  return {
    blogs,
    loading,
    error,
    refetch: search,
    totalBlogs: blogs.length
  };
};

/**
 * Hook to fetch a single blog by slug
 */
export const useBlogBySlug = (slug: string) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    if (!slug || slug.trim() === '') {
      setLoading(false);
      setError(slug === '' ? 'No blog slug provided' : 'Invalid blog slug');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await BlogApiService.getBlogBySlug(slug);
      
      if (!data) {
        setError('Blog not found');
      } 
      
      setBlog(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return {
    blog,
    loading,
    error,
    refetch: fetchBlog
  };
};

/**
 * Hook to fetch recent blogs
 */
export const useRecentBlogs = (limit: number = 6): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    try {
      // Try to use cached data first
      const cacheKey = `recent_${limit}`;
      if (!forceRefresh) {
        const cachedData = getCachedBlogs(cacheKey);
        if (cachedData && cachedData.length > 0) {
          setBlogs(cachedData);
          setLoading(false);
          setError(null);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getRecentBlogs(limit);
      
      // Cache the blogs
      if (data.length > 0) {
        setCachedBlogs(cacheKey, data);
      }
      
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent blogs');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: () => fetchBlogs(true),
    totalBlogs: blogs.length
  };
};

/**
 * Hook to fetch featured blogs
 */
export const useFeaturedBlogs = (limit: number = 3): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    try {
      // Try to use cached data first
      const cacheKey = `featured_${limit}`;
      if (!forceRefresh) {
        const cachedData = getCachedBlogs(cacheKey);
        if (cachedData && cachedData.length > 0) {
          setBlogs(cachedData);
          setLoading(false);
          setError(null);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getFeaturedBlogs(limit);
      
      // Cache the blogs
      if (data.length > 0) {
        setCachedBlogs(cacheKey, data);
      }
      
      setBlogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch featured blogs');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: () => fetchBlogs(true),
    totalBlogs: blogs.length
  };
};

/**
 * Hook to fetch blogs by category
 */
export const useBlogsByCategory = (category: string, limit?: number): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    if (!category) return;

    try {
      // Try to use cached data first
      const cacheKey = `category_${category}_${limit || 'all'}`;
      if (!forceRefresh) {
        const cachedData = getCachedBlogs(cacheKey);
        if (cachedData && cachedData.length > 0) {
          setBlogs(cachedData);
          setLoading(false);
          setError(null);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getBlogsByCategory(category, limit);
      
      // Cache the blogs
      if (data.length > 0) {
        setCachedBlogs(cacheKey, data);
      }
      
      setBlogs(data);
    } catch (err: any) {
      setError(err.message || `Failed to fetch blogs for category: ${category}`);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: () => fetchBlogs(true),
    totalBlogs: blogs.length
  };
};

/**
 * Hook to fetch related blogs
 */
export const useRelatedBlogs = (blogId: string, limit: number = 4): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async (forceRefresh = false) => {
    if (!blogId) return;

    try {
      // Try to use cached data first
      const cacheKey = `related_${blogId}_${limit}`;
      if (!forceRefresh) {
        const cachedData = getCachedBlogs(cacheKey);
        if (cachedData && cachedData.length > 0) {
          setBlogs(cachedData);
          setLoading(false);
          setError(null);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getRelatedBlogs(blogId, limit);
      
      // Cache the blogs
      if (data.length > 0) {
        setCachedBlogs(cacheKey, data);
      }
      
      setBlogs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch related blogs');
    } finally {
      setLoading(false);
    }
  }, [blogId, limit]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: () => fetchBlogs(true),
    totalBlogs: blogs.length
  };
};

/**
 * Hook to filter blogs using the new filter endpoint
 */
export const useBlogFilter = (filterParams: {
  category?: string;
  status?: string;
  author?: string;
  query?: string;
  page?: number;
  limit?: number;
}): UseBlogsResult => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filter = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await BlogApiService.filterBlogs(filterParams);
      setBlogs(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to filter blogs';
      setError(errorMessage);
      
      // Set empty array on error instead of keeping previous results
      setBlogs([]);
    } finally {
      setLoading(false);
    } 
  }, [
    filterParams.category,
    filterParams.status,
    filterParams.author,
    filterParams.query,
    filterParams.page,
    filterParams.limit
  ]);

  useEffect(() => {
    if (Object.values(filterParams).some(value => value !== undefined && value !== '')) {
      filter();
    }
  }, [filter]);

  return {
    blogs,
    loading,
    error,
    refetch: filter,
    totalBlogs: blogs.length
  };
};

/**
 * Hook to fetch blog categories
 */
export const useBlogCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

/**
 * Hook to fetch blog statistics
 */
export const useBlogStats = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    categoryCounts: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BlogApiService.getBlogStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
