const jwt = require('jsonwebtoken');
const ErrorForbidden = require('../errors/Forbidden');

module.exports = (req, res, next) => {
  try {
    const { JWT_SECRET = 'strongest-key-dev' } = process.env;
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new ErrorForbidden('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET); // расшифровка токена + код
    } catch (err) {
      const Error = new ErrorForbidden('Необходима авторизация');
      next(Error);
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
