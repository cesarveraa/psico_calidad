import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getAllUniversities } from '../../services/index/university';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UniversityCarousel = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const { data } = await getAllUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Error al cargar las universidades: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
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
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Slider {...settings}>
      {universities.map(university => (
        <div key={university._id} className="university-card">
          <img src={university.photo} alt={university.name} className="university-logo" />
          <h3>{university.name}</h3>
          <p>{university.country}</p>
          <div className="social-icons">
            {university.socialMedia.facebook && <a href={university.socialMedia.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook size={20} /></a>}
            {university.socialMedia.twitter && <a href={university.socialMedia.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter size={20} /></a>}
            {university.socialMedia.instagram && <a href={university.socialMedia.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram size={20} /></a>}
            {university.socialMedia.linkedIn && <a href={university.socialMedia.linkedIn} target="_blank" rel="noopener noreferrer"><FaLinkedin size={20} /></a>}
            {university.socialMedia.youtube && <a href={university.socialMedia.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube size={20} /></a>}
          </div>
          <Link to={`/universities/${university._id}`} className="read-more">Leer más</Link>
        </div>
      ))}
    </Slider>
  );
};

export default UniversityCarousel;
