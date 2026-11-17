import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface UsePaginationProps<T> {
  items: T[];
  initialItemsPerPage?: number;
  dependencies?: any[]; // Dependencies that should reset pagination when changed
  persistInUrl?: boolean; // Whether to persist pagination state in URL
}

interface UsePaginationReturn<T> {
  // Current state
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  currentItems: T[];
  startIndex: number;
  endIndex: number;
  
  // Actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  resetToFirstPage: () => void;
}

export const usePagination = <T,>({
  items,
  initialItemsPerPage = 12,
  dependencies = [],
  persistInUrl = true
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const router = useRouter();
  
  // Initialize from URL query parameters if available and persistInUrl is enabled
  const getInitialPage = () => {
    if (!persistInUrl || !router.isReady) return 1;
    const pageParam = router.query.page;
    const page = pageParam ? parseInt(pageParam as string, 10) : 1;
    return !isNaN(page) && page > 0 ? page : 1;
  };
  
  const getInitialItemsPerPage = () => {
    if (!persistInUrl || !router.isReady) return initialItemsPerPage;
    const itemsParam = router.query.itemsPerPage;
    const items = itemsParam ? parseInt(itemsParam as string, 10) : initialItemsPerPage;
    return !isNaN(items) && items > 0 ? items : initialItemsPerPage;
  };
  
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [itemsPerPage, setItemsPerPage] = useState(getInitialItemsPerPage());
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track the initial dependencies to avoid resetting on first render after initialization
  const initialDepsRef = useRef<string | null>(null);
  const initialItemsPerPageRef = useRef<number | null>(null);

  // Initialize from URL when router is ready
  useEffect(() => {
    if (router.isReady && !isInitialized && persistInUrl) {
      const page = getInitialPage();
      const items = getInitialItemsPerPage();
      setCurrentPage(page);
      setItemsPerPage(items);
      setIsInitialized(true);
    }
  }, [router.isReady, persistInUrl, isInitialized]);
  
  // Update URL when pagination changes
  useEffect(() => {
    if (!persistInUrl || !router.isReady || !isInitialized) return;
    
    const currentParams = { ...router.query };
    let needsUpdate = false;
    
    // Only update URL if values differ from current query params
    if (currentPage !== 1 && currentParams.page !== String(currentPage)) {
      currentParams.page = String(currentPage);
      needsUpdate = true;
    } else if (currentPage === 1 && currentParams.page) {
      delete currentParams.page;
      needsUpdate = true;
    }
    
    if (itemsPerPage !== initialItemsPerPage && currentParams.itemsPerPage !== String(itemsPerPage)) {
      currentParams.itemsPerPage = String(itemsPerPage);
      needsUpdate = true;
    } else if (itemsPerPage === initialItemsPerPage && currentParams.itemsPerPage) {
      delete currentParams.itemsPerPage;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      router.replace(
        {
          pathname: router.pathname,
          query: currentParams
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  }, [currentPage, itemsPerPage, persistInUrl, router.isReady, isInitialized, initialItemsPerPage]);

  // Calculate pagination values - ensure they're recalculated when page changes
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  const endIndex = Math.min(items.length, startIndex + itemsPerPage);
  
  // Get current page items - recalculate whenever items, page, or itemsPerPage changes
  const currentItems = useMemo(() => {
    const validStartIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
    const validEndIndex = Math.min(items.length, validStartIndex + itemsPerPage);
    return items.slice(validStartIndex, validEndIndex);
  }, [items, currentPage, itemsPerPage]);

  // Reset to first page when dependencies change (filters, search, etc.)
  // But don't reset during initial load or when navigating back
  // Use JSON.stringify to compare by value, not reference
  const depsString = JSON.stringify(dependencies);
  useEffect(() => {
    if (!isInitialized) return;
    
    // Store initial deps on first initialization
    if (initialDepsRef.current === null) {
      initialDepsRef.current = depsString;
      return;
    }
    
    // Only reset page if deps actually changed from initial/previous value
    if (initialDepsRef.current !== depsString) {
      setCurrentPage(1);
      initialDepsRef.current = depsString;
    }
  }, [depsString, isInitialized]);
  
  // Separate effect for itemsPerPage changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Store initial itemsPerPage on first initialization
    if (initialItemsPerPageRef.current === null) {
      initialItemsPerPageRef.current = itemsPerPage;
      return;
    }
    
    // Only reset page if itemsPerPage actually changed from initial/previous value
    if (initialItemsPerPageRef.current !== itemsPerPage) {
      setCurrentPage(1);
      initialItemsPerPageRef.current = itemsPerPage;
    }
  }, [itemsPerPage, isInitialized]);

  // Ensure current page is valid when total pages change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  }, []);

  return {
    // State
    currentPage,
    itemsPerPage,
    totalPages,
    currentItems,
    startIndex,
    endIndex,
    
    // Actions
    setCurrentPage,
    setItemsPerPage: handleItemsPerPageChange,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetToFirstPage
  };
};

export default usePagination;
