/**
 * rolesTests.test.js
 *
 * Suite de pruebas unitarias para:
 * - Controlador de Roles
 *
 * Todas las pruebas siguen el patrón AAA:
 * 1) PREPARACIÓN (Arrange)
 * 2) LÓGICA / EJECUCIÓN (Act)
 * 3) VERIFICACIÓN / ASSERT (Assert)
 */

import Role from '../models/Roles.js';

import {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
} from '../controllers/rolesController'; // 👈 ajusta el nombre si tu archivo es distinto

// MOCK DEL MODELO
jest.mock('../models/Roles.js');

// Helpers para simular res y next
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn();

describe('rolesTests - Pruebas unitarias del controlador de Roles (AAA)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // 1) getAllRoles - devuelve lista de roles (200)
  // ============================================================================
  test('1) getAllRoles - devuelve la lista de roles ordenada (200)', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {};
    const res = createMockResponse();
    const next = createMockNext();

    const roles = [
      { _id: 'r1', name: 'Admin' },
      { _id: 'r2', name: 'Estudiante' },
    ];

    // Simulamos Role.find().sort(...)
    const sortMock = jest.fn().mockResolvedValue(roles);
    Role.find.mockReturnValue({ sort: sortMock });

    // 2) LÓGICA (Act)
    await getAllRoles(req, res, next);

    // 3) ASSERT
    expect(Role.find).toHaveBeenCalledTimes(1);
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(roles);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 2) getAllRoles - llama a next(error) si ocurre un error
  // ============================================================================
  test('2) getAllRoles - llama a next(error) cuando falla la consulta', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {};
    const res = createMockResponse();
    const next = createMockNext();

    const sortMock = jest.fn().mockRejectedValue(new Error('DB error'));
    Role.find.mockReturnValue({ sort: sortMock });

    // 2) LÓGICA (Act)
    await getAllRoles(req, res, next);

    // 3) ASSERT
    expect(Role.find).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('DB error');
  });

  // ============================================================================
  // 3) createRole - crea un rol nuevo correctamente (201)
  // ============================================================================
  test('3) createRole - crea un rol nuevo cuando no existe (201)', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        name: 'Seguridad',
        description: 'Rol de seguridad',
        permissions: ['users.read', 'users.update'],
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    Role.findOne.mockResolvedValueOnce(null); // no existe rol con ese nombre

    const createdRole = {
      _id: 'role123',
      name: 'Seguridad',
      description: 'Rol de seguridad',
      permissions: ['users.read', 'users.update'],
    };

    Role.create.mockResolvedValueOnce(createdRole);

    // 2) LÓGICA (Act)
    await createRole(req, res, next);

    // 3) ASSERT
    expect(Role.findOne).toHaveBeenCalledWith({ name: 'Seguridad' });
    expect(Role.create).toHaveBeenCalledWith({
      name: 'Seguridad',
      description: 'Rol de seguridad',
      permissions: ['users.read', 'users.update'],
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdRole);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 4) createRole - error si falta el nombre
  // ============================================================================
  test('4) createRole - llama a next(error) si falta el nombre del rol', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        // name ausente
        description: 'Rol sin nombre',
        permissions: [],
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    // 2) LÓGICA (Act)
    await createRole(req, res, next);

    // 3) ASSERT
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('El nombre del rol es obligatorio');
    expect(res.status).not.toHaveBeenCalledWith(201);
  });

  // ============================================================================
  // 5) createRole - error si el rol ya existe
  // ============================================================================
  test('5) createRole - llama a next(error) si ya existe un rol con ese nombre', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        name: 'Admin',
        description: 'Rol ya existente',
        permissions: [],
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    Role.findOne.mockResolvedValueOnce({ _id: 'r1', name: 'Admin' });

    // 2) LÓGICA (Act)
    await createRole(req, res, next);

    // 3) ASSERT
    expect(Role.findOne).toHaveBeenCalledWith({ name: 'Admin' });
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Ya existe un rol con ese nombre');
  });

  // ============================================================================
  // 6) getRoleById - devuelve 200 y el rol cuando existe
  // ============================================================================
  test('6) getRoleById - devuelve el rol cuando existe (200)', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { roleId: 'r1' } };
    const res = createMockResponse();
    const next = createMockNext();

    const role = { _id: 'r1', name: 'Admin' };
    Role.findById.mockResolvedValueOnce(role);

    // 2) LÓGICA (Act)
    await getRoleById(req, res, next);

    // 3) ASSERT
    expect(Role.findById).toHaveBeenCalledWith('r1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(role);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 7) getRoleById - devuelve 404 si el rol no existe
  // ============================================================================
  test('7) getRoleById - devuelve 404 si el rol no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { roleId: 'rx' } };
    const res = createMockResponse();
    const next = createMockNext();

    Role.findById.mockResolvedValueOnce(null);

    // 2) LÓGICA (Act)
    await getRoleById(req, res, next);

    // 3) ASSERT
    expect(Role.findById).toHaveBeenCalledWith('rx');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Rol no encontrado' });
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 8) updateRole - actualiza campos del rol cuando existe
  // ============================================================================
  test('8) updateRole - actualiza nombre, descripción y permisos cuando el rol existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      params: { roleId: 'r1' },
      body: {
        name: 'NuevoNombre',
        description: 'Nueva descripción',
        permissions: ['perm.1', 'perm.2'],
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const saveMock = jest.fn().mockResolvedValue(true);
    const role = {
      _id: 'r1',
      name: 'ViejoNombre',
      description: 'Vieja desc',
      permissions: [],
      save: saveMock,
    };

    Role.findById.mockResolvedValueOnce(role);

    // 2) LÓGICA (Act)
    await updateRole(req, res, next);

    // 3) ASSERT
    expect(Role.findById).toHaveBeenCalledWith('r1');
    expect(role.name).toBe('NuevoNombre');
    expect(role.description).toBe('Nueva descripción');
    expect(role.permissions).toEqual(['perm.1', 'perm.2']);
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(role);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 9) updateRole - llama a next(error) si el rol no existe
  // ============================================================================
  test('9) updateRole - llama a next(error) si el rol no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      params: { roleId: 'rx' },
      body: { name: 'Algo' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    Role.findById.mockResolvedValueOnce(null);

    // 2) LÓGICA (Act)
    await updateRole(req, res, next);

    // 3) ASSERT
    expect(Role.findById).toHaveBeenCalledWith('rx');
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Rol no encontrado');
  });

  // ============================================================================
  // 10) deleteRole - elimina el rol cuando existe
  // ============================================================================
  test('10) deleteRole - elimina el rol cuando existe (200)', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { roleId: 'r1' } };
    const res = createMockResponse();
    const next = createMockNext();

    const removeMock = jest.fn().mockResolvedValue(true);
    const role = {
      _id: 'r1',
      name: 'Admin',
      remove: removeMock,
    };

    Role.findById.mockResolvedValueOnce(role);

    // 2) LÓGICA (Act)
    await deleteRole(req, res, next);

    // 3) ASSERT
    expect(Role.findById).toHaveBeenCalledWith('r1');
    expect(removeMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Rol eliminado correctamente',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
