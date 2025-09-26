import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { images, stables } from "../../../../constants";
import { useDataTable } from "../../../../hooks/useDataTable";
import { createSystemLog } from "../../../../services/index/logsSistema";
import { getAllRoles } from "../../../../services/index/roles";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateProfile
} from "../../../../services/index/users";
import DataTable from "../../components/DataTable";

const Users = () => {
  const {
    userState,
    currentPage,
    searchKeyword,
    data: usersData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage
  } = useDataTable({
    dataQueryFn: () =>
      getAllUsers(userState.userInfo.token, searchKeyword, currentPage),
    dataQueryKey: ["users"],
    deleteDataMessage: "User is deleted",
    mutateDeleteFn: async ({ slug, token }) => {
      const res = await deleteUser({ slug, token });
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_users",
        accion: `Eliminó al usuario con ID: ${slug}`
      }, token);
      return res;
    }
  });

  const { data: rolesList = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles(userState.userInfo.token)
  });

  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    sexo: "",
    ci: "",
    roles: []
  });

  const toggleNewUserRole = (roleName) => {
    const newRoles = newUser.roles.includes(roleName)
      ? newUser.roles.filter((r) => r !== roleName)
      : [...newUser.roles, roleName];
    setNewUser((prev) => ({ ...prev, roles: newRoles }));
  };

  const pw = newUser.password;
  const validations = {
    length: pw.length >= 12,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(pw),
    match: pw === newUser.confirmPassword && pw !== ""
  };
  const isPasswordValid =
    validations.length &&
    validations.upper &&
    validations.lower &&
    validations.digit &&
    validations.symbol &&
    validations.match;

  const { mutate: mutateCreateUser, isLoading: isCreating } = useMutation({
    mutationFn: async (userData) => {
      const res = await createUser({ token: userState.userInfo.token, userData });
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_users",
        accion: `Creó un nuevo usuario: ${userData.email}`
      }, userState.userInfo.token);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User created");
      setShowCreate(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        sexo: "",
        ci: "",
        roles: []
      });
    },
    onError: (err) => toast.error(err.message)
  });

  const [editingId, setEditingId] = useState(null);
  const [editDataMap, setEditDataMap] = useState({});

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditDataMap((prev) => ({
      ...prev,
      [user._id]: {
        name: user.name,
        email: user.email,
        ci: user.ci,
        roles: user.roles
      }
    }));
  };

  const cancelEdit = () => setEditingId(null);

  const handleEditChange = (userId, field, value) => {
    setEditDataMap((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value }
    }));
  };

  const toggleRoleCheckbox = (userId, roleName) => {
    const current = editDataMap[userId].roles || [];
    const updated = current.includes(roleName)
      ? current.filter((r) => r !== roleName)
      : [...current, roleName];
    handleEditChange(userId, 'roles', updated);
  };

  const { mutate: mutateUpdateUser, isLoading: isUpdating } = useMutation({
    mutationFn: async ({ userId, userData }) => {
      const res = await updateProfile({ token: userState.userInfo.token, userId, userData });
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_users",
        accion: `Actualizó el usuario con ID: ${userId}`
      }, userState.userInfo.token);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User updated");
      setEditingId(null);
    },
    onError: (err) => toast.error(err.message)
  });

  useEffect(() => {
    if (userState.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_users",
        accion: "Accedió a la gestión de usuarios"
      }, userState.userInfo.token).catch(console.error);
    }
  }, []);
  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Administra los Usuarios</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowCreate(true)}
        >
          Nuevo Usuario
        </button>
      </div>

      <DataTable
        dataListName="Usuarios"
        searchInputPlaceHolder="Email del usuario..."
        searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
        searchKeywordOnChangeHandler={searchKeywordHandler}
        searchKeyword={searchKeyword}
        tableHeaderTitleList={["Avatar","Nombre","Email","CI","UserID","Creado en","Verificado","Roles","Acciones"]}
        isLoading={isLoading}
        isFetching={isFetching}
        data={usersData?.data}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        headers={usersData?.headers}
        userState={userState}
      >
        {usersData?.data.map((user) => (
          <tr key={user._id}>
            <td className="p-2 border">
              <img
                src={user.avatar ? stables.UPLOAD_FOLDER_BASE_URL + user.avatar : images.userImage}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            </td>
            <td className="p-2 border">
              {editingId === user._id ? (
                <input
                  value={editDataMap[user._id]?.name || ''}
                  onChange={(e) => handleEditChange(user._id, 'name', e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              ) : (
                user.name
              )}
            </td>
            <td className="p-2 border">
              {editingId === user._id ? (
                <input
                  value={editDataMap[user._id]?.email || ''}
                  onChange={(e) => handleEditChange(user._id, 'email', e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              ) : (
                user.email
              )}
            </td>
            <td className="p-2 border">
              {editingId === user._id ? (
                <input
                  value={editDataMap[user._id]?.ci || ''}
                  onChange={(e) => handleEditChange(user._id, 'ci', e.target.value)}
                  className="border px-2 py-1 w-full"
                />
              ) : (
                user.ci || '-'
              )}
            </td>
            <td className="p-2 border">{user.userID || '-'}</td>
            <td className="p-2 border">{new Date(user.createdAt).toLocaleDateString()}</td>
            <td className="p-2 border text-center">{user.verified ? '✅' : '❌'}</td>
            <td className="p-2 border">
              {editingId === user._id ? (
                <div className="flex flex-col gap-1">
                  {rolesList.map((role) => (
                    <label key={role._id} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editDataMap[user._id]?.roles.includes(role.name)}
                        onChange={() => toggleRoleCheckbox(user._id, role.name)}
                      />
                      {role.name}
                    </label>
                  ))}
                </div>
              ) : (
                user.roles.join(', ')
              )}
            </td>
            <td className="p-2 border space-x-2">
              {editingId === user._id ? (
                <>
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => mutateUpdateUser({ userId: user._id, userData: editDataMap[user._id] })}
                    disabled={isUpdating}
                  >Guardar</button>
                  <button
                    className="px-2 py-1 bg-gray-300 rounded"
                    onClick={cancelEdit}
                    disabled={isUpdating}
                  >Cancelar</button>
                </>
              ) : (
                <>
                  <button
                    className="px-2 py-1 bg-yellow-400 rounded"
                    onClick={() => startEdit(user)}
                  >⚙️</button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                    onClick={() => deleteDataHandler({ slug: user._id, token: userState.userInfo.token })}
                    disabled={isLoadingDeleteData}
                  >Eliminar</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </DataTable>

      {/* Modal Crear Usuario */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={newUser.name}
                onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))}
                className="w-full border px-2 py-1"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))}
                className="w-full border px-2 py-1"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={newUser.password}
                onChange={(e) => setNewUser((u) => ({ ...u, password: e.target.value }))}
                className="w-full border px-2 py-1"
              />
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser((u) => ({ ...u, confirmPassword: e.target.value }))}
                className="w-full border px-2 py-1"
              />
              <ul className="text-xs mt-2 ml-5 list-disc text-gray-600">
                <li className={validations.length ? "text-green-600" : "text-red-500"}>Mínimo 12 caracteres</li>
                <li className={validations.upper ? "text-green-600" : "text-red-500"}>Al menos una Mayúscula</li>
                <li className={validations.lower ? "text-green-600" : "text-red-500"}>Al menos una Minúscula</li>
                <li className={validations.digit ? "text-green-600" : "text-red-500"}>Al menos un Dígito</li>
                <li className={validations.symbol ? "text-green-600" : "text-red-500"}>Al menos un Símbolo</li>
                <li className={validations.match ? "text-green-600" : "text-red-500"}>Las contraseñas coinciden</li>
              </ul>
              <input
                type="text"
                placeholder="Sexo"
                value={newUser.sexo}
                onChange={(e) => setNewUser((u) => ({ ...u, sexo: e.target.value }))}
                className="w-full border px-2 py-1"
              />
              <input
                type="text"
                placeholder="CI"
                value={newUser.ci}
                onChange={(e) => setNewUser((u) => ({ ...u, ci: e.target.value }))}
                className="w-full border px-2 py-1"
              />
              <label className="block font-semibold">Roles:</label>
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto border px-2 py-1">
                {rolesList.map((role) => (
                  <label key={role._id} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newUser.roles.includes(role.name)}
                      onChange={() => toggleNewUserRole(role.name)}
                    />
                    {role.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowCreate(false)} disabled={isCreating}>
                Cancelar
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50" onClick={() => mutateCreateUser(newUser)} disabled={isCreating || !isPasswordValid}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
