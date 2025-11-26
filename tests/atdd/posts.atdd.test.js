// tests/atdd/posts.atdd.test.js

import request from "supertest";
import mongoose from "mongoose";

import app from "../../server.js";
import Post from "../../models/Post.js";
import PostCategories from "../../models/PostCategories.js";

jest.setTimeout(30000);

describe("ATDD - Gestión de posts", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      throw new Error("Mongoose no está conectado. Revisa connectDB().");
    }
  });

  beforeEach(async () => {
    await Post.deleteMany({});
    await PostCategories.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("ATDD-POST-001 Crear post orientador exitosamente", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const categoria = await PostCategories.create({
      title: "Ingeniería de Sistemas",
    });

    const payload = {
      title: "¿Es Ingeniería de Sistemas para ti?",
      caption: "Guía para saber si esta carrera es para ti",
      body:
        "Contenido explicando el perfil, habilidades y salidas laborales de Ingeniería de Sistemas...",
      slug: "es-ingenieria-de-sistemas-para-ti",
      categories: [categoria._id],
    };

    // 2) LÓGICA DE LA PRUEBA
    const res = await request(app).post("/api/posts").send(payload);

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - El servidor responde con 200 o 201 (según tu controller)
    //    - El cuerpo contiene un _id y el título enviado
    //    - El post queda guardado en la base de datos
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(payload.title);

    const postEnBD = await Post.findById(res.body._id);
    expect(postEnBD).not.toBeNull();
    expect(postEnBD.title).toBe(payload.title);
  });

  test("ATDD-POST-002 Listar posts filtrando por categoría", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const catIng = await PostCategories.create({
      title: "Ingeniería de Sistemas",
    });
    const catPsico = await PostCategories.create({ title: "Psicología" });

    const postA = await Post.create({
      title: "Post A - solo Ingeniería",
      caption: "Caption A",
      body: "Contenido A",
      slug: "post-a-solo-ingenieria",
      categories: [catIng._id],
    });

    const postB = await Post.create({
      title: "Post B - solo Psicología",
      caption: "Caption B",
      body: "Contenido B",
      slug: "post-b-solo-psicologia",
      categories: [catPsico._id],
    });

    const postC = await Post.create({
      title: "Post C - Ingeniería y Psicología",
      caption: "Caption C",
      body: "Contenido C",
      slug: "post-c-ingenieria-y-psicologia",
      categories: [catIng._id, catPsico._id],
    });

    // 2) LÓGICA DE LA PRUEBA
    // ⚠️ Ajusta el nombre del query param si tu backend usa otro (ej: ?category=)
    const res = await request(app).get(
      `/api/posts?categoryId=${catIng._id.toString()}`
    );

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Respuesta 200 OK
    //    - Solo se devuelven posts que tienen la categoría de Ingeniería
    //    - Incluye A y C, NO incluye B
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const titles = res.body.map((p) => p.title);
    expect(titles).toContain(postA.title);
    expect(titles).toContain(postC.title);
    expect(titles).not.toContain(postB.title);
  });

  test("ATDD-POST-003 No permite crear post sin título", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    const categoria = await PostCategories.create({
      title: "Categoría genérica",
    });

    const payload = {
      title: "",
      caption: "Caption sin título",
      body: "Contenido sin título",
      slug: "post-sin-titulo",
      categories: [categoria._id],
    };

    // 2) LÓGICA DE LA PRUEBA
    const res = await request(app).post("/api/posts").send(payload);

    // 3) VERIFICACIÓN DEL RESULTADO ESPERADO (ASSERT)
    //    - Código de error 4xx
    //    - Mensaje indicando que el título es obligatorio o inválido
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const message = (res.body?.message || res.text || "").toLowerCase();
    expect(message).toMatch(/title.*required|título.*obligatorio|invalid/);
  });
});
