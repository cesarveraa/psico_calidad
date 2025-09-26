import React from "react";
import { AiFillHeart, AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-green-400">
      <footer className="container mx-auto grid grid-cols-10 px-5 py-10 gap-y-10 gap-x-5 md:pt-20 md:grid-cols-12 lg:grid-cols-10 lg:gap-x-10 text-white">
        <div className="col-span-5 md:col-span-4 lg:col-span-2">
          <h3 className="font-bold md:text-lg">Formación</h3>
          <ul className="text-sm mt-5 space-y-4 md:text-base">
            <li><a href="/pregrado">Postgrado</a></li>
            <li><a href="/postgrado">Pregrado</a></li>
            <li><a href="/formacioncontinua">Formación continua</a></li>
          </ul>
        </div>
        <div className="col-span-5 md:col-span-4 lg:col-span-2">
          <h3 className="font-bold md:text-lg">Servicios</h3>
          <ul className="text-sm mt-5 space-y-4 md:text-base"> 
            <li><a href="https://lpz.ucb.edu.bo/becas/">Becas</a></li>
            <li><a href="https://lpz.ucb.edu.bo/estudiantes/tarifario-oficial/">Tarifario</a></li>
            <li><a href="https://lpz.ucb.edu.bo/inscripciones-estudiantes-nuevos/">Inscripciones</a></li>
          </ul>
        </div>
        <div className="col-span-5 md:col-span-4 md:col-start-5 lg:col-start-auto lg:col-span-2">
          <h3 className="font-bold md:text-lg">Carrera</h3>
          <ul className="text-sm mt-5 space-y-4 md:text-base">
            <li><a href="/about">Sobre nosotros</a></li>
            <li><a href="/contact">Contáctenos</a></li>
          </ul>
        </div>
        <div className="col-span-5 md:col-span-4 lg:col-span-2">
          <h3 className="font-bold md:text-lg">Más</h3>
          <ul className="text-sm mt-5 space-y-4 md:text-base">
            <li><a href="/nbooks">Psicopedia</a></li>
            <li><a href="/tienda">Tienda</a></li>
          </ul>
        </div>
        <div className="col-span-10 md:order-first md:col-span-4 lg:col-span-2">
          <p className="text-sm text-center mt-4 md:text-left md:text-base lg:text-sm">
            Visítanos en nuestras redes...
          </p>
          <ul className="flex justify-center items-center mt-5 space-x-4 md:justify-start">
            <li>
              <a href="https://www.instagram.com/ucb.psp/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                <AiFillInstagram className="w-6 h-auto" />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/PSPLaPaz/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-110">
                <FaFacebook className="w-6 h-auto" />
              </a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-center space-y-4 md:col-span-12 lg:col-span-10">
          <div className="bg-primary text-white p-3 rounded-full">
            <AiFillHeart className="w-7 h-auto" />
          </div>
          <p className="font-bold italic">
            Copyright © 2024. Psicopedagogía.
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
