import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// @desc    Register logged-in student for an event
// @route   POST /api/registrations/:eventId
// @access  Private / Student
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status === "cancelled" || event.status === "completed") {
      return res.status(400).json({
        success: false,
        message: `Cannot register for an event that is ${event.status}`,
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: "Registration closed. This event has reached maximum capacity.",
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      student: studentId,
      status: "confirmed",
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
        registration: existingRegistration,
      });
    }

    // Unique registration code
    const registrationNumber = `CC-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const registration = await Registration.create({
      event: eventId,
      student: studentId,
      status: "confirmed",
      registrationNumber,
    });

    // Increment event attendee count
    event.registeredCount = (event.registeredCount || 0) + 1;
    await event.save();

    await registration.populate("event");

    res.status(201).json({
      success: true,
      message: "Successfully registered for the event!",
      registration,
    });
  } catch (error) {
    console.error("[Registrations] Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to complete event registration",
    });
  }
};

// @desc    Cancel an existing event registration
// @route   DELETE /api/registrations/:eventId
// @access  Private / Student
export const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user._id;

    const registration = await Registration.findOne({
      event: eventId,
      student: studentId,
      status: "confirmed",
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "No active registration found for this event",
      });
    }

    await Registration.findByIdAndDelete(registration._id);

    // Decrement event attendee count
    const event = await Event.findById(eventId);
    if (event && event.registeredCount > 0) {
      event.registeredCount -= 1;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: "Event registration has been cancelled",
    });
  } catch (error) {
    console.error("[Registrations] Cancel error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel registration",
    });
  }
};

// @desc    Get current student's registrations
// @route   GET /api/registrations/my
// @access  Private
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.user._id,
      status: "confirmed",
    })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("[Registrations] Get my error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student registrations",
    });
  }
};

// @desc    Get all registrations (Campus admin view)
// @route   GET /api/registrations/all
// @access  Private / Admin
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event", "title date time location category capacity registeredCount")
      .populate("student", "name email studentId department year phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("[Registrations] Get all error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all registrations",
    });
  }
};
