import mongoose from 'mongoose';
const { Schema } = mongoose;

const GraduateProgramSchema = new Schema(
  {
    type: { type: String, required: true },  // Eliminada la restricción enum
    description: { type: String, required: true },
    photo: { type: String, required: false },
    institution: { type: String, required: true },
    acquiredCompetencies: { type: [String], required: true },
    enrollmentRequirements: { type: String, required: true },
    duration: { type: String, required: true },
    accreditation: { type: String, required: false },
    videoExperiences: { type: String, required: false },
    writtenExperiences: { type: String, required: false },
    additionalInfo: { type: String, required: false },
    externalUrl: { type: String, required: false },  // URL a una página externa
    tags: { type: [String] }, // Tags pueden ser usados para mejorar la búsqueda dentro de la plataforma
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const PostgradoCurso = mongoose.model('GraduateProgram', GraduateProgramSchema);
export default PostgradoCurso;
