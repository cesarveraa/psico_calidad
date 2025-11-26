// tests/atdd/postCategories.atdd.test.js

import request from "supertest";
import mongoose from "mongoose";

import app from "../../server.js";
import PostCategories from "../../models/PostCategories.js";

jest.setTimeout(30000);

describe("ATDD - Gestión de categorías de posts", () => {
  beforeAll(async () => {
    // Asegurarse de que Mongoose esté conectado
    if (mongoose.connection.readyState === 0) {
      throw new Error("Mongoose no está conectado. Revisa connectDB().");
    }
  });

  beforeEach(async () => {
    await PostCategories.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("ATDD-PCAT-001 Crear categoría de post exitosamente", async () => {
    // 1) PREPARACIÓN
    const nuevaCategoria = { title: "Ansiedad académica" };

    // 2) EJECUCIÓN
    const res = await request(app)
      .post("/api/post-categories")
      .send(nuevaCategoria);

    // 3) VERIFICACIÓN
    expect(res.status).toBe(201); // Created
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Ansiedad académica");

    const categoriaEnBD = await PostCategories.findOne({
      title: "Ansiedad académica",
    });
    expect(categoriaEnBD).not.toBeNull();
  });

  test("ATDD-PCAT-002 No permite crear categoría duplicada", async () => {
    // 1) PREPARACIÓN
    await PostCategories.create({ title: "Depresión" });

    const payloadDuplicado = { title: "Depresión" };

    // 2) EJECUCIÓN
    const res = await request(app)
      .post("/api/post-categories")
      .send(payloadDuplicado);

    // 3) VERIFICACIÓN
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);

    const message = (res.body?.message || res.text || "").toLowerCase();
    expect(message).toMatch(/already created|exist|ya existe/);

    const categorias = await PostCategories.find({ title: "Depresión" });
    expect(categorias.length).toBe(1);
  });

  test("ATDD-PCAT-003 Eliminar categoría correctamente", async () => {
    // 1) PREPARACIÓN
    const categoria = await PostCategories.create({
      title: "Orientación vocacional",
    });

    const id = categoria._id.toString();

    // 2) EJECUCIÓN
    const res = await request(app).delete(`/api/post-categories/${id}`);

    // 3) VERIFICACIÓN
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);

    const categoriaEnBD = await PostCategories.findById(id);
    expect(categoriaEnBD).toBeNull();
  });
});
