/**
 * Utility functions for handling category data
 */

export interface CategoryWithCount {
  category: string;
  count: number;
}

export type CategoryData = string | CategoryWithCount | { name: string; count?: number };

/**
 * Safely extract category name from various category data formats
 */
export const extractCategoryName = (categoryData: CategoryData): string => {
  if (typeof categoryData === 'string') {
    return categoryData;
  }
  
  if (typeof categoryData === 'object' && categoryData !== null) {
    // Handle {category: "name", count: number} format
    if ('category' in categoryData && typeof categoryData.category === 'string') {
      return categoryData.category;
    }
    
    // Handle {name: "name", count?: number} format
    if ('name' in categoryData && typeof categoryData.name === 'string') {
      return categoryData.name;
    }
  }
  
  // Fallback: convert to string
  return String(categoryData);
};

/**
 * Convert array of mixed category data to array of category names
 */
export const normalizeCategoryArray = (categories: CategoryData[]): string[] => {
  return categories.map(extractCategoryName);
};

/**
 * Type guard to check if category data has count information
 */
export const hasCategoryCount = (categoryData: CategoryData): categoryData is CategoryWithCount => {
  return typeof categoryData === 'object' && 
         categoryData !== null && 
         'category' in categoryData && 
         'count' in categoryData;
};
