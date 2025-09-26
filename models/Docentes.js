import { Schema, model } from "mongoose";

const DocenteSchema = new Schema(
  {
    nombre: { type: String, required: true },
    bio: { type: String, required: true },
    foto: { type: String, default: "" },
    videoPresentacionUrl: { type: String, default: "" },
    email: { type: String, required: true },
    telefono: { type: String, required: false },
    redesSociales: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedIn: { type: String, default: "" },
      instagram: { type: String, default: "" }
    },
    departamento: { type: String, required: true },
    añoInicio: { type: Number, required: true },
    cursos: [{ type: String, required: true }], // Corregido a un array de strings
    
  },
  { timestamps: true }
);

const Docente = model("Docente", DocenteSchema);
export default Docente;
