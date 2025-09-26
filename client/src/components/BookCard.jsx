import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa";
import { images, stables } from "../constants";
import { getAllBookCategories } from "../services/index/bookCategories";

const BookCard = ({ book, className }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryIds = book.categories.map((cat) => cat._id) || [];
        const categoriesData = await getAllBookCategories();
        const matchedCategories = categoriesData.data.filter((cat) =>
          categoryIds.includes(cat._id)
        );
        setCategories(matchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [book.categories]);

  const handleCardClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDownload = () => {
    window.open(stables.UPLOAD_FOLDER_BASE_URL + book.file, '_blank');
    setShowPopup(false);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_10px] ${className} bg-white dark:bg-gradient-to-r dark:from-[#0a4073] dark:via-[#1a5073] dark:to-[#1a5073]`}
    >
      <div onClick={handleCardClick} className="cursor-pointer">
        {book.cover ? (
          <img
            src={stables.UPLOAD_FOLDER_BASE_URL + book.cover}
            alt={book.title}
            className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-auto md:h-52 lg:h-48 xl:h-60 bg-gray-200">
            <FaFilePdf className="w-12 h-12 text-gray-600" />
          </div>
        )}
        <div className="p-5">
          <h2 className="font-roboto font-bold text-xl text-dark-light-400 md:text-2xl lg:text-[28px] dark:text-white">
            {book.title}
          </h2>
          <p className="text-dark-light mt-3 text-sm md:text-lg dark:text-gray-400">
            {book.caption}
          </p>
          <div className="flex justify-between flex-nowrap items-center mt-6">
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
              {new Date(book.createdAt).getDate()}{" "}
              {new Date(book.createdAt).toLocaleString("default", {
                month: "long",
              })}
            </span>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-3/4 overflow-y-auto text-dark-hard dark:bg-dark-soft">
            <h3 className="text-lg font-bold mb-2 text-dark-hard dark:text-white">{book.title}</h3>
            <p className="text-sm mb-2 text-dark-hard dark:text-gray-400">{book.description}</p>
            
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleClosePopup}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleDownload}
              >
                Abrir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
