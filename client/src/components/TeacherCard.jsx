import React from 'react';
import { useNavigate } from 'react-router-dom';

// Componente de Tarjeta para Docente
function TeacherCard({ id, imageSrc, name, role, email, telefono }) {
    console.log(id); // Verifica que el id se imprime correctamente
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/docentes/${id}`);
    };

    return (
        <div className="teacher-card flex flex-col items-center text-center">
            {/* Hacer que la imagen sea un enlace a la página del docente */}
            <img
                src={imageSrc}
                alt={name}
                className="w-full h-auto max-w-xs rounded-lg cursor-pointer"
                onClick={handleClick}
            />
            <h3 className="mt-4 font-bold">{name}</h3>
            <p className="text-sm">{role}</p>
            <a href={`mailto:${email}`} className="text-blue-600">{email}</a>
            <p className="text-sm">{telefono}</p>
        </div>
    );
}

export default TeacherCard;
