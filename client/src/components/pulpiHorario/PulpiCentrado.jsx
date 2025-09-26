import React, { useState, useEffect } from 'react';
import { images } from "../../constants";

const PulpiCentrado = ({ imageSize }) => {
  const [animationStyle, setAnimationStyle] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationStyle(generateRandomAnimation());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const generateRandomAnimation = () => {
    const animations = [
      { transform: 'translateX(-20px) rotate(10deg)' },
      { transform: 'translateX(20px) rotate(-10deg)' },
      { transform: 'translateY(-20px) rotate(20deg)' },
      { transform: 'translateY(20px) rotate(-20deg)' },
      { transform: 'translateY(-20px) rotate(360deg)' },
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="bg-white p-4 text-black rounded-xl shadow-lg mb-4 max-w-lg">
        <strong>Pulpi: </strong>
        Cree su propio horario de forma dinámica haciendo clic en "Crear Otro Horario"
      </div>
      <img
        className={`w-${imageSize} h-auto transition-transform duration-500 ease-in-out`}
        style={animationStyle}
        src={images.psico}
        alt="Pulpi, la mascota de la carrera de Psicopedagogía"
      />
    </div>
  );
};

export default PulpiCentrado;
