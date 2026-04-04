class DeleteMovieCommand {
  constructor({ id }) {
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      throw new Error("id is required and must be a positive integer");
    }

    this.id = Number(id);
  }
}

export default DeleteMovieCommand;
