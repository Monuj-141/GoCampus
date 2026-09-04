import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// @desc    Get all events with filtering & search
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { search, category, status, featured } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("[Events] Get error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

// @desc    Get single event by ID (with user registration status if logged in)
// @route   GET /api/events/:id
// @access  Public / Optional Auth
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let isRegistered = false;
    let userRegistration = null;

    if (req.user) {
      userRegistration = await Registration.findOne({
        event: event._id,
        student: req.user._id,
        status: "confirmed",
      });
      isRegistered = !!userRegistration;
    }

    res.status(200).json({
      success: true,
      event,
      isRegistered,
      registration: userRegistration,
    });
  } catch (error) {
    console.error("[Events] Get single error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve event details",
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private / Admin
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      date,
      time,
      location,
      description,
      icon,
      capacity,
      organizer,
      featured,
    } = req.body;

    if (!title || !category || !date || !time || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required event details",
      });
    }

    const event = await Event.create({
      title,
      category,
      date,
      time,
      location,
      description,
      icon: icon || "📅",
      capacity: capacity ? Number(capacity) : 100,
      organizer: organizer || "Campus Student Council",
      featured: Boolean(featured),
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("[Events] Create error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};

// @desc    Update existing event
// @route   PUT /api/events/:id
// @access  Private / Admin
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("[Events] Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update event",
    });
  }
};

// @desc    Delete event & related registrations
// @route   DELETE /api/events/:id
// @access  Private / Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ event: req.params.id });

    res.status(200).json({
      success: true,
      message: "Event and associated registrations deleted successfully",
    });
  } catch (error) {
    console.error("[Events] Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
};

// @desc    Get attendee list for an event
// @route   GET /api/events/:id/attendees
// @access  Private / Admin
export const getEventAttendees = async (req, res) => {
  try {
    const attendees = await Registration.find({
      event: req.params.id,
      status: "confirmed",
    })
      .populate("student", "name email studentId department year phone")
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: attendees.length,
      attendees,
    });
  } catch (error) {
    console.error("[Events] Attendees error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event attendees",
    });
  }
};
