import React, { useState, useEffect } from "react";
import MainLayout from "../../components/MainLayout";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllFormaPago } from "../../services/index/formaPagos";
import { createOrder } from "../../services/index/orders";
import { useSelector } from "react-redux";

const LOCAL_STORAGE_KEY = 'psicoTienda_cart';

Modal.setAppElement('#root');

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    comprobante: null
  });
  const [cart, setCart] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFormaPago, setSelectedFormaPago] = useState(null);
  const userState = useSelector(state => state.user);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setCart(cartItems);

    // Print user session data
    console.log("User Session Data:", userState);
  }, [userState]);


  const { data: formasPago, isLoading, isError } = useQuery({
    queryKey: ['formaPago'],
    queryFn: getAllFormaPago,
    refetchOnWindowFocus: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDrop = (acceptedFiles) => {
    setFormData({
      ...formData,
      comprobante: acceptedFiles[0]
    });
  };

  const handleRemoveComprobante = () => {
    setFormData({
      ...formData,
      comprobante: null
    });
  };

  const { mutate: createOrderMutation, isLoading: isCreating } = useMutation({
    mutationFn: ({ orderData, token }) => createOrder(orderData, token),
    onSuccess: () => {
      toast.success("Pedido registrado exitosamente");
      setFormData({
        nombre: "",
        correo: "",
        telefono: "",
        comprobante: null
      });
      setCart([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos
    if (!formData.nombre || !formData.correo || !formData.telefono || !formData.comprobante) {
      toast.error("Todos los campos son obligatorios y debe haber un comprobante de pago.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      toast.error("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (!/^\d+$/.test(formData.telefono)) {
      toast.error("Por favor, ingrese un número de WhatsApp válido.");
      return;
    }

    const orderData = new FormData();
    orderData.append('nombre', formData.nombre);
    orderData.append('correo', formData.correo);
    orderData.append('telefono', formData.telefono);
    orderData.append('comprobante', formData.comprobante);
    orderData.append('monto', cart.reduce((sum, product) => sum + (product.price * product.quantity), 0));
    orderData.append('products', JSON.stringify(cart.map(product => ({
      productId: product._id,
      cantidad: product.quantity
    }))));

    const token = userState.userInfo.token;
    createOrderMutation({ orderData, token });
  };

  const openModal = (formaPago) => {
    setSelectedFormaPago(formaPago);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFormaPago(null);
  };

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33'];
    return colors[Math.floor(Math.random() * colors.length)];
  };


  const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop, accept: 'image/*' });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar las formas de pago</p>;

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl p-5">
        <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-4 text-4xl font-bold uppercase rounded-lg shadow-lg">
          Formulario de Pago
        </section>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Resumen de Compra</h2>
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
            <div>
              {cart.map(product => (
                <div key={product._id} className="mb-4 flex flex-col md:flex-row items-center justify-between">
                  <img src={product.imageUrl[0]} alt={product.name} className="w-24 h-24 object-cover rounded-lg mb-4 md:mb-0" />
                  <div className="md:ml-4 flex-1 text-center md:text-left">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">Cantidad: {product.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold text-center md:text-right">{product.price * product.quantity}Bs.</p>
                </div>
              ))}
              <div className="text-right font-bold text-xl">
                Total: {total}Bs.
              </div>
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Formas de Pago</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formasPago.map((formaPago) => (
                    <div key={formaPago._id} className="bg-white p-4 rounded-lg shadow-md">
                      <img
                        src={formaPago.imageUrl}
                        alt={formaPago.name}
                        className="rounded-lg w-full h-48 object-cover cursor-pointer"
                        onClick={() => openModal(formaPago)}
                      />
                      <h3 className="mt-2 text-xl font-bold">{formaPago.name}</h3>
                      <a
                        href={`http://localhost:5000/uploads/${formaPago.imageUrl.split('/').pop()}`}
                        download={formaPago.imageUrl.split('/').pop()}
                        className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg font-medium transition-colors"
                        style={{ transition: 'background-color 0.3s ease' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1c6ed0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(59, 130, 246)'} // blue-500 default color
                      >
                        Descargar Imagen
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                    Teléfono de WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Comprobante de Pago
                  </label>
                  <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center cursor-pointer">
                    <input {...getInputProps()} />
                    {formData.comprobante ? (
                      <div className="relative">
                        <p>{formData.comprobante.name}</p>
                        <img src={URL.createObjectURL(formData.comprobante)} alt="Comprobante" className="mt-2 max-h-48 object-cover" />
                        <button
                          type="button"
                          className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
                          onClick={handleRemoveComprobante}
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <p>Arrastra y suelta el comprobante aquí, o haz click para seleccionar</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium transition-colors"
                    style={{ transition: 'background-color 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#32a852'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(34, 197, 94)'} // green-500 default color
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Forma de Pago"
        className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedFormaPago && (
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
            <img src={selectedFormaPago.imageUrl} alt={selectedFormaPago.name} className="w-full h-auto max-h-96 object-contain" />
            <h2 className="text-2xl font-bold my-4">{selectedFormaPago.name}</h2>
            <a
              href={selectedFormaPago.imageUrl}
              download={selectedFormaPago.name}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium transition-colors"
              style={{ transition: 'background-color 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1c6ed0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(59, 130, 246)'} // blue-500 default color
            >
              Descargar Imagen
            </a>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg font-medium transition-colors"
              style={{ transition: 'background-color 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(239, 68, 68)'} // red-500 default color
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default CheckoutPage;
