import mongoose from 'mongoose';
import Product from "../models/Productos";
import path from 'path';
import fs from 'fs';

// Crear un nuevo producto
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, categories, stock } = req.body;
    const imageUrl = req.files.map(file => `/uploads/${file.filename}`);

    // Asegúrate de que categories es un array
    const categoryIds = Array.isArray(JSON.parse(categories)) ? JSON.parse(categories).map(id => mongoose.Types.ObjectId(id)) : [];

    const newProduct = new Product({
      imageUrl,
      name,
      price,
      description,
      categories: categoryIds,
      stock
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

// Obtener todos los productos
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('categories');
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// Obtener un solo producto por ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('categories');
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Actualizar un producto existente
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, categories, stock, photosToDelete } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Asegúrate de que categories es un array
    const categoryIds = Array.isArray(JSON.parse(categories)) ? JSON.parse(categories).map(id => mongoose.Types.ObjectId(id)) : [];

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.categories = categoryIds.length ? categoryIds : product.categories;
    product.stock = stock || product.stock;

    // Manejo de fotos a eliminar
    if (photosToDelete) {
      const photosToDeleteArray = JSON.parse(photosToDelete);
      product.imageUrl = product.imageUrl.filter(photo => {
        const shouldDelete = photosToDeleteArray.includes(photo);
        if (shouldDelete) {
          const photoPath = path.join(__dirname, `../uploads/${path.basename(photo)}`);
          fs.unlink(photoPath, (err) => {
            if (err) {
              console.error(`Error al eliminar el archivo local: ${photoPath}`, err);
            } else {
              console.log(`Archivo local eliminado correctamente: ${photoPath}`);
            }
          });
        }
        return !shouldDelete;
      });
    }

    // Manejo de nuevas imágenes
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.imageUrl = [...product.imageUrl, ...newImages];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};


// Eliminar un producto
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar todas las imágenes del producto
    product.imageUrl.forEach(photo => {
      const photoPath = path.join(__dirname, `../uploads/${path.basename(photo)}`);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo local: ${photoPath}`, err);
        } else {
          console.log(`Archivo local eliminado correctamente: ${photoPath}`);
        }
      });
    });

    await product.deleteOne();
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};