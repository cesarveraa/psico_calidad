import axios from 'axios';

// Configuración común para las solicitudes
const config = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Crear una nueva categoría
export const createCategory = async (categoryData, token) => {
  try {
    const { data } = await axios.post('/api/products/categories/categories', categoryData, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener todas las categorías
export const getAllCategories = async () => {
  try {///api/products/categories
    const { data } = await axios.get('/api/products/categories/categories');
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (id) => {
  try {
    const { data } = await axios.get(`/api/products/categories/categories/${id}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Actualizar una categoría existente
export const updateCategory = async (id, updatedData, token) => {
  try { 
    const { data } = await axios.put(`/api/products/categories/categories/${id}`, updatedData, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Eliminar una categoría
export const deleteCategory = async (id, token) => {
  try {
    const { data } = await axios.delete(`/api/products/categories/categories/${id}`, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
