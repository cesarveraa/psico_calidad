// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import BreadCrumbs from "../../components/BreadCrumbs";
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";
import SocialShareButtons from "../../components/SocialShareButtons";
import { images } from "../../constants";
import { getProductById, getAllProducts } from "../../services/index/products";
import ProductDetailSkeleton from "./productSkeleton";
import { toast } from "react-hot-toast";
import { FaShoppingCart } from 'react-icons/fa';
import CartSummary from "./cartSummary";

const LOCAL_STORAGE_KEY = 'psicoTienda_cart';

const getRandomColor = () => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33B8"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const userState = useSelector((state) => state.user);
  const [breadCrumbsData, setBreadCrumbsData] = useState([]);
  const [moreProducts, setMoreProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []);
  const [showCartSummary, setShowCartSummary] = useState(false);
  const cartSummaryRef = useRef();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getProductById(id),
    queryKey: ["product", id],
    onSuccess: (data) => {
      setBreadCrumbsData([
        { name: "Inicio", link: "/" },
        { name: "Productos", link: "/tienda" },
        { name: data.name, link: `/product/${data._id}` },
      ]);
    },
  });

  const handleAddToCart = (product) => {
    const productIndex = cart.findIndex(item => item._id === product._id);
    let updatedCart;
    if (productIndex >= 0) {
      updatedCart = cart.map((item, index) =>
        index === productIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    toast.success("Producto agregado al carrito");
  };

  const handleClickOutside = (event) => {
    if (cartSummaryRef.current && !cartSummaryRef.current.contains(event.target)) {
      setShowCartSummary(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMoreProducts = async () => {
      try {
        const products = await getAllProducts();
        setMoreProducts(products.filter(product => product._id !== id));
      } catch (error) {
        console.error("Failed to fetch more products", error);
      }
    };
    fetchMoreProducts();
  }, [id]);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl p-5">
        {isLoading ? (
          <ProductDetailSkeleton />
        ) : isError ? (
          <ErrorMessage message="No se pudo obtener el detalle del producto" />
        ) : (
          <section className="flex flex-col lg:flex-row lg:gap-x-5 lg:items-start">
            <article className="flex-1 bg-white p-6 rounded-lg shadow-md">
              <BreadCrumbs data={breadCrumbsData} />
              <img
                className="rounded-xl w-full object-cover h-96"
                src={data?.imageUrl[0] || images.noImageAvailable}
                alt={data?.name}
              />
              <div className="mt-4 flex gap-2 flex-wrap">
                {data?.categories.map((category) => (
                  <Link
                    to={`/tienda?category=${category._id}`}
                    key={category._id}
                    className="bg-purple-100 text-purple-800 text-sm font-roboto inline-block md:text-base px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
              <h1 className="text-2xl font-semibold font-roboto mt-4 text-gray-800">
                {data?.name}
              </h1>
              <p className="text-xl text-green-600 mt-2 font-bold">{data?.price}Bs.</p>
              <p className="mt-4 text-gray-600 leading-relaxed">{data?.description}</p>
              <div className="flex items-center gap-4 mt-6">
                <button
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium text-lg hover:shadow-md transition-transform transform hover:scale-105"
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = getRandomColor();
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "blue";
                  }}
                  onClick={() => handleAddToCart(data)}
                >
                  Agregar al carrito
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowCartSummary(!showCartSummary)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors relative"
                  >
                    <FaShoppingCart size={24} />
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 inline-block w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full text-center">
                        {cart.length}
                      </span>
                    )}
                  </button>
                  {showCartSummary && (
                    <div ref={cartSummaryRef} className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
                      <CartSummary cart={cart} onClose={() => setShowCartSummary(false)} />
                    </div>
                  )}
                </div>
              </div>
            </article>
            <div className="lg:max-w-xs mt-10 lg:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="font-roboto font-medium text-gray-800 mb-4 md:text-xl">
                  Compartir:
                </h2>
                <SocialShareButtons
                  url={encodeURI(window.location.href)}
                  title={encodeURIComponent(data?.name)}
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Más productos</h2>
                <div className="grid grid-cols-1 gap-4">
                  {moreProducts.map((product) => (
                    <Link to={`/product/${product._id}`} key={product._id} className="bg-gray-100 p-4 rounded-lg hover:shadow-lg transition-shadow">
                      <img
                        className="rounded-xl w-full object-cover h-32"
                        src={product.imageUrl[0] || images.noImageAvailable}
                        alt={product.name}
                      />
                      <h3 className="text-lg font-medium text-gray-800 mt-2">{product.name}</h3>
                      <p className="text-green-600 font-bold">{product.price}Bs.</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
