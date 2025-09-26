import express from "express";
const router = express.Router();
import {
  createUniversity,
  deleteUniversity,
  getAllUniversities,
  getUniversity,
  getUniversityBySlug,
  updateUniversity,
} from "../controllers/universityControllers";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

router.route("/")
  .post(authGuard, adminGuard, createUniversity) // Ruta para crear una universidad
  .get(getAllUniversities); // Ruta para obtener todas las universidades

router
  .route("/:slug")
  .put(authGuard, adminGuard, updateUniversity) // Ruta para actualizar una universidad
  .delete(authGuard, adminGuard, deleteUniversity) // Ruta para eliminar una universidad
  .get(getUniversity); // Ruta para obtener una universidad por ID

router.route("/slug/:slug").get(getUniversityBySlug); // Nueva ruta para obtener una universidad por slug

export default router;
