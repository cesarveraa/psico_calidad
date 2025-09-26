import React from "react";
import { getTextColor } from "../../utils/colorUtils";
const Timetable = ({ timetable, scheduleColors }) => {
  const renderCell = (day, time) => {
    const entry = timetable.find(
      (entry) => entry.day === day && time >= entry.startTime && time < entry.endTime
    );

    if (entry) {
      const subjectColor = scheduleColors[entry.subjectName] || "#000";
      const textColor = getTextColor(subjectColor);
      const subjectName = entry.subjectName || "Nombre no disponible";
      const teacherName = entry.teacher || "Docente no especificado";
      const parallel = entry.parallel || "Paralelo no disponible";
      const dayTime = `${entry.day} - ${entry.startTime} a ${entry.endTime}`;

      return (
        <div
          className="h-full w-full flex items-center justify-center p-2"
          style={{ backgroundColor: subjectColor, color: textColor }}
        >
          <div>
            <p>{subjectName}</p>
            <p>{dayTime}</p>
            <p>Paralelo: {parallel}</p>
            <p>Docente: {teacherName}</p>
          </div>
        </div>
      );
    }

    return <div />;
  };

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-200 px-4 py-2">Hora</th>
            {days.map((day) => (
              <th key={day} className="border border-gray-200 px-4 py-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, rowIndex) => (
            <tr key={time}>
              <td className="border border-gray-200 px-4 py-2">{time}</td>
              {days.map((day) => {
                const ongoingEntry = timetable.find(
                  (entry) => entry.day === day && time >= entry.startTime && time < entry.endTime
                );
                if (ongoingEntry) {
                  return (
                    <td key={`${day}-${time}`} className="border border-gray-200 px-4 py-2" style={{ minWidth: "120px", height: "80px" }}>
                      {renderCell(day, time)}
                    </td>
                  );
                }
                return <td key={`${day}-${time}`} className="border border-gray-200 px-4 py-2" style={{ minWidth: "120px", height: "80px" }} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
