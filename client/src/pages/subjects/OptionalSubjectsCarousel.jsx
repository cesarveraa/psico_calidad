import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { getAllSubjects } from '../../services/index/subjects';

const OptionalSubjectsCarousel = () => {
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading) {
    return <div>Cargando materias optativas...</div>;
  }

  if (optionalSubjects.length === 0) {
    return <div>No hay materias optativas disponibles.</div>;
  }

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {optionalSubjects.map(subject => (
          <div key={subject._id} className="subject-card" onClick={() => navigate(`/subjects/${subject._id}`)}>
            <img src={subject.photo} alt={subject.name} className="subject-image" />
            <div className="subject-info">
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>
            </div>
          </div>
        ))}
      </Slider>
      <div className="button-container">
        <button onClick={() => navigate('/optional-subjects')} className="view-all-button">Ver todo...</button>
      </div>
    </div>
  );
};

export default OptionalSubjectsCarousel;
