import axios from 'axios';

// Configuración común para las solicitudes
const config = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

// Crear una nueva forma de pago
export const createFormaPago = async (formaPagoData, token) => {
  try {
    const { data } = await axios.post('/api/formaPago/formaspago', formaPagoData, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener todas las formas de pago
export const getAllFormaPago = async () => {
  try {
    const { data } = await axios.get('/api/formaPago/formaspago');
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Obtener una sola forma de pago por ID
export const getFormaPagoById = async (id) => {
  try {
    const { data } = await axios.get(`/api/formaPago/formaspago/${id}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Actualizar una forma de pago existente
export const updateFormaPago = async (id, updatedData, token) => {
  try {
    const { data } = await axios.put(`/api/formaPago/formaspago/${id}`, updatedData, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

// Eliminar una forma de pago
export const deleteFormaPago = async (id, token) => {
  try {
    const { data } = await axios.delete(`/api/formaPago/formaspago/${id}`, config(token));
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
