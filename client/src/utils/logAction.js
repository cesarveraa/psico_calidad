// src/utils/logAction.js
import { createSystemLog } from "../services/index/logsSistema";

export const logAction = async ({ userInfo, sistema, modulo, accion }) => {
  if (!userInfo || !userInfo.token || !userInfo._id) return;

  try {
    await createSystemLog(
      {
        userId: userInfo._id,
        sistema: `${sistema} - ${modulo}`,
        accion: accion || "Acceso sin acción registrada",
      },
      userInfo.token
    );
  } catch (err) {
    console.warn("No se pudo registrar el log del sistema:", err.message);
  }
};
