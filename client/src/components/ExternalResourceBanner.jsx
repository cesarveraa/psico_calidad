import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExternalResourceBanner = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    window.open("https://www.ucb.edu.bo/formacion/post-grado/", "_blank");
  };

  return (
    <div className="resource-banner" onClick={handleNavigation}>
      <img src="https://tja.ucb.edu.bo/wp-content/uploads/2020/09/logo-UCB.png" alt="Explore Educational Opportunities" className="banner-image" />
      <div className="banner-content">
        <h3 className="banner-title text-white">¿Quieres saber mas?</h3>
        <p>Visita la pagina oficial de la UCB</p>
        <button className="learn-more-btn">Ver mas ...</button>
      </div>
    </div>
  );
};

export default ExternalResourceBanner;
