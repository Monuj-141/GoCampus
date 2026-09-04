import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Notice category is required"],
      enum: [
        "Academic",
        "Scholarship",
        "Placement",
        "Examination",
        "Campus Life",
        "Sports",
        "General",
      ],
      default: "Academic",
    },
    department: {
      type: String,
      default: "All Departments",
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    important: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Brief description is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Full content is required"],
    },
    author: {
      type: String,
      default: "Campus Administration",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
