// src/services/index/users.js
import axios from "axios";

// 1. Solicitar cambio de contraseña: envía email con token corto
export const requestPasswordReset = async (email) => {
  try {
    const { data } = await axios.post(
      "/api/users/requestPasswordReset",
      { email }
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 2. Verificar token de reseteo: recibe token corto y devuelve { resetToken, userId }
export const verifyResetToken = async (token) => {
  try {
    const { data } = await axios.post(
      "/api/users/verifyResetToken",
      { token }
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const resetPassword = async (arg1, arg2) => {
  try {
    // Permitir tanto resetPassword(token, newPassword)
    // como resetPassword({ resetToken, newPassword })
    let token, password;
    if (typeof arg1 === 'object') {
      token = arg1.resetToken;
      password = arg1.newPassword;
    } else {
      token = arg1;
      password = arg2;
    }
    const payload = { token, password };
    const { data } = await axios.post("/api/users/resetPassword", payload);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};


// 4. Registro de usuario
export const signup = async ({ name, email, password, sexo, roles, ci }) => {
  try {
    const { data } = await axios.post(
      "/api/users/register",
      { name, email, password, sexo, roles, ci }
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 5. Login
export const login = async ({ email, password }) => {
  try {
    const { data } = await axios.post(
      "/api/users/login",
      { email, password }
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 6. Obtener perfil de usuario
export const getUserProfile = async ({ token }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get(
      "/api/users/profile",
      config
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 7. Actualizar perfil
export const updateProfile = async ({ token, userData, userId }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.put(
      `/api/users/updateProfile/${userId}`,
      userData,
      config
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 8. Actualizar avatar
export const updateProfilePicture = async ({ token, formData }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(
      "/api/users/updateProfilePicture",
      formData,
      config
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 9. Listar usuarios con paginación y búsqueda
export const getAllUsers = async (
  token,
  searchKeyword = "",
  page = 1,
  limit = 10
) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data, headers } = await axios.get(
      `/api/users?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`,
      config
    );
    return { data, headers };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 10. Eliminar usuario
export const deleteUser = async ({ slug, token }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.delete(
      `/api/users/${slug}`,
      config
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 11. Crear nuevo usuario (desde admin)
export const createUser = async ({ token, userData }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(
      "/api/users/register",
      userData,
      config
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 12. Guardar horarios de usuario
export const saveUsersSchedules = async ({ userId, schedules, token }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(
      "/api/users/saveSchedules",
      { schedules },
      config
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// 13. Cambiar contraseña autenticado
export const changePassword = async ({ token, currentPassword, newPassword }) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.post(
      "/api/users/change-password",
      { currentPassword, newPassword },
      config
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
