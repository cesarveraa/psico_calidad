import Book from "../models/Book";
import BookCategories from "../models/BookCategories";

const createBookCategory = async (req, res, next) => {
  try {
    const { title } = req.body;

    const bookCategory = await BookCategories.findOne({ title });

    if (bookCategory) {
      const error = new Error("Category is already created!");
      return next(error);
    }

    const newBookCategory = new BookCategories({
      title,
    });

    const savedBookCategory = await newBookCategory.save();

    return res.status(201).json(savedBookCategory);
  } catch (error) {
    next(error);
  }
};

const getSingleCategory = async (req, res, next) => {
  try {
    const bookCategory = await BookCategories.findById(req.params.bookCategoryId);

    if (!bookCategory) {
      const error = new Error("Category was not found!");
      return next(error);
    }

    return res.json(bookCategory);
  } catch (error) {
    next(error);
  }
};

const getAllBookCategories = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.title = { $regex: filter, $options: "i" };
    }
    let query = BookCategories.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await BookCategories.find(where).countDocuments();
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
      .sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateBookCategory = async (req, res, next) => {
  try {
    const { title } = req.body;

    const bookCategory = await BookCategories.findByIdAndUpdate(
      req.params.bookCategoryId,
      {
        title,
      },
      {
        new: true,
      }
    );

    if (!bookCategory) {
      const error = new Error("Category was not found");
      return next(error);
    }

    return res.json(bookCategory);
  } catch (error) {
    next(error);
  }
};

const deleteBookCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.bookCategoryId;

    // Verificar si categoryId es undefined o null
    if (!categoryId) {
      const error = new Error("Invalid category ID");
      return next(error);
    }

    await Book.updateMany(
      { categories: categoryId },
      { $pull: { categories: categoryId } }
    );

    const result = await BookCategories.deleteOne({ _id: categoryId });

    if (result.deletedCount === 0) {
      const error = new Error("Category was not found");
      return next(error);
    }

    res.json({ message: "Book category is successfully deleted!" });
  } catch (error) {
    next(error);
  }
};

export {
  createBookCategory,
  deleteBookCategory,
  getAllBookCategories,
  getSingleCategory,
  updateBookCategory
};
