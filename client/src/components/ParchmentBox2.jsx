import React from "react";

const ParchmentBox2 = ({ title, image,subtitle,description, isOpen}) => {
  return (
    <div className={`parchment-box2 ${isOpen ? "open" : ""}`}>
      <div className="parchment-box-header2">
        <img className="header-image" src={image} alt="Header Image" />
        <h2>{title}</h2>
      </div>
      <div className="parchment-box-slider2">
        <div className="parchment-box-content2">
          <div className="content-info">
            <div className="subtitulo"><b>{subtitle}</b></div>
            <div className="descr">{description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParchmentBox2;
