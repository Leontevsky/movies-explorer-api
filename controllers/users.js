const bcrypt = require("bcryptjs");
const User = require("../models/user");
const NotFoundError = require("../errors2/not-found-error");
const BadRequestError = require("../errors2/bad-request-error");
const ConflictError = require("../errors2/conflict-error");

const optsForUpdateUser = {
  new: true,
  runValidators: true,
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
    )
    .then((user) =>
      res.send({
        name: user.name,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError("Пользователь с таким email уже зарегестрирован")
        );
      }
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные в методы создания пользователя"
          )
        );
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    optsForUpdateUser
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные в методы обновления профиля"
          )
        );
      }
      if (err.codeName === "DuplicateKey") {
        next(new ConflictError("Email занят другим пользователем"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  updateUser,
  getCurrentUser,
};

// const bcrypt = require('bcryptjs');
// const User = require('../models/user');
// const ErrorNotFound = require('../errors/NotFound');
// const ErrorBadRequest = require('../errors/BadRequest');
// const ErrorBadUnique = require('../errors/BadUnique');

// const optionForUpdateUser = { new: true, runValidators: true };

// const createUser = (req, res, next) => {
//   const { name, email, password } = req.body;
//   bcrypt
//     .hash(password, 10) // почитать
//     .then((hash) => User.create({
//       name,
//       email,
//       password: hash,
//     }))
//     .then((currentUser) => res.status(200).send({
//       name: currentUser.name,
//       email: currentUser.email,
//     }))
//     .catch((err) => {
//       if (err.code === 11000) {
//         next(new ErrorBadUnique('Такая почта уже зарегистрированна!')); // read about next
//       } else if (err.name === 'ValidationError') {
//         next(new ErrorBadRequest('Введены некорректные данные'));
//       } else {
//         next(err);
//       }
//     });
// };

// const getCurrentUser = (req, res, next) => {
//   const userId = req.user._id;
//   User.findById(userId)
//     .then((user) => {
//       if (!user) {
//         throw new ErrorNotFound('Нет пользователя с таким id');
//       } else {
//         res.send({ user });
//       }
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

// const updateUser = (req, res, next) => {
//   const userId = req.user._id;
//   const { name, email } = req.body;
//   User.findByIdAndUpdate(
//     // почитать про метод у монгуса
//     userId,
//     { name, email },
//     optionForUpdateUser,
//   )
//     .then((user) => {
//       if (!user) {
//         throw new ErrorNotFound('Нет пользователя с таким id');
//       } else {
//         res.send(user);
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new ErrorBadRequest('Введены некорректные данные'));
//       }
//       if (err.code === 11000) {
//         next(
//           new ErrorBadUnique('Пользователь с таким email уже зарегестрирован'),
//         );
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports = { createUser, getCurrentUser, updateUser };
