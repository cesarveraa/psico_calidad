import { v4 as uuidv4 } from "uuid";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import PostgradoCurso from "../models/PosgradoCurso"; // Asumiendo que el modelo se exporta como GraduateProgram
import { fileRemover } from "../utils/fileRemover";

const createPostgradoCurso = async (req, res, next) => {
  try {
    const postgradoCurso = new PostgradoCurso({
      type: req.body.type,
      description: req.body.description,
      photo: "",
      institution: req.body.institution,
      acquiredCompetencies: req.body.acquiredCompetencies,
      enrollmentRequirements: req.body.enrollmentRequirements,
      duration: req.body.duration,
      accreditation: req.body.accreditation,
      videoExperiences: req.body.videoExperiences,
      writtenExperiences: req.body.writtenExperiences,
      additionalInfo: req.body.additionalInfo,
      externalUrl: req.body.externalUrl,
      tags: req.body.tags || []
    });

    const createdPostgradoCurso = await postgradoCurso.save();
    return res.json(createdPostgradoCurso);
  } catch (error) {
    next(error);
  }
};

const updatePostgradoCurso = async (req, res, next) => {
  try {
    const postgradoCurso = await PostgradoCurso.findById(req.params.id);

    if (!postgradoCurso) {
      const error = new Error("Postgrado curso not found");
      next(error);
      return;
    }

    // Actualización de campos
    postgradoCurso.type = req.body.type || postgradoCurso.type;
    postgradoCurso.description = req.body.description || postgradoCurso.description;
    postgradoCurso.institution = req.body.institution || postgradoCurso.institution;
    postgradoCurso.acquiredCompetencies = req.body.acquiredCompetencies || postgradoCurso.acquiredCompetencies;
    postgradoCurso.enrollmentRequirements = req.body.enrollmentRequirements || postgradoCurso.enrollmentRequirements;
    postgradoCurso.duration = req.body.duration || postgradoCurso.duration;
    postgradoCurso.accreditation = req.body.accreditation || postgradoCurso.accreditation;
    postgradoCurso.videoExperiences = req.body.videoExperiences || postgradoCurso.videoExperiences;
    postgradoCurso.writtenExperiences = req.body.writtenExperiences || postgradoCurso.writtenExperiences;
    postgradoCurso.additionalInfo = req.body.additionalInfo || postgradoCurso.additionalInfo;
    postgradoCurso.externalUrl = req.body.externalUrl || postgradoCurso.externalUrl;
    postgradoCurso.tags = req.body.tags || postgradoCurso.tags;

    const updatedPostgradoCurso = await postgradoCurso.save();
    return res.json(updatedPostgradoCurso);
  } catch (error) {
    next(error);
  }
};

const deletePostgradoCurso = async (req, res, next) => {
  try {
    const postgradoCurso = await PostgradoCurso.findByIdAndDelete(req.params.id);

    if (!postgradoCurso) {
      const error = new Error("Postgrado curso not found");
      return next(error);
    }

    return res.json({ message: "Postgrado curso successfully deleted" });
  } catch (error) {
    next(error);
  }
};

const getPostgradoCurso = async (req, res, next) => {
  try {
    const postgradoCurso = await PostgradoCurso.findById(req.params.id);

    if (!postgradoCurso) {
      const error = new Error("Postgrado curso not found");
      return next(error);
    }

    return res.json(postgradoCurso);
  } catch (error) {
    next(error);
  }
};

const getAllPostgradoCursos = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.description = { $regex: filter, $options: "i" };
    }
    const query = PostgradoCurso.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await PostgradoCurso.countDocuments(where);
    const pages = Math.ceil(total / pageSize);

    res.header({
      "x-filter": filter,
      "x-totalcount": JSON.stringify(total),
      "x-currentpage": JSON.stringify(page),
      "x-pagesize": JSON.stringify(pageSize),
      "x-totalpagecount": JSON.stringify(pages),
    });

    if (page > pages) {
      return res.json([]);
    }

    const result = await query.skip(skip).limit(pageSize).sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { createPostgradoCurso, updatePostgradoCurso, deletePostgradoCurso, getPostgradoCurso, getAllPostgradoCursos };
