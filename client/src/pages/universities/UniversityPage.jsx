import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleUniversity } from '../../services/index/university';
import { toast } from "react-hot-toast";
import MainLayout from "../../components/MainLayout";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const UniversityPage = () => {
  const { slug } = useParams();
  const [foundUniversity, setFoundUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  console.log(slug);
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const { data: universityData } = await getSingleUniversity(slug);
        setFoundUniversity(universityData);
      } catch (error) {
        toast.error("Error al cargar la universidad: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [slug]);

  const handleScroll = () => {
    const newOpacity = Math.max(1 - window.scrollY / 300, 0);
    setHeaderOpacity(newOpacity);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderYouTubeVideo = (videoUrl) => {
    if (!videoUrl) return null;
    const videoId = videoUrl.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
      <iframe
        width="650"
        height="450"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    );
  };

  return (
    <MainLayout>
      <div className="university-container">
        <h1 className="page-title-u">Información de la Universidad</h1>
        <div className="header-section" style={{ opacity: headerOpacity }}>
          {foundUniversity?.photo && (
            <img
              src={foundUniversity.photo}
              alt={foundUniversity.name}
              className="university-image"
            />
          )}
          <h1 className="university-name">{foundUniversity?.name}</h1>
        </div>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : foundUniversity ? (
          <div className="university-details animate-slideup">
            <div className="info-column-u">
              <h2>Información General</h2>
              <p><strong>País:</strong> {foundUniversity.country}</p>
              <p><strong>Ciudad:</strong> {foundUniversity.city}</p>
              <p><strong>Dirección:</strong> {foundUniversity.address}</p>
              <p><strong>Descripción:</strong> {foundUniversity.description}</p>
              <p><strong>Sitio Web:</strong> <a href={foundUniversity.website} target="_blank" rel="noopener noreferrer">{foundUniversity.website}</a></p>
              <p><strong>Correo de Contacto:</strong> {foundUniversity.contactEmail}</p>
              <p><strong>Teléfono de Contacto:</strong> {foundUniversity.contactPhone}</p>
              {foundUniversity.socialMedia && (
                <div className="social-media-u">
                  <strong>Redes Sociales:</strong>
                  <div className="social-icons-u">
                    {foundUniversity.socialMedia.facebook && <a href={foundUniversity.socialMedia.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook size={30} /></a>}
                    {foundUniversity.socialMedia.twitter && <a href={foundUniversity.socialMedia.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter size={30} /></a>}
                    {foundUniversity.socialMedia.instagram && <a href={foundUniversity.socialMedia.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram size={30} /></a>}
                    {foundUniversity.socialMedia.linkedIn && <a href={foundUniversity.socialMedia.linkedIn} target="_blank" rel="noopener noreferrer"><FaLinkedin size={30} /></a>}
                    {foundUniversity.socialMedia.youtube && <a href={foundUniversity.socialMedia.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube size={30} /></a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="not-found">No se encontró ninguna universidad con el slug proporcionado.</p>
        )}
        {foundUniversity?.video && (
          <>
            <h2 className="video-title-u">Video de Presentación</h2>
            <div className="video-container-u">
              {renderYouTubeVideo(foundUniversity.video)}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default UniversityPage;
