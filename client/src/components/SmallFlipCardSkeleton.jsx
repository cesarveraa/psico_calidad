import React from 'react';

const SmallFlipCardSkeleton = () => (
  <div className="flip-card-mision">
    <div className="flip-card-mision-inner">
      <div className="flip-card-mision-front bg-gray-300 rounded animate-pulse h-32 mb-4"></div>
      <div className="flip-card-mision-back bg-gray-300 rounded animate-pulse h-16"></div>
    </div>
  </div>
);

export default SmallFlipCardSkeleton;