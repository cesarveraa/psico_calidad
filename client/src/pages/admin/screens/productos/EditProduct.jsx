import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../../../services/index/products";
import { getAllCategories } from "../../../../services/index/categoryService";

const EditProduct = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);
  const [productData, setProductData] = useState({
    photos: [],
    name: "",
    price: "",
    description: "",
    categories: [],
    stock: 0
  });
  const [photosToDelete, setPhotosToDelete] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const { isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    onSuccess: (data) => {
      setProductData({
        photos: data.imageUrl || [],
        name: data.name,
        price: data.price,
        description: data.description,
        categories: data.categories.map(category => category._id),
        stock: data.stock
      });
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        setAllCategories(categories);
      } catch (error) {
        toast.error("Error al cargar las categorías");
      }
    };
    fetchCategories();
  }, []);

  const { mutate, isLoading: isUpdating } = useMutation({
    mutationFn: ({ updatedData, id, token }) => updateProduct(id, updatedData, token),
    onSuccess: () => {
      toast.success("Producto actualizado exitosamente");
      queryClient.invalidateQueries(["product", id]);
      navigate(`/admin/products/manage/list`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setProductData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
  };

  const markPhotoForDeletion = (index) => {
    const photoToDelete = productData.photos[index];
    setPhotosToDelete(prev => [...prev, photoToDelete]);
    setProductData(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== index) }));
  };

  const handleInputChange = (field, value) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category) => {
    if (!productData.categories.includes(category)) {
      setProductData(prev => ({ ...prev, categories: [...prev.categories, category] }));
    }
  };

  const removeCategory = (category) => {
    setProductData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== category)
    }));
  };

  const validateFields = () => {
    const newErrors = {};

    if (!productData.name) newErrors.name = "El nombre del producto es requerido";
    if (!productData.price) newErrors.price = "El precio del producto es requerido";
    if (isNaN(productData.price) || productData.price <= 0) newErrors.price = "El precio debe ser un número mayor que 0";
    if (!productData.description) newErrors.description = "La descripción del producto es requerida";
    if (!productData.categories.length) newErrors.categories = "Al menos una categoría es requerida";
    if (isNaN(productData.stock) || productData.stock < 0) newErrors.stock = "La cantidad en stock debe ser un número mayor o igual que 0";
    if (!productData.photos.length) newErrors.photos = "Al menos una imagen es requerida";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProduct = async () => {
    if (!validateFields()) {
      toast.error("Por favor, corrija los errores en el formulario");
      return;
    }

    const updatedData = new FormData();

    updatedData.append('name', productData.name);
    updatedData.append('price', productData.price);
    updatedData.append('description', productData.description);
    updatedData.append('stock', productData.stock);
    updatedData.append('categories', JSON.stringify(productData.categories));
    updatedData.append('photosToDelete', JSON.stringify(photosToDelete));

    productData.photos.forEach(photo => {
      if (photo.file) {
        updatedData.append('photos', photo.file);
      }
    });

    const token = userState.userInfo.token;
    try {
      mutate({ updatedData, id, token });
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar el producto</p>;

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Editar Producto
      </section>

      <div className="mt-4">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Nombre del Producto:
        </label>
        <input
          id="name"
          type="text"
          value={productData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Nombre del producto"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 dark:text-white dark:bg-gray-800 dark:border-gray-600"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="price" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Precio:
        </label>
        <input
          id="price"
          type="number"
          value={productData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          placeholder="Precio del producto"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 dark:text-white dark:bg-gray-800 dark:border-gray-600"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Descripción:
        </label>
        <textarea
          id="description"
          value={productData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descripción del producto"
          rows="4"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 dark:text-white dark:bg-gray-800 dark:border-gray-600"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="categories" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Categorías:
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {allCategories.map(category => (
            <button
              key={category._id}
              type="button"
              onClick={() => handleCategoryChange(category._id)}
              className={`py-1 px-3 rounded ${productData.categories.includes(category._id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {category.title}
            </button>
          ))}
        </div>
        {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
        <div className="flex flex-wrap gap-2">
          {productData.categories.map(categoryId => {
            const category = allCategories.find(cat => cat._id === categoryId);
            return (
              <div key={categoryId} className="bg-white p-2 rounded-lg shadow-md flex items-center">
                <span className="mr-2">{category?.title}</span>
                <button
                  type="button"
                  onClick={() => removeCategory(categoryId)}
                  className="bg-red-600 text-white font-bold py-1 px-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="stock" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Stock:
        </label>
        <input
          id="stock"
          type="number"
          value={productData.stock}
          onChange={(e) => handleInputChange('stock', e.target.value)}
          placeholder="Cantidad en stock"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 dark:text-white dark:bg-gray-800 dark:border-gray-600"
        />
        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="productPhotos" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
          Sube Fotos:
        </label>
        <input
          type="file"
          id="productPhotos"
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        <label
          htmlFor="productPhotos"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
        >
          Seleccionar Fotos
        </label>
        {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
      </div>

      <div className="mt-4 flex flex-wrap -mx-2">
        {productData.photos.map((photo, index) => (
          <div key={index} className="px-2 w-full md:w-1/2">
            <div className="mb-4">
              <img
                src={photo.url || photo}
                alt={`Producto ${index + 1}`}
                className="rounded-lg w-full h-48 object-cover"
              />
              <button onClick={() => markPhotoForDeletion(index)} className="mt-2 text-red-500">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleUpdateProduct}
        disabled={isUpdating}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Actualizar Producto
      </button>
    </div>
  );
};

export default EditProduct;
