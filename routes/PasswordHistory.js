// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} from "../controllers/userControllers";
import {
  getPasswordHistoryController,
  addPasswordHistoryController,

 
  
} from "../controllers/passwordHistoryController.js";
import { authGuard } from "../middleware/authMiddleware";

const router = express.Router();

// Registro de usuario
router.post("/register", registerUser);

// Login (asumiendo tengas un controlador para login)
// router.post("/login", loginUser);

// Solicitar código de restablecimiento
router.post(
  "/request-password-reset",
  requestPasswordReset
);

// Verificar token de restablecimiento
router.post(
  "/verify-reset-token",
  verifyResetToken
);

// Restablecer contraseña con validación de historial
router.post(
  "/reset-password",
  resetPassword  // en este controlador compruebas últimas 5 y actualizas
);

// Rutas protegidas (requieren JWT de sesión):
// Cambiar contraseña autenticado
router.post("/change-password", authGuard, changePassword);

// Obtener historial de contraseñas (solo accesible con JWT válido)
router.get("/:userId", authGuard, getPasswordHistoryController);

// Añadir nueva entrada al historial
router.post("/", authGuard, addPasswordHistoryController);

export default router;
