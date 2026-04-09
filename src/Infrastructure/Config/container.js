// Infrastructure/Config/container.js
import { pool } from "./database.js";

// ── Repositories ──────────────────────────────────────────────────────────────
import MySQLUserRepository from "../Http/Repositories/MySQLUserRepository.js";
import MySQLRefreshTokenRepository from "../Http/Repositories/MySQLRefreshTokenRepository.js";
import MySQLMovieRepository from "../Http/Repositories/MySQLMovieRepository.js";
import MySQLCinemaRepository from "../Http/Repositories/MySQLCinemaRepository.js";
import MySQLRoomRepository from "../Http/Repositories/MySQLRoomRepository.js";
import MySQLSeatRepository from "../Http/Repositories/MySQLSeatRepository.js";
import MySQLShowtimeRepository from "../Http/Repositories/MySQLShowtimeRepository.js";
import MySQLBookingRepository from "../Http/Repositories/MySQLBookingRepository.js";
import MySQLPaymentRepository from "../Http/Repositories/MySQLPaymentRepository.js";
// Thêm Ticket Repository
import MySQLTicketRepository from "../Http/Repositories/MySQLTicketRepository.js";

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

import CreateShowtimeHandler from "../../Application/Showtime/Handler/CreateShowtimeHandler.js";
import CancelShowtimeHandler from "../../Application/Showtime/Handler/CancelShowtimeHandler.js";
import GetShowtimeHandler from "../../Application/Showtime/Handler/GetShowtimeHandler.js";
import ListShowtimesHandler from "../../Application/Showtime/Handler/ListShowtimesHandler.js";

import CreateBookingHandler from "../../Application/Booking/Handler/CreateBookingHandler.js";
import CancelBookingHandler from "../../Application/Booking/Handler/CancelBookingHandler.js";
import ConfirmBookingHandler from "../../Application/Booking/Handler/ConfirmBookingHandler.js";
import GetBookingHandler from "../../Application/Booking/Handler/GetBookingHandler.js";
import ListBookingsHandler from "../../Application/Booking/Handler/ListBookingsHandler.js";
import GetSeatMapForShowtimeHandler from "../../Application/Booking/Handler/GetSeatMapForShowtimeHandler.js";

import InitiatePaymentHandler from "../../Application/Payment/Handler/InitiatePaymentHandler.js";
import ConfirmPaymentHandler from "../../Application/Payment/Handler/ConfirmPaymentHandler.js";
import FailPaymentHandler from "../../Application/Payment/Handler/FailPaymentHandler.js";
import GetPaymentHandler from "../../Application/Payment/Handler/GetPaymentHandler.js";

// Thêm Ticket Handlers
import IssueTicketHandler from "../../Application/Ticket/Handler/IssueTicketHandler.js";
import GetTicketHandler from "../../Application/Ticket/Handler/GetTicketHandler.js";

// ── Controllers ───────────────────────────────────────────────────────────────
import AuthController from "../Http/Controllers/AuthController.js";
import MovieController from "../Http/Controllers/MovieController.js";
import CinemaController from "../Http/Controllers/CinemaController.js";
import RoomController from "../Http/Controllers/RoomController.js";
import SeatController from "../Http/Controllers/SeatController.js";
import ShowtimeController from "../Http/Controllers/ShowtimeController.js";
import BookingController from "../Http/Controllers/BookingController.js";
import PaymentController from "../Http/Controllers/PaymentController.js";
// Thêm Ticket Controller
import TicketController from "../Http/Controllers/TicketController.js";

// ═════════════════════════════════════════════════════════════════════════════
// Khởi tạo theo thứ tự: Repository → Handler → Controller
// ═════════════════════════════════════════════════════════════════════════════

// ── Tầng 1: Repositories ──────────────────────────────────────────────────────
const userRepository = new MySQLUserRepository(pool);
const refreshTokenRepository = new MySQLRefreshTokenRepository(pool);
const movieRepository = new MySQLMovieRepository(pool);

const cinemaRepository = new MySQLCinemaRepository(pool);
const roomRepository = new MySQLRoomRepository(pool);
const seatRepository = new MySQLSeatRepository(pool);

const showtimeRepository = new MySQLShowtimeRepository(pool);

const bookingRepository = new MySQLBookingRepository(pool);

const paymentRepository = new MySQLPaymentRepository(pool);

// Khởi tạo Ticket Repository
const ticketRepository = new MySQLTicketRepository(pool);

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

const createShowtimeHandler = new CreateShowtimeHandler(
  movieRepository,
  roomRepository,
  showtimeRepository,
);
const cancelShowtimeHandler = new CancelShowtimeHandler(showtimeRepository);
const getShowtimeHandler = new GetShowtimeHandler(showtimeRepository);
const listShowtimesHandler = new ListShowtimesHandler(showtimeRepository);

const getSeatMapForShowtimeHandler = new GetSeatMapForShowtimeHandler(
  showtimeRepository,
  roomRepository,
  seatRepository,
  bookingRepository,
);

const createBookingHandler = new CreateBookingHandler(
  showtimeRepository,
  seatRepository,
  bookingRepository,
);

const getBookingHandler = new GetBookingHandler(
  bookingRepository,
  showtimeRepository,
);

const listBookingsHandler = new ListBookingsHandler(bookingRepository);

const cancelBookingHandler = new CancelBookingHandler(bookingRepository);

const confirmBookingHandler = new ConfirmBookingHandler(
  bookingRepository,
  showtimeRepository,
);

const initiatePaymentHandler = new InitiatePaymentHandler(
  bookingRepository,
  paymentRepository,
);
const failPaymentHandler = new FailPaymentHandler(paymentRepository);
const getPaymentHandler = new GetPaymentHandler(paymentRepository);

// KHỞI TẠO TICKET HANDLERS TRƯỚC CONFIRM PAYMENT HANDLER
const issueTicketHandler = new IssueTicketHandler(
  bookingRepository,
  ticketRepository,
);
const getTicketHandler = new GetTicketHandler(ticketRepository);

// Cập nhật ConfirmPaymentHandler để nhận thêm issueTicketHandler
const confirmPaymentHandler = new ConfirmPaymentHandler(
  paymentRepository,
  bookingRepository,
  showtimeRepository,
  issueTicketHandler,
);

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

const showtimeController = new ShowtimeController(
  createShowtimeHandler,
  cancelShowtimeHandler,
  getShowtimeHandler,
  listShowtimesHandler,
);

const bookingController = new BookingController(
  createBookingHandler,
  cancelBookingHandler,
  confirmBookingHandler,
  getBookingHandler,
  listBookingsHandler,
  getSeatMapForShowtimeHandler,
);

const paymentController = new PaymentController(
  initiatePaymentHandler,
  confirmPaymentHandler,
  failPaymentHandler,
  getPaymentHandler,
);

// Khởi tạo Ticket Controller
const ticketController = new TicketController(getTicketHandler);

export {
  authController,
  movieController,
  cinemaController,
  roomController,
  seatController,
  showtimeController,
  bookingController,
  paymentController,
  ticketController, // Export ticketController ra ngoài
};
