import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
} from "../controllers/eventController.js";
import { protect, requireAdmin, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", optionalAuth, getEventById);
router.post("/", protect, requireAdmin, createEvent);
router.put("/:id", protect, requireAdmin, updateEvent);
router.delete("/:id", protect, requireAdmin, deleteEvent);
router.get("/:id/attendees", protect, requireAdmin, getEventAttendees);

export default router;
