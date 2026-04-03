import express from "express";
import { errorMiddleware } from "./Infrastructure/Http/Middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

// Health check — test nhanh server có chạy không
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// TODO: gắn routes vào đây dần dần các ngày sau
// const routes = require('./Infrastructure/Http/Routes');
// app.use('/api', routes);

// Error handler — PHẢI để cuối cùng, sau tất cả routes
app.use(errorMiddleware);

export default app;
