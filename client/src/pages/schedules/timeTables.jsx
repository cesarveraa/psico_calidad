import React from "react";
import { getTextColor } from "../../utils/colorUtils";

const Timetable = ({ timetable, scheduleColors }) => {
  const renderCellContent = (day, time) => {
    const entries = timetable.filter(
      (item) => item.day === day && item.startTime <= time && item.endTime > time
    );

    if (entries.length > 0) {
      return entries.map((entry, index) => {
        const color = scheduleColors[entry.subjectId] || 'transparent';
        return (
          <div
            key={index}
            style={{
              backgroundColor: color,
              color: getTextColor(color),
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "5px"
            }}
          >
            <h3>{entry.subjectName}</h3>
            <p>{`${entry.day} - ${entry.startTime} a ${entry.endTime}`}</p>
            <p>Paralelo: {entry.parallel}</p>
            <p>Docente: {entry.teacher}</p>
          </div>
        );
      });
    }

    return null;
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
          {times.map((time) => (
            <tr key={time}>
              <td className="border border-gray-200 px-4 py-2">{time}</td>
              {days.map((day) => (
                <td
                  key={`${day}-${time}`}
                  className="border border-gray-200 px-4 py-2"
                  style={{ minWidth: "120px", height: "80px" }}
                >
                  {renderCellContent(day, time)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
