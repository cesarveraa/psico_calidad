import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllLoginLogs } from "../../../../services/index/logsLogin";
import { createSystemLog } from "../../../../services/index/logsSistema";

const LogsLogin = () => {
  const userState = useSelector((state) => state.user);
  const token = userState.userInfo.token;

  const { data: logs = [], isLoading, isError, error } = useQuery({
    queryKey: ["logsLogin"],
    queryFn: () => getAllLoginLogs(token),
  });

  // Registrar acceso al módulo de logs de login
  useEffect(() => {
    if (userState?.userInfo) {
      createSystemLog(
        {
          userId: userState.userInfo._id,
          email: userState.userInfo.email,
          sistema: "view_login_logs",
          accion: "Accedió al módulo de logs de inicio de sesión",
        },
        token
      ).catch((err) =>
        console.error("❌ Error registrando log en logsSistema:", err.message)
      );
    }
  }, []);

  if (isLoading) return <p className="text-center">Cargando logs de inicio de sesión...</p>;
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Logs de Inicio de Sesión</h1>

      {logs.length === 0 ? (
        <p className="text-gray-500">No hay registros.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Usuario</th>
                <th className="p-2 border">Correo</th>
                <th className="p-2 border">IP</th>
                <th className="p-2 border">Navegador</th>
                <th className="p-2 border">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="p-2 border">{log.userId?.name || "-"}</td>
                  <td className="p-2 border">{log.email}</td>
                  <td className="p-2 border">{log.ip}</td>
                  <td className="p-2 border text-sm">
                    <div className="max-w-xs overflow-x-auto whitespace-nowrap">
                      {log.userAgent}
                    </div>
                  </td>
                  <td className="p-2 border">
                    {new Date(log.createdAt).toLocaleString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogsLogin;
