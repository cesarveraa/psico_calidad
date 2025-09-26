import express from 'express';
import {
    createRole,
    deleteRole,
    getAllRoles,
    getRoleById,
    updateRole
} from '../controllers/rolesController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener todos los roles
router.get('/', authGuard, adminGuard, getAllRoles);

// Crear un nuevo rol
router.post('/', authGuard, adminGuard, createRole);

// Obtener un rol por ID
router.get('/:roleId', authGuard, adminGuard, getRoleById);

// Actualizar un rol
router.put('/:roleId', authGuard, adminGuard, updateRole);

// Eliminar un rol
router.delete('/:roleId', authGuard, adminGuard, deleteRole);

export default router;
