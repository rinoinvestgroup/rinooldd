import { Blog, BlogSearchParams } from '../types/blog';
import { 
  getAllBlogs, 
  searchBlogs,
  getBlogCategories, 
  getBlogById, 
  getBlogBySlug as httpGetBlogBySlug, 
  getBlogsByCategory as httpGetBlogsByCategory,
  filterBlogs,
  transformApiBlog 
} from './httpServices';
import { normalizeCategoryArray } from '../utils/categoryUtils';
import { createBlogSlug } from '../utils/slugUtils';

/**
 * Centralized API service for fetching blogs
 */
export class BlogApiService {
  
  /**
   * Fetch all blogs
   */
  static async getAllBlogs(params?: { page?: number; limit?: number }): Promise<Blog[]> {
    try {
      const response = await getAllBlogs(params);
      
      // Handle different response structures
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      if (responseData && Array.isArray(responseData)) {
        // Transform API data to UI format with safety checks
        const transformedBlogs = responseData.map(transformApiBlog);
        return transformedBlogs;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error: any) {
      // Provide detailed error information
      let errorMessage = 'Failed to load blogs from API';
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Blogs endpoint not found. Please check API configuration.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please check API credentials.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Search blogs with filters
   */
  static async searchBlogs(searchParams: BlogSearchParams): Promise<Blog[]> {
    try {
      const response = await searchBlogs(searchParams);
      
      // Handle different response structures
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      // Check if we need to do client-side filtering (from fallback strategy)
      const needsClientFiltering = responseData._searchStrategy === 'fallback' || responseData._needsClientFiltering;
      const filterCategory = responseData._filterCategory;
      
      if (responseData && Array.isArray(responseData)) {
        // Transform API data to UI format
        let transformedBlogs = responseData.map(transformApiBlog);
        
        // Apply client-side filtering if needed
        if (needsClientFiltering && filterCategory) {
          transformedBlogs = transformedBlogs.filter(blog => {
            // Case-insensitive category comparison
            const blogCategory = blog.category?.toLowerCase() || '';
            const targetCategory = filterCategory.toLowerCase();
            
            const matches = blogCategory === targetCategory;
          
            return matches;
          });
          
        } else if (needsClientFiltering) {
          transformedBlogs = transformedBlogs.filter(blog => {
            let matches = true;
            
            if (searchParams.status && blog.status !== searchParams.status) {
              matches = false;
            }
            
            if (searchParams.category) {
              const blogCategory = blog.category?.toLowerCase() || '';
              const targetCategory = searchParams.category.toLowerCase();
              if (blogCategory !== targetCategory) {
                matches = false;
              }
            }
            
            if (searchParams.author && blog.author !== searchParams.author) {
              matches = false;
            }
            
            if (searchParams.query) {
              const query = searchParams.query.toLowerCase();
              const matchesTitle = blog.title.toLowerCase().includes(query);
              const matchesExcerpt = blog.excerpt?.toLowerCase().includes(query) || false;
              const matchesTags = Array.isArray(blog.tags) 
                ? blog.tags.some(tag => tag.toLowerCase().includes(query))
                : false;
              
              if (!matchesTitle && !matchesExcerpt && !matchesTags) {
                matches = false;
              }
            }
            
            return matches;
          });
          
        }
        
        return transformedBlogs;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error: any) {
    
      
      // Enhanced fallback: if search fails, try to get all blogs and filter client-side
      try {
        const allBlogs = await this.getAllBlogs({ limit: 200 });
        const filtered = allBlogs.filter(blog => {
          // Apply search filters client-side
          let matches = true;
          
          if (searchParams.status && blog.status !== searchParams.status) {
            matches = false;
          }
          
          if (searchParams.category && blog.category !== searchParams.category) {
            matches = false;
          }
          
          if (searchParams.author && blog.author !== searchParams.author) {
            matches = false;
          }
          
          if (searchParams.query) {
            const query = searchParams.query.toLowerCase();
            const matchesTitle = blog.title.toLowerCase().includes(query);
            const matchesExcerpt = blog.excerpt?.toLowerCase().includes(query) || false;
            const matchesTags = Array.isArray(blog.tags) 
              ? blog.tags.some(tag => tag.toLowerCase().includes(query))
              : false;
            
            if (!matchesTitle && !matchesExcerpt && !matchesTags) {
              matches = false;
            }
          }
          
          return matches;
        });
        
        return filtered;
      } catch (fallbackError) {
        throw new Error(error.message || 'Failed to search blogs');
      }
    }
  }

  /**
   * Fetch published blogs only
   */
  static async getPublishedBlogs(limit?: number): Promise<Blog[]> {
    try {
      const allBlogs = await this.getAllBlogs({ page: 1, limit: limit || 100 });
      const publishedBlogs = allBlogs.filter(blog => blog.status === 'published');
      return publishedBlogs;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch blogs by category using the new filter endpoint
   */
  static async getBlogsByCategory(category: string, limit?: number): Promise<Blog[]> {
    try {
      
      // First try the new filter endpoint
      try {
        const response = await filterBlogs({
          category: category,
          status: 'published',
          page: 1,
          limit: limit || 50
        });
        
        // Handle different response structures
        let responseData = response;
        if (response && response.data) {
          responseData = response.data;
        }
        
        if (responseData && Array.isArray(responseData)) {
          const transformedBlogs = responseData.map(transformApiBlog);
          return transformedBlogs;
        }
      } catch (filterError: any) {
      }
      
      // Fallback to the original category endpoint
      try {
        const response = await httpGetBlogsByCategory(category, {
          status: 'published',
          page: 1,
          limit: limit || 50
        });
        
        // Handle different response structures
        let responseData = response;
        if (response && response.data) {
          responseData = response.data;
        }
        
        if (responseData && Array.isArray(responseData)) {
          const transformedBlogs = responseData.map(transformApiBlog);
          return transformedBlogs;
        }
      } catch (categoryError: any) {
      }
      
      // Fallback to search method
      const searchParams: BlogSearchParams = {
        category: category,
        status: 'published',
        page: 1,
        limit: limit || 50
      };
      
      const blogs = await this.searchBlogs(searchParams);
      return blogs;
    } catch (error: any) {
      
      // Final fallback: get all blogs and filter locally
      try {
        const allBlogs = await this.getPublishedBlogs();
        const filteredBlogs = allBlogs.filter(blog => {
          const blogCategory = blog.category?.toLowerCase() || '';
          const targetCategory = category.toLowerCase();
          return blogCategory === targetCategory;
        });
        
        return filteredBlogs.slice(0, limit || 50);
      } catch (fallbackError) {
        // Return empty array instead of throwing error
        return [];
      }
    }
  }

  /**
   * Fetch recent blogs
   */
  static async getRecentBlogs(limit: number = 6): Promise<Blog[]> {
    try {
      const blogs = await this.getPublishedBlogs(limit);
      // Sort by publication date (newest first)
      return blogs.sort((a, b) => {
        const dateA = a.publishedAt || a.createdAt;
        const dateB = b.publishedAt || b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }).slice(0, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch featured blogs (high view count or marked as important)
   */
  static async getFeaturedBlogs(limit: number = 3): Promise<Blog[]> {
    try {
      const blogs = await this.getPublishedBlogs();
      // Sort by views (highest first) and take the top ones
      return blogs.sort((a, b) => b.views - a.views).slice(0, limit);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available blog categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const response = await getBlogCategories();
      
      // Handle different response structures
      let categories = response;
      if (response && response.data) {
        categories = response.data;
      }
      
      if (Array.isArray(categories)) {
        // Use utility function to normalize category array regardless of format
        return normalizeCategoryArray(categories);
      } else {
        // Fallback: extract categories from all blogs
        const blogs = await this.getAllBlogs();
        const uniqueCategories = Array.from(new Set(blogs.map(blog => blog.category)));
        return uniqueCategories;
      }
    } catch (error: any) {
      
      // Fallback to default categories
      return [
        'Technology',
        'Business',
        'Lifestyle',
        'Health',
        'Travel',
        'Food',
        'Fashion',
        'Education',
        'Finance',
        'Entertainment',
        'Sports',
        'News',
        'Real Estate',
        'Automotive',
        'Other'
      ];
    }
  }

  /**
   * Fetch a single blog by ID
   */
  static async getBlogById(id: string): Promise<Blog | null> {
    try {
      const response = await getBlogById(id);
      
      if (response) {
        // Handle different response structures
        const blogData = response.data || response;
        
        // Transform API data to UI format
        const transformedBlog = transformApiBlog(blogData);
        return transformedBlog;
      } else {
        return null;
      }
    } catch (error: any) {
      
      // If direct API call fails, try to find in all blogs as fallback
      try {
        const allBlogs = await this.getAllBlogs();
        const blog = allBlogs.find(b => 
          b.id === id || 
          b.id.toString() === id
        );
        return blog || null;
      } catch (fallbackError) {
        return null;
      }
    }
  }

  /**
   * Fetch a single blog by slug - Optimized for ISR
   */
  static async getBlogBySlug(slug: string): Promise<Blog | null> {
    
    if (!slug || slug.trim() === '') {
      return null;
    }

    try {
      const response = await httpGetBlogBySlug(slug);
      
      // Handle different response structures
      const blogData = response.data || response;
      
      if (!blogData) {
        return null;
      }
      
      // Transform API data to UI format
      const transformedBlog = transformApiBlog(blogData);
      return transformedBlog;
    } catch (error: any) {
      
      // ISR-optimized fallback: try to find in all blogs
      return await this.getBlogBySlugWithFallback(slug);
    }
  }

  /**
   * Fetch a single blog by slug with fallback - Optimized for ISR build time and runtime
   */
  static async getBlogBySlugWithFallback(slug: string): Promise<Blog | null> {
    try {
      
      // Get all blogs and search locally (more expensive but necessary for ISR builds)
      const allBlogs = await this.getAllBlogs();
      
      const blog = allBlogs.find(b => {
        // Try exact match first
        if (b.slug === slug) {
          return true;
        }
        
        // Try case-insensitive match
        if (b.slug && b.slug.toLowerCase() === slug.toLowerCase()) {
          return true;
        }
        
        // Try generated slug from title
        const generatedSlug = createBlogSlug(b.title);
        if (generatedSlug === slug) {
          return true;
        }
        
        return false;
      });
      
      
      return blog || null;
    } catch (error: any) {
      return null;
    }
  }

  /**
   * Get related blogs based on category or tags
   */
  static async getRelatedBlogs(blogId: string, limit: number = 4): Promise<Blog[]> {
    try {
      // First get the current blog to find its category
      const currentBlog = await this.getBlogById(blogId);
      if (!currentBlog) {
        return [];
      }

      // Get blogs in the same category
      const relatedBlogs = await this.getBlogsByCategory(currentBlog.category);
      
      // Filter out the current blog and return limited results
      return relatedBlogs
        .filter(blog => blog.id !== blogId)
        .slice(0, limit);
    } catch (error) {
      return [];
    }
  }

  /**
   * Get blogs by author
   */
  static async getBlogsByAuthor(author: string, limit?: number): Promise<Blog[]> {
    try {
      const searchParams: BlogSearchParams = {
        author,
        status: 'published',
        page: 1,
        limit: limit || 50
      };
      
      const blogs = await this.searchBlogs(searchParams);
      return blogs;
    } catch (error: any) {
      throw new Error(`Failed to fetch blogs for author: ${author}`);
    }
  }

  /**
   * Filter blogs using the new filter endpoint
   */
  static async filterBlogs(filterParams: {
    category?: string;
    status?: string;
    author?: string;
    query?: string;
    page?: number;
    limit?: number;
  }): Promise<Blog[]> {
    try {
      
      const response = await filterBlogs(filterParams);
      
      // Handle different response structures
      let responseData = response;
      if (response && response.data) {
        responseData = response.data;
      }
      
      if (responseData && Array.isArray(responseData)) {
        const transformedBlogs = responseData.map(transformApiBlog);
        return transformedBlogs;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error: any) {
      
      // Fallback to search method
      try {
        const searchParams: BlogSearchParams = {
          query: filterParams.query,
          category: filterParams.category,
          author: filterParams.author,
          status: filterParams.status as 'published' | 'draft' | 'archived' | undefined,
          page: filterParams.page,
          limit: filterParams.limit
        };
        
        return await this.searchBlogs(searchParams);
      } catch (searchError) {
        throw new Error(error.message || 'Failed to filter blogs');
      }
    }
  }

  /**
   * Get blog statistics
   */
  static async getBlogStats(): Promise<{
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
    categoryCounts: Record<string, number>;
  }> {
    try {
      const allBlogs = await this.getAllBlogs();
      
      const stats = {
        totalBlogs: allBlogs.length,
        publishedBlogs: allBlogs.filter(b => b.status === 'published').length,
        draftBlogs: allBlogs.filter(b => b.status === 'draft').length,
        totalViews: allBlogs.reduce((sum, blog) => sum + blog.views, 0),
        categoryCounts: allBlogs.reduce((acc, blog) => {
          acc[blog.category] = (acc[blog.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      return stats;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get blogs optimized for ISR generation (featured and recent combined)
   */
  static async getBlogsForISRGeneration(limit: number = 25): Promise<Blog[]> {
    try {
      
      // Get featured blogs (high view count)
      const featuredBlogs = await this.getFeaturedBlogs(Math.ceil(limit * 0.6));
      
      // Get recent blogs
      const recentBlogs = await this.getRecentBlogs(Math.ceil(limit * 0.4));
      
      // Combine and deduplicate
      const combinedBlogs = [...featuredBlogs, ...recentBlogs];
      const uniqueBlogs = combinedBlogs.filter((blog, index, array) => 
        array.findIndex(b => b.id === blog.id) === index
      );

      // Sort by priority: featured first, then by date
      const sortedBlogs = uniqueBlogs.sort((a, b) => {
        // Featured blogs first
        const aIsFeatured = featuredBlogs.some(fb => fb.id === a.id);
        const bIsFeatured = featuredBlogs.some(fb => fb.id === b.id);
        
        if (aIsFeatured && !bIsFeatured) return -1;
        if (!aIsFeatured && bIsFeatured) return 1;
        
        // Then by date (newest first)
        const dateA = a.publishedAt || a.createdAt;
        const dateB = b.publishedAt || b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

      const result = sortedBlogs.slice(0, limit);
      
      return result;
    } catch (error) {
      // Fallback to recent blogs only
      try {
        return await this.getRecentBlogs(limit);
      } catch (fallbackError) {
        return [];
      }
    }
  }
}

export default BlogApiService;
