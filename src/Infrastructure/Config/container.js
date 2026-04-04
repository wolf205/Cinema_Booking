// Infrastructure/Config/container.js
import { pool } from "./database.js";

// ── Repositories ──────────────────────────────────────────────────────────────
import MySQLUserRepository from "../Http/Repositories/MySQLUserRepository.js";
import MySQLRefreshTokenRepository from "../Http/Repositories/MySQLRefreshTokenRepository.js";
import MySQLMovieRepository from "../Http/Repositories/MySQLMovieRepository.js";
import MySQLCinemaRepository from "../Http/Repositories/MySQLCinemaRepository.js";
import MySQLRoomRepository from "../Http/Repositories/MySQLRoomRepository.js";
import MySQLSeatRepository from "../Http/Repositories/MySQLSeatRepository.js";
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

import CreateCinemaHandler from "../../Application/Cinema/Handler/CreateCinemaHandler.js";
import UpdateCinemaHandler from "../../Application/Cinema/Handler/UpdateCinemaHandler.js";
import DeleteCinemaHandler from "../../Application/Cinema/Handler/DeleteCinemaHandler.js";
import GetCinemaHandler from "../../Application/Cinema/Handler/GetCinemaHandler.js";
import ListCinemasHandler from "../../Application/Cinema/Handler/ListCinemasHandler.js";

import CreateRoomHandler from "../../Application/Cinema/Handler/CreateRoomHandler.js";
import UpdateRoomHandler from "../../Application/Cinema/Handler/UpdateRoomHandler.js";
import DeleteRoomHandler from "../../Application/Cinema/Handler/DeleteRoomHandler.js";
import GetRoomHandler from "../../Application/Cinema/Handler/GetRoomHandler.js";
import ListRoomsHandler from "../../Application/Cinema/Handler/ListRoomsHandler.js";

import UpdateSeatHandler from "../../Application/Cinema/Handler/UpdateSeatHandler.js";
import GetSeatMapHandler from "../../Application/Cinema/Handler/GetSeatMapHandler.js";
// ── Controllers ───────────────────────────────────────────────────────────────
import AuthController from "../Http/Controllers/AuthController.js";
import MovieController from "../Http/Controllers/MovieController.js";

import CinemaController from "../Http/Controllers/CinemaController.js";
import RoomController from "../Http/Controllers/RoomController.js";
import SeatController from "../Http/Controllers/SeatController.js";
// ═════════════════════════════════════════════════════════════════════════════
// Khởi tạo theo thứ tự: Repository → Handler → Controller
// Repository không phụ thuộc gì → Handler phụ thuộc Repository → Controller phụ thuộc Handler
// ═════════════════════════════════════════════════════════════════════════════

// ── Tầng 1: Repositories ──────────────────────────────────────────────────────
const userRepository = new MySQLUserRepository(pool);
const refreshTokenRepository = new MySQLRefreshTokenRepository(pool);
const movieRepository = new MySQLMovieRepository(pool);

const cinemaRepository = new MySQLCinemaRepository(pool);
const roomRepository = new MySQLRoomRepository(pool);
const seatRepository = new MySQLSeatRepository(pool);
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

const createCinemaHandler = new CreateCinemaHandler(cinemaRepository);
const updateCinemaHandler = new UpdateCinemaHandler(cinemaRepository);
const deleteCinemaHandler = new DeleteCinemaHandler(cinemaRepository);
const getCinemaHandler = new GetCinemaHandler(cinemaRepository);
const listCinemasHandler = new ListCinemasHandler(cinemaRepository);

const createRoomHandler = new CreateRoomHandler(
  cinemaRepository,
  roomRepository,
  seatRepository,
);
const updateRoomHandler = new UpdateRoomHandler(roomRepository, seatRepository);
const deleteRoomHandler = new DeleteRoomHandler(roomRepository);
const getRoomHandler = new GetRoomHandler(roomRepository);
const listRoomsHandler = new ListRoomsHandler(cinemaRepository, roomRepository);

const updateSeatHandler = new UpdateSeatHandler(seatRepository);
const getSeatMapHandler = new GetSeatMapHandler(roomRepository, seatRepository);
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

const cinemaController = new CinemaController(
  createCinemaHandler,
  updateCinemaHandler,
  deleteCinemaHandler,
  getCinemaHandler,
  listCinemasHandler,
);

const roomController = new RoomController(
  createRoomHandler,
  updateRoomHandler,
  deleteRoomHandler,
  getRoomHandler,
  listRoomsHandler,
);

const seatController = new SeatController(updateSeatHandler, getSeatMapHandler);

export {
  authController,
  movieController,
  cinemaController,
  roomController,
  seatController,
};
