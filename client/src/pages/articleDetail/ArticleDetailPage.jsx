import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { AiOutlineCaretDown, AiOutlineCheck, AiOutlineLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import BreadCrumbs from "../../components/BreadCrumbs";
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";
import SocialShareButtons from "../../components/SocialShareButtons";
import CommentsContainer from "../../components/comments/CommentsContainer";
import Editor from "../../components/editor/Editor";
import { images, stables } from "../../constants";
import { getAllPosts, getSinglePost, likePost, respondToEvent } from "../../services/index/posts";
import { getAllCategories } from "../../services/index/postCategories";
import parseJsonToHtml from "../../utils/parseJsonToHtml";
import ArticleDetailSkeleton from "./components/ArticleDetailSkeleton";
import SuggestedPosts from "./container/SuggestedPosts";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);
  const userId = userState?.userInfo?._id;
  const token = userState?.userInfo?.token;
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [eventResponse, setEventResponse] = useState("");
  const [isEvent, setIsEvent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]); 

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: async (data) => {
      setbreadCrumbsData([
        { name: "Inicio", link: "/" },
        { name: "Formacion", link: "/blog" },
        { name: data.title, link: `/blog/${data.slug}` },
      ]);
      setBody(parseJsonToHtml(data?.body));
      setLikes(data?.likes);
      setHasLiked(data?.likedBy.includes(userId));

      const categoryIds = data?.categories.map(cat => cat._id) || [];
      const categoriesData = await getAllCategories();
      const matchedCategories = categoriesData.data.filter(cat => categoryIds.includes(cat._id));
      setCategories(matchedCategories);
      setEventResponse(data?.eventResponses?.[userId] || "");
      setIsEvent(data?.categories.some(category => category.title === "Eventos"));
    },
  });

  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });

  const mutation = useMutation({
    mutationFn: ({ slug, response }) => respondToEvent(slug, response, token),
    onSuccess: (updatedPost) => {
      setEventResponse(updatedPost.eventResponses[userId]);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLike = async () => {
    if (!userId) {
      alert("Debes haber iniciado sesión para darle like al post");
      return;
    }

    try {
      const updatedPost = await likePost(slug, token);
      setLikes(updatedPost.likes);
      setHasLiked(updatedPost.likedBy.includes(userId));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const categoryTitles = categories.map(category => category.title);

  const handleEventResponse = (response) => {
    if (!userId) {
      alert("Debes haber iniciado sesión para responder al evento");
      return;
    }
    mutation.mutate({ slug, response });
    setEventResponse(response);
    setShowDropdown(false);
  };

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
          <article className="flex-1">
            <BreadCrumbs data={breadCrumbsData} />
            <img
              className="rounded-xl w-full"
              src={
                data?.photo
                  ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                  : images.samplePostImage
              }
              alt={data?.title}
            />
            <div className="mt-4 flex gap-2 text-dark-light-400 dark:text-gray-400">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/blog?category=${category.title}`}
                  className="text-primary text-sm font-roboto inline-block md:text-base"
                >
                  {category.title}
                </Link>
              ))}
            </div>
            <h1 className="text-xl font-medium font-roboto mt-4 md:text-[26px] text-dark-light-100 dark:text-white">
              {data?.title}
            </h1>
            <div className="desc w-full text-dark-light-400 dark:text-gray-400">
              {!isLoading && !isError && (
                <Editor content={data?.body} editable={false} className="text-dark-light-400 dark:text-white" />
              )}
            </div>
            <div className="mt-4 flex items-center">
              <button
                onClick={handleLike}
                className={`flex items-center transition duration-300 ${hasLiked ? 'text-blue-600' : 'text-dark-100 dark:text-gray-400 hover:text-light-400'}`}
              >
                <AiOutlineLike className="w-6 h-6 mr-2" />
                {hasLiked ? 'Unlike' : 'Like'} ({likes})
              </button>
            </div>
            {isEvent && (
              <div className="relative mt-4">
                <h2 className="text-lg font-medium ">¿Te interesa este evento?</h2>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="mt-2 py-2 px-4 rounded bg-light-dark-400 text-grey-800 hover:bg-blue-200 focus:outline-none w-60 text-left flex justify-between items-center dark: bg-blue-500"
                >
                  <span>{eventResponse || "Seleccione una opción"}</span>
                  <AiOutlineCaretDown className={`transform transition-transform ${showDropdown ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                {showDropdown && (
                  <div className="absolute mt-2 w-60 bg-dark-400 rounded-md shadow-lg z-10 text-white-800 dark: bg-blue-900">
                    <div
                      onClick={() => handleEventResponse("Asistiré")}
                      className={`py-2 px-4 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center ${eventResponse === "Asistiré" ? "bg-blue-100 text-black" : "text-white"}`}
                    >
                      <AiOutlineCheck className={`mr-2 ${eventResponse === "Asistiré" ? "text-blue-500" : "invisible text-blue-500"}`} />
                      Asistiré
                    </div>
                    <div
                      onClick={() => handleEventResponse("No me interesa")}
                      className={`py-2 px-4 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center ${eventResponse === "No me interesa" ? "bg-blue-100 text-black" : "text-white"}`}
                    >
                      <AiOutlineCheck className={`mr-2 ${eventResponse === "No me interesa" ? "text-blue-500" : "text-blue-800"}`} />
                      No me interesa
                    </div>
                    <div
                      onClick={() => handleEventResponse("Me interesa")}
                      className={`py-2 px-4 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center ${eventResponse === "Me interesa" ? "bg-blue-100 text-black" : "text-white"}`}
                    >
                      <AiOutlineCheck className={`mr-2 ${eventResponse === "Me interesa" ? "text-blue-500" : "invisible"}`} />
                      Me interesa
                    </div>
                  </div>
                )}
              </div>
            )}
            <CommentsContainer
              comments={data?.comments}
              className="mt-10"
              logginedUserId={userState?.userInfo?._id}
              postSlug={slug}
            />
          </article>
          <div>
            <SuggestedPosts
              header="Ultimos articulos"
              posts={postsData?.data}
              tags={data?.tags}
              className="mt-8 lg:mt-0 lg:max-w-xs"
            />
            <div className="mt-7">
              <h2 className="font-roboto font-medium  mb-4 md:text-xl dark:text-white">
                Compartir:
              </h2>
              <SocialShareButtons
                url={encodeURI(window.location.href)}
                title={data.title}
                categorias={categoryTitles} 
                token={token} 
              />
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;
