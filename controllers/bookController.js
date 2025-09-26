import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../middleware/uploadFileMiddleware";
import Book from "../models/Book";
import { fileRemover } from "../utils/fileRemover";

const createBook = async (req, res, next) => {
  try {
    const book = new Book({
      title: "título de muestra",
      description: "sample description",
      slug: uuidv4(),
      content: {
        type: "doc",
        content: [],
      },
      file: "",
      user: req.user._id,
    });

    const createdBook = await book.save();
    return res.json(createdBook);
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug });

    if (!book) {
      const error = new Error("Book was not found");
      next(error);
      return;
    }

    const upload = uploadFile.single("bookFile");

    const handleUpdateBookData = async (data) => {
      const { title, description, slug, content, tags, categories } = JSON.parse(data);
      book.title = title || book.title;
      book.description = description || book.description;
      book.slug = slug || book.slug;
      book.content = content || book.content;
      book.tags = tags || book.tags;
      book.categories = categories || book.categories;
      const updatedBook = await book.save();
      return res.json(updatedBook);
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("An unknown error occurred when uploading " + err.message);
        next(error);
      } else {
        if (req.file) {
          let filename = book.file;
          if (filename) {
            fileRemover(filename);
          }
          book.file = req.file.filename;
          handleUpdateBookData(req.body.document);
        } else {
          let filename = book.file;
          book.file = "";
          fileRemover(filename);
          handleUpdateBookData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};


const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOneAndDelete({ slug: req.params.slug });

    if (!book) {
      const error = new Error("Book was not found");
      return next(error);
    }

    fileRemover(book.file);

    return res.json({
      message: "Book is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "categories",
        select: ["title"],
      },
    ]);

    if (!book) {
      const error = new Error("Book was not found");
      return next(error);
    }

    return res.json(book);
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }
    let query = Book.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Book.find(where).countDocuments();
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

    const result = await query
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
        {
          path: "categories",
          select: ["title"],
        },
      ])
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { createBook, deleteBook, getAllBooks, getBook, updateBook };

