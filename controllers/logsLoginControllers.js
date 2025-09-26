import LogsLogin from "../models/LogsLogin.js";

export const saveLoginLog = async ({ userId, email, ip, userAgent }) => {
  try {
    await LogsLogin.create({ userId, email, ip, userAgent });
  } catch (error) {
    console.error("❌ Error al guardar log de login:", error.message);
  }
};
// Registrar un nuevo log de inicio de sesión
export const createLoginLog = async (req, res, next) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const ip = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0]
      : req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const log = await LogsLogin.create({ userId, email, ip, userAgent });

    res.status(201).json({ message: "Log registrado", log });
  } catch (error) {
    console.error("❌ Error al guardar log de login (API):", error.message);
    next(error);
  }
};

// Obtener todos los logs de un usuario (por seguridad: solo roles autorizados deberían acceder)
export const getLogsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const logs = await LogsLogin.find({ userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los logs del sistema (requiere permisos elevados)
export const getAllLogs = async (req, res, next) => {
  try {
    const logs = await LogsLogin.find()
      .populate("userId", "name email userID")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
