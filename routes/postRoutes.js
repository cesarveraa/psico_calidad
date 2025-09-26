// routes/postRoutes.js
import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  likePost,
  respondToEvent,
  updatePost
} from "../controllers/postControllers";
import { adminGuard, authGuard } from "../middleware/authMiddleware";
const router = express.Router();

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPosts);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

router.route("/:slug/like").post(authGuard, likePost); // Protege la ruta con authGuard
router.route("/:slug/respond").post(authGuard, respondToEvent); // Nueva ruta para responder a eventos

export default router;
