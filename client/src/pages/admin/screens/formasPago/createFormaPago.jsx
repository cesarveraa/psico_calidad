import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createFormaPago } from "../../../../services/index/formaPagos";
import { createSystemLog } from "../../../../services/index/logsSistema";

const CreateFormaPago = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);
  const [formaPagoData, setFormaPagoData] = useState({
    image: null,
    previewUrl: null,
    name: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userState?.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_products",
        accion: "Accedió a la creación de forma de pago"
      }, userState.userInfo.token).catch((err) => console.error("No se pudo registrar log:", err.message));
    }
  }, [userState]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormaPagoData(prev => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormaPagoData(prev => ({ ...prev, [field]: value }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formaPagoData.name) newErrors.name = "El nombre es requerido";
    if (!formaPagoData.image) newErrors.image = "La imagen es requerida";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateFormaPago = async () => {
    if (!validateFields()) {
      toast.error("Por favor, corrija los errores en el formulario");
      return;
    }

    const formaPagoFormData = new FormData();
    formaPagoFormData.append('name', formaPagoData.name);
    formaPagoFormData.append('image', formaPagoData.image);

    const token = userState.userInfo.token;
    try {
      mutate({ formaPagoData: formaPagoFormData, token });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: ({ formaPagoData, token }) => createFormaPago(formaPagoData, token),
    onSuccess: () => {
      toast.success("Forma de pago creada exitosamente");
      queryClient.invalidateQueries(["formaPago"]);
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_products",
        accion: "Creó una nueva forma de pago"
      }, userState.userInfo.token).catch(console.error);
      navigate("/admin/formaPago/list", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Crear Nueva Forma de Pago
      </section>

      <div className="mt-4">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Nombre:
        </label>
        <input
          id="name"
          type="text"
          value={formaPagoData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Nombre de la forma de pago"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 dark:text-white dark:bg-gray-800 dark:border-gray-600"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="image" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Imagen:
        </label>
        <input
          type="file"
          id="image"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="image"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Seleccionar Imagen
        </label>
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        {formaPagoData.previewUrl && (
          <div className="mt-4">
            <img src={formaPagoData.previewUrl} alt="Vista previa" className="rounded-lg w-full max-w-xs mx-auto" />
          </div>
        )}
      </div>

      <button
        onClick={handleCreateFormaPago}
        disabled={isCreating}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Crear Forma de Pago
      </button>
    </div>
  );
};

export default CreateFormaPago;
