// src/components/Book.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';


const Book = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  const nextPage = () => {
    setAnimationClass('fade-out-next');
    setTimeout(() => {
      setCurrentPage((currentPage + 1) % pages.length);
      setAnimationClass('fade-in-next');
      setTimeout(() => {
        setAnimationClass('');
      }, 500); // Duración de la animación
    }, 500); // Duración de la animación
  };

  const prevPage = () => {
    setAnimationClass('fade-out-prev');
    setTimeout(() => {
      setCurrentPage((currentPage - 1 + pages.length) % pages.length);
      setAnimationClass('fade-in-prev');
      setTimeout(() => {
        setAnimationClass('');
      }, 500); // Duración de la animación
    }, 500); // Duración de la animación
  };

  return (
    <div className="book-container">
      <button className="arrow-button left" onClick={prevPage}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div className="book">
        <div className={`page ${animationClass}`}>
          <FontAwesomeIcon icon={faBook} className="logo " />
          <h2 className='text-light-600'>{pages[currentPage].title}</h2>
          <a href={pages[currentPage].link} target="_blank" rel="noopener noreferrer">
            Ver Reglamento
          </a>
        </div>
      </div>
      <button className="arrow-button right" onClick={nextPage}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default Book;
