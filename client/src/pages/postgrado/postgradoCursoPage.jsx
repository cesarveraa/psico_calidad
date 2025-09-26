import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllPostgradoCursos } from '../../services/index/postgradoCursos';
import { toast } from "react-hot-toast";
import MainLayout from "../../components/MainLayout";
import { FaUniversity, FaClock, FaTags, FaLink } from 'react-icons/fa'; // Asumiendo que has instalado react-icons
import ExternalResourceBanner from "../../components/ExternalResourceBanner";

const PostgradoCursoPage = () => {
  const { slug } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const { data: cursosData } = await getAllPostgradoCursos();
        if (Array.isArray(cursosData) && cursosData.length > 0) {
          const encontrado = cursosData.find(c => c._id === slug);
          if (encontrado) {
            setCurso(encontrado);
          } else {
            console.log('No se encontró ningún curso con el ID proporcionado.');
          }
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
  }, [slug]);

  const renderVideo = (url) => {
    if (!url) return null;
    const videoId = url.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
      <div className="video-container animate-slideup">
        <iframe
          width="100%"
          height="450"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video de Presentación"
        />
      </div>
    );
  };

  return (
    <MainLayout>
              <h1 className="title text-center">Información del Curso de Posgrado</h1>

      <div className="curso-container">
        
        <div className="left-column">
          {curso && curso.photo && (
            <img src={curso.photo} alt="Imagen del curso" className="curso-image" />
          )}
        </div>
        <div className="right-column">
          <h1 className="title2">Información del Curso de Posgrado</h1>
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : curso ? (
            <div className="curso-details animate-slideup bg-light-dark-900">
              <h1>{curso.type} en {curso.institution}</h1>
              <p><strong>Descripción:</strong> {curso.description}</p>
              <p><strong>Competencias Adquiridas:</strong> {curso.acquiredCompetencies.join(', ')}</p>
              <p><strong>Requisitos de Inscripción:</strong> {curso.enrollmentRequirements}</p>
              <p><strong>Duración:</strong> {curso.duration}</p>
              {curso.accreditation && <p><strong>Acreditación:</strong> {curso.accreditation}</p>}
              {curso.tags && (
                <div className="tags">
                  {curso.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              )}
            </div>
          ) : (
            <p className="not-found">No se encontró el curso con el ID proporcionado.</p>
          )}
        </div>
      </div>
      {curso && curso.videoExperiences && (
        <div className="video-outer-container">
          {renderVideo(curso.videoExperiences)}
        </div>
      )}
              <ExternalResourceBanner />

    </MainLayout>
  );
  
  
};

export default PostgradoCursoPage;
