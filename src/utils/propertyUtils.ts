/**
 * Utility functions for property data processing and optimization
 */
import type { Property } from '../data/properties';

// Type definitions for property stats
export interface PropertyStat {
  label: string;
  value: string | number;
}

export interface PropertyStatsInput {
  beds: number;
  baths: number;
  area: string;
}

// Memoized function to safely convert description to string
export const getDescriptionAsString = (description: string | string[]): string => {
  if (Array.isArray(description)) {
    return description.join(' ');
  }
  return description || '';
};

// Optimized function to check if property feature should be displayed
export const shouldDisplayFeature = (value: any): boolean => {
  if (typeof value === 'number') {
    return value > 0;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return Boolean(value);
};

// Utility to format property stats for display
export const formatPropertyStats = (property: PropertyStatsInput): PropertyStat[] => {
  const stats: PropertyStat[] = [];
  
  if (shouldDisplayFeature(property.beds)) {
    stats.push({ label: 'BEDROOMS', value: property.beds });
  }
  
  if (shouldDisplayFeature(property.baths)) {
    stats.push({ label: 'BATHROOMS', value: property.baths });
  }
  
  if (shouldDisplayFeature(property.area)) {
    stats.push({ label: 'AREA', value: property.area });
  }
  
  return stats;
};

// Clean HTML and decode entities from text for better display
export const cleanAndDecodeText = (text: string): string => {
  if (!text) return '';
  
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities efficiently
  const entityMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&hellip;': '...',
    '&mdash;': '—',
    '&ndash;': '–',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
  };
  
  // Replace entities in one pass
  cleaned = cleaned.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    if (entityMap[entity]) {
      return entityMap[entity];
    }
    
    // Handle numeric entities (&#123; format)
    const numMatch = entity.match(/&#(\d+);/);
    if (numMatch) {
      return String.fromCharCode(parseInt(numMatch[1]));
    }
    
    return entity;
  });
  
  // Normalize whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
};

// Optimize price formatting for different currencies
export const formatPrice = (price: string | number, country?: string): string => {
  if (typeof price === 'number') {
    const currency = country === 'Spain' ? '€' : 'AED ';
    
    // Format with M/K suffixes
    if (price >= 1000000) {
      const millions = price / 1000000;
      return `${currency}${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
    } else if (price >= 1000) {
      const thousands = price / 1000;
      return `${currency}${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
    }
    return `${currency}${price.toLocaleString()}`;
  }
  
  if (typeof price === 'string') {
    // Extract currency and number for optimization
    // Support both European format (periods for thousands) and US format (commas for thousands)
    const match = price.match(/^([€$£¥₹]|[A-Z]{3})\s*([0-9.,]+)/i);
    if (match) {
      const currency = match[1];
      let numberStr = match[2];
      
      // Handle European format (e.g., "3.000.000" or "1.000.000,00")
      const periodCount = (numberStr.match(/\./g) || []).length;
      const commaCount = (numberStr.match(/,/g) || []).length;
      
      if (periodCount > 1) {
        // Multiple periods = European format (e.g., "3.000.000")
        numberStr = numberStr.replace(/\./g, '').replace(',', '.');
      } else if (periodCount === 1 && commaCount === 0) {
        // Single period: check if thousand separator or decimal
        const parts = numberStr.split('.');
        if (parts[1] && parts[1].length === 3) {
          // Likely thousand separator (e.g., "1.000")
          numberStr = numberStr.replace('.', '');
        }
      } else if (commaCount > 0 && periodCount > 0) {
        // Mixed: last separator is decimal
        const lastPeriodIndex = numberStr.lastIndexOf('.');
        const lastCommaIndex = numberStr.lastIndexOf(',');
        if (lastCommaIndex > lastPeriodIndex) {
          // European: "1.000,50"
          numberStr = numberStr.replace(/\./g, '').replace(',', '.');
        } else {
          // US: "1,000.50"
          numberStr = numberStr.replace(/,/g, '');
        }
      } else {
        // US format: just remove commas
        numberStr = numberStr.replace(/,/g, '');
      }
      
      const number = parseFloat(numberStr);
      
      if (!isNaN(number)) {
        // Add space after currency code (3+ chars) but not after symbols
        const needsSpace = currency.length > 2;
        const separator = needsSpace ? ' ' : '';
        
        if (number >= 1000000) {
          const millions = number / 1000000;
          return `${currency}${separator}${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
        } else if (number >= 1000) {
          const thousands = number / 1000;
          return `${currency}${separator}${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
        }
      }
    }
  }
  
  return price?.toString() || 'Price on request';
};

// Validate and sanitize form input data
export const sanitizeFormData = (data: Record<string, any>): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else if (value !== null && value !== undefined) {
      sanitized[key] = String(value).trim();
    } else {
      sanitized[key] = '';
    }
  });
  
  return sanitized;
};

// Generate SEO-friendly meta descriptions
export const generateSEODescription = (
  property: any,
  localizedTitle: string,
  localizedDescription: string | string[]
): string => {
  const maxLength = 155; // SEO best practice
  
  // Try different description sources in order of preference
  const descriptions = [
    property.meta_description,
    property.longDescription,
    getDescriptionAsString(localizedDescription),
    `${localizedTitle} - Premium property in ${property.location || property.city || property.country}`
  ].filter(Boolean);
  
  for (const desc of descriptions) {
    const cleaned = cleanAndDecodeText(desc);
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    
    // Truncate intelligently at word boundary
    const truncated = cleaned.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    return truncated + '...';
  }
  
  return `${localizedTitle} - Premium property`;
};
