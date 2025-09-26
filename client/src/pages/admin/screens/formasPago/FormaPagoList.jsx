import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { images } from "../../../../constants";
import { deleteFormaPago, getAllFormaPago } from '../../../../services/index/formaPagos';
import { createSystemLog } from '../../../../services/index/logsSistema';

const FormaPagoList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);

  const { data: formasPago, isLoading, isError } = useQuery({
    queryKey: ['formaPago'],
    queryFn: getAllFormaPago,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteFormaPagoMutate, isLoading: isDeleting } = useMutation({
    mutationFn: ({ id, token }) => deleteFormaPago(id, token),
    onSuccess: () => {
      toast.success('Forma de pago eliminada exitosamente');
      queryClient.invalidateQueries(['formaPago']);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  useEffect(() => {
    if (userState?.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_products",
        accion: "Accedió a la lista de formas de pago",
      }, userState.userInfo.token).catch((err) =>
        console.error("Error al registrar log:", err.message)
      );
    }
  }, [userState]);

  const handleEdit = (id) => {
    navigate(`/admin/formaPago/edit/${id}`);
  };

  const handleDelete = (id) => {
    const token = userState.userInfo.token;
    deleteFormaPagoMutate({ id, token });
  };

  const handleCreateFormaPago = () => {
    navigate(`/admin/formaPago/create`);
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar las formas de pago</p>;

  if (!formasPago || formasPago.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <img
          className={`w-64 h-auto transform transition-transform hover:scale-105`}
          src={images.psico}
          alt="No hay formas de pago"
        />
        <p className="text-xl font-bold text-gray-700 mt-4">No hay formas de pago disponibles. Cree nuevas formas de pago.</p>
        <button
          onClick={handleCreateFormaPago}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Crear Nueva Forma de Pago
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Lista de Formas de Pago
      </section>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formasPago.map((formaPago) => (
          <div key={formaPago._id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={formaPago.imageUrl} alt={formaPago.name} className="rounded-lg w-full h-48 object-cover" />
            <h3 className="mt-2 text-xl font-bold">{formaPago.name}</h3>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(formaPago._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(formaPago._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                disabled={isDeleting}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormaPagoList;
