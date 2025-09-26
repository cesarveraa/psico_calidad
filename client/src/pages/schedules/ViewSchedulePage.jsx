import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../services/index/users";
import { getDocente } from "../../services/index/docentes";
import { toast } from "react-hot-toast";
import Timetable from "./timeTables";
import PulpiCentrado from "../../components/pulpiHorario/PulpiCentrado";
import { generateRandomColor, isColorUnique } from "../../utils/colorUtils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewSchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleColors, setScheduleColors] = useState({});
  const [teachers, setTeachers] = useState({});
  const userState = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSchedule = async () => {
      if (!userState.userInfo || !userState.userInfo.token) {
        toast.error("Usuario no autenticado. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }

      try {
        const token = userState.userInfo.token;
        const data = await getUserProfile(token);
        setSchedule(data.selectedSchedules);

        const colors = {};
        for (const item of data.selectedSchedules) {
          const subjectId = item.subject._id;
          if (!colors[subjectId]) {
            let newColor = generateRandomColor();
            while (!isColorUnique(newColor, Object.values(colors))) {
              newColor = generateRandomColor();
            }
            colors[subjectId] = newColor;
          }
        }
        setScheduleColors(colors);

        const teacherData = {};
        for (const item of data.selectedSchedules) {
          const teacher = await getDocente(item.schedule.teacher);
          teacherData[item.schedule.teacher] = teacher.nombre;
        }
        setTeachers(teacherData);
      } catch (error) {
        toast.error("Error al cargar el horario: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSchedule();
  }, [userState.userInfo]);

  const downloadPDF = () => {
    const input = document.getElementById("timetable");
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save("Horario.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
        toast.error("Error al generar el PDF.");
      });
  };

  if (loading) {
    return <p>Cargando horario...</p>;
  }

  if (schedule.length === 0) {
    return (
      <MainLayout>
        <PulpiCentrado imageSize={40} />
        <button
          onClick={() => navigate("/armahorarios")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Crear Otro Horario
        </button>
      </MainLayout>
    );
  }

  const formattedSchedule = schedule.flatMap((item) =>
    item.schedule.classDetails.map((detail) => ({
      ...detail,
      subjectName: item.subject.name,
      subjectId: item.subject._id,
      scheduleId: item.schedule._id,
      parallel: item.schedule.parallel,
      teacher: teachers[item.schedule.teacher] || "Docente no especificado",
    }))
  );

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10 viewSchedulePage-fade-in">
        <h1 className="viewSchedulePage-title text-6xl">Mi Horario</h1>
        <div id="timetable">
          <Timetable timetable={formattedSchedule} scheduleColors={scheduleColors} />
        </div>
        <button
          onClick={downloadPDF}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Descargar Horario como PDF
        </button>
        <button
          onClick={() => navigate("/armahorarios")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Crear Otro Horario
        </button>
      </section>
    </MainLayout>
  );
};

export default ViewSchedulePage;
