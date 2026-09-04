import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getAllRegistrations,
} from "../controllers/registrationController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/:eventId", protect, registerForEvent);
router.delete("/:eventId", protect, cancelRegistration);
router.get("/my", protect, getMyRegistrations);
router.get("/all", protect, requireAdmin, getAllRegistrations);

export default router;
