import { v4 as uuidv4 } from "uuid";
import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import University from "../models/University";
import { fileRemover } from "../utils/fileRemover";
import slugify from 'slugify';

const createUniversity = async (req, res, next) => {
  try {
    const university = new University({
      name: req.body.name,
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      description: req.body.description,
      website: req.body.website,
      photo: "",
      programs: req.body.programs || [],
      exchangePartners: req.body.exchangePartners || [],
      tags: req.body.tags || [],
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      socialMedia: req.body.socialMedia || {},
      user: req.user._id,
    });

    const createdUniversity = await university.save();
    return res.json(createdUniversity);
  } catch (error) {
    next(error);
  }
};

const updateUniversity = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      const error = new Error("University was not found");
      next(error);
      return;
    }

    const upload = uploadPicture.single("universityPicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("An unknown error occurred when uploading: " + err.message);
        next(error);
      } else {
        let filename = university.photo;
        if (req.file) {
          if (filename) {
            fileRemover(filename);
          }
          university.photo = req.file.filename;
        } else if (filename) {
          university.photo = "";
          fileRemover(filename);
        }

        // Update other fields
        university.name = req.body.name || university.name;
        university.country = req.body.country || university.country;
        university.city = req.body.city || university.city;
        university.address = req.body.address || university.address;
        university.description = req.body.description || university.description;
        university.website = req.body.website || university.website;
        university.programs = req.body.programs || university.programs;
        university.exchangePartners = req.body.exchangePartners || university.exchangePartners;
        university.tags = req.body.tags || university.tags;
        university.contactEmail = req.body.contactEmail || university.contactEmail;
        university.contactPhone = req.body.contactPhone || university.contactPhone;
        university.socialMedia = req.body.socialMedia || university.socialMedia;

        const updatedUniversity = await university.save();
        return res.json(updatedUniversity);
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);

    if (!university) {
      const error = new Error("University was not found");
      return next(error);
    }

    fileRemover(university.photo);
    return res.json({ message: "University successfully deleted" });
  } catch (error) {
    next(error);
  }
};

const getUniversity = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id).populate('user');

    if (!university) {
      const error = new Error("University was not found");
      return next(error);
    }

    return res.json(university);
  } catch (error) {
    next(error);
  }
};

const getUniversityBySlug = async (req, res, next) => {
  try {
    const slug = slugify(req.params.slug);
    console.log(slug);
    const university = await University.findOne({ _id: slug });

    if (!university) {
      const error = new Error("University not found");
      error.status = 404;
      return next(error);
    }

    res.json(university);
  } catch (error) {
    next(error);
  }
};


const getAllUniversities = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.name = { $regex: filter, $options: "i" };
    }
    const query = University.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await University.countDocuments(where);
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

export { createUniversity, updateUniversity, deleteUniversity, getUniversity, getUniversityBySlug, getAllUniversities };
