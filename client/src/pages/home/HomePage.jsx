import React, { useState, useEffect, useContext } from 'react';
import ChatBot from '../../components/ChatBot';
import MainLayout from '../../components/MainLayout';
import Articles from './container/Articles';
import CTA from './container/CTA';
import Hero from './container/Hero';
import MisionVision from './container/MisionVision';
import Tour from './container/tour';
import { updateTotalVisualizaciones } from '../../services/index/dashboards';

const HomePage = () => {
  useEffect(() => {
    updateTotalVisualizaciones().catch(error => {
      console.error("Error updating total visualizations:", error);
    });
  }, []);

  //Se aumenta en mas 1 cuando entra a la pagina de inicio 1 sola vez por maquina

  // useEffect(() => {
  //   const hasVisited = sessionStorage.getItem('hasVisited');

  //   if (!hasVisited) {
  //     updateTotalVisualizaciones()
  //       .then(() => {
  //         console.log("Visualización contada");
  //         sessionStorage.setItem('hasVisited', 'true');
  //       })
  //       .catch(error => {
  //         console.error("Error updating total visualizations:", error);
  //       });
  //   }
  // }, []);

  return (
    <MainLayout>
      <Hero />
      <Articles />
      <MisionVision />
      <Tour />
      <CTA />
      <ChatBot />
    </MainLayout>

  );
};

export default HomePage;
