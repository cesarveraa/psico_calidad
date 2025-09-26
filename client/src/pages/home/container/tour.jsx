// src/components/Tour.jsx
import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

function Tour() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const images = [
      "/images/cato.jpg"
    ];

    let loadedImagesCount = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  if (!imagesLoaded) {
    return (
      <Box className="tour-container">
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Box>
    );
  }

  return (
    <div className="tour-container">
      <h2 className="tour-title">¡CONOCE NUESTRAS INSTALACIONES!</h2>
      <div className="tour-image-card">
        <ImageCard 
          imageUrl="/images/cato.jpg" 
          title="Tour virtual" 
          description="Descubre los diferentes espacios y recursos que nuestra universidad ofrece."
          buttonText="Ir a tour"
          buttonLink="https://visitavirtual.lpz.ucb.edu.bo/" // Cambia esto por el enlace deseado
        />
      </div>
    </div>
  );
}

export default Tour;
