import { useEffect } from "react";
import { Link } from "react-router-dom";
import { images, stables } from "../../../../constants";
import { useDataTable } from "../../../../hooks/useDataTable";
import { deleteBook, getAllBooks } from "../../../../services/index/books";
import { createSystemLog } from "../../../../services/index/logsSistema";
import DataTable from "../../components/DataTable";

const ManageBooks = () => {
  const {
    userState,
    currentPage,
    searchKeyword,
    data: booksData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllBooks(searchKeyword, currentPage),
    dataQueryKey: "books",
    deleteDataMessage: "Book is deleted",
    mutateDeleteFn: async ({ slug, token }) => {
      const book = booksData?.data.find((b) => b.slug === slug);

      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_books",
        accion: `Eliminó el libro: ${book?.title || slug}`,
      }, token);

      return deleteBook({ slug, token });
    },
  });

  useEffect(() => {
    if (userState.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_books",
        accion: "Accedió a la gestión de libros",
      }, userState.userInfo.token).catch(console.error);
    }
  }, []);

  return (
    <DataTable
      pageTitle="Administrar Libros"
      dataListName="Libros"
      searchInputPlaceHolder="Título del libro..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Titulo", "Categoria", "Creado a las", "Tags", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={booksData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={booksData?.headers}
      userState={userState}
    >
      {booksData?.data.map((book) => (
        <tr key={book._id}>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="relative block">
                  <img
                    src={
                      book?.file
                        ? stables.UPLOAD_FOLDER_BASE_URL + book?.file
                        : images.sampleBookImage
                    }
                    alt={book.title}
                    className="mx-auto object-cover rounded-lg w-10 aspect-square"
                  />
                </a>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">{book.title}</p>
              </div>
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {book.categories.length > 0
                ? book.categories
                    .slice(0, 3)
                    .map(
                      (category, index) =>
                        `${category.title}${
                          book.categories.slice(0, 3).length === index + 1
                            ? ""
                            : ", "
                        }`
                    )
                : "Sin categoría"}
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(book.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex gap-x-2">
              {book.tags.length > 0
                ? book.tags.map((tag, index) => (
                    <p key={index}>
                      {tag}
                      {book.tags.length - 1 !== index && ","}
                    </p>
                  ))
                : "Sin tags"}
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeleteData}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() => {
                deleteDataHandler({
                  slug: book?.slug,
                  token: userState.userInfo.token,
                });
              }}
            >
              Eliminar
            </button>
            <Link
              to={`/admin/books/manage/edit/${book?.slug}`}
              className="text-green-600 hover:text-green-900"
              onClick={() => {
                createSystemLog({
                  userId: userState.userInfo._id,
                  email: userState.userInfo.email,
                  sistema: "manage_books",
                  accion: `Ingresó a editar libro: ${book?.slug}`,
                }, userState.userInfo.token).catch(console.error);
              }}
            >
              Editar
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default ManageBooks;
