import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import Pagination from "../../components/Pagination";
import FlipCard from "../../components/FlipCard";
import { faCalendarAlt, faBookOpen, faGraduationCap, faClock } from '@fortawesome/free-solid-svg-icons';
import { getAllPosts } from "../../services/index/posts";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import SemesterAreaGrid from "../../components/subjects/SemesterAreaGrid";
import { getAllEstudiantes } from "../../services/index/estudiante";
import UniversityCarousel from '../../pages/universities/UniversityCarrousel'; // Importa el componente del carrusel
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StudentCard from "../../components/StudentCard";
import OptionalSubjectsCarousel from "../subjects/OptionalSubjectsCarousel";
let isFirstRun = true;

const PregaradoPage = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(true);

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setLoadingEstudiantes(true);
        const { data: datae } = await getAllEstudiantes();
        setEstudiantes(datae);
      } catch (error) {
        toast.error("Error al cargar los estudaitnes: " + error.message);
      } finally {
        setLoadingEstudiantes(false);
      }
    };

    fetchDocentes();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsValue = Object.fromEntries([...searchParams]);
  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const cardData = [
    {
      icon: faCalendarAlt,
      subtitle: 'Duración de la Carrera',
      title: 'Duración de la Carrera',
      details: ['9 Semestres'],
    },
    {
      icon: faBookOpen,
      subtitle: 'Áreas de Estudio',
      title: 'Áreas de Estudio',
      details: [
        'Psicopedagogía de la Educación Formal y No Formal',
        'Psicopedagogía Clínica',
        'Psicopedagogía Social',
        'Psicopedagogía Laboral',
      ],
    },
    {
      icon: faGraduationCap,
      subtitle: 'Modalidades de Graduación',
      title: 'Modalidades de Graduación',
      details: [
        'Graduación por excelencia',
        'Tesis',
        'Proyecto de Grado',
        'Trabajo Dirigido',
        'Graduación vía Diplomado',
      ],
    },
  ];

  const flipCardStyles = {
    container: `flip-card-container cursor-pointer`,
    flipCardInner: `flip-card-inner`,
    flipCardFront: `flip-card-front p-6 flex flex-col items-center justify-center`,
    flipCardBack: `flip-card-back p-6 flex flex-col items-center justify-center`,
  };

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(searchKeyword, currentPage, 12),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    if (!isFirstRun) {
      refetch();
    }
    isFirstRun = false;
    window.scrollTo(0, 0);
  }, [currentPage, searchKeyword, refetch]);

  const handlePageChange = (page) => {
    // change the page's query string in the URL
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10 fade-in">
        <h1 className="title">Pregrado</h1><br /><br />
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/2">
            <div className="video-responsive">
              <iframe
                src="https://www.youtube.com/embed/OUd-tTZWBNw"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video de Psicopedagogía"
              ></iframe>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold">Psicopedagogía</h2>
            <p className="text-lg ">
              Conviértete en un experto en Psicopedagogía, una carrera dedicada a la creación,
              desarrollo y administración de propuestas educativas tanto presenciales como virtuales.
              Esta disciplina te permitirá trabajar en cuatro áreas clave: clínica, educativa, social y
              laboral. A través de una formación centrada en competencias, adoptarás un enfoque humanista,
              crítico e innovador, esencial para abordar y resolver los desafíos educativos contemporáneos
              de manera efectiva.
            </p>
            <p className="text-lg ">
              Sé parte de la renovación educativa y aporta a la transformación social.
            </p>
          </div>
        </div>

        {!isLoading && (
          <Pagination
            onPageChange={(page) => handlePageChange(page)}
            currentPage={currentPage}
            totalPageCount={JSON.parse(data?.headers?.["x-totalpagecount"])}
          />
        )}
        <br />
        <br />
        <h1 className="title">MALLA CURRICULAR</h1><br /><br />
        <div className="overflow-x-auto">
          <SemesterAreaGrid />
        </div>
        <br />
        <br />
        <br />
        <br />
        <h1 className="title">Materias Optativas</h1><br /><br />
        <div className="overflow-x-auto">
          <OptionalSubjectsCarousel />
        </div>
        <br />
        <br />
        <h1 className="title">Horarios</h1><br /><br />
        <div className="flex justify-center">
          <Link to="/horarios">
            <div className="max-w-md rounded overflow-hidden shadow-lg bg-white hover:bg-blue-50 transition duration-300">
              <img className="w-full" src="https://img.freepik.com/foto-gratis/atractivo-estudiante-universitario-masculino-haciendo-algunos-deberes-biblioteca-escuela-sonriendo_662251-1222.jpg" alt="Horarios de Materias" />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Ver Horarios de Materias</div>
                <p className="text-gray-700 text-base">
                  Consulta los horarios de tus materias aquí.
                </p>
              </div>
              <div className="px-6 py-4">
                <FontAwesomeIcon icon={faClock} className="text-blue-500 text-3xl" />
              </div>
            </div>
          </Link>
        </div>
        <br />
        <h1 className="title">La carrera: </h1><br /><br />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cardData.map((card, index) => (
            <FlipCard
              key={index}
              icon={card.icon}
              subtitle={card.subtitle}
              title={card.title}
              details={card.details}
            />
          ))}
        </div>
        <h1 className="title">Perfil de Estudiantes </h1><br /><br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loadingEstudiantes ? (
            <p>Cargando estudiantes...</p>
          ) : estudiantes.length > 0 ? (
            estudiantes.map(estudiante => (
              <div className="student-cards-container">
                <StudentCard
                  key={estudiante._id}
                  id={estudiante._id}
                  imageSrc={estudiante.foto}
                  name={estudiante.nombre}
                  role={estudiante.añoIngreso}
                  email={estudiante.email}
                />
              </div>
            ))
          ) : (
            <p>No se encontraron estudiantes.</p>
          )}
        </div>
        <h1 className="title">Alianzas con otras Universidades</h1><br /><br />
        <UniversityCarousel /> {/* Añadir el componente del carrusel */}
      </section>
    </MainLayout>
  );
};

export default PregaradoPage;
