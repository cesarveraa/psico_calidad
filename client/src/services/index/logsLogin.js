import axios from "axios";

// 1. Obtener todos los logs del sistema (solo para admins)
export const getAllLoginLogs = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get("/api/logs", config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 2. Obtener los logs de un usuario específico
export const getLoginLogsByUser = async ({ userId, token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(`/api/logs/${userId}`, config);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const createLoginLog = async ({ userId, email }) => {
    try {
      const { data } = await axios.post("/api/logs/create", {
        userId,
        email,
      });
      return data;
    } catch (error) {
      console.error("❌ Error al registrar log de login:", error.message);
      // No se lanza error para evitar interrumpir el login
    }
  };