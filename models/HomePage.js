import { Schema, model } from "mongoose";

const HomePageSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mision: { type: String, required: true },
    vision: { type: String, required: true },
    inscripciones: { 
      state: { type: Boolean, required: true },
      url: { type: String, required: true }
    },
    tarifario: { 
      state: { type: Boolean, required: true },
      url: { type: String, required: true }
    },
    planesPago: { 
      state: { type: Boolean, required: true },
      url: { type: String, required: true }
    },
    oportunidadesBeca: { 
      state: { type: Boolean, required: true },
      url: { type: String, required: true }
    },
    programaAgora: { 
      state: { type: Boolean, required: true },
      url: { type: String, required: true }
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default HomePageSchema;
