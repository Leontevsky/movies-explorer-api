const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorForBidden = require('../errors/Forbidden');

const checkLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password') // почитать +password
    .then((user) => {
      if (!user) {
        throw new ErrorForBidden('Авторизация не прошла, email не найден');
      }
      bcrypt
        .compare(password, user.password) // сравниваю пароль пользователя с бд и новый
        .then((passresult) => {
          if (!passresult) {
            throw new ErrorForBidden(
              'Авторизация не прошла, неправильный пароль',
            );
          }
          const { NODE_ENV, JWT_SECRET } = process.env; //
          const token = jwt.sign(
            // прочитать метод
            { _id: user._id }, // передаем айдишник в создание токена, что бы он был уникален
            NODE_ENV === 'production' ? JWT_SECRET : 'strongest-key-dev', // почитать отдельно
            { expiresIn: '7d' },
          );
          res.send({ token });
        })
        .catch((err) => {
          if (err.statusCode === 401) {
            next(
              new ErrorForBidden(
                'Авторизация не прошла, неправильная почта или пароль',
              ),
            );
          }
        });
    })
    .catch(() => {
      next(
        new ErrorForBidden(
          'Авторизация не прошла, неправильная почта или пароль',
        ),
      );
    });
};

module.exports = checkLogin;
