import express from 'express';
import {
    createSystemLog,
    getAllSystemLogs,
    getSystemLogsByUser,
} from '../controllers/logsSistemaControllers.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Crear un log del sistema (requiere autenticación)
router.post('/create', authGuard, createSystemLog);

// ✅ Obtener todos los logs del sistema (solo administradores o con permisos especiales)
router.get('/', authGuard, adminGuard, getAllSystemLogs);

// ✅ Obtener logs por ID de usuario
router.get('/user/:userId', authGuard, adminGuard, getSystemLogsByUser);

export default router;
