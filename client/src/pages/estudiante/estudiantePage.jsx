import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllEstudiantes } from '../../services/index/estudiante';
import MainLayout from "../../components/MainLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';

const EstudiantePage = () => {
  const { slug } = useParams();
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerOpacity, setHeaderOpacity] = useState(1);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const { data: estudianteData } = await getAllEstudiantes();
        const estud = estudianteData.find(est => est._id === slug);
        if (estud) {
          setEstudiante(estud);
        } else {
          console.log('No se encontró ningún estudiante con el slug proporcionado.');
        }
      } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [slug]);

  const handleScroll = () => {
    const newOpacity = Math.max(1 - window.scrollY / 300, 0);
    setHeaderOpacity(newOpacity);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderSocialMediaIcons = (socials) => {
    return (
      <div className="social-media-icons">
        {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebookF} /></a>}
        {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>}
        {socials.linkedIn && <a href={socials.linkedIn} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>}
        {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>}
      </div>
    );
  };

  const renderYouTubeVideo = (videoUrl) => {
    if (!videoUrl) return null;
    const videoId = videoUrl.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
      <div className="video-container">
        <iframe
          width="560"
          height="315"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="estudiante-container">
        <br />
        <br />
        <div className="profile-header" style={{ opacity: headerOpacity }}>
          <h1 className="page-title">Perfil del Estudiante</h1>
        </div>
        <br />
        <br />

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : estudiante ? (
          <div className="estudiante-details">
            <div className="profile-header" style={{ opacity: headerOpacity }}>
              {estudiante.foto && (
                <img src={estudiante.foto} alt={estudiante.nombre} className="estudiante-image" />
              )}
              <h1 className="estudiante-nombre">{estudiante.nombre}</h1>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            
            <div className="info-column">
              <h2>Más información</h2>
              <p><strong>Bio:</strong> {estudiante.bio}</p>
              <p><strong>Email:</strong> {estudiante.email}</p>
              {estudiante.añoIngreso && <p><strong>Año de ingreso:</strong> {estudiante.añoIngreso}</p>}
              {estudiante.semestreActual && <p><strong>Semestre Actual:</strong> {estudiante.semestreActual}</p>}
              {estudiante.carrera && <p><strong>Carrera:</strong> {estudiante.carrera}</p>}
              {estudiante.caracteristicas && estudiante.caracteristicas.length > 0 && (
                <div>
                  <strong>Características:</strong>
                  <ul>
                    {estudiante.caracteristicas.map((caracteristica, index) => <li key={index}>{caracteristica}</li>)}
                  </ul>
                </div>
              )}
              {estudiante.intereses && estudiante.intereses.length > 0 && (
                <div>
                  <strong>Intereses:</strong>
                  <ul>
                    {estudiante.intereses.map((interes, index) => <li key={index}>{interes}</li>)}
                  </ul>
                </div>
              )}
              {estudiante.habilidades && estudiante.habilidades.length > 0 && (
                <div>
                  <strong>Habilidades:</strong>
                  <ul>
                    {estudiante.habilidades.map((habilidad, index) => <li key={index}>{habilidad}</li>)}
                  </ul>
                </div>
              )}
              {estudiante.proyectos && estudiante.proyectos.length > 0 && (
                <div>
                  <strong>Proyectos:</strong>
                  <ul>
                    {estudiante.proyectos.map((proyecto, index) => (
                      <li key={index}>
                        <p><strong>Nombre:</strong> {proyecto.nombre}</p>
                        <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
                        {proyecto.url && <p><strong>URL:</strong> <a href={proyecto.url} target="_blank" rel="noopener noreferrer">{proyecto.url}</a></p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {estudiante.logrosAcademicos && estudiante.logrosAcademicos.length > 0 && (
                <div>
                  <strong>Logros Académicos:</strong>
                  <ul>
                    {estudiante.logrosAcademicos.map((logro, index) => (
                      <li key={index}>
                        <p><strong>Título:</strong> {logro.titulo}</p>
                        <p><strong>Descripción:</strong> {logro.descripcion}</p>
                        <p><strong>Fecha:</strong> {new Date(logro.fecha).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {renderSocialMediaIcons(estudiante.redesSociales)}
            </div>
            {estudiante.videoPresentacionUrl && renderYouTubeVideo(estudiante.videoPresentacionUrl)}
            <br />
            <br />
            <br />
          </div>
        ) : (
          <p className="not-found">No se encontró ningún estudiante con el ID proporcionado.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default EstudiantePage;
