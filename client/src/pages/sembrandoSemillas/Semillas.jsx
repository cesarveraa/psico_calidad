import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import FlipCard2 from "../../components/FlipCard2";
import MainLayout from '../../components/MainLayout';
import { getAllPosts } from "../../services/index/posts";

const Semillas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsValue = Object.fromEntries([...searchParams]);
  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          width: "40px",
          height: "40px",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 2,
          marginRight: "10px",
        }}
        onClick={onClick}
      >
        <FaArrowRight />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          width: "40px",
          height: "40px",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 2,
          marginLeft: "10px",
        }}
        onClick={onClick}
      >
        <FaArrowLeft />
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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

  const [activeBoxIndex, setActiveBoxIndex] = useState(null);

  const handleBoxClick = (index) => {
    setActiveBoxIndex(prevIndex => prevIndex === index ? null : index);
  };

  const cardData = [
    {
      image: '/images/sce/img3.jpg',
      subtitle: 'Desarrollo de Habilidades',
      title: 'Taller de Liderazgo Estudiantil',
      details: ['El taller de liderazgo estudiantil es una actividad dirigida a los estudiantes universitarios para desarrollar habilidades de liderazgo, trabajo en equipo y toma de decisiones. A través de dinámicas grupales, charlas motivacionales y ejercicios prácticos, los participantes adquieren las herramientas necesarias para ser líderes efectivos en sus comunidades.']
    },
    {
      image: '/images/zona/img1.jpg',
      subtitle: 'Promoción Académica',
      title: 'Feria de Investigación Científica',
      details: ['La feria de investigación científica es un evento anual donde los estudiantes universitarios presentan sus proyectos de investigación en diversas áreas del conocimiento. Desde ciencias sociales hasta ciencias naturales, los participantes muestran sus hallazgos, metodologías y conclusiones ante un panel de expertos y la comunidad universitaria, fomentando el intercambio académico y la innovación.']
    },
    {
      image: '/images/sce/img2.jpg',
      subtitle: 'Formación Continua',
      title: 'Seminario de Actualización Profesional',
      details: ['El seminario de actualización profesional es una actividad organizada por el departamento académico para brindar a los estudiantes y profesionales herramientas actualizadas y relevantes en su campo de estudio. Con la participación de expertos y profesionales destacados, los asistentes tienen la oportunidad de profundizar en temas específicos y ampliar sus conocimientos.']
    },
  ];

  const cardDataDepartamentales = [
    {
      image: '/images/sce/img1.jpg',
      subtitle: 'Cohesión de Equipo',
      title: 'Jornada de Integración Departamental',
      details: ['La jornada de integración departamental es una actividad diseñada para fortalecer el trabajo en equipo y la cohesión entre los miembros de un departamento específico. A través de dinámicas, juegos y actividades al aire libre, los participantes desarrollan habilidades de comunicación, colaboración y liderazgo, contribuyendo a un ambiente laboral más armonioso y productivo.']
    },
    {
      image: '/images/zona/img2.jpg',
      subtitle: 'Capacitación Especializada',
      title: 'Sesión de Entrenamiento Departamental',
      details: ['La sesión de entrenamiento departamental es una actividad enfocada en la capacitación y el desarrollo profesional de los miembros de un departamento. Con la participación de expertos en el campo, se ofrecen charlas, talleres y sesiones prácticas para mejorar las habilidades técnicas, la eficiencia operativa y el desempeño laboral, contribuyendo al crecimiento individual y colectivo del equipo.']
    },
    {
      image: '/images/sce/img2.jpg',
      subtitle: 'Generación de Ideas',
      title: 'Sesión de Tormenta de Ideas',
      details: ['La sesión de tormenta de ideas es una actividad departamental que tiene como objetivo fomentar la creatividad y la innovación dentro del equipo. Durante la sesión, los participantes comparten y discuten ideas para resolver problemas, mejorar procesos o desarrollar nuevos proyectos. A través del intercambio de perspectivas y la colaboración, se busca generar soluciones originales y viables para los desafíos del departamento.']
    },
  ];

  const cardDataInternacionales = [
    {
      image: '/images/zona/img4.jpg',
      subtitle: 'Intercambio de Conocimientos',
      title: 'Conferencia Internacional',
      details: ['La conferencia internacional es un evento que reúne a expertos, profesionales y líderes de diferentes partes del mundo para compartir conocimientos, experiencias y mejores prácticas en un área específica. Durante la conferencia, se ofrecen charlas magistrales, mesas redondas, talleres y presentaciones de investigación, proporcionando una plataforma para el aprendizaje, la colaboración y el networking a nivel global.']
    },
    {
      image: '/images/zona/img1.jpg',
      subtitle: 'Promoción Cultural',
      title: 'Intercambio Cultural',
      details: ['El intercambio cultural internacional es una actividad que promueve el entendimiento y la apreciación de diferentes culturas a través del contacto directo entre personas de distintos países. Durante el intercambio, los participantes tienen la oportunidad de compartir tradiciones, costumbres, idiomas y experiencias de vida, enriqueciendo su perspectiva y fomentando la tolerancia y el respeto intercultural.']
    },
    {
      image: '/images/zona/img3.jpg',
      subtitle: 'Colaboración Global',
      title: 'Proyecto de Cooperación Internacional',
      details: ['El proyecto de cooperación internacional es una iniciativa que busca abordar desafíos globales mediante la colaboración entre países y organizaciones. A través de alianzas estratégicas, intercambio de recursos y trabajo conjunto, se desarrollan soluciones innovadoras y sostenibles para problemas como el cambio climático, la pobreza, la salud pública y la educación, contribuyendo al desarrollo humano y al bienestar global.']
    },
  ];

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(searchKeyword, currentPage, 12),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    refetch();
    window.scrollTo(0, 0);
  }, [currentPage, searchKeyword, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10 fade-in">
        <h1 className="title text-3xl font-bold mb-8 text-center" style= {{paddingLeft: "0px", fontSize: "70px"}}>SEMBRANDO SEMILLAS DE PAZ</h1>
        <br />
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-12">
          <img src="images/semillasLogo.png" alt="semillas_imagen" className="w-60 h-auto mx-auto lg:mx-0" />
          <div className="text-center lg:text-left">
            <br />
            <h2 className="title2 text-2xl font-bold mb-4">Objetivo</h2>
            <p className="text-lg ">
              Sembrando Semillas se compromete a empoderar a las comunidades rurales mediante el desarrollo sostenible y la educación ambiental. Nuestro objetivo es cultivar un futuro próspero y sostenible, donde cada individuo tenga acceso a recursos educativos, alimentos nutritivos y oportunidades económicas. A través de programas de agricultura sostenible, talleres educativos y apoyo a emprendimientos locales, buscamos sembrar las semillas del cambio positivo y fortalecer el tejido social en las áreas rurales. Nuestra visión es crear un mundo donde las comunidades rurales florezcan, en armonía con la naturaleza y con acceso equitativo a oportunidades de desarrollo.
            </p>
          </div>
          <br />
        </div>
        <br />
        <div className="mt-10">
          <h2 className="title2 text-2xl font-bold mb-4">Actividades realizadas en la universidad</h2>
          <Slider {...settings}>
            {cardData.map((card, index) => (
              <FlipCard2
                key={index}
                image={card.image}
                subtitle={card.subtitle}
                title={card.title}
                details={card.details}
                cardClassName="my-custom-card"
              />
            ))}
          </Slider>
        </div>

        <div className="mt-10">
          <h2 className="title2 text-2xl font-bold mb-4">Actividades realizadas departamentales</h2>
          <Slider {...settings}>
            {cardDataDepartamentales.map((card, index) => (
              <FlipCard2
                key={index}
                image={card.image}
                subtitle={card.subtitle}
                title={card.title}
                details={card.details}
                cardClassName="my-custom-card"
              />
            ))}
          </Slider>
        </div>

        <div className="mt-10">
          <h2 className="title2 text-2xl font-bold mb-4">Actividades realizadas internacionales</h2>
          <Slider {...settings}>
            {cardDataInternacionales.map((card, index) => (
              <FlipCard2
                key={index}
                image={card.image}
                subtitle={card.subtitle}
                title={card.title}
                details={card.details}
                cardClassName="my-custom-card"
              />
            ))}
          </Slider>
        </div>
      </section>
    </MainLayout>
  );
};

export default Semillas;
