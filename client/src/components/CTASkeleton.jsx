import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CTASkeleton = () => {
  const skeletonItems = Array.from({ length: 5 }).map((_, index) => (
    <div key={index} className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg animate-pulse">
      <AiOutlineLoading3Quarters size="3em" className="text-gray-300 animate-spin" />
      <div className="h-6 bg-gray-300 rounded w-3/4 mt-4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  ));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-center">
        {skeletonItems}
      </div>
    </div>
  );
};

export default CTASkeleton;