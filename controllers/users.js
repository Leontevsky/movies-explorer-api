const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorNotFound = require('../errors/NotFound');
const ErrorBadRequest = require('../errors/BadRequest');
const ErrorBadUnique = require('../errors/BadUnique');

const optionForUpdateUser = { new: true, runValidators: true };

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10) // почитать
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((currentUser) => res.status(200).send({
      name: currentUser.name,
      email: currentUser.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorBadUnique('Такая почта уже зарегистрированна!')); // read about next
      }
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Нет пользователя с таким id');
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      next(err);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    // почитать про метод у монгуса
    userId,
    { name, email },
    optionForUpdateUser,
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Нет пользователя с таким id');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Введены некорректные данные'));
      }
      if (err.code === 11000) {
        next(
          new ErrorBadUnique('Пользователь с таким email уже зарегестрирован'),
        );
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, updateUser };
