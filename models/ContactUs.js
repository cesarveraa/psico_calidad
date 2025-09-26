import { Schema, model } from "mongoose";

const ContactUsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    officeLocations: [{
      url: { type: String, required: true },
      address: { type: String, required: true },
      title: { type: String, required: true },
      subtitle: { type: String, required: true }
    }],
    faculty: [{ type: Schema.Types.ObjectId, ref: "Docente" }],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default ContactUsSchema;
