import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import sha1 from "js-sha1";
import zxcvbn from "zxcvbn";

import MainLayout from "../../components/MainLayout";
import { signup } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducers";

/* ──────────────── Utilidad HIBP ──────────────── */
async function isPasswordPwned(password) {
  const hash = sha1(password).toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!res.ok) {
    // Si falla la consulta, deja pasar (no bloquea) y avisa en consola
    console.warn("No se pudo verificar HIBP:", res.statusText);
    return false;
  }
  const text = await res.text();
  return text.includes(suffix);
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  /* ───── Captcha primitivo ───── */
  const [num1] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(() => Math.floor(Math.random() * 10) + 1);
  const captchaSum = num1 + num2;

  /* ───── Mutación de registro ───── */
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, email, password, sexo, ci }) =>
      signup({ name, email, password, sexo, ci }),
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));

      if (data.createdAt) {
        const daysSince = differenceInDays(new Date(), new Date(data.createdAt));
        if (daysSince >= 60) {
          toast(
            () => (
              <span>
                Tu contraseña tiene <b>{daysSince}</b> días sin cambiarse.
                <br />
                Te recomendamos actualizarla pronto.
              </span>
            ),
            { duration: 10000 }
          );
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  /* Redirección si ya está logueado */
  useEffect(() => {
    if (userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  /* ───── React Hook Form ───── */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      sexo: "",
      ci: "",
      email: "",
      password: "",
      confirmPassword: "",
      captcha: "",
    },
  });

  const password = watch("password");

  const submitHandler = (data) => {
    if (parseInt(data.captcha, 10) !== captchaSum) {
      toast.error("Respuesta de captcha incorrecta");
      return;
    }
    const { name, email, password, sexo, ci } = data;
    mutate({ name, email, password, sexo, ci });
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="font-roboto text-2xl font-bold text-center text-dark-hard mb-8">
            Cree una cuenta
          </h1>

          <form onSubmit={handleSubmit(submitHandler)}>
            {/* ───── Nombre ───── */}
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="name" className="text-[#5a7184] font-semibold block">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: { value: true, message: "El nombre es requerido" },
                  minLength: { value: 1, message: "El nombre debe tener al menos 1 carácter" },
                })}
                placeholder="Ingrese su nombre"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${errors.name ? "border-red-500" : "border-[#c3cad9]"
                  }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* ───── Sexo ───── */}
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="sexo" className="text-[#5a7184] font-semibold block">
                Sexo
              </label>
              <select
                {...register("sexo", { required: "Seleccionar el sexo es obligatorio" })}
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${errors.sexo ? "border-red-500" : "border-[#c3cad9]"
                  }`}
              >
                <option value="">Seleccione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
              {errors.sexo?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.sexo.message}</p>
              )}
            </div>

            {/* ───── CI ───── */}
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="ci" className="text-[#5a7184] font-semibold block">
                Carnet de Identidad (CI)
              </label>
              <input
                id="ci"
                type="text"
                {...register("ci", {
                  required: { value: true, message: "El número de carnet (CI) es requerido" },
                  minLength: { value: 7, message: "Debe tener al menos 7 dígitos" },
                  maxLength: { value: 9, message: "No puede exceder 9 dígitos" },
                  pattern: { value: /^[0-9]+$/, message: "El CI debe ser numérico" },
                })}
                placeholder="Ej: 10234567"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${errors.ci ? "border-red-500" : "border-[#c3cad9]"
                  }`}
              />
              {errors.ci?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.ci.message}</p>
              )}
            </div>

            {/* ───── Email ───── */}
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="email" className="text-[#5a7184] font-semibold block">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: { value: true, message: "Email es requerido" },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingrese un email válido",
                  },
                })}
                placeholder="Ingrese su email"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${errors.email ? "border-red-500" : "border-[#c3cad9]"
                  }`}
              />
              {errors.email?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* ───── Contraseña ───── */}
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="password" className="text-[#5a7184] font-semibold block">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: { value: true, message: "La contraseña es requerida" },
                  validate: async (value) => {
                    const errs = [];

                    /* ────────── Reglas clásicas ────────── */
                    if (value.length < 12) errs.push("al menos 12 caracteres");
                    if (!/[A-Z]/.test(value)) errs.push("una mayúscula");
                    if (!/[a-z]/.test(value)) errs.push("una minúscula");
                    if (!/[0-9]/.test(value)) errs.push("un dígito");
                    if (!/[!@#$%^&*(),.?\":{}|<>_+=-]/.test(value)) errs.push("un símbolo");

                    /* ────────── 1) Secuencias numéricas ────────── */
                    if (/(0123|1234|2345|3456|4567|5678|6789|7890|9876|8765|7654)/.test(value)) {
                      errs.push("no debe contener números consecutivos");
                    }

                    /* ────────── 2) Palabras legibles (zxcvbn) ────────── */
                    const zx = zxcvbn(value);
                    const hasDictionaryMatch = zx.sequence.some((s) => s.dictionary_name);
                    if (hasDictionaryMatch) {
                      errs.push("no debe contener palabras legibles o comunes");
                    }

                    /* ────────── 3) Contraseña expuesta (HIBP) ────────── */
                    const pwned = await isPasswordPwned(value);
                    if (pwned) errs.push("esta contraseña ha sido filtrada públicamente");

                    return errs.length === 0 || `La contraseña debe contener: ${errs.join(", ")}`;
                  },

                })}
                placeholder="Ingrese la contraseña"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${errors.password ? "border-red-500" : "border-[#c3cad9]"
                  }`}
              />
              {errors.password?.message && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}

              {/* Requisitos en tiempo real */}
              {password && (
                <ul className="text-xs text-[#5a7184] mt-2 list-disc ml-5 space-y-1">
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
                      /[!@#$%^&*(),.?\":{}|<>_+=-]/.test(password)
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    Al menos un símbolo
                  </li>
                </ul>
              )}
            </div>

            {/* ───── Confirmar contraseña ───── */}
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="confirmPassword" className="text-[#5a7184] font-semibold block">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: { value: true, message: "Confirmar la contraseña es requerido" },
                  validate: (value) => value === password || "Las contraseñas no coinciden",
                })}
                placeholder="Confirme su contraseña"
                className={`placeholder:text-[#959ead] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block outline-none border ${errors.confirmPassword ? "border-red-500" : "border-[#c3cad9]"
                  }`}
              />
              {errors.confirmPassword?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* ───── Captcha ───── */}
            <div className="flex flex-col mb-6 w-full">
              <label className="font-semibold mb-2">
                ¿Cuánto es {num1} + {num2}?
              </label>
              <input
                type="text"
                {...register("captcha", {
                  required: "Debes responder el captcha",
                  validate: (val) => parseInt(val, 10) === captchaSum || "Respuesta incorrecta",
                })}
                placeholder="Escribe el resultado"
                className={`mt-2 px-4 py-2 border rounded ${errors.captcha ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.captcha && (
                <p className="text-red-500 text-xs mt-1">{errors.captcha.message}</p>
              )}
            </div>

            {/* ───── Botón Registrar ───── */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Registrar
            </button>

            {/* ───── Enlaces ───── */}
            <p className="text-sm font-semibold text-[#5a7184] mb-4">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary">
                Inicia Sesión
              </Link>
            </p>
            <p className="text-sm font-semibold text-[#5a7184]">
              <Link to="/forgot-password" className="text-primary">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default RegisterPage;
