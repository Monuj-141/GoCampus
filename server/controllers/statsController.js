import User from "../models/User.js";
import Event from "../models/Event.js";
import Notice from "../models/Notice.js";
import Registration from "../models/Registration.js";

// @desc    Get overall campus statistics
// @route   GET /api/stats/overview
// @access  Public
export const getStatsOverview = async (req, res) => {
  try {
    const [totalStudents, totalEvents, totalNotices, totalRegistrations, upcomingEvents] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        Event.countDocuments(),
        Notice.countDocuments(),
        Registration.countDocuments({ status: "confirmed" }),
        Event.countDocuments({ status: "upcoming" }),
      ]);

    // Distinct departments count
    const departments = await User.distinct("department", { role: "student" });
    const departmentCount = Math.max(departments.length, 6);

    // Category breakdown for events
    const categoryStats = await Event.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalEvents,
        totalNotices,
        totalRegistrations,
        upcomingEvents,
        departmentsCount: departmentCount,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("[Stats] Overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to compile campus statistics",
    });
  }
};
