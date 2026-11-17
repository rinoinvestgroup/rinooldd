import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showQuickJump?: boolean;
  className?: string;
  t?: (key: string, fallback: string) => string; // Translation function
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showQuickJump = true,
  className = '',
  t = (key: string, fallback: string) => fallback // Default translation function
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleQuickJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* Pagination Info */}
      <div className="text-sm text-gray-600 text-center">
        {t('pagination.page', 'Page')} {currentPage} {t('pagination.of', 'of')} {totalPages}
        <span className="ml-2">
          ({startIndex + 1}-{endIndex} {t('pagination.of', 'of')} {totalItems} {t('pagination.items', 'items')})
        </span>
      </div>

      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-sm text-gray-600">
            {t('pagination.itemsPerPage', 'Items per page:')}
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('pagination.previous', 'Previous')}
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {/* First page */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="px-3 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Current page and surrounding pages */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => 
              page === currentPage ||
              page === currentPage - 1 ||
              page === currentPage + 1 ||
              (currentPage <= 2 && page <= 3) ||
              (currentPage >= totalPages - 1 && page >= totalPages - 2)
            )
            .map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

          {/* Last page */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-3 py-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('pagination.next', 'Next')}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Quick Jump to Page */}
      {showQuickJump && totalPages > 10 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">{t('pagination.goToPage', 'Go to page')}:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={handleQuickJump}
            className="w-16 px-2 py-1 text-center border border-gray-300 !text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-600">{t('pagination.of', 'of')} {totalPages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
