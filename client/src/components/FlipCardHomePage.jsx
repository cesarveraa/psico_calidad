import React, { useState } from 'react';

function FlipCard({ frontImage, backImage }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`flip-card-container ${isFlipped ? 'flipped' : ''}`} onClick={handleClick}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={frontImage} alt="Front" className="flip-card-img"/>
        </div>
        <div className="flip-card-back">
          <img src={backImage} alt="Back" className="flip-card-img"/>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
