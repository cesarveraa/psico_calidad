import axios from 'axios';

// Configuración común para las solicitudes
const config = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

// Crear un nuevo producto
export const createProduct = async (productData, token) => {
  try {
    const { data } = await axios.post('/api/products/products', productData, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const { data } = await axios.get('/api/products/products');
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener un solo producto por ID
export const getProductById = async (id) => {
  try {
    const { data } = await axios.get(`/api/products/products/${id}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Actualizar un producto existente
export const updateProduct = async (id, updatedData, token) => {
  try {
    const { data } = await axios.put(`/api/products/products/${id}`, updatedData, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Eliminar un producto
export const deleteProduct = async (id, token) => {
  try {
    const { data } = await axios.delete(`/api/products/products/${id}`, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
