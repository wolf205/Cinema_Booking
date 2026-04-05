// Infrastructure/Http/Controllers/ShowtimeController.js
import CreateShowtimeCommand from "../../../Application/Showtime/Command/CreateShowtimeCommand.js";
import CancelShowtimeCommand from "../../../Application/Showtime/Command/CancelShowtimeCommand.js";
import GetShowtimeQuery from "../../../Application/Showtime/Query/GetShowtimeQuery.js";
import ListShowtimesQuery from "../../../Application/Showtime/Query/ListShowtimesQuery.js";

class ShowtimeController {
  constructor(
    createShowtimeHandler,
    cancelShowtimeHandler,
    getShowtimeHandler,
    listShowtimesHandler,
  ) {
    this.createShowtimeHandler = createShowtimeHandler;
    this.cancelShowtimeHandler = cancelShowtimeHandler;
    this.getShowtimeHandler = getShowtimeHandler;
    this.listShowtimesHandler = listShowtimesHandler;
  }

  // GET /showtimes
  async list(req, res, next) {
    try {
      const query = new ListShowtimesQuery({
        movieId: req.query.movieId ? Number(req.query.movieId) : undefined,
        cinemaId: req.query.cinemaId ? Number(req.query.cinemaId) : undefined,
        date: req.query.date,
        status: req.query.status,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });

      const result = await this.listShowtimesHandler.execute(query);

      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // GET /showtimes/:id
  async get(req, res, next) {
    try {
      const query = new GetShowtimeQuery({ id: Number(req.params.id) });
      const result = await this.getShowtimeHandler.execute(query);

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // POST /showtimes
  async create(req, res, next) {
    try {
      const command = new CreateShowtimeCommand(req.body);
      const result = await this.createShowtimeHandler.execute(command);

      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /showtimes/:id/cancel
  async cancel(req, res, next) {
    try {
      const command = new CancelShowtimeCommand({ id: Number(req.params.id) });
      const result = await this.cancelShowtimeHandler.execute(command);

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default ShowtimeController;
