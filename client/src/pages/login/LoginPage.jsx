import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../../components/MainLayout";
import { createLoginLog } from "../../services/index/logsLogin";
import { login } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducers";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const password = watch("password");

  const { mutate: loginMut, isLoading } = useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: async (data) => {
      console.log("✅ Login OK:", data);
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      // 👇 Registrar log de login exitoso
      await createLoginLog({ userId: data._id, email: data.email });

      navigate("/");
    },
    onError: (err) => {
      console.error("🚨 Login Error:", err.response?.data ?? err);
      toast.error(err.response?.data?.message ?? err.message);
    },
  });

  const onSubmit = ({ email, password }) => {
    loginMut({ email: email.trim(), password });
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Inicio de Sesión</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="mb-6">
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresa un email válido",
                  },
                })}
                className={`w-full mt-2 px-4 py-2 border rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="password" className="font-semibold block">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Requerido",
                  validate: (val) => {
                    const errs = [];
                    if (val.length < 12) errs.push("al menos 12 caracteres");
                    if (!/[A-Z]/.test(val)) errs.push("una mayúscula");
                    if (!/[a-z]/.test(val)) errs.push("una minúscula");
                    if (!/[0-9]/.test(val)) errs.push("un dígito");
                    if (!/[!@#$%^&*(),.?":{}|<>_\-=+\\]/.test(val)) errs.push("un símbolo");

                    return errs.length === 0 || `Debe: ${errs.join(", ")}`;
                  },
                })}
                placeholder="Ingrese su contraseña"
                className={`mt-3 rounded-lg px-5 py-4 block outline-none border ${
                  errors.password ? "border-red-500" : "border-[#c3cad9]"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}

              {password && (
                <ul className="text-xs mt-2 ml-5 list-disc text-gray-600">
                  <li className={password.length >= 12 ? "text-green-600" : "text-red-500"}>
                    Mínimo 12 caracteres
                  </li>
                  <li className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-500"}>
                    Al menos una mayúscula
                  </li>
                  <li className={/[a-z]/.test(password) ? "text-green-600" : "text-red-500"}>
                    Al menos una minúscula
                  </li>
                  <li className={/[0-9]/.test(password) ? "text-green-600" : "text-red-500"}>
                    Al menos un dígito
                  </li>
                  <li
                    className={
                      /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password)
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    Al menos un símbolo
                  </li>
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg my-6 disabled:opacity-70"
            >
              {isLoading ? "Ingresando..." : "Inicio de Sesión"}
            </button>

            <Link
              to="/forget-password"
              className="text-sm font-semibold text-primary"
            >
              Se olvidó su contraseña?
            </Link>

            <p className="text-sm font-semibold text-[#5a7184]">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-primary">
                Regístrate ahora
              </Link>
            </p>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;
