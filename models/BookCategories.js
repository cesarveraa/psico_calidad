import { Schema, model } from "mongoose";

const BookCategoriesSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const BookCategories = model("BookCategories", BookCategoriesSchema);
export default BookCategories;
