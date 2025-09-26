import { useEffect } from "react";
import { Link } from "react-router-dom";
import { images, stables } from "../../../../constants";
import { useDataTable } from "../../../../hooks/useDataTable";
import { createSystemLog } from "../../../../services/index/logsSistema";
import { deletePost, getAllPosts } from "../../../../services/index/posts";
import DataTable from "../../components/DataTable";

const ManagePosts = () => {
  const {
    userState,
    currentPage,
    searchKeyword,
    data: postsData,
    isLoading,
    isFetching,
    isLoadingDeleteData,
    queryClient,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    deleteDataHandler,
    setCurrentPage,
  } = useDataTable({
    dataQueryFn: () => getAllPosts(searchKeyword, currentPage),
    dataQueryKey: "posts",
    deleteDataMessage: "Post is deleted",
    mutateDeleteFn: async ({ slug, token }) => {
      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_posts",
        accion: `Eliminó el post: ${slug}`,
      }, token);
      return deletePost({ slug, token });
    },
  });

  useEffect(() => {
    if (userState.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_posts",
        accion: "Accedió a la gestión de publicaciones",
      }, userState.userInfo.token).catch(console.error);
    }
  }, []);

  const countEventResponses = (responses) => {
    const counts = { interested: 0, notInterested: 0, attending: 0 };
    if (responses) {
      Object.values(responses).forEach(response => {
        if (response === "Me interesa") counts.interested += 1;
        else if (response === "No me interesa") counts.notInterested += 1;
        else if (response === "Asistiré") counts.attending += 1;
      });
    }
    return counts;
  };

  return (
    <DataTable
      pageTitle="Administrar Publicaciones"
      dataListName="Publicaciones"
      searchInputPlaceHolder="Título de la publicación..."
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Titulo", "Categoria", "Creado a las", "Tags", "Likes", "Respuestas del Evento", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={postsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={postsData?.headers}
      userState={userState}
    >
      {postsData?.data.map((post) => {
        const isEvent = post.categories.some(category => category.title === "Eventos");
        const eventCounts = isEvent ? countEventResponses(post.eventResponses) : null;

        return (
          <tr key={post._id}>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="relative block">
                    <img
                      src={post?.photo ? stables.UPLOAD_FOLDER_BASE_URL + post?.photo : images.samplePostImage}
                      alt={post.title}
                      className="mx-auto object-cover rounded-lg w-10 aspect-square"
                    />
                  </a>
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">{post.title}</p>
                </div>
              </div>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {post.categories.length > 0 ?
                  post.categories.slice(0, 3).map((category, index) => `${category.title}${post.categories.slice(0, 3).length === index + 1 ? "" : ", "}`)
                  : "Sin categoría"}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <div className="flex gap-x-2">
                {post.tags.length > 0 ?
                  post.tags.map((tag, index) => <p key={tag}>{tag}{post.tags.length - 1 !== index && ","}</p>)
                  : "Sin tags"}
              </div>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">{post.likes}</p>
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              {isEvent && (
                <div>
                  <p className="text-sm text-gray-600">Interesados: {eventCounts.interested}</p>
                  <p className="text-sm text-gray-600">No interesados: {eventCounts.notInterested}</p>
                  <p className="text-sm text-gray-600">Asistirán: {eventCounts.attending}</p>
                </div>
              )}
            </td>
            <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
              <button
                disabled={isLoadingDeleteData}
                type="button"
                className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => {
                  deleteDataHandler({
                    slug: post?.slug,
                    token: userState.userInfo.token,
                  });
                }}
              >
                Eliminar
              </button>
              <Link
                to={`/admin/posts/manage/edit/${post?.slug}`}
                className="text-green-600 hover:text-green-900"
                onClick={() => {
                  createSystemLog({
                    userId: userState.userInfo._id,
                    email: userState.userInfo.email,
                    sistema: "manage_posts",
                    accion: `Ingresó a editar post: ${post?.slug}`,
                  }, userState.userInfo.token).catch(console.error);
                }}
              >
                Editar
              </Link>
            </td>
          </tr>
        );
      })}
    </DataTable>
  );
};

export default ManagePosts;
