const router = require("express").Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");
const {
  addMovieValidator,
  deleteMovieValidator,
} = require("../utils/validator");

router.get("/movies", getMovies);

router.post("/movies", addMovieValidator, createMovie);

router.delete("/movies/:movieId", deleteMovieValidator, deleteMovie);

module.exports = router;

// const express = require('express');
// const {
//   getMovies,
//   createMovies,
//   deleteMovies,
// } = require('../controllers/movies');

// const {
//   validationDeleteMovie,
//   validationCreateMovie,
// } = require('../utils/validations');

// const router = express.Router();
// router.get('/movies', getMovies);
// router.post('/movies', validationCreateMovie, createMovies);
// router.delete('/movies/:id', validationDeleteMovie, deleteMovies);

// module.exports = router;
