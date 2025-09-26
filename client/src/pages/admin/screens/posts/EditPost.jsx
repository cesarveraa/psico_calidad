import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineCamera } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import ErrorMessage from "../../../../components/ErrorMessage";
import Editor from "../../../../components/editor/Editor";
import { stables } from "../../../../constants";
import { createSystemLog } from "../../../../services/index/logsSistema";
import { getAllCategories } from "../../../../services/index/postCategories";
import { getSinglePost, updatePost } from "../../../../services/index/posts";
import {
  categoryToOption,
  filterCategories,
} from "../../../../utils/multiSelectTagUtils";
import ArticleDetailSkeleton from "../../../articleDetail/components/ArticleDetailSkeleton";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};

const EditPost = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState(null);
  const [categories, setCategories] = useState(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(null);
  const [postSlug, setPostSlug] = useState(slug);
  const [caption, setCaption] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setTags(data.tags);
    },
    refetchOnWindowFocus: false,
  });

  const {
    mutate: mutateUpdatePostDetail,
    isLoading: isLoadingUpdatePostDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updatePost({ updatedData, slug, token });
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries(["blog", slug]);
      toast.success("Publicación actualizada");
      await createSystemLog(
        {
          userId: userState.userInfo._id,
          email: userState.userInfo.email,
          sistema: "manage_posts",
          accion: `Actualizó la publicación: ${title}`,
        },
        userState.userInfo.token
      );
      navigate(`/admin/posts/manage/edit/${data.slug}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleUpdatePost = async () => {
    let updatedData = new FormData();

    if (!initialPhoto && photo) {
      updatedData.append("postPicture", photo);
    } else if (initialPhoto && !photo) {
      const urlToObject = async (url) => {
        let reponse = await fetch(url);
        let blob = await reponse.blob();
        const file = new File([blob], initialPhoto, { type: blob.type });
        return file;
      };
      const picture = await urlToObject(
        stables.UPLOAD_FOLDER_BASE_URL + data?.photo
      );
      updatedData.append("postPicture", picture);
    }

    updatedData.append(
      "document",
      JSON.stringify({
        body,
        categories,
        title,
        tags,
        slug: postSlug,
        caption,
      })
    );

    mutateUpdatePostDetail({
      updatedData,
      slug,
      token: userState.userInfo.token,
    });
  };

  const handleDeleteImage = () => {
    if (window.confirm("¿Desea eliminar la foto de la publicación?")) {
      setInitialPhoto(null);
      setPhoto(null);
    }
  };

  let isPostDataLoaded = !isLoading && !isError;

  return (
    <div>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="No se pudo cargar el detalle de la publicación" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="postPicture" className="w-full cursor-pointer">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : initialPhoto ? (
                <img
                  src={stables.UPLOAD_FOLDER_BASE_URL + data?.photo}
                  alt={data?.title}
                  className="rounded-xl w-full"
                />
              ) : (
                <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
                  <HiOutlineCamera className="w-7 h-auto text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="postPicture"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleDeleteImage}
              className="w-fit bg-red-500 text-sm text-white font-semibold rounded-lg px-2 py-1 mt-5"
            >
              Eliminar Imagen
            </button>
            <div className="mt-4 flex gap-2">
              {data?.categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/blog?category=${category.name}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="title">
                <span className="d-label-text">Título</span>
              </label>
              <input
                id="title"
                value={title}
                className="d-input d-input-bordered border-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="caption">
                <span className="d-label-text">Leyenda</span>
              </label>
              <input
                id="caption"
                value={caption}
                className="d-input d-input-bordered border-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Leyenda"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="slug">
                <span className="d-label-text">Slug</span>
              </label>
              <input
                id="slug"
                value={postSlug}
                className="d-input d-input-bordered border-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) =>
                  setPostSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
                }
                placeholder="Slug del post"
              />
            </div>
            <div className="mb-5 mt-2">
              <label className="d-label">
                <span className="d-label-text">Categorías</span>
              </label>
              {isPostDataLoaded && (
                <MultiSelectTagDropdown
                  loadOptions={promiseOptions}
                  defaultValue={data.categories.map(categoryToOption)}
                  onChange={(newValue) =>
                    setCategories(newValue.map((item) => item.value))
                  }
                />
              )}
            </div>
            <div className="mb-5 mt-2">
              <label className="d-label">
                <span className="d-label-text">Tags</span>
              </label>
              {isPostDataLoaded && (
                <CreatableSelect
                  defaultValue={data.tags.map((tag) => ({
                    value: tag,
                    label: tag,
                  }))}
                  isMulti
                  onChange={(newValue) =>
                    setTags(newValue.map((item) => item.value))
                  }
                  className="relative z-20"
                />
              )}
            </div>
            <div className="w-full">
              {isPostDataLoaded && (
                <Editor
                  content={data?.body}
                  editable={true}
                  onDataChange={(data) => {
                    setBody(data);
                  }}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdatePostDetail}
              type="button"
              onClick={handleUpdatePost}
              className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Actualizar Publicación
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditPost;
