import express from "express";
const router = express.Router();
import {
  createDocente,
  deleteDocente,
  getAllDocentes,
  getDocente,
  updateDocente,
} from "../controllers/docenteController";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

// Rutas para manejar los docentes
router.route("/")
  .post(authGuard, adminGuard, createDocente)  // Crea un nuevo docente
  .get(getAllDocentes);                        // Obtiene todos los docentes

router.route("/:id")
  .put(authGuard, adminGuard, updateDocente)   // Actualiza un docente por ID
  .delete(authGuard, adminGuard, deleteDocente) // Borra un docente por ID
  .get(getDocente);                            // Obtiene un docente por ID

export default router;
