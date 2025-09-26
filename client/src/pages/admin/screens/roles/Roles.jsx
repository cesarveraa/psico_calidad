import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { createSystemLog } from "../../../../services/index/logsSistema";
import {
  createRole,
  deleteRole,
  getAllRoles,
  updateRole,
} from "../../../../services/index/roles";

const PERMISSION_OPTIONS = [
  "view_dashboard",
  "manage_users",
  "manage_roles",
  "access_comments",
  "manage_posts",
  "manage_books",
  "manage_products",
  "manage_pulpi",
  "view_login_logs",
  "view_system_logs",
];

const Roles = () => {
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const token = userState.userInfo.token;

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles(token),
  });

  const [newRole, setNewRole] = useState({ name: "", description: "", permissions: [] });
  const [editRoleId, setEditRoleId] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "", permissions: [] });

  const { mutate: mutateCreate } = useMutation({
    mutationFn: (data) => createRole(data, token),
    onSuccess: async () => {
      queryClient.invalidateQueries(["roles"]);
      toast.success("Rol creado");
      setNewRole({ name: "", description: "", permissions: [] });
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_roles",
        accion: `Creó un nuevo rol: ${newRole.name}`,
      }, token);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: ({ roleId, data }) => updateRole(roleId, data, token),
    onSuccess: async () => {
      queryClient.invalidateQueries(["roles"]);
      toast.success("Rol actualizado");
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_roles",
        accion: `Actualizó el rol: ${editData.name}`,
      }, token);
      setEditRoleId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: mutateDelete } = useMutation({
    mutationFn: (roleId) => deleteRole(roleId, token),
    onSuccess: async () => {
      queryClient.invalidateQueries(["roles"]);
      toast.success("Rol eliminado");
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_roles",
        accion: "Eliminó un rol",
      }, token);
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleEditPermission = (permission) => {
    setEditData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const toggleNewRolePermission = (permission) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  useEffect(() => {
    if (userState.userInfo && token) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_roles",
        accion: "Accedió a la gestión de roles",
      }, token).catch(console.error);
    }
  }, [token]);

  if (isLoading) return <p>Cargando roles...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Administrar Roles</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Crear nuevo rol</h2>
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 w-full mb-2"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          className="border p-2 w-full mb-2"
          value={newRole.description}
          onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
        />

        <div className="mb-2">
          <label className="font-semibold">Permisos:</label>
          <div className="flex flex-col gap-1 mt-1 max-h-48 overflow-y-auto">
            {PERMISSION_OPTIONS.map((permission) => (
              <label key={permission} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  value={permission}
                  checked={newRole.permissions.includes(permission)}
                  onChange={() => toggleNewRolePermission(permission)}
                />
                {permission}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={() => mutateCreate(newRole)}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        >
          Crear
        </button>
      </div>

      <h2 className="font-semibold mb-2">Roles existentes</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Permisos</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id}>
              <td className="p-2 border">
                {editRoleId === role._id ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  role.name
                )}
              </td>
              <td className="p-2 border">
                {editRoleId === role._id ? (
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="border px-2 py-1 w-full"
                  />
                ) : (
                  role.description || "-"
                )}
              </td>
              <td className="p-2 border text-sm">
                {editRoleId === role._id ? (
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {PERMISSION_OPTIONS.map((permission) => (
                      <label key={permission} className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editData.permissions.includes(permission)}
                          onChange={() => toggleEditPermission(permission)}
                        />
                        {permission}
                      </label>
                    ))}
                  </div>
                ) : (
                  (role.permissions || []).join(", ")
                )}
              </td>
              <td className="p-2 border space-x-2">
                {editRoleId === role._id ? (
                  <>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => mutateUpdate({ roleId: role._id, data: editData })}
                    >
                      Guardar
                    </button>
                    <button
                      className="bg-gray-400 px-2 py-1 rounded"
                      onClick={() => setEditRoleId(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-yellow-400 px-2 py-1 rounded"
                      onClick={() => {
                        setEditRoleId(role._id);
                        setEditData({
                          name: role.name,
                          description: role.description,
                          permissions: role.permissions || [],
                        });
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => mutateDelete(role._id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
