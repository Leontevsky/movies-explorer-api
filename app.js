const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./utils/limiter');

const auth = require('./middlewares/auth');
const corseDefend = require('./middlewares/corse-defend');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const userRouter = require('./routers/users');
const movieRouter = require('./routers/movies');
const authRouter = require('./routers/auth');

const ErrorNotFound = require('./errors/NotFound');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();
mongoose.connect(MONGO_URL);

app.use(requestLogger);

app.use(limiter);
app.use(express.json());
app.use(corseDefend);
app.use(helmet());
app.use(authRouter);
app.use(auth);
app.use(userRouter);
app.use(movieRouter);
app.use((req, res, next) => {
  next(new ErrorNotFound('Роутер не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Server started');
});

// const crypto = require('crypto'); // экспортируем crypto

// const randomString = crypto
//   .randomBytes(16) // сгенерируем случайную последовательность 16 байт (128 бит)
//   .toString('hex'); // приведём её к строке

// console.log(randomString);
