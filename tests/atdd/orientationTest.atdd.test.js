// tests/atdd/orientationTest.atdd.test.js

import request from "supertest";
import mongoose from "mongoose";
import app from "../../server.js";

jest.setTimeout(30000);

describe("ATDD - Test vocacional / orientación de carrera (SCE)", () => {
  let token;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      throw new Error("Mongoose no está conectado. Revisa connectDB().");
    }

    // 1) PREPARACIÓN GLOBAL: crear usuario y obtener token
    const email = `sce+${Date.now()}@test.com`;
    const password = "Password123!";

    await request(app).post("/api/users/register").send({
      name: "Estudiante SCE",
      email,
      password,
      role: "student",
    });

    const loginRes = await request(app).post("/api/users/login").send({
      email,
      password,
    });

    const body = loginRes.body || {};
    token =
      body.token || body.accessToken || body.jwt || body.data?.token || null;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const withAuth = (req) =>
    token ? req.set("Authorization", `Bearer ${token}`) : req;

  test("ATDD-TEST-001 Obtener preguntas del test vocacional", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    // (El usuario y el token ya fueron creados en beforeAll)

    // 2) LÓGICA DE LA PRUEBA
    // ⚠️ Ajusta la ruta según lo que tengas en sceRoutes
    const res = await withAuth(request(app).get("/api/sce/questions"));

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 200 OK
    //    - Devuelve un arreglo de preguntas con id, questionText y options
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const q = res.body[0];
      expect(q).toHaveProperty("id");
      expect(q).toHaveProperty("questionText");
      expect(q).toHaveProperty("options");
      expect(Array.isArray(q.options)).toBe(true);
    }
  });

  test("ATDD-TEST-002 Guardar respuestas y generar resultado", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    // Obtener preguntas para construir respuestas dummy
    const preguntasRes = await withAuth(
      request(app).get("/api/sce/questions")
    );
    const preguntas = Array.isArray(preguntasRes.body)
      ? preguntasRes.body
      : [];

    const answers = preguntas.slice(0, 5).map((q, idx) => ({
      questionId: q.id || q._id || idx + 1,
      optionId: q.options?.[0]?.id || q.options?.[0]?._id || "A",
    }));

    // 2) LÓGICA DE LA PRUEBA
    const submitRes = await withAuth(
      request(app).post("/api/sce/submit").send({ answers })
    );

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 200 OK
    //    - Devuelve área principal, puntajes y carreras sugeridas
    expect(submitRes.status).toBe(200);

    const body = submitRes.body || {};
    expect(body).toHaveProperty("mainArea");
    expect(body).toHaveProperty("scores");
    expect(body).toHaveProperty("suggestedCareers");
  });

  test("ATDD-TEST-003 Consultar historial de resultados vocacionales", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    // (Se asume que el usuario ya ha hecho al menos un submit
    //  en la prueba anterior; si no, la lista podría venir vacía)

    // 2) LÓGICA DE LA PRUEBA
    const res = await withAuth(request(app).get("/api/sce/history"));

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 200 OK
    //    - Devuelve un arreglo de resultados
    //    - Cada resultado tiene fecha, área principal y puntajes
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      const r = res.body[0];
      expect(r).toHaveProperty("date");
      expect(r).toHaveProperty("mainArea");
      expect(r).toHaveProperty("scores");
    }
  });
});
