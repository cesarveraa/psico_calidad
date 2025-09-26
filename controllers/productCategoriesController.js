import ProductCategories from "../models/productCategories";

// Crear una nueva categoría
export const createCategory = async (req, res, next) => {
  try {
    const { title } = req.body;
    const existingCategory = await ProductCategories.findOne({ title });

    if (existingCategory) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }
    if(!title){
      return res.status(400).json({ message: "Introduzca el nombre de la categoria" });
    }

    const newCategory = new ProductCategories({ title });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las categorías
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategories.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await ProductCategories.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// Actualizar una categoría existente
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const existingCategory = await ProductCategories.findOne({ title });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    if(!title){
      return res.status(400).json({ message: "Introduzca el nombre de la categoria" });
    }

    const updatedCategory = await ProductCategories.findByIdAndUpdate(id, { title }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await ProductCategories.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría eliminada exitosamente" });
  } catch (error) {
    next(error);
  }
};
