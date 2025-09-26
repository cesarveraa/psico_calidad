import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleArea } from '../../services/index/areas';
import { toast } from 'react-hot-toast';
import MainLayout from '../../components/MainLayout';

const AreaPage = () => {
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const data = await getSingleArea(id);
        setArea(data);
      } catch (error) {
        toast.error("Error al cargar el área: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArea();
  }, [id]);

  const renderMedia = (url) => {
    if (!url) return null;
    const isYouTubeVideo = url.includes('youtube.com') || url.includes('youtu.be');
    if (isYouTubeVideo) {
      const videoId = url.split('v=')[1] || url.split('/').pop();
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return (
        <iframe
          width="320"
          height="240"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      );
    }
    return <img src={url} alt="Media" className="area-media" />;
  };

  const renderItems = () => {
    if (!area.items || area.items.length === 0) {
      return <p>No hay información disponible.</p>;
    }

    return area.items
      .sort((a, b) => a.order - b.order)
      .map((item, index) => (
        <div key={index} className={`area-item ${item.order % 2 === 0 ? 'reverse' : ''}`}>
          <div className="item-content">
            <div className="text-content">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>
            </div>
            {renderMedia(item.youtubeLink)}
          </div>
        </div>
      ));
  };

  return (
    <MainLayout>
      <div className="area-container">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : area ? (
          <>
            <h1 className="area-title">{area.title}</h1>
            <p className="area-description">{area.description}</p>
            <h2 className="info-subtitle">Información del área de estudio</h2>
            <div className="area-items">
              {renderItems()}
            </div>
          </>
        ) : (
          <p className="not-found">No se encontró información para esta área.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default AreaPage;
