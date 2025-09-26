import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import TeacherCard from "../../../components/TeacherCard";
import { getSingleAbout } from "../../../services/index/abouts";
import { getAllDocentes, getDocente } from "../../../services/index/docentes";

const fetchAboutUsData = async () => {
  const data = await getSingleAbout("about");
  return data;
};

const AboutUs = () => {
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(true);

  const { data: aboutUsData, isLoading, isError, error } = useQuery(['aboutUsData'], fetchAboutUsData, {
    onSuccess: (data) => {
      if (data && data.about && data.about.faculty) {
        fetchDocentes(data.about.faculty);
      }
    }
  });

  const fetchDocentes = async (faculty) => {
    try {
      setLoadingDocentes(true);
      const docentesDataPromises = faculty.map(id => getDocente(id));
      const docentesData = await Promise.all(docentesDataPromises);
      setDocentes(docentesData);
    } catch (error) {
      toast.error("Error al cargar los docentes: " + error.message);
    } finally {
      setLoadingDocentes(false);
    }
  };

  useEffect(() => {
    const fetchAllDocentes = async () => {
      try {
        const { data } = await getAllDocentes();
        setDocentes(data);
      } catch (error) {
        toast.error("Error al cargar los docentes: " + error.message);
      }
    };
    fetchAllDocentes();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center py-4 text-lg text-blue-600" style={{ fontFamily: 'Roboto, sans-serif' }}>Cargando...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center py-4 text-red-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Error: {error.message}</div>;
  }

  const { description, faculty, photos, videos, title } = aboutUsData?.about || {};

  return (
    <div className="about-us-page" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <section
        style={{
          background: 'linear-gradient(to right, #0077ff, #32CD32)',
          color: 'white',
          textAlign: 'center',
          padding: '10px 0',
          fontSize: '2rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          width: '100%',
        }}
      >
        Nosotros
      </section>

      <div className="flex flex-col items-center w-full">
        {description && (
          <div className="description-section my-10 mx-auto max-w-7xl px-5">
            <h2 className="text-2xl font-bold mb-3 text-center" style={{ color: 'black', fontSize: '1.5rem' }}>{title}</h2>
            <p className="text-lg text-center" style={{ color: 'black', fontSize: '1rem' }}>{description}</p>
          </div>
        )}

        {/* Video Section */}
        {videos && videos.length > 0 && (
          <div className="videos-section my-8 w-full flex justify-center">
            <div className="box-container w-full max-w-4xl px-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos.map((video, index) => {
                  const videoId = new URLSearchParams(new URL(video.url).search).get('v');
                  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
                  return (
                    <div key={index} className="rounded-md overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                      <iframe
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title || 'YouTube video'}
                        className="w-full aspect-video"
                      ></iframe>
                      {video.title && <h3 className="text-lg font-bold text-center p-2" style={{ color: 'black', fontSize: '1rem' }}>{video.title}</h3>}
                      {video.description && <p className="text-sm text-center p-2" style={{ color: 'black', fontSize: '0.875rem' }}>{video.description}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <section
          style={{
            background: 'linear-gradient(to right, #0077ff, #32CD32)',
            color: 'white',
            textAlign: 'center',
            padding: '10px 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            width: '100%',
          }}
        >
          Nuestra Familia
        </section>

        <div className="my-10 max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingDocentes ? (
              <p className="text-center text-lg text-blue-600" style={{ fontSize: '1rem' }}>Cargando docentes...</p>
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
              <p className="text-center text-lg" style={{ color: 'black', fontSize: '1rem' }}>No se encontraron docentes.</p>
            )}
          </div>
        </div>

        <section
          style={{
            background: 'linear-gradient(to right, #0077ff, #32CD32)',
            color: 'white',
            textAlign: 'center',
            padding: '10px 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            width: '100%',
          }}
        >
          Nuestras Fotos
        </section>

        {/* Photos Section */}
        {photos && photos.length > 0 && (
          <div className="photos-section my-8 w-full flex justify-center">
            <div className="box-container w-full max-w-4xl px-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {photos.map(photo => (
                  <div key={photo.url} className="rounded-md overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                    <img src={photo.url} alt={photo.caption} className="w-full h-auto" />
                    {photo.caption && <p className="text-sm text-center p-2" style={{ color: 'black', fontSize: '0.875rem' }}>{photo.caption}</p>}
                    {photo.altText && <p className="text-sm text-center p-2" style={{ color: 'black', fontSize: '0.875rem' }}>{photo.altText}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;