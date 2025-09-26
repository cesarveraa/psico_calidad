import User from "../models/User.js";
import Role from "../models/Roles.js";
import Dashboard from "../models/Dashboard.js";
import PasswordHistory from "../models/PasswordHistory.js";
import { compare, hash } from "bcryptjs";

// Registro de usuario (POST /api/users/register)
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, sexo, roles: reqRoles, ci } = req.body;

    // ➊ Validar duplicados y roles
    if (await User.findOne({ email })) {
      throw new Error("El usuario ya está registrado");
    }
    let rolesToAssign;
    if (Array.isArray(reqRoles) && reqRoles.length) {
      const found = await Role.find({ name: { $in: reqRoles } });
      if (found.length !== reqRoles.length) throw new Error("Roles inválidos");
      rolesToAssign = found;
    } else {
      const defaultRole = await Role.findOne({ name: "Estudiante" });
      if (!defaultRole) throw new Error("Rol 'Estudiante' no encontrado");
      rolesToAssign = [defaultRole];
    }

    // ➋ Crear usuario (el pre('save') de User ya hashea)
    const user = await User.create({
      name,
      email,
      password,
      sexo,
      ci,
      roles: rolesToAssign.map(r => r._id),
    });

    // ➌ Guardar el hash inicial en el historial
    await PasswordHistory.create({
      user: user._id,
      password: user.password
    });

    // ➍ Actualizar métricas del dashboard
    let dash = await Dashboard.findOne() || new Dashboard({ estudiantesPorSexo: [] });
    dash.nuevosUsuarios = (dash.nuevosUsuarios || 0) + 1;
    const entry = dash.estudiantesPorSexo.find(e => e.sexo === sexo);
    if (entry) entry.valor++;
    else dash.estudiantesPorSexo.push({ sexo, valor: 1 });
    await dash.save();

    // ➎ Devolver respuesta
    return res.status(201).json({
      _id:       user._id,
      avatar:    user.avatar,
      name:      user.name,
      sexo:      user.sexo,
      email:     user.email,
      verified:  user.verified,
      roles:     rolesToAssign.map(r => r.name),
      token:     await user.generateJWT(),
      createdAt: user.createdAt      // <- lo necesitas en el front
    });
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token inválido o expirado');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(error);
  }
};
// Cambio de contraseña (POST /api/users/change-password)
export const changePassword = async (req, res, next) => {
  try {
    const userId         = req.user._id;
    const { currentPassword, newPassword } = req.body;
    const user           = await User.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    // ➊ Verificar contraseña actual
    if (!await compare(currentPassword, user.password)) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    // ➋ Traer todo el historial
    const historyHashes = (await PasswordHistory.find({ user: userId }))
                           .map(h => h.password)
                           .concat(user.password);

    // ➌ Comprobar que la nueva NO coincida con ninguna anterior
    for (let old of historyHashes) {
      if (await compare(newPassword, old)) {
        return res
          .status(400)
          .json({ message: "No puedes reutilizar una contraseña anterior" });
      }
    }

    // ➍ Guardar el hash actual en historial
    await PasswordHistory.create({ user: userId, password: user.password });

    // ➎ Actualizar usuario
    user.password = await hash(newPassword, 10);
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    next(err);
  }
};
