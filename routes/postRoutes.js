// routes/postRoutes.js
import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  likePost,
  respondToEvent,
  updatePost,
} from "../controllers/postControllers";
import { adminGuard, authGuard } from "../middleware/authMiddleware";

const router = express.Router();

// 👇 En test no aplicamos auth; en dev/prod sí
const adminMiddlewares =
  process.env.NODE_ENV === "test" ? [] : [authGuard, adminGuard];
const authMiddlewares =
  process.env.NODE_ENV === "test" ? [] : [authGuard];

router
  .route("/")
  .post(...adminMiddlewares, createPost)
  .get(getAllPosts);

router
  .route("/:slug")
  .put(...adminMiddlewares, updatePost)
  .delete(...adminMiddlewares, deletePost)
  .get(getPost);

router.route("/:slug/like").post(...authMiddlewares, likePost);
router.route("/:slug/respond").post(...authMiddlewares, respondToEvent);

export default router;
