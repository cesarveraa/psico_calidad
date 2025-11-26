import Schedule from "../models/Schedule";

 const getSchedulesByIds = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const schedules = await Schedule.find({ _id: { $in: ids } }).populate('teacher');
    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const slug = slugify(req.body.parallel);
    const schedule = new Schedule({
      classDetails: req.body.classDetails,
      teacher: req.body.teacher,
      parallel: req.body.parallel,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      academicPeriod: req.body.academicPeriod,
      vigente: req.body.vigente || true,
    });

    const createdSchedule = await schedule.save();
    return res.json(createdSchedule);
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const slug = slugify(req.params.slug);
    const schedule = await Schedule.findOne({ _id: slug });

    if (!schedule) {
      const error = new Error("Schedule was not found");
      next(error);
      return;
    }

    // Update fields
    schedule.classDetails = req.body.classDetails || schedule.classDetails;
    schedule.teacher = req.body.teacher || schedule.teacher;
    schedule.parallel = req.body.parallel || schedule.parallel;
    schedule.startDate = req.body.startDate || schedule.startDate;
    schedule.endDate = req.body.endDate || schedule.endDate;
    schedule.academicPeriod = req.body.academicPeriod || schedule.academicPeriod;
    schedule.vigente = req.body.vigente !== undefined ? req.body.vigente : schedule.vigente;

    const updatedSchedule = await schedule.save();
    return res.json(updatedSchedule);
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const slug = slugify(req.params.slug);
    const schedule = await Schedule.findOneAndDelete({ _id: slug });

    if (!schedule) {
      const error = new Error("Schedule was not found");
      return next(error);
    }

    return res.json({ message: "Schedule successfully deleted" });
  } catch (error) {
    next(error);
  }
};

const getSchedule = async (req, res, next) => {
  try {
    const slug = slugify(req.params.slug);
    const schedule = await Schedule.findOne({ _id: slug }).populate('teacher');

    if (!schedule) {
      const error = new Error("Schedule was not found");
      return next(error);
    }

    return res.json(schedule);
  } catch (error) {
    next(error);
  }
};

const getAllSchedules = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.parallel = { $regex: filter, $options: "i" };
    }
    const query = Schedule.find(where);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * pageSize;
    const total = await Schedule.countDocuments(where);
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

    const result = await query.skip(skip).limit(pageSize).populate('teacher').sort({ updatedAt: "desc" });

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { createSchedule, updateSchedule, deleteSchedule, getSchedule, getAllSchedules, getSchedulesByIds };
