import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostgradoCursoCard = ({ curso }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/postgradocurso/${curso._id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={curso.photo} alt={curso.title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{curso.title}</h3>
        <p className="card-description">{curso.description}</p>
      </div>
    </div>
  );
};

export default PostgradoCursoCard;
