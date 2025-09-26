import LogsSistema from "../models/LogsSistema.js";

// ✅ Función utilitaria para guardar logs del sistema (uso interno)
export const saveSystemLog = async ({ userId, email, sistema, accion = "Sin acción registrada", ip, userAgent }) => {
  try {
    await LogsSistema.create({ userId, email, sistema, accion, ip, userAgent });
  } catch (error) {
    console.error("❌ Error al guardar log de sistema:", error.message);
  }
};

// ✅ API pública para registrar logs desde el frontend (requiere token)
export const createSystemLog = async (req, res, next) => {
  try {
    const { userId, email, sistema, accion } = req.body;

    if (!userId || !email || !sistema) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const ip = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0]
      : req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const log = await LogsSistema.create({
      userId,
      email,
      sistema,
      accion: accion || "Sin acción registrada",
      ip,
      userAgent,
    });

    res.status(201).json({ message: "Log de sistema registrado", log });
  } catch (error) {
    console.error("❌ Error al registrar log del sistema (API):", error.message);
    next(error);
  }
};

// ✅ Obtener todos los logs del sistema (solo roles autorizados)
export const getAllSystemLogs = async (req, res, next) => {
  try {
    const logs = await LogsSistema.find()
      .populate("userId", "name email userID")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// ✅ Obtener los logs de un usuario específico
export const getSystemLogsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const logs = await LogsSistema.find({ userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
