import mongoose from 'mongoose';
const { Schema } = mongoose;

const UniversitySchema = new Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String, required: true, unique: true },
    photo: { type: String, required: false },
    programs: { type: [String], required: true },
    exchangePartners: [{ type: Schema.Types.ObjectId, ref: "University" }],
    tags: { type: [String] },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    socialMedia: {
      facebook: { type: String, required: false },
      twitter: { type: String, required: false },
      instagram: { type: String, required: false },
      linkedIn: { type: String, required: false },
      youtube: { type: String, required: false }
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const University = mongoose.model('University', UniversitySchema);
export default University;
