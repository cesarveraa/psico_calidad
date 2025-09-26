import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, createCategory, deleteCategory } from '../../../../services/index/categoryService';
import { useSelector } from 'react-redux';
import { images } from "../../../../constants";

const CategoryList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['productcategories'],
    queryFn: getAllCategories,
    refetchOnWindowFocus: false,
  });

  const { mutate: createCategoryMutate, isLoading: isCreating } = useMutation({
    mutationFn: ({ title, token }) => createCategory({ title }, token),
    onSuccess: () => {
      toast.success('Categoría creada exitosamente');
      queryClient.invalidateQueries(['productcategories']);
      setNewCategoryTitle(""); // Limpiar el input después de crear la categoría
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const { mutate: deleteCategoryMutate, isLoading: isDeleting } = useMutation({
    mutationFn: ({ id, token }) => deleteCategory(id, token),
    onSuccess: () => {
      toast.success('Categoría eliminada exitosamente');
      queryClient.invalidateQueries(['productcategories']);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const handleEdit = (id) => {
    navigate(`/admin/productCategories/edit/${id}`);
  };

  const handleDelete = (id) => {
    const token = userState.userInfo.token;
    deleteCategoryMutate({ id, token });
  };

  const handleCreateCategory = () => {
    const token = userState.userInfo.token;
    createCategoryMutate({ title: newCategoryTitle, token });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar las categorías</p>;

  if (!categories || categories.length === 0) {
    return (

      <div className="flex flex-col items-center justify-center h-full">
        <div className="mt-4">
          <input
            type="text"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            placeholder="Nueva Categoría"
            className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 mb-4"
          />
          <button
            onClick={handleCreateCategory}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            disabled={isCreating}
          >
            Agregar Categoría
          </button>
        </div>
        <img
          className={`w-64 h-auto transform transition-transform hover:scale-105`}
          src={images.psico}
          alt="Estudiantes universitarios en el campus"
        />
        <p className="text-xl font-bold text-gray-700 mt-4">No hay categorias disponibles. Cree nuevas categorias.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Lista de Categorías
      </section>

      <div className="mt-4">
        <input
          type="text"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
          placeholder="Nueva Categoría"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 mb-4"
        />
        <button
          onClick={handleCreateCategory}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          disabled={isCreating}
        >
          Agregar Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="mt-2 text-xl font-bold">{category.title}</h3>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(category._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(category._id)}
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

export default CategoryList;
