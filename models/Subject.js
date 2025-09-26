import mongoose from 'mongoose';
const { Schema } = mongoose;

const SubjectSchema = new Schema(
  {
    name: { type: String, required: true },
    abbreviation: { type: String, required: true },
    requirement: { type: String, required: true },
    description: { type: String, required: true, unique: true }, 
    body: { type: String, required: true, unique: true },
    photo: { type: String, required: false },
    video: { type: String, required: false },
    tags: { type: [String] },
    area: { type: String, required: false },
    semester: { type: String, required: false },
    cycle: { type: String, required: false },
    credits: { type: Number, required: true },
    workload: { type: Number, required: true },
    teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }],
    schedules: [{ type: Schema.Types.ObjectId, ref: 'Schedule' }],
    justification: { type: String, required: true },
    competencies: { type: [String], required: true },
    optativa: { type: Boolean, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Subject = mongoose.model('Subject', SubjectSchema);
export default Subject;
