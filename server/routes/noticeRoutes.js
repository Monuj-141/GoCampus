import express from "express";
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.post("/", protect, requireAdmin, createNotice);
router.put("/:id", protect, requireAdmin, updateNotice);
router.delete("/:id", protect, requireAdmin, deleteNotice);

export default router;
