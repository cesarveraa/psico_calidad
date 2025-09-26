import React from 'react';
import PropTypes from 'prop-types';

const ImageCard = ({ imageUrl, title, description, buttonText, buttonLink }) => {
  return (
    <div className="image-card">
      <img className="w-full" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 ">{title}</div>
        <p className=" text-base">{description}</p>
      </div>
      <div className="px-6 pt-0 pb-2">
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
};

ImageCard.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
};

ImageCard.defaultProps = {
  imageUrl: '',
  title: '',
  description: '',
  buttonText: '',
  buttonLink: '#',
};

export default ImageCard;
