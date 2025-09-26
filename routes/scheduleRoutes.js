import express from "express";
const router = express.Router();
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getSchedule,
  updateSchedule,
  getSchedulesByIds,
} from "../controllers/scheduleController";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

router.route("/")
  .post(authGuard, adminGuard, createSchedule) // Ruta para crear un horario
  .get(getAllSchedules); // Ruta para obtener todos los horarios
router.post('/getByIds', getSchedulesByIds);

router.route("/:slug")
  .put(authGuard, adminGuard, updateSchedule)
  .delete(authGuard, adminGuard, deleteSchedule)
  .get(getSchedule);

export default router;
