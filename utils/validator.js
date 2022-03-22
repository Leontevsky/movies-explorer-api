const validator = require("validator");
const { celebrate, Joi } = require("celebrate");
const BadRequestError = require("../errors/bad-request-error");

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});
const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

const signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const urlCheckMethod = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new BadRequestError("Введённый URL некорректный");
};
const addMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlCheckMethod),
    trailer: Joi.string().required().custom(urlCheckMethod),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(urlCheckMethod),
    movieId: Joi.number().required(),
  }),
});
module.exports = {
  deleteMovieValidator,
  updateUserValidator,
  signupValidator,
  signinValidator,
  addMovieValidator,
};

// const validator = require("validator");
// const { celebrate, Joi } = require("celebrate");
// const ErrorBadRequest = require("../errors2/BadRequest");

// const validationUrl = (url) => {
//   const checkUrl = validator.isURL(url);
//   if (!checkUrl) {
//     throw new ErrorBadRequest("Неправильный Url");
//   }
//   return url;
// };

// const validationCreateUser = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   }),
// });

// const validationLoginIn = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   }),
// });

// const validationUpdateUser = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     email: Joi.string().email().required(),
//   }),
// });

// const validationCreateMovie = celebrate({
//   body: Joi.object().keys({
//     country: Joi.string().required(),
//     director: Joi.string().required(),
//     duration: Joi.number().required(),
//     year: Joi.string().required(),
//     description: Joi.string().required(),
//     image: Joi.string().required().custom(validationUrl),
//     trailer: Joi.string().required().custom(validationUrl),
//     nameRU: Joi.string().required(),
//     nameEN: Joi.string().required(),
//     thumbnail: Joi.string().required().custom(validationUrl),
//     movieId: Joi.number().required(),
//   }),
// });

// const validationDeleteMovie = celebrate({
//   params: Joi.object().keys({
//     movieId: Joi.string().length(24).hex(), // почитать hex
//   }),
// });

// module.exports = {
//   validationDeleteMovie,
//   validationCreateMovie,
//   validationUpdateUser,
//   validationLoginIn,
//   validationCreateUser,
// };
