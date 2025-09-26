import Role from "../models/Roles.js";

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions = [] } = req.body;

    if (!name) throw new Error("El nombre del rol es obligatorio");

    const existing = await Role.findOne({ name });
    if (existing) throw new Error("Ya existe un rol con ese nombre");

    const newRole = await Role.create({ name, description, permissions });

    res.status(201).json(newRole);
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const role = await Role.findById(roleId);

    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(roleId);
    if (!role) throw new Error("Rol no encontrado");

    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (permissions !== undefined) role.permissions = permissions;

    await role.save();

    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    const role = await Role.findById(roleId);
    if (!role) throw new Error("Rol no encontrado");

    await role.remove();

    res.status(200).json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

export {
    createRole,
    deleteRole,
    getAllRoles,
    getRoleById,
    updateRole
};

