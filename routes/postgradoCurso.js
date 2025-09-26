import express from "express";
const router = express.Router();
import {
  createPostgradoCurso,
  deletePostgradoCurso,
  getAllPostgradoCursos,
  getPostgradoCurso,
  updatePostgradoCurso,
} from "../controllers/postgradoCursoControllers";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

router.route("/")
  .post(authGuard, adminGuard, createPostgradoCurso) // Ruta para crear un curso de posgrado
  .get(getAllPostgradoCursos); // Ruta para obtener todos los cursos de posgrado

router
  .route("/:id")
  .put(authGuard, adminGuard, updatePostgradoCurso) // Ruta para actualizar un curso de posgrado
  .delete(authGuard, adminGuard, deletePostgradoCurso) // Ruta para eliminar un curso de posgrado
  .get(getPostgradoCurso); // Ruta para obtener un curso de posgrado específico

export default router;
