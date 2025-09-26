// src/pages/ProductsPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllProducts } from '../../services/index/products';
import { getAllCategories } from '../../services/index/categoryService';
import MainLayout from "../../components/MainLayout";
import { images } from "../../constants";
import { FaShoppingCart } from 'react-icons/fa';
import CartSummary from './cartSummary';

const LOCAL_STORAGE_KEY = 'psicoTienda_cart';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCartSummary, setShowCartSummary] = useState(false);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []);
  const navigate = useNavigate();

  const searchParamsValue = Object.fromEntries([...searchParams]);
  const currentPage = parseInt(searchParamsValue?.page) || 1;
  const searchKeyword = searchParamsValue?.search || "";
  const selectedCategory = searchParamsValue?.category || "";

  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setCategories(data);
    },
    onError: (error) => {
      toast.error("Error al cargar las categorías");
    },
  });

  const cartSummaryRef = useRef();

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
    setLoading(true);
    if (products) {
      let filtered = products;
      if (searchKeyword) {
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          product.description.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      if (selectedCategory) {
        filtered = filtered.filter(product => 
          product.categories.some(category => category._id === selectedCategory)
        );
      }
      setFilteredProducts(filtered);
      setLoading(false);
    }
  }, [products, searchKeyword, selectedCategory]);

  const handlePageChange = (page) => {
    setLoading(true);
    setSearchParams({ page, search: searchKeyword, category: selectedCategory });
  };

  const handleSearch = (e) => {
    setLoading(true);
    const value = e.target.value;
    setSearchParams({ page: 1, search: value, category: selectedCategory });
  };

  const handleCategoryChange = (e) => {
    setLoading(true);
    const value = e.target.value;
    setSearchParams({ page: 1, search: searchKeyword, category: value });
  };

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

  const toggleCartSummary = () => {
    setShowCartSummary(!showCartSummary);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const totalPageCount = Math.ceil(filteredProducts.length / 12);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * 12, currentPage * 12);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl p-5">
        <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-4 text-4xl font-bold uppercase rounded-lg shadow-lg">
          Lista de Productos
        </section>
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6 mt-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearch}
            placeholder="Buscar productos..."
            className="w-full md:w-1/3 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full md:w-1/3 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Todas las Categorías</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.title}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end mt-4 relative">
          <div className="relative">
            <button
              onClick={toggleCartSummary}
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
                <CartSummary cart={cart} onClose={toggleCartSummary} />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading || loading ? (
            [...Array(12)].map((_, index) => (
              <div key={index} className="bg-gray-300 p-4 rounded-lg shadow-md animate-pulse">
                <div className="rounded-lg w-full h-48 bg-gray-400"></div>
                <div className="mt-2 h-6 bg-gray-400 rounded w-3/4"></div>
                <div className="mt-2 h-4 bg-gray-400 rounded w-1/2"></div>
                <div className="mt-1 h-6 bg-gray-400 rounded w-1/4"></div>
              </div>
            ))
          ) : isError ? (
            <div className="text-red-500 text-center w-full">
              <p>Error al cargar los productos</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="flex justify-center h-full">
              <img
                className="w-64 h-auto transform transition-transform hover:scale-105"
                src={images.psico}
                alt="No hay productos disponibles"
              />
              <p className="text-xl font-bold text-gray-700 mt-4">No hay productos disponibles.</p>
            </div>
          ) : (
            displayedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <img src={product.imageUrl[0]} alt={product.name} className="rounded-lg w-full h-48 object-cover" />
                <h3 className="mt-2 text-xl font-bold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="mt-1 text-lg font-semibold text-green-600">{product.price}Bs.</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: getRandomColor(), transition: 'background-color 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = getRandomColor()}
                  onMouseLeave={(e) => e.target.style.backgroundColor = getRandomColor()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Agregar al carrito
                </button>
              </div>
            ))
          )}
        </div>
        {!isLoading && !isError && displayedProducts.length > 0 && (
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalPageCount }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-3 py-1 rounded ${page === currentPage ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-purple-500 hover:text-white'}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
