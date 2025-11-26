/**
 * postsTests.test.js
 *
 * Suite de pruebas unitarias para:
 * - Controlador de categorías de posts (PostCategories)
 * - Controlador de posts (Post)
 *
 * Todas las pruebas siguen el patrón AAA:
 * 1) PREPARACIÓN (Arrange)
 * 2) LÓGICA / EJECUCIÓN (Act)
 * 3) VERIFICACIÓN / ASSERT (Assert)
 */

import PostCategories from '../../models/PostCategories';
import Post from '../../models/Post';
import { fileRemover } from '../../utils/fileRemover';

// CONTROLADORES DE CATEGORÍAS
import {
  createPostCategory,
  getAllPostCategories,
  updatePostCategory,
  deletePostCategory,
  getSingleCategory,
} from '../../controllers/postCategoriesController';

// CONTROLADOR DE POSTS
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  likePost,
  respondToEvent,
} from '../../controllers/postControllers';

// MOCK DE MODELOS Y UTILIDADES
jest.mock('../../models/PostCategories');
jest.mock('../../models/Post');
jest.mock('../../utils/fileRemover');

// Helpers para simular res y next
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res); // 👈 AÑADIR ESTO
  return res;
};

const createMockNext = () => jest.fn();

describe('postsTests - Pruebas unitarias de categorías y posts (AAA)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // 1) createPostCategory - crea una categoría nueva (201)
  // ============================================================================
  test('1) createPostCategory - crea una categoría nueva cuando no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { body: { title: 'Eventos' } };
    const res = createMockResponse();
    const next = createMockNext();

    // No existe todavía una categoría con ese título
    PostCategories.findOne.mockResolvedValueOnce(null);

    const savedCategory = { _id: 'cat1', title: 'Eventos' };

    // new PostCategories(...) + save()
    PostCategories.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedCategory),
    }));

    // 2) LÓGICA (Act)
    await createPostCategory(req, res, next);

    // 3) ASSERT
    expect(PostCategories.findOne).toHaveBeenCalledWith({ title: 'Eventos' });
    expect(PostCategories).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedCategory);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 2) createPostCategory - devuelve error si la categoría ya existe
  // ============================================================================
  test('2) createPostCategory - llama a next(error) si la categoría ya existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { body: { title: 'Eventos' } };
    const res = createMockResponse();
    const next = createMockNext();

    PostCategories.findOne.mockResolvedValueOnce({ _id: 'cat1', title: 'Eventos' });

    // 2) LÓGICA (Act)
    await createPostCategory(req, res, next);

    // 3) ASSERT
    expect(PostCategories.findOne).toHaveBeenCalledWith({ title: 'Eventos' });
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Category is already created!');
    expect(res.status).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 3) getSingleCategory - devuelve la categoría si existe
  // ============================================================================
  test('3) getSingleCategory - devuelve la categoría cuando existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { postCategoryId: 'cat1' } };
    const res = createMockResponse();
    const next = createMockNext();

    const category = { _id: 'cat1', title: 'Noticias' };
    PostCategories.findById.mockResolvedValueOnce(category);

    // 2) LÓGICA (Act)
    await getSingleCategory(req, res, next);

    // 3) ASSERT
    expect(PostCategories.findById).toHaveBeenCalledWith('cat1');
    expect(res.json).toHaveBeenCalledWith(category);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 4) getSingleCategory - llama a next(error) si no existe
  // ============================================================================
  test('4) getSingleCategory - llama a next(error) cuando la categoría no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { postCategoryId: 'catX' } };
    const res = createMockResponse();
    const next = createMockNext();

    PostCategories.findById.mockResolvedValueOnce(null);

    // 2) LÓGICA (Act)
    await getSingleCategory(req, res, next);

    // 3) ASSERT
    expect(PostCategories.findById).toHaveBeenCalledWith('catX');
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Category was not found!');
    expect(res.json).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 5) getAllPostCategories - devuelve lista paginada
  // ============================================================================
  test('5) getAllPostCategories - devuelve categorías paginadas', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      query: {
        searchKeyword: '',
        page: '1',
        limit: '2',
      },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const categories = [
      { _id: 'c1', title: 'Noticias' },
      { _id: 'c2', title: 'Eventos' },
    ];
    const total = 2;

    const queryExec = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(categories),
      countDocuments: jest.fn().mockResolvedValue(total),
    };

    PostCategories.find.mockReturnValue(queryExec);

    // 2) LÓGICA (Act)
    await getAllPostCategories(req, res, next);

    // 3) ASSERT
    expect(PostCategories.find).toHaveBeenCalled();
    expect(res.header).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(categories);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 6) updatePostCategory - llama a next(error) si no encuentra la categoría
  // ============================================================================
  test('6) updatePostCategory - llama a next(error) si la categoría no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      params: { postCategoryId: 'catX' },
      body: { title: 'Nuevo título' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    PostCategories.findByIdAndUpdate.mockResolvedValueOnce(null);

    // 2) LÓGICA (Act)
    await updatePostCategory(req, res, next);

    // 3) ASSERT
    expect(PostCategories.findByIdAndUpdate).toHaveBeenCalledWith(
      'catX',
      { title: 'Nuevo título' },
      { new: true },
    );
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Category was not found');
  });

  // ============================================================================
  // 7) deletePostCategory - elimina categoría y la quita de los posts
  // ============================================================================
  test('7) deletePostCategory - actualiza posts y elimina la categoría', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { postCategoryId: 'cat1' } };
    const res = createMockResponse();
    const next = createMockNext();

    Post.updateMany.mockResolvedValueOnce({});
    PostCategories.deleteOne.mockResolvedValueOnce({});

    // 2) LÓGICA (Act)
    await deletePostCategory(req, res, next);

    // 3) ASSERT
    expect(Post.updateMany).toHaveBeenCalledWith(
      { categories: { $in: ['cat1'] } },
      { $pull: { categories: 'cat1' } },
    );
    expect(PostCategories.deleteOne).toHaveBeenCalledWith({ _id: 'cat1' });
    expect(res.json || res.send).toBeDefined();
    // Como el controlador usa res.send, validamos ambas posibilidades:
    const sendOrJson =
      res.send?.mock.calls.length ? res.send : res.json;
    expect(sendOrJson).toHaveBeenCalledWith({
      message: 'Post category is successfully deleted!',
    });
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 8) createPost - crea un post con datos por defecto
  // ============================================================================
  test('8) createPost - crea un post nuevo y lo devuelve', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { user: { _id: 'user123' } };
    const res = createMockResponse();
    const next = createMockNext();

    const createdPost = {
      _id: 'post1',
      title: 'título de muestra',
      caption: 'sample caption',
      slug: 'slug-generado',
      body: { type: 'doc', content: [] },
      photo: '',
      user: 'user123',
    };

    // new Post(...) + save()
    Post.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(createdPost),
    }));

    // 2) LÓGICA (Act)
    await createPost(req, res, next);

    // 3) ASSERT
    expect(Post).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(createdPost);
    expect(next).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 9) deletePost - llama a next(error) si el post no existe
  // ============================================================================
  test('9) deletePost - llama a next(error) si el post no existe', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = { params: { slug: 'post-inexistente' } };
    const res = createMockResponse();
    const next = createMockNext();

    Post.findOneAndDelete.mockResolvedValueOnce(null);

    // 2) LÓGICA (Act)
    await deletePost(req, res, next);

    // 3) ASSERT
    expect(Post.findOneAndDelete).toHaveBeenCalledWith({
      slug: 'post-inexistente',
    });
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Post was not found');
    expect(fileRemover).not.toHaveBeenCalled();
  });

  // ============================================================================
  // 10) likePost - agrega like cuando el usuario no ha dado like antes
  // ============================================================================
  test('10) likePost - agrega like si el usuario no ha dado like antes', async () => {
    // 1) PREPARACIÓN (Arrange)
    const req = {
      params: { slug: 'post-1' },
      user: { _id: 'user123' },
    };
    const res = createMockResponse();
    const next = createMockNext();

    const post = {
      slug: 'post-1',
      likes: 0,
      likedBy: [],
      save: jest.fn().mockResolvedValue(true),
    };

    Post.findOne.mockResolvedValueOnce(post);

    // 2) LÓGICA (Act)
    await likePost(req, res, next);

    // 3) ASSERT
    expect(Post.findOne).toHaveBeenCalledWith({ slug: 'post-1' });
    expect(post.likes).toBe(1);
    expect(post.likedBy).toContain('user123');
    expect(post.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(post);
    expect(next).not.toHaveBeenCalled();
  });
});
