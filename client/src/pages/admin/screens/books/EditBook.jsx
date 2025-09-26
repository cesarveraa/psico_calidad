import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import ErrorMessage from "../../../../components/ErrorMessage";
import Editor from "../../../../components/editor/Editor";
import { stables } from "../../../../constants";
import { getAllBookCategories } from "../../../../services/index/bookCategories";
import { getSingleBook, updateBook } from "../../../../services/index/books";
import {
  categoryToOption,
  filterCategories,
} from "../../../../utils/multiSelectTagUtils";
import BookDetailSkeleton from "../../../articleDetail/components/BookDetailSkeleton";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllBookCategories();
  return filterCategories(inputValue, categoriesData);
};

const EditBook = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [initialFile, setInitialFile] = useState(null);
  const [file, setFile] = useState(null);
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [bookSlug, setBookSlug] = useState(slug);
  const [description, setDescription] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSingleBook({ slug }),
    queryKey: ["book", slug],
    onSuccess: (data) => {
      setInitialFile(data?.file);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setTags(data.tags);
      setDescription(data.description);  // Set description from fetched data
      setBody(data.body);  // Set body from fetched data
    },
    refetchOnWindowFocus: false,
  });

  const {
    mutate: mutateUpdateBookDetail,
    isLoading: isLoadingUpdateBookDetail,
  } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updateBook({
        updatedData,
        slug,
        token,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["book", slug]);
      toast.success("Book is updated");
      navigate(`/admin/books/manage/edit/${data.slug}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleUpdateBook = async () => {
    let updatedData = new FormData();

    if (!initialFile && file) {
      updatedData.append("bookFile", file);
    } else if (initialFile && !file) {
      const urlToObject = async (url) => {
        let response = await fetch(url);
        let blob = await response.blob();
        const file = new File([blob], initialFile, { type: blob.type });
        return file;
      };
      const bookFile = await urlToObject(
        stables.UPLOAD_FOLDER_BASE_URL + data?.file
      );

      updatedData.append("bookFile", bookFile);
    }

    updatedData.append(
      "document",
      JSON.stringify({
        body,
        categories,
        title,
        tags,
        slug: bookSlug,
        description, // Ensure description is included
      })
    );

    mutateUpdateBookDetail({
      updatedData,
      slug,
      token: userState.userInfo.token,
    });
  };

  const handleDeleteFile = () => {
    if (window.confirm("Desea eliminar el archivo del libro?")) {
      setInitialFile(null);
      setFile(null);
    }
  };

  let isBookDataLoaded = !isLoading && !isError;

  return (
    <div>
      {isLoading ? (
        <BookDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the book detail" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <label htmlFor="bookFile" className="w-full cursor-pointer">
              {file ? (
                <div className="rounded-xl w-full bg-slate-200 flex justify-center items-center p-5">
                  <HiOutlineDocumentText className="w-7 h-auto text-primary" />
                  <span className="ml-2">{file.name}</span>
                </div>
              ) : initialFile ? (
                <div className="rounded-xl w-full bg-slate-200 flex justify-center items-center p-5">
                  <HiOutlineDocumentText className="w-7 h-auto text-primary" />
                  <span className="ml-2">{data?.file}</span>
                </div>
              ) : (
                <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
                  <HiOutlineDocumentText className="w-7 h-auto text-primary" />
                </div>
              )}
            </label>
            <input
              type="file"
              className="sr-only"
              id="bookFile"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleDeleteFile}
              className="w-fit bg-red-500 text-sm text-white font-semibold rounded-lg px-2 py-1 mt-5"
            >
              Eliminar Archivo
            </button>
            <div className="mt-4 flex gap-2">
              {data?.categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/books?category=${category.title}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base"
                >
                  {category.title}
                </Link>
              ))}
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="title">
                <span className="d-label-text">Titulo</span>
              </label>
              <input
                id="title"
                value={title}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="titulo"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="description">
                <span className="d-label-text">Descripcion</span>
              </label>
              <input
                id="description"
                value={description}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="descripcion"
              />
            </div>
            <div className="d-form-control w-full">
              <label className="d-label" htmlFor="slug">
                <span className="d-label-text">slug</span>
              </label>
              <input
                id="slug"
                value={bookSlug}
                className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
                onChange={(e) =>
                  setBookSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
                }
                placeholder="book slug"
              />
            </div>
            <div className="mb-5 mt-2">
              <label className="d-label">
                <span className="d-label-text">Categorias</span>
              </label>
              {isBookDataLoaded && (
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
                <span className="d-label-text">tags</span>
              </label>
              {isBookDataLoaded && (
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
              {isBookDataLoaded && (
                <Editor
                  content={body}
                  editable={true}
                  onDataChange={(data) => {
                    setBody(data);
                  }}
                />
              )}
            </div>
            <button
              disabled={isLoadingUpdateBookDetail}
              type="button"
              onClick={handleUpdateBook}
              className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Actualizar Libro
            </button>
          </article>
        </section>
      )}
    </div>
  );
};

export default EditBook;
