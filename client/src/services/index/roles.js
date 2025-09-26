// src/services/index/roles.js
import axios from "axios";

/**
 * Obtiene la lista de roles completos desde la API.
 * @param {string} token - Token JWT de autorización.
 * @returns {Promise<Object[]>} Array de objetos de rol { _id, name, description }
 */
export const getAllRoles = async (token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get("/api/roles", config);
    return data; // data es un array de objetos: [{ _id, name, description }, ...]
  } catch (error) {
    if (error.response?.data.message) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const createRole = async (roleData, token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post("/api/roles", roleData, config);
    return data;
  } catch (error) {
    if (error.response?.data.message) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const updateRole = async (roleId, roleData, token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(`/api/roles/${roleId}`, roleData, config);
    return data;
  } catch (error) {
    if (error.response?.data.message) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const deleteRole = async (roleId, token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(`/api/roles/${roleId}`, config);
    return data;
  } catch (error) {
    if (error.response?.data.message) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
