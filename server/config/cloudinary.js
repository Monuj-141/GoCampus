import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary if credentials exist in environment
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
}

/**
 * Check if Cloudinary is configured
 */
export const isCloudinaryConfigured = () => {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET) ||
      process.env.CLOUDINARY_URL
  );
};

/**
 * Upload an avatar/image to Cloudinary
 * Automatically crops to face and optimizes format/quality
 *
 * @param {string} imageSource - Base64 Data URL, remote URL, or local file path
 * @returns {Promise<string>} - Cloudinary CDN secure HTTPS URL (or original if not configured)
 */
export const uploadAvatar = async (imageSource) => {
  if (!imageSource) return "";

  // If already a remote URL and not base64 data, no need to re-upload
  if (
    typeof imageSource === "string" &&
    imageSource.startsWith("http") &&
    !imageSource.includes(";base64,")
  ) {
    return imageSource;
  }

  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(imageSource, {
        folder: "connectcampus/avatars",
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      console.log(`[Cloudinary] Avatar uploaded successfully: ${result.secure_url}`);
      return result.secure_url;
    } catch (error) {
      console.error("[Cloudinary] Upload failed:", error.message);
      // If Cloudinary fails (e.g. invalid keys), fall back to original image string so user profile is not lost
      return imageSource;
    }
  }

  console.warn(
    "[Cloudinary] Credentials not configured in .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Saving image string directly."
  );
  return imageSource;
};

export default cloudinary;
