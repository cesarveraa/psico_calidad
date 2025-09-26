import axios from "axios";

// Crear un nuevo Area
export const createArea = async (newArea, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };

    const { data } = await axios.post(`/api/areas`, newArea, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener todos los Areas
export const getAreas = async () => {
  try {
    const { data } = await axios.get(`/api/areas`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener un Area por ID
export const getSingleArea = async (id) => {
    try {
      const { data } = await axios.get(`/api/areas/${id}`);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message)
        throw new Error(error.response.data.message);
      throw new Error(error.message);
    }
  };
// Actualizar un Area
export const updateArea = async (id, updatedData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };

    const { data } = await axios.put(`/api/areas/${id}`, updatedData, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Eliminar un Area
export const deleteArea = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.delete(`/api/areas/${id}`, config);
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
