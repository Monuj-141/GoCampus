import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { uploadAvatar } from "../config/cloudinary.js";
import { sendEmail, buildVerificationEmail, buildResetPasswordEmail } from "../config/email.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET || "connectcampus_jwt_super_secret_key_2026_dev_prod",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Generate a random token, return both the raw (emailed) and hashed (stored) versions
const generateRawAndHashedToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, hashedToken };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, studentId, department, year, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const assignedRole = role === "admin" ? "admin" : "student";

    const { rawToken, hashedToken } = generateRawAndHashedToken();

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      studentId: studentId || (assignedRole === "student" ? `CC-${Date.now().toString().slice(-4)}` : ""),
      department: department || "Computer Science",
      year: year || "1st Year",
      isVerified: false,
      verificationToken: hashedToken,
      verificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    const verifyUrl = `${CLIENT_URL}/verify-email/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your ConnectCampus email address",
      html: buildVerificationEmail(user.name, verifyUrl),
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      token,
      user,
    });
  } catch (error) {
    console.error("[Auth] Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("[Auth] Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to log in",
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, department, year, studentId, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (department) user.department = department;
    if (year) user.year = year;
    if (studentId) user.studentId = studentId;
    if (avatar !== undefined) {
      if (avatar && avatar.startsWith("data:image/")) {
        user.avatar = await uploadAvatar(avatar);
      } else {
        user.avatar = avatar;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

// @desc    Verify a user's email using the token from their verification email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: "Verification token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() },
    }).select("+verificationToken +verificationExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This verification link is invalid or has expired. Please request a new one.",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You now have full access to ConnectCampus.",
    });
  } catch (error) {
    console.error("[Auth] Verify email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify email",
    });
  }
};

// @desc    Resend the verification email to the logged-in user
// @route   POST /api/auth/resend-verification
// @access  Private
export const resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "This account is already verified" });
    }

    const { rawToken, hashedToken } = generateRawAndHashedToken();
    user.verificationToken = hashedToken;
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyUrl = `${CLIENT_URL}/verify-email/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your ConnectCampus email address",
      html: buildVerificationEmail(user.name, verifyUrl),
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("[Auth] Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to resend verification email",
    });
  }
};

// @desc    Request a password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide your email address" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with a generic success message, whether or not the
    // account exists, so this endpoint can't be used to enumerate emails.
    const genericResponse = {
      success: true,
      message: "If an account exists for that email, a password reset link has been sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const { rawToken, hashedToken } = generateRawAndHashedToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your ConnectCampus password",
      html: buildResetPasswordEmail(user.name, resetUrl),
    });

    res.status(200).json(genericResponse);
  } catch (error) {
    console.error("[Auth] Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process password reset request",
    });
  }
};

// @desc    Reset a user's password using the token from their reset email
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired. Please request a new one.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("[Auth] Reset password error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};
// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};
