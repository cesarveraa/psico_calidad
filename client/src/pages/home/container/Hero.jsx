import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSingleHomePage } from "../../../services/index/homePages";
import { images } from "../../../constants";
import ErrorMessage from "../../../components/ErrorMessage";
import HeroSkeleton from "../../../components/HeroSkeleton";
import { getAllComments } from "../../../services/index/pulpiComentarios";

const Hero = ({ imageSize }) => {
  const slug = "home";
  const [currentComment, setCurrentComment] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [bgColor, setBgColor] = useState('#fff');
  const [animationStyle, setAnimationStyle] = useState({});

  const { data: homeData, isLoading: isLoadingHome, isError: isErrorHome } = useQuery(["home", slug], () => getSingleHomePage(slug));
  const { data: comentariosData } = useQuery(["pulpiComentarios"], getAllComments);

  useEffect(() => {
    if (comentariosData && comentariosData.length > 0) {
      setCurrentComment(comentariosData[Math.floor(Math.random() * comentariosData.length)].comentario);
      setBgColor(generateRandomColor());
    }
  }, [comentariosData]);

  const generateRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5', '#FF33A1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (isLoadingHome) return <HeroSkeleton imageSize={imageSize} />;
  if (isErrorHome) return <ErrorMessage message="No se pudieron obtener los detalles de la página de inicio" />;

  const { title, description } = homeData.home;

  const handlePulpiClick = () => {
    if (comentariosData && comentariosData.length > 0) {
      setCurrentComment(comentariosData[Math.floor(Math.random() * comentariosData.length)].comentario);
      setBgColor(generateRandomColor());
    }
    setShowComment(!showComment);
    setAnimationStyle({ transform: 'rotate(360deg)', transition: 'transform 0.5s' });
    setTimeout(() => setAnimationStyle({ transform: 'rotate(0deg)', transition: 'transform 0.5s' }), 500);
  };

  return (
    <section className="container mx-auto flex flex-col px-5 py-5 lg:flex-row items-center dark:via-gray-900 dark:to-gray-800">
      <div className=" dark:text-white mt-10 lg:w-1/2">
        <h1
          className="font-bold text-center lg:text-left text-3xl lg:text-4xl xl:text-5xl md:leading-snug"
          style={{
            backgroundImage: "linear-gradient(120deg, #a1c4fd, #c2e9fb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow:
              "0px 0px 5px #6effd4, 0px 0px 10px #a1c4fd, 0px 0px 15px #c2e9fb",
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: "#000",
          }}
        >
          {title}
        </h1>
        <p className="mt-4 text-center lg:text-left md:text-xl lg:text-base xl:text-xl dark:text-gray-300">
          {description}
        </p>
      </div>
      <div className="lg:w-1/2 lg:flex lg:justify-end relative">
        <img
          className={`w-${imageSize} h-auto transform transition-transform hover:scale-105 cursor-pointer`}
          src={images.psico}
          alt="Pulpi, la mascota de la carrera de Psicopedagogía"
          onClick={handlePulpiClick}
          style={animationStyle}
        />
        {showComment && (
          <div style={{ backgroundColor: bgColor }} className="absolute rounded-lg top-60 left-1/2 transform -translate-x-1/2 -translate-y-full p-2 text-white animate-bounce">
            <div className="relative text-black rounded-lg p-3 shadow-lg max-w-xs">
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-0 h-0 border-[10px] border-transparent border-b-white"></div>
              <strong>Pulpi: </strong>
              {currentComment}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
