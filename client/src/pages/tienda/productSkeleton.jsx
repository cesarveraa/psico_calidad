import React from "react";

const ProductDetailSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col lg:flex-row lg:gap-x-5 lg:items-start container mx-auto max-w-5xl px-5 py-5">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <div className="w-full h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded-xl"></div>
        <div className="mt-4 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-3/4"></div>
        <div className="mt-2 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-1/2"></div>
        <div className="mt-4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-1/4"></div>
        <div className="mt-4 h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded"></div>
        <div className="mt-6 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-32"></div>
      </div>
      <div className="lg:max-w-xs mt-10 lg:mt-0">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-full mb-4"></div>
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-full"></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-animate rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
