import React, { useState, useEffect } from "react";
import MainLayout from "../../components/MainLayout";
import HorarioDisplay from "./horarioDisplay";
import Timetable from "./timeTable";
import Modal from "./Modal";
import PulpiRestricciones from "../../components/pulpiHorario/PulpiRestricciones";
import { useQuery } from "@tanstack/react-query";
import { getAllSubjects } from "../../services/index/subjects";
import { saveUsersSchedules } from "../../services/index/users";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { generateRandomColor, isColorUnique } from "../../utils/colorUtils";

const comentariosPulpi = [
  "¡Perfecto! Evitaré los puentes.",
  "No te preocupes, me aseguraré de que no tengas clases antes de las 8 am.",
  "No habrá clases después de las 6 pm, lo prometo.",
  "¡Genial! Ajustaré el horario según tus preferencias.",
  "¡Entendido! Trabajaré en ello.",
  "Tus restricciones están anotadas.",
  "Haré lo mejor para cumplir con todas las restricciones.",
  "Veamos cómo queda tu horario.",
  "¡Vamos a crear el mejor horario posible!",
  "Generando tu horario ideal..."
];

const MakeHorarioPage = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [scheduleColors, setScheduleColors] = useState({});
  const [openTabs, setOpenTabs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restricciones, setRestricciones] = useState({
    noBridges: false,
    startAfter: "08:00",
    endBefore: "18:00"
  });
  const [comentarioPulpi, setComentarioPulpi] = useState("");

  const userState = useSelector((state) => state.user);

  const { data, isLoading, isError, error } = useQuery(
    ["subjects", { searchKeyword: "", page: 1, limit: 10 }],
    ({ queryKey }) => {
      const [, { searchKeyword, page, limit }] = queryKey;
      return getAllSubjects(searchKeyword, page, limit);
    }
  );

  useEffect(() => {
    if (comentarioPulpi) {
      const timer = setTimeout(() => {
        setComentarioPulpi("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [comentarioPulpi]);

  useEffect(() => {
    const randomComment = comentariosPulpi[Math.floor(Math.random() * comentariosPulpi.length)];
    setComentarioPulpi(randomComment);
  }, [restricciones]);

  if (isLoading) {
    return <p>Cargando materias...</p>;
  }

  if (isError) {
    toast.error(error.message);
    return <p>Error al cargar materias</p>;
  }

  const subjects = data.data.sort((a) => parseInt(a.semester));

  const groupedSubjects = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {});

  const handleTabClick = (semester) => {
    setOpenTabs((prevTabs) =>
      prevTabs.includes(semester)
        ? prevTabs.filter((tab) => tab !== semester)
        : [...prevTabs, semester]
    );
  };

  const handleSubjectSelection = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else if (selectedSubjects.length < 7) {
      setSelectedSubjects([...selectedSubjects, subject]);
    } else {
      toast.error("Solo puedes seleccionar hasta 7 materias.");
    }
  };

  const handleSaveSchedules = async () => {
    try {
      const userId = userState.userInfo._id;
      const token = userState.userInfo.token;
      const uniqueSchedules = timetable.reduce((acc, current) => {
        const x = acc.find(item => item.subject === current.subjectId);
        if (!x) {
          acc.push({
            subject: current.subjectId,
            schedule: current.scheduleId,
          });
        }
        return acc;
      }, []);

      console.log("Unique Schedules:", uniqueSchedules);
      await saveUsersSchedules({ userId, schedules: uniqueSchedules, token });
      toast.success("Horarios guardados correctamente");
    } catch (error) {
      toast.error("Error al guardar horarios: " + error.message);
    }
  };

  const handleCreateSchedule = () => {
    console.log("Creating schedule with restrictions:", restricciones);

    let newTimetable = [];
    let scheduleColorsTemp = {};
    let conflict = false;

    for (const subject of selectedSubjects) {
      console.log("Processing subject:", subject.name);
      if (!Array.isArray(subject.schedules) || subject.schedules.length === 0) {
        console.error("schedules is not an array or is empty:", subject.schedules);
        continue;
      }

      for (const schedule of subject.schedules) {
        console.log("Processing schedule:", schedule?._id);
        if (!schedule || !Array.isArray(schedule.classDetails)) {
          console.error("classDetails is not an array or schedule is undefined:", schedule?.classDetails);
          continue;
        }

        for (const detail of schedule.classDetails) {
          newTimetable.push({
            ...detail,
            subjectName: subject.name,
            subjectId: subject._id,
            scheduleId: schedule._id,
            parallel: schedule.parallel,
            teacher: schedule.teacher
          });

          if (!scheduleColorsTemp[subject.name]) {
            scheduleColorsTemp[subject.name] = getUniqueColor();
          }
        }
      }
    }

    setComentarioPulpi("¡Horario generado!");

    setTimetable(newTimetable);
    setScheduleColors(scheduleColorsTemp);
    setIsModalOpen(false);
  };

  const isBridge = (timetable, detail) => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const currentDayIndex = days.indexOf(detail.day);
    if (currentDayIndex === -1) return false;

    const previousDay = days[currentDayIndex - 1];
    const nextDay = days[currentDayIndex + 1];

    return timetable.some(entry =>
      (entry.day === previousDay && entry.endTime <= detail.startTime) ||
      (entry.day === nextDay && entry.startTime >= detail.endTime)
    );
  };

  const getUniqueColor = () => {
    let newColor = generateRandomColor();
    while (!isColorUnique(newColor, Object.values(scheduleColors))) {
      newColor = generateRandomColor();
    }
    return newColor;
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10 makeHorarioPage-fade-in">
        <h1 className="makeHorarioPage-title">Selecciona las materias</h1>
        <div className="makeHorarioPage-accordion">
          {Object.keys(groupedSubjects)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((semester) => (
              <div key={semester} className="makeHorarioPage-accordion-item">
                <button
                  className={`makeHorarioPage-accordion-button ${
                    openTabs.includes(semester)
                      ? "makeHorarioPage-accordion-button-open"
                      : ""
                  }`}
                  onClick={() => handleTabClick(semester)}
                >
                  Semestre {semester}
                </button>
                <div
                  className={`makeHorarioPage-accordion-content ${
                    openTabs.includes(semester)
                      ? "makeHorarioPage-accordion-content-open"
                      : ""
                  }`}
                >
                  {groupedSubjects[semester].map((subject) => (
                    <div
                      key={subject._id}
                      className={`cursor-pointer p-4 border rounded ${
                        selectedSubjects.includes(subject)
                          ? "bg-blue-100"
                          : ""
                      }`}
                      onClick={() => handleSubjectSelection(subject)}
                    >
                      <h3>{subject.name}</h3>
                      <p>{subject.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <HorarioDisplay
          selectedSubjects={selectedSubjects}
          timetable={timetable}
          setTimetable={setTimetable}
          scheduleColors={scheduleColors}
          setScheduleColors={setScheduleColors}
        />
        <Timetable timetable={timetable} scheduleColors={scheduleColors} />
        <button
          onClick={handleSaveSchedules}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Guardar Horarios
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Crear Horario Automáticamente
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-4">Restricciones para Crear Horario</h2>
          <div className="mb-4">
            <label className="block mb-2">Evitar puentes:</label>
            <input
              type="checkbox"
              checked={restricciones.noBridges}
              onChange={(e) => setRestricciones({ ...restricciones, noBridges: e.target.checked })}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">No empezar antes de:</label>
            <input
              type="time"
              value={restricciones.startAfter}
              onChange={(e) => setRestricciones({ ...restricciones, startAfter: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">No terminar después de:</label>
            <input
              type="time"
              value={restricciones.endBefore}
              onChange={(e) => setRestricciones({ ...restricciones, endBefore: e.target.value })}
            />
          </div>
          <div className="flex justify-center items-center">
            <PulpiRestricciones comentario={comentarioPulpi} />
          </div>
          <button
            onClick={handleCreateSchedule}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Crear Horario
          </button>
        </Modal>
      </section>
    </MainLayout>
  );
};

export default MakeHorarioPage;
