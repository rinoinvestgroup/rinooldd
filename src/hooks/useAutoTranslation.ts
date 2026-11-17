import { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { createTranslationService } from '../services/translationService';

interface UseAutoTranslationOptions {
  enabled?: boolean;
  fallbackLanguage?: string;
  cacheResults?: boolean;
}

export const useAutoTranslation = (options: UseAutoTranslationOptions = {}) => {
  const { language } = useLanguage();
  const [translationService] = useState(() => createTranslationService());
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string | object>>(new Map());

  const { 
    enabled = true, 
    fallbackLanguage = 'en', 
    cacheResults = true 
  } = options;

  const translateText = useCallback(async (
    text: string, 
    targetLanguage: string = language
  ): Promise<string> => {
    if (!enabled || !text || targetLanguage === fallbackLanguage) {
      return text;
    }

    // Check cache
    const cacheKey = `${fallbackLanguage}-${targetLanguage}-${text}`;
    if (cacheResults && translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey) as string;
    }

    setIsTranslating(true);
    try {
      const translatedText = await translationService.translateText(
        text, 
        fallbackLanguage, 
        targetLanguage
      );

      // Cache result
      if (cacheResults) {
        setTranslationCache(prev => new Map(prev.set(cacheKey, translatedText)));
      }

      return translatedText;
    } catch (error) {
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  }, [language, enabled, fallbackLanguage, cacheResults, translationService, translationCache]);

  const translateContent = useCallback(async (
    content: object | string, 
    targetLanguage: string = language
  ): Promise<object | string> => {
    if (!enabled || targetLanguage === fallbackLanguage) {
      return content;
    }

    // Check cache for entire content
    const contentKey = `content-${fallbackLanguage}-${targetLanguage}-${JSON.stringify(content)}`;
    if (cacheResults && translationCache.has(contentKey)) {
      return translationCache.get(contentKey) as typeof content;
    }

    setIsTranslating(true);
    try {
      const translatedContent = await translationService.translateObject(
        content, 
        fallbackLanguage, 
        targetLanguage
      );

      // Cache result
      if (cacheResults) {
        setTranslationCache(prev => new Map(prev.set(contentKey, translatedContent)));
      }

      return translatedContent;
    } catch (error) {
      return content; // Return original content on error
    } finally {
      setIsTranslating(false);
    }
  }, [language, enabled, fallbackLanguage, cacheResults, translationService, translationCache]);

  const clearCache = useCallback(() => {
    setTranslationCache(new Map());
    translationService.clearCache();
  }, [translationService]);

  return {
    translateText,
    translateContent,
    isTranslating,
    clearCache,
    cacheSize: translationCache.size,
  };
};
