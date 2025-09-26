import React, { useState, useEffect } from 'react';
import SubjectCard from './SubjectCard';
import { getAllSubjects } from '../../services/index/subjects';

const SemesterAreaGrid = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data: subjectsData } = await getAllSubjects();
        console.log("Datos recibidos:", subjectsData); // Depuración de los datos recibidos
        if (Array.isArray(subjectsData) && subjectsData.length > 0) {
          // Filtrar las materias que no son optativas
          const nonOptionalSubjects = subjectsData.filter(subject => !subject.optativa);
          setSubjects(nonOptionalSubjects);
        } else {
          console.error('La respuesta no es un arreglo o está vacío');
        }
      } catch (error) {
        console.error("Error al obtener las materias:", error);
      }
    };

    fetchSubjects();
  }, []);

  // Obtener semestres y áreas únicas
  const semesters = [...new Set(subjects.map(subject => subject.semester))].sort();
  const areas = [...new Set(subjects.map(subject => subject.area))].sort();

  // Organizar las materias por semestre y área
  const organizedSubjects = semesters.map(semester => ({
    semester,
    areas: areas.map(area => subjects.filter(subject => subject.semester === semester && subject.area === area))
  }));

  if (!Array.isArray(subjects) || subjects.length === 0) {
    return <div>No hay materias para mostrar</div>;
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="grid-semester-title">S</div> {/* Solo para el título de semestre */}
        {areas.map(area => (
          <div key={area} className="grid-area-title">{area}</div>
        ))}
      </div>
      {organizedSubjects.map(({ semester, areas }) => (
        <div key={semester} className="grid-row">
          <div className="grid-semester-title">{semester}</div>
          {areas.map((subjectsInArea, index) => (
            <div key={index} className="grid-area">
              {subjectsInArea.map(subject => (
                <div className="subject-card-container" key={subject._id}>
                  <SubjectCard description={subject.body} {...subject} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SemesterAreaGrid;
