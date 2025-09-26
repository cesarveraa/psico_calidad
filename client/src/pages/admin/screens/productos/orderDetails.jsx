import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { getOrderById, setOrderAdminViewStatus, setOrderApprovalStatus } from '../../../../services/index/orders';
import { getProductById } from '../../../../services/index/products';
import Modal from 'react-modal';
import { FaArrowLeft } from 'react-icons/fa';

Modal.setAppElement('#root');

const OrderDetails = () => {
  const { id } = useParams();
  const userState = useSelector(state => state.user);
  const { data: order, isLoading, isError } = useQuery(['order', id], () => getOrderById(id, userState.userInfo.token));
  const [isComprobanteModalOpen, setComprobanteModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(order.products.map(async (product) => {
          const productDetails = await getProductById(product.productId);
          return { ...product, ...productDetails };
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    if (order && order.products) {
      fetchProducts();
    }
  }, [order]);

  useEffect(() => {
    const updateViewStatus = async () => {
      if (order && !order.vistoPorAdmin) {
        try {
          await setOrderAdminViewStatus(id, true, userState.userInfo.token);
        } catch (error) {
          console.error('Error updating view status:', error);
        }
      }
    };

    if (order) {
      updateViewStatus();
    }
  }, [order, id, userState.userInfo.token]);

  if (isLoading || productsLoading) return <p className="text-center text-lg">Cargando...</p>;
  if (isError) return <p className="text-center text-lg text-red-500">Error al cargar el pedido</p>;

  const openComprobanteModal = () => setComprobanteModalOpen(true);
  const closeComprobanteModal = () => setComprobanteModalOpen(false);

  const generateOrderDetailsHTML = () => {
    if (!order || !products) {
        return '<p>Error al generar los detalles del pedido.</p>';
    }

    const productsHtml = products.map(product => `
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
            <p><strong>Nombre:</strong> ${product.name}</p>
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Cantidad:</strong> ${product.cantidad}</p>
        </div>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h1 style="background-color: #4f46e5; color: white; text-align: center; padding: 10px 0; border-radius: 10px;">Detalles del Pedido</h1>
            <p><strong>Nombre:</strong> ${order.nombre}</p>
            <p><strong>Correo:</strong> ${order.correo}</p>
            <p><strong>Teléfono:</strong> ${order.telefono}</p>
            <p><strong>Monto:</strong> ${order.monto}Bs.</p>
            <h2 style="background-color: #4f46e5; color: white; text-align: center; padding: 10px 0; border-radius: 10px;">Productos</h2>
            ${productsHtml}
            <p style="color: #4f46e5; text-align: center; margin-top: 20px;">Tu pedido ha sido aprobado. Nos contactaremos contigo próximamente.</p>
        </div>
    `;
  };

  const handleApproveOrder = async () => {
    const emailContent = generateOrderDetailsHTML();
    try {
      await setOrderApprovalStatus(id, true, userState.userInfo.token, emailContent);
      alert('El pedido ha sido aprobado y el correo ha sido enviado.');
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Error al aprobar el pedido.');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold uppercase">Detalles del Pedido</h1>
      </section>
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-6">Pedido Detalles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-lg font-semibold">Nombre</h4>
            <p className="text-gray-700">{order.nombre}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Correo</h4>
            <p className="text-gray-700">{order.correo}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Teléfono</h4>
            <p className="text-gray-700">{order.telefono}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Monto</h4>
            <p className="text-gray-700">{order.monto}Bs.</p>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-semibold">Comprobante</h4>
            <img
              src={order.comprobante}
              alt="Comprobante"
              className="w-full h-auto rounded-lg shadow-sm mt-2 object-cover cursor-pointer"
              onClick={openComprobanteModal}
            />
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-xl font-bold mb-4">Productos</h4>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center">
                <img
                  src={product.imageUrl[0]}
                  alt={`Producto ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <div>
                  <p className="text-gray-700"><span className="font-semibold">Nombre:</span> {product.name}</p>
                  <p className="text-gray-700"><span className="font-semibold">Descripción:</span> {product.description}</p>
                  <p className="text-gray-700"><span className="font-semibold">Cantidad:</span> {product.cantidad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Link to="/admin/orders" className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
          <FaArrowLeft className="mr-2" /> Volver a la lista de pedidos
        </Link>
        <button
          onClick={handleApproveOrder}
          className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Enviar correo de aprobación
        </button>
      </div>

      <Modal
        isOpen={isComprobanteModalOpen}
        onRequestClose={closeComprobanteModal}
        contentLabel="Comprobante de Pago"
        className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
          <img src={order.comprobante} alt="Comprobante de Pago" className="w-full h-auto max-h-96 object-contain" />
          <h2 className="text-2xl font-bold my-4">Comprobante de Pago</h2>
          <a
            href={order.comprobante}
            download={`comprobante-${order._id}`}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium transition-colors"
            style={{ transition: 'background-color 0.3s ease' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1c6ed0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(59, 130, 246)'} // blue-500 default color
          >
            Descargar Imagen
          </a>
          <button
            onClick={closeComprobanteModal}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg font-medium transition-colors"
            style={{ transition: 'background-color 0.3s ease' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(239, 68, 68)'} // red-500 default color
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetails;
