// src/pages/auth/ResetPasswordPage.jsx
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { compareSync } from 'bcryptjs';
import {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} from '../../services/index/users';
import { getPasswordHistory } from '../../services/index/password';
import MainLayout from '../../components/MainLayout';

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const [emailSent, setEmailSent] = useState(false);
  const [codeValid, setCodeValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const [resetToken, setResetToken] = useState('');

  const newPassword = watch('newPassword');

  // 1) Enviar código de verificación vía email
  const sendEmailMut = useMutation(requestPasswordReset, {
    onSuccess: () => {
      toast.success('Correo de verificación enviado');
      setEmailSent(true);
    },
    onError: (err) => toast.error(err.message),
  });

  // 2) Verificar código y recuperar userId
  const verifyCodeMut = useMutation(verifyResetToken, {
    onMutate: (token) => {
      setResetToken(token);
    },
    onSuccess: ({ userId }) => {
      toast.success('Código verificado correctamente');
      setCodeValid(true);
      setUserId(userId);
    },
    onError: (err) => toast.error(err.message),
  });

  // 3) Consultar historial de últimas contraseñas
  const { data: history = [] } = useQuery(
    ['passwordHistory', userId],
    () => getPasswordHistory({ token: resetToken, userId }),
    { enabled: !!codeValid && !!userId && !!resetToken }
  );

  const recentHistory = useMemo(
    () =>
      history
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [history]
  );

  // 4) Resetear contraseña (backend valida y guarda histórico)
  const resetPwdMut = useMutation(
    ({ resetToken, newPassword }) => resetPassword({ resetToken, newPassword }),
    {
      onSuccess: () => {
        toast.success('Contraseña restablecida con éxito');
        // Reiniciar flujo
        setEmailSent(false);
        setCodeValid(false);
        setResetToken('');
        setUserId(null);
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const onSubmit = (data) => {
    if (!emailSent) {
      return sendEmailMut.mutate(data.email);
    }
    if (!codeValid) {
      return verifyCodeMut.mutate(data.token);
    }

    // 5) Comprobar reutilización de contraseña
    const reused = recentHistory.some((entry) =>
      compareSync(data.newPassword, entry.password)
    );
    if (reused) {
      return toast.error('No puedes usar ninguna de tus últimas 5 contraseñas');
    }

    // 6) Ejecutar reset
    resetPwdMut.mutate({ resetToken, newPassword: data.newPassword });
  };

  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Restablecer Contraseña</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Paso 1: Email */}
            {!emailSent && (
              <>
                <label className="block font-semibold">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email es requerido',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido',
                    },
                  })}
                  className={`w-full mt-2 mb-4 px-4 py-3 rounded border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
                <button
                  type="submit"
                  disabled={sendEmailMut.isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-70"
                >
                  {sendEmailMut.isLoading ? 'Enviando...' : 'Enviar correo de verificación'}
                </button>
              </>
            )}

            {/* Paso 2: Código */}
            {emailSent && !codeValid && (
              <>
                <label className="block font-semibold">Código de verificación</label>
                <input
                  type="text"
                  {...register('token', { required: 'El código es requerido' })}
                  className={`w-full mt-2 mb-4 px-4 py-3 rounded border ${
                    errors.token ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.token && (
                  <p className="text-red-500 text-xs mt-1">{errors.token.message}</p>
                )}
                <button
                  type="submit"
                  disabled={verifyCodeMut.isLoading}
                  className="w-full bg-yellow-600 text-white py-3 rounded disabled:opacity-70"
                >
                  {verifyCodeMut.isLoading ? 'Verificando...' : 'Verificar Código'}
                </button>
              </>
            )}

            {/* Paso 3: Nueva contraseña */}
            {codeValid && (
              <>
                <label className="block font-semibold">Nueva Contraseña</label>
                <input
                  type="password"
                  {...register('newPassword', {
                    required: 'La contraseña es requerida',
                    validate: (val) => {
                      const errs = [];
                      if (val.length < 12) errs.push('mínimo 12 caracteres');
                      if (!/[A-Z]/.test(val)) errs.push('una mayúscula');
                      if (!/[a-z]/.test(val)) errs.push('una minúscula');
                      if (!/[0-9]/.test(val)) errs.push('un dígito');
                      if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(val)) errs.push('un símbolo');
                      return errs.length === 0 || `Debe contener: ${errs.join(', ')}`;
                    },
                  })}
                  className={`w-full mt-2 px-4 py-3 rounded border ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                )}
                <ul className="text-xs mt-2 ml-5 list-disc text-gray-600">
                  <li className={newPassword.length >= 12 ? 'text-green-600' : 'text-red-500'}>
                    Mínimo 12 caracteres
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-red-500'}>
                    Al menos una mayúscula
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-red-500'}>
                    Al menos una minúscula
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-red-500'}>
                    Al menos un dígito
                  </li>
                  <li className={/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(newPassword) ? 'text-green-600' : 'text-red-500'}>
                    Al menos un símbolo
                  </li>
                </ul>

                <label className="block font-semibold mt-4">Confirmar Contraseña</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirmar la contraseña es obligatorio',
                    validate: (val) => val === newPassword || 'Las contraseñas no coinciden',
                  })}
                  className={`w-full mt-2 mb-4 px-4 py-3 rounded border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}

                <button
                  type="submit"
                  disabled={resetPwdMut.isLoading || !isValid}
                  className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-70"
                >
                  {resetPwdMut.isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </MainLayout>
  );
};

export default ResetPasswordPage;
