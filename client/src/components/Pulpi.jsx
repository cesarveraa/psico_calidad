import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { images } from "../constants";
import { getAllComments } from "../services/index/pulpiComentarios";

const Pulpi = ({ imageSize }) => {
  const [currentComment, setCurrentComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [bgColor, setBgColor] = useState('#fff');
  const [animationStyle, setAnimationStyle] = useState({});

  const { data: comentariosData } = useQuery(["pulpiComentarios"], getAllComments);

  useEffect(() => {
    if (comentariosData && comentariosData.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentComment(comentariosData[Math.floor(Math.random() * comentariosData.length)].comentario);
        setBgColor(generateRandomColor());
        setShowComment(true);
        setTimeout(() => setShowComment(false), 5000);
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [comentariosData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimationStyle(generateRandomAnimation());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const generateRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5', '#FF33A1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateRandomAnimation = () => {
    const animations = [
      { transform: 'translateX(-20px) rotate(10deg)' },
      { transform: 'translateX(20px) rotate(-10deg)' },
      { transform: 'translateY(-20px) rotate(20deg)' },
      { transform: 'translateY(20px) rotate(-20deg)' },
      { transform: 'translateY(-20px) rotate(360deg)' }, // salto y giro
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  };

  return (
    <div className="fixed bottom-20 right-4 flex flex-row items-center z-50">
      {showComment && (
        <div
          style={{ backgroundColor: bgColor }}
          className="mr-4 p-2 text-white rounded-xl shadow-lg max-w-lg z-50"
        >
          <div className="relative bg-white text-black rounded-xl p-3 shadow-lg max-w-lg">
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-0 h-0 border-[10px] border-transparent border-l-white"></div>
            <strong>Pulpi: </strong>
            {currentComment}
          </div>
        </div>
      )}
      <img
        className={`w-${imageSize} h-auto transition-transform duration-500 ease-in-out`}
        style={animationStyle}
        src={images.psico}
        alt="Pulpi, la mascota de la carrera de Psicopedagogía"
      />
    </div>
  );
};

export default Pulpi;
