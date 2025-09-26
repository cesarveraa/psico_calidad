// src/components/CartSummary.jsx
import React from "react";
import { Link } from "react-router-dom";

const CartSummary = ({ cart, onClose }) => {
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  const totalPrice = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">Carrito</h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          style={{ transition: 'color 0.3s ease' }}
          onMouseEnter={(e) => e.target.style.color = getRandomColor()}
          onMouseLeave={(e) => e.target.style.color = 'rgb(107, 114, 128)'} // default color gray-500
        >
          &times;
        </button>
      </div>
      {cart.length === 0 ? (
        <p className="text-gray-600">El carrito está vacío</p>
      ) : (
        <div>
          {cart.slice(0, 3).map(product => (
            <div key={product._id} className="flex justify-between items-center mb-2">
              <img src={product.imageUrl[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
              <div className="flex-1 ml-2">
                <h5 className="text-sm font-medium text-gray-800">{product.name}</h5>
                <p className="text-sm text-gray-600">{product.quantity} x {product.price}Bs.</p>
              </div>
            </div>
          ))}
          {cart.length > 3 && <p className="text-sm text-gray-600">...y {cart.length - 3} más</p>}
          <div className="mt-2 border-t pt-2">
            <p className="text-sm text-gray-800">Total: {totalItems} items</p>
            <p className="text-lg font-semibold text-gray-800">{totalPrice}Bs.</p>
          </div>
          <Link
            to="/cart"
            className="mt-4 inline-block px-6 py-2 text-white rounded-lg font-medium transition-colors"
            style={{ backgroundColor: getRandomColor(), transition: 'background-color 0.3s ease' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = getRandomColor()}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(59, 130, 246)'} // blue-500 default color
          >
            Ver Carrito
          </Link>

        </div>
      )}
    </div>
  );
};

export default CartSummary;
