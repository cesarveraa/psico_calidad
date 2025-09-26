import React from 'react';
import { Link } from 'react-router-dom';

const AreaCard = ({ area }) => {
  return (
    <div className="area-card">
      <div className="area-card-content">
        <img src={"/uploads/"+area.image} alt={area.title} className="area-card-image" />
        <div className="area-card-info">
          <h3 className="area-card-title">{area.title}</h3>
          <p className="area-card-description">{area.description}</p>
          <Link to={`/area/${area._id}`} className="area-card-link">
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AreaCard;
