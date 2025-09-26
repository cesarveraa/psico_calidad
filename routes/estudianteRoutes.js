import express from "express";
const router = express.Router();
import {
  createEstudiante,
  deleteEstudiante,
  getAllEstudiantes,
  getEstudiante,
  updateEstudiante,
} from "../controllers/estudianteController";
import { authGuard, adminGuard } from "../middleware/authMiddleware";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";

// Rutas para manejar los estudiantes
router.route("/estudiantes")
  .post(authGuard, adminGuard, uploadPicture.single("foto"), createEstudiante)  // Crea un nuevo estudiante
  .get(getAllEstudiantes);                                                      // Obtiene todos los estudiantes

router.route("/estudiantes/:id")
  .put(authGuard, adminGuard, uploadPicture.single("foto"), updateEstudiante)   // Actualiza un estudiante por ID
  .delete(authGuard, adminGuard, deleteEstudiante)                              // Borra un estudiante por ID
  .get(getEstudiante);                                                          // Obtiene un estudiante por ID

export default router;
