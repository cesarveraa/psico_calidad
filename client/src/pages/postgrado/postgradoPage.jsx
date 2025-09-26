import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import ExternalResourceBanner from "../../components/ExternalResourceBanner";
import PostgradoCursoCard from '../../components/PostgradoCursoCard';
import { getAllPostgradoCursos } from '../../services/index/postgradoCursos';
import { toast } from "react-hot-toast";

const PosgradoPage = () => {
  const [cursos, setCursos] = useState([]); // Cambiado de `null` a `[]`
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        setLoading(true);
        const { data: cursosData } = await getAllPostgradoCursos();
        if (Array.isArray(cursosData) && cursosData.length > 0) {
          setCursos(cursosData); // Asegúrate de que la API devuelve un array
        } else {
          console.log('No hay cursos disponibles.');
        }
      } catch (error) {
        console.error('Error al obtener los cursos:', error);
        toast.error("Error al cargar el curso: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, []);

  const groupByType = (cursos) => {
    return cursos.reduce((acc, curso) => {
      if (!acc[curso.type]) {
        acc[curso.type] = [];
      }
      acc[curso.type].push(curso);
      return acc;
    }, {});
  };

  const groupedCursos = groupByType(cursos);

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10 fade-in">
        <h1 className="title">Postgrado</h1><br /><br />
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
            <h2 className="text-3xl font-bold">Postgrados</h2>
            <p className="text-lg">
              Conviértete en un experto en Psicopedagogía, una carrera dedicada a la creación,
              desarrollo y administración de propuestas educativas tanto presenciales como virtuales.
              Esta disciplina te permitirá trabajar en cuatro áreas clave: clínica, educativa, social y
              laboral. A través de una formación centrada en competencias, adoptarás un enfoque humanista,
              crítico e innovador, esencial para abordar y resolver los desafíos educativos contemporáneos
              de manera efectiva.
            </p>
            <p className="text-lg">
              Sé parte de la renovación educativa y aporta a la transformación social.
            </p>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="space-y-8">
          {!loading && Object.keys(groupedCursos).length > 0 ? (
            Object.keys(groupedCursos).map(type => (
              <div key={type}>
                <h3 className="text-2xl font-semibold">{type}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                  {groupedCursos[type].map(curso => (
                    <PostgradoCursoCard key={curso.id} curso={curso} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No se encontraron cursos de postgrado disponibles.</p>
          )}
        </div>

        <ExternalResourceBanner />
      </section>
    </MainLayout>
  );
};

export default PosgradoPage;
