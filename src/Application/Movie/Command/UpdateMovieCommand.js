class UpdateMovieCommand {
  constructor({
    id,
    title,
    duration,
    genres,
    directors,
    releaseDate,
    endDate,
    posterUrl,
    description,
    ageRating,
    language,
  }) {
    // ── id là bắt buộc — không có id thì không biết update cái nào ──
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("id is required and must be a positive integer");
    }

    // ── Kiểm tra có ít nhất 1 field được truyền vào để update ────────
    const updatableFields = [
      title,
      duration,
      genres,
      directors,
      releaseDate,
      endDate,
      posterUrl,
      description,
      ageRating,
      language,
    ];
    const hasAtLeastOneField = updatableFields.some((f) => f !== undefined);
    if (!hasAtLeastOneField) {
      throw new Error("At least one field must be provided for update");
    }

    // ── Validate từng field nếu được truyền vào (partial update) ─────

    if (title !== undefined) {
      if (!title || typeof title !== "string") {
        throw new Error("title must be a non-empty string");
      }
    }

    if (duration !== undefined) {
      if (!Number.isInteger(duration) || duration <= 0) {
        throw new Error("duration must be a positive integer");
      }
    }

    if (genres !== undefined) {
      if (!Array.isArray(genres) || genres.length === 0) {
        throw new Error("genres must be a non-empty array");
      }
    }

    if (directors !== undefined) {
      if (!Array.isArray(directors) || directors.length === 0) {
        throw new Error("directors must be a non-empty array");
      }
    }

    if (posterUrl !== undefined && typeof posterUrl !== "string") {
      throw new Error("posterUrl must be a string");
    }

    if (description !== undefined && typeof description !== "string") {
      throw new Error("description must be a string");
    }

    const allowedAgeRatings = ["P", "K", "T13", "T16", "T18"];
    if (ageRating !== undefined && !allowedAgeRatings.includes(ageRating)) {
      throw new Error(
        `ageRating must be one of: ${allowedAgeRatings.join(", ")}`,
      );
    }

    const allowedLanguages = ["Vietsub", "Lồng tiếng", "Nguyên bản"];
    if (language !== undefined && !allowedLanguages.includes(language)) {
      throw new Error(
        `language must be one of: ${allowedLanguages.join(", ")}`,
      );
    }

    // ── Validate date logic nếu cả 2 cùng được truyền vào ────────────
    // Nếu chỉ truyền 1 trong 2, bỏ qua — Handler sẽ merge với data hiện tại
    if (releaseDate !== undefined && endDate !== undefined) {
      const release = new Date(releaseDate);
      const end = new Date(endDate);
      if (isNaN(release.getTime())) {
        throw new Error("releaseDate is not a valid date");
      }
      if (isNaN(end.getTime())) {
        throw new Error("endDate is not a valid date");
      }
      if (release > end) {
        throw new Error("releaseDate must be before endDate");
      }
    } else {
      if (releaseDate !== undefined && isNaN(new Date(releaseDate).getTime())) {
        throw new Error("releaseDate is not a valid date");
      }
      if (endDate !== undefined && isNaN(new Date(endDate).getTime())) {
        throw new Error("endDate is not a valid date");
      }
    }

    // ── Gán giá trị ──────────────────────────────────────────────────
    this.id = Number(id);
    this.title = title;
    this.duration = duration;
    this.genres = genres;
    this.directors = directors;
    this.releaseDate =
      releaseDate !== undefined ? new Date(releaseDate) : undefined;
    this.endDate = endDate !== undefined ? new Date(endDate) : undefined;
    this.posterUrl = posterUrl;
    this.description = description;
    this.ageRating = ageRating;
    this.language = language;
  }
}

export default UpdateMovieCommand;
