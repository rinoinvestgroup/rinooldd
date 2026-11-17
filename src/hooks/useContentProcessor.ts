import { useMemo } from 'react';
import { processContentForRendering, extractImageUrls } from '../utils/htmlUtils';

export interface ContentProcessorResult {
  processedContent: string;
  imageCount: number;
  imageUrls: string[];
  hasContent: boolean;
  error?: string;
}

/**
 * Custom hook for processing content with inline images
 * Provides memoized processing and metadata about the content
 */
export const useContentProcessor = (content: string = ''): ContentProcessorResult => {
  return useMemo(() => {
    try {
      // Ensure content is always a string to prevent type issues
      const safeContent = typeof content === 'string' ? content : '';
      const trimmedContent = safeContent.trim();
      
      if (!trimmedContent) {
        return {
          processedContent: '',
          imageCount: 0,
          imageUrls: [],
          hasContent: false,
        };
      }

      const processedContent = processContentForRendering(trimmedContent);
      const imageUrls = extractImageUrls(trimmedContent);
      
      return {
        processedContent,
        imageCount: imageUrls.length,
        imageUrls,
        hasContent: true,
      };
    } catch (error) {
      return {
        processedContent: content || '',
        imageCount: 0,
        imageUrls: [],
        hasContent: Boolean(content),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }, [content]);
};
