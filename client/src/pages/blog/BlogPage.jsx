import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import Pagination from "../../components/Pagination";
import Book from '../../components/Book';
import TeacherCard from "../../components/TeacherCard";
import ImageCard from "../../components/ImageCard"; // Importa el componente ImageCard
import { getAllDocentes } from '../../services/index/docentes';
import { getAreas } from '../../services/index/areas';
import AreaCarousel from '../../pages/areas/areaCarrusel'; // Importa el nuevo componente
import Search from "../../components/Search";
import { getAllPosts } from "../../services/index/posts";

let isFirstRun = true;

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(true);
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setLoadingDocentes(true);
        const { data: docentesData } = await getAllDocentes();
        setDocentes(docentesData);
      } catch (error) {
        toast.error("Error al cargar los docentes: " + error.message);
      } finally {
        setLoadingDocentes(false);
      }
    };

    const fetchAreas = async () => {
      try {
        setLoadingAreas(true);
        const data = await getAreas();
        setAreas(data);
      } catch (error) {
        toast.error("Error al cargar las áreas: " + error.message);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchDocentes();
    fetchAreas();
  }, []);

  var ids = [];
  for (let index = 0; index < docentes.length; index++) {
    ids.push(docentes[index]._id);
  }

  console.log(ids);

  const searchParamsValue = Object.fromEntries([...searchParams]);

  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryFn: () => getAllPosts(searchKeyword, currentPage, 12),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    refetch();
  }, [currentPage, searchKeyword, refetch]);

  const handlePageChange = (page) => {
    setSearchParams({ page, search: searchKeyword });
  };

  const handleSearch = ({ searchKeyword }) => {
    setSearchParams({ page: 1, search: searchKeyword });
  };

  const reglamentos = [
    { title: "Reglamento Interno para Prácticas Profesionales", link: "https://www.imt.ucb.edu.bo/documents/Reglamento-Interno-para-Pr%C3%A1cticas-Profesionales.pdf" },
    { title: "Normas y Procedimientos para Prácticas Profesionales", link: "https://www.imt.ucb.edu.bo/documents/Normas-y-Procedimientos-para-Pr%C3%A1cticas-Profesionales.pdf" },
    { title: "Normas y Procedimientos para Taller de Grado", link: "https://www.imt.ucb.edu.bo/documents/Normas%20y%20Procedimientos%20para%20Taller%20de%20Grado%20Rev.%202021.pdf" },
    { title: "Reglamento Interno de Modalidades de Graduación", link: "https://www.imt.ucb.edu.bo/wp-content/uploads/2019/03/Reglamento-Interno-de-Modalidades-de-Graduaci%C3%B3n.pdf" },
    { title: "Estatuto Orgánico UCB", link: "https://www.imt.ucb.edu.bo/documents/Estatuto%20Organico%20UCB.pdf" },
    { title: "Modelo Académico UCB", link: "https://www.imt.ucb.edu.bo/documents/Modelo%20Academico%20UCB.pdf" },
    { title: "Plan Estratégico Institucional", link: "https://www.imt.ucb.edu.bo/documents/Plan%20Estrategico%20Institucional.pdf" },
    { title: "Régimen Académico Docente", link: "https://www.imt.ucb.edu.bo/documents/Regimen%20Academico%20Docente.pdf" },
    { title: "Régimen Estudiantil de Pregrado", link: "https://www.imt.ucb.edu.bo/documents/Regimen%20Estudiantil%20de%20Pregrado.pdf" },
    { title: "Reglamento de Becas", link: "https://www.imt.ucb.edu.bo/documents/Reglamento%20de%20Becas.pdf" },
    { title: "Reglamento de Carrera y Desarrollo Docente de la UCB.pdf", link: "https://www.imt.ucb.edu.bo/documents/Reglamento%20de%20Carrera%20y%20Desarrollo%20Docente%20de%20la%20UCB.pdf" },
    { title: "Reglamento de Procesos Universitarios para Estudiantes", link: "https://www.imt.ucb.edu.bo/documents/Reglamento%20de%20Procesos%20Universitarios%20para%20Estudiantes.pdf" },
    { title: "Reglamento de Traspasos y Convalidaciones", link: "https://www.imt.ucb.edu.bo/documents/Reglamento%20de%20Traspasos%20y%20Convalidaciones.pdf" },
  ];

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/2">
            <img src="images/PSP-21x145-copia2.jpg" alt="Psicopedagogía" className="w-full h-auto" />
          </div>
          <div className="w-full lg:w-1/2 space-y-4">
            <h1 className="text-3xl font-bold">Psicopedagogía</h1>
            <p className="text-lg  dark:text-white">
              Conviértete en un profesional en Psicopedagogía capaz de diseñar,
              desarrollar y gestionar propuestas educativas presenciales y
              virtuales en sus cuatro campos profesionales: clínica, educativa,
              social y laboral desde una formación basada en competencias, desde
              un espíritu humanista, crítico e innovador.
            </p>
            <p className="text-lg dark:text-white">
              Sé parte de la renovación educativa y aporta a la transformación social.
            </p>
          </div>
        </div>
        <div className="my-10 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:items-center sm:space-x-4 flex-wrap">
          <Link to="/pregrado" className="btn cat-btn1 text-center">
            Pregrado
          </Link>
          <Link to="/postgrado" className="btn cat-btn2 text-center">
            Postgrado
          </Link>
          <Link to="/formacionContinua" className="btn cat-btn3 text-center">
            Formación Continua
          </Link>
        </div>
        <div className="my-10">
          <h2 className="text-2xl font-bold text-center mb-6">Directora y Docentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TeacherCard
              imageSrc="/images/dr.jpg"
              name="Dra. Alejandra Martínez Barrientos"
              role="Directora de Carrera"
              email="mmartinez@ucb.edu.bo"
            />
            <TeacherCard
              imageSrc="/images/dr2.jpg"
              name="MSc. Karina García Riveros"
              role="Docente Tiempo Completo"
              email="rgarcia@ucb.edu.bo"
            />
          </div>
        </div>
        <div className="my-10">
          <h2 className="text-2xl font-bold mb-6">Docentes tiempo completo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loadingDocentes ? (
              <p>Cargando docentes...</p>
            ) : docentes.length > 0 ? (
              docentes.map(docente => (
                <TeacherCard
                  key={docente._id}
                  id={docente._id}
                  imageSrc={docente.foto}
                  name={docente.nombre}
                  role={docente.departamento}
                  email={docente.email}
                />
              ))
            ) : (
              <p>No se encontraron docentes.</p>
            )}
          </div>
        </div>

        <div className="my-10">
          <h2 className="text-2xl font-bold text-center mb-6">Áreas de Estudio</h2>
          {loadingAreas ? (
            <p>Cargando áreas...</p>
          ) : areas.length > 0 ? (
            <AreaCarousel areas={areas} />
          ) : (
            <p>No se encontraron áreas.</p>
          )}
        </div>

        {!isLoading && (
          <Pagination
            onPageChange={(page) => handlePageChange(page)}
            currentPage={currentPage}
            totalPageCount={JSON.parse(data?.headers?.["x-totalpagecount"])}
          />
        )}
      </section>
      <section className="container mx-auto px-5 py-10">
        <h2 className="text-2xl font-bold text-center dark:text-white">Reglamentos y Normativas</h2>
        <Book pages={reglamentos} />
      </section>
    </MainLayout>
  );
};

export default BlogPage;
