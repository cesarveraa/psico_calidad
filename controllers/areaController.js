import Area from "../models/Area";

// Crear una nueva área
export const createArea = async (req, res) => {
  try {
    const { title, description, image, items } = req.body;
    const newArea = new Area({
      title,
      description,
      image, // Imagen representativa del área
      items
    });
    const savedArea = await newArea.save();
    res.status(201).json(savedArea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las áreas
export const getAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.status(200).json(areas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener un área por ID
export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ message: "Área no encontrada" });
    }
    res.status(200).json(area);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un área
export const updateArea = async (req, res) => {
  try {
    const { title, description, image, items } = req.body;
    const updatedArea = await Area.findByIdAndUpdate(
      req.params.id,
      { title, description, image, items },
      { new: true }
    );
    if (!updatedArea) {
      return res.status(404).json({ message: "Área no encontrada" });
    }
    res.status(200).json(updatedArea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un área
export const deleteArea = async (req, res) => {
  try {
    const deletedArea = await Area.findByIdAndDelete(req.params.id);
    if (!deletedArea) {
      return res.status(404).json({ message: "Área no encontrada" });
    }
    res.status(200).json({ message: "Área eliminada exitosamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

 export {createArea, updateArea, getAreaById, deleteArea, getAreas}