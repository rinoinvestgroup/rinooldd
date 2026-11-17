import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AutoTranslateProps {
  children: string;
  translationKey?: string;
  className?: string;
  as?: React.ElementType;
}

const AutoTranslate: React.FC<AutoTranslateProps> = React.memo(({
  children,
  translationKey,
  className = '',
  as: Component = 'span',
}) => {
  const { t, language } = useLanguage();
  
  // Memoize translation to prevent re-computation
  const content = useMemo(() => {
    try {
      return translationKey ? t(translationKey, children) : children;
    } catch (error) {
      // Fallback to children if translation fails
      return children;
    }
  }, [translationKey, children, t, language]);

  return <Component className={className}>{content}</Component>;
});

AutoTranslate.displayName = 'AutoTranslate';

export default AutoTranslate;
