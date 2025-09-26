import React from 'react';
import Slider from 'react-slick';
import AreaCard from './areaCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AreaCarousel = ({ areas }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Muestra 2 cartas para mayor tamaño
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {areas.map((area) => (
        <div key={area._id}>
          <AreaCard area={area} />
        </div>
      ))}
    </Slider>
  );
};

export default AreaCarousel;
