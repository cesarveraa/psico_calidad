import React, { useEffect, useState } from "react";
import MainLayout from '../../components/MainLayout';
import ParchmentBox2 from "../../components/ParchmentBox2";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import FlipCard from "../../components/FlipCard";
import Slider from "react-slick";

import { faPersonCircleQuestion, faBookOpen, faUsers } from '@fortawesome/free-solid-svg-icons';
import { getAllPosts } from "../../services/index/posts";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Iglesia = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsValue = Object.fromEntries([...searchParams]);
  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

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

  const [activeBoxIndex, setActiveBoxIndex] = useState(null);

  const handleBoxClick = (index) => {
    setActiveBoxIndex(prevIndex => prevIndex === index ? null : index);
  };

  const parchmentBoxData = [
    {
      title: "Conferencia Episcopal Boliviana",
      image: "/images/iglesia/ceb.jpg",
      subtitle: "Coordinación Pastoral",
      description: "La Conferencia Episcopal Boliviana (CEB) coordina las actividades pastorales de la Iglesia Católica en Bolivia. Su labor abarca desde la promoción de la fe y la doctrina católica hasta la defensa de los derechos humanos y la justicia social. A través de sus programas pastorales, la CEB contribuye al desarrollo espiritual y social de la comunidad católica y la sociedad en general."
    },
    {
      title: "Conferencia Boliviana de Religiosas y Religiosos",
      image: "/images/iglesia/cbr.png",
      subtitle: "Promoción de la Vida Consagrada",
      description: "La Conferencia Boliviana de Religiosas y Religiosos (CBR) reúne a las congregaciones religiosas de Bolivia para promover la vida consagrada y coordinar sus actividades pastorales y sociales. Entre sus obras se encuentran la educación, la atención a la salud, la promoción de la justicia y la solidaridad con los más necesitados."
    },
    {
      title: "Escuelas de Cristo",
      image: "/images/iglesia/escuelas_cristo.jpg",
      subtitle: "Educación Integral",
      description: "Las Escuelas de Cristo son centros de formación y evangelización que ofrecen educación integral a niños y jóvenes en situación de vulnerabilidad. Además de impartir conocimientos académicos, estas instituciones promueven valores cristianos y brindan apoyo emocional y espiritual a sus estudiantes, ayudándoles a construir un futuro mejor."
    },
    {
      title: "Fundación Arco Iris",
      image: "/images/iglesia/arcoiris.jpg",
      subtitle: "Atención Integral a la Niñez",
      description: "La Fundación Arco Iris se dedica a brindar atención integral a niños y niñas en situación de riesgo y vulnerabilidad. A través de programas de educación, salud, alimentación y protección, la fundación busca garantizar el bienestar y el desarrollo de los niños, contribuyendo así a la construcción de una sociedad más justa y solidaria."
    },
    {
      title: "Fundación Levántate Mujer",
      image: "/images/iglesia/levantate_mujer.jpg",
      subtitle: "Empoderamiento Femenino",
      description: "La Fundación Levántate Mujer trabaja para empoderar a mujeres en situación de vulnerabilidad, brindándoles herramientas y recursos para que puedan salir adelante y mejorar su calidad de vida. A través de programas de formación, empleo, atención psicológica y apoyo social, la fundación promueve la igualdad de género y el desarrollo integral de las mujeres."
    },
    {
      title: "Fundación Munasim Kullakita",
      image: "/images/iglesia/munasim.jpg",
      subtitle: "Promoción de los Derechos Infantiles",
      description: "La Fundación Munasim Kullakita se dedica a promover los derechos y el bienestar de la niñez y la adolescencia en Bolivia. A través de programas de educación, salud, protección y participación, la fundación trabaja para garantizar que todos los niños y niñas puedan crecer en un ambiente seguro y saludable, desarrollando todo su potencial."
    },
    {
      title: "Comedor San Calixto",
      image: "/images/iglesia/sanca.jpg",
      subtitle: "Atención Alimentaria",
      description: "El Comedor San Calixto ofrece alimentación gratuita a personas en situación de calle y en extrema pobreza en Bolivia. Además de brindar comida caliente, el comedor proporciona apoyo emocional, orientación y acompañamiento a sus beneficiarios, ayudándoles a satisfacer una de sus necesidades más básicas y a sentirse dignos y valorados."
    },
    {
      title: "Centro Waliña",
      image: "/images/iglesia/walina.jpg",
      subtitle: "Atención a Personas con Discapacidad",
      description: "El Centro Waliña es un espacio de atención integral para personas con discapacidad en Bolivia. A través de programas de educación, rehabilitación, inclusión social y apoyo a las familias, el centro busca mejorar la calidad de vida y promover la plena participación de las personas con discapacidad en la sociedad."
    },
    {
      title: "Fe y Alegría",
      image: "/images/iglesia/feyalegria.png",
      subtitle: "Educación Popular",
      description: "Fe y Alegría es una red de educación popular y promoción social presente en varios países de América Latina. En Bolivia, la organización ofrece educación de calidad, formación integral y promoción comunitaria a niños, jóvenes y adultos en situación de vulnerabilidad, contribuyendo así al desarrollo humano y social del país."
    }
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
        <h1 className="title text-3xl font-bold mb-8 text-center">OBRAS SOCIALES DE LA IGLESIA</h1>
        <br />
        <div className="w-full lg:w-0.8 mx-auto space-y-4 text-left">
          <p className="text-lg ">
            En la Universidad Católica Boliviana, la carrera de Psicopedagogía se distingue por su enfoque práctico y compromiso social. Una parte esencial de esta formación radica en la colaboración con las Obras Sociales de la Iglesia. Estas instituciones, arraigadas en los valores de solidaridad y servicio, brindan a los estudiantes un espacio privilegiado para aplicar sus conocimientos en contextos reales.

            A través de programas diseñados para abordar diversas necesidades sociales, los futuros psicopedagogos tienen la oportunidad de poner en práctica sus habilidades, fomentando el bienestar y el desarrollo humano en comunidades vulnerables. Desde la atención a niños con dificultades de aprendizaje hasta la asistencia a familias en situación de vulnerabilidad, los estudiantes se involucran activamente en iniciativas que impactan positivamente en la sociedad.

            Al colaborar con las Obras Sociales de la Iglesia, los estudiantes de Psicopedagogía no solo adquieren experiencia práctica invaluable, sino que también cultivan valores de solidaridad, empatía y responsabilidad social, preparándolos para convertirse en profesionales comprometidos con el servicio a los demás y el bien común.
          </p>
          <p className="text-lg ">
            Sé parte de la renovación educativa y aporta a la transformación social.
          </p>
          <br />
        </div>

        <br />
        <h1 className="title text-3xl font-bold mb-8 text-center">Instituciones asociadas</h1>
        <br /> <br />
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 justify-center">
          {parchmentBoxData.map((box, index) => (
            <ParchmentBox2
              image={box.image}
              title={box.title}
              subtitle={box.subtitle}
              description={box.description}
              onClick={() => handleBoxClick(index)}
              isOpen={activeBoxIndex === index}
            />
          ))}
          <br />
        </div>
      </section>
    </MainLayout>
  );
};

export default Iglesia;
