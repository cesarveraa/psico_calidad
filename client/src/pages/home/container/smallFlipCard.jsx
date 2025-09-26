import React from 'react';
import PropTypes from 'prop-types';

function SmallFlipCard({ frontImage, backContent }) {
  return (
    <div className="flip-card-mision">
      <div className="flip-card-mision-inner">
        <div className="flip-card-mision-front">
          <img src={frontImage} alt="Front" className="responsive-image" />
        </div>
        <div className="flip-card-mision-back">
          <div className="responsive-text">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}

SmallFlipCard.propTypes = {
  frontImage: PropTypes.string.isRequired,
  backContent: PropTypes.node.isRequired,
};

export default SmallFlipCard;
