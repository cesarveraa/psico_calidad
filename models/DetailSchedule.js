import mongoose from 'mongoose';
const { Schema } = mongoose;

const ClassDetailSchema = new Schema(
  {
    startTime: { type: String, required: true }, // Format HH:MM
    endTime: { type: String, required: true },   // Format HH:MM
    day: { type: String, required: true },
    classroom: { type: String, required: true },
  },
  { _id: false } // Esto indica que los subdocumentos no tendrán un _id propio
);

export default ClassDetailSchema;
