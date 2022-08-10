/* eslint-disable import/no-unresolved */
const jwt = require('jsonwebtoken');
const LoginDataError = require('../errors/login-data-error');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new LoginDataError('Необходима авторизация!');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new LoginDataError('Необходима авторизация!');
  }
  req.user = payload;
  next();
  return null;
};
