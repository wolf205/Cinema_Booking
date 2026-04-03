// Infrastructure/Config/container.js
import { pool } from "./database.js";

// ── Repositories ──────────────────────────────────────────────────────────────
import MySQLUserRepository from "../Http/Repositories/MySQLUserRepository.js";
import MySQLRefreshTokenRepository from "../Http/Repositories/MySQLRefreshTokenRepository.js";

// ── Handlers ──────────────────────────────────────────────────────────────────
import RegisterHandler from "../../Application/Auth/Handler/RegisterHandler.js";
import LoginHandler from "../../Application/Auth/Handler/LoginHandler.js";
import LogoutHandler from "../../Application/Auth/Handler/LogoutHandler.js";
import RefreshTokenHandler from "../../Application/Auth/Handler/RefreshTokenHandler.js";

// ── Controllers ───────────────────────────────────────────────────────────────
import AuthController from "../Http/Controllers/AuthController.js";

// ═════════════════════════════════════════════════════════════════════════════
// Khởi tạo theo thứ tự: Repository → Handler → Controller
// Repository không phụ thuộc gì → Handler phụ thuộc Repository → Controller phụ thuộc Handler
// ═════════════════════════════════════════════════════════════════════════════

// ── Tầng 1: Repositories ──────────────────────────────────────────────────────
const userRepository = new MySQLUserRepository(pool);
const refreshTokenRepository = new MySQLRefreshTokenRepository(pool);

// ── Tầng 2: Handlers ──────────────────────────────────────────────────────────
const registerHandler = new RegisterHandler(userRepository);
const loginHandler = new LoginHandler(userRepository, refreshTokenRepository);
const logoutHandler = new LogoutHandler(refreshTokenRepository);
const refreshTokenHandler = new RefreshTokenHandler(
  refreshTokenRepository,
  userRepository,
);

// ── Tầng 3: Controllers ───────────────────────────────────────────────────────
const authController = new AuthController(
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
);

export { authController };
