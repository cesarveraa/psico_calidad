import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getRandomColor() {
  const vibrantColors = [
      "rgba(255, 87, 34, 0.8)", // naranja
      "rgba(13, 71, 161, 0.8)", // azul oscuro
      "rgba(0, 150, 136, 0.8)", // verde turquesa
      "rgba(255, 193, 7, 0.8)", // amarillo
      "rgba(233, 30, 99, 0.8)", // rosado
      "rgba(156, 39, 176, 0.8)", // púrpura
  ];
  return vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
}

function textColorBasedOnBgColor(backgroundColor) {
  const color = backgroundColor.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  const r = parseInt(color[0], 10);
  const g = parseInt(color[1], 10);
  const b = parseInt(color[2], 10);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

const SubjectCard = ({ _id, name, abbreviation, requirement, description }) => {
  const navigate = useNavigate();
  const [hoverColor, setHoverColor] = useState('');
  const [textColor, setTextColor] = useState('black');

  const handleMouseEnter = () => {
    const newColor = getRandomColor();
    setHoverColor(newColor);
    setTextColor(textColorBasedOnBgColor(newColor));
  };

  const handleMouseLeave = () => {
    setHoverColor(''); // Reset color on mouse leave
    setTextColor('black'); // Reset text color on mouse leave
  };

  return (
    <div className={`subject-card ${hoverColor ? 'hovered' : ''}`}
         onClick={() => navigate(`/subjects/${_id}`)}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         style={{ backgroundColor: hoverColor, color: textColor, transition: 'background-color 0.3s, color 0.3s' }}>
      <h3>{name}</h3>
      <p>{abbreviation}</p>
      <p>Req: {requirement}</p>
      {hoverColor && (
        <div className="additional-info">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default SubjectCard;
