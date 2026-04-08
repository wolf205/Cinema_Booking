import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { createRequire } from "module";
const multerCloudinary = require("multer-storage-cloudinary");
const CloudinaryStorage =
  multerCloudinary.CloudinaryStorage || multerCloudinary;
import { env } from "./env.js";

// ── Cấu hình Cloudinary credentials ──────────────────────────────────────────
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// ── Cấu hình storage — nơi ảnh được lưu trên Cloudinary ──────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cinema-app", // thư mục trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1920, crop: "limit" }, // giới hạn chiều rộng tối đa
      { quality: "auto" }, // Cloudinary tự tối ưu chất lượng
    ],
  },
});

// ── Cấu hình multer — giới hạn file trước khi upload ─────────────────────────
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // tối đa 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      // false + Error → multer trả lỗi, không upload
      return cb(new Error("Chỉ chấp nhận file ảnh JPG, PNG, WEBP"), false);
    }

    cb(null, true); // null = không có lỗi, true = chấp nhận file
  },
});

export { cloudinary, upload };
