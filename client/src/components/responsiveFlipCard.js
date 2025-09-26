import React, { useState, useEffect, useRef } from 'react';

function ResponsiveFlipCard({ frontImage, backImage }) {
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 }); // Valores predeterminados
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      const aspectRatio = naturalHeight / naturalWidth;
      const width = 500; // Ancho base que quieres usar
      const height = width * aspectRatio; // Altura calculada basada en la relación de aspecto
      setDimensions({ width, height });
    }
  }, [frontImage, backImage]);

  return (
    <div className="flip-card-container" style={{ width: dimensions.width, height: dimensions.height, perspective: '1000px' }}>
      <div className="flip-card-inner">
        <div className="flip-card-front" style={{ backgroundImage: `url(${frontImage})` }}>
          {/* Quita cualquier contenido aquí si no deseas texto o elementos adicionales */}
          <img ref={imgRef} src={frontImage} alt="Front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} hidden />
        </div>
        <div className="flip-card-back" style={{ backgroundImage: `url(${backImage})` }}>
          {/* Quita cualquier contenido aquí si no deseas texto o elementos adicionales */}
          <img src={backImage} alt="Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} hidden />
        </div>
      </div>
    </div>
  );
}

export default ResponsiveFlipCard;
