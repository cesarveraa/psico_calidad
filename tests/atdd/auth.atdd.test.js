// tests/atdd/auth.atdd.test.js

import request from "supertest";
import mongoose from "mongoose";
import app from "../../server.js";

jest.setTimeout(30000);

describe("ATDD - Autenticación de usuarios", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      throw new Error("Mongoose no está conectado. Revisa connectDB().");
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("ATDD-AUTH-001 Registro exitoso de nuevo usuario estudiante", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const email = `estudiante+${Date.now()}@test.com`;

    const payload = {
      name: "Estudiante Prueba",
      email,
      password: "Password123!",
      role: "student",
    };

    // 2) LÓGICA DE LA PRUEBA
    // ⚠️ Ajusta la ruta si en userRoutes usas otra: p. ej. /api/users/signup
    const res = await request(app).post("/api/users/register").send(payload);

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 200/201
    //    - Devuelve el email del usuario registrado
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const body = res.body || {};
    const returnedEmail = body.email || body.user?.email;
    expect(returnedEmail).toBe(email);
  });

  test("ATDD-AUTH-002 Inicio de sesión con credenciales válidas", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const email = `login+${Date.now()}@test.com`;
    const password = "Password123!";

    // Registramos primero al usuario
    await request(app).post("/api/users/register").send({
      name: "Usuario Login",
      email,
      password,
      role: "student",
    });

    // 2) LÓGICA DE LA PRUEBA
    const res = await request(app).post("/api/users/login").send({
      email,
      password,
    });

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 200
    //    - Devuelve un token válido
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const body = res.body || {};
    const token =
      body.token || body.accessToken || body.jwt || body.data?.token;

    expect(token).toBeDefined();
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
      role: "student",
    });

    // 2) LÓGICA DE LA PRUEBA
    // Intentar login con contraseña incorrecta
    const res = await request(app).post("/api/users/login").send({
      email,
      password: passwordIncorrecto,
    });

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 4xx (401/400)
    //    - Mensaje de credenciales inválidas
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const message = (res.body?.message || res.text || "").toLowerCase();
    expect(message).toMatch(/invalid|incorrecta|credenciales|unauthorized|email not found/);
  });
});
