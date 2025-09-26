import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import TeacherCard from "../../../components/TeacherCard";
import { getSingleContactUs } from "../../../services/index/contactUs";
import { getAllDocentes, getDocente } from "../../../services/index/docentes";

const fetchContactUsData = async () => {
  const data = await getSingleContactUs("contact");
  return data;
};

const ContactUs = () => {
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(true);

  const { data: contactUsData, isLoading, isError, error } = useQuery(['contactUsData'], fetchContactUsData, {
    onSuccess: (data) => {
      if (data && data.contact && data.contact.faculty) {
        fetchDocentes(data.contact.faculty);
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
    return <div className="flex justify-center items-center py-4 text-lg text-blue-600">Cargando...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center py-4 text-red-500">Error: {error.message}</div>;
  }

  const { title, description, faculty, officeLocations } = contactUsData?.contact || {};

  return (
    <div className="contact-us-page">
      <section
        style={{
          background: 'linear-gradient(to right, #0077ff, #32CD32)',
          color: 'white',
          textAlign: 'center',
          padding: '10px',
          fontSize: '2rem',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        Contáctanos
      </section>

      <div className="flex flex-col items-center w-full">
        {description && (
          <div className="description-section my-10 mx-auto max-w-7xl px-5">
            <h2 className="title text-center">{title}</h2>
            <p className="text-lg text-center">{description}</p>
          </div>
        )}

        <div className="my-10">
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
                  email={docente.email}
                  telefono={docente.telefono}
                />
              ))
            ) : (
              <p>No se encontraron docentes.</p>
            )}
          </div>
        </div>
      </div>
      
      <section
        style={{
          background: 'linear-gradient(to right, #0077ff, #32CD32)',
          color: 'white',
          textAlign: 'center',
          padding: '10px',
          fontSize: '2rem',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        Oficinas
      </section>

      {officeLocations && officeLocations.length > 0 && (
        <div className="office-locations-section my-8 w-full flex justify-center">
          <div className="box-container w-full max-w-4xl px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {officeLocations.map((location, index) => (
                <div key={index} className="location p-6 shadow-lg rounded-lg text-center">
                  <img src={location.url} alt={location.title} className="w-full h-48 object-cover rounded-t-lg mb-4" />
                  <h3 className="text-xl font-bold">{location.title}</h3>
                  <p className="text-md font-semibold">{location.subtitle}</p>
                  <p className="text-md">{location.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
