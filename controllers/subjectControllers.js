import { v4 as uuidv4 } from "uuid";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Subject from "../models/Subject";
import { fileRemover } from "../utils/fileRemover";
import slugify from "slugify";

const createSubject = async (req, res, next) => {
  try {
    const slug = slugify(req.body.name);
    const subject = new Subject({
      name: req.body.name,
      abbreviation: req.body.abbreviation,
      requirement: req.body.requirement,
      description: req.body.description,
      body: req.body.body,
      photo: "",
      video: req.body.video || "",
      tags: req.body.tags || [],
      area: req.body.area,
      semester: req.body.semester,
      cycle: req.body.cycle,
      credits: req.body.credits,
      workload: req.body.workload,
      teachers: req.body.teachers || [],
      schedules: req.body.schedules || [],
      justification: req.body.justification,
      competencies: req.body.competencies || [],
      optativa: req.body.optativa || false,
      user: req.user._id,
    });

    const createdSubject = await subject.save();
    return res.json(createdSubject);
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const slug = slugify(req.params.slug);
    const subject = await Subject.findOne({ _id: slug });

    if (!subject) {
      const error = new Error("Subject was not found");
      next(error);
      return;
    }

    const upload = uploadPicture.single("subjectPicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("An unknown error occurred when uploading: " + err.message);
        next(error);
      } else {
        let filename = subject.photo;
        if (req.file) {
          if (filename) {
            fileRemover(filename);
          }
          subject.photo = req.file.filename;
        } else if (filename) {
          subject.photo = "";
          fileRemover(filename);
        }

        // Update other fields
        subject.name = req.body.name || subject.name;
        subject.abbreviation = req.body.abbreviation || subject.abbreviation;
        subject.requirement = req.body.requirement || subject.requirement;
        subject.description = req.body.description || subject.description;
        subject.body = req.body.body || subject.body;
        subject.video = req.body.video || subject.video;
        subject.tags = req.body.tags || subject.tags;
        subject.area = req.body.area || subject.area;
        subject.semester = req.body.semester || subject.semester;
        subject.cycle = req.body.cycle || subject.cycle;
        subject.credits = req.body.credits || subject.credits;
        subject.workload = req.body.workload || subject.workload;
        subject.teachers = req.body.teachers || subject.teachers;
        subject.schedules = req.body.schedules || subject.schedules;
        subject.justification = req.body.justification || subject.justification;
        subject.competencies = req.body.competencies || subject.competencies;
        subject.optativa = req.body.optativa !== undefined ? req.body.optativa : subject.optativa;

        const updatedSubject = await subject.save();
        return res.json(updatedSubject);
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const slug = slugify(req.params.slug);
    const subject = await Subject.findOneAndDelete({ _id: slug });

    if (!subject) {
      const error = new Error("Subject was not found");
      return next(error);
    }

    fileRemover(subject.photo);
    return res.json({ message: "Subject successfully deleted" });
  } catch (error) {
    next(error);
  }
};

const getSubject = async (req, res, next) => {
  try {
    const slug = slugify(req.params.slug);
    const subject = await Subject.findOne({ _id: slug }).populate('user');

    if (!subject) {
      const error = new Error("Subject was not found");
      return next(error);
    }

    return res.json(subject);
  } catch (error) {
    next(error);
  }
};

const getAllSubjects = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.name = { $regex: filter, $options: "i" };
    }
    const query = Subject.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Subject.countDocuments(where);
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

    const result = await query.skip(skip).limit(pageSize).populate('user').sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { createSubject, updateSubject, deleteSubject, getSubject, getAllSubjects };
