import React from 'react';

const ResponsiveFlipCardSkeleton = () => (
  <div className="flip-card-mision">
    <div className="flip-card-mision-inner">
      <div className="flip-card-mision-front bg-gray-300 rounded animate-pulse h-64 mb-4"></div>
      <div className="flip-card-mision-back bg-gray-300 rounded animate-pulse h-32"></div>
    </div>
  </div>
);

export default ResponsiveFlipCardSkeleton;