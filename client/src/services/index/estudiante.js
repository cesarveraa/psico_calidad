import axios from "axios";

const BASE_URL = "http://localhost:5000/api/estudiantes";

export const getAllEstudiantes = async (searchKeyword = "", page = 1, limit = 10) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/estudiantes`);
    console.log(data); // Opcional, para depuración
    return { data };
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export const getEstudiante = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/estudiantes/${id}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteEstudiante = async ({ id, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`${BASE_URL}/estudiantes/${id}`, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateEstudiante = async ({ updatedData, id, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.put(`${BASE_URL}/estudiantes/${id}`, updatedData, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createEstudiante = async ({ estudianteData, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const { data } = await axios.post(`${BASE_URL}/estudiantes`, estudianteData, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};
