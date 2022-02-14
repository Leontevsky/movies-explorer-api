const validator = require("validator");
const { celebrate, Joi } = require("celebrate");
const ErrorBadRequest = require("../errors/BadRequest");

const validationUrl = (url) => {
  const checkUrl = validator.isURL(url);
  if (!checkUrl) {
    throw new ErrorBadRequest("Неправильный Url");
  }
  return url;
};

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validationLoginIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationUrl),
    trailer: Joi.string().required().custom(validationUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validationUrl),
    movieId: Joi.number().required(),
  }),
});

const validationDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex, // почитать hex
  }),
});

module.exports = {
  validationDeleteMovie,
  validationCreateMovie,
  validationUpdateUser,
  validationLoginIn,
  validationCreateUser,
};
