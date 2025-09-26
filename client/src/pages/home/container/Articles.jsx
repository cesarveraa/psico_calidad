import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ArticleCard from "../../../components/ArticleCard";
import ErrorMessage from "../../../components/ErrorMessage";
import { getAllPosts } from "../../../services/index/posts";
import ArticleSkeleton from "../../../components/ArticleSkeleton";

const Articles = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts("", 1, 6),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="container mx-auto px-5 py-15">
      <br />
      <br />
      <h2
        className="font-bold text-center lg:text-left text-3xl lg:text-4xl xl:text-5xl md:leading-snug"
        style={{
          backgroundImage: "linear-gradient(120deg, #a1c4fd, #c2e9fb)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0px 0px 5px #6effd4, 0px 0px 10px #a1c4fd, 0px 0px 15px #c2e9fb",
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: "#000",
        }}
      >
        NOTICIAS
      </h2>
      <br />
      <br />
      <div>
        {isLoading ? (
          <ArticleSkeleton />
        ) : isError ? (
          <ErrorMessage message="No se pudieron obtener los datos de las noticias" />
        ) : (
          <Slider {...settings}>
            {data?.data.map((post) => (
              <ArticleCard
                key={post._id}
                post={post}
                className="px-3"
              />
            ))}
          </Slider>
        )}
      </div>
      <Link
        to="/Noticias"
        className="mx-auto flex items-center gap-x-2 font-bold bg-primary text-white border-2 border-primary px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span>Más Artículos</span>
        <FaArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
};

export default Articles;
