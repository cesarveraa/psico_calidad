import React from "react";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaWhatsappSquare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { updateCompartidos, updateCompartidosPorPlataforma, updateTotalCompartidos } from "../services/index/dashboards";

const SocialShareButtons = ({ url, title, categorias, token }) => {
  const userState = useSelector((state) => state.user);
  const userName = userState?.userInfo?.name || "invitado";

  const handleShare = async (plataforma) => {
    try {
      for (const categoria of categorias) {
        await updateCompartidosPorPlataforma({ plataforma, categoria }, token);
      }
      // Incrementar totalCompartidos y actualizar el array compartidos
      await updateTotalCompartidos(token);
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('es-ES'); // Formatear la fecha
      await updateCompartidos({
        user: userName,
        date: formattedDate,
        title: title, // Decodificar el título
        category: categorias.join(", "),
      }, token);
      console.log(`Compartido en ${plataforma}`);
    } catch (error) {
      console.error("Error al compartir en la plataforma:", error);
    }
  };

  return (
    <div className="w-full flex justify-between">
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/dialog/share?app_id=1180206992856877&display=popup&href=${url}`}
        onClick={() => handleShare('Facebook')}
      >
        <FaFacebookSquare className="text-[#3b5998] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/intent/tweet?url=${url}`}
        onClick={() => handleShare('Instagram')}
      >
        <FaInstagramSquare className="text-[#E1306C] w-12 h-auto" />
      </a>
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://api.whatsapp.com/send/?text=${url}`}
        onClick={() => handleShare('WhatsApp')}
      >
        <FaWhatsappSquare className="text-[#25D366] w-12 h-auto" />
      </a>
    </div>
  );
};

export default SocialShareButtons;
