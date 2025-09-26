import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import MainLayout from "../../components/MainLayout";
import { getAllSubjects } from "../../services/index/subjects";
import { getSchedulesByIds } from "../../services/index/schedule";
import { getDocente } from '../../services/index/docentes';
import TeacherCard from "../../components/TeacherCard";
import LoadingSpinner from "../../components/LoadingSpinner"; // Importa el LoadingSpinner
import { Link } from 'react-router-dom'; // Importa el componente Link

const HorariosPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data: subjectsData } = await getAllSubjects();
        if (!Array.isArray(subjectsData)) {
          throw new Error("La respuesta de getAllSubjects no es un array");
        }
        setSubjects(subjectsData);

        const scheduleIds = subjectsData.flatMap(subject => subject.schedules);
        if (scheduleIds.length > 0) {
          fetchSchedules(scheduleIds);
        } else {
          setLoadingSchedules(false);
        }
      } catch (error) {
        toast.error("Error al cargar las materias: " + error.message);
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

    fetchSubjects();
  }, []);

  const renderHorarios = (subject) => {
    const subjectSchedules = schedules.filter(schedule =>
      subject.schedules.includes(schedule._id)
    );

    if (subjectSchedules.length === 0) {
      return <p>No hay horarios disponibles para esta materia.</p>;
    }

    return (
      <div className="horarios-container mt-10">
        {subjectSchedules.map((horario, index) => (
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

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10 fade-in">
        <h1 className="title">Horarios de Materias</h1><br /><br />
        <Link to="/armahorarios" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded inline-block">
          Crear Horario
        </Link>
        <br /><br />
        {loadingSchedules ? (
          <LoadingSpinner />
        ) : (
          subjects.map(subject => (
            <div key={subject._id} className="subject-container-hor">
              <h2 className="subject-title">{subject.name}</h2>
              {renderHorarios(subject)}
            </div>
          ))
        )}
      </section>
    </MainLayout>
  );
};

export default HorariosPage;
