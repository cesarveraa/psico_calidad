/**
 * usersTests.test.js
 *
 * Suite de pruebas unitarias para el controlador de usuarios:
 * - registerUser
 * - loginUser
 * - getAllUsers
 * - requestPasswordReset
 * - verifyResetToken
 *
 * Todas las pruebas siguen el patrón AAA:
 * 1) PREPARACIÓN (Arrange)
 * 2) LÓGICA / EJECUCIÓN (Act)
 * 3) VERIFICACIÓN / ASSERT (Assert)
 */

import crypto from 'crypto';

// MODELOS
import User from '../../models/User.js';
import Role from '../../models/Roles.js';
import Dashboard from '../../models/Dashboard.js';
import PasswordHistory from '../../models/PasswordHistory.js';

// SERVICIOS / UTILIDADES
import { sendVerificationEmail } from '../../services/resetPasswordMailer.js';
import myCache from '../../cache.js';
import * as loginLogs from '../../controllers/logsLoginControllers.js';

// FUNCIONES A PROBAR
import {
  registerUser,
  loginUser,
  getAllUsers,
  requestPasswordReset,
  verifyResetToken,
} from '../../controllers/userControllers.js';

import { compare, hash } from 'bcryptjs';

// ================== MOCKS ==================

// Mockear modelos
jest.mock('../../models/User');
jest.mock('../../models/Roles.js');
jest.mock('../../models/PasswordHistory.js');

// Dashboard necesita ser "constructible" y tener findOne
jest.mock('../../models/Dashboard', () => {
  const DashboardMock = function (init = {}) {
    this.estudiantesPorSexo = init.estudiantesPorSexo || [];
    this.nuevosUsuarios = init.nuevosUsuarios || 0;
    this.save = jest.fn().mockResolvedValue(this);
  };
  DashboardMock.findOne = jest.fn().mockResolvedValue(null);
  return DashboardMock;
});

// Servicios / utilidades
jest.mock('../../services/resetPasswordMailer');
jest.mock('../../cache', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

// bcrypt
jest.mock('bcryptjs');

// logs de login
jest.mock('../../controllers/logsLoginControllers.js', () => ({
  saveLoginLog: jest.fn(),
}));

// Helpers para simular res y next
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn();

describe('usersTests - Pruebas unitarias del controlador de usuarios (AAA)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // 1) registerUser - registro exitoso con rol por defecto "Estudiante"
  // ============================================================================
  test('1) registerUser - crea usuario nuevo con rol por defecto', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'Password123',
        sexo: 'M',
        ci: '12345678',
        roles: undefined,
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    User.findOne.mockResolvedValueOnce(null);
    Role.findOne.mockResolvedValueOnce({ _id: 'role1', name: 'Estudiante' });

    const fakeUser = {
      _id: 'user123',
      avatar: 'avatar.png',
      name: 'Juan',
      email: 'juan@example.com',
      sexo: 'M',
      ci: '12345678',
      verified: false,
      password: 'hashedPassword',
      roles: ['role1'],
      createdAt: new Date('2025-01-01'),
      generateJWT: jest.fn().mockResolvedValue('fake-jwt-token'),
    };
    User.create.mockResolvedValue(fakeUser);
    PasswordHistory.create.mockResolvedValue({});

    // 2) LÓGICA (Act)
    await registerUser(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(User.findOne).toHaveBeenCalledWith({ email: 'juan@example.com' });
    expect(Role.findOne).toHaveBeenCalledWith({ name: 'Estudiante' });
    expect(User.create).toHaveBeenCalled();
    expect(PasswordHistory.create).toHaveBeenCalledWith({
      user: 'user123',
      password: 'hashedPassword',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'user123',
        name: 'Juan',
        email: 'juan@example.com',
        roles: ['Estudiante'],
        token: 'fake-jwt-token',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 2) registerUser - email duplicado llama a next(error)
  // ============================================================================
  test('2) registerUser - falla si el email ya está registrado', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'Password123',
        sexo: 'M',
        ci: '12345678',
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    User.findOne.mockResolvedValueOnce({ _id: 'existingUser' });

    // 2) LÓGICA (Act)
    await registerUser(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(User.findOne).toHaveBeenCalledWith({ email: 'juan@example.com' });
    expect(next).toHaveBeenCalled();
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('El usuario ya está registrado');
    expect(res.status).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 3) loginUser - falta email o password -> 400
  // ============================================================================
  test('3) loginUser - devuelve 400 si faltan email o password', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { body: {} };
    const res = createMockResponse();

    // 2) LÓGICA (Act)
    await loginUser(req, res);

    // 3) VERIFICACIÓN (Assert)
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email y contraseña son requeridos',
    });
    expect(User.findOne).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 4) loginUser - usuario no encontrado -> 400
  // ============================================================================
  test('4) loginUser - devuelve 400 si el email no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        email: 'noexiste@example.com',
        password: 'Password123',
      },
    };
    const res = createMockResponse();

    User.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    // 2) LÓGICA (Act)
    await loginUser(req, res);

    // 3) VERIFICACIÓN (Assert)
    expect(User.findOne).toHaveBeenCalledWith({
      email: 'noexiste@example.com',
    });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email not found' });
  });

  // ============================================================================
  // 5) loginUser - sin historial de contraseña -> 400
  // ============================================================================
  test('5) loginUser - devuelve 400 si no hay historial de contraseña', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        email: 'user@example.com',
        password: 'Password123',
      },
    };
    const res = createMockResponse();

    const user = {
      _id: 'user123',
      email: 'user@example.com',
      roles: [],
    };

    User.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(user),
    });

    PasswordHistory.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue(null),
    });

    // 2) LÓGICA (Act)
    await loginUser(req, res);

    // 3) VERIFICACIÓN (Assert)
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No password registered for this user',
    });
  });

  // ============================================================================
  // 6) loginUser - contraseña incorrecta -> 400
  // ============================================================================
  test('6) loginUser - devuelve 400 si la contraseña es incorrecta', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        email: 'user@example.com',
        password: 'WrongPassword',
      },
    };
    const res = createMockResponse();

    const user = {
      _id: 'user123',
      email: 'user@example.com',
      roles: [],
    };

    User.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(user),
    });

    PasswordHistory.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({ password: 'hashFromHistory' }),
    });

    compare.mockResolvedValue(false);

    // 2) LÓGICA (Act)
    await loginUser(req, res);

    // 3) VERIFICACIÓN (Assert)
    expect(compare).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid email or password',
    });
  });

  // ============================================================================
  // 7) loginUser - login exitoso -> 200, token y log
  // ============================================================================
  test('7) loginUser - login exitoso devuelve 200 y token', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      body: {
        email: 'user@example.com',
        password: 'Password123',
      },
      headers: {
        'x-forwarded-for': '1.2.3.4',
        'user-agent': 'jest-test-agent',
      },
      socket: { remoteAddress: '5.6.7.8' },
    };
    const res = createMockResponse();

    const user = {
      _id: 'user123',
      email: 'user@example.com',
      avatar: 'avatar.png',
      name: 'User Test',
      verified: true,
      roles: [
        { name: 'Admin', permissions: ['CAN_EDIT', 'CAN_VIEW'] },
        { name: 'User', permissions: ['CAN_VIEW'] },
      ],
      generateJWT: jest.fn().mockResolvedValue('jwt-token-123'),
    };

    User.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(user),
    });

    PasswordHistory.findOne.mockReturnValue({
      sort: jest.fn().mockResolvedValue({ password: 'hashFromHistory' }),
    });

    compare.mockResolvedValue(true);

    // 2) LÓGICA (Act)
    await loginUser(req, res);

    // 3) VERIFICACIÓN (Assert)
    expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(compare).toHaveBeenCalled();
    expect(loginLogs.saveLoginLog).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: 'user123',
        name: 'User Test',
        email: 'user@example.com',
        roles: ['Admin', 'User'],
        permissions: ['CAN_EDIT', 'CAN_VIEW'],
        token: 'jwt-token-123',
      }),
    );
  });

  // ============================================================================
  // 8) getAllUsers - devuelve lista y transforma roles a nombres
  // ============================================================================
  test('8) getAllUsers - responde con usuarios y roles como nombres', async () => {
    // 1) PREPARACIÓN (Arrange)
    const { getAllUsers } = await import('../../controllers/userControllers.js');

    const req = {
      query: {
        searchKeyword: '',
        page: '1',
        limit: '2',
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const userDocs = [
      {
        toObject: () => ({ _id: 'u1', email: 'a@example.com' }),
        roles: [{ name: 'Admin' }],
      },
      {
        toObject: () => ({ _id: 'u2', email: 'b@example.com' }),
        roles: [{ name: 'User' }],
      },
    ];

    const total = 2;

    const queryExec = {
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(userDocs),
    };

    User.find.mockReturnValue(queryExec);
    User.find().countDocuments = jest.fn().mockResolvedValue(total);

    // 2) LÓGICA (Act)
    await getAllUsers(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(User.find).toHaveBeenCalled();
    expect(res.header).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        _id: 'u1',
        email: 'a@example.com',
        roles: ['Admin'],
      }),
      expect.objectContaining({
        _id: 'u2',
        email: 'b@example.com',
        roles: ['User'],
      }),
    ]);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 9) requestPasswordReset - usuario no encontrado -> 404
  // ============================================================================
  test('9) requestPasswordReset - responde 404 si el usuario no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { body: { email: 'noexiste@example.com' } };
    const res = createMockResponse();
    const next = createMockNext();

    User.findOne.mockResolvedValue(null);

    // 2) LÓGICA (Act)
    await requestPasswordReset(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(User.findOne).toHaveBeenCalledWith({ email: 'noexiste@example.com' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario no encontrado',
    });
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 10) verifyResetToken - token inválido o expirado -> 400
  // ============================================================================
  test('10) verifyResetToken - responde 400 si el token es inválido', async () => {
    // 1) PREPARACIÓN (Arrange)
    const { verifyResetToken } = await import('../../controllers/userControllers.js');

    const req = { body: { token: 'invalid-token' } };
    const res = createMockResponse();
    const next = createMockNext();

    // La caché no devuelve email (token inválido o expirado)
    myCache.get.mockReturnValue(undefined);

    // 2) LÓGICA (Act)
    await verifyResetToken(req, res, next);

    // 3) VERIFICACIÓN (Assert)
    expect(myCache.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token inválido o expirado',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
