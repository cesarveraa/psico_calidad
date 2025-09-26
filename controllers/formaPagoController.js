import FormaPago from "../models/FormaPago";
import path from 'path';
import fs from 'fs';

// Crear una nueva forma de pago
export const createFormaPago = async (req, res, next) => {
  try {
    const { name } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const newFormaPago = new FormaPago({
      imageUrl,
      name
    });

    const savedFormaPago = await newFormaPago.save();
    res.status(201).json(savedFormaPago);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las formas de pago
export const getAllFormaPago = async (req, res, next) => {
  try {
    const formasPago = await FormaPago.find();
    res.json(formasPago);
  } catch (error) {
    next(error);
  }
};

// Obtener una sola forma de pago por ID
export const getFormaPagoById = async (req, res, next) => {
  try {
    const formaPago = await FormaPago.findById(req.params.id);
    if (!formaPago) {
      return res.status(404).json({ message: 'Forma de pago no encontrada' });
    }
    res.json(formaPago);
  } catch (error) {
    next(error);
  }
};

// Actualizar una forma de pago existente
export const updateFormaPago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const formaPago = await FormaPago.findById(id);
    if (!formaPago) {
      return res.status(404).json({ message: 'Forma de pago no encontrada' });
    }

    formaPago.name = name || formaPago.name;

    // Manejo de la nueva imagen
    if (req.file) {
      const newImageUrl = `/uploads/${req.file.filename}`;
      // Eliminar la imagen anterior
      const oldImagePath = path.join(__dirname, `../uploads/${path.basename(formaPago.imageUrl)}`);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo local: ${oldImagePath}`, err);
        } else {
          console.log(`Archivo local eliminado correctamente: ${oldImagePath}`);
        }
      });
      formaPago.imageUrl = newImageUrl;
    }

    const updatedFormaPago = await formaPago.save();
    res.json(updatedFormaPago);
  } catch (error) {
    next(error);
  }
};

// Eliminar una forma de pago
export const deleteFormaPago = async (req, res, next) => {
  try {
    const { id } = req.params;
    const formaPago = await FormaPago.findById(id);
    if (!formaPago) {
      return res.status(404).json({ message: 'Forma de pago no encontrada' });
    }

    // Eliminar la imagen de la forma de pago
    const imagePath = path.join(__dirname, `../uploads/${path.basename(formaPago.imageUrl)}`);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error al eliminar el archivo local: ${imagePath}`, err);
      } else {
        console.log(`Archivo local eliminado correctamente: ${imagePath}`);
      }
    });

    await formaPago.deleteOne();
    res.json({ message: 'Forma de pago eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};
