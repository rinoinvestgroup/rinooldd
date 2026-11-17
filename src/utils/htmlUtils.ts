/**
 * HTML processing utilities
 */

/**
 * Clean HTML content by removing unwanted tags and attributes
 */
export const cleanHtmlContent = (htmlContent: string): string => {
  if (!htmlContent) return '';

  // Remove script tags and their content
  let cleaned = htmlContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags and their content
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove dangerous attributes
  cleaned = cleaned.replace(/\s(on\w+)="[^"]*"/gi, ''); // Remove event handlers
  cleaned = cleaned.replace(/\sjavascript:[^"']*/gi, ''); // Remove javascript: URLs
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};

/**
 * Convert plain text with line breaks to HTML
 */
export const textToHtml = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
};

/**
 * Strip all HTML tags from content
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
};

/**
 * Truncate HTML content to a specific length while preserving HTML structure
 */
export const truncateHtml = (html: string, maxLength: number = 200): string => {
  const plainText = stripHtmlTags(html);
  
  if (plainText.length <= maxLength) {
    return html;
  }
  
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

/**
 * Check if content contains HTML tags
 */
export const isHtmlContent = (content: string): boolean => {
  if (!content) return false;
  
  // Simple regex to detect HTML tags
  const htmlRegex = /<[^>]+>/;
  return htmlRegex.test(content);
};

/**
 * Advanced URL patterns for image detection
 */
const IMAGE_URL_PATTERNS = {
  // Standard image extensions
  standard: /(https?:\/\/[^\s\)\]}>]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?[^\s\)\]}>]*)?)/gi,
  
  // AWS S3 URLs with image extensions
  awsS3: /(https?:\/\/[^\s\)\]}>]*\.s3[^\s\)\]}>]*\.amazonaws\.com[^\s\)\]}>]*\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?[^\s\)\]}>]*)?)/gi,
  
  // Google Cloud Storage
  googleCloud: /(https?:\/\/storage\.googleapis\.com[^\s\)\]}>]*\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?[^\s\)\]}>]*)?)/gi,
  
  // Azure Blob Storage
  azureBlob: /(https?:\/\/[^\s\)\]}>]*\.blob\.core\.windows\.net[^\s\)\]}>]*\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?[^\s\)\]}>]*)?)/gi,
  
  // Cloudinary URLs
  cloudinary: /(https?:\/\/res\.cloudinary\.com[^\s\)\]}>]*\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?[^\s\)\]}>]*)?)/gi,
  
  // Generic CDN patterns that might contain images
  genericCdn: /(https?:\/\/[^\s\)\]}>]*(?:cdn|images?|media|assets)[^\s\)\]}>]*\.(?:jpg|jpeg|png|gif|webp|svg|bmp|tiff)(?:\?[^\s\)\]}>]*)?)/gi
};

/**
 * Extract all potential image URLs from content using multiple patterns
 */
export const extractImageUrls = (content: string): string[] => {
  if (!content) return [];
  
  const foundUrls = new Set<string>();
  
  // Apply all patterns to find image URLs
  Object.values(IMAGE_URL_PATTERNS).forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(url => {
      // Clean the URL (remove trailing punctuation)
      const cleanUrl = url.replace(/[.,;!?\)\]}>]+$/, '');
      if (cleanUrl && isValidImageUrl(cleanUrl)) {
        foundUrls.add(cleanUrl);
      }
    });
  });
  
  return Array.from(foundUrls);
};

/**
 * Validate if a URL is likely to be an image
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    
    // Check for valid protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check for image extensions in pathname or search params
    const pathAndParams = urlObj.pathname + urlObj.search;
    const imageExtRegex = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)(\?|$|&)/i;
    
    return imageExtRegex.test(pathAndParams);
  } catch {
    return false;
  }
};

/**
 * Generate smart alt text from URL
 */
export const generateImageAltText = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Extract filename without extension
    const filename = pathname.split('/').pop() || 'image';
    const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i, '');
    
    // Convert filename to readable text
    const readable = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to spaces
      .replace(/\s+/g, ' ')
      .trim();
    
    return readable || 'Blog image';
  } catch {
    return 'Blog image';
  }
};

/**
 * Process content and replace image URLs with HTML img tags inline
 */
export const processContentWithInlineImages = (content: string): string => {
  if (!content) return '';
  
  let processedContent = content;
  const imageUrls = extractImageUrls(content);
  
  // Replace each image URL with an HTML img tag at its exact position
  imageUrls.forEach(url => {
    const altText = generateImageAltText(url);
    const imageTag = `
      <div class="inline-image-container my-4">
        <img 
          src="${url}" 
          alt="${altText}"
          class="inline-blog-image w-full max-w-full h-auto rounded-lg shadow-md object-cover"
          loading="lazy"
          style="max-height: 400px;"
          onError="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <div class="image-error-fallback hidden bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-gray-500 text-sm">Failed to load image</p>
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline text-xs">View original</a>
        </div>
      </div>
    `;
    
    // Replace the URL with the image tag, using exact match
    const urlEscaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const urlRegex = new RegExp(`\\b${urlEscaped}\\b`, 'g');
    processedContent = processedContent.replace(urlRegex, imageTag);
  });
  
  return processedContent;
};

/**
 * Convert content to safe HTML for rendering with inline images
 */
export const processContentForRendering = (content: string): string => {
  if (!content) return '';
  
  try {
    let processedContent = content;
    
    // First, process image URLs to replace them with img tags inline
    processedContent = processContentWithInlineImages(processedContent);

    // Convert Markdown-style links to HTML <a> tags BEFORE HTML detection
    // Handles: [text](url) and [](url) where text is optional
    processedContent = processedContent.replace(/\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, (match, text, url) => {
      const linkText = text && text.trim().length > 0 ? text : url;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    });
    
    // If it's already HTML, clean it
    if (isHtmlContent(processedContent)) {
      return cleanHtmlContent(processedContent);
    }
    
    // If it's plain text, convert to HTML
    return textToHtml(processedContent);
  } catch (error) {
    // Return plain text wrapped in paragraph tags as fallback
    return `<p>${content}</p>`;
  }
};
