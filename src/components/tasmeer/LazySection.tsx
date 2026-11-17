import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

/**
 * LazySection component for improving Core Web Vitals
 * Uses Intersection Observer to only render content when visible
 */
const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  className = '', 
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '100px', // Start loading 100px before visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [threshold]);

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? children : <div style={{ minHeight: '200px' }} />}
    </div>
  );
};

export default LazySection;
