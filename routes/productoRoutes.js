import express from 'express';
import { getProductById, getAllProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authGuard, adminGuard } from '../middleware/authMiddleware';
import { uploadPicture } from '../middleware/uploadPictureMiddleware';

const router = express.Router();

router.route('/products')
  .get(getAllProducts)
  .post(authGuard, adminGuard, uploadPicture.array('photos'), createProduct);

router.route('/products/:id')
  .get(getProductById)
  .put(authGuard, adminGuard, uploadPicture.array('photos'), updateProduct)
  .delete(authGuard, adminGuard, deleteProduct);

export default router;
