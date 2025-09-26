import { Schema, model } from "mongoose";

const EstudianteSchema = new Schema(
  {
    nombre: { type: String, required: true },
    carrera: { type: String, default: "Psicopedagogía" },
    foto: { type: String, default: "" },
    videoPresentacionUrl: { type: String, default: "" },
    email: { type: String, required: true },
    añoIngreso: { type: Number, required: true },
    semestreActual: { type: Number, required: true },
    bio: { type: String, required: true }, // Descripción detallada del estudiante
    caracteristicas: [{ type: String }], // Lista de características que definen a la persona, como "responsable", "creativo", etc.
    intereses: [{ type: String }],
    habilidades: [{ type: String }],
    proyectos: [{ 
      nombre: { type: String, required: true },
      descripcion: { type: String, required: true },
      url: { type: String, default: "" }
    }],
    logrosAcademicos: [{ 
      titulo: { type: String, required: true },
      descripcion: { type: String, required: true },
      fecha: { type: Date, required: true }
    }],
    redesSociales: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedIn: { type: String, default: "" },
      instagram: { type: String, default: "" }
    },
    cargo: { type: String, default: "" },
    tipo: { type: String, default: "" },
    telefono: { type: String, default: "" },
    usuarioRegistrado: { type: Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

const Estudiante = model("Estudiante", EstudianteSchema);
export default Estudiante;
