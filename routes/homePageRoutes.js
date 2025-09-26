import express from "express";
import { getHomePage, updateHomePage } from "../controllers/homePageController";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/:slug')
  .put(authGuard, adminGuard, updateHomePage)
  .get(getHomePage);

export default router;
