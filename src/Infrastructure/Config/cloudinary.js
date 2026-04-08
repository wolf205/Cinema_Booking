import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { createRequire } from "module"; // Dòng này cực kỳ quan trọng
import { env } from "./env.js";

// Khởi tạo hàm require cho môi trường ES Module
const require = createRequire(import.meta.url);

// Bây giờ mới có thể dùng require ở đây
const multerCloudinary = require("multer-storage-cloudinary");
const CloudinaryStorage =
  multerCloudinary.CloudinaryStorage || multerCloudinary;

// ── Cấu hình Cloudinary credentials ──────────────────────────────────────────
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// ── Cấu hình storage — nơi ảnh được lưu trên Cloudinary ──────────────────────
const storage = new CloudinaryStorage({
  // Thay vì chỉ ghi 'cloudinary', hãy ghi rõ ràng:
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "cinema-app",
      format: "jpg", // Chuyển hết về jpg để đồng bộ (tùy chọn)
      transformation: [{ width: 1920, crop: "limit" }, { quality: "auto" }],
    };
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
