const Movie = require("../models/movie");
const ErrorNotFound = require("../errors/NotFound");
const ErrorBadRequest = require("../errors/BadRequest");
const ErrorForBidden = require("../errors/Forbidden");

// # удаляет сохранённый фильм по id
// DELETE /movies/_id

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((allMovies) => res.send(allMovies))
    .catch(next);
};

const createMovies = (req, res, next) => {
  Movie.create({
    ...(req.body.owner = req.user._id),
    ...req.body,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы не корректные данные в метод создания фильма"
          )
        );
      } else {
        next(err);
      }
    });
};

// Movie.create({
//   ...(req.body.owner = req.user._id),
//   ...req.body,
// })

const deleteMovies = (req, res, next) => {
  const CurrentMovie = req.params.movieId;
  const userId = req.user._id;
  Movie.findById(CurrentMovie)
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound("Фильм не найден");
      }
      return movie; // вернули функции а не пользователю
    })
    .then((movie) => {
      if (movie.owner.equals(userId)) {
        // являемся ли мы создателем фильма
        // почитать отдельно
        Movie.findByIdAndDelete(movie._id)
          .then((deletedMovie) => {
            res.send(deletedMovie);
          })
          .catch(next);
      } else {
        throw new ErrorForBidden("Вы не являетесь владельцем, удалить нельзя");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ErrorBadRequest("Некорректный id фильма"));
      } else {
        next(err);
      }
    });
};

module.exports = { getMovies, createMovies, deleteMovies };
