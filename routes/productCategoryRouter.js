import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/productCategoriesController';
import { authGuard, adminGuard } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/categories')
  .get(getAllCategories)
  .post(authGuard, adminGuard, createCategory);

router.route('/categories/:id')
  .get(getCategoryById)
  .put(authGuard, adminGuard, updateCategory)
  .delete(authGuard, adminGuard, deleteCategory);

export default router;
