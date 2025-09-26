import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllSubjects } from '../../services/index/subjects';
import { getSchedulesByIds } from '../../services/index/schedule';
import { getDocente, getAllDocentes } from '../../services/index/docentes';
import { toast } from "react-hot-toast";
import MainLayout from "../../components/MainLayout";
import TeacherCard from "../../components/TeacherCard";

const SubjectPage = () => {
  const { slug } = useParams();
  const [foundSubject, setFoundSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [docentes, setDocentes] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

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

    fetchDocentes();
  }, []);
  
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const { data: subjectsData } = await getAllSubjects();
        if (Array.isArray(subjectsData) && subjectsData.length > 0) {
          const subject = subjectsData.find(sub => sub._id === slug);
          if (subject) {
            setFoundSubject(subject);
            if (subject.schedules && subject.schedules.length > 0) {
              fetchSchedules(subject.schedules);
            }
          } else {
            console.log('No se encontró ninguna materia con el slug proporcionado.');
          }
        } else {
          console.log('No hay materias disponibles.');
        }
      } catch (error) {
        console.error('Error al obtener las materias:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSchedules = async (scheduleIds) => {
      try {
        setLoadingSchedules(true);
        const schedulesData = await getSchedulesByIds(scheduleIds);
        const schedulesWithTeachers = await Promise.all(
          schedulesData.map(async (schedule) => {
            const teacherData = await getDocente(schedule.teacher);
            return { ...schedule, teacherData };
          })
        );
        setSchedules(schedulesWithTeachers);
      } catch (error) {
        toast.error("Error al cargar los horarios: " + error.message);
      } finally {
        setLoadingSchedules(false);
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
  const renderHorarios = () => {
    if (loadingSchedules) {
      return <p>Cargando horarios...</p>;
    }
  
    if (!schedules || schedules.length === 0) {
      return <p>No hay horarios disponibles para esta materia.</p>;
    }
    console.log(schedules);
    return (
      <div className="horarios-container mt-10">
        <h2 className="page-title-sub">Horarios</h2>
        {schedules.map((horario, index) => (
          <div key={index} className="horarios-table-container">
            <div className="teacher-card-container">
              <TeacherCard
                id={horario.teacherData._id}
                imageSrc={horario.teacherData.foto}
                name={horario.teacherData.nombre}
                role={horario.teacherData.departamento}
                email={horario.teacherData.email}
              />
            </div>
            <div className="horarios-table-wrapper">
              <table className="horarios-table">
                <thead>
                  <tr>
                    <th>Paralelo</th>
                    <th>Día</th>
                    <th>Horas</th>
                    <th>Aula</th>
                    <th>Fecha de Inicio</th>
                    <th>Fecha de Fin</th>
                    <th>Periodo Académico</th>
                  </tr>
                </thead>
                <tbody>
                  {horario.classDetails.map((detail, i) => (
                    <tr key={`${index}-${i}`}>
                      {i === 0 && (
                        <td rowSpan={horario.classDetails.length}>
                          {horario.parallel}
                        </td>
                      )}
                      <td>{detail.day}</td>
                      <td>{detail.startTime} - {detail.endTime}</td>
                      <td>{detail.classroom}</td>
                      {i === 0 && (
                        <>
                          <td rowSpan={horario.classDetails.length}>
                            {new Date(horario.startDate).toLocaleDateString()}
                          </td>
                          <td rowSpan={horario.classDetails.length}>
                            {new Date(horario.endDate).toLocaleDateString()}
                          </td>
                          <td rowSpan={horario.classDetails.length}>
                            {horario.academicPeriod}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  
  
  const renderDocentes = () => {
    if (loadingDocentes) {
      return <p>Cargando docentes...</p>;
    }

    if (!foundSubject || !foundSubject.teachers || foundSubject.teachers.length === 0) {
      return <p>No se encontraron docentes para esta materia.</p>;
    }

    const docentesFiltrados = docentes.filter(docente =>
      foundSubject.teachers.includes(docente._id)
    );

    if (docentesFiltrados.length === 0) {
      return <p>No se encontraron docentes para esta materia.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {docentesFiltrados.map(docente => (
          <TeacherCard
            key={docente._id}
            id={docente._id}
            imageSrc={docente.foto}
            name={docente.nombre}
            role={docente.departamento}
            email={docente.email}
          />
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="subject-container">
        <h1 className="page-title-sub">Información de la materia</h1>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : foundSubject ? (
          <div className="subject-details animate-slideup">
            <div className="media-column">
              {foundSubject.photo && (
                <img src={foundSubject.photo} alt={foundSubject.name} className="subject-image animate-fadein" style={{ opacity: headerOpacity }} />
              )}
            </div>
            <div className="info-column">
              <h1>{foundSubject.name}</h1>
              <p><strong>Descripción:</strong> {foundSubject.description}</p>
              {foundSubject.body && <p>{foundSubject.body}</p>}
              <p><strong>Abreviatura:</strong> {foundSubject.abbreviation}</p>
              <p><strong>Requisito:</strong> {foundSubject.requirement}</p>
              <p><strong>Área:</strong> {foundSubject.area || 'No especificada'}</p>
              <p><strong>Semestre:</strong> {foundSubject.semester || 'No especificado'}</p>
              <p><strong>Ciclo:</strong> {foundSubject.cycle || 'No especificado'}</p>
              <p><strong>Créditos:</strong> {foundSubject.credits}</p>
              <p><strong>Carga Horaria:</strong> {foundSubject.workload} horas</p>
              <p><strong>Justificación:</strong> {foundSubject.justification}</p>
              {foundSubject.competencies && (
                <div>
                  <strong>Competencias:</strong>
                  <ul>
                    {foundSubject.competencies.map((comp, index) => (
                      <li key={index}>{comp}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Optativa:</strong> {foundSubject.optativa ? 'Sí' : 'No'}</p>
              {foundSubject.tags && (
                <div className="tags">
                  <strong>Etiquetas:</strong>
                  {foundSubject.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="not-found">No se encontró ninguna materia con el slug proporcionado.</p>
        )}
        {foundSubject?.video && (
          <>
            <h2 className="page-title-sub-main">Video de Presentación</h2>
            <div className="video-container">
              {renderYouTubeVideo(foundSubject.video)}
            </div>
          </>
        )}
        <div className="my-10 docentes-container">
          <h2 className="page-title-sub-main">Docentes que imparten la materia</h2>
          {renderDocentes()}
        </div>
        <div className="my-10">
          {renderHorarios()}
        </div>
        
      </div>
    </MainLayout>
  );
};

export default SubjectPage;