import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT token & attach user to request
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "connectcampus_jwt_super_secret_key_2026_dev_prod"
      );

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account no longer exists",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("[Auth Middleware] Token error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid token. Please log in again.",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Authorization required. No token provided.",
    });
  }
};

// Optional auth: attaches req.user if valid token provided, but does not reject if absent
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "connectcampus_jwt_super_secret_key_2026_dev_prod"
      );
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      req.user = null;
    }
  }
  next();
};

// Ensure user has admin role
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access restricted to Campus Administrators only",
    });
  }
};
