/* eslint-disable import/no-unresolved */
const jwt = require('jsonwebtoken');
const LoginDataError = require('../errors/login-data-error');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    throw new LoginDataError('Необходима авторизация');
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new LoginDataError('Необходима авторизация');
  }
  req.user = payload;
  next();
  return null;
};
