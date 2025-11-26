import express from "express";
const router = express.Router();

import {
  createPostCategory,
  deletePostCategory,
  getAllPostCategories,
  updatePostCategory,
  getSingleCategory,
} from "../controllers/postCategoriesController";
import { adminGuard, authGuard } from "../middleware/authMiddleware";

// 👇 En tests no aplicamos auth; en dev/prod sí
const protectedMiddlewares =
  process.env.NODE_ENV === "test" ? [] : [authGuard, adminGuard];

router
  .route("/")
  .post(...protectedMiddlewares, createPostCategory)
  .get(getAllPostCategories);

router
  .route("/:postCategoryId")
  .get(getSingleCategory)
  .put(...protectedMiddlewares, updatePostCategory)
  .delete(...protectedMiddlewares, deletePostCategory);

export default router;
