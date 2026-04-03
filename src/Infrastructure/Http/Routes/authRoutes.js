import express, { Router } from "express";
import AuthController from "../Controllers/AuthController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/signUp", AuthController.register);

router.post("/signIn", AuthController.login);

router.post("/signOut", authMiddleware, AuthController.logout);

router.post("/refresh-token", authMiddleware, AuthController.refreshToken);

export default router;
