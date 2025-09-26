import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import MainLayout from "../../components/MainLayout";
import ProfilePicture from "../../components/ProfilePicture";
import { compareSync } from "bcryptjs";
import {
  getUserProfile,
  updateProfile,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  changePassword,
} from "../../services/index/users";
import {
  getPasswordHistory,
  addPasswordHistory,
} from "../../services/index/password";
import { userActions } from "../../store/reducers/userReducers";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { userInfo } = useSelector((state) => state.user);

  const [resetRequested, setResetRequested] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const newPwd = watch("newPassword");

  // Cargar perfil y rellenar formulario
  const { data: profile } = useQuery(
    ["profile"],
    () => getUserProfile({ token: userInfo.token }),
    {
      onSuccess: (data) => {
        reset({
          name: data.name,
          email: data.email,
          verificationCode: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
    }
  );

  // Obtener historial completo
  const { data: history = [] } = useQuery(
    ["passwordHistory", userInfo._id],
    () => getPasswordHistory({ token: userInfo.token, userId: userInfo._id }),
    { enabled: !!userInfo }
  );

  // --- Nuevo: solo las últimas 5 contraseñas ---
  const recentHistory = useMemo(() => {
    return [...history]
      // Asume que cada entrada tiene un campo `createdAt`
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [history]);

  // Mutations
  const updateMut = useMutation(
    ({ name, email }) =>
      updateProfile({ token: userInfo.token, userData: { name, email }, userId: userInfo._id }),
    {
      onSuccess: (data) => {
        dispatch(userActions.setUserInfo(data));
        localStorage.setItem("account", JSON.stringify(data));
        queryClient.invalidateQueries(["profile"]);
        toast.success("Perfil actualizado");
        setResetRequested(false);
        setCodeVerified(false);
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const requestMut = useMutation(() => requestPasswordReset(userInfo.email), {
    onSuccess: () => setResetRequested(true),
    onError: (err) => toast.error(err.message),
  });

  const verifyMut = useMutation((code) => verifyResetToken(code), {
    onSuccess: () => setCodeVerified(true),
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const resetMut = useMutation(
    ({ token, newPassword }) => resetPassword(token, newPassword),
    {
      onSuccess: async (_, vars) => {
        toast.success("Contraseña actualizada");
        await addPasswordHistory(
          { token: userInfo.token, userId: userInfo._id, password: vars.newPassword }
        );
        setResetRequested(false);
        setCodeVerified(false);
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const changeMut = useMutation(
    ({ currentPassword, newPassword }) =>
      changePassword({ token: userInfo.token, currentPassword, newPassword }),
    {
      onSuccess: async (_, vars) => {
        toast.success("Contraseña cambiada");
        await addPasswordHistory(
          { token: userInfo.token, userId: userInfo._id, password: vars.newPassword }
        );
      },
      onError: (err) => toast.error(err.response?.data?.message || err.message),
    }
  );

  useEffect(() => {
    if (!userInfo) navigate("/");
  }, [userInfo, navigate]);

  const onSubmit = (data) => {
    const { name, email, verificationCode, newPassword, currentPassword } = data;

    // Reset vía email tras verificar código
    if (resetRequested && codeVerified) {
      if (recentHistory.some((h) => compareSync(newPassword, h.password))) {
        return toast.error("No puedes usar ninguna de tus últimas 5 contraseñas");
      }
      return resetMut.mutate({ token: verificationCode, newPassword });
    }

    // Solicitar/verificar código
    if (resetRequested && !codeVerified) {
      return verifyMut.mutate(getValues("verificationCode"));
    }

    // Cambio de contraseña autenticado
    if (currentPassword && newPassword && !resetRequested) {
      if (recentHistory.some((h) => compareSync(newPassword, h.password))) {
        return toast.error("No puedes usar ninguna de tus últimas 5 contraseñas");
      }
      return changeMut.mutate({ currentPassword, newPassword });
    }

    // Actualizar sólo perfil
    updateMut.mutate({ name, email });
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-md mx-auto">
          <ProfilePicture avatar={profile?.avatar} />
          <h2 className="text-xl font-bold mb-6">Mi Perfil</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Nombre & Email */}
            <div className="mb-4">
              <label className="block font-semibold">Nombre</label>
              <input
                type="text"
                {...register("name", { required: "Requerido" })}
                className="w-full mt-1 px-3 py-2 border rounded"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="mb-6">
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                {...register("email", { required: "Requerido", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" } })}
                className="w-full mt-1 px-3 py-2 border rounded"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Botón actualizar perfil o iniciar flujo de cambio de pwd */}
            {!resetRequested ? (
              <button
                type="submit"
                disabled={updateMut.isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded mb-6 disabled:opacity-50"
              >{updateMut.isLoading ? 'Guardando...' : 'Actualizar Perfil'}</button>
            ) : null}

            <hr className="my-6" />
            <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>

            {/* Paso 1: Solicitar código */}
            {!resetRequested && (
              <button
                type="button"
                onClick={() => requestMut.mutate()}
                disabled={requestMut.isLoading}
                className="w-full bg-green-600 text-white py-2 rounded mb-4 disabled:opacity-50"
              >{requestMut.isLoading ? 'Enviando código...' : 'Solicitar Código de Verificación'}</button>
            )}

            {/* Paso 2: Verificar código */}
            {resetRequested && !codeVerified && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold">Código de Verificación</label>
                  <input
                    type="text"
                    {...register("verificationCode", { required: "Requerido" })}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                  {errors.verificationCode && <p className="text-red-500 text-xs mt-1">{errors.verificationCode.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={verifyMut.isLoading}
                  className="w-full bg-yellow-600 text-white py-2 rounded mb-6 disabled:opacity-50"
                >{verifyMut.isLoading ? 'Verificando...' : 'Verificar Código'}</button>
              </>
            )}

            {/* Paso 3: Nueva contraseña */}
            {codeVerified && (
              <>
                <div className="mb-4">
                  <label className="block font-semibold">Nueva Contraseña</label>
                  <input
                    type="password"
                    {...register("newPassword", {
                      required: "Requerido",
                      validate: (val) => {
                        const errs=[];
                        if(val.length<12) errs.push("al menos 12 caracteres");
                        if(!/[A-Z]/.test(val)) errs.push("una mayúscula");
                        if(!/[a-z]/.test(val)) errs.push("una minúscula");
                        if(!/[0-9]/.test(val)) errs.push("un dígito");
                        if(!/[!@#$%^&*(),.?\":{}|<>_\-+=]/.test(val)) errs.push("un símbolo");
                        return errs.length===0 || `Debe: ${errs.join(', ')}`;
                      }
                    })}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                  {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                  {newPwd && (
                    <ul className="text-xs mt-2 ml-5 list-disc text-gray-600">
                      <li className={newPwd.length>=12?"text-green-600":"text-red-500"}>Mínimo 12 caracteres</li>
                      <li className={/[A-Z]/.test(newPwd)?"text-green-600":"text-red-500"}>Al menos una mayúscula</li>
                      <li className={/[a-z]/.test(newPwd)?"text-green-600":"text-red-500"}>Al menos una minúscula</li>
                      <li className={/[0-9]/.test(newPwd)?"text-green-600":"text-red-500"}>Al menos un dígito</li>
                      <li className={/[!@#$%^&*(),.?\":{}|<>_\-+=]/.test(newPwd)?"text-green-600":"text-red-500"}>Al menos un símbolo</li>
                    </ul>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block font-semibold">Confirmar Contraseña</label>
                  <input
                    type="password"
                    {...register("confirmPassword", { required: "Requerido", validate: (val) => val===newPwd || "No coinciden" })}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={resetMut.isLoading || !isValid}
                  className="w-full bg-red-600 text-white py-2 rounded disabled:opacity-50"
                >{resetMut.isLoading? 'Actualizando...' : 'Cambiar Contraseña'}</button>
              </>
            )}
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProfilePage;
