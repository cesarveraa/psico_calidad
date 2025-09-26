import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import { anadirCategoriaATodasLasPlataformas, eliminarCategoriaDeTodasLasPlataformas } from '../../../../services/index/dashboards';
import { createSystemLog } from "../../../../services/index/logsSistema";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../../../../services/index/postCategories";
import DataTable from "../../components/DataTable";

const Categories = () => {
  const [categoryTitle, seTcategoryTitle] = useState("");

  const {
    userState,
    currentPage,
    searchKeyword,
    data: categoriesData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    deleteDataHandler,
    submitSearchKeywordHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllCategories(searchKeyword, currentPage),
    dataQueryKey: "categorias",
    deleteDataMessage: "Categoria eliminada",
    mutateDeleteFn: async ({ slug, token }) => {
      try {
        const category = categoriesData.data.find(cat => cat._id === slug);
        if (!category) {
          toast.error("Categoría no encontrada");
          return;
        }

        await deleteCategory({ slug, token });
        await eliminarCategoriaDeTodasLasPlataformas(category.title, token);
        await createSystemLog({
          userId: userState.userInfo._id,
          email: userState.userInfo.email,
          sistema: "manage_posts",
          accion: `Eliminó categoría de post: ${category.title}`
        }, token);

        queryClient.invalidateQueries(["categorias"]);
      } catch (error) {
        toast.error("Error al eliminar categoría: " + error.message);
      }
    },
  });

  useEffect(() => {
    if (userState?.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_posts",
        accion: "Accedió a la gestión de categorías de publicaciones",
      }, userState.userInfo.token).catch(console.error);
    }
  }, []);

  const { mutate: mutateCreateCategory, isLoading: isLoadingCreateCategory } =
    useMutation({
      mutationFn: ({ token, title }) => {
        return createCategory({ token, title });
      },
      onSuccess: async (data) => {
        queryClient.invalidateQueries(["categorias"]);
        toast.success("Categoría creada");

        try {
          await anadirCategoriaATodasLasPlataformas({
            nuevaCategoria: data.title,
            token: userState.userInfo.token
          });

          await createSystemLog({
            userId: userState.userInfo._id,
            email: userState.userInfo.email,
            sistema: "manage_posts",
            accion: `Creó una nueva categoría de post: ${data.title}`
          }, userState.userInfo.token);
        } catch (error) {
          toast.error("Error en el log o dashboard: " + error.message);
        }
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const handleCreateCategory = () => {
    mutateCreateCategory({
      token: userState.userInfo.token,
      title: categoryTitle,
    });
  };

  const showDeleteConfirmation = async (category, token) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.title}"? Esta acción no se puede deshacer.`);
    if (confirmDelete) {
      deleteDataHandler({ slug: category._id, token });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-4">
      <div className="col-span-4 py-8">
        <h4 className="text-lg leading-tight">Añade una nueva categoría</h4>
        <div className="d-form-control w-full mt-6">
          <input
            value={categoryTitle}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => seTcategoryTitle(e.target.value)}
            placeholder="titulo de la categoria"
          />
          <button
            disabled={isLoadingCreateCategory}
            type="button"
            onClick={handleCreateCategory}
            className="w-fit mt-3 bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Añade una categoría
          </button>
        </div>
      </div>
      <div className="col-span-8">
        <DataTable
          pageTitle=""
          dataListName="Categorias"
          searchInputPlaceHolder="Titulo de la categoría..."
          searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
          searchKeywordOnChangeHandler={searchKeywordHandler}
          searchKeyword={searchKeyword}
          tableHeaderTitleList={["Título", "Creado a las", ""]}
          isLoading={isLoading}
          isFetching={isFetching}
          data={categoriesData?.data}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          headers={categoriesData?.headers}
          userState={userState}
        >
          {categoriesData?.data.map((category) => (
            <tr key={category._id}>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {category.title}
                  </p>
                </div>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p className="text-gray-900 whitespace-no-wrap">
                  {new Date(category.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
                <button
                  disabled={isLoadingDeleteData}
                  type="button"
                  className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={() => {
                    showDeleteConfirmation(category, userState.userInfo.token);
                  }}
                >
                  Eliminar
                </button>
                <Link
                  to={`/admin/categories/manage/edit/${category?._id}`}
                  className="text-green-600 hover:text-green-900"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
};

export default Categories;
