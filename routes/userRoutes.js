import express from 'express';
import {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
  saveSchedule,
  changePassword        // ← importar
} from '../controllers/userControllers';
import { adminGuard, authGuard } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',    loginUser);

// Protección con authGuard
router.get( '/profile',           authGuard, userProfile);
router.put( '/updateProfile/:userId', authGuard, updateProfile);
router.put( '/updateProfilePicture',  authGuard, updateProfilePicture);
router.post('/saveSchedules',     authGuard, saveSchedule);

// Nueva ruta de cambio de contraseña
router.post('/change-password',   authGuard, changePassword);

router.get( '/',        authGuard, adminGuard, getAllUsers);
router.delete('/:userId', authGuard, adminGuard, deleteUser);

// Reset de contraseña por email
router.post('/requestPasswordReset', requestPasswordReset);
router.post('/verifyResetToken',     verifyResetToken);
router.post('/resetPassword',        resetPassword);

export default router;
