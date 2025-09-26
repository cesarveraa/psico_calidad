import express from "express";
import { getZA, updateZA } from "../controllers/zaController";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/:slug')
  .put(authGuard, adminGuard, uploadPicture.fields([
    { name: 'accionesInvestigativasP' },
    { name: 'presenteInvestigacionP' }
  ]), updateZA)
  .get(getZA);

export default router;
