import React, { useState, useEffect } from "react";
import MainLayout from '../../components/MainLayout';
import ParchmentBox from "../../components/ParchmentBox";
import FlipCard from "../../components/FlipCard";
import FlipCard2 from "../../components/FlipCard2";
import Slider from "react-slick";
import { faPersonCircleQuestion, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from "@tanstack/react-query";
import { getSingleSCE } from "../../services/index/sces";
import { getEstudiante } from "../../services/index/estudiante";
import ErrorMessage from "../../components/ErrorMessage";
import { toast } from "react-hot-toast";

const SCE = () => {
  const slug = "sce"; // Definimos el slug por defecto
  const { data: sceData, isLoading, isError } = useQuery(["sce", slug], () => getSingleSCE(slug), {
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const [students, setStudents] = useState([]);
  const [activeBoxIndex, setActiveBoxIndex] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (sceData && sceData.sce.members.length > 0) {
        try {
          const studentDetails = await Promise.all(sceData.sce.members.map(id => getEstudiante(id)));
          setStudents(studentDetails);
        } catch (error) {
          toast.error("Error al obtener los detalles de los estudiantes: " + error.message);
        }
      }
    };

    fetchStudents();
  }, [sceData]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '0',
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '0',
        }
      }
    ]
  };

  const handleBoxClick = (index) => {
    setActiveBoxIndex(prevIndex => prevIndex === index ? null : index);
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <ErrorMessage message="No se pudieron obtener los detalles de la SCE" />;

  const cardData = [
    {
      icon: faPersonCircleQuestion,
      title: '¿Quiénes somos?',
      subtitle: 'Somos...',
      details: [sceData.sce.quienesSomos],
      backgroundColor: '#FFD700', // Amarillo
      textColor: '#000', // Negro
    },
    { 
      icon: faUsers,
      title: '¿Cómo unirse a la SCE?',
      subtitle: 'Procedimiento',
      details: sceData.sce.comoUnirse.map((step, index) => `${index + 1}. ${step.title}: ${step.description}`),
      backgroundColor: '#008080', // Verde Azulado
      textColor: '#FFF', // Blanco
    },
  ];

  let cardData2 = sceData.sce.accionesInvestigativas.map(action => ({
    image: action.url,
    subtitle: action.subtitle,
    title: action.title,
    details: [action.description],
    backgroundColor: '#FFD700', // Amarillo
    textColor: '#000', // Negro
  }));

  // Rellenar cardData2 para asegurar un mínimo de elementos
  while (cardData2.length < 3) {
    cardData2 = [...cardData2, ...cardData2];
  }
  cardData2 = cardData2.slice(0, 3);

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10 fade-in">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">SOCIEDAD CIENTIFICA ESTUDIANTIL</h1>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 justify-center">
            {cardData.map((card, index) => (
              <div className="flip-card-wrapper mx-auto" key={index}>
                <FlipCard
                  icon={card.icon}
                  subtitle={card.subtitle}
                  title={card.title}
                  details={card.details}
                  cardClassName="my-custom-card"
                  backgroundColor={card.backgroundColor}
                  textColor={card.textColor}
                />
                <br />
              </div>
            ))}
          </div>
        </div>
        <br />
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Integrantes de la SCE</h1>
        <br /> <br />
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 justify-center">
          {students.map((student, index) => (
            <ParchmentBox
              title={student.nombre}
              image={student.foto}
              cargo={student.cargo}
              email={student.email}
              telefono={student.telefono}
              onClick={() => handleBoxClick(index)}
              isOpen={activeBoxIndex === index}
              key={index}
            />
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-left">Acciones investigativas</h1>
        <div className="custom-slider">
          <Slider {...settings}>
            {cardData2.map((card, index) => (
              <FlipCard2
                image={card.image}
                subtitle={card.subtitle}
                title={card.title}
                details={card.details}
                cardClassName="my-custom-card"
                key={index}
              />
            ))}
          </Slider>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-left">La Presente investigación</h1>
        {sceData.sce.presenteInvestigacion.map((info, index) => (
          <div className="flex flex-col md:flex-row mt-5 bg-gray-50 border border-gray-200 rounded-lg shadow hover:bg-blue-100 hover:transform hover:scale-105 transition duration-300 ease-in-out" key={index}>
            <img
              src={info.url}
              alt={`Imagen ${index + 1}`}
              className="w-full md:w-1/2 h-auto rounded-lg transition duration-300 ease-in-out"
            />
            <div className="text-container p-6 flex-grow">
              <h2 className="text-xl font-semibold mb-2">{info.title}</h2>
              <p className="text-dark-light-400">{info.description}</p>
            </div>
          </div>
        ))}
      </section>
    </MainLayout>
  );
};

export default SCE;
