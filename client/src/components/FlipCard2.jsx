import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FlipCard2 = ({ image, subtitle, title, details, cardClassName }) => {
  return (
    <div className={`flip-card2-container cursor-pointer ${cardClassName}`}>
      <div className="flip-card2-inner">
        <div className="flip-card2-front p-6 flex flex-col items-center justify-center">
          <div className="header-image-wrapper">
            <img className="header-image" src={image} alt="Header Image" />
          </div>
          <h3 className="text-xl font-semibold mt-4">{title}</h3>
        </div>
        <div className="flip-card2-back p-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">{subtitle}</h2>
          <ul className="mt-4">
            {details.map((detail, index) => (
              <li key={index} className="detail-item" style={{ maxWidth: "300px" }}>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FlipCard2;
