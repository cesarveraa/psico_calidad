import React from "react";

const HeroSkeleton = ({ imageSize }) => {
  return (
    <section className="container mx-auto flex flex-col px-5 py-5 lg:flex-row items-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      <div className="text-gray-800 mt-10 lg:w-1/2">
        <div className="h-12 lg:h-16 xl:h-20 bg-gray-300 rounded animate-pulse mb-4"></div>
        <div className="h-6 lg:h-8 xl:h-10 bg-gray-300 rounded animate-pulse mb-4"></div>
        <div className="flex mt-4 flex-col lg:flex-row lg:items-start lg:gap-x-4">
          <div className="h-4 lg:h-5 xl:h-6 bg-gray-300 rounded animate-pulse w-32 mb-4"></div>
          <ul className="flex flex-wrap gap-x-2.5 gap-y-2.5 mt-3">
            <li className="h-6 w-24 bg-gray-300 rounded animate-pulse"></li>
            <li className="h-6 w-28 bg-gray-300 rounded animate-pulse"></li>
            <li className="h-6 w-32 bg-gray-300 rounded animate-pulse"></li>
          </ul>
        </div>
      </div>
      <div className="lg:w-1/2 lg:flex lg:justify-end">
        <div className={`w-${imageSize} h-auto bg-gray-300 rounded animate-pulse`}></div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
