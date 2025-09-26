import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import MainLayout from "../components/MainLayout";
import { images } from "../constants";
import { getAllPosts } from "../services/index/posts";
import Skeleton from '@mui/material/Skeleton';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllPosts(query);
        setPosts(data);
      } catch (error) {
        setIsError(true);
        toast.error("Error fetching search results");
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchPosts();
    }
  }, [query]);

  return (
    <MainLayout>
      <div className="container mx-auto px-5 py-10">
        <h1
          style={{
            backgroundImage: "linear-gradient(120deg, #a1c4fd, #c2e9fb)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow:
              "0px 0px 5px #6effd4, 0px 0px 10px #a1c4fd, 0px 0px 15px #c2e9fb",
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: "#000",
          }}
          className="text-4xl font-extrabold mb-10 text-center text-blue-600"
        >
          Resultados de búsqueda para "{query}"
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="p-4">
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-lg text-red-500">
            Hubo un error al cargar los resultados.
          </p>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center h-full">
            <img
              className="w-64 h-auto transform transition-transform hover:scale-105"
              src={images.psico}
              alt="No hay productos disponibles"
            />
            <p className="text-xl font-bold text-gray-700 mt-4">
              No se encontraron resultados para "{query}".
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchResults;