import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  youtubeLink: { type: String, required: true },
  order: { type: Number, required: true }
});

const areaSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Imagen representativa del área
    items: [itemSchema]
  },
  { timestamps: true }
);

const Area = model("Area", areaSchema);

export default Area;
