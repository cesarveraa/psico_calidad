// src/controllers/passwordHistoryController.js
import PasswordHistory from "../models/PasswordHistory.js";
import { hash } from "bcryptjs";

/**
 * GET /api/passwords/:userId
 */
export const getPasswordHistoryController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const history = await PasswordHistory.find({ user: userId })
      .select("password createdAt -_id")
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/passwords
 */
export const addPasswordHistoryController = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    // Hasheamos la contraseña antes de guardarla
    const hashed = await hash(password, 10);
    await PasswordHistory.create({ user: userId, password: hashed });
    res.status(201).json({ message: "Historial actualizado" });
  } catch (err) {
    next(err);
  }
};
export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    // 1) Verifica el resetToken y extrae el userId
    const payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const userId = payload.id;

    // 2) Obtén las últimas 5 contraseñas
    const recent = await PasswordHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('password');

    // 3) Comprueba reutilización
    for (const entry of recent) {
      const match = await compare(newPassword, entry.password);
      if (match) {
        return res.status(400).json({
          message: 'No puedes usar ninguna de tus últimas 5 contraseñas'
        });
      }
    }

    // 4) Si pasa, actualiza la contraseña del usuario
    const hashed = await hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });

    // 5) Añade la nueva al historial
    await PasswordHistory.create({ user: userId, password: hashed });

    res.json({ message: 'Contraseña restablecida con éxito' });
  } catch (err) {
    next(err);
  }
};