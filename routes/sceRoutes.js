import express from "express";
import { getSCE, updateSCE } from "../controllers/sceController";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/:slug')
  .put(authGuard, adminGuard, uploadPicture.fields([
    { name: 'accionesInvestigativasP' },
    { name: 'presenteInvestigacionP' }
  ]), updateSCE)
  .get(getSCE);

export default router;
