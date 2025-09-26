import express from 'express';
import {
    createLoginLog,
    getAllLogs,
    getLogsByUser,
} from '../controllers/logsLoginControllers.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Crear un log de login (público: se usa al hacer login)
router.post('/create', authGuard, createLoginLog); 

// ✅ Obtener todos los logs (solo administradores)
router.get('/', authGuard, adminGuard, getAllLogs);

// ✅ Obtener logs por ID de usuario
router.get('/user/:userId', authGuard, adminGuard, getLogsByUser);

export default router;
