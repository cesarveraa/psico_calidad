import React, { useEffect, useState } from "react";
import { getSchedulesByIds } from "../../services/index/schedule";
import { getDocente } from "../../services/index/docentes";
import { toast } from "react-hot-toast";
import { generateRandomColor, isColorUnique, getTextColor } from "../../utils/colorUtils";

const HorarioDisplay = ({ selectedSubjects, timetable, setTimetable, scheduleColors, setScheduleColors }) => {
  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState({});

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const scheduleIds = selectedSubjects.flatMap((subject) => subject.schedules);
        if (scheduleIds.length > 0) {
          const data = await getSchedulesByIds(scheduleIds);
          setSchedules(data);
          fetchTeachers(data);
        } else {
          setSchedules([]);
        }
      } catch (error) {
        toast.error("Error al cargar los horarios: " + error.message);
      }
    };

    fetchSchedules();
  }, [selectedSubjects]);

  const fetchTeachers = async (schedules) => {
    const teacherIds = [...new Set(schedules.map(schedule => schedule.teacher))];
    const teacherData = {};

    for (const id of teacherIds) {
      try {
        const teacher = await getDocente(id);
        teacherData[id] = teacher;
      } catch (error) {
        toast.error("Error al cargar los docentes: " + error.message);
      }
    }
    setTeachers(teacherData);
  };

  const handleSelectSchedule = (schedule) => {
    const subjectName = getSubjectName(schedule._id);
    const subjectId = getSubjectId(schedule._id);
    const newTimetable = [];
    let conflict = false;

    // Verificar si ya hay un paquete seleccionado para esta materia
    const alreadySelected = timetable.some(entry => entry.subjectId === subjectId);

    if (alreadySelected) {
      toast.error("Ya ha seleccionado un paquete de horarios para esta materia.");
      return;
    }

    for (const detail of schedule.classDetails) {
      conflict = timetable.some(
        (entry) =>
          entry.day === detail.day &&
          ((detail.startTime >= entry.startTime && detail.startTime < entry.endTime) ||
            (detail.endTime > entry.startTime && detail.endTime <= entry.endTime))
      );

      if (conflict) {
        break;
      } else {
        newTimetable.push({ ...detail, subjectName, subjectId, scheduleId: schedule._id, parallel: schedule.parallel, teacher: getTeacherName(schedule.teacher) });
      }
    }

    if (conflict) {
      toast.error("Este horario entra en conflicto con otro seleccionado.");
    } else {
      const newColor = getUniqueColor();
      setScheduleColors({ ...scheduleColors, [subjectName]: newColor });
      setTimetable([...timetable, ...newTimetable]);
    }
  };

  const handleDeselectSchedule = (schedule) => {
    const subjectId = getSubjectId(schedule._id);
    const newTimetable = timetable.filter(
      (entry) => !schedule.classDetails.some((detail) => detail.day === entry.day && detail.startTime === entry.startTime) &&
                 entry.subjectId !== subjectId
    );
    const { [subjectId]: removedColor, ...remainingColors } = scheduleColors;
    setScheduleColors(remainingColors);
    setTimetable(newTimetable);
  };

  const isSelected = (schedule) => {
    return schedule.classDetails.some(
      (detail) => timetable.some((entry) => detail.day === entry.day && detail.startTime === entry.startTime && entry.subjectId === getSubjectId(schedule._id))
    );
  };

  const getSubjectName = (scheduleId) => {
    for (const subject of selectedSubjects) {
      if (subject.schedules.includes(scheduleId)) {
        return subject.name;
      }
    }
    return "Materia no especificada";
  };

  const getSubjectId = (scheduleId) => {
    for (const subject of selectedSubjects) {
      if (subject.schedules.includes(scheduleId)) {
        return subject._id;
      }
    }
    return null;
  };

  const getTeacherName = (teacherId) => {
    return teachers[teacherId]?.nombre || "Docente no especificado";
  };

  const getUniqueColor = () => {
    let newColor = generateRandomColor();
    while (!isColorUnique(newColor, Object.values(scheduleColors))) {
      newColor = generateRandomColor();
    }
    return newColor;
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-green-600 mb-4">Selecciona los horarios disponibles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {schedules.map((schedule) => (
          <div
            key={schedule._id}
            className={`cursor-pointer p-4 border rounded`}
            style={{ backgroundColor: isSelected(schedule) ? scheduleColors[getSubjectName(schedule._id)] : 'transparent' }}
            onClick={() => isSelected(schedule) ? handleDeselectSchedule(schedule) : handleSelectSchedule(schedule)}
          >
            <h3 style={{ color: 'black' }}>{getSubjectName(schedule._id)}</h3>
            {schedule.classDetails.map((detail, index) => (
              <div key={index}>
                <p style={{ color: 'black' }}>{detail.day || "Día no especificado"} - {detail.startTime || "Hora de inicio no especificada"} a {detail.endTime || "Hora de fin no especificada"}</p>
                <p style={{ color: 'black' }}>Paralelo: {schedule.parallel}</p>
                <p style={{ color: 'black' }}>Docente: {getTeacherName(schedule.teacher)}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorarioDisplay;
