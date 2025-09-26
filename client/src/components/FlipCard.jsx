import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FlipCard = ({ icon, subtitle, title, details, cardClassName }) => {
  return (
    <div className={`flip-card-container cursor-pointer ${cardClassName}`}>
      <div className="flip-card-inner">
        <div className="flip-card-front p-6 flex flex-col items-center justify-center">
          <FontAwesomeIcon icon={icon} size="3x" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="flip-card-back p-6 flex flex-col items-center justify-center">

          <ul className="mt-4">
          <h2 className="text-2xl font-bold">{subtitle}</h2>

            {details.map((detail, index) => (
              <li key={index} className="text-lg" style={{ maxWidth: "100%" }}>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
