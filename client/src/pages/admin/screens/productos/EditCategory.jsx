import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../../services/index/categoryService";

const EditCategory = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);
  const [categoryData, setCategoryData] = useState({
    title: "",
  });

  const { isLoading, isError } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    onSuccess: (data) => {
      setCategoryData({
        title: data.title,
      });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ updatedData, id, token }) => updateCategory(id, updatedData, token),
    onSuccess: () => {
      toast.success("Categoría actualizada exitosamente");
      queryClient.invalidateQueries(["category", id]);
      navigate(`/admin/productCategories/list`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const handleInputChange = (field, value) => {
    setCategoryData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateCategory = async () => {
    const token = userState.userInfo.token;
    try {
      mutate({ updatedData: categoryData, id, token });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar la categoría</p>;

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Editar Categoría
      </section>

      <div className="mt-4">
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Título de la Categoría:
        </label>
        <input
          id="title"
          type="text"
          value={categoryData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Título de la categoría"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 dark:text-white dark:bg-gray-800 dark:border-gray-600"
        />
      </div>

      <button
        onClick={handleUpdateCategory}
        disabled={isUpdating}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Actualizar Categoría
      </button>
    </div>
  );
};

export default EditCategory;
