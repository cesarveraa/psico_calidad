import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getFormaPagoById, updateFormaPago } from "../../../../services/index/formaPagos";

const EditFormaPago = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);
  const [formaPagoData, setFormaPagoData] = useState({
    image: null,
    previewUrl: null,
    name: ""
  });
  const [errors, setErrors] = useState({});

  const { data: formaPago, isLoading, isError } = useQuery({
    queryKey: ['formaPago', id],
    queryFn: () => getFormaPagoById(id),
    onSuccess: (data) => {
      setFormaPagoData({
        image: null,
        previewUrl: data.imageUrl,
        name: data.name
      });
    },
    refetchOnWindowFocus: false,
  });

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

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateFormaPago = async () => {
    if (!validateFields()) {
      toast.error("Por favor, corrija los errores en el formulario");
      return;
    }

    const formaPagoFormData = new FormData();
    formaPagoFormData.append('name', formaPagoData.name);
    if (formaPagoData.image) {
      formaPagoFormData.append('image', formaPagoData.image);
    }

    const token = userState.userInfo.token;
    try {
      mutate({ id, formaPagoData: formaPagoFormData, token });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formaPagoData, token }) => updateFormaPago(id, formaPagoData, token),
    onSuccess: () => {
      toast.success("Forma de pago actualizada exitosamente");
      queryClient.invalidateQueries(["formaPago"]);
      navigate("/admin/formaPago/list", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar la forma de pago</p>;

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Editar Forma de Pago
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
        {formaPagoData.previewUrl && (
          <div className="mt-4">
            <img src={formaPagoData.previewUrl} alt="Vista previa" className="rounded-lg w-full max-w-xs mx-auto" />
          </div>
        )}
      </div>

      <button
        onClick={handleUpdateFormaPago}
        disabled={isUpdating}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Actualizar Forma de Pago
      </button>
    </div>
  );
};

export default EditFormaPago;
