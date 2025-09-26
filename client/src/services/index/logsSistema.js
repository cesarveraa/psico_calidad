// src/services/index/logsSistema.js
import axios from "axios";

// Crear un nuevo log del sistema (cuando un usuario accede o realiza acciones)
export const createSystemLog = async ({ userId, email, sistema, accion }, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const { data } = await axios.post("/api/logsSistema/create", {
        userId,
        email,
        sistema,
        accion,
      }, config);
  
      return data;
    } catch (error) {
      console.error("❌ Error al registrar log del sistema:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  };
  
// Obtener todos los logs del sistema (admin)
export const getAllSystemLogs = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get("/api/logsSistema", config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Obtener los logs del sistema de un usuario específico
export const getSystemLogsByUser = async ({ userId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`/api/logsSistema/user/${userId}`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

