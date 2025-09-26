import { verify } from "jsonwebtoken";
import User from "../models/User";

export const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log("Received token:", token); // Log para verificar el token recibido
      const { id } = verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select("-password");
      if (!req.user) {
        let err = new Error("Not authorized, User not found");
        err.statusCode = 401;
        next(err);
      } else {
        next();
      }
    } catch (error) {
      let err = new Error("Not authorized, Token failed");
      err.statusCode = 401;
      next(err);
    }
  } else {
    let error = new Error("Not authorized, No token");
    error.statusCode = 401;
    next(error);
  }
};
export const adminGuard = (req, res, next) => {
  // req.user.roles es por ejemplo ['Estudiante SCE','Editor',...]
  if (
    req.user &&
    Array.isArray(req.user.roles) &&
    !req.user.roles.includes("Visitante")
  ) {
    return next();
  }
  const err = new Error("Not authorized for visitors");
  err.statusCode = 401;
  return next(err);
};
