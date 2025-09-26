import express from "express";
import { getContactUs, updateContactUs } from "../controllers/contactUsController";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/:slug')
  .put(authGuard, adminGuard, uploadPicture.array('photos'), updateContactUs)
  .get(getContactUs);

export default router;
