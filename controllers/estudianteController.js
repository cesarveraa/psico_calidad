import Estudiante from "../models/Estudiantes";
import { fileRemover } from "../utils/fileRemover";
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

const createEstudiante = async (req, res, next) => {
  try {
    const {
      nombre,
      carrera,
      videoPresentacionUrl,
      email,
      añoIngreso,
      semestreActual,
      bio,
      caracteristicas,
      intereses,
      habilidades,
      proyectos,
      logrosAcademicos,
      redesSociales,
      cargo,
      tipo,
      telefono,
      usuarioRegistrado
    } = req.body;

    const foto = req.file ? `/uploads/${req.file.filename}` : "";

    // Log para verificar el valor de usuarioRegistrado
    console.log("Usuario Registrado ID:", usuarioRegistrado);

    // Limpiar comillas adicionales y verificar el ID
    const cleanUsuarioRegistrado = usuarioRegistrado.replace(/"/g, '');

    if (!mongoose.Types.ObjectId.isValid(cleanUsuarioRegistrado)) {
      throw new Error("ID de usuario inválido");
    }

    // Validar campos numéricos
    let añoIngresoInt = parseInt(añoIngreso, 10);
    let semestreActualInt = parseInt(semestreActual, 10);

    // Log para verificar los valores de añoIngresoInt y semestreActualInt
    console.log("Año de Ingreso (Int):", añoIngresoInt);
    console.log("Semestre Actual (Int):", semestreActualInt);

    if (isNaN(añoIngresoInt)) {
      añoIngresoInt = 2024;
    }
    if (isNaN(semestreActualInt)) {
      semestreActualInt = 5;
    }

    // Ensure bio is non-empty
    if (!bio.trim()) {
      throw new Error("La biografía es requerida");
    }

    const parseJsonField = (field, defaultValue) => {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    };

    const estudiante = new Estudiante({
      nombre: nombre.replace(/"/g, ''),
      carrera: carrera.replace(/"/g, ''),
      foto,
      videoPresentacionUrl: videoPresentacionUrl.replace(/"/g, ''),
      email: email.replace(/"/g, ''),
      añoIngreso: añoIngresoInt,
      semestreActual: semestreActualInt,
      bio: bio.replace(/"/g, ''),
      caracteristicas: caracteristicas ? parseJsonField(caracteristicas, []) : [],
      intereses: intereses ? parseJsonField(intereses, []) : [],
      habilidades: habilidades ? parseJsonField(habilidades, []) : [],
      proyectos: proyectos ? parseJsonField(proyectos, []) : [],
      logrosAcademicos: logrosAcademicos ? parseJsonField(logrosAcademicos, []) : [],
      redesSociales: redesSociales ? parseJsonField(redesSociales, {
        facebook: '',
        twitter: '',
        linkedIn: '',
        instagram: ''
      }) : { facebook: '', twitter: '', linkedIn: '', instagram: '' },
      cargo: cargo.replace(/"/g, ''),
      tipo: tipo.replace(/"/g, ''),
      telefono: telefono.replace(/"/g, ''),
      usuarioRegistrado: mongoose.Types.ObjectId(cleanUsuarioRegistrado)
    });

    const createdEstudiante = await estudiante.save();
    return res.status(201).json(createdEstudiante);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    next(error);
  }
};


// Controlador para actualizar un estudiante
const updateEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      carrera,
      videoPresentacionUrl,
      email,
      añoIngreso,
      semestreActual,
      bio,
      caracteristicas,
      intereses,
      habilidades,
      proyectos,
      logrosAcademicos,
      redesSociales,
      cargo,
      tipo,
      telefono,
      usuarioRegistrado
    } = req.body;

    const estudiante = await Estudiante.findById(id);
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    if (req.file) {
      if (estudiante.foto) {
        const photoPath = path.join(__dirname, `../uploads/${path.basename(estudiante.foto)}`);
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.error(`Error al eliminar el archivo local: ${photoPath}`, err);
          } else {
            console.log(`Archivo local eliminado correctamente: ${photoPath}`);
          }
        });
      }
      estudiante.foto = `/uploads/${req.file.filename}`;
    }

    const parseJsonField = (field, defaultValue) => {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    };

    const cleanString = (value) => value ? value.replace(/['"]/g, '') : value;

    estudiante.nombre = cleanString(nombre) || estudiante.nombre;
    estudiante.carrera = cleanString(carrera) || estudiante.carrera;
    estudiante.videoPresentacionUrl = cleanString(videoPresentacionUrl) || estudiante.videoPresentacionUrl;
    estudiante.email = cleanString(email) || estudiante.email;
    estudiante.añoIngreso = añoIngreso ? parseInt(añoIngreso) : estudiante.añoIngreso;
    estudiante.semestreActual = semestreActual ? parseInt(semestreActual) : estudiante.semestreActual;
    estudiante.bio = cleanString(bio) || estudiante.bio;
    estudiante.caracteristicas = parseJsonField(caracteristicas, estudiante.caracteristicas);
    estudiante.intereses = parseJsonField(intereses, estudiante.intereses);
    estudiante.habilidades = parseJsonField(habilidades, estudiante.habilidades);
    estudiante.proyectos = parseJsonField(proyectos, estudiante.proyectos);
    estudiante.logrosAcademicos = parseJsonField(logrosAcademicos, estudiante.logrosAcademicos);
    estudiante.redesSociales = parseJsonField(redesSociales, estudiante.redesSociales);
    estudiante.cargo = cleanString(cargo) || estudiante.cargo;
    estudiante.tipo = cleanString(tipo) || estudiante.tipo;
    estudiante.telefono = cleanString(telefono) || estudiante.telefono;
    estudiante.usuarioRegistrado = mongoose.Types.ObjectId(cleanString(usuarioRegistrado));

    const updatedEstudiante = await estudiante.save();
    return res.json(updatedEstudiante);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    next(error);
  }
};


// Controlador para eliminar un estudiante
const deleteEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findById(id);
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    if (estudiante.foto) {
      const photoPath = path.join(__dirname, `../uploads/${path.basename(estudiante.foto)}`);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo local: ${photoPath}`, err);
        } else {
          console.log(`Archivo local eliminado correctamente: ${photoPath}`);
        }
      });
    }

    await estudiante.deleteOne();
    return res.json({ message: "Estudiante eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener un estudiante específico
const getEstudiante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findById(id);
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    return res.json(estudiante);
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener todos los estudiantes
const getAllEstudiantes = async (req, res, next) => {
  try {
    const estudiantes = await Estudiante.find({});
    return res.json(estudiantes);
  } catch (error) {
    next(error);
  }
};

export { createEstudiante, updateEstudiante, deleteEstudiante, getEstudiante, getAllEstudiantes };
