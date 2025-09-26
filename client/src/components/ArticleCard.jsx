import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { images, stables } from "../constants";
import { getAllCategories } from "../services/index/postCategories";

const ArticleCard = ({ post, className }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryIds = post.categories.map((cat) => cat._id) || [];
        const categoriesData = await getAllCategories();
        const matchedCategories = categoriesData.data.filter((cat) =>
          categoryIds.includes(cat._id)
        );
        setCategories(matchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [post.categories]);

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 ${className} bg-white dark:bg-dark-hard`}
      style={{ minHeight: "400px" }}
    >
      <Link to={`/blog/${post.slug}`}>
        <div className="w-full h-48">
          <img
            src={
              post.photo
                ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
                : images.samplePostImage
            }
            alt="title"
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px] dark:text-white">
            {post.title}
          </h2>
          <p className="text-dark-light mt-3 text-sm md:text-lg dark:text-gray-400">
            {post.caption}
          </p>
        </Link>
        <div className="flex justify-between items-center mt-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category._id}
                className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-xs md:text-sm"
              >
                {category.title}
              </span>
            ))}
          </div>
          <span className="font-bold text-dark-light italic text-sm md:text-base dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
