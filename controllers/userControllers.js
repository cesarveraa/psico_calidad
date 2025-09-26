import crypto from 'crypto';
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Comment from "../models/Comment";
import Dashboard from "../models/Dashboard";
import Post from "../models/Post";
import Role from "../models/Roles.js";
import User from "../models/User";

import { compare, hash } from "bcryptjs";
import PasswordHistory from "../models/PasswordHistory.js";

import { sendVerificationEmail } from '../services/resetPasswordMailer';
import { fileRemover } from "../utils/fileRemover";
import { saveLoginLog } from './logsLoginControllers.js';

const myCache = require('../cache'); // Importar la caché



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

// src/controllers/userControllers.js


export const loginUser = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const rawPassword = req.body.password;
    if (!rawEmail || !rawPassword) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const email = String(rawEmail).trim().toLowerCase();
    const password = String(rawPassword);

    const user = await User.findOne({ email }).populate("roles");
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const lastHistory = await PasswordHistory
      .findOne({ user: user._id })
      .sort({ createdAt: -1 });
    if (!lastHistory) {
      return res.status(400).json({ message: "No password registered for this user" });
    }

    const isMatch = await compare(password, lastHistory.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = await user.generateJWT();
    const permissions = [
      ...new Set(user.roles.flatMap((r) => r.permissions || [])),
    ];

    // ✅ Registrar log de inicio de sesión
    await saveLoginLog({
      userId: user._id,
      email: user.email,
      ip: req.headers["x-forwarded-for"]
        ? req.headers["x-forwarded-for"].split(",")[0]
        : req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    return res.status(200).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      roles: user.roles.map((r) => r.name),
      permissions,
      token,
    });
  } catch (err) {
    console.error("🔥  Unexpected login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};





const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id)
      .populate("roles")
      .populate("selectedSchedules.subject")
      .populate("selectedSchedules.schedule");

    if (user) {
      const permissions = [
        ...new Set(user.roles.flatMap(r => r.permissions || []))
      ];

      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        verified: user.verified,
        roles: user.roles.map(r => r.name),
        permissions, // ✅ Agregamos permisos aquí
        selectedSchedules: user.selectedSchedules,
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const userIdToUpdate = req.params.userId;
    const sessionUser = await User.findById(req.user._id).populate("roles");

    const sessionRoles = sessionUser.roles.map(r => r.name);

    if (
      !Array.isArray(sessionRoles) ||
      (!sessionRoles.includes("Seguridad") &&
        sessionUser._id.toString() !== userIdToUpdate)
    ) {
      const err = new Error("Forbidden resource");
      err.statusCode = 403;
      throw err;
    }

    const user = await User.findById(userIdToUpdate).populate("roles");
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    let updatedRoles = user.roles;

    if (Array.isArray(req.body.roles) && sessionRoles.includes("Seguridad")) {
      const foundRoles = await Role.find({ name: { $in: req.body.roles } });
      if (foundRoles.length !== req.body.roles.length) {
        throw new Error("Uno o más roles no válidos");
      }

      user.roles = foundRoles.map(r => r._id);
      updatedRoles = foundRoles;

      // Actualizar userID si cambió el rol principal
      if (foundRoles.length > 0) {
        const now = new Date();
        const year = now.getFullYear();

        // Obtener los primeros 6 dígitos del CI
        let ciPrefix = "000000";
        if (user.ci) {
          ciPrefix = user.ci.toString().substring(0, 6);
        }

        const firstRole = foundRoles[0].name;
        const prefix = firstRole.substring(0, 3).toUpperCase();
        user.userID = `${prefix}${year}-${ciPrefix}`;
      }
    }

    // Actualizar otros campos si vienen en la petición
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.ci = req.body.ci || user.ci;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      avatar: updatedUser.avatar,
      name: updatedUser.name,
      email: updatedUser.email,
      userID: updatedUser.userID,
      verified: updatedUser.verified,
      roles: updatedRoles.map(r => r.name),
      token: await updatedUser.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};


const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occured when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          if (filename) {
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          await updatedUser.save();
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            roles: updatedUser.roles,
            token: await updatedUser.generateJWT(),
          });
        } else {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            roles: updatedUser.roles,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.email = { $regex: filter, $options: "i" };
    }

    let query = User.find(where).populate("roles"); // ✅ importante
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await User.find(where).countDocuments();
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query.skip(skip).limit(pageSize).sort({ updatedAt: "desc" });

    // ✅ transformar roles a nombres para el frontend
    const transformed = result.map(user => ({
      ...user.toObject(),
      roles: user.roles.map(r => r.name),
    }));

    return res.json(transformed);
  } catch (error) {
    next(error);
  }
};


const deleteUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.userId);

    if (!user) {
      throw new Error("User no found");
    }

    const postsToDelete = await Post.find({ user: user._id });
    const postIdsToDelete = postsToDelete.map((post) => post._id);

    await Comment.deleteMany({
      post: { $in: postIdsToDelete },
    });

    await Post.deleteMany({
      _id: { $in: postIdsToDelete },
    });

    postsToDelete.forEach((post) => {
      fileRemover(post.photo);
    });

    await user.remove();
    fileRemover(user.avatar);

    res.status(204).json({ message: "User is deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Almacenar el token cifrado en la caché
    myCache.set(hashedToken, email, 600); // TTL de 10 minutos

    sendVerificationEmail(user, resetToken);

    res.status(200).json({ success: true, message: 'Correo de verificación enviado' });
  } catch (error) {
    next(error);
  }
};

const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Verificar si el token está en la caché
    const email = myCache.get(hashedToken);

    if (!email) {
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
    }

    res.status(200).json({ success: true, message: 'Token verificado correctamente' });
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

const saveSchedule = async (req, res, next) => {
  try {
    const { schedules } = req.body;
    console.log("Received schedules:", schedules);

    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      throw new Error("No schedules provided or invalid format");
    }

    const userId = req.user._id; // Obtener el ID del usuario autenticado desde el middleware

    let user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Eliminar horarios anteriores
    user.selectedSchedules = [];
    await user.save();
    // Guardar nuevos horarios
    user.selectedSchedules = schedules;

    await user.save();

    res.status(200).json({ success: true, message: 'Horarios guardados correctamente' });
  } catch (error) {
    next(error);
  }
};

export {
  deleteUser, getAllUsers, loginUser, registerUser, requestPasswordReset,
  resetPassword, saveSchedule, updateProfile,
  updateProfilePicture, userProfile, verifyResetToken
};

