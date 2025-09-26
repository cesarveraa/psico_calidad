import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createSystemLog, getAllSystemLogs } from "../../../../services/index/logsSistema";

const LogsSistema = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const token = userInfo?.token;

  // Registrar acceso al módulo de logs
  useEffect(() => {
    if (userInfo && token) {
      createSystemLog({
        userId: userInfo._id,
        email: userInfo.email,
        sistema: "view_system_logs",
        accion: "Accedió a la vista de logs del sistema",
      }, token).catch((err) => console.error("No se pudo registrar log:", err.message));
    }
  }, [userInfo, token]);

  const {
    data: logs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["logsSistema"],
    queryFn: () => getAllSystemLogs(token),
    enabled: !!token,
  });

  if (isLoading) return <p>Cargando logs...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  // Excluir logs del módulo actual
  const filteredLogs = logs.filter(log => log.sistema !== "view_system_logs");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Logs del Sistema</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Usuario</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Sistema / Módulo</th>
              <th className="border p-2">Acción</th>
              <th className="border p-2">IP</th>
              <th className="border p-2">Navegador</th>
              <th className="border p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="border p-2">{log.userId?.name || "-"}</td>
                <td className="border p-2">{log.email}</td>
                <td className="border p-2">{log.sistema}</td>
                <td className="border p-2">{log.accion}</td>
                <td className="border p-2 text-xs">{log.ip}</td>
                <td className="border p-2 text-xs max-w-[200px] truncate">{log.userAgent}</td>
                <td className="border p-2 text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsSistema;
