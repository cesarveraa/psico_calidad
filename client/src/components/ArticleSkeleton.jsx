import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const ArticleSkeleton = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const renderSkeletonCards = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="px-3">
        <div className="w-full h-64 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
        <div className="w-3/4 h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
        <div className="w-1/2 h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
        <div className="w-full h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    ));
  };

  return <Slider {...settings}>{renderSkeletonCards()}</Slider>;
};

export default ArticleSkeleton;