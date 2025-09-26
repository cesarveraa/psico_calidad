import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSingleHomePage } from "../../../services/index/homePages";
import { AiOutlineBulb, AiOutlineCreditCard, AiOutlineDollarCircle, AiOutlineForm, AiOutlineTrophy } from "react-icons/ai";
import ErrorMessage from "../../../components/ErrorMessage";
import CTASkeleton from "../../../components/CTASkeleton";

const CTA = () => {
  const [active] = useState(null);
  const slug = "home"; // Definimos el slug por defecto

  const { data, isLoading, isError } = useQuery(["home", slug], () => getSingleHomePage(slug));

  if (isLoading) return <CTASkeleton />;
  if (isError) return <ErrorMessage message="No se pudieron obtener los detalles de la página de inicio" />;

  const { inscripciones, tarifario, planesPago, oportunidadesBeca, programaAgora } = data.home;

  const newItems = [
    { icon: <AiOutlineForm size="3em" className="text-blue-600" />, title: "Inscripciones", link: inscripciones.url, active: inscripciones.state },
    { icon: <AiOutlineDollarCircle size="3em" className="text-green-600" />, title: "Tarifario Actualizado", link: tarifario.url, active: tarifario.state },
    { icon: <AiOutlineCreditCard size="3em" className="text-red-600" />, title: "Planes de Pago", link: planesPago.url, active: planesPago.state },
    { icon: <AiOutlineTrophy size="3em" className="text-yellow-600" />, title: "Oportunidades de Becas", link: oportunidadesBeca.url, active: oportunidadesBeca.state },
    { icon: <AiOutlineBulb size="3em" className="text-purple-600" />, title: "Programa AGORA", link: programaAgora.url, active: programaAgora.state }
  ];

  const filteredItems = newItems.filter(item => item.active);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-center">
        {filteredItems.map((item, index) => (
          <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center p-6 bg-white shadow-lg rounded-lg ${index === active ? "ring-2 ring-blue-500" : ""}`}>
            {item.icon}
            <h3 className={`font-bold text-xl mb-2 ${index === active ? "text-blue-500" : "text-black"}`}>{item.title}</h3>
            <p className="text-gray-600">{item.content}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CTA;