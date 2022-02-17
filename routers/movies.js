const express = require('express');
const {
  getMovies,
  createMovies,
  deleteMovies,
} = require('../controllers/movies');

const {
  validationDeleteMovie,
  validationCreateMovie,
} = require('../utils/validations');

const router = express.Router();
router.get('/movies', getMovies);
router.post('/movies', validationCreateMovie, createMovies);
router.delete('/movies/_id', validationDeleteMovie, deleteMovies);

module.exports = router;
