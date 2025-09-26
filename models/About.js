import { Schema } from "mongoose";

const AboutSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: {
      text: { type: String, required: true },
      sections: [String]
    },
    faculty: [{ type: Schema.Types.ObjectId, ref: "Docente" }],
    photos: [
      {
        url: { type: String, required: true },
        altText: { type: String, required: false },
        caption: { type: String, required: false }
      }
    ],
    videos: [
      {
        url: { type: String, required: true },
        title: { type: String, required: false },
        description: { type: String, required: false }
      }
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default AboutSchema;
