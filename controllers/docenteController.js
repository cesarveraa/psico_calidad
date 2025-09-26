import { v4 as uuidv4 } from "uuid";
import Docente from "../models/Docentes";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import { fileRemover } from "../utils/fileRemover";

// Controlador para crear un nuevo docente
const createDocente = async (req, res, next) => {
  try {
    const docente = new Docente({
      nombre: req.body.nombre,
      bio: req.body.bio,
      foto: "",
      videoPresentacionUrl: req.body.videoPresentacionUrl,
      email: req.body.email,
      telefono: req.body.telefono,
      redesSociales: req.body.redesSociales,
      departamento: req.body.departamento,
      añoInicio: req.body.añoInicio,
      cursos: req.body.cursos,
      publicaciones: req.body.publicaciones,
      universidad: req.body.universidad
    });

    const createdDocente = await docente.save();
    return res.json(createdDocente);
  } catch (error) {
    next(error);
  }
};

// Controlador para actualizar un docente
const updateDocente = async (req, res, next) => {
  try {
    const docente = await Docente.findById(req.params.id);
    if (!docente) {
      return next(new Error("Docente no encontrado"));
    }

    const upload = uploadPicture.single("docenteFoto");

    upload(req, res, async function (err) {
      if (err) {
        return next(new Error("Error al subir la imagen: " + err.message));
      }
      if (req.file) {
        if (docente.foto) {
          fileRemover(docente.foto);
        }
        docente.foto = req.file.filename;
      }

      docente.nombre = req.body.nombre || docente.nombre;
      docente.bio = req.body.bio || docente.bio;
      docente.videoPresentacionUrl = req.body.videoPresentacionUrl || docente.videoPresentacionUrl;
      docente.email = req.body.email || docente.email;
      docente.telefono = req.body.telefono || docente.telefono;
      docente.redesSociales = req.body.redesSociales || docente.redesSociales;
      docente.departamento = req.body.departamento || docente.departamento;
      docente.añoInicio = req.body.añoInicio || docente.añoInicio;
      docente.cursos = req.body.cursos || docente.cursos;
      docente.publicaciones = req.body.publicaciones || docente.publicaciones;
      docente.universidad = req.body.universidad || docente.universidad;

      const updatedDocente = await docente.save();
      return res.json(updatedDocente);
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para eliminar un docente
const deleteDocente = async (req, res, next) => {
  try {
    const docente = await Docente.findByIdAndDelete(req.params.id);
    if (!docente) {
      return next(new Error("Docente no encontrado"));
    }
    if (docente.foto) {
      fileRemover(docente.foto);
    }
    return res.json({ message: "Docente eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener un docente específico
const getDocente = async (req, res, next) => {
  try {
    const docente = await Docente.findById(req.params.id);
    if (!docente) {
      return next(new Error("Docente no encontrado"));
    }
    return res.json(docente);
  } catch (error) {
    next(error);
  }
};

const getAllDocentes = async (req, res, next) => {
  try {
    const docentes = await Docente.find({});
    console.log("Docentes encontrados:", docentes); // Añade esto para depuración
    return res.json(docentes);
  } catch (error) {
    console.error("Error al obtener docentes:", error); // Asegúrate de capturar y mostrar errores
    next(error);
  }
};


export { createDocente, deleteDocente, getAllDocentes, getDocente, updateDocente };
