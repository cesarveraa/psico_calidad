import React from 'react';
import { images } from '../../constants';

const PulpiRestricciones = ({ comentario }) => {
  return (
    <div className="fixed bottom-20 right-4 flex flex-row items-center">
      <div
        style={{ backgroundColor: "#FFEB3B" }}
        className="mr-4 p-2 text-white rounded-xl shadow-lg max-w-lg"
      >
        <div className="relative bg-white text-black rounded-xl p-3 shadow-lg max-w-lg">
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 w-0 h-0 border-[10px] border-transparent border-l-white"></div>
          <strong>Pulpi: </strong>
          {comentario}
        </div>
      </div>
      <img
        className="w-24 h-auto transition-transform duration-500 ease-in-out"
        src={images.psico}
        alt="Pulpi, la mascota de la carrera de Psicopedagogía"
      />
    </div>
  );
};

export default PulpiRestricciones;
