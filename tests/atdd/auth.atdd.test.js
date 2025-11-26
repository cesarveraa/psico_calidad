// tests/atdd/auth.atdd.test.js

import request from "supertest";
import mongoose from "mongoose";
import app from "../../server.js";

import User from "../../models/User.js";
import Role from "../../models/Roles.js";
import PasswordHistory from "../../models/PasswordHistory.js";

jest.setTimeout(30000);

describe("ATDD - Autenticación de usuarios", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      throw new Error("Mongoose no está conectado. Revisa connectDB().");
    }
  });

  beforeEach(async () => {
    // Limpiamos usuarios e historial de contraseñas
    await User.deleteMany({});
    await PasswordHistory.deleteMany({});

    // Aseguramos que exista el rol por defecto "Estudiante"
    const existing = await Role.findOne({ name: "Estudiante" });
    if (!existing) {
      await Role.create({
        name: "Estudiante",
        permissions: [], // ajusta si tu schema tiene algo más requerido
      });
    }
  });

  // No cerramos la conexión aquí para no romper otras suites
  afterAll(async () => {
    // opcionalmente podrías hacer algún cleanup suave,
    // pero sin cerrar mongoose.connection
  });

  test("ATDD-AUTH-001 Registro exitoso de nuevo usuario estudiante", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const email = `estudiante+${Date.now()}@test.com`;

    const payload = {
      name: "Estudiante Prueba",
      email,
      password: "Password123!",
      sexo: "M",      // requerido por registerUser
      ci: "123456",   // requerido por registerUser
      // NO mandamos roles para que tome el rol por defecto "Estudiante"
    };

    // 2) LÓGICA DE LA PRUEBA
    const res = await request(app).post("/api/users/register").send(payload);

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 201 (Created)
    //    - Devuelve el email y el rol "Estudiante"
    expect(res.status).toBe(201);

    const body = res.body || {};
    const returnedEmail = body.email;
    expect(returnedEmail).toBe(email);

    expect(body).toHaveProperty("roles");
    expect(Array.isArray(body.roles)).toBe(true);
    expect(body.roles).toContain("Estudiante");
  });

  test("ATDD-AUTH-002 Inicio de sesión con credenciales válidas", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const email = `login+${Date.now()}@test.com`;
    const password = "Password123!";

    // Registramos primero al usuario con los campos que exige registerUser
    await request(app).post("/api/users/register").send({
      name: "Usuario Login",
      email,
      password,
      sexo: "F",
      ci: "654321",
    });

    // 2) LÓGICA DE LA PRUEBA
    const res = await request(app).post("/api/users/login").send({
      email,
      password,
    });

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 200 OK
    //    - Devuelve un token válido
    expect(res.status).toBe(200);

    const body = res.body || {};
    const token =
      body.token || body.accessToken || body.jwt || body.data?.token;

    expect(token).toBeDefined();
    expect(body.email).toBe(email.toLowerCase());
  });

  test("ATDD-AUTH-003 Denegar inicio de sesión con contraseña incorrecta", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const email = `login-wrong+${Date.now()}@test.com`;
    const passwordCorrecto = "Password123!";
    const passwordIncorrecto = "PasswordMala!";

    // Registramos usuario con contraseña correcta
    await request(app).post("/api/users/register").send({
      name: "Usuario Contraseña Incorrecta",
      email,
      password: passwordCorrecto,
      sexo: "M",
      ci: "999999",
    });

    // 2) LÓGICA DE LA PRUEBA
    // Intentar login con contraseña incorrecta
    const res = await request(app).post("/api/users/login").send({
      email,
      password: passwordIncorrecto,
    });

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 400 (credenciales inválidas)
    //    - Mensaje de credenciales inválidas
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const message = (res.body?.message || res.text || "").toLowerCase();
    expect(message).toMatch(/invalid email or password|email not found/);
  });
});
