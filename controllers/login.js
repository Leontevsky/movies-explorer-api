const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UnauthorizedError = require("../errors/unauthorized-error");

const ERROR_CODE_UNAUTHORIZED = 401;

const checkLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Неправильные почта или пароль");
      }
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError("Неправильные почта или пароль");
          }
          const { NODE_ENV, JWT_SECRET } = process.env;
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === "production" ? JWT_SECRET : "strongest-key-ever",
            { expiresIn: "7d" }
          );
          res.status(200).send({ token });
        })
        .catch((err) => {
          if (err.statusCode === ERROR_CODE_UNAUTHORIZED) {
            next(new UnauthorizedError("Неправильные почта или пароль"));
          }
          next(err);
        });
    })
    .catch(() => {
      next(new UnauthorizedError("Неправильные почта или пароль"));
    });
};

module.exports = checkLogin;

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const ErrorBadAuth = require('../errors/BadAuth');

// const checkLogin = (req, res, next) => {
//   const { email, password } = req.body;
//   User.findOne({ email })
//     .select('+password') // почитать +password
//     .then((user) => {
//       if (!user) {
//         throw new ErrorBadAuth('Авторизация не прошла, email не найден');
//       }
//       bcrypt
//         .compare(password, user.password) // сравниваю пароль пользователя с бд и новый
//         .then((passresult) => {
//           if (!passresult) {
//             throw new ErrorBadAuth(
//               'Авторизация не прошла, неправильный пароль',
//             );
//           }
//           const { NODE_ENV, JWT_SECRET } = process.env; //
//           const token = jwt.sign(
//             // прочитать метод
//             { _id: user._id }, // передаем айдишник в создание токена, что бы он был уникален
//             NODE_ENV === 'production' ? JWT_SECRET : 'strongest-key-dev', // почитать отдельно
//             { expiresIn: '7d' },
//           );
//           res.send({ token });
//         })
//         .catch((err) => {
//           if (err.statusCode === ErrorBadAuth) {
//             next(
//               new ErrorBadAuth(
//                 'Авторизация не прошла, неправильная почта или пароль',
//               ),
//             );
//           }
//         });
//     })
//     .catch(() => {
//       next(
//         new ErrorBadAuth(
//           'Авторизация не прошла, неправильная почта или пароль',
//         ),
//       );
//     });
// };

// module.exports = checkLogin;
