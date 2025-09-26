// src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import { toast } from "react-hot-toast";

const LOCAL_STORAGE_KEY = 'psicoTienda_cart';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setCart(cartItems);
  }, []);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(product => product._id !== productId);
    setCart(updatedCart);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
    toast.success("Producto eliminado del carrito");
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return; // Prevent setting quantity to less than 1
    const updatedCart = cart.map(product =>
      product._id === productId ? { ...product, quantity: quantity } : product
    );
    setCart(updatedCart);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    toast.success("Carrito vaciado");
  };

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl p-5">
        <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-4 text-4xl font-bold uppercase rounded-lg shadow-lg">
          Carrito de Compras
        </section>
        <div className="mt-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-700">
              <p className="text-2xl font-bold">Tu carrito está vacío.</p>
              <Link
                to="/tienda"
                className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg font-medium transition-colors"
                onMouseEnter={(e) => e.target.style.backgroundColor = getRandomColor()}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(59, 130, 246)'} // blue-500 default color
              >
                Volver a la tienda
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {cart.map(product => (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
                  <img src={product.imageUrl[0]} alt={product.name} className="w-full md:w-24 h-24 object-cover rounded-lg mb-4 md:mb-0" />
                  <div className="flex-1 md:ml-4">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-lg font-semibold text-green-600">{product.price}Bs.</p>
                    <div className="mt-2 flex items-center">
                      <label className="mr-2">Cantidad:</label>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleUpdateQuantity(product._id, parseInt(e.target.value))}
                        className="w-16 p-1 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <button
                    className="mt-4 md:mt-0 md:ml-4 px-4 py-2 bg-red-500 text-white rounded-lg transition-colors"
                    style={{ transition: 'background-color 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = getRandomColor()}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(239, 68, 68)'} // red-500 default color
                    onClick={() => handleRemoveFromCart(product._id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <div className="text-right">
                <p className="text-xl font-semibold">Total: {total}Bs.</p>
                <Link
                  to="/checkout"
                  className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg font-medium transition-colors"
                  style={{ transition: 'background-color 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = getRandomColor()}
                  onMouseLeave={(e) => e.target.style.backgroundColor = getRandomColor()} // green-500 default color
                >
                  Proceder al pago
                </Link>
                <button
                  className="mt-4 ml-2 px-6 py-2 bg-red-500 text-white rounded-lg font-medium transition-colors"
                  style={{ transition: 'background-color 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = getRandomColor()}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(239, 68, 68)'} // red-500 default color
                  onClick={handleClearCart}
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
