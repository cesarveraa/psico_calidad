import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Pulpi from "../components/Pulpi"; // Asegúrate de que la ruta sea correcta

const MainLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header onToggleDarkMode={toggleDarkMode} />
      {children}
      <Footer />
      <Pulpi imageSize="20" /> {/* Tamaño de la imagen ajustado para el botón de chatbot */}
    </div>
  );
};

export default MainLayout;
