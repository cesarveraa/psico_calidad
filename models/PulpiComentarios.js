import { Schema, model } from "mongoose";

const PulpiComentario = new Schema(
  {
    comentario: { type: String, required: true },
  },
  { timestamps: true }
);

const PulpiComentarios = model("PulpiComentario", PulpiComentario);
export default PulpiComentarios;
