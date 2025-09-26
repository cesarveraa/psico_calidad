import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleCategory,
  updateCategory,
} from "../../../../services/index/postCategories";

const EditCategories = () => {
  const queryClient = useQueryClient();
  const [categoryTitle, setCategoryTitle] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);

  const { isLoading, isError } = useQuery({
    queryFn: () => getSingleCategory({ slug }),
    queryKey: ["categorias", slug],
    onSuccess: (data) => {
      setCategoryTitle(data?.title);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: mutateUpdateCategory, isLoading: isLoadingUpdateCategory } =
    useMutation({
      mutationFn: ({ title, slug, token }) => {
        return updateCategory({
          title,
          slug,
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["categorias", slug]);
        toast.success("categoria actualizada");
        navigate(`/admin/categories/manage/edit/${data._id}`, {
          replace: true,
        });
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const handleUpdateCategory = () => {
    if (!categoryTitle) return;
    mutateUpdateCategory({
      title: categoryTitle,
      slug,
      token: userState.userInfo.token,
    });
  };

  return (
    <div className="col-span-4 py-8">
      <h4 className="text-lg leading-tight">Actualiza la categoria</h4>
      <div className="d-form-control w-full mt-6">
        <input
          value={categoryTitle}
          className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
          onChange={(e) => setCategoryTitle(e.target.value)}
          placeholder="titulo de la categoria"
        />
        <button
          disabled={isLoadingUpdateCategory || isLoading || isError}
          type="button"
          onClick={handleUpdateCategory}
          className="w-fit mt-3 bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Actualizar Categoria
        </button>
      </div>
    </div>
  );
};

export default EditCategories;
