import { Schema, model } from "mongoose";

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: Object, required: true },
    file: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    categories: [{ type: Schema.Types.ObjectId, ref: "BookCategories" }],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Book = model("Book", BookSchema);
export default Book;
