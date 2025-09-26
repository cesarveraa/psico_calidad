import express from "express";
const router = express.Router();
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
} from "../controllers/subjectControllers";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

router.route("/")
  .post(authGuard, adminGuard, createSubject) // Ruta para crear una materia
  .get(getAllSubjects); // Ruta para obtener todas las materias

router.route("/:slug")
  .put(authGuard, adminGuard, updateSubject)
  .delete(authGuard, adminGuard, deleteSubject)
  .get(getSubject);

export default router;
