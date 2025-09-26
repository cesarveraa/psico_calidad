import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    getSingleBookCategory,
    updateBookCategory,
} from "../../../../services/index/bookCategories";

const EditCategoriesBooks = () => {
  const queryClient = useQueryClient();
  const [categoryTitle, setCategoryTitle] = useState("");
  const navigate = useNavigate();
  const { bookCategoryId } = useParams();
  const userState = useSelector((state) => state.user);

  const { isLoading, isError } = useQuery({
    queryFn: () => getSingleBookCategory({ bookCategoryId }),
    queryKey: ["bookCategories", bookCategoryId],
    onSuccess: (data) => {
      setCategoryTitle(data?.title);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: mutateUpdateCategory, isLoading: isLoadingUpdateCategory } =
    useMutation({
      mutationFn: ({ title, bookCategoryId, token }) => {
        return updateBookCategory({
          title,
          bookCategoryId,
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["bookCategories", bookCategoryId]);
        toast.success("Categoría de libro actualizada");
        navigate(`/admin/book-categories/manage/edit/${data._id}`, {
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
      bookCategoryId,
      token: userState.userInfo.token,
    });
  };

  return (
    <div className="col-span-4 py-8">
      <h4 className="text-lg leading-tight">Actualiza la categoría de libro</h4>
      <div className="d-form-control w-full mt-6">
        <input
          value={categoryTitle}
          className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
          onChange={(e) => setCategoryTitle(e.target.value)}
          placeholder="Título de la categoría"
        />
        <button
          disabled={isLoadingUpdateCategory || isLoading || isError}
          type="button"
          onClick={handleUpdateCategory}
          className="w-fit mt-3 bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Actualizar Categoría
        </button>
      </div>
    </div>
  );
};

export default EditCategoriesBooks;
