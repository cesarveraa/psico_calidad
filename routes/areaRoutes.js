import express from "express";
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  deleteArea
} from "../controllers/areaController";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/')
  .post(authGuard, adminGuard, createArea)
  .get(getAreas);

router.route('/:id')
  .get(getAreaById)
  .put(authGuard, adminGuard, updateArea)
  .delete(authGuard, adminGuard, deleteArea);

export default router;
