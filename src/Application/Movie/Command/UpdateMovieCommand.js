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
    language
  }) {
    this.id = id;
    this.title = title;
    this.duration = duration;
    this.genres = genres;
    this.directors = directors;
    this.releaseDate = releaseDate;
    this.endDate = endDate;
    this.posterUrl = posterUrl;
    this.description = description;
    this.ageRating = ageRating;
    this.language = language;
  }
}

export default UpdateMovieCommand;