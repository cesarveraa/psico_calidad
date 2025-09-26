import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllDocentes } from '../../services/index/docentes';
import MainLayout from "../../components/MainLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-brands-svg-icons';

const DocentePage = () => {
  const { slug } = useParams();
  const [docente, setFoundDocente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerOpacity, setHeaderOpacity] = useState(1);

  useEffect(() => {
    const fetchDocente = async () => {
      try {
        const { data: docenteData } = await getAllDocentes();
        const foundDocente = docenteData.find(doc => doc._id === slug);
        if (foundDocente) {
          setFoundDocente(foundDocente);
        } else {
          console.log('No se encontró ningún docente con el slug proporcionado.');
        }
      } catch (error) {
        console.error('Error al obtener los docentes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocente();
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
          width="650"
          height="450"
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
      <div className="docente-container">
      <br />
        <br />
        <div className="profile-header" style={{ opacity: headerOpacity }}>

        <h1 className="title">Perfil del Docente</h1>
        </div>
        <br />
        <br />

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : docente ? (
          <div>
            <div className="profile-header" style={{ opacity: headerOpacity }}>
              {docente.foto && (
                <img src={docente.foto} alt={docente.nombre} className="docente-image" />
              )}
              <h1 className="title">{docente.nombre}</h1>
            </div>
            <br />
            <br />
            <br />
            <br />

            <div className="info-column">
              <h2>Más información</h2>
              <p><strong>Bio:</strong> {docente.bio}</p>
              <p><strong>Email:</strong> {docente.email}</p>
              {docente.telefono && <p><strong>Teléfono:</strong> {docente.telefono}</p>}
              <p><strong>Departamento:</strong> {docente.departamento}</p>
              <p><strong>Universidad:</strong> {docente.universidad}</p>
              <p><strong>Año de inicio:</strong> {docente.añoInicio}</p>
              {docente.cursos && (
                <div>
                  <strong>Cursos:</strong>
                  <ul>
                    {docente.cursos.map((curso, index) => <li key={index}>{curso}</li>)}
                  </ul>
                </div>
              )}
              {docente.redesSociales && renderSocialMediaIcons(docente.redesSociales)}
            </div>
            {docente.videoPresentacionUrl && renderYouTubeVideo(docente.videoPresentacionUrl)}
          </div>
        ) : (
          <p className="not-found">No se encontró ningún docente con el ID proporcionado.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default DocentePage;
