import express, { Router } from "express";
import { authController } from "../../Config/container.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signUp", (req, res, next) =>
  authController.register(req, res, next),
);

router.post("/signIn", (req, res, next) =>
  authController.login(req, res, next),
);

router.post("/signOut", authMiddleware, (req, res, next) =>
  authController.logout(req, res, next),
);

router.post("/refresh-token", authMiddleware, (req, res, next) =>
  authController.refreshToken(req, res, next),
);

export default router;
