// tests/atdd/posts.atdd.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../../server";
import Post from "../../models/Post";

describe("ATDD - Gestión de posts", () => {
  // Limpieza básica antes de toda la suite
  beforeAll(async () => {
    await Post.deleteMany({});
  });

  // Limpieza básica al terminar (sin cerrar la conexión global)
  afterAll(async () => {
    await Post.deleteMany({});
  });

  test("ATDD-POST-001 Listar posts paginados", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    //    - Limpiar colección de posts
    //    - Crear 3 posts de ejemplo directamente en la BD
    await Post.deleteMany({});

    const dummyUserId = new mongoose.Types.ObjectId();
    await Post.create([
      {
        title: "Post 1 - Orientación Ingeniería",
        caption: "Caption 1",
        slug: "post-1-orientacion-ingenieria",
        body: { type: "doc", content: [] },
        photo: "",
        user: dummyUserId,
      },
      {
        title: "Post 2 - Orientación Psicología",
        caption: "Caption 2",
        slug: "post-2-orientacion-psicologia",
        body: { type: "doc", content: [] },
        photo: "",
        user: dummyUserId,
      },
      {
        title: "Post 3 - Orientación Medicina",
        caption: "Caption 3",
        slug: "post-3-orientacion-medicina",
        body: { type: "doc", content: [] },
        photo: "",
        user: dummyUserId,
      },
    ]);

    // 2) LÓGICA DE LA PRUEBA
    //    - Consumir el endpoint GET /api/posts con paginación
    //    - limit=2, page=1
    const res = await request(app)
      .get("/api/posts?limit=2&page=1")
      .expect("Content-Type", /json/);

    // 3) VERIFICACIÓN / ASSERT
    //    - Respuesta 200 OK
    //    - Devuelve un array de máximo 2 elementos
    //    - Cada elemento tiene al menos title y slug
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(2);

    if (res.body.length > 0) {
      for (const post of res.body) {
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("slug");
      }
    }
  });

  test("ATDD-POST-002 Listar posts filtrando por palabra clave (searchKeyword)", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    //    - Limpiar colección
    //    - Crear 3 posts con títulos distintos
    await Post.deleteMany({});

    const dummyUserId = new mongoose.Types.ObjectId();

    const postA = await Post.create({
      title: "Guía para Ingeniería de Sistemas",
      caption: "Solo Ingeniería",
      slug: "post-a-ingenieria",
      body: { type: "doc", content: [] },
      photo: "",
      user: dummyUserId,
    });

    const postB = await Post.create({
      title: "Tips para estudiar Psicología",
      caption: "Solo Psicología",
      slug: "post-b-psicologia",
      body: { type: "doc", content: [] },
      photo: "",
      user: dummyUserId,
    });

    const postC = await Post.create({
      title: "¿Ingeniería o Psicología? Cómo decidir",
      caption: "Ambas carreras",
      slug: "post-c-ingenieria-psicologia",
      body: { type: "doc", content: [] },
      photo: "",
      user: dummyUserId,
    });

    // 2) LÓGICA DE LA PRUEBA
    //    - Consumir GET /api/posts?searchKeyword=Ingeniería
    const res = await request(app)
      .get("/api/posts?searchKeyword=Ingeniería")
      .expect("Content-Type", /json/);

    // 3) VERIFICACIÓN / ASSERT
    //    - Respuesta 200 OK
    //    - Todos los posts devueltos contienen "ingeniería" en el título (case-insensitive)
    //    - Al menos aparecen postA y/o postC
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const titles = res.body.map((p) => p.title);

    // Verificamos que haya por lo menos un resultado
    expect(titles.length).toBeGreaterThan(0);

    // Debe devolver posts relacionados con "Ingeniería"
    const tieneIngenieria = titles.some((t) =>
      t.toLowerCase().includes("ingeniería")
    );
    expect(tieneIngenieria).toBe(true);

    // Y NO es obligatorio que devuelva el post solo de Psicología
    // (puede o no devolverlo según el filtro, pero los que están
    // deben contener la keyword)
    for (const t of titles) {
      expect(t.toLowerCase()).toContain("ingeniería");
    }
  });

  test("ATDD-POST-003 Obtener el detalle de un post por slug", async () => {
    // 1) PREPARACIÓN DE LA PRUEBA
    //    - Limpiar colección
    //    - Crear un post con un slug conocido
    await Post.deleteMany({});

    const dummyUserId = new mongoose.Types.ObjectId();
    const slug = "test-detalle-post-vocacional";

    const createdPost = await Post.create({
      title: "Detalle de un post vocacional",
      caption: "Detalle",
      slug,
      body: { type: "doc", content: [] },
      photo: "",
      user: dummyUserId,
    });

    // 2) LÓGICA DE LA PRUEBA
    //    - Consumir GET /api/posts/:slug
    const res = await request(app)
      .get(`/api/posts/${slug}`)
      .expect("Content-Type", /json/);

    // 3) VERIFICACIÓN / ASSERT
    //    - Respuesta 200 OK
    //    - El cuerpo contiene el mismo slug y título
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.slug).toBe(slug);
    expect(res.body.title).toBe(createdPost.title);
  });
});
