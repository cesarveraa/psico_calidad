import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { images } from "../../../../constants";
import { createSystemLog } from '../../../../services/index/logsSistema';
import { deleteProduct, getAllProducts } from '../../../../services/index/products';

const ProductList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (userState?.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_products",
        accion: "Accedió a la lista de Productos"
      }, userState.userInfo.token).catch(console.error);
    }
  }, []);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteProductMutate, isLoading: isDeleting } = useMutation({
    mutationFn: async ({ id, token }) => {
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_products",
        accion: `Eliminó el producto: ${id}`
      }, token);
      return deleteProduct(id, token);
    },
    onSuccess: () => {
      toast.success('Producto eliminado exitosamente');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const handleEdit = (id) => {
    createSystemLog({
      userId: userState.userInfo._id,
      email: userState.userInfo.email,
      sistema: "manage_products",
      accion: `Ingresó a editar el producto: ${id}`
    }, userState.userInfo.token).catch(console.error);

    navigate(`/admin/products/manage/edit/${id}`);
  };

  const handleDelete = (id) => {
    const token = userState.userInfo.token;
    deleteProductMutate({ id, token });
  };

  const handleCreateProduct = () => {
    navigate(`/admin/products/manage`);
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los productos</p>;

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <img
          className={`w-64 h-auto transform transition-transform hover:scale-105`}
          src={images.psico}
          alt="Estudiantes universitarios en el campus"
        />
        <p className="text-xl font-bold text-gray-700 mt-4">No hay productos disponibles. Cree nuevos productos.</p>
        <button
          onClick={handleCreateProduct}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Crear Nuevo Producto?
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Lista de Productos
      </section>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={product.imageUrl[0]} alt={product.name} className="rounded-lg w-full h-48 object-cover" />
            <h3 className="mt-2 text-xl font-bold">{product.name}</h3>
            <p className="text-gray-700">{product.description}</p>
            <p className="mt-1 text-lg font-semibold text-green-600">{product.price}Bs.</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(product._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product._id)}
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

export default ProductList;
