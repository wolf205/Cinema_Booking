import express from "express";
import { errorMiddleware } from "./Infrastructure/Http/Middlewares/errorMiddleware.js";
import authRoutes from "./Infrastructure/Http/Routes/authRoutes.js";
import movieRoutes from "./Infrastructure/Http/Routes/movieRoutes.js";
import cinemaRoutes from "./Infrastructure/Http/Routes/cinemaRoutes.js";
import roomRoutes from "./Infrastructure/Http/Routes/roomRoutes.js";
import seatRoutes from "./Infrastructure/Http/Routes/seatRoutes.js";
import showtimeRoutes from "./Infrastructure/Http/Routes/showtimeRoutes.js";
import bookingRoutes from "./Infrastructure/Http/Routes/bookingRoutes.js";
import paymentRoutes from "./Infrastructure/Http/Routes/paymentRoutes.js";
import uploadRoutes from "./Infrastructure/Http/Routes/uploadRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/cinemas", cinemaRoutes);
app.use("/rooms", roomRoutes);
app.use("/seats", seatRoutes);
app.use("/showtimes", showtimeRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/upload", uploadRoutes);

// Health check — test nhanh server có chạy không
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// Error handler — PHẢI để cuối cùng, sau tất cả routes
app.use(errorMiddleware);

export default app;
