import React, { useState, useEffect } from "react";
import { getAllSubjects } from "../../services/index/subjects";
import { toast } from "react-hot-toast";

const MateriaSelector = ({ selectedSubjects, setSelectedSubjects }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await getAllSubjects();
        setSubjects(data);
      } catch (error) {
        toast.error("Error al cargar las materias: " + error.message);
      }
    };

    fetchSubjects();
  }, []);

  const handleSelectSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else if (selectedSubjects.length < 7) {
      setSelectedSubjects([...selectedSubjects, subject]);
    } else {
      toast.error("No puedes seleccionar más de 7 materias.");
    }
  };

  const groupedSubjects = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {});

  const sortedSemesters = Object.keys(groupedSubjects).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Selecciona tus materias</h2>
      {sortedSemesters.map((semester) => (
        <div key={semester}>
          <h3 className="text-2xl font-semibold text-blue-500 mb-2">Semestre {semester}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {groupedSubjects[semester].map((subject) => (
              <div
                key={subject._id}
                className={`cursor-pointer p-4 border rounded ${
                  selectedSubjects.includes(subject) ? "bg-blue-100" : ""
                }`}
                onClick={() => handleSelectSubject(subject)}
              >
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MateriaSelector;
