import React from 'react';
import { useNavigate } from 'react-router-dom';

// Componente de Tarjeta para Estudiante
function StudentCard({ id, imageSrc, name, yearOfEntry, email }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/estudiante/${id}`);
    };

    return (
        <div className="student-card flex flex-col items-center text-center">
            <div className="student-card-image-container cursor-pointer" onClick={handleClick}>
                <img
                    src={imageSrc}
                    alt={name}
                    className="student-card-image"
                />
            </div>
            <h3 className="mt-4 font-bold">{name}</h3>
            <p className="text-sm">Año de egreso: {yearOfEntry}</p>
            <a href={`mailto:${email}`} className="text-blue-600">{email}</a>
        </div>
    );
}

export default StudentCard;
