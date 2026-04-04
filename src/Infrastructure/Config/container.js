// Infrastructure/Config/container.js
import { pool } from "./database.js";

// ── Repositories ──────────────────────────────────────────────────────────────
import MySQLUserRepository from "../Http/Repositories/MySQLUserRepository.js";
import MySQLRefreshTokenRepository from "../Http/Repositories/MySQLRefreshTokenRepository.js";
import MySQLMovieRepository from "../Http/Repositories/MySQLMovieRepository.js";

// ── Handlers ──────────────────────────────────────────────────────────────────
import RegisterHandler from "../../Application/Auth/Handler/RegisterHandler.js";
import LoginHandler from "../../Application/Auth/Handler/LoginHandler.js";
import LogoutHandler from "../../Application/Auth/Handler/LogoutHandler.js";
import RefreshTokenHandler from "../../Application/Auth/Handler/RefreshTokenHandler.js";

import CreateMovieHandler from "../../Application/Movie/Handler/CreateMovieHandler.js";
import UpdateMovieHandler from "../../Application/Movie/Handler/UpdateMovieHandler.js";
import DeleteMovieHandler from "../../Application/Movie/Handler/DeleteMovieHandler.js";
import GetMovieHandler from "../../Application/Movie/Handler/GetMovieHandler.js";
import ListMoviesHandler from "../../Application/Movie/Handler/ListMoviesHandler.js";

// ── Controllers ───────────────────────────────────────────────────────────────
import AuthController from "../Http/Controllers/AuthController.js";
import MovieController from "../Http/Controllers/MovieController.js";

// ═════════════════════════════════════════════════════════════════════════════
// Khởi tạo theo thứ tự: Repository → Handler → Controller
// Repository không phụ thuộc gì → Handler phụ thuộc Repository → Controller phụ thuộc Handler
// ═════════════════════════════════════════════════════════════════════════════

// ── Tầng 1: Repositories ──────────────────────────────────────────────────────
const userRepository = new MySQLUserRepository(pool);
const refreshTokenRepository = new MySQLRefreshTokenRepository(pool);
const movieRepository = new MySQLMovieRepository(pool);

// ── Tầng 2: Handlers ──────────────────────────────────────────────────────────
const registerHandler = new RegisterHandler(userRepository);
const loginHandler = new LoginHandler(userRepository, refreshTokenRepository);
const logoutHandler = new LogoutHandler(refreshTokenRepository);
const refreshTokenHandler = new RefreshTokenHandler(
  refreshTokenRepository,
  userRepository,
);

const createMovieHandler = new CreateMovieHandler(movieRepository);
const updateMovieHandler = new UpdateMovieHandler(movieRepository);
const deleteMovieHandler = new DeleteMovieHandler(movieRepository);
const getMovieHandler = new GetMovieHandler(movieRepository);
const listMoviesHandler = new ListMoviesHandler(movieRepository);

// ── Tầng 3: Controllers ───────────────────────────────────────────────────────
const authController = new AuthController(
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
);

const movieController = new MovieController(
  createMovieHandler,
  updateMovieHandler,
  deleteMovieHandler,
  getMovieHandler,
  listMoviesHandler,
);

export { authController, movieController };
