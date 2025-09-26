import mongoose from 'mongoose';
import ClassDetailSchema from './DetailSchedule'; // Importa el submodelo
const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    classDetails: [ClassDetailSchema], // Usa el submodelo en un array
    teacher: { type: Schema.Types.ObjectId, required: true },
    parallel: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    academicPeriod: { type: String, required: true },
    vigente: { type: Boolean, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;
