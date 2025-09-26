import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaBell, FaCheck, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { images } from "../../../../constants";
import { createSystemLog } from '../../../../services/index/logsSistema';
import { deleteOrder, getAllOrders, setOrderApprovalStatus } from '../../../../services/index/orders';
import { getProductById } from '../../../../services/index/products';

Modal.setAppElement('#root');

const OrderList = () => {
  const queryClient = useQueryClient();
  const userState = useSelector(state => state.user);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // ✅ Registrar acceso a la vista de pedidos (logsSistema)
  useEffect(() => {
    if (userState.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_products",
        accion: "Accedió a la lista de pedidos"
      }, userState.userInfo.token).catch(err => console.error("Error al registrar log:", err.message));
    }
  }, [userState.userInfo]);

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getAllOrders(userState.userInfo.token),
    refetchOnWindowFocus: false,
  });

  const { mutate: updateOrderStatusMutate } = useMutation({
    mutationFn: ({ id, approved, token, emailContent }) => setOrderApprovalStatus(id, approved, token, emailContent),
    onSuccess: () => {
      toast.success('Estado del pedido actualizado exitosamente');
      queryClient.invalidateQueries(['orders']);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const { mutate: deleteOrderMutate } = useMutation({
    mutationFn: ({ id, token }) => deleteOrder(id, token),
    onSuccess: () => {
      toast.success('Pedido eliminado exitosamente');
      queryClient.invalidateQueries(['orders']);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const handleViewComprobante = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleApproval = async (order, approved) => {
    const token = userState.userInfo.token;
    const products = await Promise.all(order.products.map(async (product) => {
      const productDetails = await getProductById(product.productId);
      return { ...product, ...productDetails };
    }));
    const emailContent = generateOrderDetailsHTML(order, products);
    updateOrderStatusMutate({ id: order._id, approved, token, emailContent });
  };

  const handleDelete = (id) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const token = userState.userInfo.token;
    deleteOrderMutate({ id: orderToDelete, token });
    setShowDeleteModal(false);
  };

  const handleEdit = (id) => {
    navigate(`/admin/orders/edit/${id}`);
  };

  const filteredOrders = orders?.filter(order => {
    return (
      (order.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.telefono.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === 'all' ||
        (filter === 'approved' && order.aprobado) ||
        (filter === 'notApproved' && !order.aprobado) ||
        (filter === 'notViewed' && !order.vistoPorAdmin) ||
        (filter === 'Viewed' && order.vistoPorAdmin))
    );
  });

  const generateOrderDetailsHTML = (order, products) => {
    if (!order || !products) return '<p>Error al generar los detalles del pedido.</p>';

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

  if (isLoading) return <p className="text-center text-lg">Cargando...</p>;
  if (isError) return <p className="text-center text-lg text-red-500">Error al cargar los pedidos</p>;

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <img className="w-64 h-auto transform transition-transform hover:scale-105" src={images.psico} alt="No hay pedidos" />
        <p className="text-xl font-bold text-gray-700 mt-4">No hay pedidos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-4 text-4xl font-bold uppercase">
        Lista de Pedidos
      </section>

      <div className="mt-4 flex justify-between items-center flex-wrap">
        <div className="relative mb-4">
          <FaSearch className="absolute top-2 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-2 px-4 border rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Todos</option>
            <option value="approved">Aprobados</option>
            <option value="notApproved">No Aprobados</option>
            <option value="notViewed">No Vistos</option>
            <option value="Viewed">Vistos</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white p-4 rounded-lg shadow-md relative">
            {!order.vistoPorAdmin && (
              <FaBell className="absolute top-2 right-2 text-yellow-500" size={20} />
            )}
            <Link to={`/admin/orders/${order._id}`}>
              <h3 className="text-xl font-bold">{order.nombre}</h3>
              <p className="text-gray-700">Correo: {order.correo}</p>
              <p className="text-gray-700">Teléfono: {order.telefono}</p>
              <p className="text-gray-700">Monto: {order.monto}Bs.</p>
              <img
                src={order.comprobante}
                alt="Comprobante"
                className="w-16 h-16 object-cover cursor-pointer mt-2"
                onClick={() => handleViewComprobante(order)}
              />
            </Link>
            <div className="mt-4 text-center flex justify-between">
              <button
                onClick={() => handleApproval(order, !order.aprobado)}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  order.aprobado ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {order.aprobado ? <FaCheck size={20} /> : <FaTimes size={20} />}
              </button>
              <button
                onClick={() => handleDelete(order._id)}
                className="py-2 px-4 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onRequestClose={closeModal}
          contentLabel="Comprobante de Pago"
          className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
            <img src={selectedOrder.comprobante} alt="Comprobante de Pago" className="w-full h-auto max-h-96 object-contain" />
            <h2 className="text-2xl font-bold my-4">Comprobante de Pago</h2>
            <a
              href={selectedOrder.comprobante}
              download={`comprobante-${selectedOrder._id}`}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium transition-colors"
              style={{ transition: 'background-color 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1c6ed0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(59, 130, 246)'}
            >
              Descargar Imagen
            </a>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg font-medium transition-colors"
              style={{ transition: 'background-color 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(239, 68, 68)'}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          contentLabel="Confirmar Eliminación"
          className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold my-4">¿Estás seguro de que quieres eliminar este pedido?</h2>
            <div className="flex justify-between mt-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium transition-colors"
                style={{ transition: 'background-color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(239, 68, 68)'}
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium transition-colors"
                style={{ transition: 'background-color 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6b7280'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(107, 114, 128)'}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderList;
