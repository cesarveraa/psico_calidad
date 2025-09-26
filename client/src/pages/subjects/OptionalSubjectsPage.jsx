import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects } from '../../services/index/subjects';
import MainLayout from "../../components/MainLayout";

const OptionalSubjectsPage = () => {
  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptionalSubjects = async () => {
      try {
        const { data: subjectsData } = await getAllSubjects();
        const optativeSubjects = subjectsData.filter(subject => subject.optativa);
        setOptionalSubjects(optativeSubjects);
      } catch (error) {
        console.error('Error al obtener las materias:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOptionalSubjects();
  }, []);

  if (loading) {
    return <div className="loading-unique">Cargando materias optativas...</div>;
  }

  if (optionalSubjects.length === 0) {
    return <div className="no-subjects-unique">No hay materias optativas disponibles.</div>;
  }

  return (
    <MainLayout>
      <div className="optional-subjects-page-unique">
        <h1 className="page-title-unique">Materias Optativas</h1>
        <p className="description-unique">Las materias optativas son cursos que los estudiantes pueden elegir según sus intereses y objetivos académicos. Estas materias permiten a los estudiantes personalizar su plan de estudios y explorar áreas fuera del currículo obligatorio.</p>
        <div className="subjects-grid-unique">
          {optionalSubjects.map(subject => (
            <div key={subject._id} className="subject-card-unique" onClick={() => navigate(`/subjects/${subject._id}`)}>
              <img src={subject.photo} alt={subject.name} className="subject-image-unique" />
              <div className="subject-info-unique">
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default OptionalSubjectsPage;
