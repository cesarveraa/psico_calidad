import React from "react";

const ParchmentBox = ({ title, image, cargo, email, telefono }) => {
  return (
    <div className="parchment-box">
      <div className="parchment-box-header">
        <img className="header-image" src={image} alt="Header Image" />
        <h2>{title}</h2>
      </div>
      <div className="parchment-box-slider">
        <div className="parchment-box-content">
          <div className="content-info">
            <div className="cargo"><b>Cargo:</b> {cargo}</div>
            <div className="email"><b>Email:</b> {email}</div>
            <div className="telefono"><b>Teléfono:</b> {telefono}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParchmentBox;
