import React from 'react';

const PropertyLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header placeholder */}
      <div className="h-[100px] bg-gray-50 border-b border-gray-200"></div>
      
      {/* Breadcrumb placeholder */}
      <div className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <span>/</span>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <span>/</span>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Hero section placeholder */}
      <div className="relative">
        <div className="h-[500px] lg:h-[600px] bg-gray-200 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full py-4 lg:py-6">
              {/* Main image placeholder */}
              <div className="lg:col-span-2 bg-gray-300 rounded animate-pulse"></div>
              {/* Side images placeholder */}
              <div className="hidden lg:flex flex-col gap-2">
                <div className="flex-1 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex-1 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main content placeholder */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 lg:p-8 shadow-sm border border-gray-50">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
                
                {/* Stats placeholder */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 py-6 md:py-8 border-t border-gray-100">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
                
                {/* Description placeholder */}
                <div className="pt-6 lg:pt-8 border-t border-gray-100">
                  <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar placeholder */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 lg:p-8 shadow-sm border border-gray-50">
                <div className="h-5 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                  <div className="h-10 bg-gray-300 rounded animate-pulse mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyLoader;
