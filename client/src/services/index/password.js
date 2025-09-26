// src/services/index/users.js
import axios from "axios";

/**
 * Solicita envío de correo de restablecimiento
 * @param {string} email
 */
export const requestPasswordReset = async (email) => {
  const { data } = await axios.post("/api/auth/request-password-reset", { email });
  return data;
};

/**
 * Verifica el código de restablecimiento
 * @param {string} code
 * @returns {{ resetToken: string, userId: string }}
 */
export const verifyResetToken = async (code) => {
  const { data } = await axios.post("/api/auth/verify-reset-token", { token: code });
  return data;
};

/**
 * Restablece la contraseña (backend valida últimas 5)
 * @param {{ resetToken: string, newPassword: string, userId: string }} payload
 */
export const resetPassword = async ({ resetToken, newPassword, userId }) => {
  const { data } = await axios.post(
    "/api/auth/reset-password",
    { resetToken, newPassword, userId }
  );
  return data;
};

// src/services/index/password.js


/**
 * GET /api/passwords/:userId
 * @param {{ token: string, userId: string }} args
 * @returns {Promise<Array<{ password: string, createdAt: string }>>}
 */
export const getPasswordHistory = async ({ token, userId }) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const { data } = await axios.get(`/api/passwords/${userId}`, config);
  return data;
};

/**
 * POST /api/passwords
 * @param {{ token: string, userId: string, password: string }} args
 */
export const addPasswordHistory = async ({ token, userId, password }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const payload = { userId, password };
  const { data } = await axios.post(`/api/passwords`, payload, config);
  return data;
};
