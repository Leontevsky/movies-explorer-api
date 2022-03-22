const Movie = require("../models/movie");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
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

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError("Фильм не найден");
      }
      return movie;
    })
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        Movie.findByIdAndDelete(movie._id)
          .then((movieDelited) => {
            res.send(movieDelited);
          })
          .catch(next);
      } else {
        throw new ForbiddenError("Нельзя удалить чужой фильм!");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан не корректный id фильма"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};

// # удаляет сохранённый фильм по id
// DELETE /movies/_id

// const getMovies = (req, res, next) => {
//   Movie.find({})
//     .then((allMovies) => res.send(allMovies))
//     .catch(next);
// };

// const createMovies = (req, res, next) => {
//   const {
//     country,
//     director,
//     duration,
//     year,
//     description,
//     image,
//     trailerLink,
//     nameRU,
//     nameEN,
//     thumbnail,
//     movieId,
//   } = req.body;
//   const owner = req.user._id;
//   Movie.create({
//     country,
//     director,
//     duration,
//     year,
//     description,
//     image,
//     trailerLink,
//     nameRU,
//     nameEN,
//     thumbnail,
//     movieId,
//     owner,
//   })
//     .then((movie) => res.send(movie))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         next(new ErrorBadRequest("Отправленны некорректные данные"));
//       } else {
//         next(err);
//       }
//     });
// };

// // Movie.create({
// //   ...(req.body.owner = req.user._id),
// //   ...req.body,
// // })

// const deleteMovies = (req, res, next) => {
//   const CurrentMovie = req.params.movieId;
//   const userId = req.user._id;
//   Movie.findById(CurrentMovie)
//     .then((movie) => {
//       if (!movie) {
//         throw new ErrorNotFound("Фильм не найден");
//       }
//       return movie; // вернули функции а не пользователю
//     })
//     .then((movie) => {
//       if (movie.owner.equals(userId)) {
//         // являемся ли мы создателем фильма
//         // почитать отдельно
//         Movie.findByIdAndDelete(movie._id)
//           .then((deletedMovie) => {
//             res.send(deletedMovie);
//           })
//           .catch(next);
//       } else {
//         throw new ErrorForBidden("Вы не являетесь владельцем, удалить нельзя");
//       }
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         next(new ErrorBadRequest("Некорректный id фильма"));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports = { getMovies, createMovies, deleteMovies };
