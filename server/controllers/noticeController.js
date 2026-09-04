import Notice from "../models/Notice.js";

// @desc    Get all notices with filtering
// @route   GET /api/notices
// @access  Public
export const getNotices = async (req, res) => {
  try {
    const { search, category, department, important } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (department && department !== "All") {
      query.department = department;
    }

    if (important !== undefined) {
      query.important = important === "true";
    }

    const notices = await Notice.find(query).sort({ important: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error("[Notices] Get error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

// @desc    Get single notice by ID
// @route   GET /api/notices/:id
// @access  Public
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      notice,
    });
  } catch (error) {
    console.error("[Notices] Get single error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notice details",
    });
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private / Admin
export const createNotice = async (req, res) => {
  try {
    const { title, category, department, date, important, description, content, author } =
      req.body;

    if (!title || !category || !date || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required notice fields",
      });
    }

    const notice = await Notice.create({
      title,
      category,
      department: department || "All Departments",
      date,
      important: Boolean(important),
      description,
      content,
      author: author || "Campus Administration",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Notice published successfully",
      notice,
    });
  } catch (error) {
    console.error("[Notices] Create error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to publish notice",
    });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private / Admin
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      notice: updatedNotice,
    });
  } catch (error) {
    console.error("[Notices] Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update notice",
    });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private / Admin
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Notice removed successfully",
    });
  } catch (error) {
    console.error("[Notices] Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
    });
  }
};
