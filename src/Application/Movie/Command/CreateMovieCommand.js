class CreateMovieCommand {
  constructor({
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
    // Required fields
    if (!title || typeof title !== "string") {
      throw new Error("title is required and must be a string");
    }
    if (!duration || !Number.isInteger(duration) || duration <= 0) {
      throw new Error("duration must be a positive integer");
    }
    if (!Array.isArray(genres) || genres.length === 0) {
      throw new Error("genres must be a non-empty array");
    }
    if (!Array.isArray(directors) || directors.length === 0) {
      throw new Error("directors must be a non-empty array");
    }
    if (!releaseDate) {
      throw new Error("releaseDate is required");
    }
    if (!endDate) {
      throw new Error("endDate is required");
    }

    // Optional fields - chỉ validate type
    if (posterUrl !== undefined && typeof posterUrl !== "string") {
      throw new Error("posterUrl must be a string");
    }
    if (description !== undefined && typeof description !== "string") {
      throw new Error("description must be a string");
    }

    // Enums validation
    const allowedAgeRatings = ["P", "K", "T13", "T16", "T18"];
    if (ageRating && !allowedAgeRatings.includes(ageRating)) {
      throw new Error(
        `ageRating must be one of: ${allowedAgeRatings.join(", ")}`,
      );
    }

    const allowedLanguages = ["Vietsub", "Lồng tiếng", "Nguyên bản"];
    if (language && !allowedLanguages.includes(language)) {
      throw new Error(
        `language must be one of: ${allowedLanguages.join(", ")}`,
      );
    }

    this.title = title;
    this.duration = duration;
    this.genres = genres;
    this.directors = directors;
    this.releaseDate = new Date(releaseDate);
    this.endDate = new Date(endDate);
    this.posterUrl = posterUrl || null;
    this.description = description || null;
    this.ageRating = ageRating || null;
    this.language = language || null;
  }
}

export default CreateMovieCommand;
