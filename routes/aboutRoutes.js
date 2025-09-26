import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/:slug')
  .put(authGuard, adminGuard, uploadPicture.array('photos'), updateAbout)
  .get(getAbout);

export default router;
